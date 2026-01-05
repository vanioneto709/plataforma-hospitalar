import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password }: LoginRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { clinica: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const senhaOk = await bcrypt.compare(password, usuario.password_hash);

    if (!senhaOk) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso.",
        user: {
          id: usuario.id,
          email: usuario.email,
          role: usuario.role,
          clinicaId: usuario.clinicaId,
        },
      },
      { status: 200 }
    );

    response.cookies.set("session", usuario.id.toString(), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no login." },
      { status: 500 }
    );
  }
}

