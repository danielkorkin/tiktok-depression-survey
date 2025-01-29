/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ConsentForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConsentForm" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Survey" ALTER COLUMN "likedList" DROP NOT NULL;
