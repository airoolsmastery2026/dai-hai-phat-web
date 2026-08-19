import {
  confirmSpaceCandidate,
  type ConfirmedSpaceEnvelope,
  SpaceConfirmationError,
  verifyConfirmedSpace,
} from "@/lib/ai/space-confirmation";
import { hasStrictSpaceModelShape } from "@/lib/ai/space-model-shape";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

export async function confirmSpaceCandidateAtBoundary(
  input: unknown,
  sealKey: string,
): Promise<ConfirmedSpaceEnvelope> {
  const request = asRecord(input);
  const candidate = asRecord(request?.candidate);
  if (!candidate || !hasStrictSpaceModelShape(candidate.model)) {
    throw new SpaceConfirmationError(
      "Candidate Space Model chứa field ngoài schema hoặc shape không hợp lệ.",
      "INVALID_CANDIDATE",
    );
  }

  return confirmSpaceCandidate(input, sealKey);
}

export async function verifyConfirmedSpaceAtBoundary(
  input: unknown,
  sealKey: string,
): Promise<ConfirmedSpaceEnvelope> {
  const envelope = asRecord(input);
  if (!envelope || !hasStrictSpaceModelShape(envelope.model)) {
    throw new SpaceConfirmationError(
      "Confirmed Space Model chứa field ngoài schema hoặc shape không hợp lệ.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }

  return verifyConfirmedSpace(input, sealKey);
}
