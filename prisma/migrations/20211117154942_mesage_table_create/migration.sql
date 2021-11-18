/*
  Warnings:

  - A unique constraint covering the columns `[pnToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pnToken" DROP NOT NULL,
ALTER COLUMN "pnToken" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "expoId" TEXT,
    "title" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "toProfileId" INTEGER,
    "fromProfileId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_pnToken_key" ON "User"("pnToken");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toProfileId_fkey" FOREIGN KEY ("toProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromProfileId_fkey" FOREIGN KEY ("fromProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
