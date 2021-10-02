/*
  Warnings:

  - You are about to drop the column `emailToken` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Token_emailToken_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "emailToken",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE INDEX "Token_type_idx" ON "Token"("type");
