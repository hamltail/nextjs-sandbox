import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .max(72, "パスワードは72文字以内で入力してください");
