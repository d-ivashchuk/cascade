import { CustomProjectConfig } from "lost-pixel";

export const config: CustomProjectConfig = {
  storybookShots: {
    storybookUrl: "./storybook-static",
    breakpoints: [320, 1024],
  },

  lostPixelProjectId: "clu5tpynq57cle90eeq0uyb8y",
  apiKey: process.env.LOST_PIXEL_API_KEY,
};
