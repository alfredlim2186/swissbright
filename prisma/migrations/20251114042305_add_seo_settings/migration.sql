-- CreateTable
CREATE TABLE "SeoSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'SweetB',
    "baseUrl" TEXT NOT NULL DEFAULT 'https://sweetb.co',
    "defaultOgImage" TEXT NOT NULL DEFAULT '/og/default.jpg',
    "twitterHandle" TEXT NOT NULL DEFAULT '@sweetb',
    "updatedAt" TIMESTAMP NOT NULL
);
