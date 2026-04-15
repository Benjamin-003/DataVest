/*
  Warnings:

  - You are about to drop the `Conversion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversion" DROP CONSTRAINT "Conversion_userId_fkey";

-- DropTable
DROP TABLE "Conversion";
