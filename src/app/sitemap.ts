import { MetadataRoute } from "next";

import { ARTICLES } from "@/content/blog";
import { COMPANY_CONFIG } from "@/content/company";
import { SERVICES } from "@/content/services";
import { getPublicRouteSlug } from "@/lib/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = COMPANY_CONFIG.websiteUrl;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-tu-van`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bao-gia`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${getPublicRouteSlug(service.slug)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...articleRoutes];
}
