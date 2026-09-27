# Agent Protocol v2 - Shared Delegation Mechanics

**Applies to:** the active v2 roster. **Revised:** 2026-09-27. **Owner:** G. Gordon Nasseri (ProphetManX).

This revision governs **new runs only**. Existing invocations and continuations retain their recorded
protocol, acceptance revision, budgets, and gates until the owner explicitly closes or re-scopes them.
Toolbelt changes require confirmation that affected agents are idle; old STARTED records alone cannot
prove activity or inactivity. Never interrupt a run to apply a customization change.

On 2026-09-27 the owner confirmed all agents idle and approved rolling timeboxed assignments, successive
local checkpoints including verified green partial work, evidence-backed delegated recovery, and
isolation of known broken work. The human retains pushing. These are future-run opt-in mechanisms, not
permission for any project operation, deadline renewal, automatic merge or weakened validation gate.

On 2026-09-26 the owner confirmed all agents idle and authorized the approved-design specification
alignment category in section 4. It requires explicit future-run delegation, independent eligibility
verification, separate specification authorship/audit and revision-bound evidence. This maintenance
grants no retroactive authority, project edit, validator repair or restart of an expired run.

On 2026-09-21 the owner confirmed the other agent window had finished and authorized creation and
wiring of `Owner Delegate v2` after the decision-profile interview. This enables the bounded delegation
mechanism in section 4 for future explicitly opted-in runs, not a product run or a blanket proxy
approval. Existing deadlines, operation authority, protected inputs and independent gates remain.

The owner confirmed all existing agents idle on 2026-09-19 for the supporting-type ownership,
validation-setup and readiness update. It changes no roster, model pin or tool list and authorizes no
product edit, Git operation or restart of an old run. Expired envelopes remain expired.

The owner confirmed all agents idle for the 2026-09-17 opt-in unattended local-checkpoint update.
That customization authorization permits no project Git or PR operation. The attended exact-proposal
workflow is preserved; the exception below applies to future explicitly opted-in runs only.

Read the repository's `AGENTS.md`, this protocol, then the authoritative inputs for the slice. If this
protocol is unreachable, apply §8 and say so. Read nearby controlling code rather than broad unrelated
surfaces. Once a sound local approach and discriminating check are clear, act; stop investigating
alternatives for reassurance. Rationale and examples: [agent-toolbelt-v2.md](agent-toolbelt-v2.md).
Roster and archived-generation history: [agent-toolbelt.md](agent-toolbelt.md).

## Minimum Complete Scope

Vanguard fixes **one shared acceptance target per coherent work slice**, in an immutable revision under
the run directory. Record approved observable behavior, preserved invariants, exclusions, owning author
and write scope, required checks/reviews with risk rationale, operation authority, and effort ceilings.
Every author and verifier uses that same revision and applicable inherited contracts.

Implement the **smallest complete solution**. Do not add speculative abstractions, extension points,
configuration, providers, retries, or lifecycle features. Necessary safety and correctness are part of
the minimum, not optional extras. If they need a semantic decision or extra authority, stop dependent
work and name the decision; neither silently omit them nor expand the target.

Specification changes require an explicitly authorized new revision and baseline, preserving previous
evidence. Authority is direct owner approval or section 4's expressly delegated
`approved-design-specification-alignment` route, never implementation output. That category aligns
expectations to already-approved behavior; it cannot change that behavior. Findings and passing
implementations never rewrite acceptance. Optional improvements are nonblocking deferred work, not
new requirements or grounds for an automatic second pass.

Assignment, slice and checkpoint status are separate. Rolling authority in section 5 lets Vanguard
derive slices within an approved design without predicting every filename upfront. A `GREEN_PARTIAL`
checkpoint under section 6 preserves verified unfinished work; it never completes the target, removes
unmet requirements, or turns a failed required check into a passing one.

### Risk-Proportional Routing

**Bounded delivery is the default** for understood, reversible local work, including production work.
After normal preflight, use the existing implementation owner and independent focused final verification
by Vanguard or the invoking owner. Do not automatically invoke discovery, architecture, the full review
cycle, documentation authors, or landing. A passing baseline is valid; no non-shipping label is required.

Add `Test Designer v2` when new approved behavior or a concrete regression risk needs specifications.
`Test Auditor v2` independently checks the changed specifications and relevant harness before the
implementation owner proceeds. Reuse specifications that already discriminate a defect; an import
correction is not a reason to manufacture a new red phase.

Retain relevant specialist gates for public contracts, architectural decisions, security-sensitive
behavior, consequential operations, and releases. Contract and requirements authors retain independent
reviewers. Database lifecycle, ownership, concurrency, or shared-state changes require explicit risk
review and appropriate code/test/security specialists; a file called a helper is not automatically low
risk. Pipeline and infrastructure author/reviewer gates remain intact. Explicit owner checks and
narrower charter limits always apply. Bounded completion is not release certification.

### Capability Readiness

Before promising unattended execution, Vanguard accounts for every planned artifact and required check
in the shared target: exact permitted author/paths, independent reviewer, execution tool/task,
prerequisites, operation authority and readiness evidence. Include supporting-type bodies, workspace
tasks, external validators and necessary documentation. A path in a packet cannot override a charter.
For rolling work, apply this to the next selected slice and reuse the verified assignment-wide capability
map; future filenames need not all be known. Do not declare dependent authoring ready until its actual
paths, checks and execution roots are resolved.
An unowned artifact or unavailable check is a preparation blocker, not something to discover after
functional implementation starts. Continue only genuinely independent approved work under §4/§6.

Reuse suitable existing checks when their inputs, selection, tools and environment are verified.
Missing setup goes through the separate setup author/audit/baseline route below before dependent
product/test authoring. Do not create new tasks or invoke extra agents merely to satisfy a ritual.
The [shared validation skill](skills/prophetsway-validation/SKILL.md) supplies the reusable procedure
and plan template; loading it never grants authority or changes a tool restriction.

### Concrete Supporting Types

Interface Architect owns the declarations and XML documentation of supporting types; Contract Reviewer
reviews the exact immutable snapshot. Implementer may materialize that reviewed surface and implement
enumerated constructors, accessors, methods and necessary private state only under `Supporting-type
scope:` and the owner's approved target. Definitions, documentation and test specifications remain
protected. No new public/protected surface, interface/enum change or undocumented behavior is implied.

When missing declarations prevent test compilation, a target may separately authorize compile-only
surface preparation by Implementer: reviewed declarations/docs with fail-fast
`System.NotImplementedException` bodies, not functional code or manufactured answers. This is not
behavioral completion. Test Designer's discriminating execution and independent Test Auditor gate still
precede functional implementation. The parent compares declarations/docs with the reviewed snapshot
and independently verifies execution; whole-file equality cannot check a file whose bodies change.
Required code/security review remains separate. A contract change returns to its author and reviewer.

### Bounded Test-Harness Work

`Test Harness Engineer v2` has three exclusive modes. Scaffold and maintain keep the same
test-project-only helper boundary; validation-setup has its separate task/run-local boundary. Every
invocation declares exactly one `Harness mode:` and carries the applicable fields in §1.

| Mode | Entry | Completion and independent verification |
| --- | --- | --- |
| `scaffold` | Designer-named missing infrastructure; generated specification baseline and reproducible blocker | Blocker cleared; approved regression executes and exposes the intended unmet behavior; parent verifies, then Test Auditor audits |
| `maintain` | Owner explicitly requested a bounded change to exact non-specification helper, fixture, adapter, or connection/configuration paths | Acceptance criteria met, focused validation passes, specification inventory and hashes unchanged; parent checks the actual diff and hashes and independently reruns the focused validation |
| `validation-setup` | Owner-authorized exact workspace-task/run-local validator paths and an immutable validation plan, with protected-input baseline | Author syntax/offline rejection checks; independent Test Auditor `Ready for baseline` bound to exact inputs; parent independently executes the approved baseline and freezes setup before product/test authoring |

All modes use the shared acceptance target and a generated baseline covering affected, inherited,
linked, and shared specifications and their inputs. Maintenance needs no designer report or fabricated
blocker. Unexpected scaffold green requires investigation: it may reveal pre-existing correct behavior
or a bypass, but never authorizes manufactured red or silently relabeling the lap. Unexplained green or
a bypass blocks completion; any change to the expected result needs an authorized target revision.

