# DSH / UMS -> DHP Free LLM

The DHP Website exposes a stable OpenAI-compatible virtual model named `dhp-free`.

## Client contract

```text
Base URL: https://dai-hai-phat-web.vercel.app/api/v1/llm
API key environment variable: DHP_LLM_API_KEY
Model: dhp-free
Streaming: false
```

DSH Desktop and Universal Master Skills should prefer this provider when configured. UMS remains the orchestrator; the DHP endpoint is only an execution provider.

The upstream model is intentionally hidden behind the DHP Capability Gateway. Free-only requests fail closed when no verified zero-cost cloud route is available. Paid fallback, metered fallback, local LLM fallback, and Ollama fallback are forbidden by project policy.

The production Vercel project must have `DHP_LLM_API_KEY` configured before external clients can authenticate. The value is never committed to this repository.

Verification is complete only after the repository Quality workflows pass and a credentialed client can call `/models` and non-streaming `/chat/completions` successfully.
