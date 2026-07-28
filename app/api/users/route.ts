import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  const users = await prisma.user.findMany();

  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return Response.json(user, {
    status: 201,
  });
}
