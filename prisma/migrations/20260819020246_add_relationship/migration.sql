-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Relationship_followerId_idx" ON "Relationship"("followerId");

-- CreateIndex
CREATE INDEX "Relationship_followedId_idx" ON "Relationship"("followedId");

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_followerId_followedId_key" ON "Relationship"("followerId", "followedId");

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
