import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

import { getSession } from "next-auth/react";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  console.log("session");
  console.log({ session });

  if (session?.user) {
    Sentry.setUser({
      email: session.user.email ?? "",
      id: session.user.id,
    });
  }

  throw new Error("Sentry Example API Route Error");
  return NextResponse.json({ data: "Testing Sentry Error..." });
}
