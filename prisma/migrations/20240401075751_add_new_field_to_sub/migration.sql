/*
  Warnings:

  - You are about to drop the column `planId` on the `LemonSqueezySubscription` table. All the data in the column will be lost.
  - You are about to drop the column `statusFormatted` on the `LemonSqueezySubscription` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `LemonSqueezySubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LemonSqueezySubscription" DROP COLUMN "planId",
DROP COLUMN "statusFormatted",
ADD COLUMN     "customerId" TEXT NOT NULL;
