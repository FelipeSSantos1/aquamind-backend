-- AlterTable
ALTER TABLE "File" ADD COLUMN     "stoneId" INTEGER;

-- CreateTable
CREATE TABLE "Stone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "recommendation" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stone_name_key" ON "Stone"("name");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_stoneId_fkey" FOREIGN KEY ("stoneId") REFERENCES "Stone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
