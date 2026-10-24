#requires -Version 7.0
<#
.SYNOPSIS
Exercises Install-V3.ps1 against disposable, isolated user directories.
.DESCRIPTION
Run with pwsh -NoProfile -File .\Test-Install.ps1. Requires Python on PATH.
No source files are changed. Fixtures live in one uniquely named directory
under the repository root; environment restoration and exact-root cleanup run
in finally. Exit 1 means an assertion, child exit code, or cleanup failed.
#>
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$suiteRoot = Split-Path -Parent $PSScriptRoot
$repositoryRoot = Split-Path -Parent (Split-Path -Parent $suiteRoot)
$installer = Join-Path $PSScriptRoot 'Install-V3.ps1'
$testRoot = Join-Path $repositoryRoot ('.test-install-v3-' + [Guid]::NewGuid().ToString('N'))
$environmentNames = @('APPDATA', 'LOCALAPPDATA', 'USERPROFILE', 'COPILOT_HOME')
$savedEnvironment = @{}
foreach ($name in $environmentNames) {
	$savedEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$failures = [Collections.Generic.List[string]]::new()
$rootCreated = $false
$sourceBefore = $null
$passed = 0
$script:childExecutions = 0
$case = 'setup'

function Assert-True([bool]$Condition, [string]$Message) {
	if (-not $Condition) { throw "Assertion failed: $Message" }
}

function Get-TreeManifest([string]$Root) {
	Assert-True (Test-Path -LiteralPath $Root -PathType Container) "Missing tree: $Root"
	$entries = foreach ($file in Get-ChildItem -LiteralPath $Root -File -Recurse -Force | Sort-Object FullName) {
		$relative = [IO.Path]::GetRelativePath($Root, $file.FullName)
		"$relative=$((Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash)"
	}
	return $entries -join "`n"
}

function Get-JsonIdentity($Value) {
	if ($Value -is [Collections.IDictionary]) {
		$members = foreach ($key in $Value.Keys | Sort-Object) {
			(ConvertTo-Json -InputObject ([string]$key) -Compress) + ':' + (Get-JsonIdentity $Value[$key])
		}
		return '{' + ($members -join ',') + '}'
	}
	if ($Value -is [Collections.IList]) {
		$items = foreach ($item in $Value) { Get-JsonIdentity $item }
		return '[' + ($items -join ',') + ']'
	}
	return ConvertTo-Json -InputObject $Value -Depth 100 -Compress
}

function Write-FixtureText([string]$Path, [string]$Text) {
	New-Item -ItemType Directory -Path (Split-Path -Parent $Path) -Force | Out-Null
	Set-Content -LiteralPath $Path -Value $Text -Encoding utf8
}

function Write-FixtureJson([string]$Path, $Value) {
	Write-FixtureText $Path (ConvertTo-Json -InputObject $Value -Depth 100)
}

function Read-Json([string]$Path) {
	return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json -AsHashtable
}

function Assert-FileMatches([string]$Expected, [string]$Actual) {
	Assert-True (Test-Path -LiteralPath $Actual -PathType Leaf) "Missing file: $Actual"
	Assert-True ((Get-FileHash -LiteralPath $Expected -Algorithm SHA256).Hash -ceq
		(Get-FileHash -LiteralPath $Actual -Algorithm SHA256).Hash) "SHA-256 differs: $Actual"
}

function Invoke-Installer {
	param(
		[string[]]$Switches = @(),
		[int]$ExpectedExit = 0,
		[string]$ExpectedDiagnostic = ''
	)
	$start = [Diagnostics.ProcessStartInfo]::new()
	$start.FileName = $script:pwshPath
	$start.UseShellExecute = $false
	$start.RedirectStandardOutput = $true
	$start.RedirectStandardError = $true
	$start.WorkingDirectory = $testRoot
	if ($script:pythonLauncher) {
		$start.Environment['__PYVENV_LAUNCHER__'] = $script:pythonLauncher
	}
	foreach ($argument in @('-NoLogo', '-NoProfile', '-NonInteractive', '-File', $installer) + $Switches) {
		$start.ArgumentList.Add($argument)
	}
	$process = [Diagnostics.Process]::new()
	$process.StartInfo = $start
	try {
		Assert-True ($process.Start()) 'Child pwsh did not start.'
		$stdout = $process.StandardOutput.ReadToEndAsync()
		$stderr = $process.StandardError.ReadToEndAsync()
		$process.WaitForExit()
		$output = $stdout.GetAwaiter().GetResult() + $stderr.GetAwaiter().GetResult()
		$exitCode = $process.ExitCode
		$script:childExecutions++
		Assert-True ($exitCode -eq $ExpectedExit) (
			"Installer $($Switches -join ' ') exited $exitCode; expected $ExpectedExit.`n$output")
		if ($ExpectedDiagnostic) {
			Assert-True ($output.Contains($ExpectedDiagnostic)) (
				"Expected refusal diagnostic '$ExpectedDiagnostic' was absent.`n$output")
		}
	} finally {
		$process.Dispose()
	}
}

function Assert-InstalledSuite {
	$runtime = Read-Json (Join-Path $profileRoot 'runtime.json')
	Assert-True ($runtime.source -ceq $suiteRoot) 'Runtime does not identify its source checkout.'
	Assert-True ($runtime.specification -ceq (Join-Path $profileRoot 'specification.md')) (
		'Runtime does not identify the installed suite specification.')
	Assert-FileMatches (Join-Path $suiteRoot 'specification.md') $runtime.specification
	Assert-True (@(Get-ChildItem -LiteralPath $agentTarget -Filter '*.agent.md' -File).Count -eq 7) (
		'Expected six owned profiles plus the unrelated native profile.')
	foreach ($agent in $agentFiles) {
		Assert-FileMatches $agent.FullName (Join-Path $agentTarget $agent.Name)
	}
	Assert-True (@(Get-ChildItem -LiteralPath $skillTarget -Directory).Count -eq 8) (
		'Expected seven owned skill bundles plus the unrelated personal bundle.')
	foreach ($skill in $skillDirectories) {
		Assert-True ((Get-TreeManifest (Join-Path $skillTarget $skill.Name)) -ceq
			(Get-TreeManifest $skill.FullName)) "Full skill file list/SHA-256 differs: $($skill.Name)"
	}
	Assert-True ((Get-TreeManifest $personalSkill) -ceq $personalSkillBefore) (
		'Unrelated personal skill files changed.')
	Assert-True ((Get-FileHash -LiteralPath $personalAgent -Algorithm SHA256).Hash -ceq $personalAgentBefore) (
		'Unrelated native agent changed.')
	$config = Read-Json $nativeConfigPath
	Assert-True ($config.Contains('mcpServers')) 'Native config has no mcpServers object.'
	Assert-True (-not $config.Contains('servers')) 'Installer used the legacy servers key in native config.'
	Assert-True ($config.mcpServers.Contains('pw-journal')) 'Native pw-journal registration is missing.'
	$server = $config.mcpServers['pw-journal']
	Assert-True ([IO.Path]::IsPathRooted($server.command) -and
		(Test-Path -LiteralPath $server.command -PathType Leaf)) 'Native MCP command is not a resolved executable.'
	Assert-True (($server.args -join '|') -ceq '-m|agent_suite.mcp_server') 'Wrong native MCP arguments.'
	Assert-True ($server.cwd -ceq $installedService) 'Wrong native MCP working directory.'
	Assert-True ($server.env.PYTHONPATH -ceq $installedService) 'Wrong native MCP PYTHONPATH.'
	Assert-True ($server.env.PW_AGENT_SUITE_HOME -ceq $profileRoot) 'Wrong native MCP suite home.'
	$config.mcpServers.Remove('pw-journal')
	Assert-True ((Get-JsonIdentity $config) -ceq $nativeUnrelatedBefore) (
		'Unrelated native MCP server or other native config settings changed.')
	Assert-True (-not (Test-Path -LiteralPath (Join-Path $env:USERPROFILE '.copilot'))) (
		'Explicit COPILOT_HOME was ignored in favor of the default home.')
}

try {
	$script:pwshPath = @(Get-Command pwsh -CommandType Application -ErrorAction Stop)[0].Source
	$script:pythonLauncher = $null
	$pythonCommand = Get-Command python -ErrorAction Stop
	if ($pythonCommand.Source -like '*\Microsoft\WindowsApps\*') {
		# Keep Store Python's executable identity valid when LOCALAPPDATA is isolated.
		$script:pythonLauncher = (& $pythonCommand.Source -c 'import sys; print(sys.executable)').Trim()
		Assert-True ($LASTEXITCODE -eq 0 -and
			(Test-Path -LiteralPath $script:pythonLauncher -PathType Leaf)) (
			'Cannot resolve the installed Python executable behind its Windows Store alias.')
	}
	$sourceBefore = Get-TreeManifest $suiteRoot
	$agentFiles = @(Get-ChildItem -LiteralPath (Join-Path $suiteRoot 'agents') -Filter '*.agent.md' -File | Sort-Object Name)
	$skillDirectories = @(Get-ChildItem -LiteralPath (Join-Path $suiteRoot 'skills') -Directory | Sort-Object Name)
	Assert-True ($agentFiles.Count -eq 6) "Expected six source profiles; found $($agentFiles.Count)."
	Assert-True ($skillDirectories.Count -eq 7) "Expected seven source skill bundles; found $($skillDirectories.Count)."
	New-Item -ItemType Directory -Path $testRoot | Out-Null
	$rootCreated = $true
	foreach ($name in $environmentNames) {
		$path = Join-Path $testRoot $name
		New-Item -ItemType Directory -Path $path | Out-Null
		[Environment]::SetEnvironmentVariable($name, $path, 'Process')
	}
	$agentTarget = Join-Path $env:COPILOT_HOME 'agents'
	$skillTarget = Join-Path $env:USERPROFILE '.agents\skills'
	$profileRoot = Join-Path $env:LOCALAPPDATA 'ProphetsWay\AgentSuite\v3'
	$installedService = Join-Path $profileRoot 'service'
	$nativeConfigPath = Join-Path $env:COPILOT_HOME 'mcp-config.json'
	$legacyAgentTarget = Join-Path $env:APPDATA 'Code\User\prompts'
	$legacyConfigPath = Join-Path $env:APPDATA 'Code\User\mcp.json'
	$personalAgent = Join-Path $agentTarget 'unrelated.agent.md'
	$personalSkill = Join-Path $skillTarget 'unrelated-personal-skill'
	Write-FixtureText $personalAgent 'Unrelated native profile; preserve byte for byte.'
	Write-FixtureText (Join-Path $personalSkill 'SKILL.md') 'Unrelated personal skill.'
	Write-FixtureText (Join-Path $personalSkill 'assets\keep.txt') 'Preserve the complete personal bundle.'
	$personalAgentBefore = (Get-FileHash -LiteralPath $personalAgent -Algorithm SHA256).Hash
	$personalSkillBefore = Get-TreeManifest $personalSkill
	$nativeSeed = @{
		theme = 'unrelated-theme'
		settings = @{ enabled = $true; labels = @('keep', 'both'); nested = @{ value = 23 } }
		mcpServers = @{
			'unrelated-native' = @{ command = 'unrelated-native-command'; args = @('--keep'); env = @{ KEEP = 'yes' } }
		}
	}
	Write-FixtureJson $nativeConfigPath $nativeSeed
	$nativeUnrelatedBefore = Get-JsonIdentity $nativeSeed
	Write-Output "PowerShell $($PSVersionTable.PSVersion); six source profiles; seven source skill bundles."
	Write-Output "Isolation: $testRoot"

	$case = '01 first native install'
	Invoke-Installer
	Assert-InstalledSuite
	Assert-True (-not (Test-Path -LiteralPath $legacyAgentTarget)) 'First install created legacy profiles.'
	Assert-True (-not (Test-Path -LiteralPath $legacyConfigPath)) 'First install created legacy MCP config.'
	$passed++
	Write-Output "PASS $case (exit 0; profile hashes, full skill trees, native config preserved)"

	$case = '02 identical repeat install'
	Invoke-Installer
	Assert-InstalledSuite
	$passed++
	Write-Output "PASS $case (exit 0; identical source parity)"

	$ownedSkillTarget = Join-Path $skillTarget $skillDirectories[0].Name
	$ownedSkillFile = Join-Path $ownedSkillTarget 'SKILL.md'
	Add-Content -LiteralPath $ownedSkillFile -Value 'Installed-only skill mutation.' -Encoding utf8
	$staleFile = Join-Path $ownedSkillTarget 'stale\nested\remove-me.txt'
	Write-FixtureText $staleFile 'Installed-only stale file.'
	$mutatedSkillBefore = Get-TreeManifest $ownedSkillTarget
	$case = '03 changed skill refused by default'
	Invoke-Installer -ExpectedExit 1 -ExpectedDiagnostic 'Different personal skill bundle'
	Assert-True ((Get-TreeManifest $ownedSkillTarget) -ceq $mutatedSkillBefore) (
		'Refused install modified the changed skill or its stale file.')
	$passed++
	Write-Output "PASS $case (expected exit 1: Different personal skill bundle; unchanged)"

	$case = '04 skill update restores source and removes stale files'
	Invoke-Installer -Switches @('-Update')
	Assert-InstalledSuite
	Assert-True (-not (Test-Path -LiteralPath $staleFile)) 'Update retained an extra stale file in an owned bundle.'
	$passed++
	Write-Output "PASS $case (exit 0; full file list/SHA-256 parity)"

	$ownedAgent = Join-Path $agentTarget 'pw-tests.agent.md'
	Add-Content -LiteralPath $ownedAgent -Value 'Installed-only agent mutation.' -Encoding utf8
	$mutatedAgentBefore = (Get-FileHash -LiteralPath $ownedAgent -Algorithm SHA256).Hash
	$case = '05 changed agent refused by default'
	Invoke-Installer -ExpectedExit 1 -ExpectedDiagnostic 'Different personal agent definition'
	Assert-True ((Get-FileHash -LiteralPath $ownedAgent -Algorithm SHA256).Hash -ceq $mutatedAgentBefore) (
		'Refused install modified the changed agent.')
	$passed++
	Write-Output "PASS $case (expected exit 1: Different personal agent definition; unchanged)"

	$case = '06 agent update restores source'
	Invoke-Installer -Switches @('-Update')
	Assert-InstalledSuite
	$passed++
	Write-Output "PASS $case (exit 0; source SHA-256 restored)"

	Write-FixtureText (Join-Path $legacyAgentTarget 'unrelated.agent.md') 'Unrelated legacy profile.'
	Write-FixtureText (Join-Path $legacyAgentTarget 'pw-tests.backup.agent.md') 'Not an exact suite filename.'
	Write-FixtureText (Join-Path $legacyAgentTarget 'nested\keep.txt') 'Unrelated legacy nested file.'
	$legacyUnrelatedBefore = Get-TreeManifest $legacyAgentTarget
	foreach ($agent in $agentFiles) {
		Copy-Item -LiteralPath $agent.FullName -Destination (Join-Path $legacyAgentTarget $agent.Name)
	}
	$legacySeed = @{
		inputs = @(@{ id = 'unrelated-input'; type = 'promptString' })
		otherSetting = @{ keep = $true }
		servers = @{ 'unrelated-legacy' = @{ command = 'unrelated-legacy-command'; args = @('--keep') } }
	}
	$legacyUnrelatedConfigBefore = Get-JsonIdentity $legacySeed
	$legacySeed.servers['pw-journal'] = (Read-Json $nativeConfigPath).mcpServers['pw-journal']
	Write-FixtureJson $legacyConfigPath $legacySeed
	$case = '07 exact legacy migration'
	Invoke-Installer -Switches @('-MigrateLegacy')
	Assert-InstalledSuite
	foreach ($agent in $agentFiles) {
		Assert-True (-not (Test-Path -LiteralPath (Join-Path $legacyAgentTarget $agent.Name))) (
			"Migration retained an exact suite legacy profile: $($agent.Name)")
	}
	Assert-True ((Get-TreeManifest $legacyAgentTarget) -ceq $legacyUnrelatedBefore) (
		'Migration changed unrelated legacy files.')
	Assert-True ((Get-JsonIdentity (Read-Json $legacyConfigPath)) -ceq $legacyUnrelatedConfigBefore) (
		'Migration failed to remove only the owned legacy server or changed unrelated legacy settings.')
	$passed++
	Write-Output "PASS $case (exit 0; six exact profiles/owned server removed; unrelated legacy data preserved)"

	foreach ($agent in $agentFiles) {
		Copy-Item -LiteralPath $agent.FullName -Destination (Join-Path $legacyAgentTarget $agent.Name)
	}
	Add-Content -LiteralPath (Join-Path $legacyAgentTarget 'pw-tests.agent.md') -Value 'Mismatched legacy profile.' -Encoding utf8
	Write-FixtureJson $legacyConfigPath $legacySeed
	$legacyMismatchBefore = Get-TreeManifest $legacyAgentTarget
	$legacyConfigBefore = (Get-FileHash -LiteralPath $legacyConfigPath -Algorithm SHA256).Hash
	$case = '08 mismatched legacy profile refuses removal'
	Invoke-Installer -Switches @('-MigrateLegacy') -ExpectedExit 1 -ExpectedDiagnostic 'Legacy agent differs from source'
	Assert-True ((Get-TreeManifest $legacyAgentTarget) -ceq $legacyMismatchBefore) (
		'Refused migration changed or removed legacy files.')
	Assert-True ((Get-FileHash -LiteralPath $legacyConfigPath -Algorithm SHA256).Hash -ceq $legacyConfigBefore) (
		'Refused migration changed the legacy MCP config.')
	Assert-InstalledSuite
	$passed++
	Write-Output "PASS $case (expected exit 1: Legacy agent differs from source; all legacy files/config unchanged)"

	$conflictingConfig = Read-Json $nativeConfigPath
	$conflictingConfig.mcpServers['pw-journal'] = @{
		command = 'unrelated-pw-journal-command'
		args = @('--not-owned')
		cwd = $testRoot
		env = @{ KEEP = 'unrelated-registration' }
	}
	Write-FixtureJson $nativeConfigPath $conflictingConfig
	$conflictingConfigBefore = (Get-FileHash -LiteralPath $nativeConfigPath -Algorithm SHA256).Hash
	$agentsBeforeConflict = Get-TreeManifest $agentTarget
	$skillsBeforeConflict = Get-TreeManifest $skillTarget
	foreach ($switches in @(@{ Name = '09 native name conflict'; Arguments = @() },
		@{ Name = '10 native name conflict with -Update'; Arguments = @('-Update') })) {
		$case = $switches.Name
		Invoke-Installer -Switches $switches.Arguments -ExpectedExit 1 -ExpectedDiagnostic "A different server named 'pw-journal'"
		Assert-True ((Get-FileHash -LiteralPath $nativeConfigPath -Algorithm SHA256).Hash -ceq $conflictingConfigBefore) (
			'Installer overwrote the unrelated conflicting pw-journal server or other native settings.')
		Assert-True ((Get-TreeManifest $agentTarget) -ceq $agentsBeforeConflict) 'Conflict changed installed agents.'
		Assert-True ((Get-TreeManifest $skillTarget) -ceq $skillsBeforeConflict) 'Conflict changed installed skills.'
		$passed++
		Write-Output "PASS $case (expected exit 1: unrelated pw-journal refused; config/agents/skills unchanged)"
	}
	Assert-True ($passed -eq 10 -and $script:childExecutions -eq 10) 'Not all ten installer checks executed.'
} catch {
	$failures.Add("FAIL $case`: $($_.Exception.Message)")
} finally {
	foreach ($name in $environmentNames) {
		[Environment]::SetEnvironmentVariable($name, $savedEnvironment[$name], 'Process')
	}
	try {
		foreach ($name in $environmentNames) {
			Assert-True ([Environment]::GetEnvironmentVariable($name, 'Process') -ceq $savedEnvironment[$name]) (
				"Environment was not restored: $name")
		}
		Write-Output 'PASS environment restored (APPDATA, LOCALAPPDATA, USERPROFILE, COPILOT_HOME)'
	} catch {
		$failures.Add("FAIL environment restoration: $($_.Exception.Message)")
	}
	try {
		if ($null -ne $sourceBefore) {
			Assert-True ((Get-TreeManifest $suiteRoot) -ceq $sourceBefore) 'Suite source file list/SHA-256 changed during tests.'
			Write-Output 'PASS entire suite source unchanged (file list and SHA-256)'
		}
	} catch {
		$failures.Add("FAIL source integrity: $($_.Exception.Message)")
	}
	try {
		if ($rootCreated) {
			Remove-Item -LiteralPath $testRoot -Recurse -Force
			Assert-True (-not (Test-Path -LiteralPath $testRoot)) 'Exact test directory still exists.'
			Write-Output 'PASS cleanup (only the exact unique isolation directory removed)'
		}
	} catch {
		$failures.Add("FAIL exact-root cleanup: $($_.Exception.Message)")
	}
}

foreach ($failure in $failures) { Write-Output $failure }
if ($failures.Count -gt 0) {
	Write-Output "FAILED: $passed/10 checks passed; $($script:childExecutions) installer child executions; $($failures.Count) failure(s)."
	exit 1
}
Write-Output "PASSED: $passed/10 checks; $($script:childExecutions) installer child executions; no skips."
exit 0
