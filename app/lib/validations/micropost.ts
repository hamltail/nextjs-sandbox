import { z } from "zod";

export const micropostSchema = z.object({
  content: z
    .string()
    .min(1, "投稿内容を入力してください")
    .max(140, "投稿内容は140文字以内で入力してください"),
});
