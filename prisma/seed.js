import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('AdminSenha123', 10);

  await prisma.usuario.upsert({
    where: { email: 'superadmin@clinica.com' },
    update: {},
    create: {
      nome: 'Super Admin',
      email: 'Gest.admin@admin.com',
      password_hash: passwordHash,
      role: 'vanio.admin',
    },
  });

  console.log('✅ Super admin criado!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
