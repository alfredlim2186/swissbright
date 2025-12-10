-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "page" TEXT,
    "section" TEXT,
    "label" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_key_key" ON "Content"("key");

-- CreateIndex
CREATE INDEX "Content_page_idx" ON "Content"("page");

-- CreateIndex
CREATE INDEX "Content_section_idx" ON "Content"("section");

-- CreateIndex
CREATE INDEX "Content_key_idx" ON "Content"("key");
