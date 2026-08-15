-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "activationDigest" TEXT;
