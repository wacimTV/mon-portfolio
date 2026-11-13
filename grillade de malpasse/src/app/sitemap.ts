import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/carte", priority: 0.95, changeFrequency: "weekly" },
    { path: "/commander", priority: 0.9, changeFrequency: "weekly" },
    { path: "/livraison-marseille-13", priority: 0.85, changeFrequency: "weekly" },
    { path: "/snack-ouvert-tard-marseille", priority: 0.85, changeFrequency: "weekly" },
    { path: "/burger-halal-marseille-13", priority: 0.85, changeFrequency: "weekly" },
    { path: "/restaurant-saint-jerome", priority: 0.75, changeFrequency: "monthly" },
    { path: "/restaurant-frais-vallon", priority: 0.75, changeFrequency: "monthly" },
    { path: "/restaurant-la-rose", priority: 0.75, changeFrequency: "monthly" },
    { path: "/reservation", priority: 0.85, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
    { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: r.path === "/" ? SITE_URL : absoluteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
