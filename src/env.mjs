import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    POSTGRES_PRISMA_URL:
      process.env.NODE_ENV === "production"
        ? z.string().url()
        : z.string().optional(),
    POSTGRES_URL_NON_POOLING:
      process.env.NODE_ENV === "production"
        ? z.string().url()
        : z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LOOPS_API_KEY: z.string().optional(),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL:
      process.env.NODE_ENV === "production"
        ? z.preprocess(
            // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
            // Since NextAuth.js automatically uses the VERCEL_URL if present.
            (str) => process.env.VERCEL_URL ?? str,
            // VERCEL_URL doesn't include `https` so it cant be validated as a URL
            process.env.VERCEL ? z.string() : z.string().url(),
          )
        : z.string().optional(),
    DISCORD_CLIENT_ID:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    DISCORD_CLIENT_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    GOOGLE_CLIENT_ID:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    GOOGLE_CLIENT_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    TRIGGER_API_KEY: z.string().optional(),
    TRIGGER_API_URL: z.string().optional(),
    LEMON_SQUEEZY_API_KEY: z.string().optional(),
    LEMON_SQUEEZY_STORE_ID: z.string().optional(),
    LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().optional(),
    LEMON_SQUEEZY_WEBHOOK_URL: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    CASCADE_DEMO: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_POSTHOG_API_KEY:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXT_PUBLIC_DEPLOYMENT_URL: z.string(),
    NEXT_PUBLIC_PLAUSIBLE_SELFHOSTED_URL: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_POSTHOG_API_KEY: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    LOOPS_API_KEY: process.env.LOOPS_API_KEY,
    TRIGGER_API_KEY: process.env.TRIGGER_API_KEY,
    TRIGGER_API_URL: process.env.TRIGGER_API_URL,
    LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
    LEMON_SQUEEZY_STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
    LEMON_SQUEEZY_WEBHOOK_SECRET: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
    LEMON_SQUEEZY_WEBHOOK_URL: process.env.LEMON_SQUEEZY_WEBHOOK_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    NEXT_PUBLIC_PLAUSIBLE_SELFHOSTED_URL:
      process.env.NEXT_PUBLIC_PLAUSIBLE_SELFHOSTED_URL,
    CASCADE_DEMO: process.env.CASCADE_DEMO,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
