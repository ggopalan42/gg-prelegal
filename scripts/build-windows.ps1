$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Write-Host "Building prelegal:latest..."
docker build -t prelegal:latest $ProjectDir
Write-Host "Build complete."
