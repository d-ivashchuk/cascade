import { allPosts } from "contentlayer/generated";
import { type MetadataRoute } from "next";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts;
  return [
    {
      url: env.NEXT_PUBLIC_DEPLOYMENT_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.7,
    })),
  ];
}
