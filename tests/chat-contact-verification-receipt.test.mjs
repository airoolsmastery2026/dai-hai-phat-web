import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const contractSource = await readFile(
  new URL("../src/lib/ai/contact-verification.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(contractSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const verification = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

test("accepts only contact verification levels and compatible field combinations", () => {
  assert.equal(verification.isContactVerificationLevel("format_only"), true);
  assert.equal(verification.isContactVerificationLevel("network_valid"), true);
  assert.equal(verification.isContactVerificationLevel("domain_valid"), true);
  assert.equal(verification.isContactVerificationLevel("verified_owner"), false);

  assert.equal(
    verification.isContactVerificationCompatible("phone", "network_valid"),
    true,
  );
  assert.equal(
    verification.isContactVerificationCompatible("zalo", "network_valid"),
    true,
  );
  assert.equal(
    verification.isContactVerificationCompatible("email", "domain_valid"),
    true,
  );
  assert.equal(
    verification.isContactVerificationCompatible("email", "network_valid"),
    false,
  );
  assert.equal(
    verification.isContactVerificationCompatible("phone", "domain_valid"),
    false,
  );
  assert.equal(
    verification.isContactVerificationCompatible("email", "format_only"),
    true,
  );
});

test("network-valid receipt does not claim phone ownership verification", () => {
  const copy = verification.getContactVerificationAcknowledgement({
    field: "phone",
    verification: "network_valid",
    message: "provider result",
  });

  assert.match(copy, /số hợp lệ/i);
  assert.match(copy, /chưa chứng minh số thuộc về người nhập/i);
  assert.match(copy, /OTP|xác nhận liên hệ thực tế/i);
  assert.doesNotMatch(copy, /đã xác minh (?:chủ|quyền) sở hữu/i);
});

test("domain-valid receipt does not claim mailbox ownership verification", () => {
  const copy = verification.getContactVerificationAcknowledgement({
    field: "email",
    verification: "domain_valid",
    message: "dns result",
  });

  assert.match(copy, /tên miền email có khả năng nhận thư/i);
  assert.match(copy, /chưa được xác minh.*thuộc về người nhập/i);
});

test("format-only receipt tells the customer external verification is unresolved", () => {
  const phoneCopy = verification.getContactVerificationAcknowledgement({
    field: "phone",
    verification: "format_only",
    message: "provider unavailable",
  });
  const emailCopy = verification.getContactVerificationAcknowledgement({
    field: "email",
    verification: "format_only",
    message: "dns unavailable",
  });

  assert.match(phoneCopy, /dịch vụ mạng chưa xác nhận được/i);
  assert.match(phoneCopy, /chưa được xác minh/i);
  assert.match(emailCopy, /DNS chưa xác nhận được/i);
  assert.match(emailCopy, /chưa được xác minh/i);
});

test("composer fails closed on malformed or mismatched server receipts", async () => {
  const source = await readFile(
    new URL("../src/components/ai/AIChatAnswerComposer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /payload\.valid !== true/);
  assert.match(source, /isContactVerificationLevel\(payload\.verification\)/);
  assert.match(
    source,
    /isContactVerificationCompatible\(question\.field, payload\.verification\)/,
  );
  assert.match(source, /onAnswer\(serverValidation\.normalizedValue, serverValidation\.receipt\)/);
  assert.match(source, /catch\s*\{[\s\S]*?ok:\s*false/);
  assert.equal(source.includes("catch {\n    return { ok: true"), false);
});

test("drawer keeps the receipt in transient UI state and uses shared acknowledgement rules", async () => {
  const drawerSource = await readFile(
    new URL("../src/components/ai/AIChatDrawerPanel.tsx", import.meta.url),
    "utf8",
  );
  const acknowledgementSource = await readFile(
    new URL("../src/lib/ai/conversation-acknowledgement.ts", import.meta.url),
    "utf8",
  );

  assert.match(drawerSource, /useState<ContactVerificationReceipt \| null>/);
  assert.match(drawerSource, /buildConversationAcknowledgement/);
  assert.match(drawerSource, /setVerificationReceipt\(receipt\)/);
  assert.equal(drawerSource.includes("localStorage"), false);
  assert.match(
    acknowledgementSource,
    /getContactVerificationAcknowledgement\(receipt\)/,
  );
  assert.match(acknowledgementSource, /không suy diễn là đã xác minh/i);

  const drawerLineCount = drawerSource.split("\n").length;
  assert.ok(
    drawerLineCount <= 300,
    `AIChatDrawerPanel.tsx phải giữ <= 300 dòng, hiện có ${drawerLineCount}`,
  );
});
