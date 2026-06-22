import { Metadata } from "next";
import { COMPANY } from "./constants";
import { PageSeoConfig } from "./types";

export function buildMetadata(config: PageSeoConfig): Metadata {
  const { title, description, path, ogType, ogImage, article, robots } = config;

  const url = `${COMPANY.url}${path}`;
  const image = ogImage || COMPANY.ogImage;
  const fullTitle =
    path === "/"
      ? `${COMPANY.name} | A Holding Company`
      : `${title} | ${COMPANY.name}`;

  return {
    title: fullTitle,
    description,

    metadataBase: new URL(COMPANY.url),

    alternates: {
      canonical: url,
    },

    robots: robots ?? {
      index: true,
      follow: true,
    },

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: COMPANY.name,
      locale: "en_GB",
      type: ogType || "website",
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            section: article.section,
            tags: article.tags,
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      site: COMPANY.twitterHandle,
      title: fullTitle,
      description,
      images: [image.url],
    },

    other: {
      "theme-color": "#F4EBD9",
      "application-name": COMPANY.name,
      ...(COMPANY.googleVerification
        ? { "google-site-verification": COMPANY.googleVerification }
        : {}),
    } as Record<string, string>,

    icons: {
      icon: [
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      other: [{ rel: "manifest", url: "/manifest.webmanifest" }],
    },

    category: "business",
    creator: COMPANY.name,
    publisher: COMPANY.name,
  };
}
