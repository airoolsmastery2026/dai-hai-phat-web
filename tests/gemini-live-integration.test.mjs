import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const tokenRoutePath = new URL(
  "../src/app/api/ai/live-token/route.ts",
  import.meta.url,
);
const hookPath = new URL("../src/hooks/useGeminiLive.ts", import.meta.url);
const panelPath = new URL(
  "../src/components/sections/GeminiLivePanel.tsx",
  import.meta.url,
);
const experiencePath = new URL(
  "../src/components/sections/AIOfficeExperience.tsx",
  import.meta.url,
);

test("Gemini Live tokens are short lived, constrained and server provisioned", async () => {
  const source = await readFile(tokenRoutePath, "utf8");

  assert.match(source, /v1beta\/auth_tokens/);
  assert.match(source, /process\.env\.GEMINI_API_KEY/);
  assert.match(source, /uses: 1/);
  assert.match(source, /liveConnectConstraints/);
  assert.match(source, /responseModalities: \["AUDIO"\]/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /isSameOriginRequest/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_GEMINI/);
});

test("Gemini Live browser session uses ephemeral WebSocket auth and cleans microphone resources", async () => {
  const source = await readFile(hookPath, "utf8");

  assert.match(source, /BidiGenerateContentConstrained/);
  assert.match(source, /access_token=/);
  assert.match(source, /audio\/pcm;rate=/);
  assert.match(source, /getUserMedia/);
  assert.match(source, /getTracks\(\)\.forEach\(\(track\) => track\.stop\(\)\)/);
  assert.match(source, /inputAudioTranscription/);
  assert.match(source, /outputAudioTranscription/);
  assert.doesNotMatch(source, /GEMINI_API_KEY/);
});

test("AI Office presents short usage guidance and retains the existing chat fallback", async () => {
  const panel = await readFile(panelPath, "utf8");
  const experience = await readFile(experiencePath, "utf8");

  assert.match(panel, /Nhấn “Bắt đầu”/);
  assert.match(panel, /cho phép microphone/);
  assert.match(panel, /Báo giá cuối cùng vẫn cần kỹ sư khảo sát xác nhận/);
  assert.match(panel, /aria-live="polite"/);
  assert.match(experience, /<GeminiLivePanel \/>/);
  assert.match(experience, /<AIOfficeSection key=\{sessionKey\} \/>/);
});
