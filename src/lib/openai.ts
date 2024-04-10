import OpenAI from "openai";
import { env } from "~/env.mjs";

// Create an OpenAI API client (that's edge friendly!)
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});
