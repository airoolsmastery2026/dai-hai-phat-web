param(
  [string]$DhpLlmBaseUrl = 'https://dai-hai-phat-web.vercel.app/api/v1/llm'
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$BundlePath = Join-Path $RepoRoot 'tools\dsh-dhp-bundle'
$RouterPath = Join-Path $RepoRoot '.ai\FREE_MODEL_ROUTER.json'
$RegistryPath = Join-Path $BundlePath 'provider-registry.json'
$SkillsPath = Join-Path $RepoRoot '.dsh\skills'

if (-not (Get-Command dsh -ErrorAction SilentlyContinue)) {
  throw 'DSH CLI was not found. Open the DSH Terminal from DSH Desktop and run this script there.'
}

foreach ($RequiredPath in @($RouterPath, $RegistryPath, $SkillsPath)) {
  if (-not (Test-Path $RequiredPath)) {
    throw "Required DHP integration path not found: $RequiredPath"
  }
}

$Router = Get-Content $RouterPath -Raw | ConvertFrom-Json
$Registry = Get-Content $RegistryPath -Raw | ConvertFrom-Json
if ($Router.mode -ne 'free-cloud-only') {
  throw 'DHP router must remain in free-cloud-only mode.'
}
if ($Router.hardLocks.localRuntime -ne $false) {
  throw 'DHP local runtime lock must remain false.'
}
if ($Router.hardLocks.paidApiAutoUse -ne $false -or $Router.hardLocks.meteredFallback -ne $false) {
  throw 'DHP automatic paid/metered fallback must remain disabled.'
}
if ($Registry.preferredProvider -ne 'dhp-free') {
  throw 'DHP provider registry must prefer dhp-free.'
}
if (-not $env:DHP_LLM_API_KEY) {
  Write-Warning 'DHP_LLM_API_KEY is not set in this terminal. The bundle can install, but dhp-free calls will fail closed until the key is configured.'
}

Push-Location $RepoRoot
try {
  Write-Host '[DHP] Installing DSH bundle into profile: dhp'
  Write-Host "[DHP] LLM base URL: $DhpLlmBaseUrl"
  dsh plugin --profile dhp add $BundlePath

  Write-Host '[DHP] Verifying composed DSH profile...'
  dsh --profile dhp --dump-config

  Write-Host '[DHP] DSH profile prepared successfully.'
  Write-Host '[DHP] Configure an OpenAI-compatible provider with model dhp-free and API key from DHP_LLM_API_KEY if DSH does not auto-map provider-registry.json.'
  Write-Host '[DHP] Restart DSH Desktop after changing plugins, then select the dhp profile.'
}
finally {
  Pop-Location
}
