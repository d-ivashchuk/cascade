import crypto from "node:crypto";
import { env } from "~/env.mjs";

import { webhookHasMeta } from "./utils";
import { db } from "../../../../server/db";
import {
  type LemonsqueezyOrderAttributes,
  type LemonsqueezySubscriptionAttributes,
  type LemonsqueezyWebhookPayload,
} from "~/types/lemonsqueezy";
import { isTriggerEnabled } from "~/lib/trigger";
import { slackNewChurnNotification, slackNewPaymentNotification } from "~/jobs";
import { assertNever } from "~/lib/utils";

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
    const webhookData = data.data
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
            email: webhookData.user_email,
            id: userIdInDatabase,
          },
          productName: webhookData.product_name,
        });
      }
      if (
        event === "subscription_cancelled" ||
        (event === "subscription_updated" && webhookData.status === "cancelled")
      ) {
        await slackNewChurnNotification.invoke({
          user: {
            email: webhookData.user_email,
            id: userIdInDatabase,
          },
          productName: webhookData.product_name,
        });
      }
      if (event === "order_created") {
        await slackNewChurnNotification.invoke({
          user: {
            email: webhookData.user_email,
            id: userIdInDatabase,
          },
          productName: webhookData.product_name,
        });
      }
    }

    switch (event) {
      case "order_created":
        const orderData = data.data.attributes as LemonsqueezyOrderAttributes;
        if (orderData.status === "paid") {
          await db.oneTimePurchase.create({
            data: {
              userId: userIdInDatabase,
              email: orderData.user_email,
              name: orderData.user_name,
              customerId: String(orderData.customer_id),
              variantId: String(orderData.first_order_item.variant_id),
              orderId: orderData.first_order_item.id,
              lemonSqueezyId: data.data.id,
              status: "paid",
            },
          });
          await slackNewPaymentNotification.invoke({
            user: {
              email: orderData.user_email,
              id: userIdInDatabase,
            },
            productName: orderData.first_order_item.variant_name,
          });

          await db.lemonSqueezyWebhookEvent.update({
            where: { id: createdWebhook.id },
            data: { processed: true },
          });
        }
        break;
      case "subscription_created":
      case "subscription_updated":
        await db.lemonSqueezySubscription.upsert({
          where: { lemonSqueezyId: lemonSqueezySubscriptionId },
          update: {
            status: webhookData.status,
            renewsAt: webhookData.renews_at
              ? new Date(webhookData.renews_at)
              : null,
            endsAt:
              webhookData.status === "cancelled"
                ? new Date(existingSubscription?.renewsAt ?? new Date())
                : webhookData.ends_at ?? null,
            trialEndsAt: webhookData.trial_ends_at
              ? new Date(webhookData.trial_ends_at)
              : null,
            userId: userIdInDatabase,
            customerId: String(webhookData.customer_id),
            variantId: String(webhookData.variant_id),
          },
          create: {
            lemonSqueezyId: lemonSqueezySubscriptionId,
            customerId: String(webhookData.customer_id),
            orderId: webhookData.order_id,
            name: webhookData.product_name,
            email: webhookData.user_email,
            status: webhookData.status,
            renewsAt: webhookData.renews_at
              ? new Date(webhookData.renews_at)
              : null,
            endsAt: webhookData.ends_at ? new Date(webhookData.ends_at) : null,
            trialEndsAt: webhookData.trial_ends_at
              ? new Date(webhookData.trial_ends_at)
              : null,
            variantId: String(webhookData.variant_id),
            customerPortalUrl: webhookData.urls.customer_portal,
            updatePaymentMethodUrl: webhookData.urls.update_payment_method,
            customerPortalUpdateSubscriptionUrl:
              webhookData.urls.customer_portal_update_subscription,
            user: {
              connect: { id: userIdInDatabase },
            },
          },
        });
        await db.lemonSqueezyWebhookEvent.update({
          where: { id: createdWebhook.id },
          data: { processed: true },
        });
        if (webhookData.status !== "cancelled") {
          const planInDbCorrespondingToSubscription = await db.plan.findFirst({
            where: {
              lemonSqueezyVariantId: String(webhookData.variant_id),
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
        assertNever(event);
    }

    return new Response("OK", { status: 200 });
  }

  return new Response("Data invalid", { status: 400 });
}
