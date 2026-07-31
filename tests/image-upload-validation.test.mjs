import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const rules = fs.readFileSync("src/lib/ai/image-upload.ts", "utf8");
const wrapper = fs.readFileSync("src/hooks/useValidatedAI.ts", "utf8");
const tsconfig = fs.readFileSync("tsconfig.json", "utf8");

test("project images are constrained before IndexedDB storage", () => {
  assert.match(rules, /MAX_PROJECT_IMAGES = 5/);
  assert.match(rules, /MAX_IMAGE_BYTES = 8 \* 1024 \* 1024/);
  assert.match(rules, /MAX_TOTAL_IMAGE_BYTES = 24 \* 1024 \* 1024/);
  assert.match(rules, /image\/jpeg/);
  assert.match(rules, /image\/png/);
  assert.match(rules, /image\/webp/);
  assert.match(rules, /file\.size <= 0/);
  assert.match(wrapper, /validateProjectImageFiles\(Array\.from\(files\)\)/);
  assert.match(wrapper, /await base\.addImages\(files\)/);
});

test("the public AI hook import resolves through the validation wrapper", () => {
  assert.match(tsconfig, /"@\/hooks\/useAI"/);
  assert.match(tsconfig, /src\/hooks\/useValidatedAI\.ts/);
  assert.match(wrapper, /import \{ useAI as useBaseAI \} from "\.\/useAI"/);
});
