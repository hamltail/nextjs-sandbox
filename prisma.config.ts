import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.local";

config({ path: envFile });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 本番ではDIRECT_URL、ローカルではDATABASE_URLを使用
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
