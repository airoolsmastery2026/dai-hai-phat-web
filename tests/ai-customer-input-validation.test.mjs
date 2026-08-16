import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/ai/customer-input.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const gate = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

function question(field, inputType = "text", required = true) {
  return {
    id: field,
    state: "HUMAN_HANDOVER",
    field,
    prompt: field,
    supportingText: "",
    inputType,
    required,
  };
}

test("rejects the garbage contact values reproduced from the mobile report", () => {
  assert.equal(gate.validateCustomerAnswer(question("name"), "Adxre").ok, false);
  assert.equal(gate.validateCustomerAnswer(question("phone", "tel"), "442556633288").ok, false);
  assert.equal(
    gate.validateCustomerAnswer(question("surveyAddress"), "Stxguj kjch Hyde kiggf").ok,
    false,
  );
});

test("accepts and normalizes realistic Vietnamese contact data", () => {
  const name = gate.validateCustomerAnswer(question("name"), "  Nguyễn Hữu Hướng  ");
  assert.deepEqual(name, {
    ok: true,
    value: "Nguyễn Hữu Hướng",
    verification: "not_required",
  });

  const phone = gate.validateCustomerAnswer(question("phone", "tel"), "+84 905 123 456");
  assert.equal(phone.ok, true);
  assert.equal(phone.value, "0905123456");
  assert.equal(phone.verification, "format_only");

  const address = gate.validateCustomerAnswer(
    question("surveyAddress"),
    "DL12, Khu phố 3B, Thới Hòa, TP. Hồ Chí Minh",
  );
  assert.equal(address.ok, true);
});

test("distinguishes format checks from ownership verification", () => {
  const email = gate.validateCustomerAnswer(
    question("email", "email", false),
    "Customer@Gmail.com",
  );
  assert.equal(email.ok, true);
  assert.equal(email.value, "customer@gmail.com");
  assert.equal(email.verification, "format_only");
  assert.match(email.note, /chưa được xác minh/i);

  assert.equal(
    gate.validateCustomerAnswer(question("email", "email", false), "fattyhh@niuj").ok,
    false,
  );
});

test("requires meaningful dimensions or an explicit request for measurement", () => {
  assert.equal(gate.validateCustomerAnswer(question("dimensions"), "asdf qwer").ok, false);
  assert.equal(
    gate.validateCustomerAnswer(question("dimensions"), "rộng 4 m × cao 2,6 m").ok,
    true,
  );
  assert.deepEqual(gate.validateCustomerAnswer(question("dimensions"), "chưa đo"), {
    ok: true,
    value: "Cần khảo sát đo đạc",
    verification: "not_required",
  });
});

test("Vietnam phone normalization only accepts supported mobile prefixes", () => {
  assert.equal(gate.normalizeVietnamPhone("0901234567"), "0901234567");
  assert.equal(gate.normalizeVietnamPhone("+84 901 234 567"), "0901234567");
  assert.equal(gate.normalizeVietnamPhone("0123456789"), null);
  assert.equal(gate.normalizeVietnamPhone("442556633288"), null);
});
