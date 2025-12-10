-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeHash" TEXT NOT NULL,
    "securityHash" TEXT NOT NULL,
    "codeLast4" TEXT NOT NULL,
    "securityLast4" TEXT NOT NULL,
    "batch" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
CREATE TABLE "new_Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codeLast4" TEXT NOT NULL,
    "batch" TEXT,
    "productId" TEXT,
    "verifierName" TEXT,
    "rawPayload" TEXT,
    "verifiedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationCodeId" TEXT,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchase_verificationCodeId_fkey" FOREIGN KEY ("verificationCodeId") REFERENCES "VerificationCode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("batch", "codeHash", "codeLast4", "id", "productId", "rawPayload", "userId", "verifiedAt", "verifierName") SELECT "batch", "codeHash", "codeLast4", "id", "productId", "rawPayload", "userId", "verifiedAt", "verifierName" FROM "Purchase";
DROP TABLE "Purchase" CASCADE;
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
CREATE UNIQUE INDEX "Purchase_codeHash_key" ON "Purchase"("codeHash");
CREATE UNIQUE INDEX "Purchase_verificationCodeId_key" ON "Purchase"("verificationCodeId");
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");
CREATE INDEX "Purchase_codeHash_idx" ON "Purchase"("codeHash");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_codeHash_key" ON "VerificationCode"("codeHash");

-- CreateIndex
CREATE INDEX "VerificationCode_batch_idx" ON "VerificationCode"("batch");

-- CreateIndex
CREATE INDEX "VerificationCode_createdAt_idx" ON "VerificationCode"("createdAt");
