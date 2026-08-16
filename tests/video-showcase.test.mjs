import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  getYouTubePrivacyEmbedUrl,
  getYouTubeVideoId,
  isSafeHostedVideoUrl,
} from "../src/lib/video/source.ts";

test("video source parser accepts supported YouTube formats and rejects arbitrary hosts", () => {
  const id = "dQw4w9WgXcQ";
  assert.equal(getYouTubeVideoId(`https://youtu.be/${id}`), id);
  assert.equal(getYouTubeVideoId(`https://www.youtube.com/watch?v=${id}`), id);
  assert.equal(getYouTubeVideoId(`https://youtube.com/shorts/${id}`), id);
  assert.equal(getYouTubeVideoId(`https://youtube.com/embed/${id}`), id);
  assert.equal(getYouTubeVideoId(`https://example.com/watch?v=${id}`), null);
  assert.match(getYouTubePrivacyEmbedUrl(`https://youtu.be/${id}`) ?? "", /^https:\/\/www\.youtube-nocookie\.com\/embed\//);
});

test("hosted video source only accepts same-origin or https video files", () => {
  assert.equal(isSafeHostedVideoUrl("/videos/project.mp4"), true);
  assert.equal(isSafeHostedVideoUrl("https://cdn.example.com/project.webm?token=abc"), true);
  assert.equal(isSafeHostedVideoUrl("http://cdn.example.com/project.mp4"), false);
  assert.equal(isSafeHostedVideoUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHostedVideoUrl("https://example.com/page"), false);
});

test("homepage video showcase is lazy, accessible and positioned before contact", async () => {
  const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const player = await readFile(new URL("../src/components/video/VideoPlayer.tsx", import.meta.url), "utf8");
  const section = await readFile(new URL("../src/components/sections/VideoShowcaseSection.tsx", import.meta.url), "utf8");
  const admin = await readFile(new URL("../src/components/admin/AdminVideoManager.tsx", import.meta.url), "utf8");

  assert.ok(page.indexOf("<ProjectsSection />") < page.indexOf("<VideoShowcaseSection />"));
  assert.ok(page.indexOf("<VideoShowcaseSection />") < page.indexOf("<ContactSection />"));
  assert.match(player, /loading="lazy"/);
  assert.match(player, /youtube-nocookie/);
  assert.match(player, /controls/);
  assert.match(player, /playsInline/);
  assert.match(player, /preload="metadata"/);
  assert.match(section, /aspect-video|Video công trình/);
  assert.doesNotMatch(section, /\bAI\b/);
  assert.match(admin, /Kho lưu trữ video chưa được kết nối/);
  assert.match(admin, /Chọn video để xem thử/);
});
