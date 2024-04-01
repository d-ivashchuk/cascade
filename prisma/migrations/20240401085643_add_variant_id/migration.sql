/*
  Warnings:

  - Added the required column `variantId` to the `LemonSqueezySubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LemonSqueezySubscription" ADD COLUMN     "variantId" TEXT NOT NULL;
