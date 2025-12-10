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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_PromoCode" ("code", "createdAt", "description", "discountType", "discountValue", "endAt", "id", "isActive", "startAt", "timezone", "updatedAt", "usageCount") SELECT "code", "createdAt", "description", "discountType", "discountValue", "endAt", "id", "isActive", "startAt", "timezone", "updatedAt", "usageCount" FROM "PromoCode";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_promoCodeId_fkey";
DROP TABLE "PromoCode" CASCADE;
ALTER TABLE "new_PromoCode" RENAME TO "PromoCode";
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");
CREATE INDEX "PromoCode_code_idx" ON "PromoCode"("code");
CREATE INDEX "PromoCode_startAt_idx" ON "PromoCode"("startAt");
CREATE INDEX "PromoCode_endAt_idx" ON "PromoCode"("endAt");
