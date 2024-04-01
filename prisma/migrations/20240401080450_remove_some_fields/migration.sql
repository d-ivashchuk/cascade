/*
  Warnings:

  - You are about to drop the column `price` on the `LemonSqueezySubscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionItemId` on the `LemonSqueezySubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LemonSqueezySubscription" DROP COLUMN "price",
DROP COLUMN "subscriptionItemId";
