"use client";

import { useCallback, useState } from "react";

import { useAI as useBaseAI } from "./useAI";
import { validateProjectImageFiles } from "@/lib/ai/image-upload";

export function useAI() {
  const base = useBaseAI();
  const { addImages: addBaseImages, reset: resetBase } = base;
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);

  const addImages = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      try {
        validateProjectImageFiles(Array.from(files));
        setImageValidationError(null);
        await addBaseImages(files);
      } catch (error) {
        setImageValidationError(
          error instanceof Error ? error.message : "Không thể kiểm tra ảnh hiện trạng.",
        );
      }
    },
    [addBaseImages],
  );

  const reset = useCallback(() => {
    setImageValidationError(null);
    resetBase();
  }, [resetBase]);

  return {
    ...base,
    error: imageValidationError ?? base.error,
    addImages,
    reset,
  };
}
