#requires -Version 7.0

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$script:EvidenceModulePath = $PSCommandPath

function Get-EvidenceDigest {
    param([Parameter(Mandatory)]$Value)
    $bytes = [Text.Encoding]::UTF8.GetBytes(($Value | ConvertTo-Json -Depth 30 -Compress))
    $algorithm = [Security.Cryptography.SHA256]::Create()
    try { return [BitConverter]::ToString($algorithm.ComputeHash($bytes)).Replace('-', '') }
    finally { $algorithm.Dispose() }
}

function Get-EvidenceInventory {
    param([Parameter(Mandatory)]$Selectors, [switch]$AllowMissing)
    $files = [Collections.Generic.List[string]]::new()
    foreach ($root in $Selectors.Roots) {
        if (-not (Test-Path -LiteralPath $root -PathType Container)) {
            if ($AllowMissing) { continue }
            throw 'An inventory root is missing.'
        }
        $pending = [Collections.Generic.Stack[string]]::new()
        $pending.Push($root)
        while ($pending.Count -gt 0) {
            foreach ($item in Get-ChildItem -LiteralPath $pending.Pop() -Force) {
                if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                    throw 'Linked filesystem entries need explicit, resolved inventory roots.'
                }
                if ($item.PSIsContainer) {
                    if ($item.Name -notin $Selectors.ExcludedDirectories) { $pending.Push($item.FullName) }
                }
                elseif (@($Selectors.Patterns | Where-Object { $item.Name -like $_ }).Count -gt 0) {
                    $files.Add($item.FullName)
                }
            }
        }
    }
    foreach ($path in $Selectors.Paths) {
        if (Test-Path -LiteralPath $path -PathType Leaf) { $files.Add($path) }
        elseif (-not $AllowMissing) { throw 'An explicit inventory input is missing.' }
    }
    foreach ($path in $files | Sort-Object -Unique) {
        [pscustomobject][ordered]@{
            Path = $path
            SHA256 = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash
        }
    }
}

function New-AgentManifest {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Revision,
        [string[]]$Roots = @(),
        [string[]]$Patterns = @('*'),
        [string[]]$Paths = @(),
        [string[]]$ExcludedDirectories = @('.git', 'bin', 'obj')
    )
    $selectors = [ordered]@{
        Roots = @($Roots | ForEach-Object { [IO.Path]::GetFullPath($_) } | Sort-Object -Unique)
        Patterns = @($Patterns | Sort-Object -Unique)
        Paths = @($Paths | ForEach-Object { [IO.Path]::GetFullPath($_) } | Sort-Object -Unique)
        ExcludedDirectories = @($ExcludedDirectories | Sort-Object -Unique)
    }
    $entries = @(Get-EvidenceInventory $selectors)
    if ($entries.Count -eq 0) { throw 'An empty inventory cannot establish a baseline.' }
    $body = [ordered]@{ Revision = $Revision; Selectors = $selectors; Files = $entries }
    [pscustomobject][ordered]@{
        Schema = 'agent-manifest-v1'
        CapturedUtc = [DateTimeOffset]::UtcNow.ToString('o')
        Revision = $Revision
        Selectors = $selectors
        Files = $entries
        Fingerprint = Get-EvidenceDigest $body
    }
}

