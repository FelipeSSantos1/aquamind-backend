/*
  Warnings:

  - You are about to drop the column `distribution` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `family` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `habitat` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `hardness` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `maintenance` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `reproduction` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `sexualDimorphism` on the `Fish` table. All the data in the column will be lost.
  - You are about to drop the column `thumbAuthor` on the `Fish` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Fish_family_idx";

-- DropIndex
DROP INDEX "Fish_order_idx";

-- AlterTable
ALTER TABLE "Fish" DROP COLUMN "distribution",
DROP COLUMN "family",
DROP COLUMN "habitat",
DROP COLUMN "hardness",
DROP COLUMN "maintenance",
DROP COLUMN "order",
DROP COLUMN "reference",
DROP COLUMN "reproduction",
DROP COLUMN "sexualDimorphism",
DROP COLUMN "thumbAuthor",
ADD COLUMN     "origin" TEXT;
