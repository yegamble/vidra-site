import type { MetadataRoute } from "next";

/**
 * The marketing routes only. /docs/* is a rewrite to the docs origin, which
 * carries its own sitemap; listing another build's URLs here would go stale
 * the moment that build changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vidra.yosef.app";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/features`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${base}/compare/peertube`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${base}/use-cases`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/demo`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
