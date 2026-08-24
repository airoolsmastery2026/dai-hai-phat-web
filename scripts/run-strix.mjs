import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const packagePath = resolve(repoRoot, "package.json");

function fail(message) {
  console.error(`\n[DHP Strix] ${message}\n`);
  process.exit(1);
}

if (!existsSync(packagePath)) {
  fail("Run this command from the dai-hai-phat-web repository root.");
}

const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
if (pkg.name !== "dai-hai-phat-web") {
  fail("Refusing to scan: current directory is not the DHP repository.");
}

const model = process.env.STRIX_LLM ?? "";
const apiBase = process.env.LLM_API_BASE ?? process.env.OLLAMA_API_BASE ?? "";
const allowRemote = process.env.DHP_STRIX_ALLOW_REMOTE === "1";
const isLocalModel =
  model.startsWith("ollama/") ||
  /localhost|127\.0\.0\.1/i.test(apiBase);

if (!model) {
  fail(
    'STRIX_LLM is not set. For the default $0 local mode, run Ollama and set STRIX_LLM="ollama/<model>".'
  );
}

if (!isLocalModel && !allowRemote) {
  fail(
    "Remote LLM providers are blocked by default. Use a local Ollama/LM Studio endpoint, or explicitly set DHP_STRIX_ALLOW_REMOTE=1 if you intentionally choose a remote provider."
  );
}

const strixCheck = spawnSync("strix", ["--version"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (strixCheck.status !== 0) {
  fail("Strix CLI was not found. Install it first; see security/strix/README.md.");
}

const dockerCheck = spawnSync("docker", ["info"], {
  stdio: "ignore",
  shell: process.platform === "win32",
});
if (dockerCheck.status !== 0) {
  fail("Docker is not running. Start Docker Desktop/Docker Engine, then retry.");
}

const scanMode = process.env.DHP_STRIX_SCAN_MODE || "quick";
const instructionFile = resolve(repoRoot, "security/strix/instruction.md");

console.log(`[DHP Strix] Target: ${repoRoot}`);
console.log(`[DHP Strix] Model: ${model}`);
console.log(`[DHP Strix] Scan mode: ${scanMode}`);
console.log("[DHP Strix] Authorized scope: this local DHP repository only.\n");

const args = [
  "-n",
  "-t",
  repoRoot,
  "--scan-mode",
  scanMode,
  "--instruction-file",
  instructionFile,
];

const run = spawnSync("strix", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  cwd: repoRoot,
  env: process.env,
});

if (run.error) {
  fail(run.error.message);
}

process.exit(run.status ?? 1);
