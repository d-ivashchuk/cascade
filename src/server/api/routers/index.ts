import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createCheckout,
  getProduct,
  lemonSqueezySetup,
  listVariants,
} from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "~/env.mjs";

export const lemonSqueezyRouter = createTRPCRouter({
  getProductById: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        hideDefaultVariant: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      lemonSqueezySetup({
        apiKey: env.LEMON_SQUEEZY_API_KEY,
        onError(error) {
          console.log(error);
        },
      });
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
        storeId: z.number(),
        embed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      lemonSqueezySetup({
        apiKey: env.LEMON_SQUEEZY_API_KEY,
        onError(error) {
          console.log(error);
        },
      });

      const user = ctx.session?.user;

      const checkout = await createCheckout(input.storeId, input.variantId, {
        checkoutData: {
          email: user?.email ?? "undefined",
          custom: {
            id: user?.id,
          },
        },
        productOptions: {
          redirectUrl: env.NEXTAUTH_URL,
        },
        checkoutOptions: {
          embed: input.embed,
        },
      });

      return checkout;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
