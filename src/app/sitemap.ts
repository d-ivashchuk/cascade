import { type MetadataRoute } from "next";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.NEXT_PUBLIC_DEPLOYMENT_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    //extend sitemap with other static or dynamic routes
  ];
}
