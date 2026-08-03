import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  SupabaseServerConfigurationError,
  getSupabaseServerConfig,
} from "../src/lib/server/supabase-rest.ts";

const adapterPath = new URL(
  "../src/lib/server/supabase-rest.ts",
  import.meta.url,
);

test("server config requires an HTTPS URL and a service-role key", () => {
  assert.throws(
    () => getSupabaseServerConfig({}),
    SupabaseServerConfigurationError,
  );

  assert.throws(
    () =>
      getSupabaseServerConfig({
        SUPABASE_URL: "http://example.test",
        SUPABASE_SERVICE_ROLE_KEY: "secret",
      }),
    /HTTPS/,
  );

  assert.deepEqual(
    getSupabaseServerConfig({
      SUPABASE_URL: "https://project.supabase.co/",
      SUPABASE_SERVICE_ROLE_KEY: " secret ",
    }),
    {
      url: "https://project.supabase.co",
      serviceRoleKey: "secret",
    },
  );
});

test("adapter stays server-only and restricted to the minimal schema", async () => {
  const source = await readFile(adapterPath, "utf8");

  assert.match(source, /import "server-only"/);
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /cache: "no-store"/);
  assert.match(source, /customer_profiles/);
  assert.match(source, /concept_quota_ledger/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /localStorage|window\.|document\./);
  assert.doesNotMatch(source, /crm|leads|quotations|approval_requests/);
});