function Compare-AgentManifest {
    [CmdletBinding()]
    param([Parameter(Mandatory)]$Baseline)
    if ($Baseline.Schema -ne 'agent-manifest-v1') { throw 'Unsupported manifest schema.' }
    $body = [ordered]@{ Revision = $Baseline.Revision; Selectors = $Baseline.Selectors; Files = @($Baseline.Files) }
    if ((Get-EvidenceDigest $body) -cne $Baseline.Fingerprint) { throw 'Manifest fingerprint is invalid.' }
    $current = @(Get-EvidenceInventory $Baseline.Selectors -AllowMissing)
    $before = @{}
    $after = @{}
    foreach ($entry in $Baseline.Files) { $before.Add($entry.Path, $entry.SHA256) }
    foreach ($entry in $current) { $after.Add($entry.Path, $entry.SHA256) }
    $added = @($after.Keys | Where-Object { -not $before.ContainsKey($_) } | Sort-Object)
    $removed = @($before.Keys | Where-Object { -not $after.ContainsKey($_) } | Sort-Object)
    $changed = @($before.Keys | Where-Object { $after.ContainsKey($_) -and $before[$_] -cne $after[$_] } | Sort-Object)
    [pscustomobject][ordered]@{
        Schema = 'agent-comparison-v1'
        CheckedUtc = [DateTimeOffset]::UtcNow.ToString('o')
        Revision = $Baseline.Revision
        BaselineFingerprint = $Baseline.Fingerprint
        CurrentFingerprint = Get-EvidenceDigest ([ordered]@{ Revision = $Baseline.Revision; Selectors = $Baseline.Selectors; Files = $current })
        Matches = ($added.Count + $removed.Count + $changed.Count -eq 0)
        Compared = $before.Count
        Matching = $before.Count - $removed.Count - $changed.Count
        Added = $added
        Removed = $removed
        Changed = $changed
    }
}

function Assert-EvidenceDirectory {
    param([Parameter(Mandatory)][string]$RunDirectory)
    if (-not [IO.Path]::IsPathFullyQualified($RunDirectory)) { throw 'Use an absolute run directory.' }
    $directory = [IO.DirectoryInfo]::new([IO.Path]::GetFullPath($RunDirectory))
    if ($directory.Parent.Name -ne '.agent-runs' -or $directory.Name -notmatch '^\d{8}-\d{4}-.+$') {
        throw 'Evidence requires the external .agent-runs/run-id convention.'
    }
    $ancestor = $directory
    while ($null -ne $ancestor) {
        if (Test-Path -LiteralPath (Join-Path $ancestor.FullName '.git')) { throw 'Evidence cannot be inside a repository.' }
        if ($ancestor.Exists -and ($ancestor.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            throw 'Evidence cannot traverse a filesystem link.'
        }
        $ancestor = $ancestor.Parent
    }
    $output = Join-Path $directory.FullName 'evidence'
    if ((Test-Path -LiteralPath $output) -and ((Get-Item -LiteralPath $output).Attributes -band [IO.FileAttributes]::ReparsePoint)) {
        throw 'Evidence cannot traverse a filesystem link.'
    }
    $null = [IO.Directory]::CreateDirectory($output)
    return $output
}

function Save-AgentEvidence {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]$Value,
        [Parameter(Mandatory)][string]$RunDirectory,
        [Parameter(Mandatory)][ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]*\.json$')][string]$Name
    )
    $path = Join-Path (Assert-EvidenceDirectory $RunDirectory) $Name
    $bytes = [Text.Encoding]::UTF8.GetBytes(($Value | ConvertTo-Json -Depth 30) + [Environment]::NewLine)
    $stream = [IO.File]::Open($path, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write)
    try { $stream.Write($bytes, 0, $bytes.Length) }
    finally { $stream.Dispose() }
    return $path
}

