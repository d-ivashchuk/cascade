import crypto from "node:crypto";
import { env } from "~/env.mjs";

import { webhookHasMeta } from "./utils";
import { db } from "../../../../server/db";
import {
  type LemonsqueezySubscriptionAttributes,
  type LemonsqueezyWebhookPayload,
} from "~/types/lemonsqueezy";
import { isTriggerEnabled } from "~/lib/trigger";
import { slackNewChurnNotification, slackNewPaymentNotification } from "~/jobs";

export async function POST(request: Request) {
  if (!env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
    return new Response("Lemon Squeezy Webhook Secret not set in .env", {
      status: 500,
    });
  }

  // First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text();
  const secret = env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") ?? "",
    "utf8",
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    return new Response("Invalid signature", { status: 400 });
  }

  const data = JSON.parse(rawBody) as LemonsqueezyWebhookPayload;

  // Type guard to check if the object has a 'meta' property.
  if (webhookHasMeta(data)) {
    const createdWebhook = await db.lemonSqueezyWebhookEvent.create({
      data: {
        eventName: data.meta.event_name,
        processed: false,
        body: JSON.stringify(data),
      },
    });
    const lemonSqueezySubscriptionId = data.data.id;
    const subscriptionData = data.data
      .attributes as LemonsqueezySubscriptionAttributes;
    const userIdInDatabase = data.meta.custom_data.user_id_in_database;
    const event = data.meta.event_name;

    const existingSubscription = await db.lemonSqueezySubscription.findFirst({
      where: { lemonSqueezyId: lemonSqueezySubscriptionId },
    });

    if (isTriggerEnabled) {
      if (event === "subscription_created") {
        await slackNewPaymentNotification.invoke({
          user: {
            email: subscriptionData.user_email,
            id: userIdInDatabase,
          },
          productName: subscriptionData.product_name,
        });
      }
      if (
        event === "subscription_cancelled" ||
        (event === "subscription_updated" &&
          subscriptionData.status === "cancelled")
      ) {
        await slackNewChurnNotification.invoke({
          user: {
            email: subscriptionData.user_email,
            id: userIdInDatabase,
          },
          productName: subscriptionData.product_name,
        });
      }
    }

    switch (event) {
      case "subscription_created":
      case "subscription_updated":
        await db.lemonSqueezySubscription.upsert({
          where: { lemonSqueezyId: lemonSqueezySubscriptionId },
          update: {
            status: subscriptionData.status,
            renewsAt: subscriptionData.renews_at
              ? new Date(subscriptionData.renews_at)
              : null,
            endsAt:
              subscriptionData.status === "cancelled"
                ? new Date(existingSubscription?.renewsAt ?? new Date())
                : subscriptionData.ends_at ?? null,
            trialEndsAt: subscriptionData.trial_ends_at
              ? new Date(subscriptionData.trial_ends_at)
              : null,
            userId: userIdInDatabase,
            customerId: String(subscriptionData.customer_id),
            variantId: String(subscriptionData.variant_id),
          },
          create: {
            lemonSqueezyId: lemonSqueezySubscriptionId,
            customerId: String(subscriptionData.customer_id),
            orderId: subscriptionData.order_id,
            name: subscriptionData.product_name,
            email: subscriptionData.user_email,
            status: subscriptionData.status,
            renewsAt: subscriptionData.renews_at
              ? new Date(subscriptionData.renews_at)
              : null,
            endsAt: subscriptionData.ends_at
              ? new Date(subscriptionData.ends_at)
              : null,
            trialEndsAt: subscriptionData.trial_ends_at
              ? new Date(subscriptionData.trial_ends_at)
              : null,
            variantId: String(subscriptionData.variant_id),
            customerPortalUrl: subscriptionData.urls.customer_portal,
            updatePaymentMethodUrl: subscriptionData.urls.update_payment_method,
            customerPortalUpdateSubscriptionUrl:
              subscriptionData.urls.customer_portal_update_subscription,
            user: {
              connect: { id: userIdInDatabase },
            },
          },
        });
        await db.lemonSqueezyWebhookEvent.update({
          where: { id: createdWebhook.id },
          data: { processed: true },
        });
        if (subscriptionData.status !== "cancelled") {
          const planInDbCorrespondingToSubscription = await db.plan.findFirst({
            where: {
              lemonSqueezyVariantId: String(subscriptionData.variant_id),
            },
          });
          await db.user.update({
            where: { id: userIdInDatabase },
            data: {
              planId: planInDbCorrespondingToSubscription?.id,
            },
          });
        } else {
          await db.user.update({
            where: { id: userIdInDatabase },
            data: {
              planId: null,
            },
          });
        }

        break;
      case "subscription_cancelled":
        await db.lemonSqueezySubscription.update({
          where: { lemonSqueezyId: lemonSqueezySubscriptionId },
          data: {
            status: "cancelled",
            endsAt: new Date(existingSubscription?.renewsAt ?? new Date()),
          },
          // Update with actual cancellation logic
        });
        await db.lemonSqueezyWebhookEvent.update({
          where: { id: createdWebhook.id },
          data: { processed: true },
        });
        await db.user.update({
          where: { id: userIdInDatabase },
          data: {
            planId: null,
          },
        });
        break;
      default:
        throw new Error(`Unhandled event: ${event}`);
    }

    return new Response("OK", { status: 200 });
  }

  return new Response("Data invalid", { status: 400 });
}
