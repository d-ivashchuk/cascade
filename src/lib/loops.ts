import LoopsClient from "loops";
import { env } from "~/env.mjs";

export const loops = env.LOOPS_API_KEY
  ? new LoopsClient(env.LOOPS_API_KEY)
  : null;
