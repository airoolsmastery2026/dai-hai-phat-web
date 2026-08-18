import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const qualitySource = await readFile(
  new URL("../src/lib/ai/analysis-output-quality.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(qualitySource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const quality = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const validAnalysis = {
  summary:
    "Hồ sơ cửa cổng đã có đủ dữ liệu sơ bộ để chuẩn bị khảo sát kỹ thuật.",
  recommendation:
    "Ưu tiên đối chiếu vật liệu và phong cách với hiện trạng đã cung cấp. Sau đó kỹ sư cần xác minh cấu tạo liên kết trước khi chốt phương án.",
  options: [
    {
      name: "Giữ hướng vật liệu hiện tại",
      suitableWhen:
        "Phù hợp khi hiện trạng và vị trí liên kết đáp ứng phương án đã chọn.",
      tradeoffs: [
        "Cần đo lại khẩu độ trước khi chốt cấu tạo.",
        "Bề mặt hoàn thiện cần được xác nhận tại công trình.",
      ],
    },
  ],
  surveyChecks: [
    "Đo lại khẩu độ và cao độ tại vị trí lắp đặt.",
    "Kiểm tra nền, trụ và điểm liên kết hiện hữu.",
  ],
  limitations: [
    "Dữ liệu sơ bộ chưa thay thế khảo sát kỹ thuật tại công trình.",
  ],
};

test("accepts concise Vietnamese project analysis with 2-4 sentence recommendation", () => {
  assert.deepEqual(
    quality.assertProjectAnalysisLanguageQuality(validAnalysis),
    validAnalysis,
  );
});

test("normalizes public AI wording and repeated punctuation", () => {
  const result = quality.assertProjectAnalysisLanguageQuality({
    ...validAnalysis,
    recommendation:
      "AI ưu tiên đối chiếu vật liệu với hiện trạng!! Sau đó kỹ sư xác minh cấu tạo liên kết trước khi chốt phương án.",
  });

  assert.equal(result.recommendation.includes("AI"), false);
  assert.match(result.recommendation, /trợ lý ưu tiên/i);
  assert.equal(result.recommendation.includes("!!"), false);
});

test("rejects robotic one-line acknowledgements", () => {
  assert.throws(
    () =>
      quality.assertProjectAnalysisLanguageQuality({
        ...validAnalysis,
        recommendation: "Đã ghi nhận thông tin dự án.",
      }),
    /2–4 câu|dập khuôn/,
  );
});

test("rejects markdown, prompt metadata, URLs and accentless prose", () => {
  assert.throws(
    () =>
      quality.assertProjectAnalysisLanguageQuality({
        ...validAnalysis,
        summary: "# Hồ sơ đã sẵn sàng.",
      }),
    /không đạt chuẩn/,
  );
  assert.throws(
    () =>
      quality.assertProjectAnalysisLanguageQuality({
        ...validAnalysis,
        limitations: ["Theo JSON schema, hồ sơ cần khảo sát kỹ thuật."],
      }),
    /không đạt chuẩn/,
  );
  assert.throws(
    () =>
      quality.assertProjectAnalysisLanguageQuality({
        ...validAnalysis,
        surveyChecks: [
          "Check the current site before installation.",
          validAnalysis.surveyChecks[1],
        ],
      }),
    /tiếng Việt có dấu/,
  );
  assert.throws(
    () =>
      quality.assertProjectAnalysisLanguageQuality({
        ...validAnalysis,
        limitations: ["Xem https://example.com để biết thêm thông tin."],
      }),
    /không đạt chuẩn/,
  );
});

test("rejects generic option labels that make the answer feel templated", () => {
  assert.throws(
    () =>
      quality.assertProjectAnalysisLanguageQuality({
        ...validAnalysis,
        options: [{ ...validAnalysis.options[0], name: "Phương án 1" }],
      }),
    /chưa đủ mô tả/,
  );
});

test("free model runtime applies the language gate before returning project analysis", async () => {
  const runtimeSource = await readFile(
    new URL("../src/lib/server/model-runtime-capability.ts", import.meta.url),
    "utf8",
  );
  assert.match(runtimeSource, /assertProjectAnalysisLanguageQuality/);
  assert.match(
    runtimeSource,
    /assertProjectAnalysisLanguageQuality\(\s*parseProjectAnalysisOutput/,
  );
  assert.match(runtimeSource, /data\.verifiedFree !== true/);
});

test("chat drawer stays inside iPhone visual viewport and safe areas", async () => {
  const drawerSource = await readFile(
    new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
    "utf8",
  );
  const composerSource = await readFile(
    new URL("../src/components/ai/AIChatAnswerComposer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(drawerSource, /h-\[100dvh\]/);
  assert.match(drawerSource, /max-h-\[100dvh\]/);
  assert.match(drawerSource, /max-w-\[100vw\]/);
  assert.match(drawerSource, /overflow-x-hidden/);
  assert.match(drawerSource, /safe-area-inset-left/);
  assert.match(drawerSource, /safe-area-inset-right/);
  assert.match(drawerSource, /safe-area-inset-bottom/);
  assert.equal(drawerSource.includes("w-screen"), false);
  assert.match(composerSource, /text-base/);
});
