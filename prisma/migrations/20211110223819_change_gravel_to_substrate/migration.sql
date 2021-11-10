/*
  Warnings:

  - You are about to drop the column `gravel` on the `Tank` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tank" DROP COLUMN "gravel",
ADD COLUMN     "substrate" TEXT;
