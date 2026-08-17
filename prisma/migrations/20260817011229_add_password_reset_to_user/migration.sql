-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetDigest" TEXT,
ADD COLUMN     "resetSentAt" TIMESTAMP(3);
