import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/live-token/route.ts",
  import.meta.url,
);
const panelPath = new URL(
  "../src/components/sections/GeminiLivePanel.tsx",
  import.meta.url,
);
const experiencePath = new URL(
  "../src/components/sections/AIOfficeExperience.tsx",
  import.meta.url,
);
const configPath = new URL("../src/lib/ai/live.ts", import.meta.url);

test("Gemini Live tokens stay server-side, short-lived and rate limited", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /process\.env\.GEMINI_API_KEY/);
  assert.match(source, /auth_tokens/);
  assert.match(source, /uses: 1/);
  assert.match(source, /LIVE_SESSION_MINUTES = 15/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /isSameOriginRequest/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_GEMINI/);
});

test("Gemini Live panel captures PCM audio and cleans up browser resources", async () => {
  const source = await readFile(panelPath, "utf8");

  assert.match(source, /getUserMedia/);
  assert.match(source, /audio\/pcm;rate=16000/);
  assert.match(source, /Bắt đầu trò chuyện/);
  assert.match(source, /Cho phép trình duyệt sử dụng micro/);
  assert.match(source, /track\.stop\(\)/);
  assert.match(source, /websocketRef\.current\?\.close/);
  assert.match(source, /inputAudioTranscription/);
  assert.match(source, /outputAudioTranscription/);
});

test("AI Office renders voice chat inside its existing error boundary", async () => {
  const source = await readFile(experiencePath, "utf8");

  assert.match(source, /<AIOfficeErrorBoundary resetKey=\{sessionKey\}>/);
  assert.match(source, /<GeminiLivePanel servicePreset=\{servicePreset\} \/>/);
  assert.match(source, /<AIOfficeSection key=\{sessionKey\} \/>/);
});

test("Gemini Live uses the constrained v1beta WebSocket endpoint", async () => {
  const source = await readFile(configPath, "utf8");

  assert.match(source, /gemini-3\.1-flash-live-preview/);
  assert.match(source, /BidiGenerateContentConstrained/);
  assert.match(source, /access_token/);
});
