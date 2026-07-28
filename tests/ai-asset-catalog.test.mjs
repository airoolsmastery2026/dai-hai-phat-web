import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import ts from "typescript";

const repository = new URL("../", import.meta.url);
const gallery = JSON.parse(
  await readFile(new URL("../public/images/gallery.json", import.meta.url), "utf8"),
);
const pricing = JSON.parse(
  await readFile(new URL("../knowledge/pricing.json", import.meta.url), "utf8"),
);
const source = await readFile(
  new URL("../src/lib/ai/catalog.ts", import.meta.url),
  "utf8",
);
const sourceWithData = source
  .replace(
    'import galleryData from "../../../public/images/gallery.json";',
    `const galleryData = ${JSON.stringify(gallery)};`,
  )
  .replace(
    'import pricingData from "../../../knowledge/pricing.json";',
    `const pricingData = ${JSON.stringify(pricing)};`,
  );
const transpiled = ts.transpileModule(sourceWithData, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const catalog = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const absolutePath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
    }),
  );
  return files.flat();
}

test("publishes every classified asset with original, WebP, thumbnail and metadata", async () => {
  assert.equal(gallery.schemaVersion, "1.1");
  assert.equal(gallery.total, 136);
  assert.equal(new Set(gallery.items.map((item) => item.id)).size, gallery.total);

  for (const item of gallery.items) {
    assert.equal(item.source.verified, true);
    assert.ok(item.alt);
    assert.ok(item.prompt);
    assert.ok(item.seo.keywords.length > 0);
    assert.match(item.blurDataUrl, /^data:image\/webp;base64,/);
    await Promise.all(
      [
        item.original.relativePath,
        item.image.relativePath,
        item.thumbnail.relativePath,
        item.image.relativePath.replace(/\.webp$/, ".metadata.json"),
      ].map((relativePath) =>
        access(path.join(new URL(repository).pathname, relativePath)),
      ),
    );
  }
});

test("keeps rendered image sources inside the verified asset catalog", async () => {
  const sourceRoot = path.join(new URL(repository).pathname, "src");
  const sourceFiles = (await collectFiles(sourceRoot)).filter((file) =>
    /\.(?:ts|tsx)$/.test(file),
  );
  const sourceTexts = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));
  const nextConfig = await readFile(
    new URL("../next.config.js", import.meta.url),
    "utf8",
  );
  const combinedSource = [...sourceTexts, nextConfig].join("\n");
  const renderedPaths = Array.from(
    combinedSource.matchAll(/"(\/images\/[^"]+\.(?:jpe?g|png|webp))"/g),
    (match) => match[1],
  );
  const verifiedPaths = new Set(
    gallery.items.flatMap((item) =>
      [
        item.original.publicUrl,
        item.image.publicUrl,
        item.thumbnail.publicUrl,
      ].filter(Boolean),
    ),
  );

  assert.ok(renderedPaths.length > 0);
  assert.equal(combinedSource.includes("images.unsplash.com"), false);
  for (const imagePath of renderedPaths) {
    assert.ok(verifiedPaths.has(imagePath), `Unverified image path ${imagePath}`);
  }
});

test("returns project images without mixing technical drawings or price documents", () => {
  const matches = catalog.searchProjectAssets({
    service: "Cửa cổng",
    limit: 10,
  });

  assert.ok(matches.length > 0);
  assert.ok(matches.length <= 10);
  assert.ok(matches.every(({ asset }) => asset.assetType === "project"));
  assert.ok(matches.every(({ asset }) => asset.service === "Cửa cổng"));
  assert.ok(matches.every(({ asset }) => asset.image.publicUrl.endsWith(".webp")));
});

test("supports English Vision labels and deterministic category matching", () => {
  const matches = catalog.searchProjectAssets({
    category: "canopies",
    limit: 3,
  });

  assert.equal(matches.length, 3);
  assert.ok(matches.every(({ asset }) => asset.category === "Mái che"));
  assert.deepEqual(
    matches.map(({ asset }) => asset.id),
    [...matches.map(({ asset }) => asset.id)].sort((left, right) =>
      left.localeCompare(right, "vi"),
    ),
  );
});

test("blocks cost ranges until dimensions and material are confirmed", () => {
  const incomplete = catalog.buildProposalEvidence({
    service: "Mái che",
    category: "Mái vòm polycarbonate",
  });
  assert.equal(incomplete.canShowCostRange, false);
  assert.deepEqual(incomplete.prices[0].missing, ["kích thước", "vật liệu"]);

  const complete = catalog.buildProposalEvidence({
    service: "Mái che",
    category: "Mái vòm polycarbonate",
    material: "Khung kim loại và tấm polycarbonate",
    dimensions: "5 m × 6 m",
  });
  assert.equal(complete.canShowCostRange, true);
  assert.equal(complete.prices[0].reference.range.min, 2500000);
  assert.equal(complete.prices[0].reference.range.max, 5000000);
});

