-- AlterTable
ALTER TABLE "File" ADD COLUMN     "woodId" INTEGER;

-- CreateTable
CREATE TABLE "Wood" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "thumb" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wood_name_key" ON "Wood"("name");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_woodId_fkey" FOREIGN KEY ("woodId") REFERENCES "Wood"("id") ON DELETE SET NULL ON UPDATE CASCADE;
