import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  AI_CONCEPT_MODEL,
  AI_CONCEPT_VIEWS,
  isAIConceptView,
} from "../src/lib/ai/concept-studio.ts";

const pagePath = new URL(
  "../src/app/cong-cu/ai-phoi-canh/page.tsx",
  import.meta.url,
);
const toolsIndexPath = new URL(
  "../src/app/cong-cu/page.tsx",
  import.meta.url,
);
const clientPath = new URL(
  "../src/components/ai/AIConceptStudio.tsx",
  import.meta.url,
);
const protectedClientPath = new URL(
  "../src/components/ai/ProtectedConceptStudio.tsx",
  import.meta.url,
);
const routePath = new URL(
  "../src/app/api/ai/concept/route.ts",
  import.meta.url,
);
const configPath = new URL(
  "../src/lib/ai/concept-studio.ts",
  import.meta.url,
);
const themePath = new URL("../src/lib/theme.ts", import.meta.url);

test("tools index forwards visitors to the available concept studio", async () => {
  const toolsIndex = await readFile(toolsIndexPath, "utf8");

  assert.match(toolsIndex, /redirect\("\/cong-cu\/ai-phoi-canh"\)/);
});

test("concept studio stays inside the Đại Hải Phát website without entering public navigation", async () => {
  const [page, client, protectedClient, theme] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(clientPath, "utf8"),
    readFile(protectedClientPath, "utf8"),
    readFile(themePath, "utf8"),
  ]);

  assert.match(page, /ProtectedConceptStudio/);
  assert.match(page, /process\.env\.GEMINI_API_KEY/);
  assert.doesNotMatch(theme, /\/cong-cu\/ai-phoi-canh/);
  assert.match(client, /fetch\("\/api\/ai\/concept"/);
  assert.match(protectedClient, /Bản xem trước được bảo vệ/);
  assert.match(protectedClient, /COMPANY_CONFIG\.socials\.zalo1/);
  assert.match(protectedClient, /button:has\(\.lucide-download\)/);
  assert.match(protectedClient, /img\[src\^="data:image"\]/);
  assert.match(protectedClient, /BẢN XEM TRƯỚC/);
  assert.match(protectedClient, /Gửi hồ sơ qua Zalo để được hỗ trợ/);
  assert.doesNotMatch(protectedClient, /do AI tạo/);
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

test("AI concept view contract contains exactly four unique coordinated views", () => {
  assert.equal(AI_CONCEPT_VIEWS.length, 4);

  const ids = AI_CONCEPT_VIEWS.map((view) => view.id);
  const nodes = AI_CONCEPT_VIEWS.map((view) => view.node);

  assert.deepEqual(ids, ["front", "left", "right", "detail"]);
  assert.deepEqual(nodes, ["C1 → D", "C2 → E", "C3 → F", "C4 → G"]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(nodes).size, nodes.length);

  for (const view of AI_CONCEPT_VIEWS) {
    assert.ok(view.title.trim().length > 0);
    assert.ok(view.description.trim().length > 0);
  }
});

test("AI concept view guard accepts only supported view identifiers", () => {
  for (const view of AI_CONCEPT_VIEWS) {
    assert.equal(isAIConceptView(view.id), true);
  }

  for (const value of ["", "Front", "rear", "detail ", "C1", "__proto__"]) {
    assert.equal(isAIConceptView(value), false, `unexpected accepted value: ${value}`);
  }
});

test("AI concept model remains server-configured and non-public", () => {
  assert.equal(AI_CONCEPT_MODEL, "gemini-3-pro-image");
  assert.doesNotMatch(AI_CONCEPT_MODEL, /^NEXT_PUBLIC_/);
});

test("AI image generation is server-side, constrained and rate limited", async () => {
  const [source, config] = await Promise.all([
    readFile(routePath, "utf8"),
    readFile(configPath, "utf8"),
  ]);

  assert.match(source, /process\.env\.GEMINI_API_KEY/);
  assert.match(source, /AI_CONCEPT_MODEL/);
  assert.match(config, /gemini-3-pro-image/);
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
