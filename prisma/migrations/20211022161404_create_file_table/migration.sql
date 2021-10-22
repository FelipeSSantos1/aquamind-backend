/*
  Warnings:

  - You are about to drop the `PlantPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PHOTO');

-- DropForeignKey
ALTER TABLE "PlantPhoto" DROP CONSTRAINT "PlantPhoto_plantId_fkey";

-- DropTable
DROP TABLE "PlantPhoto";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "FileType" NOT NULL DEFAULT E'PHOTO',
    "postId" INTEGER,
    "plantId" INTEGER,
    "fertilizerId" INTEGER,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "Fertilizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
