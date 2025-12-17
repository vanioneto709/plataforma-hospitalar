import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@ssorrisos.com';

  const existe = await prisma.superAdmin.findUnique({
    where: { email },
  });

  if (existe) {
    console.log('✅ Super Admin já existe');
    return;
  }

  const passwordHash = await bcrypt.hash('AdminSenha123', 10);

  await prisma.superAdmin.create({
    data: {
      nome: 'Super Admin',
      email,
      password: passwordHash,
    },
  });

  console.log('🚀 Super Admin criado com sucesso!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
