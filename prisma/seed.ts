import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sekhain.ai";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const name = process.env.ADMIN_NAME ?? "Admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name,
    },
  });

  console.log(`Admin user ready: ${email}`);
  console.log(
    "No course content is seeded — use /admin/import to add courses via CSV.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
