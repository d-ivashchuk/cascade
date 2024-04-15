import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(
      z.object({ image: z.string().optional(), name: z.string().optional() }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const updatedUser = await ctx.db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          ...input,
        },
      });
      return updatedUser;
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;
    return user;
  }),
});
