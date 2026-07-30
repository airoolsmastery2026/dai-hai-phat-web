"use client";

import { useRef, useState } from "react";

import { useAIOfficeRootEffect } from "@/hooks/useAIOfficeRootEffect";

const RESET_LABEL = "Xóa hồ sơ đã lưu và bắt đầu lại";
const INTERACTIVE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
].join(",");

function getConversationPanel(section: HTMLElement) {
  const resetButton = section.querySelector<HTMLButtonElement>(
    `button[aria-label="${RESET_LABEL}"]`,
  );

  return resetButton?.parentElement?.parentElement ?? null;
}

function getCurrentQuestion(panel: HTMLElement) {
  return panel.querySelector<HTMLHeadingElement>("h3");
}

function getQuestionControls(panel: HTMLElement) {
  return Array.from(panel.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)).filter(
    (element) => element.getAttribute("aria-label") !== RESET_LABEL,
  );
}

export function AIOfficeAccessibilityController() {
  const [announcement, setAnnouncement] = useState("");
  const lastQuestionRef = useRef("");
  const interactionStartedRef = useRef(false);

  useAIOfficeRootEffect((section) => {
    const markInteraction = () => {
      interactionStartedRef.current = true;
    };

    const enhanceConversation = () => {
      const panel = getConversationPanel(section);
      if (!panel) return;

      panel.dataset.aiConversationPanel = "true";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-label", "Hội thoại lập hồ sơ kỹ thuật");

      const question = getCurrentQuestion(panel);
      const prompt = question?.textContent?.trim() ?? "";
      if (!prompt || prompt === lastQuestionRef.current) return;

      lastQuestionRef.current = prompt;
      setAnnouncement(`Câu hỏi mới: ${prompt}`);

      const shouldMoveFocus =
        interactionStartedRef.current || window.location.hash === "#ai-office";
      if (!shouldMoveFocus) return;

      window.requestAnimationFrame(() => {
        const firstControl = getQuestionControls(panel)[0];
        firstControl?.focus({ preventScroll: true });
      });
    };

    section.addEventListener("click", markInteraction, true);
    section.addEventListener("input", markInteraction, true);
    section.addEventListener("change", markInteraction, true);

    enhanceConversation();
    const observer = new MutationObserver(enhanceConversation);
    observer.observe(section, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      section.removeEventListener("click", markInteraction, true);
      section.removeEventListener("input", markInteraction, true);
      section.removeEventListener("change", markInteraction, true);
    };
  }, []);

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </p>
  );
}
