import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
