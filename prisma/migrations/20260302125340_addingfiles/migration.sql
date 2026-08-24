/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `archive` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "archive" DROP COLUMN "imageUrl",
ADD COLUMN     "URL" TEXT,
ADD COLUMN     "fileData" BYTEA,
ADD COLUMN     "fileMimeType" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER;
