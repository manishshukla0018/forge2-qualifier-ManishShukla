$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$required = @('README.md','ARCHITECTURE.md','agent-log.md','openclaw.json','hermes-config.yaml','.env.example','skills/hermes-orchestrator/SKILL.md','backend/composer.json','backend/.env.example','frontend/package.json','frontend/.env.example')
$missing = $required | Where-Object { -not (Test-Path (Join-Path $root $_)) }
if ($missing) { Write-Error "Missing required files: $($missing -join ', ')" }
Get-Content -Raw (Join-Path $root 'openclaw.json') | ConvertFrom-Json | Out-Null
$matches = git -C $root grep -n -I -E 'xox[baprs]-[A-Za-z0-9-]{10,}|gsk_[A-Za-z0-9]{10,}|AIza[A-Za-z0-9_-]{20,}' -- . ':(exclude)scripts/verify-submission.ps1'
if ($LASTEXITCODE -eq 0 -and $matches) { Write-Error "Possible committed secret detected:`n$matches" }
Write-Host 'Repository artifact checks passed.' -ForegroundColor Green
Write-Host 'External Slack, agent, video, and live-service evidence still needs manual verification.' -ForegroundColor Yellow
exit 0
