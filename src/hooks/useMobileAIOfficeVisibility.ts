"use client";

import { useEffect, useState } from "react";

export function useMobileAIOfficeVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateVisibility = () => {
      animationFrame = null;
      const office = document.getElementById("ai-office");
      const bounds = office?.getBoundingClientRect();
      const nextVisibility = Boolean(
        window.innerWidth < 1024 &&
          bounds &&
          bounds.bottom > 0 &&
          bounds.top < window.innerHeight,
      );
      setIsVisible((currentVisibility) =>
        currentVisibility === nextVisibility
          ? currentVisibility
          : nextVisibility,
      );
    };

    const scheduleVisibilityUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", scheduleVisibilityUpdate, { passive: true });
    window.addEventListener("resize", scheduleVisibilityUpdate);
    window.addEventListener("hashchange", scheduleVisibilityUpdate);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleVisibilityUpdate);
      window.removeEventListener("resize", scheduleVisibilityUpdate);
      window.removeEventListener("hashchange", scheduleVisibilityUpdate);
    };
  }, []);

  return isVisible;
}
