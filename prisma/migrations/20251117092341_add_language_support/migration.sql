-- RedefineTables
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "page" TEXT,
    "section" TEXT,
    "label" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_Content" ("createdAt", "description", "id", "key", "label", "page", "section", "type", "updatedAt", "value") SELECT "createdAt", "description", "id", "key", "label", "page", "section", "type", "updatedAt", "value" FROM "Content";
DROP TABLE "Content" CASCADE;
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE INDEX "Content_page_idx" ON "Content"("page");
CREATE INDEX "Content_section_idx" ON "Content"("section");
CREATE INDEX "Content_key_idx" ON "Content"("key");
CREATE INDEX "Content_language_idx" ON "Content"("language");
CREATE UNIQUE INDEX "Content_key_language_key" ON "Content"("key", "language");
