import { eventTrigger } from "@trigger.dev/sdk";
import { triggerClient } from "~/lib/trigger";
import { Slack } from "@trigger.dev/slack";

//npx @trigger.dev/cli@latest dev => to run locally

const slack = new Slack({
  id: "Lost Pixel Slack",
});

import { z } from "zod";

export const slackNewUserNotification = triggerClient.defineJob({
  id: "cascade-new-user",
  name: "Cascade new user notification",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "cascade.new.user",
    schema: z.object({
      user: z.object({
        name: z.string(),
        email: z.string().email().optional(),
        id: z.string(),
      }),
    }),
  }),
  integrations: {
    slack,
  },
  run: async (payload, io, ctx) => {
    await io.slack.postMessage("post message", {
      channel: "C06RZ0QNP6W",
      text: `🔥 *New user signed up*\n\nName: ${payload.user.name}\nEmail: ${payload.user.email}\nID:${payload.user.id}`,
    });
  },
});
