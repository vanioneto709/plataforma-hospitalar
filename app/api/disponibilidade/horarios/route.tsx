// app/api/disponibilidade/horarios/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Helpers
function parseTimeToMinutes(t) {
  const [hh, mm] = t.split(':').map(Number);
  return hh * 60 + mm;
}
function minutesToTime(m) {
  const hh = Math.floor(m / 60).toString().padStart(2, '0');
  const mm = (m % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}
function addMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
function isoDateOnly(dateStr) {
  // expects YYYY-MM-DD
  return new Date(dateStr + 'T00:00:00');
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const clinicaId = Number(url.searchParams.get('clinicaId'));
    const servicoId = Number(url.searchParams.get('servicoId'));
    const medicoIdParam = url.searchParams.get('medicoId'); // opcional
    const date = url.searchParams.get('date'); // YYYY-MM-DD -> obrigatório
    if (!clinicaId || !servicoId || !date) {
      return NextResponse.json({ message: 'Parâmetros obrigatórios: clinicaId, servicoId, date (YYYY-MM-DD).' }, { status: 400 });
    }

    // Busca duração do serviço (em minutos)
    const servico = await prisma.servico.findUnique({ where: { id: servicoId } });
    if (!servico) return NextResponse.json({ message: 'Serviço não encontrado.' }, { status: 404 });
    const duration = servico.duracao_minutos || 30; // fallback

    // Qual dia da semana é (0-6)
    const targetDate = isoDateOnly(date);
    const diaSemana = targetDate.getUTCDay(); // 0..6

    // Busca médicos da clínica (ou filtra por medicoId se foi passado)
    const medicos = await prisma.medico.findMany({
      where: {
        usuario: { clinicaId }, // assume relação usuario -> clinicaId
        ...(medicoIdParam ? { id: Number(medicoIdParam) } : {})
      },
      include: { usuario: true }
    });

    // Para cada médico, buscar os horários recorrentes daquele dia da semana
    const horariosPorMedico = await Promise.all(medicos.map(async (m) => {
      const horarios = await prisma.medicoHorario.findMany({
        where: { medicoId: m.id, diaSemana }
      });
      return { medico: m, horarios };
    }));

    // Busca consultas já marcadas naquele dia para a clínica (para bloquear)
    const startOfDay = new Date(targetDate);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23,59,59,999);

    const consultas = await prisma.consulta.findMany({
      where: {
        clinicaId,
        data_hora_inicio: { gte: startOfDay },
        data_hora_inicio: { lte: endOfDay }
      },
      select: {
        id: true,
        medicoId: true,
        data_hora_inicio: true,
        data_hora_fim: true,
        servicoId: true
      }
    });

    // Gera slots a partir dos horarios do medico (com passo = 15min) e filtra conflitos
    const SLOT_STEP = 15; // minuto
    const results = [];

    for (const entry of horariosPorMedico) {
      const med = entry.medico;
      for (const hr of entry.horarios) {
        // hr.horaInicio e hr.horaFim ex: "08:00"
        const startMin = parseTimeToMinutes(hr.horaInicio);
        const endMin = parseTimeToMinutes(hr.horaFim);

        for (let m = startMin; m + duration <= endMin; m += SLOT_STEP) {
          const slotStart = addMinutesToDate(targetDate, m);
          const slotEnd = addMinutesToDate(slotStart, duration);

          // verificar conflitos: se existe consulta que sobreponha esse slot para MESMO medico OU PARA A CLÍNICA (evitar choque)
          const hasConflict = consultas.some(c => {
            const cStart = new Date(c.data_hora_inicio);
            const cEnd = new Date(c.data_hora_fim);
            return (slotStart < cEnd && slotEnd > cStart);
          });

          results.push({
            medicoId: med.id,
            profissional: med.usuario?.nome || null,
            time: minutesToTime(m),
            available: !hasConflict,
            slotStart: slotStart.toISOString(),
            slotEnd: slotEnd.toISOString(),
            servicoId: servicoId
          });
        }
      }
    }

    // Ordena por hora e por profissional
    results.sort((a,b) => {
      if (a.time === b.time) return a.medicoId - b.medicoId;
      return a.time.localeCompare(b.time);
    });

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('Erro disponibilidade:', error);
    return NextResponse.json({ message: 'Erro interno ao buscar disponibilidade.' }, { status: 500 });
  } finally {
    // não desconecte prisma aqui para evitar overhead em dev
  }
}
