"use client";

import { useAIOfficeRootEffect } from "@/hooks/useAIOfficeRootEffect";
import {
  getAnalyticsServicePreset,
  trackConversionEvent,
  type ConversionEventName,
} from "@/lib/analytics/conversion";

const COMPLETION_TEXT = "Hồ sơ trên thiết bị đã hoàn tất.";
const HANDOFF_SUCCESS_TEXT = "Đã bàn giao hồ sơ cho đội ngũ kỹ thuật.";
const HANDOFF_ERROR_TEXT = "Chưa thể bàn giao tự động.";

export function AIFunnelEventController({ service }: { service?: string }) {
  useAIOfficeRootEffect((root) => {
    const sourcePath = window.location.pathname;
    const analyticsService = getAnalyticsServicePreset(service ?? null);
    const emitted = new Set<ConversionEventName>();
    let stepCount = 0;
    let intakeCompleted = false;

    const emit = (name: ConversionEventName, once = true) => {
      if (once && emitted.has(name)) return;
      if (once) emitted.add(name);
      trackConversionEvent(name, {
        sourcePath,
        ...(analyticsService ? { service: analyticsService } : {}),
      });
    };

    const inspectRenderedState = () => {
      const text = root.textContent ?? "";
      if (text.includes(COMPLETION_TEXT)) {
        intakeCompleted = true;
        emit("ai_intake_completed");
      }
      if (text.includes(HANDOFF_SUCCESS_TEXT)) emit("crm_handoff_succeeded");
      if (text.includes(HANDOFF_ERROR_TEXT)) emit("crm_handoff_failed");
    };

    const recordStep = () => {
      stepCount += 1;
      trackConversionEvent("ai_step_completed", {
        sourcePath,
        ...(analyticsService ? { service: analyticsService } : {}),
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest("button");
      if (!button || !root.contains(button)) return;

      const label = button.textContent?.trim() ?? "";
      if (label === "Bàn giao cho kỹ sư") {
        emit("crm_handoff_started");
        return;
      }

      if (
        label === "Ghi nhận dữ liệu" ||
        label === "Cần hỗ trợ đo" ||
        label === "Bỏ qua" ||
        button.closest('[class*="sm:grid-cols-2"]')
      ) {
        recordStep();
      }
    };

    const handleChange = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !root.contains(target)) return;

      if (target.id === "crm-handoff-consent" && target.checked) {
        emit("handoff_consent_given");
        return;
      }

      if (target.type === "file" && target.files?.length) {
        recordStep();
      }
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      if (event.persisted || stepCount === 0 || intakeCompleted) return;
      emit("intake_abandoned");
    };

    const observer = new MutationObserver(inspectRenderedState);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    root.addEventListener("click", handleClick);
    root.addEventListener("change", handleChange);
    window.addEventListener("pagehide", handlePageHide);
    inspectRenderedState();

    return () => {
      observer.disconnect();
      root.removeEventListener("click", handleClick);
      root.removeEventListener("change", handleChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [service]);

  return null;
}
