-- CreateTable
CREATE TABLE "OneTimePurchase" (
    "id" SERIAL NOT NULL,
    "lemonSqueezyId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OneTimePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OneTimePurchase_lemonSqueezyId_key" ON "OneTimePurchase"("lemonSqueezyId");

-- AddForeignKey
ALTER TABLE "OneTimePurchase" ADD CONSTRAINT "OneTimePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
