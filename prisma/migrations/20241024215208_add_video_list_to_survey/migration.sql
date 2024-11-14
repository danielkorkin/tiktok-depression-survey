/*
  Warnings:

  - You are about to drop the column `tiktokData` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `videoList` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "tiktokData",
ADD COLUMN     "videoList" JSONB NOT NULL;
