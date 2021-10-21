/*
  Warnings:

  - Changed the type of `unit` on the `Fertilizer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Fertilizer" DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TankFertilizer" ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "FertUnit";
