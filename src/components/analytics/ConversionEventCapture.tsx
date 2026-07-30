"use client";

import { useEffect } from "react";

import {
  getAnalyticsServicePreset,
  trackConversionEvent,
} from "@/lib/analytics/conversion";

function getTrackedAnchor(target: EventTarget | null) {
  return target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
}

export function ConversionEventCapture() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = getTrackedAnchor(event.target);
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      const sourcePath = window.location.pathname;

      if (rawHref.startsWith("tel:")) {
        trackConversionEvent("phone_clicked", { sourcePath });
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.hostname === "zalo.me") {
        trackConversionEvent("zalo_clicked", { sourcePath });
        return;
      }

      if (url.hash !== "#ai-office") return;

      const service = getAnalyticsServicePreset(url.searchParams.get("service"));
      trackConversionEvent("ai_intake_opened", {
        sourcePath,
        ...(service ? { service } : {}),
      });

      if (service) {
        trackConversionEvent("service_preset_selected", {
          sourcePath,
          service,
        });
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
