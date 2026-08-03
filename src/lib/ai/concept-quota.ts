export type ConceptQuotaOperation = "single-view" | "four-view";
export type ConceptQuotaEntryStatus = "reserved" | "completed" | "released";

export interface ConceptQuotaPolicy {
  singleViewCost: number;
  fourViewCost: number;
  defaultAllowance: number;
}

export interface ConceptQuotaAccount {
  accountId: string;
  suspended: boolean;
  allowanceOverride?: number;
}

export interface ConceptQuotaEntry {
  requestId: string;
  accountId: string;
  operation: ConceptQuotaOperation;
  cost: number;
  status: ConceptQuotaEntryStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ConceptQuotaSnapshot {
  account: ConceptQuotaAccount;
  entries: ConceptQuotaEntry[];
}

export type ConceptQuotaReserveResult =
  | {
      ok: true;
      entry: ConceptQuotaEntry;
      remaining: number;
      idempotent: boolean;
    }
  | {
      ok: false;
      reason: "suspended" | "exhausted" | "request-conflict";
      remaining: number;
    };

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
}

export function validateConceptQuotaPolicy(policy: ConceptQuotaPolicy): void {
  assertPositiveInteger(policy.singleViewCost, "singleViewCost");
  assertPositiveInteger(policy.fourViewCost, "fourViewCost");
  assertPositiveInteger(policy.defaultAllowance, "defaultAllowance");
}

export function getConceptQuotaCost(
  operation: ConceptQuotaOperation,
  policy: ConceptQuotaPolicy,
): number {
  validateConceptQuotaPolicy(policy);
  return operation === "single-view"
    ? policy.singleViewCost
    : policy.fourViewCost;
}

export function getConceptQuotaAllowance(
  account: ConceptQuotaAccount,
  policy: ConceptQuotaPolicy,
): number {
  validateConceptQuotaPolicy(policy);
  if (account.allowanceOverride === undefined) return policy.defaultAllowance;
  if (!Number.isInteger(account.allowanceOverride) || account.allowanceOverride < 0) {
    throw new Error("allowanceOverride must be a non-negative integer.");
  }
  return account.allowanceOverride;
}

export function getConceptQuotaUsed(entries: ConceptQuotaEntry[]): number {
  return entries.reduce((total, entry) => {
    if (entry.status === "released") return total;
    return total + entry.cost;
  }, 0);
}

export function getConceptQuotaRemaining(
  snapshot: ConceptQuotaSnapshot,
  policy: ConceptQuotaPolicy,
): number {
  const allowance = getConceptQuotaAllowance(snapshot.account, policy);
  return Math.max(0, allowance - getConceptQuotaUsed(snapshot.entries));
}

export function reserveConceptQuota(
  snapshot: ConceptQuotaSnapshot,
  input: {
    requestId: string;
    operation: ConceptQuotaOperation;
    now: number;
  },
  policy: ConceptQuotaPolicy,
): ConceptQuotaReserveResult {
  const remaining = getConceptQuotaRemaining(snapshot, policy);

  if (snapshot.account.suspended) {
    return { ok: false, reason: "suspended", remaining };
  }

  const existing = snapshot.entries.find(
    (entry) => entry.requestId === input.requestId,
  );

  if (existing) {
    if (
      existing.accountId !== snapshot.account.accountId ||
      existing.operation !== input.operation
    ) {
      return { ok: false, reason: "request-conflict", remaining };
    }

    return {
      ok: true,
      entry: existing,
      remaining,
      idempotent: true,
    };
  }

  const cost = getConceptQuotaCost(input.operation, policy);
  if (remaining < cost) {
    return { ok: false, reason: "exhausted", remaining };
  }

  const entry: ConceptQuotaEntry = {
    requestId: input.requestId,
    accountId: snapshot.account.accountId,
    operation: input.operation,
    cost,
    status: "reserved",
    createdAt: input.now,
    updatedAt: input.now,
  };

  return {
    ok: true,
    entry,
    remaining: remaining - cost,
    idempotent: false,
  };
}

export function settleConceptQuotaEntry(
  entry: ConceptQuotaEntry,
  status: Exclude<ConceptQuotaEntryStatus, "reserved">,
  now: number,
): ConceptQuotaEntry {
  if (entry.status === status) return entry;
  if (entry.status !== "reserved") {
    throw new Error(`Cannot transition quota entry from ${entry.status} to ${status}.`);
  }

  return {
    ...entry,
    status,
    updatedAt: now,
  };
}
