param(
    [ValidateRange(1, 65535)]
    [int]$Port = 4848
)

$projectRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$rootPrefix = $projectRoot.TrimEnd('\') + '\'
$listener = New-Object Net.Sockets.TcpListener -ArgumentList @(
    [Net.IPAddress]::Loopback,
    $Port
)
$utf8 = New-Object Text.UTF8Encoding($false)

$mimeTypes = @{
    '.css'  = 'text/css; charset=utf-8'
    '.csv'  = 'text/csv; charset=utf-8'
    '.docx' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    '.exe'  = 'application/octet-stream'
    '.html' = 'text/html; charset=utf-8'
    '.ico'  = 'image/x-icon'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.js'   = 'text/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.msi'  = 'application/octet-stream'
    '.pdf'  = 'application/pdf'
    '.png'  = 'image/png'
    '.txt'  = 'text/plain; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.xlsx' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    '.zip'  = 'application/zip'
}

function Send-Response {
    param(
        [IO.Stream]$Stream,
        [string]$Method,
        [int]$StatusCode,
        [string]$StatusText,
        [byte[]]$Body,
        [string]$ContentType = 'text/plain; charset=utf-8'
    )

    $headers = @(
        "HTTP/1.1 $StatusCode $StatusText"
        "Content-Type: $ContentType"
        "Content-Length: $($Body.Length)"
        'Cache-Control: no-cache'
        'Connection: close'
        ''
        ''
    ) -join "`r`n"
    $headerBytes = $utf8.GetBytes($headers)

    $Stream.Write($headerBytes, 0, $headerBytes.Length)

    if ($Method -ne 'HEAD' -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
}

try {
    $listener.Start()
    Write-Host "3Shape Replacement: http://localhost:$Port"
    Write-Host 'Press Ctrl+C to stop the server.'

    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $null
        $reader = $null

        try {
            $stream = $client.GetStream()
            $reader = New-Object IO.StreamReader -ArgumentList @(
                $stream,
                [Text.Encoding]::ASCII,
                $false,
                1024,
                $true
            )
            $requestLine = $reader.ReadLine()

            if ([string]::IsNullOrWhiteSpace($requestLine)) {
                continue
            }

            while (-not [string]::IsNullOrEmpty($reader.ReadLine())) {
                # Consume request headers.
            }

            $requestParts = $requestLine.Split(' ')
            $method = $requestParts[0]
            $requestPath = $requestParts[1].Split('?')[0]
            $requestPath = [Uri]::UnescapeDataString($requestPath)

            if ($requestPath -eq '/__health') {
                Send-Response $stream $method 200 'OK' $utf8.GetBytes('ok')
                continue
            }

            if ($requestPath.EndsWith('/')) {
                $requestPath += 'index.html'
            }

            $relativePath = $requestPath.TrimStart('/').Replace(
                '/',
                [IO.Path]::DirectorySeparatorChar
            )
            $filePath = [IO.Path]::GetFullPath(
                (Join-Path $projectRoot $relativePath)
            )

            if (-not $filePath.StartsWith(
                $rootPrefix,
                [StringComparison]::OrdinalIgnoreCase
            )) {
                Send-Response $stream $method 403 'Forbidden' $utf8.GetBytes('Forbidden.')
                continue
            }

            if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                Send-Response $stream $method 404 'Not Found' $utf8.GetBytes('File not found.')
                continue
            }

            $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = $mimeTypes[$extension]

            if (-not $contentType) {
                $contentType = 'application/octet-stream'
            }

            $content = [IO.File]::ReadAllBytes($filePath)
            Send-Response $stream $method 200 'OK' $content $contentType
        } catch {
            if ($stream) {
                Send-Response $stream 'GET' 500 'Internal Server Error' $utf8.GetBytes('Server error.')
            }
        } finally {
            if ($reader) {
                $reader.Dispose()
            }

            if ($stream) {
                $stream.Dispose()
            }

            $client.Dispose()
        }
    }
} finally {
    $listener.Stop()
}