No mode changes product assertions, expected results, specification inputs, traits, skips, discovery,
or production implementation, directly or indirectly. Selection and gate criteria come from the target,
never from the setup author. Hash equality alone does not prove a helper preserved
production exercise: inspect its diff and actual test membership. New specifications belong to Test
Designer. A mismatch is a blocker, never an invitation to rebaseline. Apply §6 even to local fixtures;
connection plumbing grants no live operation authority. Required checks remain required.

### Validation Setup And Freeze

Validation-setup owns only the exact named repository `.vscode/tasks.json` and enumerated `.ps1` or
non-secret `.json` files under the current external run directory. Append approved new task definitions;
preserve every old task and other setting, reject duplicate labels and never repoint an old task.
No auto-run or approval-setting change. Repairs before freeze remain limited to the new authorized
entries/files. Product implementation approval alone is not setup-write authority.

The immutable `Validation plan:` fixes commands/argument arrays, project/target/configuration/selection,
protected inputs and original test identities, expected outcomes, permitted added cases/skips, reviewers,
rejection checks and operation limits. Read the shared skill before authoring or reviewing it. Reuse
AgentEvidence without editing it; all new evidence stays create-new under this run's `evidence/`.

Evidence-integrity checks are allowed in validators, not invented product expectations. Author checks
must exercise missing/stale results, failed/zero-test runs, unexplained skips, protected-input or
membership changes and wrong review/input binding. Synthetic fixtures test the validator, never prove
product execution. Test Auditor reviews the exact plan/setup and returns `Ready for baseline`; the
parent independently executes the approved checks/baseline and freezes setup/authority hashes.
No dependent product/test authoring before that boundary. Later new specifications still require a
separate `Ready for implementation` audit tied to their exact revision. A marker or filename is not
proof of review; freeze requires the parent's verified completed review-to-input binding.

Frozen setup is an acceptance input. Changing it requires an explicitly authorized new target revision,
independent setup audit and fresh baseline, preserving prior records. No mid-implementation validator
repair, filter narrowing, silent rebaseline or self-approval. Setup grants no Git, restore/install,
service, live database/cloud or other operation authority and cannot route around a refused approval.

---

## 1. The Task Packet

A parent sends the required fields below. Values may link to an exact section of the **same immutable
acceptance target**, rather than duplicate it. A leaf with a missing or unreadable required input returns
`BLOCKED` / `PROTOCOL`, naming the input before substantive work. Include only applicable specialist fields.

| Field | Required | Meaning |
| --- | --- | --- |
| `Mode:` | yes | `delegated one-shot run`, unless the leaf charter owns this field for its operation (such as contract review `csharp`/`http`); retain that operation mode and use `Invocation:` below |
| `Invocation:` | when the charter owns `Mode:` | `delegated one-shot run`; never send two conflicting `Mode:` fields |
| `Objective:` | yes | One concrete deliverable, one sentence |
| `Repository root:` | yes | Absolute path. Never inferred from a filename |
| `Run directory:` | yes | Absolute path to `<project-parent>/.agent-runs/<run-id>/` — see §2 |
| `Report artifact:` | yes | Absolute path to this invocation's Markdown report inside the run directory |
| `Acceptance target:` | yes | Immutable shared target path and revision; all authors and verifiers use it |
| `Assignment authority:` | rolling work, recovery or isolation | Immutable owner-approved assignment/envelope and source; binds approved design, work areas/exclusions, operation/delegate grants, original deadline and hard limits. Slice targets derive from it, never replace it |
| `Scope:` | yes | What is included **and** what is excluded |
| `Authoritative inputs:` | yes | `AGENTS.md` plus the exact artifact paths that define the work |
| `Settled owner decisions:` | yes | Quoted. A recommendation restated as a decision is a protocol violation by the parent |
| `Known unresolved inputs:` | yes | Named, not hidden. `none` is a legitimate value |
| `Allowed writes:` | yes | Intersection of target and charter, plus operational evidence; reference boundaries rather than restating them |
| `Definition of done:` | yes | Link to shared target checks/reviews and expected outcomes, not a second target |
| `Run envelope:` | only for unattended runs | See §5. Absent means an attended run |
| `Decision mode:` | only for Owner Delegate | Exactly `advise` or `decide`; advice grants no continuation authority |
| `Decision request:` | only for Owner Delegate | Immutable current-run question/ID, concrete example, options/recommendation, source evidence and blocked dependency; see section 4 |
| `Decision profile:` | only for Owner Delegate | Exact profile path/revision and generated SHA-256 evidence, fixed for this run |
| `Decision authority:` | only for Owner Delegate | Exact owner-approved target/envelope clause and approval source; `none - advisory only` is valid only for `advise` |
| `Delegated decision:` | when a downstream packet consumes one | Finalized decision report plus Vanguard's recorded eligibility/freshness verification and the original owner delegation; never label the delegate's answer as a human quotation |
| `Recovery attempt:` | an extra default-policy attempt under section 5 | Unique decision/attempt ID, finalized bounded-recovery decision, independent eligibility, exact plan/check/effort and cumulative history; one attempt, not renewed assignment authority |
| `Specification alignment:` | when authoring or auditing an approved-design expectation revision | Exact immutable alignment revision under section 4, assertion-specific before/after delta, approval/decision/eligibility binding, previous baseline/failures and current generated comparison evidence; never a general test-write or setup grant |
| `Supporting-type scope:` | only for Implementer's concrete supporting-type exception | Exact paths, immutable declarations/XML snapshot and its Contract Reviewer record, permitted bodies and generated input baseline; distinguish any separately approved compile-only preparation from functional implementation |
| `Harness mode:` | only when invoking `Test Harness Engineer v2` | Exactly one of `scaffold`, `maintain` or `validation-setup`. Missing, unrecognized, or combined is `BLOCKED` / `PROTOCOL` |
| `Allowed helper paths:` | harness `scaffold`/`maintain` | Exact test-project file paths, never folders, globs, or implicit additions; every path must be non-specification infrastructure |
| `Allowed setup paths:` | harness `validation-setup` | Exact `.vscode/tasks.json` and current-run `.ps1`/non-secret `.json` paths; only target-approved new task entries, never a folder/glob or an old run |
| `Validation plan:` | validation-setup author/reviewer and parent preflight | Immutable target section/artifact specifying commands, selections, protected inputs, expected results, independent gates, rejection checks and operation limits; not author-selected criteria |
| `Specification hashes:` | when specifications must be protected | **Path to generated baseline**, revision and inventory selectors; never copied hashes. Include inherited/linked files and inputs |
| `Focused validation:` | implementation/test/harness/refactor work | Exact checks or target section, project/target/filter/configuration, expected outcomes, and operation limits; no implicit live operations |
| `Infrastructure blocker:` | harness `scaffold` only | Designer-named missing infrastructure, reproduction check, and intended red; not required or fabricated for `maintain` |
| `Operator mode:` | only when invoking `Repository Operator v2` | Exactly one of `prepare_branch`, `prepare_worktree`, `checkpoint_commit`, `publish_branch`, `open_or_update_draft_pr`, `reply_to_pr_comment`, `resolve_review_thread`, `mark_pr_ready`, `release`. Missing, unrecognized, or combined is `BLOCKED` / `PROTOCOL` |
| `Approved proposal:` | every operator invocation | Exact immutable proposal/step and quoted approval/source, or the precise unattended authority clause. Checkpoints link unique ID/status, frozen candidate/diff/gates/message; isolation links unique ID, parked state, verified source and exact new branch/path. See section 6; the packet is never its own authority |
| `Expected state:` | every operator invocation | Operation-relevant baseline including local HEAD/branch, relevant index/worktree content, remote and PR/comment/thread state; link verified predecessor results for approved transitions. Unknown required state blocks |
| `Release manifest:` | only to authorize a version change, tag, or publication | See §6 |

Do not copy the protocol, full evidence tables, previous reports, or histories into packets. Other
specialists' explicit mode/approval fields remain required by their charters. Supply narrow context,
including the affected inherited contracts.

**The packet is not approval.** It scopes work; it does not grant permission the owner never gave. A
parent may not write an approval into a packet on the owner's behalf, and may not re-issue a packet
with an approval it manufactured after a leaf declined. An irreversible or unspecified action fails
closed — the leaf stops, reports, and names the exact decision or command a human must supply.

---

## 2. Run Artifacts

