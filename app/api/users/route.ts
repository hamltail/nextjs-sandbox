import { accountActivationMailer } from "@/lib/mailer/account-activation-provider";
import { createToken, hashToken } from "@/lib/auth/token";
import { Prisma } from "@/app/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/database/prisma";
import { createUserSchema } from "@/lib/users/validation";

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

    const passwordDigest = await hashPassword(password);

    const activationToken = createToken();
    const activationDigest = hashToken(activationToken);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordDigest,
        activationDigest,
      },
    });

    await accountActivationMailer({
      name: user.name,
      email: user.email,
      activationToken,
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
