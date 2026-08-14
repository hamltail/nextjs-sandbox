import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "名前を入力してください")
      .max(50, "名前は50文字以内で入力してください"),

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
      .min(8, "パスワードは8文字以上で入力してください")
      .max(72, "パスワードは72文字以内で入力してください"),

    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "パスワードが一致しません",
    path: ["passwordConfirmation"],
  });

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),

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
});
