-- DropIndex
DROP INDEX "Token_userId_idx";

-- CreateIndex
CREATE INDEX "Token_userId_type_idx" ON "Token"("userId", "type");
