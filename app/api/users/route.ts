import bcrypt from "bcryptjs";

import { createActivationToken, hashActivationToken } from "@/app/lib/account-activation";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";
import { createUserSchema } from "@/app/lib/validations/user";

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

  try {
    const { name, email, password } = result.data;

    const passwordDigest = await bcrypt.hash(password, 10);

    const activationToken = createActivationToken();
    const activationDigest = hashActivationToken(activationToken);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordDigest,
        activationDigest,
      },
    });

    return Response.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        {
          errors: [
            {
              path: ["email"],
              message: "このメールアドレスはすでに使用されています",
            },
          ],
        },
        {
          status: 409,
        },
      );
    }

    throw error;
  }
}
