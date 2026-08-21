import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function importTypeScript(path) {
  const source = await read(path);
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
  );
}

test("deterministic project analysis keeps consultation usable without cloud inference", async () => {
  const fallback = await importTypeScript(
    "src/lib/server/project-analysis-fallback.ts",
  );

  const request = {
    intent: "Khảo sát",
    service: "Cửa cổng",
    projectType: "Nhà phố",
    location: "TP. Hồ Chí Minh",
    imageCount: 2,
    dimensions: "rộng 4 m × cao 2,6 m",
    style: "Hiện đại",
    material: "Sắt hoặc thép",
    budget: "60–120 triệu",
    timeline: "Trong 1 tháng",
    priority: "Độ bền",
  };
  const evidence = {
    projects: [
      { id: "one", title: "Mẫu 1", category: "Cửa cổng", material: "Sắt" },
      { id: "two", title: "Mẫu 2", category: "Cửa cổng", material: "Thép" },
    ],
    materials: ["Sắt", "Thép"],
    pricingRule: "Kỹ sư xác nhận sau khảo sát.",
  };

  const result = fallback.buildDeterministicProjectAnalysis(request, evidence);
  const serialized = JSON.stringify(result);

  assert.equal(result.provider, "dhp-rule-engine");
  assert.equal(result.model, "DHP kiểm tra theo quy tắc v1");
  assert.equal(result.evidenceCount, 2);
  assert.equal(result.options.length, 2);
  assert.ok(result.surveyChecks.length >= 2);
  assert.match(serialized, /không phải kết quả suy luận của mô hình AI/i);
  assert.equal(serialized.includes(request.budget), false);
});

test("deterministic project analysis makes missing images explicit", async () => {
  const fallback = await importTypeScript(
    "src/lib/server/project-analysis-fallback.ts",
  );
  const result = fallback.buildDeterministicProjectAnalysis(
    {
      intent: "Khảo sát",
      service: "Nội thất",
      projectType: "Nhà phố",
      location: "TP. Hồ Chí Minh",
      imageCount: 0,
      dimensions: "Đã ghi nhận sơ bộ",
      style: "Hiện đại",
      material: "MDF",
      budget: "Cần tư vấn ngân sách",
      timeline: "Cần tư vấn tiến độ",
      priority: "Công năng",
    },
    { projects: [], materials: [], pricingRule: "Cần khảo sát." },
  );

  assert.match(result.limitations.join(" "), /Chưa có ảnh hiện trạng/i);
});

test("project analysis route degrades to deterministic output instead of a cloud 503", async () => {
  const route = await read("src/app/api/ai/project-analysis/route.ts");

  assert.match(route, /buildDeterministicProjectAnalysis/);
  assert.match(route, /X-DHP-AI-Fallback/);
  assert.match(route, /fallbackReason: error\.code/);
  assert.match(route, /DHP project analysis using deterministic fallback/);
  assert.doesNotMatch(
    route,
    /error instanceof CloudAiRouterError[\s\S]{0,1800}status[^\n]*503/,
  );
});

test("floating Zalo does not cover the mobile consultation workspace", async () => {
  const floating = await read("src/components/layout/FloatingCta.tsx");

  assert.match(floating, /usePathname/);
  assert.match(floating, /pathname === "\/ai-tu-van"/);
  assert.match(floating, /hidden sm:inline-flex/);
  assert.match(floating, /COMPANY_CONFIG\.socials\.zalo1/);
});
