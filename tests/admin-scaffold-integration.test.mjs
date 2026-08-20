import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("admin scaffold preserves the canonical auth and data boundaries", async () => {
  const [hub, inquiries, projects, pricing, reviews, videos, proxy, serverReader] =
    await Promise.all([
      read("src/app/admin/page.tsx"),
      read("src/app/admin/inquiries/page.tsx"),
      read("src/app/admin/projects/page.tsx"),
      read("src/app/admin/pricing/page.tsx"),
      read("src/app/admin/reviews/page.tsx"),
      read("src/app/admin/videos/page.tsx"),
      read("src/proxy.ts"),
      read("src/lib/server/admin-content.ts"),
    ]);

  assert.match(proxy, /\/admin\/:path\*/);
  assert.match(serverReader, /"project_inquiries"/);
  assert.doesNotMatch(serverReader, /NEXT_PUBLIC_SUPABASE/);
  assert.doesNotMatch(inquiries, /@supabase\//);
  assert.doesNotMatch(hub, /\/admin\/login/);

  assert.match(projects, /UNVERIFIED_PROJECT_DRAFTS/);
  assert.doesNotMatch(projects, /is_published/);
  assert.match(pricing, /Khóa publish/);
  assert.match(reviews, /Khóa publish/);
  assert.match(videos, /redirect\("\/admin\/media\/videos"\)/);
});

test("admin hub keeps existing operational modules reachable", async () => {
  const hub = await read("src/app/admin/page.tsx");

  for (const route of [
    "/admin/inquiries",
    "/admin/projects",
    "/admin/pricing",
    "/admin/reviews",
    "/admin/media",
    "/admin/ai",
    "/admin/publishing",
    "/admin/workspace",
  ]) {
    assert.match(hub, new RegExp(route.replaceAll("/", "\\/")));
  }
});
