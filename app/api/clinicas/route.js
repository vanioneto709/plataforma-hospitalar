import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Rota: GET /api/clinicas
export async function GET() {
  try {
    const clinicas = await prisma.clinica.findMany({
      where: { status: 'ativo' },
      select: { id: true, nome: true, endereco: true, logo_url: true, tipo: true },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(clinicas, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar clínicas:', error);
    return NextResponse.json({ message: 'Erro interno ao buscar clínicas.' }, { status: 500 });
  }
}

// Rota: POST /api/clinicas
export async function POST(req) {
  try {
    const { nomeClinica, endereco, telefone, email, senha } = await req.json();

    // Validação básica
    if (!nomeClinica || !endereco || !telefone || !email || !senha) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Email inválido.' }, { status: 400 });
    }

    // Checar se usuário já existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Este email já está cadastrado.' }, { status: 409 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criação da clínica + usuário responsável
    const clinica = await prisma.clinica.create({
      data: {
        nome: nomeClinica,
        endereco,
        telefone,
        status: 'ativo',
        usuarios: {
          create: {
            email,
            senha: hashedPassword,
            papel: 'responsavel',
          },
        },
      },
      include: { usuarios: true },
    });

    // Retorno seguro
    return NextResponse.json({
      message: 'Clínica cadastrada com sucesso',
      clinica: {
        id: clinica.id,
        nome: clinica.nome,
        endereco: clinica.endereco,
        telefone: clinica.telefone,
        usuarios: clinica.usuarios.map(u => ({ id: u.id, email: u.email, papel: u.papel })),
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar clínica:', error);
    return NextResponse.json({ message: 'Erro interno ao cadastrar clínica.' }, { status: 500 });
  }
}