function Read-EvidenceTrx {
    param([string]$Path, [DateTimeOffset]$StartedUtc, [DateTimeOffset]$FinishedUtc)
    $settings = [Xml.XmlReaderSettings]::new()
    $settings.DtdProcessing = [Xml.DtdProcessing]::Prohibit
    $settings.XmlResolver = $null
    $reader = [Xml.XmlReader]::Create($Path, $settings)
    try {
        $document = [Xml.XmlDocument]::new()
        $document.XmlResolver = $null
        $document.Load($reader)
    }
    finally { $reader.Dispose() }
    if ($document.DocumentElement.LocalName -ne 'TestRun') { throw 'Not a TRX test run.' }
    $times = $document.SelectSingleNode('/*[local-name()="TestRun"]/*[local-name()="Times"]')
    $start = [DateTimeOffset]::Parse($times.GetAttribute('start'), [Globalization.CultureInfo]::InvariantCulture)
    $finish = [DateTimeOffset]::Parse($times.GetAttribute('finish'), [Globalization.CultureInfo]::InvariantCulture)
    if ($start -lt $StartedUtc -or $finish -gt $FinishedUtc -or $finish -lt $start) { throw 'Stale or invalid TRX times.' }
    $tests = @($document.SelectNodes('//*[local-name()="UnitTestResult"]') | ForEach-Object {
        $identity = $_.GetAttribute('testId') + ':' + $_.GetAttribute('testName')
        if ([string]::IsNullOrWhiteSpace($_.GetAttribute('testId')) -or [string]::IsNullOrWhiteSpace($_.GetAttribute('testName'))) {
            throw 'A test identity is missing.'
        }
        [pscustomobject][ordered]@{ Identity = $identity; Outcome = $_.GetAttribute('outcome') }
    } | Sort-Object Identity)
    if (@($tests | Group-Object Identity | Where-Object Count -gt 1).Count -gt 0) { throw 'Duplicate test identities.' }
    if (@($tests | Where-Object { $_.Outcome -notin @('Passed', 'Failed', 'NotExecuted') }).Count -gt 0) {
        throw 'Unsupported test outcome; no success may be inferred.'
    }
    $counts = [ordered]@{
        Total = $tests.Count
        Executed = @($tests | Where-Object Outcome -ne 'NotExecuted').Count
        Passed = @($tests | Where-Object Outcome -eq 'Passed').Count
        Failed = @($tests | Where-Object Outcome -eq 'Failed').Count
        Skipped = @($tests | Where-Object Outcome -eq 'NotExecuted').Count
    }
    $counters = $document.SelectSingleNode('//*[local-name()="ResultSummary"]/*[local-name()="Counters"]')
    foreach ($pair in @{ total = 'Total'; executed = 'Executed'; passed = 'Passed'; failed = 'Failed'; notExecuted = 'Skipped' }.GetEnumerator()) {
        $actual = 0
        if (-not [int]::TryParse($counters.GetAttribute($pair.Key), [ref]$actual) -or $actual -ne $counts[$pair.Value]) {
            throw 'TRX counters disagree with actual test results.'
        }
    }
    $summary = $document.SelectSingleNode('//*[local-name()="ResultSummary"]')
    [pscustomobject]@{ Counts = $counts; Tests = $tests; RunOutcome = $summary.GetAttribute('outcome') }
}

