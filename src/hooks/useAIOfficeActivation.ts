"use client";

import { useEffect, useRef, useState } from "react";

import {
  getAIOfficeRootMargin,
  type NetworkLoadingHint,
} from "@/lib/performance/ai-office-loading";

const AI_OFFICE_HASH = "#ai-office";

type NavigatorWithConnection = Navigator & {
  connection?: NetworkLoadingHint;
};

export function useAIOfficeActivation() {
  const activationRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) return;

    const activateFromHash = () => {
      if (window.location.hash === AI_OFFICE_HASH) {
        setIsActive(true);
      }
    };

    activateFromHash();
    if (window.location.hash === AI_OFFICE_HASH) return;

    const target = activationRef.current;
    if (!target || !("IntersectionObserver" in window)) {
      setIsActive(true);
      return;
    }

    const connection = (navigator as NavigatorWithConnection).connection;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: getAIOfficeRootMargin(connection) },
    );

    observer.observe(target);
    window.addEventListener("hashchange", activateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", activateFromHash);
    };
  }, [isActive]);

  return { activationRef, isActive };
}
