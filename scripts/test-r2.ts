// Cloudflare R2へのアップロードを実際に確認するためのスクリプト
// 実行: npx tsx --env-file=.env.local scripts/test-r2.ts

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { r2 } from "../lib/integrations/r2";

async function main() {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not set");
  }

  const key = `test/${Date.now()}.txt`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: "Hello from Next.js Sandbox",
      ContentType: "text/plain",
    }),
  );

  console.log(`R2へアップロードしました: ${key}`);
}

main().catch(console.error);
