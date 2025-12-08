// app/api/clinicas/route.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Rota: GET /api/clinicas
// Objetivo: Listar todas as clínicas ativas para o paciente escolher.
export async function GET() {
  try {
    const clinicas = await prisma.clinica.findMany({
      where: {
        status: 'ativo' // Só lista clínicas que estão ativas na plataforma
      },
      select: { // Seleciona apenas os campos públicos necessários
        id: true,
        nome: true,
        endereco: true,
        logo_url: true,
        tipo: true,
      },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(clinicas, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar clínicas:', error);
    return NextResponse.json({ message: 'Erro interno ao buscar clínicas.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}