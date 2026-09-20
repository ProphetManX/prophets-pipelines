# Validation Plan Template

Use this template within an immutable acceptance target or an exact named plan artifact. Replace every
placeholder with verified inputs, or mark it inapplicable with a reason. This template is not approval,
an execution command, or evidence that a check passed. Do not copy mutable values from another run.

## Identity And Authority

- Acceptance target and immutable revision: `<path and revision>`
- Repository root and external run directory: `<exact paths>`
- Owner approval/source and applicable unattended envelope: `<quoted authority or attended scope>`
- Permitted setup writer and exact allowed setup paths: `<owner and file list, no folders/globs>`
- Independent setup reviewer: `Test Auditor v2`
- Parent execution route: `<existing task/test tool and required prerequisites>`
- Stop time, repair/check budgets and time reserved for final verification: `<approved limits>`

No setup write or execution follows from a path appearing here without its owner authority. No Git,
package installation/restore, service, live database/cloud or approval-setting change is implied.

## Capability Coverage

| Artifact or required check | Exact author/paths | Independent verifier | Tool/task and prerequisites | Authority | Readiness evidence |
| --- | --- | --- | --- | --- | --- |
| `<one row per required deliverable/check>` | `<permitted owner>` | `<required gate>` | `<available route>` | `<source>` | `<verified record or named blocker>` |

Include supporting-type bodies, workspace tasks, run-local validators and required documentation.
Unresolved dependent rows prevent an unattended-ready claim. Do not introduce an unnecessary setup
author when existing verified checks already satisfy the target.

## Protected Inputs

- Generated baseline path, revision and selectors: `<complete affected inventory>`
- Linked/inherited/shared specifications and data inputs: `<exact roots/paths and rationale>`
- Reviewed contracts/authority/plan inputs: `<immutable artifacts>`
- Existing task definitions and non-task settings: `<semantic comparison inventory>`
- Setup files and evidence helper/tool identities to freeze: `<exact paths>`
- Original executed test identities/outcomes by approved target: `<baseline record after setup audit>`
- Permitted later specification additions: `<authorized specification paths/revision and audit binding>`
- Approved skip identities and reasons: `<exact identities or none>`

Do not transcribe hashes. A pending real baseline is marked pending and blocks readiness; no test total
is guessed. Protected baselines and execution-input snapshots have different lifetimes.

## Checks

For each check provide a complete entry; refer to a shared target section rather than duplicating it.

```text
Check ID and new task label:
Stage and purpose:
Executable and argument array:
Working directory:
Project, target, configuration and runner:
Exact filter/selection and source of its approval:
Expected outcome (including any approved new-specification red):
Protected original identities and permitted added-case binding:
Inputs/tool/environment assumptions:
Fresh evidence/TRX/coverage paths beneath this run's evidence directory:
Build-only versus executed-test classification:
Operation limits and safe-output prerequisites:
Required reviewer and exact review subject/input binding:
```

Preserve old tasks; do not reuse their labels for new commands or point them at new evidence.
New results and manifests use create-new names. Unsupported runner output blocks the gate rather than
being interpreted optimistically. Compiling an example or snippet does not authorize executing it.

## Rejection Checks

| Input defect | Required result | Safe synthetic fixture/evidence |
| --- | --- | --- |
| Missing or stale result | Reject | `<record>` |
| Failed command or incomplete result | Reject | `<record>` |
| Zero executed tests | Reject | `<record>` |
| Unapproved skipped identity | Reject | `<record>` |
| Changed protected specification or authority input | Reject; no rebaseline | `<record>` |
| Removed/replaced original test, including equal-count substitution | Reject | `<record>` |
| Changed frozen setup, or repointed pre-existing task | Reject | `<record>` |
| Missing independent review, or review bound to different inputs | Reject freeze | `<record>` |

Synthetic records prove validator behavior only. They are never a product baseline or passing product
test result. Rejection cases are acceptance obligations, not a grant to edit the shared evidence helpers.

## Independent Gates

1. Setup author completes syntax/configuration and offline rejection checks.
2. Test Auditor reviews actual setup/plan and returns `Ready for baseline` bound to exact inputs.
3. Parent independently runs the approved checks and real baseline, checks actual identities/outcomes,
   and freezes setup/authority input hashes. No dependent product/test authoring before this gate.
4. Later new specifications receive a separate `Ready for implementation` audit tied to their revision.
   Freeze requires a verified completed review, not a filename or keyword match.
5. Final verification checks protected inputs, actual membership/outcomes and all target-required gates.

A frozen-setup change requires an explicitly authorized new target revision, fresh independent setup
review and baseline. Preserve old evidence and do not modify the validator during implementation.
