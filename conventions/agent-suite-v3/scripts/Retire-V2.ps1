[CmdletBinding()]
param(
	[switch]$RetireV2
)

$ErrorActionPreference = 'Stop'
if (-not $RetireV2) {
	throw 'Pass -RetireV2 to archive and remove the exact owned v2 live definitions.'
}

$suiteRoot = Split-Path -Parent $PSScriptRoot
$pipelinesRoot = Split-Path -Parent (Split-Path -Parent $suiteRoot)
$mirror = Join-Path $pipelinesRoot 'conventions\toolbelt'
$live = Join-Path $env:APPDATA 'Code\User\prompts'
$archive = Join-Path $pipelinesRoot 'conventions\toolbelt\archive\v2'
$expectedPromptNames = @(
	'docs-p-sweep-workspace.prompt.md',
	'docs-p-sync-agents-md.prompt.md'
)

if (Test-Path -LiteralPath $archive) {
	throw "The v2 archive already exists; refusing to overwrite it: $archive"
}
$mirrorFiles = @(Get-ChildItem -LiteralPath $mirror -File | Where-Object {
	$_.Name -like '*-v2.agent.md' -or $_.Name -in $expectedPromptNames
})
$liveFiles = @(Get-ChildItem -LiteralPath $live -File | Where-Object {
	$_.Name -like '*-v2.agent.md' -or $_.Name -in $expectedPromptNames
})
$mirrorAgents = @($mirrorFiles | Where-Object Name -like '*-v2.agent.md')
$mirrorPrompts = @($mirrorFiles | Where-Object Name -like '*.prompt.md')
$liveAgents = @($liveFiles | Where-Object Name -like '*-v2.agent.md')
$livePrompts = @($liveFiles | Where-Object Name -like '*.prompt.md')
if ($mirrorAgents.Count -ne 30 -or $mirrorPrompts.Count -ne 2 -or
	$liveAgents.Count -ne 30 -or $livePrompts.Count -ne 2 -or
	$mirrorFiles.Count -ne 32 -or $liveFiles.Count -ne 32 -or
	(Compare-Object -ReferenceObject $expectedPromptNames -DifferenceObject @($mirrorPrompts.Name | Sort-Object)) -or
	(Compare-Object -ReferenceObject $expectedPromptNames -DifferenceObject @($livePrompts.Name | Sort-Object))) {
	throw "Expected exactly 30 v2 agents and the two owned prompts in the mirror and live selector; found $($mirrorAgents.Count)/$($mirrorPrompts.Count) and $($liveAgents.Count)/$($livePrompts.Count). No files were removed."
}
$liveByName = @{}
foreach ($file in $liveFiles) { $liveByName[$file.Name] = $file }
if ($liveFiles.Count -ne $mirrorFiles.Count) {
	throw 'The live selector and versioned mirror have different file counts; nothing was removed.'
}
foreach ($file in $mirrorFiles) {
	if (-not $liveByName.ContainsKey($file.Name) -or
		(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash -ne
		(Get-FileHash -LiteralPath $liveByName[$file.Name].FullName -Algorithm SHA256).Hash) {
		throw "The live selector and versioned mirror differ at $($file.Name); nothing was removed."
	}
}

$agentsArchive = Join-Path $archive 'agents'
$promptsArchive = Join-Path $archive 'prompts'
New-Item -ItemType Directory -Path $agentsArchive, $promptsArchive | Out-Null
foreach ($file in $mirrorFiles) {
	$target = if ($file.Name.EndsWith('.agent.md')) { Join-Path $agentsArchive $file.Name } else { Join-Path $promptsArchive $file.Name }
	Copy-Item -LiteralPath $file.FullName -Destination $target
}
$metadata = [ordered]@{
	generation = 'v2'
	status = 'retired'
	archivedUtc = [DateTimeOffset]::UtcNow.ToString('o')
	source = 'Verified live VS Code user prompt generation and matching versioned mirror'
	agentFiles = @($mirrorFiles | Where-Object Name -like '*.agent.md' | Select-Object -ExpandProperty Name | Sort-Object)
	promptFiles = @($mirrorFiles | Where-Object Name -like '*.prompt.md' | Select-Object -ExpandProperty Name | Sort-Object)
	ownedSkills = @()
}
$metadataPath = Join-Path $archive 'generation.json'
$metadata | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $metadataPath -Encoding utf8
$manifestLines = @(Get-ChildItem -LiteralPath $archive -File -Recurse | Sort-Object FullName | ForEach-Object {
	$relative = $_.FullName.Substring($archive.Length).TrimStart('\').Replace('\', '/')
	$hash = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
	"$hash  $relative"
})
$manifestPath = Join-Path $archive 'SHA256SUMS.txt'
$manifestLines | Set-Content -LiteralPath $manifestPath -Encoding ascii

if (@(Get-ChildItem -LiteralPath $agentsArchive -File).Count -ne 30 -or
	@(Get-ChildItem -LiteralPath $promptsArchive -File).Count -ne 2) {
	throw 'The v2 archive does not contain exactly 30 agents and two prompts; live definitions were preserved.'
}
foreach ($line in Get-Content -LiteralPath $manifestPath) {
	$parts = $line -split '  ', 2
	$filePath = Join-Path $archive $parts[1].Replace('/', '\')
	if (-not (Test-Path -LiteralPath $filePath -PathType Leaf) -or
		(Get-FileHash -LiteralPath $filePath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $parts[0]) {
		throw "Archive verification failed before retirement: $($parts[1])"
	}
}
foreach ($file in $mirrorFiles) {
	$archived = if ($file.Name.EndsWith('.agent.md')) { Join-Path $agentsArchive $file.Name } else { Join-Path $promptsArchive $file.Name }
	if ((Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash -ne
		(Get-FileHash -LiteralPath $archived -Algorithm SHA256).Hash) {
		throw "Archive mismatch; live definitions preserved: $($file.Name)"
	}
}

foreach ($file in $liveFiles) { Remove-Item -LiteralPath $file.FullName -Force }
foreach ($file in $mirrorFiles) { Remove-Item -LiteralPath $file.FullName -Force }
Write-Output "Archived and verified all 30 v2 agents and two prompts at $archive"
Write-Output 'Removed only the matching v2 files from the live VS Code selector and flat mirror.'
Write-Output 'Unrelated user customizations, personal skills, installed v3 files and v1 archive were not changed.'
