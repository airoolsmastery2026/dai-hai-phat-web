import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import sharp from "sharp";

import { loadConfig } from "../dist/config.js";
import { buildGallery } from "../dist/gallery-builder.js";
import { startWatcher } from "../dist/watcher.js";

async function createRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), "dhp-assets-"));
  await Promise.all([
    mkdir(path.join(root, "assets/images"), { recursive: true }),
    mkdir(path.join(root, "assets/image-metadata"), { recursive: true }),
  ]);
  return root;
}

async function createImage(root, name = "cua-cong") {
  await sharp({
    create: {
      width: 1200,
      height: 800,
      channels: 3,
      background: { r: 38, g: 65, b: 87 },
    },
  })
    .png()
    .toFile(path.join(root, `assets/images/${name}.png`));
}

const verifiedMetadata = {
  title: "Cửa cổng thép Đại Hải Phát",
  alt: "Cửa cổng thép sơn tĩnh điện tại công trình nhà phố",
  caption: "Cửa cổng thép đã hoàn thiện tại công trình nhà phố.",
  category: "Cửa cổng",
  material: "Thép sơn tĩnh điện",
  style: "Hiện đại",
  projectType: "Nhà phố",
  service: "Cơ khí dân dụng",
  source: {
    label: "Đại Hải Phát",
    rights: "Do Đại Hải Phát sở hữu",
    verified: true,
  },
  seo: {
    title: "Cửa cổng thép nhà phố",
    description:
      "Hình ảnh cửa cổng thép sơn tĩnh điện do Đại Hải Phát thi công.",
    keywords: ["Cửa cổng thép", "Đại Hải Phát", "cửa cổng thép"],
  },
};

test("builds verified WebP, thumbnail, metadata and gallery output", async () => {
  const root = await createRoot();

  try {
    await createImage(root);
    await writeFile(
      path.join(root, "assets/image-metadata/cua-cong.json"),
      `${JSON.stringify(verifiedMetadata, null, 2)}\n`,
      "utf8",
    );

    const config = await loadConfig(undefined, { rootDir: root });
    const report = await buildGallery(config);

    assert.equal(report.processed, 1);
    assert.equal(report.issues.length, 0);
    assert.equal(report.manifestWritten, true);

    const raw = await readFile(config.galleryPath, "utf8");
    assert.equal(raw.includes(root), false);
    const gallery = JSON.parse(raw);
    const item = gallery.items[0];

    assert.equal(gallery.total, 1);
    assert.equal(item.original.relativePath, "assets/images/cua-cong.png");
    assert.match(item.prompt, /không thêm/i);
    assert.match(item.blurDataUrl, /^data:image\/webp;base64,/);
    assert.deepEqual(item.seo.keywords, ["cửa cổng thép", "đại hải phát"]);

    const image = await sharp(path.join(root, item.image.relativePath)).metadata();
    const thumbnail = await sharp(
      path.join(root, item.thumbnail.relativePath),
    ).metadata();

    assert.equal(image.format, "webp");
    assert.equal(image.width, 1200);
    assert.equal(thumbnail.format, "webp");
    assert.equal(thumbnail.width, 480);
    await access(
      path.join(
        root,
        item.image.relativePath.replace(/\.webp$/, ".metadata.json"),
      ),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("does not write a gallery when verified metadata is missing", async () => {
  const root = await createRoot();

  try {
    await createImage(root, "thieu-metadata");
    const config = await loadConfig(undefined, { rootDir: root });
    const report = await buildGallery(config);

    assert.equal(report.processed, 0);
    assert.equal(report.manifestWritten, false);
    assert.equal(
      report.issues.some((issue) => issue.code === "METADATA_NOT_FOUND"),
      true,
    );
    await assert.rejects(access(config.galleryPath));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects paths outside the configured repository root", async () => {
  const root = await createRoot();

  try {
    await assert.rejects(
      loadConfig(undefined, { rootDir: root, inputDir: "../outside" }),
      /must stay inside the repository root/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rebuilds the gallery after verified metadata changes", async () => {
  const root = await createRoot();
  let watcher;

  try {
    await createImage(root);
    const metadataPath = path.join(
      root,
      "assets/image-metadata/cua-cong.json",
    );
    await writeFile(
      metadataPath,
      `${JSON.stringify(verifiedMetadata, null, 2)}\n`,
      "utf8",
    );
    const config = await loadConfig(undefined, {
      rootDir: root,
      watchDebounceMs: 100,
    });
    let reportCount = 0;
    let timeout;
    const secondReport = new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error("Watcher did not rebuild in time")),
        5000,
      );
      watcher = startWatcher(config, buildGallery, (report) => {
        reportCount += 1;
        if (reportCount === 2) {
          clearTimeout(timeout);
          resolve(report);
        }
      });
    });

    await watcher.ready;
    await writeFile(
      metadataPath,
      `${JSON.stringify(
        { ...verifiedMetadata, caption: "Caption đã được cập nhật." },
        null,
        2,
      )}\n`,
      "utf8",
    );
    const report = await secondReport;

    assert.equal(report.processed, 1);
    const gallery = JSON.parse(await readFile(config.galleryPath, "utf8"));
    assert.equal(gallery.items[0].caption, "Caption đã được cập nhật.");
  } finally {
    watcher?.close();
    await rm(root, { recursive: true, force: true });
  }
});
