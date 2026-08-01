import { readFile, readdir } from "node:fs/promises";
import { extname } from "node:path";

const staticDirectory = new URL("../.next/static/", import.meta.url);

async function findCssFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);
      return entry.isDirectory()
        ? findCssFiles(entryUrl)
        : extname(entry.name) === ".css"
          ? [entryUrl]
          : [];
    }),
  );

  return nestedFiles.flat();
}

const cssFiles = await findCssFiles(staticDirectory);

if (!cssFiles.length) {
  throw new Error("Production build did not emit a CSS asset.");
}

const cssOutput = (
  await Promise.all(cssFiles.map((fileUrl) => readFile(fileUrl, "utf8")))
).join("\n");

if (/@tailwind\s+(?:base|components|utilities)/.test(cssOutput)) {
  throw new Error("Tailwind directives were emitted without PostCSS compilation.");
}

for (const utility of [".inline-flex", ".touch-manipulation", ".lg\\:grid-cols-"]) {
  if (!cssOutput.includes(utility)) {
    throw new Error(`Production CSS is missing the required utility ${utility}.`);
  }
}

console.log(`Verified ${cssFiles.length} compiled CSS asset${cssFiles.length === 1 ? "" : "s"}.`);
