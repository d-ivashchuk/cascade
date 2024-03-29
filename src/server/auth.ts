import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import * as Sentry from "@sentry/nextjs";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { loops } from "~/lib/loops";
import { isTriggerEnabled } from "~/lib/trigger";
import { slackNewUserNotification } from "~/jobs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    async signIn({ user, isNewUser }) {
      Sentry.setUser({ id: user.id, name: user.name, email: user.email ?? "" });
      if (isNewUser) {
        if (isTriggerEnabled) {
          await slackNewUserNotification.invoke({
            user: {
              name: user.name ?? "unknown",
              email: user.email ?? undefined,
              id: user.id,
            },
          });
        }
        if (loops && user.email) {
          await loops.sendEvent(
            {
              email: user.email,
            },
            "cascade_sign_up",
            {
              ...(user.name && { name: user.name }),
              email: user.email,
            },
          );
        }
      }
    },
    signOut() {
      Sentry.setUser(null);
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID!,
      clientSecret: env.DISCORD_CLIENT_SECRET!,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
