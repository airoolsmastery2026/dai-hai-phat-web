import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL(
  "../src/app/cong-cu/ai-phoi-canh/page.tsx",
  import.meta.url,
);
const clientPath = new URL(
  "../src/components/ai/AIConceptStudio.tsx",
  import.meta.url,
);
const routePath = new URL(
  "../src/app/api/ai/concept/route.ts",
  import.meta.url,
);
const themePath = new URL("../src/lib/theme.ts", import.meta.url);

test("AI concept studio stays inside the Đại Hải Phát website", async () => {
  const [page, client, theme] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(clientPath, "utf8"),
    readFile(themePath, "utf8"),
  ]);

  assert.match(page, /AIConceptStudio/);
  assert.match(page, /process\.env\.GEMINI_API_KEY/);
  assert.match(theme, /\/cong-cu\/ai-phoi-canh/);
  assert.match(client, /fetch\("\/api\/ai\/concept"/);
  assert.doesNotMatch(client, /labs\.google\/fx\/tools\/flow/);
  assert.doesNotMatch(client, /<iframe/);
});

test("native studio accepts two source images and creates four coordinated views", async () => {
  const source = await readFile(clientPath, "utf8");

  assert.match(source, /Node A/);
  assert.match(source, /Node B/);
  assert.match(source, /generateView\("front", inputs\)/);
  assert.match(source, /baseConcept/);
  assert.match(source, /generateView\("left", inputs, baseConcept\)/);
  assert.match(source, /generateView\("right", inputs, baseConcept\)/);
  assert.match(source, /generateView\("detail", inputs, baseConcept\)/);
  assert.match(source, /Tạo toàn bộ 4 góc/);
});

test("AI image generation is server-side, constrained and rate limited", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /process\.env\.GEMINI_API_KEY/);
  assert.match(source, /gemini-3-pro-image/);
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /MAX_IMAGE_BYTES/);
  assert.match(source, /UPSTREAM_TIMEOUT_MS/);
  assert.match(source, /responseModalities: \["TEXT", "IMAGE"\]/);
  assert.match(source, /aspectRatio: "16:9"/);
  assert.match(source, /imageSize: "1K"/);
  assert.match(source, /baseConcept/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_GEMINI/);
});
