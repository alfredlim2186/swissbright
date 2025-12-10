-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN "courierName" TEXT;
ALTER TABLE "Redemption" ADD COLUMN "shippedAt" TIMESTAMP;
ALTER TABLE "Redemption" ADD COLUMN "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "addressLine1" TEXT;
ALTER TABLE "User" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "country" TEXT;
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "User" ADD COLUMN "profileUpdatedAt" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "state" TEXT;
