import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("publishes canonical homepage and verified sharing images", async () => {
  const homepage = await readFile(
    new URL("../src/app/page.tsx", import.meta.url),
    "utf8",
  );
  const layout = await readFile(
    new URL("../src/app/layout.tsx", import.meta.url),
    "utf8",
  );
  const socialImage = new URL(
    "../public/images/interior/interior78.webp",
    import.meta.url,
  );

  await access(socialImage);

  assert.match(homepage, /export const metadata: Metadata/);
  assert.match(homepage, /alternates: \{ canonical: "\/" \}/);
  assert.match(homepage, /openGraph:/);
  assert.match(homepage, /twitter:/);
  assert.match(homepage, /HOME_IMAGE = "\/images\/interior\/interior78\.webp"/);
  assert.match(homepage, /nhà phố, căn hộ và biệt thự/);

  assert.match(layout, /const DEFAULT_SOCIAL_IMAGE/);
  assert.match(layout, /images: \[DEFAULT_SOCIAL_IMAGE\]/);
  assert.match(layout, /images: \[DEFAULT_SOCIAL_IMAGE\.url\]/);
  assert.doesNotMatch(layout + homepage, /unsplash|pexels|placeholder/);
});
