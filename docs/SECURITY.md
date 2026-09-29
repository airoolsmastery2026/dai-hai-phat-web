# DHP Security Baseline

## Secrets

Never commit API keys, service-role keys, webhook tokens, admin passwords, session/browser credentials, or private endpoints. Server-only credentials must not use NEXT_PUBLIC_* names.

## Input boundaries

Customer and AI-generated input is untrusted. Validate at the server boundary before persistence or downstream delivery. Format validation is not ownership verification.

## Authentication and authorization

Administrative and service-to-service endpoints must authenticate requests and enforce least privilege. Client-side checks are never the security boundary.

## Logging

Do not log credentials, authorization headers, full customer payloads unless explicitly required and protected, provider secrets, or sensitive request bodies. Prefer structured, minimal operational events.

## External services

Every external provider is an integration boundary. Use explicit timeouts, bounded failure handling, and idempotency for write operations. An external CRM, webhook, AI provider, or automation service must not be the only durable destination for a validated customer inquiry.

## Dependencies

Dependency changes must pass the repository quality gate. Security fixes should be prioritized, but dependency upgrades must still be reviewed for compatibility and lockfile integrity.

## Incident response

If a secret is exposed:
1. revoke or rotate it immediately;
2. remove it from the repository;
3. inspect logs and recent deployments;
4. identify affected systems;
5. document the incident and remediation.

Removing the string from Git is not sufficient if the credential remains valid.
