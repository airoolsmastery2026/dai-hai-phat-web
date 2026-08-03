import assert from "node:assert/strict";
import test from "node:test";

import {
  getConceptQuotaRemaining,
  reserveConceptQuota,
  settleConceptQuotaEntry,
} from "../src/lib/ai/concept-quota.ts";

const policy = {
  singleViewCost: 1,
  fourViewCost: 4,
  defaultAllowance: 8,
};

function snapshot(overrides = {}) {
  return {
    account: {
      accountId: "account-1",
      suspended: false,
      ...overrides.account,
    },
    entries: overrides.entries ?? [],
  };
}

test("reserves quota and reports the remaining allowance", () => {
  const result = reserveConceptQuota(
    snapshot(),
    { requestId: "request-1", operation: "four-view", now: 100 },
    policy,
  );

  assert.equal(result.ok, true);
  assert.equal(result.idempotent, false);
  assert.equal(result.entry.status, "reserved");
  assert.equal(result.entry.cost, 4);
  assert.equal(result.remaining, 4);
});

test("repeated request IDs are idempotent and do not reserve twice", () => {
  const first = reserveConceptQuota(
    snapshot(),
    { requestId: "request-1", operation: "single-view", now: 100 },
    policy,
  );
  assert.equal(first.ok, true);

  const second = reserveConceptQuota(
    snapshot({ entries: [first.entry] }),
    { requestId: "request-1", operation: "single-view", now: 200 },
    policy,
  );

  assert.equal(second.ok, true);
  assert.equal(second.idempotent, true);
  assert.deepEqual(second.entry, first.entry);
  assert.equal(second.remaining, 7);
});

test("rejects reuse of a request ID for another operation", () => {
  const first = reserveConceptQuota(
    snapshot(),
    { requestId: "request-1", operation: "single-view", now: 100 },
    policy,
  );
  assert.equal(first.ok, true);

  const conflict = reserveConceptQuota(
    snapshot({ entries: [first.entry] }),
    { requestId: "request-1", operation: "four-view", now: 200 },
    policy,
  );

  assert.deepEqual(conflict, {
    ok: false,
    reason: "request-conflict",
    remaining: 7,
  });
});

test("prevents requests that exceed the remaining allowance", () => {
  const existing = {
    requestId: "request-1",
    accountId: "account-1",
    operation: "four-view",
    cost: 4,
    status: "completed",
    createdAt: 100,
    updatedAt: 200,
  };

  const result = reserveConceptQuota(
    snapshot({ entries: [existing] }),
    { requestId: "request-2", operation: "four-view", now: 300 },
    { ...policy, defaultAllowance: 7 },
  );

  assert.deepEqual(result, { ok: false, reason: "exhausted", remaining: 3 });
});

test("blocks suspended accounts even when allowance remains", () => {
  const result = reserveConceptQuota(
    snapshot({ account: { suspended: true } }),
    { requestId: "request-1", operation: "single-view", now: 100 },
    policy,
  );

  assert.deepEqual(result, { ok: false, reason: "suspended", remaining: 8 });
});

test("supports per-account allowance overrides", () => {
  const result = reserveConceptQuota(
    snapshot({ account: { allowanceOverride: 2 } }),
    { requestId: "request-1", operation: "four-view", now: 100 },
    policy,
  );

  assert.deepEqual(result, { ok: false, reason: "exhausted", remaining: 2 });
});

test("released reservations restore allowance after an upstream failure", () => {
  const reserved = reserveConceptQuota(
    snapshot(),
    { requestId: "request-1", operation: "four-view", now: 100 },
    policy,
  );
  assert.equal(reserved.ok, true);

  const released = settleConceptQuotaEntry(reserved.entry, "released", 200);
  assert.equal(released.status, "released");
  assert.equal(getConceptQuotaRemaining(snapshot({ entries: [released] }), policy), 8);
});

test("completed reservations remain charged and settlement is idempotent", () => {
  const reserved = reserveConceptQuota(
    snapshot(),
    { requestId: "request-1", operation: "single-view", now: 100 },
    policy,
  );
  assert.equal(reserved.ok, true);

  const completed = settleConceptQuotaEntry(reserved.entry, "completed", 200);
  const repeated = settleConceptQuotaEntry(completed, "completed", 300);

  assert.equal(getConceptQuotaRemaining(snapshot({ entries: [completed] }), policy), 7);
  assert.strictEqual(repeated, completed);
});

test("does not allow a completed reservation to be released later", () => {
  const completed = {
    requestId: "request-1",
    accountId: "account-1",
    operation: "single-view",
    cost: 1,
    status: "completed",
    createdAt: 100,
    updatedAt: 200,
  };

  assert.throws(
    () => settleConceptQuotaEntry(completed, "released", 300),
    /Cannot transition quota entry from completed to released/,
  );
});
