# Agent Protocol v2 - Shared Delegation Mechanics

**Applies to:** the active v2 roster. **Revised:** 2026-09-12. **Owner:** G. Gordon Nasseri (ProphetManX).

This revision governs **new runs only**. Existing invocations and continuations retain their recorded
protocol, acceptance revision, budgets, and gates until the owner explicitly closes or re-scopes them.
Toolbelt changes require confirmation that affected agents are idle; old STARTED records alone cannot
prove activity or inactivity. Never interrupt a run to apply a customization change.

The owner confirmed all agents idle for the 2026-09-12 Git/PR approval update. That customization
authorization permits no project Git or PR operation; the workflow below applies to future runs only.

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
evidence. Findings and passing implementations never rewrite acceptance. Optional improvements are
nonblocking deferred work, not new requirements or grounds for an automatic second pass.

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

### Bounded Test-Harness Work

`Test Harness Engineer v2` has two modes with the same file boundary, not two roles. Every invocation
declares exactly one `Harness mode:` and carries the harness fields in §1.

| Mode | Entry | Completion and independent verification |
| --- | --- | --- |
| `scaffold` | Designer-named missing infrastructure; generated specification baseline and reproducible blocker | Blocker cleared; approved regression executes and exposes the intended unmet behavior; parent verifies, then Test Auditor audits |
| `maintain` | Owner explicitly requested a bounded change to exact non-specification helper, fixture, adapter, or connection/configuration paths | Acceptance criteria met, focused validation passes, specification inventory and hashes unchanged; parent checks the actual diff and hashes and independently reruns the focused validation |

Both modes use the shared acceptance target and a generated baseline covering affected, inherited,
linked, and shared specifications and their inputs. Maintenance needs no designer report or fabricated
blocker. Unexpected scaffold green requires investigation: it may reveal pre-existing correct behavior
or a bypass, but never authorizes manufactured red or silently relabeling the lap. Unexplained green or
a bypass blocks completion; any change to the expected result needs an authorized target revision.

Neither mode changes assertions, expected results, specification inputs, traits, skips, discovery, or
production implementation, directly or indirectly. Hash equality alone does not prove a helper preserved
production exercise: inspect its diff and actual test membership. New specifications belong to Test
Designer. A mismatch is a blocker, never an invitation to rebaseline. Apply §6 even to local fixtures;
connection plumbing grants no live operation authority. Required checks remain required.

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
| `Scope:` | yes | What is included **and** what is excluded |
| `Authoritative inputs:` | yes | `AGENTS.md` plus the exact artifact paths that define the work |
| `Settled owner decisions:` | yes | Quoted. A recommendation restated as a decision is a protocol violation by the parent |
| `Known unresolved inputs:` | yes | Named, not hidden. `none` is a legitimate value |
| `Allowed writes:` | yes | Intersection of target and charter, plus operational evidence; reference boundaries rather than restating them |
| `Definition of done:` | yes | Link to shared target checks/reviews and expected outcomes, not a second target |
| `Run envelope:` | only for unattended runs | See §5. Absent means an attended run |
| `Harness mode:` | only when invoking `Test Harness Engineer v2` | Exactly one of `scaffold` or `maintain`. Missing, unrecognized, or combined is `BLOCKED` / `PROTOCOL` |
| `Allowed helper paths:` | both harness modes | Exact test-project file paths, never folders, globs, or implicit additions; every path must be non-specification infrastructure |
| `Specification hashes:` | when specifications must be protected | **Path to generated baseline**, revision and inventory selectors; never copied hashes. Include inherited/linked files and inputs |
| `Focused validation:` | implementation/test/harness/refactor work | Exact checks or target section, project/target/filter/configuration, expected outcomes, and operation limits; no implicit live operations |
| `Infrastructure blocker:` | harness `scaffold` only | Designer-named missing infrastructure, reproduction check, and intended red; not required or fabricated for `maintain` |
| `Operator mode:` | only when invoking `Repository Operator v2` | Exactly one of `prepare_branch`, `checkpoint_commit`, `publish_branch`, `open_or_update_draft_pr`, `reply_to_pr_comment`, `resolve_review_thread`, `mark_pr_ready`, `release`. Missing, unrecognized, or combined is `BLOCKED` / `PROTOCOL` |
| `Approved proposal:` | every operator invocation | Exact immutable proposal section/revision and step; quoted owner approval and its recorded source, or the exact unattended-envelope clause. See §6; the packet is never its own authority |
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
   run.md                         parent state, target/report/evidence links, budgets
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
file save. Keep target, active owner, budget, last verified boundary, and next action recoverable. Finalize
before the final response with state/status, report and evidence links, remaining decisions, budgets, and
baseline-versus-final summaries. An unfinalized record is incomplete, whatever the leaves accomplished.

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
2. The uncertainty affects a **public API surface**, **security**, **data ownership or privacy**,
   **money or financial semantics**, **architecture**, or a **release commitment**.
