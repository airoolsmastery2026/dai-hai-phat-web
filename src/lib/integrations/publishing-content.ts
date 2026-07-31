import { COMPANY_CONFIG } from "@/content/company";
import { SERVICES } from "@/content/services";

export type PublishingContentType = "service";
export type PublishingContentStatus = "ready";
export type DistributionStatus = "ready";

export interface PublishingContentRecord {
  id: string;
  type: PublishingContentType;
  title: string;
  summary: string;
  body: string;
  canonicalUrl: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  category: {
    id: string;
    name: string;
  };
  tags: string[];
  status: PublishingContentStatus;
  distributionStatus: DistributionStatus;
  locale: "vi-VN";
  publishedAt: string;
  updatedAt: string;
}

export interface PublishingContentQuery {
  type?: PublishingContentType;
  status?: PublishingContentStatus;
  updatedAfter?: string;
  category?: string;
  locale?: "vi-VN";
  limit: number;
  cursor?: string;
}

export interface PublishingContentPage {
  items: PublishingContentRecord[];
  nextCursor: string | null;
  total: number;
}

const CONTENT_REVISION_AT = "2026-07-31T00:00:00.000Z";

function absoluteUrl(path: string): string {
  return new URL(path, COMPANY_CONFIG.websiteUrl).toString();
}

function encodeCursor(offset: number): string {
  return Buffer.from(String(offset), "utf8").toString("base64url");
}

export function decodePublishingCursor(cursor?: string): number {
  if (!cursor) return 0;
  try {
    const value = Number(Buffer.from(cursor, "base64url").toString("utf8"));
    return Number.isInteger(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function getPublishingContentRecords(): PublishingContentRecord[] {
  return SERVICES.map((service) => ({
    id: `service:${service.slug}`,
    type: "service",
    title: service.title,
    summary: service.summary,
    body: service.fullDescription,
    canonicalUrl: absoluteUrl(service.seo.canonical),
    featuredImage: {
      url: absoluteUrl(service.image),
      alt: service.title,
    },
    seo: {
      title: service.seo.title,
      description: service.seo.description,
      keywords: [...service.seo.keywords],
    },
    category: {
      id: service.aiService.toLowerCase().replaceAll(" ", "-"),
      name: service.aiService,
    },
    tags: [...service.benefits],
    status: "ready",
    distributionStatus: "ready",
    locale: "vi-VN",
    publishedAt: CONTENT_REVISION_AT,
    updatedAt: CONTENT_REVISION_AT,
  }));
}

export function listPublishingContent(
  query: PublishingContentQuery,
): PublishingContentPage {
  const updatedAfter = query.updatedAfter ? Date.parse(query.updatedAfter) : null;
  const filtered = getPublishingContentRecords().filter((record) => {
    if (query.type && record.type !== query.type) return false;
    if (query.status && record.status !== query.status) return false;
    if (query.locale && record.locale !== query.locale) return false;
    if (
      query.category &&
      record.category.id !== query.category &&
      record.category.name !== query.category
    ) {
      return false;
    }
    if (
      updatedAfter !== null &&
      Number.isFinite(updatedAfter) &&
      Date.parse(record.updatedAt) <= updatedAfter
    ) {
      return false;
    }
    return true;
  });

  const offset = decodePublishingCursor(query.cursor);
  const items = filtered.slice(offset, offset + query.limit);
  const nextOffset = offset + items.length;

  return {
    items,
    nextCursor: nextOffset < filtered.length ? encodeCursor(nextOffset) : null,
    total: filtered.length,
  };
}
