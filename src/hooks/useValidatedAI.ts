"use client";

import { useCallback, useState } from "react";

import { useAI as useBaseAI } from "./useAI";
import { validateProjectImageFiles } from "@/lib/ai/image-upload";

export function useAI() {
  const base = useBaseAI();
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);

  const addImages = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      try {
        validateProjectImageFiles(Array.from(files));
        setImageValidationError(null);
        await base.addImages(files);
      } catch (error) {
        setImageValidationError(
          error instanceof Error ? error.message : "Không thể kiểm tra ảnh hiện trạng.",
        );
      }
    },
    [base.addImages],
  );

  const reset = useCallback(() => {
    setImageValidationError(null);
    base.reset();
  }, [base.reset]);

  return {
    ...base,
    error: imageValidationError ?? base.error,
    addImages,
    reset,
  };
}
