import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      await ctx.db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
