import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("tracks conversion clicks without collecting customer-entered data", async () => {
  const events = await readFile(
    new URL("../src/lib/analytics/conversion.ts", import.meta.url),
    "utf8",
  );
  const capture = await readFile(
    new URL(
      "../src/components/analytics/ConversionEventCapture.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const layout = await readFile(
    new URL("../src/app/layout.tsx", import.meta.url),
    "utf8",
  );

  assert.match(events, /ai_intake_opened/);
  assert.match(events, /service_preset_selected/);
  assert.match(events, /zalo_clicked/);
  assert.match(events, /phone_clicked/);
  assert.match(events, /sourcePath: string/);
  assert.match(events, /window\.dispatchEvent/);
  assert.match(events, /window\.dataLayer\?\.push/);
  assert.match(events, /Analytics must never interrupt/);
  assert.doesNotMatch(events, /customerName|phoneNumber|surveyAddress|messageText/);

  assert.match(capture, /document\.addEventListener\("click", handleClick, true\)/);
  assert.match(capture, /rawHref\.startsWith\("tel:"\)/);
  assert.match(capture, /url\.hostname === "zalo\.me"/);
  assert.match(capture, /url\.hash !== "#ai-office"/);
  assert.doesNotMatch(capture, /preventDefault\(/);
  assert.doesNotMatch(capture, /FormData|input\.value|textContent/);
  assert.match(layout, /<ConversionEventCapture \/>/);
});
