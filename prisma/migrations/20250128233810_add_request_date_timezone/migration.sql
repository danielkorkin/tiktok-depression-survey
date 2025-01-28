/*
  Warnings:

  - Added the required column `requestDate` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "requestDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL;
