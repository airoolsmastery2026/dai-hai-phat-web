"use client";

import { useEffect } from "react";

import {
  ATTRIBUTION_COOKIE_NAME,
  ATTRIBUTION_RETENTION_SECONDS,
  captureFirstTouchAttribution,
  serializeLeadAttribution,
} from "@/lib/marketing/attribution";

function externalReferrer(): string {
  if (!document.referrer) return "";
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin ? "" : referrer.toString();
  } catch {
    return "";
  }
}

export function LeadAttributionCapture() {
  useEffect(() => {
    const attribution = captureFirstTouchAttribution(
      window.location,
      externalReferrer(),
      window.localStorage,
    );
    if (!attribution) return;

    document.cookie = [
      `${ATTRIBUTION_COOKIE_NAME}=${serializeLeadAttribution(attribution)}`,
      "Path=/",
      `Max-Age=${ATTRIBUTION_RETENTION_SECONDS}`,
      "SameSite=Lax",
      window.location.protocol === "https:" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");
  }, []);

  return null;
}
