# DHP bundle for DeepSeek Harness Desktop

This bundle connects the Đại Hải Phát project policy to a dedicated DSH profile while project-local skills live in `.dsh/skills/`.

This is **agent conditioning/orchestration**, not model-weight fine-tuning. DSH receives DHP rules, skills, workspace context, and provider policy without retraining an LLM.

## What is included

- DHP project policy plugin (`dsh-dhp-bundle`)
- Free-cloud-only hard locks
- Project-local DHP skills
- Provider registry for zero-cost cloud routing
- Disabled generic OpenAI-compatible provider slot for future verified providers
- Windows installer for a dedicated `dhp` DSH profile

## Windows / DSH Desktop installation

Open **DSH Terminal** from DSH Desktop. From the repository root run:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\dsh-dhp-bundle\install-dhp-dsh.ps1
```

Equivalent manual commands:

```powershell
dsh plugin --profile dhp add .\tools\dsh-dhp-bundle
dsh --profile dhp --dump-config
```

After a plugin change, restart DSH Desktop and select the `dhp` profile.

## Workspace

Select the root of this repository as the DSH workspace. Project-local skills are stored under:

```text
.dsh/skills/
```

Available DHP skills:

- `dhp-core`
- `dhp-frontend`
- `dhp-debug-verify`
- `dhp-ai-sales`
- `dhp-research`
- `dhp-seo`
- `dhp-estimation`

## Model/provider policy

The routing source of truth is:

```text
.ai/FREE_MODEL_ROUTER.json
```

Required invariants:

- cloud inference only
- verified free tier/free quota first
- capability + quota + health based rotation
- no automatic paid fallback
- no local LLM/Ollama fallback
- if every compatible zero-cost provider is unavailable, stop metered execution rather than incur cost

Provider credentials belong in DSH/provider configuration or environment-backed secret settings. Never commit API keys.

## Adding another free provider

Do not hard-code an unverified provider. First verify its official API documentation, base URL/auth method, model IDs, current free entitlement, streaming/tool compatibility, and whether DSH already supports it through an existing provider adapter.

If a custom adapter is required, follow the DSH `LlmAdapter` contract and register a dedicated provider route. Keep the provider disabled until real-provider verification passes.

## Verification

Before production integration:

1. `dsh --profile dhp --dump-config` succeeds.
2. DSH Desktop boots with the `dhp` profile.
3. The DHP workspace exposes the `.dsh/skills` catalog.
4. A free provider can complete a basic tool-enabled session.
5. Quota/rate-limit failure rotates only to another zero-cost cloud provider.
6. Substantial repository code changes still pass `npm run quality`.
