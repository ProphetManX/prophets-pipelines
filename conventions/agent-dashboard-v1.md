# Structured Agent Reporting v1

**Mode:** `dashboard-v1`. **Approved:** 2026-10-03, after the owner explicitly confirmed all agents
idle and authorized rollout to all project-run agents. The dashboard design and required verification
policy are unchanged. This maintenance starts no product run, grants no Git/release action, and
does not renew an old deadline or convert a frozen run.

Vanguard coordinates the project ledger and publisher. All 28 exact leaf display names in its
allowlist participate through the shared schema's `projectAgent` definition. Toolbelt Keeper is
not a project-run leaf and remains outside that allowlist. No agent, model pin, tool grant or
specialist responsibility is added or removed.

## Mode And Readiness

Use this mode for newly prepared dashboard-enabled runs. Vanguard proposes it as the standard
reporting route, with the exact operational paths and publisher operation in the normal owner-approved
target/envelope. The rollout makes every leaf compatible; it is not permission to start an arbitrary
run or write an unapproved repository. Do not request another approval at each unchanged handoff.

`dashboard-pilot-v1` remains the earlier two-leaf format, governed by
[agent-dashboard-pilot-v1.md](agent-dashboard-pilot-v1.md). Its registration restriction is retained
in the schema. Existing pilot and Markdown runs retain their original format, authority, checks and
protected inputs. A new full-roster run may preserve their records as history, never rewrite them.
When updating a persistent project ledger for a new run, preserve its prior invocation registrations,
canonical records, generated reports and publication integrity state. Do not add new work to an old
run merely because the project-level mode now supports more roles.

Before delegation, Vanguard verifies:

- The exact repository-local dashboard and project ledger are prepared and explicitly authorized.
  A different repository needs its own dashboard setup; installation in Logger does not create it.
- The installed Node/Ajv and the shared publisher/schema are available, inspected and bound to the
  current run. No installation, settings change or arbitrary script execution is implied.
- Each required report reader accepts the generated report and complete role-specific body. Use
  existing compatible readers/checks; do not create a new validator or review cycle just for reporting.
- A frozen reader/setup that needs changing follows the existing explicit revision, author, audit
  and baseline route. Never weaken a gate, repoint old tasks or silently fall back during an invocation.
- All exact current-run directories and registrations exist before the publisher/leaf starts.
  Unavailable reporting is a readiness limitation, not permission to omit required records.

A legacy-only repository or run remains on its existing route until the necessary setup/authority is
available. Report that boundary explicitly rather than claiming structured coverage that is absent.

## Ownership

| Artifact | Writer | Boundary |
| --- | --- | --- |
| `<repository>/ai-dashboard/live/project.json` | Vanguard | Milestone/slice forecast, progress/activity, dependencies, evidence links and immutable invocation registrations |
| Exact current-run `Record artifact:` JSON | That registered leaf invocation only | Its canonical operational status, complete report and help/review exchanges |
| Exact current-run `Report artifact:` Markdown | Shared deterministic publisher only | Compatibility projection, never another agent-authored narrative |
| Fixed `ai-dashboard/data/pilot-data.js`, `publisher-health.js` and publication-state/lock paths | Shared deterministic publisher only | Work projection, publisher heartbeat/error state and integrity bindings; legacy filenames remain for compatibility |
| Product documents, contracts, source, tests, setup, handoff, run control and authority | Their existing owners | Unchanged charter and approval boundaries; these are not replaced by dashboard reporting |

In this mode, every charter instruction to write/update/finalize its operational `Report artifact:`
means its own canonical `Record artifact:` instead. This is an explicit report-sink exception to
that charter's write limit, not permission for any additional product or operational file. Leaves
never write another record, the project ledger, publisher, schema, generated Markdown or integrity
cache. They gain no execution capability and never start the publisher themselves.

Documentation authors still author their assigned documents. Security Reviewer still writes its
security review; Session Scribe still owns the external session handoff. Those are deliverables,
not redundant report projections. Vanguard's run.md still holds authority, budgets, operations and
continuation. The project ledger links it instead of duplicating its history.

## Packet And Canonical Lifecycle

Keep every ordinary and specialist packet field, including distinct `Mode:`, `Invocation:`,
`Harness mode:`, `Decision mode:` and `Operator mode:` where applicable. Add:

```text
Reporting mode: dashboard-v1
Dashboard project: <absolute repository>/ai-dashboard/live/project.json
Invocation ID: <unique registered invocation ID>
Record artifact: <absolute current run>/<unique invocation>.json
Report artifact: <absolute current run>/<unique invocation>.md
```

The registration binds the exact leaf display name, run ID, stable slice ID, target revision and
both paths. `Report artifact:` stays mandatory for compatibility readers but is not leaf-writable.
Missing/mismatched fields yield `BLOCKED / PROTOCOL`; never improvise an alternate owner or format.

Read the [schema](scripts/agent-dashboard.schema.json). Author STARTED before substantive work,
with the actual objective, included/excluded scope, `scopeDecision`, intended `plannedCheck`, activity
and null outcome/reason/continuation. Update that same JSON at meaningful phase, blocker or
help/review boundaries, not every compiler correction or file save. Record observable actions and
concise findings, not private reasoning.

