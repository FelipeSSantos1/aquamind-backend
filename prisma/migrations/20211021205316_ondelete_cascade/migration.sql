-- DropForeignKey
ALTER TABLE "TankFertilizer" DROP CONSTRAINT "TankFertilizer_fertilizerId_fkey";

-- DropForeignKey
ALTER TABLE "TankFertilizer" DROP CONSTRAINT "TankFertilizer_tankId_fkey";

-- AddForeignKey
ALTER TABLE "TankFertilizer" ADD CONSTRAINT "TankFertilizer_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TankFertilizer" ADD CONSTRAINT "TankFertilizer_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "Fertilizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
