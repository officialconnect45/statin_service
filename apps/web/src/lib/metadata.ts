import type { Metadata } from "next";
import { site } from "@/lib/site";

// Child segments that set openGraph/twitter drop the inherited file-based
// image, so it is referenced explicitly here.
const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Statin: engineering for web apps, commerce, and AI integrations",
};

/**
 * Per-page metadata with a canonical URL and matching Open Graph and X tags.
 * Child segments replace (not merge) openGraph and twitter objects, so every
 * page builds them here instead of inheriting the home page values.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} · Statin` : site.title;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: "website",
      locale: "en_US",
      siteName: site.name,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      site: site.twitter,
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}
