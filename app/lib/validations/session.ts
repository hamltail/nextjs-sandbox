import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .max(255, "メールアドレスは255文字以内で入力してください")
    .pipe(
      z.email({
        error: "メールアドレスの形式が正しくありません",
      }),
    ),

  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .max(72, "パスワードは72文字以内で入力してください"),
});
