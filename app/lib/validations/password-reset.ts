import { z } from "zod";

import { passwordSchema } from "@/app/lib/validations/password";

export const passwordResetSchema = z.object({
  email: z.email(),
});

export const passwordResetUpdateSchema = z
  .object({
    email: z.email(),
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "パスワードが一致しません",
    path: ["passwordConfirmation"],
  });
