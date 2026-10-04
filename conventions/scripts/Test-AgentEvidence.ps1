#requires -Version 7.0

[CmdletBinding()]
param(
    [string]$RunDirectory,
    [string]$FixtureMode,
    [string]$TrxPath,
    [string]$InputPath,
    [string]$LaunchMarker,
    [switch]$DeadlineOnly
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ($FixtureMode) {
    if ($LaunchMarker) { [IO.File]::WriteAllText($LaunchMarker, 'synthetic child started') }
    Write-Output 'Synthetic-private-output-not-for-evidence'
    if ($FixtureMode -eq 'Command' -or $FixtureMode -eq 'Missing') { exit 0 }
    if ($FixtureMode -eq 'Malformed') { [IO.File]::WriteAllText($TrxPath, '<broken'); exit 0 }
    if ($FixtureMode -eq 'Mutate') { [IO.File]::WriteAllText($InputPath, 'changed during validation') }
    $start = [DateTimeOffset]::UtcNow
    if ($FixtureMode -eq 'Stale') { $start = $start.AddDays(-1) }
    $cases = @(
        @{ Id = 'case-1'; Name = 'Fixture.Primary'; Outcome = 'Passed' }
        @{ Id = 'case-2'; Name = 'Fixture.Boundary'; Outcome = 'Passed' }
    )
    if ($FixtureMode -eq 'Zero') { $cases = @() }
    if ($FixtureMode -eq 'Failed') { $cases[1].Outcome = 'Failed' }
    if ($FixtureMode -eq 'Skip') { $cases[1].Outcome = 'NotExecuted' }
    if ($FixtureMode -eq 'AllSkipped') { foreach ($case in $cases) { $case.Outcome = 'NotExecuted' } }
    if ($FixtureMode -eq 'Different') { $cases[1].Name = 'Fixture.Replaced' }
    if ($FixtureMode -eq 'Duplicate') { $cases[1].Id = $cases[0].Id; $cases[1].Name = $cases[0].Name }
    if ($FixtureMode -eq 'Unknown') { $cases[1].Outcome = 'Aborted' }
    $settings = [Xml.XmlWriterSettings]::new()
    $settings.Indent = $true
    $writer = [Xml.XmlWriter]::Create($TrxPath, $settings)
    try {
        $writer.WriteStartElement('TestRun', 'http://microsoft.com/schemas/VisualStudio/TeamTest/2010')
        $writer.WriteStartElement('Times')
        $writer.WriteAttributeString('start', $start.ToString('o'))
        $writer.WriteAttributeString('finish', [DateTimeOffset]::UtcNow.ToString('o'))
        $writer.WriteEndElement()
        $writer.WriteStartElement('Results')
        foreach ($case in $cases) {
            $writer.WriteStartElement('UnitTestResult')
            $writer.WriteAttributeString('testId', $case.Id)
            $writer.WriteAttributeString('testName', $case.Name)
            $writer.WriteAttributeString('outcome', $case.Outcome)
            $writer.WriteEndElement()
        }
        $writer.WriteEndElement()
        $writer.WriteStartElement('ResultSummary')
        $writer.WriteAttributeString('outcome', $(if ($FixtureMode -eq 'RunFailed') { 'Failed' } else { 'Completed' }))
        $writer.WriteStartElement('Counters')
        $total = $cases.Count
        if ($FixtureMode -eq 'Counters') { $total++ }
        $counts = [ordered]@{
            total = $total
            executed = @($cases | Where-Object Outcome -ne 'NotExecuted').Count
            passed = @($cases | Where-Object Outcome -eq 'Passed').Count
            failed = @($cases | Where-Object Outcome -eq 'Failed').Count
            notExecuted = @($cases | Where-Object Outcome -eq 'NotExecuted').Count
        }
        foreach ($key in $counts.Keys) { $writer.WriteAttributeString($key, [string]$counts[$key]) }
        $writer.WriteEndElement()
        $writer.WriteEndElement()
        $writer.WriteEndElement()
    }
    finally { $writer.Dispose() }
    if ($FixtureMode -eq 'Nonzero' -or $FixtureMode -eq 'Failed') { exit 1 }
    exit 0
}

Import-Module (Join-Path $PSScriptRoot 'AgentEvidence.psm1') -Force
if (-not $RunDirectory) { throw 'Supply the absolute external run directory.' }
$suiteStarted = [DateTimeOffset]::UtcNow
$prefix = 'offline-' + [Guid]::NewGuid().ToString('N')
$inputRoot = Join-Path $RunDirectory $prefix
$null = [IO.Directory]::CreateDirectory($inputRoot)
$source = Join-Path $inputRoot 'SampleTests.cs'
$linked = Join-Path $inputRoot 'linked.txt'
[IO.File]::WriteAllText($source, 'original specification fixture')
[IO.File]::WriteAllText($linked, 'original linked input')
$manifest = New-AgentManifest -Revision 'offline-r1' -Roots @($inputRoot) -Patterns @('*Tests.cs') -Paths @($linked, $PSCommandPath)
$manifestPath = Save-AgentEvidence $manifest $RunDirectory "$prefix-inputs.json"
$configuration = [ordered]@{ Project = 'synthetic'; Target = 'PowerShell'; Filter = 'all'; Environment = 'offline' }
$testScriptPath = $PSCommandPath
$caseResults = [Collections.Generic.List[object]]::new()
$script:checkNumber = 0

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

function Assert-Rejected {
    param([scriptblock]$Action)
    $rejected = $false
    try { $null = & $Action }
    catch { $rejected = $true }
    Assert-Condition $rejected 'Expected rejection did not occur.'
}

function Test-Case {
    param([string]$Identity, [scriptblock]$Action)
    try {
        $null = & $Action
        $caseResults.Add([pscustomobject]@{ Identity = $Identity; Outcome = 'Passed'; Failure = $null })
    }
    catch {
        $caseResults.Add([pscustomobject]@{ Identity = $Identity; Outcome = 'Failed'; Failure = $_.Exception.Message })
    }
}

function Invoke-Fixture {
    param([string]$Mode, [string[]]$AllowedSkips = @(), [string]$Kind = 'Tests')
    $script:checkNumber++
    $name = "$prefix-$($script:checkNumber)"
    $resultPath = Join-Path $RunDirectory "evidence\$name.trx"
    $arguments = @('-NoProfile', '-File', $testScriptPath, '-FixtureMode', $Mode)
    $parameters = @{
        FilePath = (Get-Process -Id $PID).Path
        WorkingDirectory = $inputRoot
        Configuration = $configuration
        InputManifestPath = $manifestPath
        RunDirectory = $RunDirectory
        Name = $name
        Kind = $Kind
        AllowedSkippedTests = $AllowedSkips
    }
    if ($Kind -eq 'Tests') {
        $arguments += @('-TrxPath', $resultPath, '-InputPath', $source)
        $parameters.TrxPath = $resultPath
    }
    Invoke-AgentValidation @parameters -ArgumentList $arguments
}

function Test-LaunchDeadline {
    param([ValidateSet('Before', 'Equal', 'After')][string]$Position)
    $module = Get-Module AgentEvidence
    $deadline = [DateTimeOffset]::UtcNow.AddMinutes(5)
    $initial = $deadline.AddMinutes(-1)
    $admission = switch ($Position) {
        'Before' { $deadline.AddTicks(-1) }
        'Equal' { $deadline }
        'After' { $deadline.AddTicks(1) }
    }
    $marker = Join-Path $inputRoot "deadline-$Position.started"
    $name = "$prefix-deadline-$Position"
    Assert-Condition ($initial -lt $deadline) 'The preparation fixture must begin before the fixed deadline.'
    & $module {
        param($Initial, $Admission)
        $script:DeadlineFixture = @{ Now = $Initial; Admission = $Admission; Prepared = $false; ClockReads = 0 }
        function script:Get-Date {
            param([switch]$AsUTC)
            if (-not $script:DeadlineFixture.Prepared) { throw 'Deadline checked before preparation finished.' }
            $script:DeadlineFixture.ClockReads++
            return $script:DeadlineFixture.Now.UtcDateTime
        }
        function script:Get-FileHash {
            param([string]$LiteralPath, [string]$Algorithm)
            $result = Microsoft.PowerShell.Utility\Get-FileHash -LiteralPath $LiteralPath -Algorithm $Algorithm
            if ($LiteralPath -eq $script:EvidenceModulePath) {
                $script:DeadlineFixture.Prepared = $true
                $script:DeadlineFixture.Now = $script:DeadlineFixture.Admission
            }
            return $result
        }
    } $initial $admission
    try {
        $failure = $null
        $result = $null
        try {
            $result = Invoke-AgentValidation -FilePath (Get-Process -Id $PID).Path -WorkingDirectory $inputRoot `
                -Configuration $configuration -InputManifestPath $manifestPath -RunDirectory $RunDirectory `
                -Name $name -Kind Command -LatestStartUtc $deadline `
                -ArgumentList @('-NoProfile', '-File', $testScriptPath, '-FixtureMode', 'Command', '-LaunchMarker', $marker)
        }
        catch { $failure = $_.Exception.Message }
        $clockReads = & $module { $script:DeadlineFixture.ClockReads }
        Assert-Condition ($clockReads -eq 1) 'The admission clock was not checked exactly at the prepared launch boundary.'
        if ($Position -eq 'Before') {
            Assert-Condition ($null -eq $failure -and $result.Record.Success -and [IO.File]::Exists($marker)) 'An admitted pre-deadline command did not run.'
            Assert-Condition ([DateTimeOffset]::Parse($result.Record.LatestStartUtc) -eq $deadline) 'The configured admission deadline was not recorded.'
            Assert-Condition ([DateTimeOffset]::Parse($result.Record.LaunchAdmittedUtc) -eq $admission) 'The actual admission-clock observation was not recorded.'
        }
        else {
            Assert-Condition ($failure -eq 'Validation launch deadline reached; no process was started.') 'The expired admission was not explicitly rejected.'
            Assert-Condition (-not [IO.File]::Exists($marker)) 'A child process started at or after the admission deadline.'
            Assert-Condition (-not [IO.File]::Exists((Join-Path $RunDirectory "evidence\$name.json"))) 'Refused admission was recorded as executed evidence.'
        }
    }
    finally {
        & $module {
            Remove-Item Function:script:Get-Date -ErrorAction SilentlyContinue
            Remove-Item Function:script:Get-FileHash -ErrorAction SilentlyContinue
            Remove-Variable DeadlineFixture -Scope Script -ErrorAction SilentlyContinue
        }
    }
}

if (-not $DeadlineOnly) {
Test-Case 'Manifest round-trip and linked inventory' {
    $restored = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json -Depth 30
    Assert-Condition ((Compare-AgentManifest $restored).Matches -and $restored.Files.Count -eq 3) 'Round-trip or inventory failed.'
}
Test-Case 'Changed specification detected' {
    try {
        [IO.File]::WriteAllText($source, 'changed')
        Assert-Condition ((Compare-AgentManifest $manifest).Changed.Count -eq 1) 'Changed file was missed.'
    }
    finally { [IO.File]::WriteAllText($source, 'original specification fixture') }
}
Test-Case 'Added specification detected' {
    $added = Join-Path $inputRoot 'AddedTests.cs'
    try {
        [IO.File]::WriteAllText($added, 'added')
        Assert-Condition ((Compare-AgentManifest $manifest).Added.Count -eq 1) 'Added file was missed.'
    }
    finally { [IO.File]::Delete($added) }
}
Test-Case 'Rename detected as removal and addition' {
    $renamed = Join-Path $inputRoot 'RenamedTests.cs'
    try {
        [IO.File]::Move($source, $renamed)
        $comparison = Compare-AgentManifest $manifest
        Assert-Condition ($comparison.Removed.Count -eq 1 -and $comparison.Added.Count -eq 1) 'Rename was missed.'
    }
    finally { [IO.File]::Move($renamed, $source) }
}
Test-Case 'Linked input mutation detected' {
    try {
        [IO.File]::WriteAllText($linked, 'changed')
        Assert-Condition (-not (Compare-AgentManifest $manifest).Matches) 'Linked mutation was missed.'
    }
    finally { [IO.File]::WriteAllText($linked, 'original linked input') }
}
Test-Case 'Tampered manifest rejected' {
    $tampered = $manifest | ConvertTo-Json -Depth 30 | ConvertFrom-Json -Depth 30
    $tampered.Revision = 'unapproved'
    Assert-Rejected { Compare-AgentManifest $tampered }
}
Test-Case 'Empty baseline rejected' { Assert-Rejected { New-AgentManifest -Revision 'empty' -Roots @($inputRoot) -Patterns @('*.absent') } }
Test-Case 'Evidence cannot overwrite' { Assert-Rejected { Save-AgentEvidence $manifest $RunDirectory "$prefix-inputs.json" } }
Test-Case 'Evidence path traversal rejected' { Assert-Rejected { Save-AgentEvidence $manifest $RunDirectory '../outside.json' } }
Test-Case 'Repository-local evidence rejected' {
    $fakeRepository = Join-Path $inputRoot 'repository'
    $null = [IO.Directory]::CreateDirectory((Join-Path $fakeRepository '.git'))
    Assert-Rejected { Save-AgentEvidence $manifest (Join-Path $fakeRepository '.agent-runs\20000101-0000-test') 'blocked.json' }
}

$script:passing = $null
Test-Case 'Passing tests record actual identities and counts' {
    $script:passing = Invoke-Fixture 'Passed'
    Assert-Condition ($script:passing.Record.Success -and $script:passing.Record.Results.Counts.Executed -eq 2) 'Passing results were not recorded.'
    Assert-Condition ($script:passing.Record.Results.Tests[1].Identity -eq 'case-2:Fixture.Boundary') 'Actual test identity was lost.'
}
Test-Case 'Safe command output is not copied into evidence' {
    $text = Get-Content -LiteralPath $script:passing.Path -Raw
    Assert-Condition (-not $text.Contains('Synthetic-private-output-not-for-evidence')) 'Raw command output leaked.'
}
Test-Case 'Successful unchanged evidence is reusable for its recorded command' {
    Assert-Condition ((Test-AgentValidation $script:passing.Record $configuration).ReusableForRecordedCommand) 'Fresh evidence was rejected.'
}
Test-Case 'Configuration changes invalidate reuse' {
    Assert-Condition (-not (Test-AgentValidation $script:passing.Record @{ Environment = 'different' }).ReusableForRecordedCommand) 'Changed configuration was accepted.'
}
Test-Case 'Input changes invalidate reuse' {
    try {
        [IO.File]::WriteAllText($linked, 'changed')
        Assert-Condition (-not (Test-AgentValidation $script:passing.Record $configuration).ReusableForRecordedCommand) 'Stale inputs were accepted.'
    }
    finally { [IO.File]::WriteAllText($linked, 'original linked input') }
}
foreach ($mode in @('Failed', 'RunFailed', 'Nonzero', 'Missing', 'Malformed', 'Stale', 'Counters', 'Zero', 'AllSkipped', 'Skip', 'Duplicate', 'Unknown')) {
    Test-Case "Reject false success: $mode" {
        $check = Invoke-Fixture $mode
        Assert-Condition (-not $check.Record.Success) "False success accepted: $mode"
    }
}
Test-Case 'Explicitly approved skips remain visible' {
    $check = Invoke-Fixture 'Skip' @('case-2:Fixture.Boundary')
    Assert-Condition ($check.Record.Success -and $check.Record.Results.Counts.Skipped -eq 1) 'Approved skip was not represented.'
}
Test-Case 'Same test identities and outcomes compare equal' {
    $check = Invoke-Fixture 'Passed'
    Assert-Condition ((Compare-AgentTestResults $script:passing.Record $check.Record).Matches) 'Identical tests did not compare equal.'
}
Test-Case 'Equal counts cannot hide replaced test identities' {
    $check = Invoke-Fixture 'Different'
    Assert-Condition (-not (Compare-AgentTestResults $script:passing.Record $check.Record).Matches) 'Replaced test was missed.'
}
Test-Case 'Mutation during validation prevents success' {
    try {
        $check = Invoke-Fixture 'Mutate'
        Assert-Condition (-not $check.Record.Success -and -not $check.Record.InputComparison.Matches) 'Mid-run mutation was accepted.'
    }
    finally { [IO.File]::WriteAllText($source, 'original specification fixture') }
}
Test-Case 'Changed result artifact invalidates reuse' {
    $check = Invoke-Fixture 'Passed'
    [IO.File]::AppendAllText($check.Record.TrxPath, [Environment]::NewLine)
    Assert-Condition (-not (Test-AgentValidation $check.Record $configuration).ReusableForRecordedCommand) 'Modified result was accepted.'
}
Test-Case 'Command-only validation does not claim test execution' {
    $check = Invoke-Fixture 'Command' @() 'Command'
    Assert-Condition ($check.Record.Success -and $check.Record.Kind -eq 'Command' -and $null -eq $check.Record.Results) 'Command-only evidence is mislabeled.'
    Assert-Condition ($check.Record.PSObject.Properties.Name -notcontains 'LatestStartUtc') 'An omitted deadline must retain the existing evidence shape.'
}
}

foreach ($position in @('Before', 'Equal', 'After')) {
    Test-Case "Prepared process launch admission: $position deadline" { Test-LaunchDeadline $position }
}

$summary = [pscustomobject][ordered]@{
    Suite = 'AgentEvidence offline self-tests'
    Command = $PSCommandPath
    Arguments = @('-RunDirectory', $RunDirectory) + $(if ($DeadlineOnly) { @('-DeadlineOnly') } else { @() })
    Invocation = $MyInvocation.Line.Trim()
    HostExecutable = (Get-Process -Id $PID).Path
    Configuration = @{ PowerShellVersion = $PSVersionTable.PSVersion.ToString(); Environment = 'offline synthetic fixtures' }
    StartedUtc = $suiteStarted.ToString('o')
    FinishedUtc = [DateTimeOffset]::UtcNow.ToString('o')
    ExitCode = $(if (@($caseResults | Where-Object Outcome -eq 'Failed').Count -gt 0 -or $caseResults.Count -eq 0) { 1 } else { 0 })
    Executed = $caseResults.Count
    Passed = @($caseResults | Where-Object Outcome -eq 'Passed').Count
    Failed = @($caseResults | Where-Object Outcome -eq 'Failed').Count
    Skipped = 0
    Cases = @($caseResults)
}
$summaryPath = Save-AgentEvidence $summary $RunDirectory "$prefix-summary.json"
[pscustomobject]@{ Executed = $summary.Executed; Passed = $summary.Passed; Failed = $summary.Failed; Skipped = 0; Summary = $summaryPath; Failures = @($caseResults | Where-Object Outcome -eq 'Failed') } | ConvertTo-Json -Depth 5
if ($summary.Failed -gt 0 -or $summary.Executed -eq 0) { exit 1 }
exit 0
