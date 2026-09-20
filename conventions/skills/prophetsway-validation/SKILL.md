---
name: prophetsway-validation
description: 'Shared ProphetsWay v2 procedure for validation readiness, workspace test tasks, run-local validators, protected specifications, SHA-256 manifests, TRX evidence, test membership, and independent setup review. Use when preparing an unattended run, creating validation setup, capturing or checking baseline/final evidence, freezing audited specifications, or reviewing a run validator. Procedures never grant write or execution authority.'
user-invocable: false
---

# ProphetsWay Validation

Use this procedure when producing or reviewing validation evidence in the v2 workflow. Agents retain
their own roles, tools and write boundaries. A read-only reviewer reads the records and code; it does
not gain execution tools by loading this skill. Never use a skill to override a charter, an immutable
acceptance target, an owner decision, or a denied tool approval.

## Resolve The Inputs

1. Read the target repository's `AGENTS.md` and the exact acceptance target/revision supplied by the
   parent. Resolve the actual `prophets-pipelines` workspace repository, then read its
   `conventions/agent-protocol-v2.md`. Missing required inputs block dependent work.
2. Read `conventions/scripts/AgentEvidence.psm1` and, when testing the evidence helpers,
   `conventions/scripts/Test-AgentEvidence.ps1` in that repository. Reuse these utilities; do not copy
   their implementation into every run or build a parallel evidence engine.
3. Use [the validation-plan template](./assets/validation-plan.md) inside the parent's immutable
   acceptance target or its exact named plan artifact. Omit only genuinely inapplicable fields with
   a reason. Read runner, project, target, configuration and selection from approved current inputs;
   this skill carries no repository versions, test counts, filters or connection details.

## Establish Readiness

Account for every planned artifact/check: exact owner and paths, independent reviewer, required tools,
prerequisites, operation authority and evidence. Include concrete supporting-type bodies, workspace
tasks and external validators when needed. A task label or file extension does not establish ownership.
No dependent product/test authoring starts with a missing capability or unreviewed setup.

Reuse existing suitable tasks and checks when their content, selection, toolchain and environment are
verified. A task that points to an old run's evidence is not reusable by merely renaming it. Do not
create a bespoke script when an existing approved check supplies equivalent evidence.

| Work | Owner | Independent gate |
| --- | --- | --- |
| Concrete supporting-type declarations and XML docs | Interface Architect | Contract Reviewer on the exact snapshot |
| Enumerated supporting-type bodies/private state | Implementer under `Supporting-type scope:` | Parent surface comparison/execution and target-selected code/security review |
| New specifications | Test Designer | Test Auditor: `Ready for implementation` |
| Test-project-only helpers | Harness Engineer `scaffold` or `maintain` | Existing mode-specific audit/parent checks |
| Named workspace tasks and run-local validators | Harness Engineer `validation-setup` | Test Auditor: `Ready for baseline`, then parent execution and setup freeze |

Readiness is not a new approval. The target/envelope must already authorize each planned write and
operation. Missing credentials, tool approval, runner or required skill are named blockers. Never
modify approval settings or route a denied command through a script. An expired envelope is not revived.

## Author Validation Setup

Only the permitted setup author follows this section. Require `Harness mode: validation-setup`, exact
`Allowed setup paths:`, `Validation plan:`, `Specification hashes:` and `Focused validation:`.

1. Establish a generated protected-input baseline, including affected/inherited/linked specifications,
   their data inputs, authority and plan artifacts, and existing setup. Inspect selector completeness:
   a correct hash of an incomplete inventory proves little. Never transcribe hashes.
2. Parse existing task configuration with a parser that supports its actual JSON/JSONC syntax. Add
   only approved new labels and commands, preserving all pre-existing task objects and non-task
   settings. Reject duplicate labels, repointed old tasks and automatic task execution. Use minimal
   edits; formatting is not permission to replace unrelated settings.
3. Author only the exact allowed run-local PowerShell/configuration files. Commands, argument arrays,
   working directories, filters, targets, expected outcomes and skip policies come from the plan.
   Do not interpolate untrusted text as executable commands. No source edits, install/restore, Git,
   service or live database/cloud operation is implied by this setup mode.
4. Use AgentEvidence for manifests, unique create-new records, command capture, TRX parsing and
   comparisons. Keep new manifests, results, diagnostics and coverage under this run's `evidence/`.
   Do not overwrite previous runs or evidence. Check that captured inputs/output are safe first;
   the utility is not a general secret scrubber. Never capture resolved credentials or connections.
5. Parse the script and configuration, then exercise isolated synthetic rejection cases: missing/stale
   results, failed command, zero tests, unexplained skips, changed protected specifications, changed
   membership, changed setup and a review bound to different inputs. Missing required coverage blocks
   setup readiness. Label these as validator tests, not product execution.
