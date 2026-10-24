[CmdletBinding()]
param(
	[switch]$Update,
	[switch]$MigrateLegacy
)

$ErrorActionPreference = 'Stop'
$sourceRoot = Split-Path -Parent $PSScriptRoot
$serviceSource = Join-Path $sourceRoot 'service\agent_suite'
$agentSource = Join-Path $sourceRoot 'agents'
$skillSource = Join-Path $sourceRoot 'skills'
$specificationSource = Join-Path $sourceRoot 'specification.md'
$profileRoot = Join-Path $env:LOCALAPPDATA 'ProphetsWay\AgentSuite\v3'
$installedService = Join-Path $profileRoot 'service'
$copilotHome = if ($env:COPILOT_HOME) { $env:COPILOT_HOME } else { Join-Path $env:USERPROFILE '.copilot' }
$agentTarget = Join-Path $copilotHome 'agents'
$skillTarget = Join-Path $env:USERPROFILE '.agents\skills'
$mcpConfigPath = Join-Path $copilotHome 'mcp-config.json'
$legacyAgentTarget = Join-Path $env:APPDATA 'Code\User\prompts'
$legacyMcpConfigPath = Join-Path $env:APPDATA 'Code\User\mcp.json'
$serverName = 'pw-journal'

function Get-TreeIdentity([string]$Root) {
	if (-not (Test-Path -LiteralPath $Root -PathType Container)) { return '' }
	$entries = foreach ($file in (Get-ChildItem -LiteralPath $Root -File -Recurse | Sort-Object FullName)) {
		if ($file.Extension -eq '.pyc' -or $file.FullName -match '[\\/]+__pycache__[\\/]') { continue }
		$relative = $file.FullName.Substring($Root.Length).TrimStart('\')
		"$relative=$((Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash)"
	}
	return $entries -join "`n"
}

function Read-Config([string]$Path, [string]$ServerKey) {
	$config = if (Test-Path -LiteralPath $Path -PathType Leaf) {
		Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json -AsHashtable -ErrorAction Stop
	} else { @{} }
	if ($config -isnot [System.Collections.IDictionary]) { throw "$Path must contain a JSON object." }
	if (-not $config.Contains($ServerKey)) { $config[$ServerKey] = @{} }
	if ($config[$ServerKey] -isnot [System.Collections.IDictionary]) { throw "$ServerKey in $Path must be an object." }
	return $config
}

function Write-Config([string]$Path, [System.Collections.IDictionary]$Config) {
	New-Item -ItemType Directory -Path (Split-Path -Parent $Path) -Force | Out-Null
	$temporary = "$Path.$([Guid]::NewGuid().ToString('N')).tmp"
	try {
		$Config | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $temporary -Encoding utf8
		Move-Item -LiteralPath $temporary -Destination $Path -Force
	} finally {
		if (Test-Path -LiteralPath $temporary -PathType Leaf) { Remove-Item -LiteralPath $temporary -Force }
	}
}

function Test-OwnedServer($Server) {
	return $Server -is [System.Collections.IDictionary] -and
		$Server.command -eq $pythonExecutable -and $Server.cwd -eq $installedService -and
		($Server.args -join '|') -ceq '-m|agent_suite.mcp_server' -and
		$Server.env.PYTHONPATH -eq $installedService
}

if (-not (Test-Path -LiteralPath $serviceSource -PathType Container) -or
	-not (Test-Path -LiteralPath $agentSource -PathType Container) -or
	-not (Test-Path -LiteralPath $skillSource -PathType Container)) {
	throw 'The versioned v3 source is incomplete.'
}
if (-not (Test-Path -LiteralPath $specificationSource -PathType Leaf)) {
	throw 'The versioned v3 specification is missing.'
}

$pythonCommand = Get-Command python -ErrorAction Stop
$pythonExecutable = (& $pythonCommand.Source -c 'import sys; print(sys.executable)').Trim()
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $pythonExecutable -PathType Leaf)) {
	throw 'A working Python interpreter could not be resolved for the local service.'
}

