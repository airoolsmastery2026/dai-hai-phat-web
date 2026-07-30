"use client";

import { useEffect, type DependencyList } from "react";

type AIOfficeRootEffect = (root: HTMLElement) => void | (() => void);

export function useAIOfficeRootEffect(
  effect: AIOfficeRootEffect,
  dependencies: DependencyList,
) {
  useEffect(() => {
    const root = document.getElementById("ai-office");
    if (!root) return;

    return effect(root);
    // The caller owns the dependency list, matching React's useEffect contract.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
