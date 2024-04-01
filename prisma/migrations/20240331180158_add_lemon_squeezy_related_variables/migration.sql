-- CreateTable
CREATE TABLE "LemonSqueezyWebhookEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventName" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "body" JSONB NOT NULL,
    "processingError" TEXT,

    CONSTRAINT "LemonSqueezyWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LemonSqueezySubscription" (
    "id" SERIAL NOT NULL,
    "lemonSqueezyId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusFormatted" TEXT NOT NULL,
    "renewsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "price" TEXT NOT NULL,
    "isUsageBased" BOOLEAN NOT NULL DEFAULT false,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionItemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "LemonSqueezySubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LemonSqueezySubscription_lemonSqueezyId_key" ON "LemonSqueezySubscription"("lemonSqueezyId");

-- AddForeignKey
ALTER TABLE "LemonSqueezySubscription" ADD CONSTRAINT "LemonSqueezySubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
