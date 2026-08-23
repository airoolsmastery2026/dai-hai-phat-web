import assert from "node:assert/strict";
import test from "node:test";

import {
  IMAGE_EDITOR_ADAPTERS,
  resolveImageEditorAdapter,
} from "../src/lib/media/image-editor-adapters.ts";

test("PhotoGIMP is preferred when the local preset is available", () => {
  const adapter = resolveImageEditorAdapter({
    photogimpAvailable: true,
    gimpAvailable: true,
  });

  assert.equal(adapter.id, "photogimp");
  assert.equal(adapter.engine, "gimp");
  assert.equal(adapter.preset, "photogimp");
});

test("plain GIMP is the desktop fallback", () => {
  const adapter = resolveImageEditorAdapter({
    photogimpAvailable: false,
    gimpAvailable: true,
  });

  assert.equal(adapter.id, "gimp");
  assert.equal(adapter.optional, true);
});

test("DHP Web Editor remains the hard fallback", () => {
  const adapter = resolveImageEditorAdapter({
    photogimpAvailable: false,
    gimpAvailable: false,
  });

  assert.equal(adapter.id, "web");
  assert.equal(adapter.optional, false);
  assert.equal(adapter.engine, "dhp-web");
});

test("desktop editing can be explicitly bypassed", () => {
  const adapter = resolveImageEditorAdapter({
    photogimpAvailable: true,
    gimpAvailable: true,
    preferDesktop: false,
  });

  assert.equal(adapter, IMAGE_EDITOR_ADAPTERS.web);
});
