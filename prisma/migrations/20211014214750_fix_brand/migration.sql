/*
  Warnings:

  - Changed the type of `website` on the `Brand` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "website",
ADD COLUMN     "website" TEXT NOT NULL;