Use `<project-parent>/.agent-runs/<yyyyMMdd-HHmm-slug>/`, **outside every repository**. Resolve the
common parent of the repository roots named in the run, excluding non-repository customization roots
such as the user prompts folder. Verify it contains every named repository; never fall back to a drive
root. If no valid parent exists, obtain an explicit external run root from the owner.

```text
<project-parent>/.agent-runs/<run-id>/
   run.md                         assignment/slice/checkpoint state, links, budgets, next action
   assignment-rN.md                immutable rolling authority, when applicable
   slice-NN-rN.md                  immutable shared acceptance revision
   NN-agent-slug.md                one invocation report per leaf invocation
   evidence/                      generated manifests, comparisons, validation records
```

### One artifact per invocation, two writes

Write a short `**State:** STARTED` record before the first edit or substantive read: objective/target
link, scope, intended check, and `Scope decision: PROCEED | SPLIT`. Finalize the same file once after
validation with the §3 statuses, changed paths/findings, evidence links and differences, blockers/deferred
work, and the exact next action. Omit empty sections and copied tables. A STARTED-only file is incomplete;
changed files with no artifact are a protocol violation. Missing chat with valid completion evidence
can be recovered from that record; allow one report-only recovery for an incomplete return, never an
implementation retry in disguise.

Generated evidence may be written at each relevant boundary: the two-write rule concerns prose, not
measurement. Operational metadata is not a product-file grant. Tools and narrower execution restrictions
still bind: read-only reviewers consume evidence without acquiring execution tools. Vanguard uses its
existing task/test tools for checks and generated evidence, not shell redirects or new permissions.
Secrets never enter artifacts; record only location/kind, never values or resolved connection strings.

### Operational Markdown

Use spaces, blank lines around headings/lists/fences, and standard fence languages. Re-open and lint
written reports before completion. A charter cites this rule instead of repeating a lint checklist.

### The parent's `run.md`

Update `run.md` at meaningful state/ownership/authorization transitions, not every compiler correction or
file save. Keep original assignment authority/deadline/time zone, status, remaining approved work,
slice targets/dependencies/status, active owner/root/branch, parked work, cumulative budgets/recovery
consumption, last verified checkpoint and exact next action recoverable. Checkpoint success never closes
the assignment. Status replies update rather than finalize it. Finalize at a real completion, planned
pause or stop with the actual stopping condition, evidence links and unfinished work. Use this one
record between slices, not a fresh orchestration project or Scribe wrapup per commit.

### Retention

Retain run directories **30 days**. Only completed/reviewed, unreferenced runs older than that are
eligible for separately authorized manual cleanup. Never delete active, unreviewed, failed, or referenced
runs. A retention list is not deletion authority; no automatic cleanup is introduced by this protocol.

---

## 3. Outcome, Reason, Continuation

Every delegated completion requires all three fields:

```text
Outcome: COMPLETE | PARTIAL | BLOCKED | NO_CHANGE | FAILED
Reason: NONE | SCOPE_SPLIT | OWNER_DECISION | VALIDATION | REVIEW | ENVIRONMENT | PROTOCOL | BUDGET
Continuation: CONTINUE | SWITCH_WORKSTREAM | STOP_RUN
```

`COMPLETE` means assigned scope and checks finished; `NO_CHANGE` means existing work was reverified.
`PARTIAL` names verified portions and every omission. `BLOCKED` means no sound deliverable can proceed.
`FAILED` records a tool failure or violated validation invariant. A review finding is normally
`PARTIAL` / `REVIEW`, not a failed reviewer. `NONE` accompanies only COMPLETE or NO_CHANGE. Budget
exhaustion is `PARTIAL` / `BUDGET`, not permission for another attempt. Other reasons name the actual
blocker, without implying that an unavailable or failed check passed.

The section 5 recovery exception needs original owner delegation, a fresh decision and independent
eligibility before one further default-policy attempt; `PARTIAL` alone grants nothing. A hard cap stays
hard. Operator `COMPLETE` means its operation finished, not that a partial feature or assignment did.

`Continuation` is the leaf's recommendation about the **run**, not about itself. A leaf that finished
its own work but discovered a global blocker still returns `Continuation: STOP_RUN`.

### Scope ceiling

Before editing, a leaf enumerates its independently verifiable tasks and **reserves capacity for
validation and the report** — those come out of the same budget as the edits. If it cannot confidently
finish, validate, and report the whole packet, it picks a coherent subset, records
`Scope decision: SPLIT` with the deferred tasks named, completes that subset, and returns
`PARTIAL` / `SCOPE_SPLIT`. The ceiling is judgment, not a task count: a fixed number blocks a leaf that
could finish ten trivial tasks and permits one that cannot finish two large ones.

A parent **accepts** a declared split and routes the remainder as a fresh packet with a **new** report
artifact. It never re-invokes a leaf to push it past a ceiling the leaf declared.

---

## 4. Unknowns Are Dependency-Scoped

An unknown blocks **what depends on it**, not the run. The default response to a missing input is to
**table the question and continue independent work**.

Table it in the run report's blockers section — then move to the next independent workstream.

**Only `Product Discovery v2` writes `docs/open-questions.md`.** Other leaves report exact question text
and the blocked stream. Batch durable promotion when useful rather than invoking Discovery for each
routine repair. The existing document owners retain decisions, requirements, and feature-request files.

**Stop the whole run only when one of these holds:**

1. No independent work remains.
2. A never-invent uncertainty in public API, security, data ownership/privacy, financial semantics,
   architecture or release commitments cannot be isolated from the remaining work. Otherwise defer
   its dependent slice and continue only independent approved work; never assume the missing answer.
3. A mandatory stop in §6 applies.

Categories in (2) are never invented — not defaulted, not "reasonably assumed", not inferred from a
sibling repository. They are elicited during discovery or deferred as a stream.

### Owner Delegation

`Owner Delegate v2` applies the owner's [decision profile](owner-decision-profile-r1.md) to bounded
choices inside a design the owner has already discussed and approved. It is a decision leaf, not an
orchestrator, implementation author, reviewer or substitute human identity. Its report is labeled
**delegated decision**, not a claim that the owner personally approved that answer.

**Default is advisory only.** A run needs an explicit owner-approved `Owner delegation:` clause in its
immutable target/envelope to consume `Decision mode: decide`. The clause names designed components,
permitted decision classes or specific open choices, fixed profile path/revision and generated hash
evidence, exclusions, applicable checks/reviews and the existing path/operation/budget limits. Quote
the approval source. "Use the stand-in" is sufficient only when it clearly approves that already
presented clause, not an unbounded policy the parent writes afterwards. Toolbelt creation is not opt-in
for a project run. No extra approval turn is needed for each decision inside a valid clause.

Suitable classes include choosing an internal strategy within approved behavior, resolving a bounded
design detail the owner expressly delegated, and taking an owner-stated conditional alternative after
its exact premise is disproved. The separately named `approved-design-specification-alignment`
category below permits only a replacement expectation already fixed by current approved requirements.
Generic preference delegation does not include it. Ordinary corrections, direct owner-approved
revisions and transitions already authorized need no delegate invocation. The profile guides judgment;
it neither creates project requirements nor widens the clause. Do not make every author correction
or implementation choice a new gate.

The separately named `bounded-recovery` category in section 5 permits one extra default-policy repair
attempt per verified decision. Multiple fresh requests are possible inside the original window; this
is not permission to extend time, hard owner ceilings, specialist limits, operations or acceptance.

The following cannot be delegated through this mechanism:

- New components/workflows, architectural responsibilities or consequential cross-component behavior;
  new public-contract semantics rather than exact details within an existing reviewed delegation.
- New security, access, privacy, data ownership/overwrite policy, financial semantics or release
  commitments. A hypothetical import preference does not resolve a real application's conflict policy.
- New file/author grants, operations, spending, Git/PR/release actions, versions, environment approvals,
  lifecycle/destructive authority, expanded scope, hard owner budgets, renewed deadlines or a bypass
  of refusal. Only explicit `bounded-recovery` can extend default-policy repair attempts as specified
  in section 5; it overrides no narrower specialist or owner limit.
- Reversing an unconditional owner decision, overriding conflicting authority, clearing a blocking
   review by preference, or changing/waiving required checks or frozen validation setup. Frozen
   specification expectations remain protected except for the exact alignment category below; no other
   specification change or weakened approved guarantee is delegated.

