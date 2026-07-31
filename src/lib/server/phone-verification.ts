const NUMBER_VERIFICATION_ENDPOINT =
  "https://api.apilayer.com/number_verification/validate";
const PHONE_VERIFICATION_TIMEOUT_MS = 3_500;

export type PhoneVerificationStatus = "verified" | "invalid" | "unverified";

export interface PhoneVerificationResult {
  provider: "apilayer";
  status: PhoneVerificationStatus;
  internationalFormat?: string;
  countryCode?: string;
  carrier?: string;
  lineType?: string;
  reason?: "not_configured" | "timeout" | "upstream" | "invalid_response";
}

interface APILayerPhoneResponse {
  valid?: unknown;
  international_format?: unknown;
  country_code?: unknown;
  carrier?: unknown;
  line_type?: unknown;
}

function optionalString(value: unknown, maxLength: number): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : undefined;
}

export async function verifyPhoneWithAPILayer(
  phone: string,
): Promise<PhoneVerificationResult> {
  const apiKey = process.env.APILAYER_API_KEY?.trim();
  if (!apiKey) {
    return {
      provider: "apilayer",
      status: "unverified",
      reason: "not_configured",
    };
  }

  const url = new URL(NUMBER_VERIFICATION_ENDPOINT);
  url.searchParams.set("number", phone);
  if (!phone.trim().startsWith("+")) {
    url.searchParams.set("country_code", "VN");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    PHONE_VERIFICATION_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { apikey: apiKey },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      return {
        provider: "apilayer",
        status: "unverified",
        reason: "upstream",
      };
    }

    const payload = (await response.json()) as APILayerPhoneResponse;
    if (typeof payload.valid !== "boolean") {
      return {
        provider: "apilayer",
        status: "unverified",
        reason: "invalid_response",
      };
    }
    if (!payload.valid) {
      return { provider: "apilayer", status: "invalid" };
    }

    return {
      provider: "apilayer",
      status: "verified",
      internationalFormat: optionalString(payload.international_format, 32),
      countryCode: optionalString(payload.country_code, 3),
      carrier: optionalString(payload.carrier, 100),
      lineType: optionalString(payload.line_type, 32),
    };
  } catch (error) {
    return {
      provider: "apilayer",
      status: "unverified",
      reason:
        error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : "upstream",
    };
  } finally {
    clearTimeout(timeout);
  }
}
