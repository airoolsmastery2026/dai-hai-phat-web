import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const servicesSectionPath = new URL(
  "../src/components/sections/ServicesSection.tsx",
  import.meta.url,
);
const projectsSectionPath = new URL(
  "../src/components/sections/ProjectsSection.tsx",
  import.meta.url,
);

test("homepage service links use the public slug helper", async () => {
  const [servicesSection, projectsSection] = await Promise.all([
    readFile(servicesSectionPath, "utf8"),
    readFile(projectsSectionPath, "utf8"),
  ]);

  for (const source of [servicesSection, projectsSection]) {
    assert.match(source, /getPublicRouteSlug/);
    assert.doesNotMatch(source, /href=\{`\/services\/\$\{service\.slug\}`\}/);
  }
});
