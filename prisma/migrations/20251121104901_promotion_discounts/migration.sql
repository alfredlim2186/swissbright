/*
  Warnings:

  - Added the required column `discountValue` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "message" TEXT,
    "courierName" TEXT,
    "trackingNumber" TEXT,
    "paymentNote" TEXT,
    "promoCodeId" TEXT,
    "promoCodeDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "promotionId" TEXT,
    "promotionDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("courierName", "createdAt", "currency", "id", "message", "paymentNote", "promoCodeDiscountCents", "promoCodeId", "status", "totalCents", "trackingNumber", "updatedAt", "userId") SELECT "courierName", "createdAt", "currency", "id", "message", "paymentNote", "promoCodeDiscountCents", "promoCodeId", "status", "totalCents", "trackingNumber", "updatedAt", "userId" FROM "Order";
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
DROP TABLE "Order" CASCADE;
ALTER TABLE "new_Order" RENAME TO "Order";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_promoCodeId_idx" ON "Order"("promoCodeId");
CREATE INDEX "Order_promotionId_idx" ON "Order"("promotionId");
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
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_Promotion" ("createdAt", "description", "endAt", "id", "isActive", "name", "startAt", "timezone", "updatedAt") SELECT "createdAt", "description", "endAt", "id", "isActive", "name", "startAt", "timezone", "updatedAt" FROM "Promotion";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_promotionId_fkey";
DROP TABLE "Promotion" CASCADE;
ALTER TABLE "new_Promotion" RENAME TO "Promotion";
ALTER TABLE "Order" ADD CONSTRAINT "Order_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Promotion_startAt_idx" ON "Promotion"("startAt");
CREATE INDEX "Promotion_endAt_idx" ON "Promotion"("endAt");
