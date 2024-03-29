import { TriggerClient } from "@trigger.dev/sdk";
import { env } from "~/env.mjs";

export const isTriggerEnabled = env.TRIGGER_API_KEY && env.TRIGGER_API_URL;

export const triggerClient = new TriggerClient({
  id: "cascade-78Td",
  apiKey: env.TRIGGER_API_KEY,
  apiUrl: env.TRIGGER_API_URL,
});
