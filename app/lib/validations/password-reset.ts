import { z } from "zod";

export const passwordResetSchema = z.object({
  email: z.email(),
});

export const passwordResetUpdateSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "パスワードが一致しません",
    path: ["passwordConfirmation"],
  });
