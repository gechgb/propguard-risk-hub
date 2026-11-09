import { MetadataRoute } from "next";
import seoMatrix from "@/data/prop-seo-matrix.json";

export const dynamic = "force-static";

const BASE_URL = "https://propguard.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Generate all firm × instrument calculator page URLs
  const calculatorPages: MetadataRoute.Sitemap = [];
  for (const firm of seoMatrix.propFirms) {
    for (const instrument of seoMatrix.instruments) {
      calculatorPages.push({
        url: `${BASE_URL}/calculators/${firm.slug}/${instrument.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return [...staticPages, ...calculatorPages];
}