6. Supply the exact setup diff, plan, generated input identities and author-check records for Test
   Auditor. A setup author cannot create its own independent review or approve its own criteria.

Setup scripts may check evidence integrity; they may not define expected product behavior or replace
product tests. The original test identities and outcomes must survive. Approved new specifications may
add identities; derive and review that delta rather than hardcoding an eventual total or refreshing a
baseline to conceal changed membership.

## Review, Execute And Freeze

The reviewer inspects plan fidelity, unchanged prior tasks, actual exercise of production code, and
rejection behavior. Read the actual diff, not only the author's claims. No replacement code is authored
by the reviewer. Its verdict names the subject and exact generated input manifest/revision.

Vanguard verifies a completed independent setup review bound to the current inputs, then independently
runs the approved checks and real baseline through its existing task/test tools. Record actual executed
identities/outcomes/counts/skips and freeze setup/authority input hashes. A keyword search for `Ready`,
a file's existence, or a filename is not proof that an independent review occurred. A freeze operation
must consume the parent's verified review-to-input binding; it never manufactures that approval.

`Ready for baseline` is setup review only. After Test Designer authors new specifications, a separate
`Ready for implementation` audit binds that specification revision before functional implementation.
Do not let the first verdict stand in for the second. Existing sufficient specifications do not need
an artificial new red phase or audit merely to perform a local correction.

Frozen setup is an acceptance input, not a convenient repair target. A change to its commands,
selection, thresholds or code requires an explicitly authorized new target revision, independent
setup audit and fresh baseline. Preserve previous records. Product authors cannot change the validator
that judges them; no concurrent setup repair during their implementation invocation.

## Capture Execution Evidence

Use the approved command and runner syntax, loading a relevant test-runner skill when available and
needed. Do not invent a target or silently narrow a filter after a failure. Record tool/runtime identity
and environment assumptions alongside project/target/configuration/selection.

Two snapshots have different purposes:

- The specification/setup/authority baseline is immutable for its approved revision.
- Execution-input snapshots describe the actual authorized implementation being checked. Refresh these
  after authorized changes; never refresh a protected baseline to excuse drift.

With the exact paths and variables supplied by the plan, the existing helpers support this pattern:

```powershell
Import-Module (Join-Path $pipelinesRoot 'conventions/scripts/AgentEvidence.psm1')
$inputs = New-AgentManifest -Revision $revision -Roots $inputRoots -Paths $explicitInputs
$inputPath = Save-AgentEvidence $inputs $runDirectory $uniqueInputRecordName
$check = Invoke-AgentValidation -FilePath $executable -ArgumentList $arguments `
    -WorkingDirectory $repositoryRoot -Configuration $configuration `
    -InputManifestPath $inputPath -RunDirectory $runDirectory -Name $uniqueCheckName `
    -Kind Tests -TrxPath $freshTrxPath -TimeoutSeconds $remainingCheckSeconds
Test-AgentValidation $check.Record $configuration
```

This is a pattern for an authorized execution owner, not permission for a reviewer or for Vanguard
to bypass its task-only execution rule. Bind every variable from the plan. Use `Kind Command` without
a TRX path for build-only checks, and label them build-only. Never execute an example merely because
it builds; consumer-snippet compilation and example execution are distinct operations.

Check command, arguments and selection against the requested plan as well as the record's validity.
`Test-AgentValidation` validates reuse of the recorded command/configuration; it does not establish that
this was the requested command. Environment state, especially an external database, is not certified by
file hashes. Reuse is invalid when relevant inputs, tool identity, selection or assumptions change.

Intentional new-specification red remains failed execution, with the expected failures identified; it
is never relabeled a passing gate. Existing protected regressions must still be accounted for. Zero
executed tests, stale results, unexplained skips and ignored command failures never count as success.

Use `Compare-AgentTestResults` when unchanged membership/outcomes are required. For an approved new
specification revision, independently inspect the actual added/removed/changed identity delta and bind
permitted additions to the audited revision. Equal totals cannot prove that original cases survived.
Compare protected manifests at ownership/mutation boundaries and final verification, not every save.

## Report And Stop

Link generated records and summarize differences, missing checks and actual outcomes. Distinguish
author checks, synthetic validator tests, independent review, parent execution and any unperformed live
operation. A green script is not release approval or proof of whole-suite certification.

Missing authority or capability blocks dependent work. A failed invariant blocks acceptance. Follow the
protocol's budgets and stop rules, preserve existing work and evidence, and report the exact next owner
or decision. Do not add a new skill, helper, exception or retry to widen the current target.
