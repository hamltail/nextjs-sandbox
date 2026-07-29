import { z } from "zod";
import { NextResponse } from "next/server";

import { loginSchema } from "@/app/lib/validations/session";

export async function POST(request: Request) {
  const json = await request.json();

  const result = loginSchema.safeParse(json);

  if (!result.success) {
    const errors = z.flattenError(result.error);
    
    return NextResponse.json(
      {
        errors: errors.fieldErrors,
      },
      {
        status: 422,
      },
    );
  }

  return NextResponse.json({
    message: "OK",
  });
}