Exact member names/signatures for an approved capability may already be delegated to the contract
author and independent reviewer. That remains their work: neither the number of members nor the
delegate's confidence establishes a new semantic grant. Narrower charters always bind. A leaf requiring
an actual quoted owner approval for its operation must still receive one; the delegate cannot supply it.

#### Delegation At Preflight

Before promising unattended work, record `Owner delegation status:` as `ACTIVE`, `ADVISORY_ONLY`,
`EXPIRED`, `REVOKED` or `UNRESOLVED` in the preflight summary and `run.md`. For `ACTIVE`, link the exact
current-run approved clause/source, decision classes (explicitly including or excluding alignment),
profile revision/hash evidence, scope, limits and expiry. Absence is advisory, not implicit opt-in.

Reconcile the current owner request, approved target/envelope and relevant handoff on preflight and
resume. An approved, still-valid opt-in for this run must not disappear during packet construction or
context recovery: recover and carry its exact clause, or mark `UNRESOLVED` and block dependent delegated
work. Never silently downgrade it to advisory or infer approval from a handoff alone. Expired, revoked,
different-run or ambiguous authority cannot become active without fresh applicable owner approval.
No automatic renewal, deadline reset or reuse of this maintenance request as project-run authority.

#### Approved-Design Specification Alignment

The explicit run-delegation category is `approved-design-specification-alignment`. It authorizes Owner
Delegate to approve the minimum expectation delta without another owner turn **only when all of these
are established from inspected sources**, not an implementation or a recommendation:

- Current, explicit owner-approved requirements unambiguously establish the replacement. Record their
  approval provenance and which design governs; a newer timestamp alone does not resolve conflicting
  approvals or prove supersession.
- The exact old assertion directly contradicts that design. Record file, stable test identity,
  assertion location, literal before/after expectations and the requirement/approval for each delta.
  No new behavior, ambiguous requirement, weakened approved guarantee or unrelated expectation changes.
- Existing file, Test Designer author, operation, budget and deadline boundaries already permit the
  work. Preserve test identities, discovery, traits, skips, filters, required checks and independent
  reviews. A decision category is not an expansion of any of those grants.

The **approved design is authoritative, not the implementation**. If a valid test exposes an
implementation defect, leave it intact and route the production fix under existing authority. Do not
replace exact equality with containment, drop a read-only check, accept an extra unapproved member or
otherwise weaken a test to obtain green. Mechanical test-code corrections already authorized to their
author need no delegate. New design/security/ownership choices, conflicting approvals and expanded
scope still require the human. A required review's specific finding is resolved through its reviewer,
not waived by a delegated decision.

Use the existing decision lifecycle below, with this additional revision boundary:

1. Before any specification edit, register the question and exact proposed delta in an immutable
   request. Link the governing design/approval, current target, original protected baseline, prior
   failures and generated current-input comparison. Unexpected pre-existing specification drift blocks
   this route; it cannot be retroactively approved or hidden by a fresh baseline.
2. Owner Delegate returns a report-only decision. Vanguard independently re-opens the governing
   requirements/approvals, old assertions and contrary evidence; verifies the entire eligibility test,
   input identities, grant freshness and remaining capacity for authoring, audit and checks. Record
   eligibility before dependent work; a `DECIDED` label is insufficient.
3. For an admissible decision, Vanguard creates a **new immutable alignment revision** of the shared
   target, linked to its predecessor, decision ID, original owner delegation and verified report. It
   records the exact assertion delta and carries forward all other approved behavior, invariants,
   exclusions, authors/paths, operations, checks/reviews and remaining budgets unchanged. Never overwrite
   the predecessor, baseline or failure records. Downstream packets all name the new revision through
   `Specification alignment:`; no mixed-revision authoring or retroactive reclassification of results.
4. Test Designer alone edits the enumerated expectations and records actual focused execution plus a
   generated candidate inventory/comparison and assertion-level diff against the preserved baseline.
   Every change, including elsewhere in the same allowed file, must be explained by that exact delta.
   Test Auditor independently reviews the revised specifications against the approved design, candidate
   identities and actual diff; require `Ready for implementation` bound to those inputs. The delegate's
   decision and Vanguard's eligibility check replace neither authorship nor that audit.
5. Vanguard verifies the completed audit binding, current diff and full protected-input/test inventory,
   establishes a new specification baseline bound to the approved revision and audited candidate, and
   independently executes the required checks through existing authorized tools. Keep original cases
   and account for every observed outcome change without rewriting previous failures. Approved unmet
   behavior may remain honestly red for the existing implementation owner; unrelated failures remain
   blockers and required green gates must pass before acceptance. No skipped test, narrowed filter,
   waived review or baseline refresh merely to make a run pass.
6. Record the actual applied delta, author/audit reports, old/new baseline and failure/result links,
   independent verification and remaining blockers in the Decision register for morning review. A
   decision not acted on is recorded as such, never as completed work.

**Validation setup is separate.** Reuse verified existing setup only if it already supports the approved
revision with its authorized commands, membership, outcomes and evidence bindings. If applying the
alignment needs any frozen validator, task, plan, threshold or authority-binding change, stop that
dependency and use the separately owner-authorized validation-setup revision, independent setup audit
and fresh baseline process. Alignment grants none of those writes or changed criteria; never repair a
validator during implementation or accept an old review against changed inputs.

#### Decision And Continuation

1. Before consultation, Vanguard assigns a run-local decision ID and records the exact worker question,
   approved design/target, safe source links, concrete example, options, recommendation, consequences
   and blocked dependency in an immutable request. Every owner-level question is registered, including
   those sent directly to the human and those left deferred. Do not invent questions for routine work.
2. Give Owner Delegate the standard packet and four decision fields. It inspects the relevant evidence,
   cites profile rules and the exact authority clause, and writes its STARTED/finalized report under
   the existing lifecycle. A recommendation alone, missing decisive evidence or conflicting rules
   yields `NEEDS_OWNER`; an advisory packet yields `ADVISORY`, never `DECIDED`.
3. **Before dependent work**, Vanguard re-opens the finalized report and independently checks approval
   provenance, scope, profile/request/target identities, decisive facts and contrary evidence, remaining
   budgets and mandatory stops. Use generated input identities through the existing evidence route;
   no new execution/write permission follows. Recheck decision-relevant external facts separately.
   Record this eligibility check in `run.md`; the word `DECIDED` or a confidence score is not a gate.
4. Only an admissible `DECIDED` result can select the choice covered by the owner's clause. Pass both
   the original delegation and the verified report to the existing author. Record the selection as an
   immutable run-local resolution linked from the shared target, without overwriting that target's
   approved behavior. Required contract/requirements/test reviews still precede dependent implementation.
   An expressly delegated approved-design specification alignment instead uses the new immutable
   revision and separate baseline/audit route above. Any other frozen specification change, changed
   invariant or frozen setup requires the owner's explicit revision route; the delegate cannot grant it.
5. `ADVISORY`, `NEEDS_OWNER`, incomplete reports, drift or expired authority never unlock blocked work.
   Apply dependency-scoped continuation and mandatory stops unchanged. Do not shop for another answer,
   reset repair budgets or reinterpret a reviewer refusal as a preference question. New evidence may
   support a fresh invocation within the same remaining authority; retain the prior record.

The delegate has `read`, `search` and report-only `edit`, with no execution or child-agent tools.
Tool minimization limits capability; its report-only path rule is a charter, not a filesystem sandbox.
Vanguard checks decision admissibility separately from downstream authorship and verification. Owner
morning review calibrates judgment; it does not replace required technical review or retroactively
authorize a prohibited action.

#### Morning Review And Learning

Vanguard keeps a **Decision register** in `run.md`: ID, question/example/request link, mode, profile
revision, decision/report, eligibility check, affected work, actual actions/verification links, and
owner-review disposition. Initially `PENDING`; later record `AGREED`, `CORRECTED`, `DEFERRED` or
`NOT_ACTED`, with the owner's actual words/reason where applicable. Do not rewrite finalized decision
reports. Completed assessment is not completed implementation; preserve both records separately.

Alignment entries also link the exact old/new assertions, governing requirement/approval evidence,
predecessor and new immutable revision, preserved failures and baselines, actual diff, independent audit
and rerun results. Record declined/ineligible questions and production-fix routing too, so morning
review shows what was decided, what actually changed and what remains unverified.

