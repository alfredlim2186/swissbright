-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Redemption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "giftId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "giftDesc" TEXT,
    "giftImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "approvedBy" TEXT,
    "courierName" TEXT,
    "trackingNumber" TEXT,
    "shippedAt" DATETIME,
    CONSTRAINT "Redemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redemption_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Redemption" ("approvedBy", "courierName", "createdAt", "giftDesc", "giftImageUrl", "id", "shippedAt", "status", "trackingNumber", "updatedAt", "userId") SELECT "approvedBy", "courierName", "createdAt", "giftDesc", "giftImageUrl", "id", "shippedAt", "status", "trackingNumber", "updatedAt", "userId" FROM "Redemption";
DROP TABLE "Redemption";
ALTER TABLE "new_Redemption" RENAME TO "Redemption";
CREATE INDEX "Redemption_userId_idx" ON "Redemption"("userId");
CREATE INDEX "Redemption_status_idx" ON "Redemption"("status");
CREATE INDEX "Redemption_giftId_idx" ON "Redemption"("giftId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Gift_isActive_idx" ON "Gift"("isActive");

-- CreateIndex
CREATE INDEX "Gift_sortOrder_idx" ON "Gift"("sortOrder");
