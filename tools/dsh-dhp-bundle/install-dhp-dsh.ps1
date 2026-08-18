$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$BundlePath = Join-Path $RepoRoot 'tools\dsh-dhp-bundle'
$RouterPath = Join-Path $RepoRoot '.ai\FREE_MODEL_ROUTER.json'
$SkillsPath = Join-Path $RepoRoot '.dsh\skills'

if (-not (Get-Command dsh -ErrorAction SilentlyContinue)) {
  throw 'DSH CLI was not found. Open the DSH Terminal from DSH Desktop and run this script there.'
}

if (-not (Test-Path $RouterPath)) {
  throw "DHP router policy not found: $RouterPath"
}

if (-not (Test-Path $SkillsPath)) {
  throw "DHP skills directory not found: $SkillsPath"
}

$Router = Get-Content $RouterPath -Raw | ConvertFrom-Json
if ($Router.mode -ne 'free-cloud-only') {
  throw 'DHP router must remain in free-cloud-only mode.'
}
if ($Router.hardLocks.localRuntime -ne $false) {
  throw 'DHP local runtime lock must remain false.'
}
if ($Router.hardLocks.paidApiAutoUse -ne $false -or $Router.hardLocks.meteredFallback -ne $false) {
  throw 'DHP automatic paid/metered fallback must remain disabled.'
}

Push-Location $RepoRoot
try {
  Write-Host '[DHP] Installing DSH bundle into profile: dhp'
  dsh plugin --profile dhp add $BundlePath

  Write-Host '[DHP] Verifying composed DSH profile...'
  dsh --profile dhp --dump-config

  Write-Host '[DHP] DSH profile prepared successfully.'
  Write-Host '[DHP] Restart DSH Desktop after changing plugins, then select the dhp profile.'
}
finally {
  Pop-Location
}
