import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/services",
    "/work",
    "/approach",
    "/about",
    "/contact",
    "/privacy",
    ...services.map((service) => `/services/${service.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date("2026-10-14"),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