Use a real inspected example where available. Redact sensitive details or label a synthetic example
honestly; never put secrets, raw credentials or unnecessary personal data in the record. If no concrete
example/evidence can safely establish a decision-critical fact, defer it. Every question, including
advice and deferrals, must be discoverable from the morning register. Scribe links it and summarizes
unreviewed decisions at the normal handoff boundary, not once per question. Unreviewed decision runs
remain protected by section 2's retention rule.

When the owner answers, ask one concrete why/exception follow-up if their reasoning is absent. Do not
repeat a reason already given or delay otherwise authorized work merely to complete a profile interview.
Separate instance corrections from proposed general rules; record source, context and counterexample.
Only owner-confirmed learning enters a new profile revision through Toolbelt Keeper while affected
agents are idle. Workers and the delegate never edit it. A correction to current work follows normal
owner re-scope, author and independent verification routes; it does not silently change past evidence.

Personal code review normally does not block an already-designed dependent component after required
gates pass and no major design issue remains. Explicit human hold points still bind. An undesigned
workflow or consequential interface change comes back to the owner before dependent work proceeds.

### Focused Specifications And Review

Tests cover approved behavior, relevant boundaries, and material failure risks. A checklist prompts
judgment; it does not require every matrix cell to be filled. Every blocking review finding traces to
an obligation or concrete in-scope risk, with location, consequence, and the property needed for
correctness. Optional improvements are nonblocking. Reviewers neither author fixes nor demand a defect
merely to fill a closing section.

Implementation and harness owners never weaken specifications, conceal production defects, or
manufacture red. Test Designer may repair its own mechanical test-code errors without changing approved
semantics. An obsolete expectation fixed unambiguously by current approved design may use the explicit
alignment category above; unresolved semantic disputes still require the owner. Both revision routes
require independent audit, never an expected result chosen to agree with implementation.

---

## 5. Budgets And Productive Iterations

Keep one implementation owner responsible through ordinary compile/fix cycles. Validate small increments
before expanding. A corrected import, type name, or local implementation within the target needs neither
fresh owner approval nor a new discovery/TDD cycle.

Use a **bounded progress-aware policy**: absent a stricter owner ceiling, budget an author invocation
at 30 minutes including checks/reporting; stop after two consecutive corrective attempts with the same
failure and no new discriminating evidence or verified progress. New evidence must change the causal
understanding or resolve part of the failure; rerunning or rephrasing a guess is not progress. Summarize
only the current problem and link recorded check/failure deltas.

An ordinary compiler invocation is not a parent-mediated repair cycle. A cycle is a returned failed
gate or blocking review sent back to its owning author, followed by focused verification. Do not
re-delegate after every compile. No blind retries, unlimited exploration, or automatic fourth-attempt
stop. **Every explicit owner ceiling retains its stated meaning**, including command-attempt limits;
never reinterpret or reset it on a new packet. Narrower specialist limits, including the requirements/
contract single repair pass, remain binding. Genuine scope/semantic decisions still require the owner.

Two no-progress attempts are not a two-slice or two-compile limit. Ordinary verified progress needs no
delegate invocation. The default repair stop blocks further attempts at that problem, not every
independent slice, unless a mandatory stop applies. Only the explicit recovery procedure below may
permit another attempt; a new packet, slice name or worktree never resets a counter.

### Rolling Assignment Authority

Before an unattended rolling assignment, obtain approval of one immutable envelope covering designed
requirements and their sources, repositories, initial agent branches/HEADs, permitted projects/directories
or files, exclusions, author boundaries, required checks/reviews, original stop timestamp including date
and time zone, and explicit operation/delegate grants. Record hard caps as hard; ambiguous numeric limits
remain hard. The deadline governs rolling throughput unless the owner also fixes a build/slice cap.
Installation, "keep busy", allowed paths or this maintenance are not approval of an unspecified design.

Vanguard may split/reorder the already-designed work and choose new in-scope filenames as each slice
becomes ready. Create that slice's immutable target and exact author paths just in time, preserving all
applicable inherited obligations and remaining limits. Checkpoint gates and unfinished completion
obligations are distinct and fixed before authoring, not narrowed after a failure. No exhaustive list
of future files or slices is needed, but a permitted folder grants no new feature or charter exception.
New responsibilities, expanded areas or altered approved behavior still need the existing owner route.

Match areas by canonical repository-relative path components, not string prefixes. Exclusions win;
reject traversal, symlink/junction escapes and access to unrelated repositories or Git internals.
An approved isolation root maps the same relative work-area policy to its verified checkout; it grants
no neighboring paths. Leaf-specific exact-path, author and review requirements remain load-bearing.

After every slice boundary and verified checkpoint, Vanguard enters `NEXT_ACTION`: reconcile current
time, latest owner instruction, assignment status, authority, consumed operations/recovery, remaining
work and dependencies. Select a ready slice, not merely the next numbered one, and actually start its
next authorized action in the same turn. Consult active Owner Delegate for an eligible unresolved
question before deferring it to the human; routine transitions do not need its permission. Missing
implementation approval permits only already-authorized investigation/run-local planning or other
independent work, never inferred repository/setup writes. Record the exact missing decision.

With a valid window and a ready authorized slice after a successful commit, continuation is required
without another user prompt. A status question neither cancels nor extends the assignment. Preserve
the original deadline and grants on resume; no fresh window, silent advisory downgrade or counter reset.
Reserve time for checks, checkpoints and closeout. At expiry or explicit pause/cancellation start no
new product/Git action; safely reconcile in-flight effects, preserve files and report. Ending early is
valid when all requested work is done or no permitted action remains, or a hard/safety stop applies.
Name the actual stop instead of treating a slice, commit, status reply or leaf completion as sign-off.

### Delegated Bounded Recovery

The owner may expressly include `bounded-recovery` in the assignment's `Owner delegation:` clause.
It permits Owner Delegate to evaluate extensions of the default no-progress/per-gate repair policy,
not a deadline, hard owner cap, specialist review/scope ceiling or operation refusal. Generic preference
or alignment delegation is insufficient. Preserve the original approval/source and cumulative history.

1. Vanguard registers a fresh immutable request with the exact failure/slice/gate, previous attempts
   and results, inspected new evidence and changed causal understanding, a materially different next
   plan, discriminating check, permitted author/paths, bounded effort including verification/reporting,
   original deadline and remaining capacity. Repeated output or rewording a guess is not new evidence.
2. Owner Delegate evaluates whether that plan is justified within the original grant. `DECIDED` permits
   exactly one attempt under its plan/check/effort; an ineligible request returns `NEEDS_OWNER` with the
   reason and dependency. No blanket sequence, renewable permission or implicit next attempt.
3. Before dispatch, Vanguard independently verifies evidence, authority, current input identities, hard
   limits and safe-closeout capacity. Pass `Recovery attempt:` to the existing permitted author; mark
   the unique decision consumed when the attempt starts and record its actual result afterwards.
4. A later failure may support another fresh request with new evidence and a revised plan. There is
   no fixed total of valid recovery approvals within the original window; every request is adjudicated
   separately. No automatic renewal, reset of totals, answer shopping, or repeated unchanged proposal.

Recovery never grants Git retries, live operations, unavailable checks, changed protected expectations,
frozen setup repair, scope expansion or a waived review. Those retain their separate rules. Narrower
leaf limits, including one requirements/contract repair pass and a declared scope ceiling, still bind.
Declined/exhausted recovery defers that problem; switch only to genuinely independent permitted work.
Record decisions and outcomes in the existing Decision register, not new per-attempt handoff machinery.

### The Autonomous Run Envelope

An unattended run is authorized by an envelope, and **an envelope is approval only for the exact
actions written in it**. Anything not named is unapproved.

| Field | Required | Default |
| --- | --- | --- |
| `Allowed repositories:` | yes | — |
| `Allowed paths:` | yes | — |
| `Required checks:` | yes | — |
| `Required reviews:` | yes | — |
| `Capability readiness:` | yes | Target section linking artifact/check ownership, available execution routes/prerequisites, and verified setup/baseline evidence before dependent authoring |
| `Stop by:` | yes | Exact owner-approved date/time/time zone; 07:00 local is a preparation suggestion, never a self-renewing window |
| `Max repair cycles per failed gate:` | yes | 3 under default policy; explicitly delegated bounded recovery may add one attempt per decision. Any stated hard owner cap remains hard |
| `Max build laps:` | yes | 8 for a bounded non-rolling run; rolling assignments use the approved deadline unless an explicit numeric hard cap is set |
| `Pipeline runs:` | no | **Not allowed unless explicitly named** |
| `Owner delegation:` | no | **Advisory only when absent.** Explicit opt-in names designed components, categories, pinned profile and limits. Name alignment and bounded recovery separately; preserve active/advisory/expired/revoked/unresolved status |
| `Local checkpoint:` | no | **No Git authority by default.** Section 6's explicit `single-final` or `rolling` policy needs both candidate-selection and message-authorship delegations; green partial checkpoints require explicit permission |
| `Worktree isolation:` | no | **Not allowed by default.** Explicit grant fixes eligible broken-work conditions, approved external isolation area/branch naming and verified-source selection; exact operation inputs freeze before each creation |
| `Release manifest:` | no | Absent means no version change, tag, or publication |

