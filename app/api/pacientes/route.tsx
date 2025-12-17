import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { nome, email, senha, telefone, data_nascimento, genero } = await req.json();

    // Validação básica
    if (!nome || !email || !senha || !telefone) {
      return NextResponse.json({ message: 'Nome, email, senha e telefone são obrigatórios.' }, { status: 400 });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Email inválido.' }, { status: 400 });
    }

    // Checar duplicidade
    const existingUser = await prisma.paciente.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Este email já está cadastrado.' }, { status: 409 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar paciente
    const paciente = await prisma.paciente.create({
      data: {
        nome,
        email,
        senha_hash: hashedPassword,
        telefone,
        data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
        genero,
      },
    });

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso!',
      paciente: { id: paciente.id, nome: paciente.nome, email: paciente.email },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    return NextResponse.json({ message: 'Erro interno ao cadastrar paciente.' }, { status: 500 });
  }
}