$agentFiles = @(Get-ChildItem -LiteralPath $agentSource -Filter '*.agent.md' -File)
if ($agentFiles.Count -ne 6) {
	throw "Expected six v3 agents, found $($agentFiles.Count)."
}
foreach ($file in $agentFiles) {
	$contents = Get-Content -LiteralPath $file.FullName -Raw
	$frontMatch = [regex]::Match($contents, '(?s)\A---\r?\n(?<front>.*?)\r?\n---\r?\n')
	$frontmatter = $frontMatch.Groups['front'].Value
	if (-not $frontMatch.Success -or
		$frontmatter -notmatch '(?m)^name:\s*["'']PW - .+["'']\s*$' -or
		$frontmatter -notmatch '(?m)^description:\s*["''].+["'']\s*$') {
		throw "Agent frontmatter is invalid or incomplete: $($file.Name)"
	}
	$target = Join-Path $agentTarget $file.Name
	if (-not $Update -and (Test-Path -LiteralPath $target -PathType Leaf) -and
		(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne
		(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash) {
		throw "Different personal agent definition: $($file.Name). Review it, then use -Update to replace this suite-owned name."
	}
}

$skillDirectories = @(Get-ChildItem -LiteralPath $skillSource -Directory)
foreach ($directory in $skillDirectories) {
	$skillFile = Join-Path $directory.FullName 'SKILL.md'
	if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
		throw "Skill is missing SKILL.md: $($directory.Name)"
	}
	$contents = Get-Content -LiteralPath $skillFile -Raw
	if ($contents -notmatch "(?m)^name:\s*$([regex]::Escape($directory.Name))\s*$" -or
		$contents -notmatch "(?m)^description:\s*.+$") {
		throw "Skill frontmatter does not match its directory: $($directory.Name)"
	}
	$target = Join-Path $skillTarget $directory.Name
	if (-not $Update -and (Test-Path -LiteralPath $target) -and
		(Get-TreeIdentity $target) -cne (Get-TreeIdentity $directory.FullName)) {
		throw "Different personal skill bundle: $($directory.Name). Review it, then use -Update to replace this suite-owned bundle."
	}
}

$config = Read-Config $mcpConfigPath 'mcpServers'
$serverConfig = [ordered]@{
	command = $pythonExecutable
	args = @('-m', 'agent_suite.mcp_server')
	cwd = $installedService
	env = [ordered]@{ PYTHONPATH = $installedService; PW_AGENT_SUITE_HOME = $profileRoot }
}
if ($config['mcpServers'].Contains($serverName)) {
	$existing = $config['mcpServers'][$serverName]
	if (-not (Test-OwnedServer $existing)) {
		throw "A different server named '$serverName' already exists in $mcpConfigPath; refusing to overwrite it."
	}
	if (-not $Update -and
		((($existing.Keys | Sort-Object) -join '|') -cne (($serverConfig.Keys | Sort-Object) -join '|') -or
		(($existing.env.Keys | Sort-Object) -join '|') -cne (($serverConfig.env.Keys | Sort-Object) -join '|') -or
		$existing.env.PW_AGENT_SUITE_HOME -ne $profileRoot)) {
		throw "The existing '$serverName' has additional settings. Review it before using -Update."
	}
}
$config['mcpServers'][$serverName] = $serverConfig
$legacyFiles = @()
if ($MigrateLegacy) {
	foreach ($file in $agentFiles) {
		$legacy = Join-Path $legacyAgentTarget $file.Name
		if (Test-Path -LiteralPath $legacy -PathType Leaf) {
			if ((Get-FileHash -LiteralPath $legacy).Hash -ne (Get-FileHash -LiteralPath $file.FullName).Hash) {
				throw "Legacy agent differs from source; preserve and reconcile it before migration: $legacy"
			}
			$legacyFiles += $legacy
		}
	}
	$legacyConfig = Read-Config $legacyMcpConfigPath 'servers'
	if ($legacyConfig.servers.Contains($serverName) -and -not (Test-OwnedServer $legacyConfig.servers[$serverName])) {
		throw "The legacy '$serverName' registration is not this installation; it was not changed."
	}
}

New-Item -ItemType Directory -Path $profileRoot, $agentTarget, $skillTarget -Force | Out-Null
New-Item -ItemType Directory -Path $installedService -Force | Out-Null
$servicePackage = Join-Path $installedService 'agent_suite'
$stagingPackage = Join-Path $installedService ('.agent_suite-staging-' + [Guid]::NewGuid().ToString('N'))
$backupPackage = Join-Path $installedService ('.agent_suite-backup-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stagingPackage -Force | Out-Null
try {
	$serviceFiles = @(Get-ChildItem -LiteralPath $serviceSource -File -Recurse | Where-Object {
		$_.Extension -ne '.pyc' -and $_.FullName -notmatch '[\\/]+__pycache__[\\/]'
	})
	if ($serviceFiles.Count -eq 0) {
		throw 'The local service source contains no installable files.'
	}
	foreach ($file in $serviceFiles) {
		$relativePath = $file.FullName.Substring($serviceSource.Length).TrimStart('\')
		$target = Join-Path $stagingPackage $relativePath
		New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
		Copy-Item -LiteralPath $file.FullName -Destination $target -Force
	}
	if (Test-Path -LiteralPath $servicePackage -PathType Container) {
		Move-Item -LiteralPath $servicePackage -Destination $backupPackage
	}
	try {
		Move-Item -LiteralPath $stagingPackage -Destination $servicePackage
	} catch {
		if (Test-Path -LiteralPath $backupPackage -PathType Container) {
			Move-Item -LiteralPath $backupPackage -Destination $servicePackage
		}
		throw
	}
	if (Test-Path -LiteralPath $backupPackage -PathType Container) {
		Remove-Item -LiteralPath $backupPackage -Recurse -Force
	}
} finally {
	if (Test-Path -LiteralPath $stagingPackage -PathType Container) {
		Remove-Item -LiteralPath $stagingPackage -Recurse -Force
	}
}
foreach ($file in $agentFiles) {
	Copy-Item -LiteralPath $file.FullName -Destination $agentTarget -Force
}
foreach ($directory in $skillDirectories) {
	$target = Join-Path $skillTarget $directory.Name
	if (Test-Path -LiteralPath $target -PathType Container) {
		if (-not $Update) { continue }
		Remove-Item -LiteralPath $target -Recurse -Force
	}
	Copy-Item -LiteralPath $directory.FullName -Destination $target -Recurse
}

$runtimeConfig = [ordered]@{
	python = $pythonExecutable
	service = $installedService
	source = $sourceRoot
	specification = Join-Path $profileRoot 'specification.md'
	dashboardUrl = 'http://127.0.0.1:47831/'
}
Copy-Item -LiteralPath $specificationSource -Destination $runtimeConfig.specification -Force
$runtimeConfig | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $profileRoot 'runtime.json') -Encoding utf8
Write-Config $mcpConfigPath $config
if ($MigrateLegacy) {
	foreach ($file in $agentFiles) {
		if ((Get-FileHash -LiteralPath (Join-Path $agentTarget $file.Name)).Hash -ne
			(Get-FileHash -LiteralPath $file.FullName).Hash) {
			throw "Native parity check failed; legacy files were preserved: $($file.Name)"
		}
	}
	foreach ($legacy in $legacyFiles) { Remove-Item -LiteralPath $legacy }
	if ($legacyConfig.servers.Contains($serverName)) {
		$legacyConfig.servers.Remove($serverName)
		Write-Config $legacyMcpConfigPath $legacyConfig
	}
	Write-Output "Migrated $($legacyFiles.Count) exact legacy PW profiles and the owned MCP registration."
}

Write-Output "Installed six PW agents to $agentTarget"
Write-Output "Installed $($skillDirectories.Count) PW skills to $skillTarget"
Write-Output "Installed local journal service to $installedService"
Write-Output "Registered the '$serverName' stdio MCP server in $mcpConfigPath"
Write-Output "Dashboard: run $PSScriptRoot\Open-Dashboard.ps1"
Write-Output 'V2 retirement is a separate, archive-verified step.'
