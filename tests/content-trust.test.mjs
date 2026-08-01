import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTypeScript(relativePath) {
  const fileUrl = new URL(relativePath, import.meta.url);
  const source = await readFile(fileUrl, "utf8");
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

test("uses one production domain and publishes only evidence-safe company facts", async () => {
  const company = await importTypeScript("../src/content/company.ts");
  const serialized = JSON.stringify(company);

  assert.equal(
    company.COMPANY_CONFIG.websiteUrl,
    "https://dai-hai-phat-web.vercel.app",
  );
  assert.doesNotMatch(serialized, /15\+|850\+|1,200\+|99%/);
  assert.deepEqual(
    company.COMPANY_STATS.map((item) => item.label),
    ["Bắt đầu", "Kỹ thuật", "Triển khai", "Hoàn tất"],
  );
});

test("quarantines case-study drafts and redirects project routes to verified assets", async () => {
  const projects = await importTypeScript("../src/content/projects.ts");
  const projectIndex = await readFile(
    new URL("../src/app/projects/page.tsx", import.meta.url),
    "utf8",
  );
  const projectDetail = await readFile(
    new URL("../src/app/projects/[slug]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(
    projects.UNVERIFIED_PROJECT_DRAFTS.publicationStatus,
    "unverified",
  );
  assert.equal(projects.UNVERIFIED_PROJECT_DRAFTS.items.length, 3);
  assert.deepEqual(projects.PROJECTS, []);
  assert.match(projectIndex, /permanentRedirect\("\/gallery"\)/);
  assert.match(projectDetail, /permanentRedirect\("\/gallery"\)/);
  assert.doesNotMatch(projectIndex + projectDetail, /content\/projects/);
});

test("keeps published checklists free of unsupported authors and performance claims", async () => {
  const blog = await importTypeScript("../src/content/blog.ts");
  const serialized = JSON.stringify(blog.ARTICLES);

  assert.equal(blog.ARTICLES.length, 4);
  assert.ok(
    blog.ARTICLES.every(
      (article) =>
        !("author" in article) &&
        !("date" in article) &&
        article.highlights.length === 3,
    ),
  );
  assert.doesNotMatch(
    serialized,
    /500kg|20 năm|chống mối mọt|độ bền trên|tải trọng 500/i,
  );
});

test("removes unverified factory modules and broken related-project publication", async () => {
  const removedPaths = [
    "../src/content/factory.ts",
    "../src/lib/company.ts",
    "../src/types/company.ts",
    "../src/components/services/RelatedProjects.tsx",
  ];

  for (const relativePath of removedPaths) {
    await assert.rejects(access(new URL(relativePath, import.meta.url)));
  }

  const servicePage = await readFile(
    new URL("../src/app/services/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const services = await readFile(
    new URL("../src/content/services.ts", import.meta.url),
    "utf8",
  );
  const sitemap = await readFile(
    new URL("../src/app/sitemap.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(servicePage + services, /relatedProjects|\/projects\//);
  assert.doesNotMatch(
    services,
    /500kg|20 năm|bền lâu|kháng nước|chống thấm|giảm nhiệt độ|độ chính xác cao|vài ngày đến vài tuần/i,
  );
  assert.doesNotMatch(sitemap, /`\$\{baseUrl\}\/projects`/);
});

test("positions every public discovery surface around residential interiors", async () => {
  const paths = [
    "../src/components/sections/HeroSection.tsx",
    "../src/app/services/page.tsx",
    "../src/app/about/page.tsx",
    "../src/app/gallery/page.tsx",
    "../public/ai-context.md",
    "../public/company-dna.md",
    "../public/knowledge-base.md",
    "../public/llms.txt",
  ];
  const publicPositioning = (
    await Promise.all(
      paths.map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    )
  ).join("\n");

  assert.match(publicPositioning, /dân dụng|residential/i);
  assert.match(publicPositioning, /nhà phố|townhouses/i);
  assert.doesNotMatch(
    publicPositioning,
    /industrial furniture|steel structure fabrication|modern industrial|nhà xưởng|kết cấu thép/i,
  );
});

test("publishes residential gates and stairs with a safe legacy redirect", async () => {
  const services = await readFile(
    new URL("../src/content/services.ts", import.meta.url),
    "utf8",
  );
  const nextConfig = await readFile(
    new URL("../next.config.js", import.meta.url),
    "utf8",
  );

  assert.match(services, /slug: "cua-cong-co-khi-dan-dung"/);
  assert.match(services, /slug: "cau-thang-lan-can"/);
  assert.match(services, /title: "Cầu thang và lan can"/);
  assert.doesNotMatch(services, /slug: "ket-cau-thep-cua-cong"/);
  assert.match(nextConfig, /source: "\/services\/ket-cau-thep-cua-cong"/);
  assert.match(
    nextConfig,
    /destination: "\/services\/cua-cong-co-khi-dan-dung"/,
  );
  assert.match(nextConfig, /permanent: true/);
});

test("explains CRM consent and makes privacy information reachable", async () => {
  const privacyPage = await readFile(
    new URL("../src/app/privacy/page.tsx", import.meta.url),
    "utf8",
  );
  const aiOffice = await readFile(
    new URL("../src/components/sections/AIOfficeSection.tsx", import.meta.url),
    "utf8",
  );
  const footer = await readFile(
    new URL("../src/components/layout/SiteFooter.tsx", import.meta.url),
    "utf8",
  );
  const sitemap = await readFile(
    new URL("../src/app/sitemap.ts", import.meta.url),
    "utf8",
  );

  assert.match(privacyPage, /Ảnh gốc.*không gửi/s);
  assert.match(privacyPage, /AI_DRAFT_RETENTION_DAYS/);
  assert.match(aiOffice, /href="\/privacy"/);
  assert.match(aiOffice, /Ảnh gốc không được gửi/);
  assert.match(aiOffice, /buildManualHandoffSummary/);
  assert.match(aiOffice, /navigator\.share/);
  assert.match(aiOffice, /navigator\.clipboard/);
  assert.match(aiOffice, /Mở Zalo và gửi hồ sơ/);
  assert.match(footer, /href="\/privacy"/);
  assert.match(sitemap, /`\$\{baseUrl\}\/privacy`/);
});

test("lets customers defer project photos without hiding the missing evidence", async () => {
  const aiOffice = await readFile(
    new URL("../src/components/sections/AIOfficeSection.tsx", import.meta.url),
    "utf8",
  );
  const hook = await readFile(
    new URL("../src/hooks/useAI.ts", import.meta.url),
    "utf8",
  );
  const engine = await readFile(
    new URL("../src/lib/ai/index.ts", import.meta.url),
    "utf8",
  );

  assert.match(aiOffice, /Tiếp tục, bổ sung ảnh sau/);
  assert.match(aiOffice, /Có thể gửi qua Zalo hoặc khi kỹ sư liên hệ/);
  assert.match(aiOffice, /onDeferImages=\{deferImages\}/);
  assert.match(hook, /deferImageCollection/);
  assert.match(engine, /imagesDeferred/);
  assert.match(engine, /Ảnh hiện trạng: sẽ bổ sung sau/);
  assert.match(engine, /proposal\.missing|REQUIRED_MEMORY/);
});

test("preserves the selected service when customers enter the AI intake", async () => {
  const services = await readFile(
    new URL("../src/content/services.ts", import.meta.url),
    "utf8",
  );
  const serviceHero = await readFile(
    new URL("../src/components/services/ServiceHero.tsx", import.meta.url),
    "utf8",
  );
  const serviceCta = await readFile(
    new URL("../src/components/services/ServiceCTA.tsx", import.meta.url),
    "utf8",
  );
  const servicePage = await readFile(
    new URL("../src/app/services/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const aiOffice = await readFile(
    new URL("../src/components/sections/AIOfficeSection.tsx", import.meta.url),
    "utf8",
  );
  const contactPage = await readFile(
    new URL("../src/app/contact/page.tsx", import.meta.url),
    "utf8",
  );
  const presets = Array.from(
    services.matchAll(/aiService: "([^"]+)"/g),
    (match) => match[1],
  );
  const allowedPresets = new Set([
    "Cửa cổng",
    "Cầu thang và lan can",
    "Mái che",
    "Nội thất",
    "Cải tạo không gian",
  ]);

  assert.equal(presets.length, 5);
  assert.ok(presets.every((preset) => allowedPresets.has(preset)));
  assert.match(serviceHero, /encodeURIComponent\(service\.aiService\)/);
  assert.match(serviceCta, /encodeURIComponent\(service\.aiService\)/);
  assert.match(servicePage, /<ServiceCTA service=\{service\} \/>/);
  assert.match(aiOffice, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(aiOffice, /question\?\.field === "intent"/);
  assert.match(aiOffice, /answer\(servicePreset\)/);
  assert.match(contactPage, /href="\/#ai-office"/);
});
