# DHP Strix Security Engine

Strix is integrated into Dai Hai Phat as an optional, local-first security verification tool. It is **not** part of the Next.js application runtime and does not change the DHP architecture.

Upstream repository: https://github.com/usestrix/strix

## DHP command

From the `dai-hai-phat-web` repository root:

```bash
npm run security:strix
```

The DHP wrapper:

- scans only the current local `dai-hai-phat-web` repository;
- runs Strix non-interactively in `quick` mode by default;
- requires Docker to be running;
- defaults to local LLM providers only;
- applies `security/strix/instruction.md` as the authorized defensive scope;
- writes Strix artifacts to `strix_runs/`, which is ignored by Git.

## 1. Prerequisites

Install and start Docker Desktop/Docker Engine.

Install Strix using one of its official methods:

### macOS / Linux

```bash
curl -sSL https://strix.ai/install | bash
```

### Cross-platform Python / pipx

```bash
pipx install strix-agent
```

Verify:

```bash
strix --version
docker info
```

## 2. $0 local model with Ollama

Install Ollama, then pull a model supported by your hardware. Strix currently documents Qwen3 VL as one of its recommended local choices:

```bash
ollama pull qwen3-vl
```

### macOS / Linux shell

```bash
export STRIX_LLM="ollama/qwen3-vl"
export LLM_API_BASE="http://localhost:11434"
npm run security:strix
```

### Windows PowerShell

```powershell
$env:STRIX_LLM="ollama/qwen3-vl"
$env:LLM_API_BASE="http://localhost:11434"
npm run security:strix
```

No LLM API key is required for the local Ollama path.

## 3. LM Studio or another local OpenAI-compatible server

Start the local server first, then point Strix at its localhost endpoint.

Example macOS/Linux:

```bash
export STRIX_LLM="openai/local-model"
export LLM_API_BASE="http://localhost:1234/v1"
npm run security:strix
```

Example Windows PowerShell:

```powershell
$env:STRIX_LLM="openai/local-model"
$env:LLM_API_BASE="http://localhost:1234/v1"
npm run security:strix
```

## 4. Scan modes

Default:

```bash
npm run security:strix
```

To request another supported Strix scan mode, set `DHP_STRIX_SCAN_MODE` before running.

macOS/Linux:

```bash
DHP_STRIX_SCAN_MODE=standard npm run security:strix
```

PowerShell:

```powershell
$env:DHP_STRIX_SCAN_MODE="standard"
npm run security:strix
```

Use `quick` for routine checks. Larger modes consume more time and local compute.

## 5. Run Strix independently from DHP

For another codebase that you own or are explicitly authorized to test, open a terminal in its parent directory and run Strix directly:

```bash
strix -n -t ./your-project --scan-mode quick
```

Strix normally stores reports under `strix_runs/<run-name>/`.

Typical artifacts include the assessment report, structured vulnerability data, SARIF output, and run metadata.

## 6. DHP safety / cost lock

The DHP runner rejects remote LLM providers by default. This prevents an accidental switch from the intended local `$0` path to a metered API.

If `STRIX_LLM` is unset, Strix is missing, Docker is stopped, or the current folder is not the DHP repository, the wrapper exits without starting a scan.

## Files added for the integration

```text
security/strix/README.md
security/strix/instruction.md
scripts/run-strix.mjs
```

And two existing files are connected to the integration:

```text
package.json   -> npm run security:strix
.gitignore     -> strix_runs/
```

## Maintenance rule

Strix remains an external security engine. Do not copy its source into the DHP application and do not make the website depend on Strix at runtime. Upgrade Strix independently when needed.
