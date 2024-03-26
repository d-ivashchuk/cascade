// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { db } from "~/server/db";

Sentry.init({
  dsn: "https://fe53cc68359291c26af26b5705c13c4f@o4506388280180736.ingest.us.sentry.io/4506978350399488",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  integrations: [
    new Sentry.Integrations.Prisma({
      client: db,
    }),
  ],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: process.env.NODE_ENV === "production",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
});
