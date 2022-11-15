-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "summary" TEXT,
    "publisher" TEXT NOT NULL,
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "readPage" INTEGER NOT NULL DEFAULT 0,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "reading" BOOLEAN NOT NULL DEFAULT false,
    "insertedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
