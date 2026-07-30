const AI_OFFICE_LINK_SELECTOR = 'a[href$="#ai-office"]';

export function isAIOfficeLinkIntent(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest(AI_OFFICE_LINK_SELECTOR))
  );
}
