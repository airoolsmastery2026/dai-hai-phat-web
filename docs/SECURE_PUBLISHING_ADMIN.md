# Secure Publishing Admin

`/admin/publishing` reuses the existing `/admin/*` Basic Auth boundary.

Social credentials are submitted to same-origin server routes under `/api/admin/publishing/*`, validated and rate-limited, then stored through Supabase RPC into Vault. The browser receives account verification metadata only; stored tokens are never read back into client state.

Supported account onboarding: Facebook, Instagram, TikTok, LinkedIn, Pinterest, YouTube.
