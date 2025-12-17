import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = req.headers.get('authorization');

  if (!token || token !== 'meu_token_super_admin') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  const clinicas = await prisma.clinica.findMany();
  return NextResponse.json(clinicas);
}
