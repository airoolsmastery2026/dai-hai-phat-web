import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../src/app/admin/publishing/page.tsx", import.meta.url);
const panelPath = new URL("../src/components/admin/AdminTelegramControl.tsx", import.meta.url);
const routePath = new URL("../src/app/api/admin/telegram-control/route.ts", import.meta.url);
const proxyPath = new URL("../src/proxy.ts", import.meta.url);
const servicePath = new URL("../src/lib/server/admin-publishing.ts", import.meta.url);

test("Telegram Control onboarding stays behind admin auth and Supabase Vault", async () => {
  const [page, panel, route, proxy, service] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(panelPath, "utf8"),
    readFile(routePath, "utf8"),
    readFile(proxyPath, "utf8"),
    readFile(servicePath, "utf8"),
  ]);

  assert.match(page, /AdminTelegramControl/);
  assert.match(proxy, /ADMIN_TELEGRAM_API_PREFIX/);
  assert.match(proxy, /\/api\/admin\/telegram-control\/:path\*/);
  assert.match(route, /isSameOriginRequest/);
  assert.match(route, /consumeRateLimit/);
  assert.match(service, /dhp_telegram_store_config/);
  assert.match(service, /dhp_telegram_admin_status/);
  assert.match(panel, /type="password"/);
  assert.match(panel, /Lưu & kích hoạt/);
  assert.doesNotMatch(panel, /SUPABASE_SERVICE_ROLE_KEY|dhp_telegram_runtime_config|webhookSecret[^C]/);
  assert.doesNotMatch(route, /botToken\s*:/);
});
