"use client";

import { useEffect, useRef, useState } from "react";

import {
  getAIOfficeRootMargin,
  type NetworkLoadingHint,
} from "@/lib/performance/ai-office-loading";

const AI_OFFICE_HASH = "#ai-office";
const AI_OFFICE_LINK_SELECTOR = 'a[href$="#ai-office"]';

type NavigatorWithConnection = Navigator & {
  connection?: NetworkLoadingHint;
};

function isAIOfficeLinkIntent(event: Event): boolean {
  return (
    event.target instanceof Element &&
    Boolean(event.target.closest(AI_OFFICE_LINK_SELECTOR))
  );
}

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
    const activateFromIntent = (event: Event) => {
      if (isAIOfficeLinkIntent(event)) {
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
    document.addEventListener("pointerdown", activateFromIntent);
    document.addEventListener("focusin", activateFromIntent);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", activateFromHash);
      document.removeEventListener("pointerdown", activateFromIntent);
      document.removeEventListener("focusin", activateFromIntent);
    };
  }, [isActive]);

  return { activationRef, isActive };
}
