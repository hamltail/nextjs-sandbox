import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId) {
  throw new Error("R2_ACCOUNT_ID is not set");
}

if (!accessKeyId) {
  throw new Error("R2_ACCESS_KEY_ID is not set");
}

if (!secretAccessKey) {
  throw new Error("R2_SECRET_ACCESS_KEY is not set");
}

if (!bucketName) {
  throw new Error("R2_BUCKET_NAME is not set");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const imageExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const maxSize = 1 * 1024 * 1024;

export async function uploadImage(file: File) {
  if (!(file.type in imageExtensions)) {
    throw new Error("Unsupported image type");
  }

  if (file.size > maxSize) {
    throw new Error("Image must be 1MB or smaller");
  }

  const extension = imageExtensions[file.type as keyof typeof imageExtensions];

  const key = `microposts/${crypto.randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: file.type,
    }),
  );

  return key;
}
