$ErrorActionPreference = "Stop"

$Container = "prelegal"

$running = docker ps -q -f name=$Container
if ($running) {
    docker stop $Container | Out-Null
    docker rm $Container | Out-Null
    Write-Host "PreLegal stopped."
} else {
    Write-Host "PreLegal is not running."
}
