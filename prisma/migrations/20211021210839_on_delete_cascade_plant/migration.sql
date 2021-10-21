-- DropForeignKey
ALTER TABLE "TankPlant" DROP CONSTRAINT "TankPlant_plantId_fkey";

-- DropForeignKey
ALTER TABLE "TankPlant" DROP CONSTRAINT "TankPlant_tankId_fkey";

-- AddForeignKey
ALTER TABLE "TankPlant" ADD CONSTRAINT "TankPlant_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TankPlant" ADD CONSTRAINT "TankPlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
