-- CreateTable
CREATE TABLE "Micropost" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Micropost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Micropost_userId_createdAt_idx" ON "Micropost"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Micropost" ADD CONSTRAINT "Micropost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
