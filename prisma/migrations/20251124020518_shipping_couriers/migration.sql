-- CreateTable
CREATE TABLE "Courier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "feeCents" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- RedefineTables
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "message" TEXT,
    "courierId" TEXT,
    "courierName" TEXT,
    "trackingNumber" TEXT,
    "shippingFeeCents" INTEGER NOT NULL DEFAULT 0,
    "paymentNote" TEXT,
    "promoCodeId" TEXT,
    "promoCodeDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "promotionId" TEXT,
    "promotionDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("courierName", "createdAt", "currency", "id", "message", "paymentNote", "promoCodeDiscountCents", "promoCodeId", "promotionDiscountCents", "promotionId", "status", "totalCents", "trackingNumber", "updatedAt", "userId") SELECT "courierName", "createdAt", "currency", "id", "message", "paymentNote", "promoCodeDiscountCents", "promoCodeId", "promotionDiscountCents", "promotionId", "status", "totalCents", "trackingNumber", "updatedAt", "userId" FROM "Order";
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
DROP TABLE "Order" CASCADE;
ALTER TABLE "new_Order" RENAME TO "Order";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_promoCodeId_idx" ON "Order"("promoCodeId");
CREATE INDEX "Order_promotionId_idx" ON "Order"("promotionId");
CREATE INDEX "Order_courierId_idx" ON "Order"("courierId");

-- CreateIndex
CREATE UNIQUE INDEX "Courier_name_key" ON "Courier"("name");

-- CreateIndex
CREATE INDEX "Courier_isActive_idx" ON "Courier"("isActive");
