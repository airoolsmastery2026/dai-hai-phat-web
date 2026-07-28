import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/routing.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const routing = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

test("normalizes encoded and Unicode route slugs without throwing", () => {
  assert.equal(
    routing.normalizeRouteSlug("noi-that-g%E1%BB%97-mdf-melamine"),
    "noi-that-gỗ-mdf-melamine",
  );
  assert.equal(
    routing.normalizeRouteSlug("noi-that-go\u0302%CC%83-mdf"),
    "noi-that-gỗ-mdf",
  );
  assert.equal(routing.normalizeRouteSlug("slug-khong-ma-hoa"), "slug-khong-ma-hoa");
  assert.equal(routing.normalizeRouteSlug("%E0%A4%A"), "%E0%A4%A");
});
