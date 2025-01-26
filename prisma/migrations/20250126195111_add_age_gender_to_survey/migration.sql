/*
  Warnings:

  - Added the required column `age` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL;
