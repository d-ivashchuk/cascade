/*
  Warnings:

  - You are about to drop the column `credits` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan"
RENAME COLUMN "credits" TO "buttonClicks";
