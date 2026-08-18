# Universal Master Skills provider contract

Universal Master Skills remains the orchestrator. The DHP LLM facade is an execution provider, not a replacement orchestrator.

Use this provider contract when an OpenAI-compatible provider entry is supported:

```text
id: dhp-free
base_url: https://dai-hai-phat-web.vercel.app/api/v1/llm
api_key_env: DHP_LLM_API_KEY
model: dhp-free
stream: false
```

Policy requirements:

- free-cloud-only
- no local/Ollama fallback
- no automatic paid or metered fallback
- preserve UMS task state and repository context across provider rotation
- fail closed when the DHP gateway cannot prove an eligible zero-cost route

Provider credentials remain operator-side secrets and must not be written into skills or repository files.
