-- AlterTable
ALTER TABLE "File" ADD COLUMN     "algaeId" INTEGER;

-- CreateTable
CREATE TABLE "Algae" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cause" TEXT,
    "treatment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Algae_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Algae_name_key" ON "Algae"("name");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_algaeId_fkey" FOREIGN KEY ("algaeId") REFERENCES "Algae"("id") ON DELETE SET NULL ON UPDATE CASCADE;