After the minimal registration/authority check, save the valid STARTED record before substantive
investigation. Vanguard registers the assignment and updates its own activity before dispatch;
registration alone is queued work, not proof an agent started. Do not postpone the first record until
completion. The display distinguishes queued, reported active, and finalized invocations and does not
derive current activity from an older imported run's completion status.

After the required work and checks, FINALIZE once with the actual outcome/reason/continuation,
non-working activity, evidence references, and the complete charter-required report in `body`.
Typed fields index the report; they do not replace required coverage, findings, approval provenance,
refusals or missing-work statements. Do not truncate a required report to fit a field: use the
existing coherent-scope split/stop rules and preserve every unfulfilled obligation.

Draft and validate the final summary/body before marking the record FINALIZED. Apply the completed
fields and final state in one last edit. Once finalized, no wording, timestamp, tense, formatting or
summary correction is permitted in place; use a fresh correction/recovery invocation. This rule
includes Session Scribe's operational report even while its separate handoff is still being completed.

Preserve role-specific output exactly:

- Commit Author retains the verbatim commit message or PR text in its required fence, including
  meaningful whitespace and line endings. The publisher adds no fence before that authored body.
- Requirements, contract, test, code, pipeline and infrastructure reviewers retain their distinct
  verdicts, reviewed/unreached scope, finding IDs, coverage and exact revision/input bindings.
  `Ready for baseline`, `Ready for implementation` and release readiness remain different claims.
- Owner Delegate retains decision mode/status, question/example, authority/profile/request bindings,
  eligibility limits and recovery/alignment evidence. Publication is not a human decision.
- Repository Operator retains the single operation, exact approval, before/after state, commands,
  actual/unknown effects and consumed IDs. A request/reply never authorizes an operation or retry.
- Session Scribe retains its mode and compact handoff obligations. No extra Scribe invocation or
  full reconciliation is required merely because a status changed.
- Every author retains its complete report, required evidence and existing product-file boundaries.
  No check, scan, review, target framework, skip policy or repair ceiling changes with this format.

The final chat keeps the normal outcome fields and role-specific response limits, linking canonical
and compatibility paths. If the generated report is absent/stale, say so. Do not hand-author it,
claim publication succeeded, or satisfy a gate with STARTED. Vanguard reconciles through the exact
authorized publisher route. Finalized canonical/derived bytes are protected when consumed by gates.
Corrections/recovery use a new registered invocation and retain the prior result and budgets.

## Plans, Requests And Replies

Vanguard records stable milestone/slice IDs across nights and keeps progress separate from activity.
Known work, tentative forecast slices and unplanned remainder stay distinguishable. Null forecast
total and an incomplete breakdown mean TBD, not zero remaining work. Every required completion
claim still needs its actual independent evidence; a JSON value cannot close a requirement.

Every leaf can record help/review requests in its own canonical record. Name the recipient, exact
scope, reason/concern and useful message. A review also names the changed delta and prior review/
baseline through evidence references, or explicitly says it is an initial review. The author focuses
attention but cannot restrict a reviewer from concrete affected risks or required whole-change gates.

Vanguard routes the request ID and evidence in the recipient's ordinary scoped packet. The recipient
replies in its own record using `replyTo`, without editing the requester's file. Published entries
are append-only: add a correction/reply rather than rewriting a prior statement. A response alone
does not mark a finding resolved or grant approval; the existing verifier/decision owner does that.
No direct peer invocation, new agent capability or extra review cycle follows from recording a request.

## Publishing, Recovery And Verification

Use [AgentDashboard.cjs](scripts/AgentDashboard.cjs) and its existing exact approved invocation:

```powershell
& $approvedNode $approvedPublisher --project $approvedProjectLedger --watch
```

Vanguard alone may start/stop that owned watcher under explicit authority. `--once` is the existing
bounded reconciliation route. The helper validates registered identities and paths, preserves exact
finalized/derived bytes, and generates local data plus compatibility reports. It executes no product,
Git, validator, installer or recorded command. Publication is formatting and integrity checking,
not independent review or verification of the report's substantive claims.

The page's existing refresh and history behavior are unchanged. Old finalized details become compact
archive references, not deleted evidence. At pause/sign-off, stop only the owned publisher; keep the
last accepted snapshot readable and activity honest. Stale status is not proof of failure or progress.
Publisher failure stops dependent evidence consumption for read-only reconciliation through the
existing permitted route. Never clear its integrity state or overwrite reports to make it pass.

`publisher-health.js` is separate mutable operational health, never a gate input or substitute report.
The owned watcher refreshes it every 15 seconds and records `watching`, `stopped`, or `blocked`; a
one-shot publication ends as stopped. The page treats a watching heartbeat older than 60 seconds as
unconfirmed. An abrupt process termination or unwritable health file may leave a stale record, not a
fresh stopped signal. An integrity rejection still stops publishing and preserves accepted work data;
the health banner exposes that failure instead of presenting the last snapshot as a live connection.
No command, private exception detail or product-acceptance claim is stored in this health record.

[Test-AgentDashboard.cjs](scripts/Test-AgentDashboard.cjs) checks the roster, both modes, schema,
report fidelity and publisher boundaries using temporary fixtures. Dashboard browser checks exercise
the same UI with multiple roles and request/reply pairs. These are not proof that every agent has
run in the new mode or that VS Code loaded the new definitions. Reload/check the selector and use a
fresh authorized Vanguard run for that observation. Required product verification remains unchanged.
