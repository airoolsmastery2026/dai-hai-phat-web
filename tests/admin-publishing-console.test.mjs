import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const proxyPath = new URL("../src/proxy.ts", import.meta.url);
const pagePath = new URL("../src/app/admin/publishing/page.tsx", import.meta.url);
const panelPath = new URL("../src/components/admin/AdminPublishingManager.tsx", import.meta.url);
const listRoutePath = new URL("../src/app/api/admin/publishing/accounts/route.ts", import.meta.url);
const platformRoutePath = new URL("../src/app/api/admin/publishing/accounts/[platform]/route.ts", import.meta.url);
const servicePath = new URL("../src/lib/server/admin-publishing.ts", import.meta.url);
const supabasePath = new URL("../src/lib/server/supabase-rest.ts", import.meta.url);

test("publishing admin is protected and keeps social credentials server-side", async () => {
  const [proxy, page, panel, listRoute, platformRoute, service, supabase] = await Promise.all([
    readFile(proxyPath, "utf8"),
    readFile(pagePath, "utf8"),
    readFile(panelPath, "utf8"),
    readFile(listRoutePath, "utf8"),
    readFile(platformRoutePath, "utf8"),
    readFile(servicePath, "utf8"),
    readFile(supabasePath, "utf8"),
  ]);

  assert.match(proxy, /ADMIN_PUBLISHING_API_PREFIX/);
  assert.match(proxy, /\/api\/admin\/publishing\/:path\*/);
  assert.match(page, /AdminPublishingManager/);
  for (const platform of ["facebook", "instagram", "tiktok", "linkedin", "pinterest", "youtube"]) assert.match(service, new RegExp(`"${platform}"`));
  assert.match(platformRoute, /isSameOriginRequest/);
  assert.match(platformRoute, /consumeRateLimit/);
  assert.match(service, /dhp_publish_store_and_request_verify/);
  assert.match(supabase, /supabaseRpcRequest/);
  assert.doesNotMatch(listRoute, /accessToken|serviceRoleKey/);
  assert.doesNotMatch(panel, /SUPABASE_SERVICE_ROLE_KEY|DHP_CONTROL_PLANE_SECRET|NEXT_PUBLIC_SUPABASE_SERVICE/);
});
