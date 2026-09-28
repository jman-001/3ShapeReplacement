param(
    [ValidateRange(1, 65535)]
    [int]$Port = 4848
)

$projectRoot = $PSScriptRoot
$siteUrl = "http://localhost:$Port"
$healthUrl = "$siteUrl/__health"

function Test-SiteServer {
    try {
        $response = Invoke-WebRequest `
            -Uri $healthUrl `
            -UseBasicParsing `
            -TimeoutSec 1

        return $response.StatusCode -eq 200 -and $response.Content -eq "ok"
    } catch {
        return $false
    }
}

if (-not (Test-SiteServer)) {
    $powershellCommand = Get-Command powershell.exe -ErrorAction Stop
    $serverScript = Join-Path $projectRoot "serve.ps1"
    $serverArguments =
        "-NoProfile -ExecutionPolicy Bypass -File `"$serverScript`" -Port $Port"

    Start-Process `
        -FilePath $powershellCommand.Source `
        -ArgumentList $serverArguments `
        -WorkingDirectory $projectRoot `
        -WindowStyle Hidden

    $serverReady = $false

    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        Start-Sleep -Milliseconds 150

        if (Test-SiteServer) {
            $serverReady = $true
            break
        }
    }

    if (-not $serverReady) {
        Add-Type -AssemblyName PresentationFramework
        [System.Windows.MessageBox]::Show(
            "The local server could not be started. Check that port $Port is available.",
            "3Shape Replacement"
        ) | Out-Null
        exit 1
    }
}

Start-Process $siteUrl
