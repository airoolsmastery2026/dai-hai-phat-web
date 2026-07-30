export interface NetworkLoadingHint {
  saveData?: boolean;
  effectiveType?: string;
}

const CONSERVATIVE_ROOT_MARGIN = "200px 0px";
const BALANCED_ROOT_MARGIN = "500px 0px";
const DEFAULT_ROOT_MARGIN = "800px 0px";

export function getAIOfficeRootMargin(
  connection?: NetworkLoadingHint | null,
): string {
  if (connection?.saveData) return CONSERVATIVE_ROOT_MARGIN;

  switch (connection?.effectiveType) {
    case "slow-2g":
    case "2g":
      return CONSERVATIVE_ROOT_MARGIN;
    case "3g":
      return BALANCED_ROOT_MARGIN;
    default:
      return DEFAULT_ROOT_MARGIN;
  }
}
