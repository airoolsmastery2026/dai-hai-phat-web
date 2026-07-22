import { MetadataRoute } from "next";

import { COMPANY_CONFIG } from "@/content/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${COMPANY_CONFIG.websiteUrl}/sitemap.xml`,
    host: COMPANY_CONFIG.websiteUrl,
  };
}
