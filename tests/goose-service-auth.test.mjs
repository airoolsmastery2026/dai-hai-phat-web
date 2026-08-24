import assert from "node:assert/strict";
import test from "node:test";

import {
  authenticateService,
  ServiceAuthenticationError,
} from "../src/lib/server/service-auth.ts";

function serviceHeaders(service, token) {
  return new Headers({
    Authorization: `Bearer ${token}`,
    "X-DHP-Source-Service": service,
  });
}

function withServiceKeys(callback) {
  const previousEcosystem = process.env.ECOSYSTEM_SERVICE_API_KEY;
  const previousGoose = process.env.GOOSE_DESKTOP_SERVICE_API_KEY;
  process.env.ECOSYSTEM_SERVICE_API_KEY = "ecosystem-secret";
  process.env.GOOSE_DESKTOP_SERVICE_API_KEY = "goose-secret";

  try {
    callback();
  } finally {
    if (previousEcosystem === undefined) delete process.env.ECOSYSTEM_SERVICE_API_KEY;
    else process.env.ECOSYSTEM_SERVICE_API_KEY = previousEcosystem;

    if (previousGoose === undefined) delete process.env.GOOSE_DESKTOP_SERVICE_API_KEY;
    else process.env.GOOSE_DESKTOP_SERVICE_API_KEY = previousGoose;
  }
}

test("Goose Desktop authenticates only with its dedicated service key", () => {
  withServiceKeys(() => {
    const principal = authenticateService(
      serviceHeaders("goose-desktop", "goose-secret"),
      ["goose-desktop"],
    );
    assert.equal(principal.service, "goose-desktop");

    assert.throws(
      () =>
        authenticateService(
          serviceHeaders("goose-desktop", "ecosystem-secret"),
          ["goose-desktop"],
        ),
      (error) =>
        error instanceof ServiceAuthenticationError &&
        error.code === "unauthorized",
    );
  });
});

test("existing ecosystem services continue using the ecosystem key", () => {
  withServiceKeys(() => {
    const principal = authenticateService(
      serviceHeaders("publishing-bot", "ecosystem-secret"),
      ["publishing-bot"],
    );
    assert.equal(principal.service, "publishing-bot");
  });
});

test("Goose Desktop fails closed when its dedicated key is not configured", () => {
  withServiceKeys(() => {
    delete process.env.GOOSE_DESKTOP_SERVICE_API_KEY;

    assert.throws(
      () =>
        authenticateService(serviceHeaders("goose-desktop", "goose-secret"), [
          "goose-desktop",
        ]),
      (error) =>
        error instanceof ServiceAuthenticationError &&
        error.code === "not_configured",
    );
  });
});
