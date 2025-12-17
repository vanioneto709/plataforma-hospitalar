import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// senha segura: mínimo 8, 1 letra e 1 número
const senhaValida = (senha) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(senha);
};

// =======================
// GET /api/clinicas
// =======================
export async function GET() {
  try {
    const clinicas = await prisma.clinica.findMany({
      where: { status: true },
      select: {
        id: true,
        nome: true,
        endereco: true,
        logo_url: true,
      },
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(clinicas);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno ao buscar clínicas." },
      { status: 500 }
    );
  }
}

// =======================
// POST /api/clinicas
// =======================
export async function POST(req) {
  try {
    const data = await req.formData();

    const nomeClinica = data.get("nomeClinica");
    const endereco = data.get("endereco");
    const telefone = data.get("telefone");
    const email = data.get("email");
    const senha = data.get("senha");
    const nif = data.get("nif");
    const localidade = data.get("localidade");
    const logo = data.get("logo"); // File | null

    // Validação básica
    const obrigatorios = {
      nomeClinica,
      endereco,
      email,
      senha,
      nif,
      localidade,
    };

    for (const [campo, valor] of Object.entries(obrigatorios)) {
      if (!valor) {
        return NextResponse.json(
          { message: `O campo "${campo}" é obrigatório.` },
          { status: 400 }
        );
      }
    }

    // Validação de senha
    if (!senhaValida(senha)) {
      return NextResponse.json(
        {
          message:
            "Senha fraca: mínimo 8 caracteres, com letras e números.",
        },
        { status: 400 }
      );
    }

    // Duplicações
    if (await prisma.clinica.findUnique({ where: { nome: nomeClinica } })) {
      return NextResponse.json(
        { message: "Já existe uma clínica com este nome." },
        { status: 409 }
      );
    }

    if (await prisma.clinica.findUnique({ where: { nif } })) {
      return NextResponse.json(
        { message: "Já existe uma clínica com este NIF." },
        { status: 409 }
      );
    }

    if (await prisma.usuario.findUnique({ where: { email } })) {
      return NextResponse.json(
        { message: "Já existe um usuário com este email." },
        { status: 409 }
      );
    }

    // Upload da logo (se existir)
    let logoUrl = null;

    if (logo && typeof logo === "object") {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${logo.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );

      await writeFile(uploadPath, buffer);
      logoUrl = `/uploads/${fileName}`;
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(senha, 10);

    // Criação da clínica + usuário
    const clinica = await prisma.clinica.create({
      data: {
        nome: nomeClinica,
        endereco,
        telefone,
        nif,
        localidade,
        status: true,
        logo_url: logoUrl,
        usuarios: {
          create: {
            email,
            password_hash: passwordHash,
            nome: email.split("@")[0],
            role: "responsavel",
          },
        },
      },
      include: { usuarios: true },
    });

    return NextResponse.json(
      {
        message: `Clínica "${clinica.nome}" cadastrada com sucesso!`,
        clinica,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno ao cadastrar clínica." },
      { status: 500 }
    );
  }
}
