-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_algaeId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_stoneId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fishId" INTEGER;

-- CreateTable
CREATE TABLE "Fish" (
    "id" SERIAL NOT NULL,
    "commonName" TEXT,
    "scientificName" TEXT,
    "description" TEXT,
    "reproduction" TEXT,
    "sexualDimorphism" TEXT,
    "diet" TEXT,
    "habitat" TEXT,
    "distribution" TEXT,
    "ph" TEXT,
    "hardness" TEXT,
    "temperature" TEXT,
    "maintenance" TEXT,
    "tankSize" TEXT,
    "size" TEXT,
    "family" TEXT,
    "order" TEXT,
    "reference" TEXT,
    "thumb" TEXT,
    "thumbAuthor" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fish_commonName_key" ON "Fish"("commonName");

-- CreateIndex
CREATE UNIQUE INDEX "Fish_scientificName_key" ON "Fish"("scientificName");

-- CreateIndex
CREATE INDEX "Fish_order_idx" ON "Fish"("order");

-- CreateIndex
CREATE INDEX "Fish_family_idx" ON "Fish"("family");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_algaeId_fkey" FOREIGN KEY ("algaeId") REFERENCES "Algae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_stoneId_fkey" FOREIGN KEY ("stoneId") REFERENCES "Stone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fishId_fkey" FOREIGN KEY ("fishId") REFERENCES "Fish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