function Invoke-AgentValidation {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [string[]]$ArgumentList = @(),
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [Parameter(Mandatory)][System.Collections.IDictionary]$Configuration,
        [Parameter(Mandatory)][string]$InputManifestPath,
        [Parameter(Mandatory)][string]$RunDirectory,
        [Parameter(Mandatory)][string]$Name,
        [ValidateSet('Command', 'Tests')][string]$Kind = 'Command',
        [string]$TrxPath,
        [string[]]$AllowedSkippedTests = @(),
        [ValidateRange(1, 3600)][int]$TimeoutSeconds = 120
    )
    $output = Assert-EvidenceDirectory $RunDirectory
    if ($Name -notmatch '^[A-Za-z0-9][A-Za-z0-9_-]*$') { throw 'Use a unique simple check name.' }
    if (Test-Path -LiteralPath (Join-Path $output "$Name.json")) { throw 'Check evidence already exists.' }
    if ($Configuration.Count -eq 0) { throw 'Record non-secret check configuration.' }
    $commandText = (@($ArgumentList) + ($Configuration | ConvertTo-Json -Depth 10)) -join ' '
    if ($commandText -match '(?i)\b(password|pwd|token|secret|accountkey|connectionstring)["'']?\s*[:=]|\bBearer\s+') {
        throw 'Secret-bearing arguments/configuration cannot be captured.'
    }
    $safeConfiguration = [ordered]@{}
    foreach ($key in $Configuration.Keys | Sort-Object) { $safeConfiguration[$key] = $Configuration[$key] }
    $manifest = Get-Content -LiteralPath $InputManifestPath -Raw | ConvertFrom-Json -Depth 30
    $before = Compare-AgentManifest $manifest
    if (-not $before.Matches) { throw 'Validation inputs do not match their baseline.' }
    if ($Kind -eq 'Tests') {
        if ([string]::IsNullOrWhiteSpace($TrxPath) -or [IO.Path]::GetDirectoryName([IO.Path]::GetFullPath($TrxPath)) -ne $output) {
            throw 'Tests require a fresh TRX path in this run evidence directory.'
        }
        if (Test-Path -LiteralPath $TrxPath) { throw 'A pre-existing result cannot be used for a new check.' }
    }
    elseif ($TrxPath) { throw 'TRX evidence requires Kind Tests.' }
    $executable = (Get-Command $FilePath -CommandType Application -ErrorAction Stop).Source
    $executableHash = (Get-FileHash -LiteralPath $executable -Algorithm SHA256).Hash
    $moduleHash = (Get-FileHash -LiteralPath $script:EvidenceModulePath -Algorithm SHA256).Hash
    $startInfo = [Diagnostics.ProcessStartInfo]::new($executable)
    $startInfo.WorkingDirectory = [IO.Path]::GetFullPath($WorkingDirectory)
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    foreach ($argument in $ArgumentList) { $startInfo.ArgumentList.Add($argument) }
    $started = [DateTimeOffset]::UtcNow
    $process = [Diagnostics.Process]::new()
    $process.StartInfo = $startInfo
    try {
        $null = $process.Start()
        $stdout = $process.StandardOutput.ReadToEndAsync()
        $stderr = $process.StandardError.ReadToEndAsync()
        $timedOut = -not $process.WaitForExit($TimeoutSeconds * 1000)
        if ($timedOut) { $process.Kill($true) }
        $process.WaitForExit()
        $exitCode = $process.ExitCode
        $null = $stdout.GetAwaiter().GetResult()
        $null = $stderr.GetAwaiter().GetResult()
    }
    finally { $process.Dispose() }
    $finished = [DateTimeOffset]::UtcNow
    $after = Compare-AgentManifest $manifest
    $result = $null
    $resultError = $null
    $resultHash = $null
    if ($Kind -eq 'Tests') {
        try {
            $result = Read-EvidenceTrx $TrxPath $started $finished
            $resultHash = (Get-FileHash -LiteralPath $TrxPath -Algorithm SHA256).Hash
        }
        catch { $resultError = 'Missing, stale, malformed, or inconsistent TRX; inspect safely without copying secret-bearing diagnostics.' }
    }
    $success = $exitCode -eq 0 -and -not $timedOut -and $after.Matches
    $success = $success -and (Get-FileHash -LiteralPath $executable -Algorithm SHA256).Hash -ceq $executableHash -and
        (Get-FileHash -LiteralPath $script:EvidenceModulePath -Algorithm SHA256).Hash -ceq $moduleHash
    if ($Kind -eq 'Tests') {
        $success = $success -and $null -eq $resultError -and $null -ne $result
        if ($null -ne $result) {
            $unexpectedSkips = @($result.Tests | Where-Object { $_.Outcome -eq 'NotExecuted' -and $_.Identity -notin $AllowedSkippedTests })
            $success = $success -and $result.Counts.Executed -gt 0 -and $result.Counts.Failed -eq 0 -and
                $unexpectedSkips.Count -eq 0 -and $result.RunOutcome -in @('Completed', 'Passed')
        }
    }
    $record = [pscustomobject][ordered]@{
        Schema = 'agent-validation-v1'
        Kind = $Kind
        Command = $executable
        Arguments = @($ArgumentList)
        WorkingDirectory = $startInfo.WorkingDirectory
        Configuration = $safeConfiguration
        StartedUtc = $started.ToString('o')
        FinishedUtc = $finished.ToString('o')
        ExitCode = $exitCode
        TimedOut = $timedOut
        InputManifestPath = [IO.Path]::GetFullPath($InputManifestPath)
        InputFingerprint = $manifest.Fingerprint
        InputComparison = $after
        ExecutableSHA256 = $executableHash
        EvidenceModulePath = $script:EvidenceModulePath
        EvidenceModuleSHA256 = $moduleHash
        TrxPath = $TrxPath
        TrxSHA256 = $resultHash
        Results = $result
        ResultError = $resultError
        AllowedSkippedTests = @($AllowedSkippedTests)
        Success = $success
    }
    $path = Save-AgentEvidence $record $RunDirectory "$Name.json"
    [pscustomobject]@{ Path = $path; Record = $record }
}

