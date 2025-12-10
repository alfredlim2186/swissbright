-- RedefineTables
CREATE TABLE "new_Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_Gift" ("createdAt", "description", "id", "imageUrl", "isActive", "name", "sortOrder", "updatedAt") SELECT "createdAt", "description", "id", "imageUrl", "isActive", "name", "sortOrder", "updatedAt" FROM "Gift";
ALTER TABLE "Redemption" DROP CONSTRAINT IF EXISTS "Redemption_giftId_fkey";
DROP TABLE "Gift" CASCADE;
ALTER TABLE "new_Gift" RENAME TO "Gift";
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Gift_isActive_idx" ON "Gift"("isActive");
CREATE INDEX "Gift_sortOrder_idx" ON "Gift"("sortOrder");
