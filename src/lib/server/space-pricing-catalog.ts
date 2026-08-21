import pricingData from "../../../knowledge/pricing.json";

import type { SpaceBoqPricingCatalog } from "@/lib/ai/space-boq";

/**
 * G7 reads the existing knowledge/pricing.json contract through this server-only
 * boundary. It never accepts client-provided unit prices and never treats the
 * reference catalog as an official quotation source.
 */
export function getSpacePricingCatalog(): SpaceBoqPricingCatalog {
  return pricingData as unknown as SpaceBoqPricingCatalog;
}