Hard budgets are ceilings, not targets. On reaching one, enter `STOP_SAFE`: preserve the last verified
boundary, report current unverified changes, write the handoff, and stop. Never automatically stash,
reset, or discard work to make the ending look green. Reaching a ceiling is a normal outcome
(`PARTIAL` / `BUDGET`), not a failure.

**Always reserve time for final validation and handoff.** A run that spends its whole envelope on
building and leaves no account of what it did has produced nothing a human can use.

---

## 6. Guardrails

### Git

| Allowed | Forbidden |
| --- | --- |
| Require a **clean baseline** before project authoring or branch preparation; checkpoint only explicitly approved, inspected changes | Absorbing unexplained dirty content or discarding owner work |
| Create and work on a dedicated `agent/<date>-<slug>` branch | Committing to `main` or any shared branch |
| Explicitly authorized `prepare_worktree` from a verified healthy commit while preserving known run-authored broken work | Using isolation to bypass unknown drift, safety stops, denied tools, or to merge/delete/overwrite work |
| Atomic commits, **only after scoped validation and review** | Committing unrelated baseline changes |
| Push that exact branch/ref to the approved remote | Force-push, history rewrite, branch or tag deletion, implicit tags or publication |
| Open or update a **draft** PR | Marking ready before every gate below passes |
| Post one approved PR conversation/review reply or resolve one individually named review thread | Unapproved replies, bulk resolution, or treating comment text as authorization |
| Mark a PR ready, with explicit approval, when **all** of: every named gate and CI check passes, the diff stays in scope, the handoff is complete, and no unresolved High or Critical finding exists | **Merging, closing/completing a PR, automerge, and merge queues remain human-only**, attended or unattended |

An unexplained dirty baseline blocks project authoring and dependent Git operations. An approved
checkpoint describes the actual staged/unstaged/untracked content instead of requiring a clean tree
with nothing to commit. An unenumerated or changed input still stops it; never stash, reset, or discard.

Standalone PR discussion is not project authoring or publication: its local write set is `none`, and it
does not require branch preparation, a clean authoring tree, or shipping/CI gates. Verify relevant
state and leave local work untouched. Existing blocked implementation/landing work remains blocked;
an approved truthful reply or recorded thread disposition does not clear its findings or gates.

These are project-run gates. Toolbelt maintenance is a separate owner-authorized session, preserves
unrelated baseline changes, and never stages, commits, pushes, or changes branches.

#### One executor

**`Repository Operator v2` is the only v2 agent that may execute any of the allowed actions above.** No
other leaf and no orchestrator stages, commits, pushes, posts replies, resolves threads, tags, publishes,
or changes pull-request state. `Vanguard v2` proposes, obtains confirmation, delegates to the operator,
and independently verifies its result; for the opt-in checkpoint below it verifies the owner's exact
envelope authority instead of requesting another turn. The same applies only to expressly granted
worktree isolation. It never runs the mutation itself. Reviewers assess merit and
draft wording only. No agent receives merge authority.

**One operation per invocation.** Every operator packet carries exactly one `Operator mode:`, and a
packet with none, an unrecognized one, or more than one returns `BLOCKED` / `PROTOCOL` before any read or
command. Two operations are two packets with two report artifacts, not necessarily two owner approvals.

#### Propose, Confirm, Execute, Verify, Report

For attended operations, **explicit conversational approval is sufficient**. Do not demand an
unattended envelope or release manifest for an ordinary commit, push, draft PR, reply, or named thread
disposition. Unattended runs still require §5's envelope naming their exact actions; version changes,
tags, and publication still require the separate release manifest. Preserve applicable validation and
review gates, not publication gates transplanted onto routine discussion.

In the exact-proposal route, before any operation Vanguard presents a concise proposal in the existing
acceptance target and records the owner's exact confirmation/source in `run.md`. Only the opt-in local
checkpoint below may defer final candidate/message selection under explicit owner delegations; it still
freezes both before execution. Explicit worktree isolation similarly freezes exact operation inputs
under its original grant. No extra orchestration framework is required. Exact proposals include:

- Repository root and GitHub host/owner/repository; local branch/HEAD and exact remote/destination ref
   with expected tip, plus PR number/URL, base/head repositories/refs and head SHA as applicable.
- Exact staged/unstaged/untracked file paths **and reviewed content identity**, including pre-staged
   changes, for a checkpoint; `none` for remote-only discussion. Never folders, globs, or `git add -A`.
- Intended ordered steps and modes, explicitly naming staging/commit, push, draft creation/update,
   reply target kind and comment ID/URL, and each individual review thread ID to resolve.
- Verbatim commit message, PR title/body, reply text, and per-thread `fixed`, `accepted-risk`, or
   `no-change` disposition with evidence/rationale. A reply and a resolution are separate named actions.
- Expected before/after state and applicable checks. Bind an unknown future SHA or URL explicitly to
   a named predecessor result, such as `commit SHA verified by step 1`; only expressly approved text
   placeholders may use those outputs. Never authorize an unspecified "latest HEAD" or prose rewrite.

A clear approval of that proposal authorizes **only it**. A request to investigate or "handle the
comments", a reviewer recommendation, or a parent-authored packet is not confirmation of undisclosed
mutations. Missing, ambiguous, rejected, or revoked approval means no mutation and
`BLOCKED` / `OWNER_DECISION`. The attended parent asks the owner; a delegated leaf reports the missing
decision instead of waiting. Never turn rejection into a differently worded attempt.

One confirmation may cover `checkpoint_commit` -> `publish_branch` -> `reply_to_pr_comment` ->
`resolve_review_thread`. Vanguard invokes each separately, carrying the same approved proposal and
its own named step. It verifies the preceding report and actual result before advancing. **Do not ask
again for unchanged details**, and never silently append an action. Advance expected HEAD/state only
from verified outputs of approved predecessors, within the proposal's explicit bindings.

Immediately before each mutation the operator re-reads expected HEAD and operation-relevant state:
branch, content/index inventory, remote identity/tip, PR head/base/draft state, target comment/thread
content and resolution, and required check evidence. Changed scope, text, files, target, relevant
discussion, or unexpected state stops the remaining sequence for a fresh proposal and confirmation.
Do not replace the expected baseline with whatever is now observed. Expected effects of the approved
predecessor are not drift; an unrelated external edit or push is.

After each step, read back and record the actual commit/remote/PR-head SHA, PR/comment URL and ID, or
thread status, as appropriate. A tool exit or an operator's assertion alone is insufficient; Vanguard
independently checks the result and approval match. There is no automatic next step after failure or
uncertainty. Preserve and report completed, failed, and unknown effects, including staging left after a
failed commit or a possibly posted reply. Read-only reconciliation is allowed; blind retry or rollback
is not. An uncertain result must be reconciled and any retry explicitly reapproved.

#### Opt-In Unattended Local Checkpoint

Default remains no Git authority. Before authoring, the owner must explicitly authorize local staging/
committing, final verified candidate selection by Vanguard, and verbatim commit-message authorship by
Commit Author. Record the exact approval/source in the immutable authority and `run.md`. Implementation
approval, work areas, a packet, a delegate decision or this maintenance never supplies these grants.

Two policies are distinct; never silently upgrade an existing approval:

- `single-final` retains exactly one complete-target local checkpoint, with fixed repository, exact
  agent branch, starting HEAD, exact maximum file list, immutable target, gates and budgets. No partial
  or second commit follows; a failed/uncertain attempt consumes the authority.
- `rolling` explicitly permits successive unique local checkpoints within section 5's approved
  assignment. Fix design, repository, initial branch/HEAD, permitted areas/exclusions, authors, gates
  and deadline; select exact paths per slice. State whether `GREEN_PARTIAL` checkpoints are permitted.
  No need to know every future filename. An authorized isolation result may identify a new continuing
  branch; no unrelated observed branch/HEAD can replace the approved chain.

