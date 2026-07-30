"use client";

import { useEffect, useRef, useState } from "react";

const AI_OFFICE_HASH = "#ai-office";
const AI_OFFICE_ROOT_MARGIN = "800px 0px";

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

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: AI_OFFICE_ROOT_MARGIN },
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
