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
const routeEntryPath = new URL(
  "../src/components/sections/AIOfficeRouteEntry.tsx",
  import.meta.url,
);
const loadingStatePath = new URL(
  "../src/components/sections/AIOfficeLoadingState.tsx",
  import.meta.url,
);
const consultationPagePath = new URL(
  "../src/app/ai-tu-van/page.tsx",
  import.meta.url,
);
const policyPath = new URL(
  "../src/lib/server/gemini-live-policy.ts",
  import.meta.url,
);
const envPath = new URL("../.env.example", import.meta.url);
const configPath = new URL("../src/lib/ai/live.ts", import.meta.url);

test("Gemini Live tokens stay server-side, short-lived and rate limited", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /process\.env\.GEMINI_API_KEY/);
  assert.match(source, /getGeminiLiveReadiness/);
  assert.match(source, /auth_tokens/);
  assert.match(source, /uses: 1/);
  assert.match(source, /LIVE_SESSION_MINUTES = 15/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /upstreamHttpStatus/);
  assert.match(source, /UPSTREAM_STATUS_PATTERN/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_GEMINI/);
});

test("Gemini Live is opt-in, verified-free and paid-blocked", async () => {
  const [policy, route, consultationPage, env] = await Promise.all([
    readFile(policyPath, "utf8"),
    readFile(routePath, "utf8"),
    readFile(consultationPagePath, "utf8"),
    readFile(envPath, "utf8"),
  ]);

  assert.match(policy, /DHP_AI_LIVE_ENABLED/);
  assert.match(policy, /DHP_AI_LIVE_VERIFIED_FREE/);
  assert.match(policy, /DHP_AI_ALLOW_PAID/);
  assert.match(policy, /GEMINI_API_KEY/);
  assert.match(policy, /"live-disabled"/);
  assert.match(policy, /"verified-free"/);
  assert.match(policy, /"paid-execution-blocked"/);
  assert.match(policy, /"missing-api-key"/);
  assert.match(policy, /"ready"/);
  assert.doesNotMatch(policy, /NEXT_PUBLIC_/);

  const guardIndex = route.indexOf("getGeminiLiveReadiness()");
  const upstreamIndex = route.indexOf("await fetch(TOKEN_ENDPOINT");
  assert.ok(guardIndex >= 0, "live route must evaluate the server policy");
  assert.ok(
    upstreamIndex > guardIndex,
    "live policy must be evaluated before any Google upstream request",
  );

  assert.match(consultationPage, /isGeminiLiveEnabled\(\)/);
  assert.doesNotMatch(
    consultationPage,
    /Boolean\(process\.env\.GEMINI_API_KEY\?\.trim\(\)\)/,
  );

  assert.match(env, /DHP_AI_LIVE_ENABLED=false/);
  assert.match(env, /DHP_AI_LIVE_VERIFIED_FREE=false/);
  assert.match(env, /DHP_AI_ALLOW_PAID=false/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_(?:GEMINI|DHP_AI_LIVE)/);
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
  assert.match(source, /access_token=/);
  assert.match(source, /supportRequestId/);
  assert.match(source, /href="#ai-office"/);
  assert.match(source, /Tiếp tục bằng chat/);
});

test("voice consultation is mounted on the dedicated public consultation route when configured", async () => {
  const [source, routeEntry, loadingState, consultationPage] = await Promise.all([
    readFile(experiencePath, "utf8"),
    readFile(routeEntryPath, "utf8"),
    readFile(loadingStatePath, "utf8"),
    readFile(consultationPagePath, "utf8"),
  ]);

  assert.match(source, /<AIOfficeErrorBoundary resetKey=\{sessionKey\}>/);
  assert.match(source, /liveVoiceEnabled \?/);
  assert.match(source, /<GeminiLivePanel servicePreset=\{servicePreset\} \/>/);
  assert.match(source, /<AIOfficeSection key=\{sessionKey\} \/>/);
  assert.match(routeEntry, /liveVoiceEnabled=\{liveVoiceEnabled\}/);
  assert.match(routeEntry, /AIOfficeLoadingState/);
  assert.match(consultationPage, /AIOfficeRouteEntry/);
  assert.match(consultationPage, /liveVoiceEnabled=\{liveVoiceEnabled\}/);
  assert.match(consultationPage, /isGeminiLiveEnabled\(\)/);
  assert.match(loadingState, /id="ai-office"/);
});

test("Gemini Live uses the constrained v1beta WebSocket endpoint", async () => {
  const source = await readFile(configPath, "utf8");

  assert.match(source, /gemini-3\.1-flash-live-preview/);
  assert.match(source, /BidiGenerateContentConstrained/);
});
