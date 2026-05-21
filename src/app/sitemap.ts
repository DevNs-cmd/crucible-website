import type { MetadataRoute } from "next";

const baseUrl = "https://crucible.algoforce.ai";
const lastModified = "2026-05-21";

const routes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/ecosystem", priority: 0.9 },
  { path: "/events", priority: 0.8 },
  { path: "/hackathons", priority: 0.8 },
  { path: "/community", priority: 0.8 },
  { path: "/founders", priority: 0.8 },
  { path: "/startups", priority: 0.8 },
  { path: "/ailabs", priority: 0.85 },
  { path: "/membership", priority: 0.85 },
  { path: "/apply", priority: 0.9 },
  { path: "/waitlist", priority: 0.75 },
  { path: "/blog", priority: 0.7 },
  { path: "/careers", priority: 0.65 },
  { path: "/contact", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
