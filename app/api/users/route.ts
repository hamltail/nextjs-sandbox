import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";
import { createUserSchema } from "@/app/lib/validations/user";

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

  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        errors: result.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const user = await prisma.user.create({
    data: result.data,
  });

  return Response.json(user, {
    status: 201,
  });
}
