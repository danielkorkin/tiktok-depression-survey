/*
  Warnings:

  - The primary key for the `ConsentForm` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ConsentForm" DROP CONSTRAINT "ConsentForm_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ConsentForm_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ConsentForm_id_seq";
