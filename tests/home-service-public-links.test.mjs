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

test("homepage service choices open consultation while project proof keeps canonical service links", async () => {
  const [servicesSection, projectsSection] = await Promise.all([
    readFile(servicesSectionPath, "utf8"),
    readFile(projectsSectionPath, "utf8"),
  ]);

  assert.match(servicesSection, /encodeURIComponent\(service\.aiService\)/);
  assert.match(servicesSection, /\/ai-tu-van\?service=/);
  assert.match(servicesSection, /href="\/services"/);
  assert.doesNotMatch(
    servicesSection,
    /href=\{`\/services\/\$\{service\.slug\}`\}/,
  );

  assert.match(projectsSection, /getPublicRouteSlug/);
  assert.doesNotMatch(
    projectsSection,
    /href=\{`\/services\/\$\{service\.slug\}`\}/,
  );
});
