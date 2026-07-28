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

  assert.equal(company.COMPANY_CONFIG.websiteUrl, "https://daihaiphat.vn");
  assert.doesNotMatch(serialized, /vercel\.app|15\+|850\+|1,200\+|99%/);
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
