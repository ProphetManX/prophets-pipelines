[CmdletBinding()]
param(
	[ValidateRange(1024, 65535)]
	[int]$Port = 47831
)

$ErrorActionPreference = 'Stop'
$profileRoot = Join-Path $env:LOCALAPPDATA 'ProphetsWay\AgentSuite\v3'
$runtimePath = Join-Path $profileRoot 'runtime.json'
if (-not (Test-Path -LiteralPath $runtimePath -PathType Leaf)) {
	throw 'PW Agent Suite v3 is not installed. Run Install-V3.ps1 first.'
}
$runtime = Get-Content -LiteralPath $runtimePath -Raw | ConvertFrom-Json -ErrorAction Stop
$python = $runtime.python
$service = $runtime.service
$url = "http://127.0.0.1:$Port/"
$health = "http://127.0.0.1:$Port/health"

$healthResponse = $null
try {
	$healthResponse = Invoke-RestMethod -Uri $health -TimeoutSec 2
} catch {
}
if ($healthResponse -and $healthResponse.service -ne 'pw-agent-dashboard') {
	throw "Port $Port is occupied by a different local service."
}
if (-not $healthResponse) {
	$logs = Join-Path $profileRoot 'logs'
	New-Item -ItemType Directory -Path $logs -Force | Out-Null
	$previousPath = $env:PYTHONPATH
	try {
		$env:PYTHONPATH = $service
		$process = Start-Process -FilePath $python `
			-ArgumentList @('-m', 'agent_suite.web', '--host', '127.0.0.1', '--port', "$Port") `
			-WorkingDirectory $service `
			-WindowStyle Hidden `
			-PassThru `
			-RedirectStandardOutput (Join-Path $logs 'dashboard.out.log') `
			-RedirectStandardError (Join-Path $logs 'dashboard.error.log')
	} finally {
		$env:PYTHONPATH = $previousPath
	}
	$ready = $false
	for ($attempt = 0; $attempt -lt 40; $attempt++) {
		Start-Sleep -Milliseconds 250
		if ($process.HasExited) {
			throw "Dashboard process exited with code $($process.ExitCode). See $logs."
		}
		try {
			$response = Invoke-RestMethod -Uri $health -TimeoutSec 2
			if ($response.service -eq 'pw-agent-dashboard') {
				$ready = $true
				break
			}
		} catch {
		}
	}
	if (-not $ready) {
		Stop-Process -Id $process.Id -ErrorAction SilentlyContinue
		throw "Dashboard did not become healthy. See $logs."
	}
}

Start-Process $url
Write-Output "PW Agent Activity is available at $url"
Write-Output 'The page is read-only and does not start or control agents.'
