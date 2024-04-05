import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const superAdminRouter = createTRPCRouter({
  getUserData: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        sort: z.string().optional(),
        email: z.string().optional(),
        role: z.string().optional(),
        planId: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        perPage: take,
        sort,
        email,
        role,
        planId,
        from,
        to,
      } = input;

      if (
        ctx.session.user.role !== "SUPER_ADMIN" &&
        env.CASCADE_DEMO !== "true"
      ) {
        throw new Error("Unauthorized access to the resource");
      }

      const skip = (page - 1) * take;

      // Sorting logic
      let orderBy = {};
      if (sort) {
        const [sortField, sortOrder] = sort.split(".");
        //@ts-expect-error ignore this line
        orderBy[sortField] = sortOrder;
      } else {
        orderBy = { createdAt: "desc" };
      }

      // Start with an empty where condition
      const where: Prisma.UserWhereInput = {};

      // Date range filter
      if (from && to) {
        where.createdAt = {
          gte: new Date(from),
          lte: new Date(to),
        };
      }

      // Email filter
      if (email) {
        where.email = {
          contains: email,
          mode: "insensitive",
        };
      }

      if (role) {
        const RoleSchema = z.enum(["SUPER_ADMIN", "USER"]);

        // Attempt to parse each role value and filter out any that are invalid
        const roles = role
          .split(".")
          .map((r) => {
            try {
              return RoleSchema.parse(r);
            } catch (error) {
              console.error(`Invalid role: ${r}`); // Optionally log the error or handle it as needed
              return null;
            }
          })
          .filter((r): r is z.infer<typeof RoleSchema> => r !== null);

        console.log({ roles });
        where.role = { in: roles };
      }

      // PlanId filter supports multiple values
      if (planId) {
        const planIds = planId.split(".");
        where.planId = { in: planIds.map((id) => parseInt(id, 10)) };
      }

      if (env.CASCADE_DEMO === "true") {
        where.id = {
          contains: "DEMO_USER",
        };
      }

      const data = await ctx.db.user.findMany({
        where: where,
        take: take,
        skip: skip,
        orderBy: orderBy,
        include: {
          plan: true,
        },
      });

      const total = await ctx.db.user.count({ where: where });

      const pageCount = Math.ceil(total / take);
      return { data, pageCount, total };
    }),
});
