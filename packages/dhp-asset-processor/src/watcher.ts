import { watch, type FSWatcher } from "node:fs";

import type {
  AssetProcessorConfig,
  BuildGallery,
  BuildReport,
} from "./types.js";

export interface AssetWatcher {
  close: () => void;
  ready: Promise<void>;
}

function watchDirectory(
  directory: string,
  onChange: () => void,
): FSWatcher {
  const watcher = watch(directory, { recursive: true }, onChange);
  watcher.on("error", (error) => {
    process.stderr.write(`Asset watcher error: ${error.message}\n`);
  });
  return watcher;
}

export function startWatcher(
  config: AssetProcessorConfig,
  buildGallery: BuildGallery,
  onReport: (report: BuildReport) => void,
): AssetWatcher {
  let timer: NodeJS.Timeout | undefined;
  let building = false;
  let queued = false;
  let closed = false;

  const rebuild = async (): Promise<void> => {
    if (building) {
      queued = true;
      return;
    }

    building = true;
    try {
      onReport(await buildGallery(config));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`Asset build failed: ${message}\n`);
    } finally {
      building = false;
      if (queued && !closed) {
        queued = false;
        void rebuild();
      }
    }
  };

  const schedule = (): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => void rebuild(), config.watchDebounceMs);
  };

  const watchers = [
    watchDirectory(config.inputDir, schedule),
    watchDirectory(config.metadataDir, schedule),
  ];
  const ready = rebuild();

  return {
    ready,
    close: () => {
      closed = true;
      if (timer) {
        clearTimeout(timer);
      }
      for (const watcher of watchers) {
        watcher.close();
      }
    },
  };
}