test("treats assisted measurement and unresolved material as missing pricing inputs", () => {
  const evidence = catalog.buildProposalEvidence({
    service: "Mái che",
    category: "Mái vòm polycarbonate",
    material: "Cần kỹ sư xác định",
    dimensions: "Cần khảo sát đo đạc",
  });

  assert.equal(evidence.canShowCostRange, false);
  assert.deepEqual(evidence.prices[0].missing, ["kích thước", "vật liệu"]);
});

test("does not return a cost range for a confirmed but mismatched material", () => {
  const matching = catalog.buildProposalEvidence({
    service: "Mái che",
    category: "Mái vòm polycarbonate",
    material: "Sắt hoặc thép",
    dimensions: "5 m × 6 m",
  });
  const missingCategory = catalog.buildProposalEvidence({
    service: "Mái che",
    material: "Sắt hoặc thép",
    dimensions: "5 m × 6 m",
  });
  const mismatched = catalog.buildProposalEvidence({
    service: "Mái che",
    category: "Mái vòm polycarbonate",
    material: "MFC An Cường chống ẩm",
    dimensions: "5 m × 6 m",
  });

  assert.equal(matching.canShowCostRange, true);
  assert.equal(missingCategory.canShowCostRange, false);
  assert.ok(
    missingCategory.prices.every((match) =>
      match.missing.includes("hạng mục chi tiết"),
    ),
  );
  assert.equal(mismatched.canShowCostRange, false);
  assert.equal(mismatched.prices.length, 0);
});

test("validates public evidence requests and returns a bounded safe payload", () => {
  const query = catalog.parseProposalEvidenceRequest({
    service: "Cửa cổng",
    material: "Sắt hoặc thép",
    style: "Hiện đại",
    projectType: "Nhà phố",
    dimensions: "rộng 4 m × cao 2,6 m",
    keywords: ["Độ bền"],
    limit: 3,
  });
  const evidence = catalog.buildProposalEvidenceResponse(query);

  assert.ok(evidence.images.length > 0);
  assert.ok(evidence.images.length <= 3);
  assert.ok(evidence.images.every((item) => item.image.url.startsWith("/images/")));
  assert.ok(evidence.images.every((item) => item.thumbnail.url.startsWith("/images/")));
  assert.ok(evidence.images.every((item) => !("original" in item)));
  assert.ok(evidence.materials.length <= 6);

  assert.throws(
    () => catalog.parseProposalEvidenceRequest({ service: "Cửa cổng", limit: 100 }),
    /Giới hạn kết quả/,
  );
  assert.throws(
    () => catalog.parseProposalEvidenceRequest({ service: "" }),
    /Thiếu trường service/,
  );
  assert.throws(
    () =>
      catalog.parseProposalEvidenceRequest({
        service: "Cửa cổng",
        keywords: ["hợp lệ", "\u0000không hợp lệ"],
      }),
    /Từ khóa tìm kiếm/,
  );
});

test("keeps supplier screenshots out of Proposal pricing by default", () => {
  const defaultMatches = catalog.findPriceReferences({
    service: "Mái che",
    material: "Polycarbonate",
    dimensions: "5 m × 6 m",
  });
  assert.equal(
    defaultMatches.some(
      ({ reference }) => reference.id === "polycarbonate-hollow-sheet-archived",
    ),
    false,
  );

  const auditMatches = catalog.findPriceReferences({
    service: "Mái che",
    material: "Polycarbonate",
    dimensions: "5 m × 6 m",
    includeRevalidationRequired: true,
  });
  const archived = auditMatches.find(
    ({ reference }) => reference.id === "polycarbonate-hollow-sheet-archived",
  );
  assert.ok(archived);
  assert.equal(archived.readyForRange, false);
});

test("keeps every price range traceable to an existing source document", async () => {
  const sourceById = new Map(pricing.sources.map((source) => [source.id, source]));
  assert.equal(new Set(pricing.sources.map((source) => source.sha256)).size, pricing.sources.length);

  for (const item of pricing.items) {
    assert.ok(item.range.min > 0);
    assert.ok(item.range.max >= item.range.min);
    assert.ok(item.requiredInputs.length > 0);
    assert.ok(item.sourceIds.length > 0);

    for (const sourceId of item.sourceIds) {
      const source = sourceById.get(sourceId);
      assert.ok(source, `Missing pricing source ${sourceId}`);
      assert.match(source.sha256, /^[a-f0-9]{64}$/);
      assert.match(source.fileName, /\.jpg$/);
    }
  }
});