3. A mandatory stop in §6 applies.

Categories in (2) are never invented — not defaulted, not "reasonably assumed", not inferred from a
sibling repository. They are elicited during discovery or deferred as a stream.

### Focused Specifications And Review

Tests cover approved behavior, relevant boundaries, and material failure risks. A checklist prompts
judgment; it does not require every matrix cell to be filled. Every blocking review finding traces to
an obligation or concrete in-scope risk, with location, consequence, and the property needed for
correctness. Optional improvements are nonblocking. Reviewers neither author fixes nor demand a defect
merely to fill a closing section.

Implementation and harness owners never weaken specifications, conceal production defects, or
manufacture red. Test Designer may repair its own mechanical test-code errors without changing approved
semantics. A disputed assertion requires an authorized specification revision and independent audit,
not changing the expected result to agree with implementation.

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

### The Autonomous Run Envelope

An unattended run is authorized by an envelope, and **an envelope is approval only for the exact
actions written in it**. Anything not named is unapproved.

| Field | Required | Default |
| --- | --- | --- |
| `Allowed repositories:` | yes | — |
| `Allowed paths:` | yes | — |
| `Required checks:` | yes | — |
| `Required reviews:` | yes | — |
| `Stop by:` | yes | 07:00 local |
| `Max repair cycles per failed gate:` | yes | 3 |
| `Max build laps:` | yes | 8 |
| `Pipeline runs:` | no | **Not allowed unless explicitly named** |
| `Release manifest:` | no | Absent means no version change, tag, or publication |

Budgets are ceilings, not targets. On reaching one, enter `STOP_SAFE`: preserve the last verified
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
and independently verifies its result; it never runs the mutation itself. Reviewers assess merit and
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

Before any operation, Vanguard presents a concise proposal in the existing acceptance target and records
the owner's exact confirmation/source in `run.md`. No extra orchestration document is required. Include:

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
- a repair cycle or build-lap ceiling reached;
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
session/ownership boundary or planned pause, wrapup at sign-off. Do not invoke Scribe for every minor
repair, compiler pass, state transition, or green increment. `run.md` provides recovery between those
boundaries. An explicit fresh bounded request may skip resume when no prior state is being carried;
it still ends with a final record and session-boundary handoff.

The handoff states current work, next action, blockers, evidence links, and at most three short recent
entries; it must be usable in under two minutes. Reconcile referenced current work, not every recent
run by default. Enumerate wider history or retention only for requested recovery/cleanup; never delete
automatically. Missing handoff means fresh start; consumed means already resumed, not replay old work.

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

Use [scripts/AgentEvidence.psm1](scripts/AgentEvidence.psm1), tested offline by
[scripts/Test-AgentEvidence.ps1](scripts/Test-AgentEvidence.ps1), or existing tools with equivalent
evidence. Utilities are not authorization, a sandbox, a new agent, or a tool-permission change.

- Generate manifests with SHA-256; **never transcribe hashes**. Record revision, inventory selectors,
   all affected specifications/inputs, including inherited/linked/shared ones. The parent verifies
   selector completeness; hashing a partial inventory does not prove completeness.
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
- Authors validate increments; Vanguard or the invoking owner independently verifies final scope,
   comparisons and focused execution. Read-only reviewers consume those records within their tools.
   Reports link authoritative generated records and summarize results/differences, not copied tables.
   Never claim unperformed independent review, whole-suite certification, or publishing readiness.
