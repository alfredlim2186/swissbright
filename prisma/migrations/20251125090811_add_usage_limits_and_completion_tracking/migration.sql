-- AlterTable
ALTER TABLE "Order" ADD COLUMN "completedAt" TIMESTAMP;

-- RedefineTables
CREATE TABLE "new_PromoCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL DEFAULT 'FIXED',
    "discountValue" INTEGER NOT NULL,
    "minOrderCents" INTEGER NOT NULL DEFAULT 0,
    "startAt" TIMESTAMP NOT NULL,
    "endAt" TIMESTAMP NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kuala_Lumpur',
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "maxUsage" INTEGER,
    "completedUsageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_PromoCode" ("code", "createdAt", "description", "discountType", "discountValue", "endAt", "id", "isActive", "minOrderCents", "startAt", "timezone", "updatedAt", "usageCount") SELECT "code", "createdAt", "description", "discountType", "discountValue", "endAt", "id", "isActive", "minOrderCents", "startAt", "timezone", "updatedAt", "usageCount" FROM "PromoCode";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_promoCodeId_fkey";
DROP TABLE "PromoCode" CASCADE;
ALTER TABLE "new_PromoCode" RENAME TO "PromoCode";
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");
CREATE INDEX "PromoCode_code_idx" ON "PromoCode"("code");
CREATE INDEX "PromoCode_startAt_idx" ON "PromoCode"("startAt");
CREATE INDEX "PromoCode_endAt_idx" ON "PromoCode"("endAt");
CREATE TABLE "new_Promotion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP NOT NULL,
    "endAt" TIMESTAMP NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kuala_Lumpur',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "discountType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "discountValue" INTEGER NOT NULL,
    "maxUsage" INTEGER,
    "completedUsageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_Promotion" ("createdAt", "description", "discountType", "discountValue", "endAt", "id", "isActive", "name", "startAt", "timezone", "updatedAt") SELECT "createdAt", "description", "discountType", "discountValue", "endAt", "id", "isActive", "name", "startAt", "timezone", "updatedAt" FROM "Promotion";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_promotionId_fkey";
DROP TABLE "Promotion" CASCADE;
ALTER TABLE "new_Promotion" RENAME TO "Promotion";
ALTER TABLE "Order" ADD CONSTRAINT "Order_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Promotion_startAt_idx" ON "Promotion"("startAt");
CREATE INDEX "Promotion_endAt_idx" ON "Promotion"("endAt");

-- CreateIndex
CREATE INDEX "Order_completedAt_idx" ON "Order"("completedAt");
