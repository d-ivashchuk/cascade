import * as Sentry from "@sentry/nextjs";

import { getServerSession } from "next-auth/next";

import { authOptions } from "~/server/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    Sentry.setUser({
      email: session.user.email ?? "",
      id: session.user.id,
    });
  }

  throw new Error("Sentry Example API Route Error");
  // return NextResponse.json({ data: "Testing Sentry Error..." });
}