#### Checkpoint Eligibility And Execution

`COMPLETE` means the slice's completion obligations and required gates are satisfied. `GREEN_PARTIAL`
preserves useful unfinished work at a blocker or planned boundary: every required checkpoint check
and applicable independent review must pass for the actual entire candidate, including regression
coverage for changed behavior. Build/test green alone does not waive a required review or safety gate.
Record implemented work, missing requirements, blockers and next action; keep the slice incomplete.
An independent next slice may proceed, but no dependency on the unfinished behavior is satisfied.

Checkpoint criteria come from the approved authority/target before authoring. Never narrow filters,
drop/skip tests, waive checks, move failed obligations into a new slice or silently redefine acceptance
to label work green. An intentionally red specification is still failed execution and cannot enter a
green partial commit. Unreviewed, stale, unrun, failing or unbound required evidence, an unresolved
required finding, High/Critical risk, unrelated content or secret blocks checkpointing. Missing final
feature behavior is recorded separately, never deleted from the target or reported as finished.

1. Finish applicable product documentation through its existing owners before freeze. Independently
   verify candidate scope and required execution/reviews. Reuse unchanged valid evidence under section
   9, including configuration/tool/runtime/selection/environment bindings; do not reopen unchanged
   reviews or rerun a suite solely because a commit is next. Reuse existing manifest/Git evidence
   routes, not a new validation framework or run-local script for each checkpoint.
2. Freeze a generated exact candidate manifest, inspected diff, all active index/worktree paths and
   content identities (pre-staged, unstaged, untracked, added/deleted), expected branch/HEAD/state,
   checkpoint ID/status, gate links, unfinished obligations and verbatim Commit Author message. Keep
   parked work separately inventoried, not staged into the active candidate. All active changed content
   must be enumerated and in scope. First parent is the approved starting HEAD; later parents bind only
   independently verified approved predecessor commits or an expressly authorized isolation source.
3. Record the unique operation ID as dispatched before invoking Repository Operator once. Its packet
   links original authority and frozen records through `Approved proposal:` and `Expected state:`.
   The operator checks no prior/in-flight attempt, expiry/revocation, eligibility, gates and the entire
   frozen state immediately before staging. Stage only exact paths, inspect the staged diff, recheck
   HEAD/branch/index/worktree against expected staging effects, and commit exact content/message once.
4. Changed frozen HEAD, branch, content, index or message stops for fresh owner approval, not unattended
   re-freeze or retry. Expected approved predecessor/staging effects are not drift; later authorized
   authoring after a consumed checkpoint is not frozen forever. Failure/uncertainty preserves actual
   and unknown effects, including staging, and stops Git successors for read-only reconciliation.
   A new ID cannot recycle a failed attempt. No automatic rollback or delegate-approved Git retry.
   Tool denial remains an environment stop, never an alternative tool/script or settings change.
5. The operator records actual effects. Vanguard performs one independent readback of commit SHA,
   parent, exact message, changed paths/content and resulting branch/index/worktree against the frozen
   records. Record the checkpoint consumed and enter `NEXT_ACTION` immediately. Operator success or a
   clean tree is not assignment completion; a ready authorized next slice starts without a user prompt.

Five minutes is a **soft checkpoint-administration target**, from an eligible verified candidate through
message/freeze, operator execution, independent readback and the existing run-record update. Track
elapsed time; an overrun needs a brief concrete cause, not more paperwork, skipped safeguards or an
automatic assignment stop. It extends no deadline. Full Scribe wrapup is not a checkpoint prerequisite.

Rolling authority is local-only: the human reviews and pushes. It grants no push, PR action, merge,
cherry-pick, rebase, amend, ref deletion, version change, tag, release or publication. Initial branch
preparation and worktree creation need their own authority. Attended exact-proposal operations remain
available under their existing rules, not as an implicit successor of the overnight assignment.

#### Isolating Known Broken Work

Only a distinct owner-approved `Worktree isolation:` clause or exact attended proposal permits
Repository Operator `prepare_worktree`. The clause fixes the assignment/repository, allowed external
worktree area and branch naming, verified-source selection, eligible known run-authored build/test
failures, unchanged scope/gates and original deadline. It delegates exact safe branch/path selection
within those bounds to Vanguard. Default is no isolation authority; it does not follow from commits.

Before the operation, stop active writers/commands through their authorized lifecycle and confirm they
are quiescent. Preserve the broken checkout and all failure records. Freeze a unique isolation ID,
parked root/branch/HEAD and complete tracked/untracked dirty content inventory, failure evidence,
last verified healthy source SHA and its gate bindings, and exact new branch/path. Unknown dirt,
unexplained drift, a safety stop, failed/uncertain Git action or refused tool cannot be bypassed this way.

The operator verifies repository identity, source evidence, current parked state, unused ID, absence of
destination directory/branch, expiry/revocation and canonical containment. Reject traversal or symlink/
junction escapes and locations inside any existing checkout or run-artifact directory. Recheck before
one ordinary `git worktree add -b` with exact branch/path/SHA. No force, switching the parked checkout,
stash/reset/cleanup, submodule update, restore/install, merge or remote action. Existing files survive.
Read back new root/branch/HEAD/common Git identity and clean index/worktree, and compare parked contents
against the frozen record. Failure/uncertainty requires read-only reconciliation and fresh owner
approval, never a new ID and automatic retry; report all actual or unknown effects.

Vanguard independently verifies that result, then binds author packets and checks to the new root and
verifies its required baseline/readiness. An old absolute-path task can test the wrong checkout;
creating a worktree alone proves no build/test readiness. Reuse setup only with correct verified inputs,
otherwise use the separately authorized setup route. External databases/services are not isolated by
a worktree; their approvals and ownership limits still apply. Never promise continuation without this
execution route. Missing readiness defers dependent work, not permission to repoint frozen setup.

Keep subsequent ready slices on one continuing healthy branch, not a worktree per slice or parallel
completed branches. Track parked work and remaining obligations in `run.md`. When unblocked, existing
authors finish the approved behavior against the current continuing branch with current specifications
and fresh verification, using parked changes as reference. No blind tree copy, automatic Git merge,
cherry-pick or rebase. Routine code reconciliation is agent-owned; genuinely new design conflicts need
the delegate only inside its grant, otherwise the owner. Report the healthy branch for review/push and
any still-parked incomplete work. Never automatically delete parked files, worktrees or refs.

#### Replies And Thread Dispositions

`reply_to_pr_comment` posts one verbatim approved reply to one identified PR conversation or review
comment. A review reply uses its verified reply-parent and thread IDs; a conversation reply is a new
PR conversation comment with the approved original-comment reference. Read current replies with full
pagination and previous operation evidence first. An unambiguous matching author/target/body already
posted is `NO_CHANGE` with the verified URL, not a second post. An ambiguous match blocks. No implicit
comment edit/deletion, review submission, or thread resolution is authorized.

`resolve_review_thread` targets **one named thread**. For `fixed`, require focused fix verification
and freshly verify that the fixing commit reached the actual PR head (or is an ancestor) and that
the fix remains present there. A local SHA, a push exit code, stale checks, or an outdated thread alone
does not prove this. For explicit owner-approved `accepted-risk` or `no-change`, record the quoted
rationale without claiming a fix. Any public explanation is a separately approved reply step. No
disposition waives validation/security/release gates or marks their findings closed.

An already-resolved named thread is `NO_CHANGE` after reading its current status, with no reply,
unresolve, or claim this run fixed/resolved it. Likewise, exact already-applied PR text can be a no-op.
If a no-op reveals unexpected external state, stop the remaining sequence and reconfirm rather than
letting that state silently authorize its successors.

Use available GitHub tools or authenticated `gh` within existing tools and normal VS Code approval
controls. Choose a supported route before acting; a denied approval or unavailable authentication is
§6's environment stop, never permission to switch routes. Do not request credentials in chat, expose
secrets in artifacts, change approval settings, or interpolate review text as executable shell code.

**Writing prose is never authorization to execute it.** `Commit Author v2` produces the message and the
PR body and runs no mutating command; `Changelog Author v2` records a version implication and changes no
version. The operator alone acts, and only on the exact owner-approved proposal/envelope or manifest.

### Release

