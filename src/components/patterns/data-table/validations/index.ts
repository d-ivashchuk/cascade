import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  role: z.string().optional(),
  planId: z.string().optional(),
  email: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
