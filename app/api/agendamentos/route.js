// app/api/agendamentos/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

export async function POST(req) {
  try {
    const { pacienteId, clinicaId, servicoId, medicoId, slotStart, slotEnd } = await req.json();

    if (!pacienteId || !clinicaId || !servicoId || !medicoId || !slotStart || !slotEnd) {
      return NextResponse.json({ message: 'Parâmetros obrigatórios faltando.' }, { status: 400 });
    }

    const start = new Date(slotStart);
    const end = new Date(slotEnd);

    // Verificar conflitos (mesmo médico ou mesmo paciente no mesmo horário)
    const conflitantes = await prisma.consulta.findMany({
      where: {
        OR: [
          { medicoId, data_hora_inicio: { lte: end }, data_hora_fim: { gte: start } },
          { pacienteId, data_hora_inicio: { lte: end }, data_hora_fim: { gte: start } }
        ],
        clinicaId
      }
    });

    if (conflitantes.length > 0) {
      return NextResponse.json({ message: 'Horário já reservado. Escolha outro.' }, { status: 409 });
    }

    // Criar consulta
    const created = await prisma.consulta.create({
      data: {
        clinicaId,
        pacienteId,
        servicoId,
        medicoId,
        data_hora_inicio: start,
        data_hora_fim: end,
        status: 'PENDENTE'
      }
    });

    return NextResponse.json({ message: 'Agendamento criado com sucesso!', consulta: { id: created.id } }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ message: 'Erro interno ao criar agendamento.' }, { status: 500 });
  }
}
