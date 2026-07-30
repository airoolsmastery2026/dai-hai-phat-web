const REQUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i;

export function formatSupportReference(message: string, requestId: string): string {
  const normalizedMessage = message.trim();
  const normalizedRequestId = requestId.trim();

  if (!REQUEST_ID_PATTERN.test(normalizedRequestId)) {
    return normalizedMessage;
  }

  return `${normalizedMessage} Mã hỗ trợ: ${normalizedRequestId}.`;
}
