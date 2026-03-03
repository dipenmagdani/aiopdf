import type { MetadataRoute } from "next";
import { toolsConfig } from "@/lib/toolsConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aiopdf.com";

  const toolRoutes = toolsConfig.map((tool) => ({
    url: `${siteUrl}${tool.route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...toolRoutes,
  ];
}