**Only an exact release manifest may authorize a version change, a tag, or a publication.** It must
name: repository, version file, **exact old and new values**, channel, tag, feed or target, artifacts,
gates, and a cost cap where one applies.

**Never infer a version or a release channel.** A version bump that "looks like" the next patch is an
invention with a permanent consequence — a published package cannot be unpublished.

**The manifest is executed by `Repository Operator v2` in `release` mode and by nothing else.** It
verifies every old value by reading the file before any edit, changes only the named fields to the named
new values, runs the named gates, and performs only the exact tag, push, and publication the manifest
names. It never deletes or replaces a published artifact or tag. An absent, incomplete, or
self-inconsistent manifest means the release is not attempted at all — not in a reduced form, and not as
a "prepared" one.

### Azure and pipelines

No unattended Azure deployment, ever. A v2 run may author, build, lint, and preview; the mutating
command is named in the report for a human to run. Pipeline runs are allowed only when the envelope
explicitly names them.

Cloud and database operations are separately authorized from source changes, including test connection
plumbing. A configured endpoint is not permission to connect, publish a schema, create or delete a
database, or change identity/firewall settings. Name the operation and obtain the owner's authorization
through the appropriate workflow; an agent's narrower prohibition still wins. Local validation uses
synthetic configuration or explicitly scoped isolated fixtures, never an implicit live endpoint.

Database fixtures require explicit ownership **before execution**: which isolated resources this run
may create, how it proves ownership, and which cleanup it may perform. Never drop/reset a pre-existing,
shared, or ambiguously owned database. Review target selection, failure paths, and concurrency; database
lifecycle or parallel execution in a helper is not automatically low risk. No implicit live connections,
destructive probes, retries, or certification runs. Credentials go through the existing protected
mechanism, never command arguments or captured diagnostics. Unsafe-to-capture output is a reported
limitation, not permission to expose it.

### A refused environment is an outcome, never a detour

A tool, terminal, or service that **denies or cannot obtain approval** for an action — an auto-approval
policy that blocks a mutating git or cloud command, an editor approval prompt that cannot be answered
unattended, a missing credential — is `BLOCKED` / `ENVIRONMENT`. The agent names the exact command a
human must run, and stops.

**It is never a reason to reach the same effect another way.** Not through a different tool, an alternate
command spelling, a script file, a shell redirect, or a broader permission. The control that refused is
the control working; routing around it is a charter violation regardless of the outcome, and it is
reported as one if it is observed.

### Mandatory stops

Stop the run — `STOP_SAFE`, then report — on any of:

- an unexplained dirty baseline for project authoring/Git work, or an operation's relevant state or
   diff drifting outside its approved scope;
- an unresolved High or Critical review or security finding in dependent implementation/landing work;
   standalone approved discussion may truthfully report it, but never waive it;
- a hard owner or specialist repair/build/time ceiling reached; an exhausted default-policy repair
   trigger follows section 5's explicit recovery or independent-work route, never an automatic reset;
- a required check that cannot run at all, as distinct from one that ran and failed;
- an unapproved mutation, including an irreversible action absent from the attended approved proposal
   or unattended envelope; version changes, tags, and publication still require a release manifest;
- an owner decision required in one of the never-invent categories in §4, with no independent work
  left.

---

## 7. Session Handoff

`Session Scribe v2` alone owns `<project-parent>/.agent-runs/session-handoff-v2.md`, beside the run
directories and outside repositories. It is exempt from their retention. Resolve its absolute path
once and pass it verbatim; never create a repo-local v2 handoff or touch the v1 handoff. Operational
continuity remains writable when repository preflight blocks project work.

**Batch Scribe work**: resume when session continuity needs reconciliation, checkpoint at a meaningful
session boundary or planned pause, wrapup at assignment sign-off. Do not invoke Scribe for every minor
repair, compiler pass, author handoff, slice switch, commit or green increment. `run.md` provides recovery
between those boundaries. A fresh bounded request may skip resume when no prior state is carried;
it still ends with a final record and session-boundary handoff. A completed slice/operator report does
not trigger wrapup while the assignment still has a permitted next action.

The handoff states current work, next action, blockers, evidence links, and at most three short recent
entries; it must be usable in under two minutes. Reconcile referenced current work, not every recent
run by default. Enumerate wider history or retention only for requested recovery/cleanup; never delete
automatically. Missing handoff means fresh start; consumed means already resumed, not replay old work.

When a run contains owner-level questions, include a compact morning-review summary and link its
Decision register: delegated decisions acted on, advice, deferred questions, pending owner review and
proposed learning. Include concrete-example/report links without copying the full ledger into the
handoff. Consuming a handoff does not mean the human reviewed its decisions.

Batch durable promotions to their existing owners. Scribe verifies, never authors them. `fresh` requires
required promotions complete; otherwise record `live` and exact pending owners/paths. Optional deferred
improvements alone do not require new product documents or block a correctly bounded completion.

---

## 8. Fail-Closed Fallback

If this protocol cannot be read, a v2 agent still applies all of the following, and says in its report
that the protocol was unavailable:

1. Do not ask a question or wait for a turn that cannot arrive.
2. Write the `Report artifact:` file with `**State:** STARTED` before the first edit or long read; if no
   such path was supplied, return `BLOCKED` / `PROTOCOL` immediately.
3. Stay strictly inside `Allowed writes:`.
4. Invent nothing in the never-invent categories: public API surface, security, data ownership and
   privacy, money, architecture, release commitments.
5. Treat anything irreversible or unnamed as unapproved.
6. Return all three fields — `Outcome`, `Reason`, `Continuation` — and the exact human action required.

## 9. Mechanical Evidence

Before producing or reviewing validation evidence, read the
[prophetsway-validation skill](skills/prophetsway-validation/SKILL.md). This is an explicit procedural
requirement, not reliance on automatic skill discovery. Its installed personal copy and repository
mirror are maintained by Toolbelt Keeper; if the required procedure is unavailable, block dependent
work. It does not grant reviewer execution or override Vanguard's task/test-tool boundary.

Use [scripts/AgentEvidence.psm1](scripts/AgentEvidence.psm1), tested offline by
[scripts/Test-AgentEvidence.ps1](scripts/Test-AgentEvidence.ps1), or existing tools with equivalent
evidence. Utilities are not authorization, a sandbox, a new agent, or a tool-permission change.

- Generate manifests with SHA-256; **never transcribe hashes**. Record revision, inventory selectors,
   all affected specifications/inputs, including inherited/linked/shared ones. The parent verifies
   selector completeness; hashing a partial inventory does not prove completeness.
- Protect frozen validation setup and its authority/review bindings alongside specifications. A
   changed validator is not just a new execution input; it requires the explicit setup-revision route.
- Capture once per approved specification revision. Recompute comparisons before protected-input
   mutation, after each author handoff, after authorized specification work, and at final verification.
   Within an owner's unchanged specification boundary, reuse the baseline rather than rehash every
   file save. Added, removed, and renamed files count as drift; never refresh a baseline to excuse it.
- Record exact executable/arguments, working directory, project/target/filter and non-secret
   configuration, start/end times, exit code, input/result fingerprints, actual test identities/counts,
   failures and skips. Runner results establish execution, not attribute counts. Zero executed tests,
   failed checks, unexplained skips, incomplete results, or stale inputs/results cannot count as success.
   Deliberate red evidences a specified failure, not a green gate. Label build-only checks build-only.
- Reuse results only while relevant inputs, configuration, tool/runtime identity, selection, and
   environment assumptions remain valid. Mutation invalidates affected checks. External database state
   is not proved by file hashes: separately authorized live checks need fresh environment evidence and
   are not reusable by default.
- Compare identities as well as totals when specifications must be unchanged, especially for adapters
   and refactors. Equal counts can hide replaced/skipped tests. Inspect behavior and diffs alongside
   comparisons; a manifest mismatch blocks, never silently rebaselines.
- For an explicitly authorized alignment revision under section 4, compare the exact approved delta
   against the preserved predecessor before accepting the audited new baseline. Unlisted changes block,
   including changes to other assertions in the same file. Retain old failures/results as history; do
   not apply unchanged-outcome equality across different approved revisions or treat any delta as a pass.
- Authors validate increments; Vanguard or the invoking owner independently verifies final scope,
   comparisons and focused execution. Read-only reviewers consume those records within their tools.
   Reports link authoritative generated records and summarize results/differences, not copied tables.
   Never claim unperformed independent review, whole-suite certification, or publishing readiness.
