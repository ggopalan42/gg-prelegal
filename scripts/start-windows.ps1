$ErrorActionPreference = "Stop"

$Image = "prelegal:latest"
$Container = "prelegal"
$DataDir = "$env:USERPROFILE\.prelegal\data"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path (Split-Path -Parent $ScriptDir) ".env"

if (-not (Test-Path $DataDir)) {
    New-Item -ItemType Directory -Force -Path $DataDir | Out-Null
}

$running = docker ps -q -f name=$Container
if ($running) {
    Write-Host "PreLegal is already running at http://localhost:8000"
    exit 0
}

$existing = docker ps -aq -f name=$Container
if ($existing) {
    docker rm $Container | Out-Null
}

docker run -d `
    --name $Container `
    -p 8000:8000 `
    -v "${DataDir}:/data" `
    --env-file $EnvFile `
    $Image

Write-Host "PreLegal started at http://localhost:8000"
