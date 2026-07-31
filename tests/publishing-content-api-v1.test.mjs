import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/v1/integrations/publishing/content/route.ts",
  import.meta.url,
);
const contentPath = new URL(
  "../src/lib/integrations/publishing-content.ts",
  import.meta.url,
);
const authPath = new URL(
  "../src/lib/server/service-auth.ts",
  import.meta.url,
);

test("publishing content API is versioned, protected and rate limited", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /authenticateService\(request\.headers, \["publishing-bot"\]\)/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /schemaVersion: "1\.0"/);
  assert.match(source, /MAX_LIMIT = 50/);
  assert.match(source, /updatedAfter/);
  assert.match(source, /cursor/);
  assert.doesNotMatch(source, /facebook|tiktok|youtube|linkedin/i);
});

test("publishing DTO exposes canonical public content without UI internals", async () => {
  const source = await readFile(contentPath, "utf8");

  assert.match(source, /COMPANY_CONFIG\.websiteUrl/);
  assert.match(source, /canonicalUrl/);
  assert.match(source, /featuredImage/);
  assert.match(source, /distributionStatus: "ready"/);
  assert.match(source, /locale: "vi-VN"/);
  assert.match(source, /nextCursor/);
  assert.match(source, /SERVICES\.map/);
  assert.doesNotMatch(source, /LucideIcon|service\.icon/);
});

test("service authentication keeps ecosystem credentials server-side", async () => {
  const source = await readFile(authPath, "utf8");

  assert.match(source, /process\.env\.ECOSYSTEM_SERVICE_API_KEY/);
  assert.match(source, /timingSafeEqual/);
  assert.match(source, /Authorization|authorization/);
  assert.match(source, /x-dhp-source-service/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_/);
});
