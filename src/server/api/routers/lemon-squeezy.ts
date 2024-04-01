import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createCheckout,
  createWebhook,
  getProduct,
  getVariant,
  lemonSqueezySetup,
  listVariants,
  listWebhooks,
} from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "~/env.mjs";

const setupLemonSqueezy = () => {
  lemonSqueezySetup({
    apiKey: env.LEMON_SQUEEZY_API_KEY,
    onError(error) {
      console.log(error);
    },
  });
};

export async function hasWebhook() {
  setupLemonSqueezy();

  if (!env.LEMON_SQUEEZY_WEBHOOK_URL) {
    throw new Error(
      "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
    );
  }

  // Check if a webhook exists on Lemon Squeezy.
  const allWebhooks = await listWebhooks({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
  });

  // Check if WEBHOOK_URL ends with a slash. If not, add it.
  const webhookUrl = env.LEMON_SQUEEZY_WEBHOOK_URL;

  const webhook = allWebhooks.data?.data.find(
    (wh) => wh.attributes.url === webhookUrl && wh.attributes.test_mode,
  );

  return webhook;
}

export const lemonSqueezyRouter = createTRPCRouter({
  getSubscriptionByUserId: protectedProcedure.query(async ({ ctx }) => {
    setupLemonSqueezy();
    const user = ctx.session?.user;

    if (!user) {
      throw new Error("User not found in session");
    }

    const subscription = await ctx.db.lemonSqueezySubscription.findFirst({
      where: { userId: user.id },
    });

    const variant = subscription?.variantId
      ? await getVariant(subscription?.variantId)
      : null;

    return { subscription, variant };
  }),
  getProductById: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        hideDefaultVariant: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      setupLemonSqueezy();
      const getProductQuery = await getProduct(input.productId);
      const getProductVariantsQuery = await listVariants({
        filter: { productId: input.productId },
      });

      const variants = getProductVariantsQuery.data?.data.filter((variant) => {
        if (input.hideDefaultVariant) {
          return variant.attributes.status !== "pending";
        }
        return true;
      });

      const product = getProductQuery.data;

      return {
        product,
        variants,
      };
    }),
  createCheckoutForVariant: publicProcedure
    .input(
      z.object({
        variantId: z.string(),
        embed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      setupLemonSqueezy();

      const user = ctx.session?.user;

      if (!env.LEMON_SQUEEZY_STORE_ID) {
        throw new Error(
          "Missing required LEMON_SQUEEZY_STORE_ID env variable. Please, set it in your .env file.",
        );
      }

      const checkout = await createCheckout(
        env.LEMON_SQUEEZY_STORE_ID,
        input.variantId,
        {
          checkoutData: {
            email: user?.email ?? "undefined",
            custom: {
              userIdInDatabase: user?.id,
            },
          },
          productOptions: {
            redirectUrl: `${env.NEXTAUTH_URL}/billing`,
          },
          checkoutOptions: {
            embed: input.embed,
          },
        },
      );

      return checkout;
    }),

  createLsWebhook: protectedProcedure.mutation(async () => {
    lemonSqueezySetup({
      apiKey: env.LEMON_SQUEEZY_API_KEY,
      onError(error) {
        console.log(error);
      },
    });
    console.log({ env });

    if (!env.LEMON_SQUEEZY_WEBHOOK_URL) {
      throw new Error(
        "Missing required LEMON_SQUEEZY_WEBHOOK_URL env variable. Please, set it in your .env file.",
      );
    }
    // Check if WEBHOOK_URL ends with a slash. If not, add it.
    const webHookUrl = env.LEMON_SQUEEZY_WEBHOOK_URL;

    // Do not set a webhook on Lemon Squeezy if it already exists.
    const webHook = await hasWebhook();

    // If the webhook does not exist, create it.
    if (!webHook) {
      await createWebhook(env.LEMON_SQUEEZY_STORE_ID!, {
        secret: env.LEMON_SQUEEZY_WEBHOOK_SECRET!,
        url: webHookUrl,
        testMode: true, // will create a webhook in Test mode only!
        events: [
          "subscription_created",
          "subscription_expired",
          "subscription_updated",
        ],
      });
    }
  }),
  getWebhook: protectedProcedure.query(async () => {
    const webhook = await hasWebhook();

    return webhook;
  }),
});
