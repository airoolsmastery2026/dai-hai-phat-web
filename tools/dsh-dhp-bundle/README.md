# DHP bundle for DeepSeek Harness Desktop

This bundle connects the Đại Hải Phát project policy to a dedicated DSH profile while project-local skills live in `.dsh/skills/`.

This is agent conditioning/orchestration, not model-weight fine-tuning. DSH receives DHP rules, skills, workspace context, and provider policy without retraining an LLM.

## Preferred LLM provider

Use the DHP virtual provider first:

```text
Provider type: OpenAI-compatible
Base URL: https://dai-hai-phat-web.vercel.app/api/v1/llm
API key: DHP_LLM_API_KEY
Model: dhp-free
Streaming: off for v1
```

`dhp-free` keeps upstream model selection behind the DHP Capability Gateway. A successful runtime response must remain verified zero-cost. When no eligible zero-cost route is available, execution fails closed rather than switching to paid or local inference.

## What is included

- DHP project policy plugin (`dsh-dhp-bundle`)
- Free-cloud-only hard locks
- Project-local DHP skills
- Provider registry with `dhp-free` as the preferred provider
- Cloud-provider alternates governed by the canonical router policy
- Windows installer for a dedicated `dhp` DSH profile

## Windows / DSH Desktop installation

Open DSH Terminal from DSH Desktop. From the repository root run:

```powershell
$env:DHP_LLM_API_KEY = '<operator-provided-key>'
powershell -ExecutionPolicy Bypass -File .\tools\dsh-dhp-bundle\install-dhp-dsh.ps1
```

The key is operator-side configuration and must never be committed to Git.

Equivalent plugin verification:

```powershell
dsh plugin --profile dhp add .\tools\dsh-dhp-bundle
dsh --profile dhp --dump-config
```

After a plugin change, restart DSH Desktop and select the `dhp` profile.

## Workspace

Select the root of this repository as the DSH workspace. Project-local skills are stored under `.dsh/skills/`.

Available DHP skills:

- `dhp-core`
- `dhp-frontend`
- `dhp-debug-verify`
- `dhp-ai-sales`
- `dhp-research`
- `dhp-seo`
- `dhp-estimation`

## Model/provider policy

The routing source of truth is `.ai/FREE_MODEL_ROUTER.json`.

Required invariants:

- cloud inference only
- `dhp-free` preferred when configured
- verified free tier/free quota only in free-only mode
- capability + quota + health based rotation behind DHP runtime
- no automatic paid fallback
- no local LLM/Ollama fallback
- if every compatible zero-cost provider is unavailable, stop metered execution rather than incur cost

## Verification

Before claiming the DSH integration is operational:

1. `dsh --profile dhp --dump-config` succeeds.
2. DSH Desktop boots with the `dhp` profile.
3. The DHP workspace exposes the `.dsh/skills` catalog.
4. `GET /api/v1/llm/models` returns `dhp-free` with a valid operator key.
5. A non-streaming `POST /api/v1/llm/chat/completions` succeeds with model `dhp-free`.
6. Quota/rate-limit failure never activates paid or local inference.
7. Substantial repository code changes pass `npm run quality`.
