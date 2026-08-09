import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPublishingBotRequest,
  isPublishingBotCommand,
  parsePublishingBotResponse,
} from "../src/lib/integrations/publishing-bot-client.ts";

const config = {
  baseUrl: "https://publishing.example.com",
  token: "server-secret",
};

test("publishing bot client exposes only the approved control surface", () => {
  assert.equal(isPublishingBotCommand("publishing.health"), true);
  assert.equal(isPublishingBotCommand("publishing.queue"), true);
  assert.equal(isPublishingBotCommand("publishing.job.get"), true);
  assert.equal(isPublishingBotCommand("publishing.tokens.status"), true);
  assert.equal(isPublishingBotCommand("publishing.analytics"), true);
  assert.equal(isPublishingBotCommand("publishing.job.create"), true);
  assert.equal(isPublishingBotCommand("publishing.scheduler.pause"), true);
  assert.equal(isPublishingBotCommand("publishing.scheduler.resume"), true);
  assert.equal(isPublishingBotCommand("publishing.job.retry"), true);
  assert.equal(isPublishingBotCommand("publishing.database.write"), false);
});

test("read commands build authenticated server-side GET requests", () => {
  const request = buildPublishingBotRequest(
    config,
    {
      command: "publishing.job.get",
      requestId: "req-1",
      jobId: "job-42",
    },
  );

  assert.equal(request.url, "https://publishing.example.com/api/v1/publishing/jobs/job-42");
  assert.equal(request.init.method, "GET");
  assert.equal(request.init.body, undefined);
  assert.equal(request.init.cache, "no-store");
  assert.equal(request.init.headers.authorization, "Bearer server-secret");
  assert.equal(request.init.headers["x-dhp-request-id"], "req-1");
  assert.equal(request.init.headers["x-dhp-source-service"], "website");
  assert.equal("idempotency-key" in request.init.headers, false);
});

test("write commands require idempotency and bounded structured payloads", () => {
  const request = buildPublishingBotRequest(
    config,
    {
      command: "publishing.job.create",
      requestId: "req-2",
      idempotencyKey: "pub-job-1",
      contentRef: {
        entityType: "service",
        entityId: "noi-that-go",
      },
      channels: ["facebook", "tiktok"],
    },
  );

  assert.equal(request.url, "https://publishing.example.com/api/v1/publishing/jobs");
  assert.equal(request.init.method, "POST");
  assert.equal(request.init.headers["idempotency-key"], "pub-job-1");
  assert.equal(request.init.headers["content-type"], "application/json");

  assert.deepEqual(JSON.parse(request.init.body), {
    contentRef: {
      entityType: "service",
      entityId: "noi-that-go",
    },
    channels: ["facebook", "tiktok"],
  });
});

test("unsafe base URLs, missing write idempotency and unapproved channels are rejected", () => {
  assert.throws(
    () =>
      buildPublishingBotRequest(
        { baseUrl: "http://publishing.example.com", token: "server-secret" },
        { command: "publishing.health", requestId: "req-3" },
      ),
    /HTTPS/,
  );

  assert.throws(
    () =>
      buildPublishingBotRequest(config, {
        command: "publishing.scheduler.pause",
        requestId: "req-4",
      }),
    /Idempotency-Key/,
  );

  assert.throws(
    () =>
      buildPublishingBotRequest(config, {
        command: "publishing.job.create",
        requestId: "req-5",
        idempotencyKey: "pub-job-2",
        contentRef: { entityType: "service", entityId: "noi-that-go" },
        channels: ["unknown-network"],
      }),
    /channel/,
  );
});

test("response parser accepts ecosystem envelopes and rejects malformed provider payloads", () => {
  const success = parsePublishingBotResponse({
    schemaVersion: "1.0",
    requestId: "req-6",
    data: { status: "healthy" },
  });
  assert.deepEqual(success, {
    ok: true,
    requestId: "req-6",
    data: { status: "healthy" },
  });

  const failure = parsePublishingBotResponse({
    schemaVersion: "1.0",
    requestId: "req-7",
    error: {
      code: "QUEUE_PAUSED",
      message: "Queue is paused.",
      retryable: false,
    },
  });
  assert.equal(failure.ok, false);
  assert.equal(failure.error.code, "QUEUE_PAUSED");
  assert.equal(failure.error.retryable, false);

  assert.throws(() => parsePublishingBotResponse({ data: {} }), /response envelope/);
});
