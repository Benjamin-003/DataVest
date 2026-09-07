/*
  Warnings:

  - Added the required column `treeContent` to the `Conversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversion" ADD COLUMN     "treeContent" TEXT NOT NULL;