function Test-AgentValidation {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]$Record,
        [Parameter(Mandatory)][System.Collections.IDictionary]$ExpectedConfiguration
    )
    $reasons = [Collections.Generic.List[string]]::new()
    if ($Record.Schema -ne 'agent-validation-v1' -or -not $Record.Success) { $reasons.Add('CheckNotSuccessful') }
    $actualConfiguration = $Record.Configuration | ConvertTo-Json -Depth 10 -Compress | ConvertFrom-Json -AsHashtable
    $expectedConfiguration = $ExpectedConfiguration | ConvertTo-Json -Depth 10 -Compress | ConvertFrom-Json -AsHashtable
    if (@(Compare-Object @($actualConfiguration.Keys | Sort-Object) @($expectedConfiguration.Keys | Sort-Object)).Count -gt 0) {
        $reasons.Add('ConfigurationChanged')
    }
    else {
        foreach ($key in $expectedConfiguration.Keys) {
            if (($actualConfiguration[$key] | ConvertTo-Json -Depth 10 -Compress) -cne ($expectedConfiguration[$key] | ConvertTo-Json -Depth 10 -Compress)) {
                $reasons.Add('ConfigurationChanged'); break
            }
        }
    }
    try {
        $manifest = Get-Content -LiteralPath $Record.InputManifestPath -Raw | ConvertFrom-Json -Depth 30
        if ($manifest.Fingerprint -cne $Record.InputFingerprint -or -not (Compare-AgentManifest $manifest).Matches) { $reasons.Add('InputsChanged') }
        if ((Get-FileHash -LiteralPath $Record.Command -Algorithm SHA256).Hash -cne $Record.ExecutableSHA256) { $reasons.Add('ExecutableChanged') }
        if ((Get-FileHash -LiteralPath $Record.EvidenceModulePath -Algorithm SHA256).Hash -cne $Record.EvidenceModuleSHA256) { $reasons.Add('EvidenceToolChanged') }
        if ($Record.Kind -eq 'Tests' -and (Get-FileHash -LiteralPath $Record.TrxPath -Algorithm SHA256).Hash -cne $Record.TrxSHA256) { $reasons.Add('ResultsChanged') }
    }
    catch { $reasons.Add('EvidenceUnavailable') }
    [pscustomobject]@{ ReusableForRecordedCommand = $reasons.Count -eq 0; Reasons = @($reasons) }
}

function Compare-AgentTestResults {
    [CmdletBinding()]
    param([Parameter(Mandatory)]$Before, [Parameter(Mandatory)]$After)
    if ($Before.Kind -ne 'Tests' -or $After.Kind -ne 'Tests' -or $null -eq $Before.Results -or $null -eq $After.Results) {
        throw 'Two executed test records are required.'
    }
    $beforeCases = @($Before.Results.Tests | ForEach-Object { $_.Identity + '|' + $_.Outcome } | Sort-Object)
    $afterCases = @($After.Results.Tests | ForEach-Object { $_.Identity + '|' + $_.Outcome } | Sort-Object)
    $differences = @(Compare-Object $beforeCases $afterCases)
    [pscustomobject]@{
        Matches = $Before.Success -and $After.Success -and $differences.Count -eq 0 -and
            (Get-EvidenceDigest $Before.Configuration) -ceq (Get-EvidenceDigest $After.Configuration)
        Before = $Before.Results.Counts
        After = $After.Results.Counts
        Differences = $differences
    }
}

Export-ModuleMember -Function New-AgentManifest, Compare-AgentManifest, Save-AgentEvidence, Invoke-AgentValidation, Test-AgentValidation, Compare-AgentTestResults
