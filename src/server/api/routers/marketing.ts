import { z } from "zod";
import { slackNewNewsletterSubscriberNotification } from "~/jobs";
import { loops } from "~/lib/loops";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const marketingRouter = createTRPCRouter({
  subscribeToNewsletter: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      if (loops) {
        await loops.createContact(input.email, {
          source: "CASCADE_NEWSLETTER",
        });
      }
      await slackNewNewsletterSubscriberNotification.invoke({
        email: input.email,
      });
    }),
});
