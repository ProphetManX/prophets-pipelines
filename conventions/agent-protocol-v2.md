# Agent Protocol v2 — Shared Delegation Mechanics

**Status:** Parallel pilot. **Created:** 2026-08-29. **Owner:** G. Gordon Nasseri (ProphetManX).
**Applies to:** every agent whose display name ends in the `v2` suffix. It does **not** apply to any v1
customization, which continues to carry its own inline receipt protocol unchanged.

This file exists so that v2 agents can be short. Every mechanic that used to be copied verbatim into
twenty-odd agent files lives here once. A v2 agent carries only its charter, its write boundary, its
approach, and a compact fail-closed fallback — and a line telling it to read this file when it is
reachable.

> **Read order for a v2 agent.** (1) the repository's `AGENTS.md`; (2) this protocol; (3) the
> authoritative artifacts named in its packet. If this file cannot be read, apply the *Fail-Closed
> Fallback* at the end and say in the report that the protocol was unavailable.

Companion documents: [agent-toolbelt-v2.md](agent-toolbelt-v2.md) is the migration blueprint and role
map; [agent-toolbelt.md](agent-toolbelt.md) is the v1 documentation and remains authoritative for v1.

---

## 1. The Task Packet

A parent invoking a v2 leaf sends exactly these fields. A leaf that receives a packet missing a
**required** field returns `Outcome: BLOCKED` / `Reason: PROTOCOL` before reading or editing anything,
and names the missing field.

| Field | Required | Meaning |
| --- | --- | --- |
| `Mode:` | yes | `delegated one-shot run` |
| `Objective:` | yes | One concrete deliverable, one sentence |
| `Repository root:` | yes | Absolute path. Never inferred from a filename |
| `Run directory:` | yes | Absolute path to `<project-parent>/.agent-runs/<run-id>/` — see §2 |
| `Report artifact:` | yes | Absolute path to this invocation's Markdown report inside the run directory |
| `Scope:` | yes | What is included **and** what is excluded |
| `Authoritative inputs:` | yes | `AGENTS.md` plus the exact artifact paths that define the work |
| `Settled owner decisions:` | yes | Quoted. A recommendation restated as a decision is a protocol violation by the parent |
| `Known unresolved inputs:` | yes | Named, not hidden. `none` is a legitimate value |
| `Allowed writes:` | yes | The leaf's charter restated, plus the report artifact |
| `Definition of done:` | yes | The evidence the parent will check |
| `Run envelope:` | only for unattended runs | See §5. Absent means an attended run |
| `Operator mode:` | only when invoking `Repository Operator v2` | Exactly one of `prepare_branch`, `checkpoint_commit`, `publish_branch`, `open_or_update_draft_pr`, `mark_pr_ready`, `release`. Missing, unrecognized, or combined is `BLOCKED` / `PROTOCOL` |
| `Release manifest:` | only to authorize a version change, tag, or publication | See §7 |

**The packet is not approval.** It scopes work; it does not grant permission the owner never gave. A
parent may not write an approval into a packet on the owner's behalf, and may not re-issue a packet
with an approval it manufactured after a leaf declined. An irreversible or unspecified action fails
closed — the leaf stops, reports, and names the exact decision or command a human must supply.

---

## 2. Run Artifacts

**One directory per run, outside every repository.** The run directory is
`<project-parent>/.agent-runs/<run-id>/`, resolved at runtime and never hardcoded into an agent.
`<run-id>` is `<yyyyMMdd>-<HHmm>-<slug>`.

**`<project-parent>` is the common parent of the *repository roots* named in the run** — the envelope's
`Allowed repositories:` on an unattended run, or the `Repository root:` values in play on an attended
one. It is **not** the common parent of the workspace folders. A multi-root workspace routinely carries
customization roots that are not repositories — the VS Code user prompts folder under the user profile
is one — and folding those into the calculation walks the common parent up to a drive root, which is
wrong and may be unwritable.

Exclude every non-repository customization root, then **verify the resolved parent actually contains
every named repository**. If it does not, do not invent one and do not fall back to a drive root: stop
and ask the owner for an explicit run root.

It lives outside the repositories deliberately. A recovery and coordination record is not a project
artifact: repo-local run files mean `.gitignore` churn, accidental commits, and reviewer noise in
every repository for a file whose useful life is one session.

```text
<project-parent>/.agent-runs/<run-id>/
  run.md                                  ← the parent's own state: envelope, state machine, laps
  NN-<agent-slug>.md                      ← one invocation report per leaf invocation, numbered
  evidence/                               ← optional: captured command output the reports cite
```

### One artifact per invocation, two writes

v1 used two separate things — an OS-temp receipt file and an ephemeral chat report — and the chat half
does not survive, because a subagent returns exactly one message to its parent and everything written
before it is discarded. v2 collapses both into **one Markdown file** at the packet's `Report artifact:`
path:

1. **Before substantive work** — before the first edit, or before a long read-only review — the leaf
   writes the file ending `**State:** STARTED`, carrying objective, planned scope, candidate files or
   evidence scope, intended validation, and `Scope decision: PROCEED | SPLIT`.
2. **After validation, before the final chat response** — the leaf overwrites the same file with the
   completion record: the three status fields from §3, changed paths or findings, validation results,
   blockers and deferred work, and the exact handoff.

Update it **once** at the end, not per task. Per-task updates spend the budget the ceiling exists to
protect. A `STARTED` file with no completion record is an incomplete run whose planned scope the parent
reports verbatim; changed files with **no** artifact at all is a named protocol violation.

**Writing this one file is an operational-metadata exception to the leaf's write charter and authorizes
nothing else.** It is not permission to touch a file outside `Allowed writes:`.

Secrets are never written to a run artifact. Record location and kind — "connection string in
`app-variables.yml` line 14" — never the value.

### Operational Markdown

Every artifact in this section — `run.md`, each invocation report, and the active handoff — is Markdown
a human reads under time pressure, so it lints clean or it is not finished:

- **Spaces only. Never a hard tab**, in prose, in a list, or in a continuation line.
- **A blank line above and below every heading**, and above and below every list and every fenced block.
- **Every fenced block carries a standard language** — `text`, `markdown`, `powershell`, `csharp`,
  `yaml`, `json`, `diff`. Never an invented one, and never a bare fence where a language applies.
- **Re-open the finished file and validate it before the final response.** Writing it is not checking
  it. The first v2 leaf to produce operational Markdown emitted hard-tab indentation and headings
  running flush into their lists, and reported success — the content was right and the artifact was
  defective, which is exactly the failure a final read catches and a confident report does not.

This lives here so no agent carries a lint checklist. A v2 charter cites these rules; it does not
restate them.

### The parent's `run.md`

`run.md` is the parent's own artifact and obeys the same two-write discipline as a leaf report, only
with more transitions. **The parent updates it at every state transition** — the state entered, why, and
what the previous one produced — **and finalizes it before its own final response.**

The completion pass carries: the final state; `Outcome` / `Reason` / `Continuation`; every invocation
report written, by path, with the status each returned; envelope budgets consumed against their
ceilings; unresolved and deferred items with the decision each waits on; and the baseline-versus-final
comparison for every repository in play.

**An unfinalized `run.md` is incomplete operational evidence, whatever the leaves did.** A run whose
leaves each closed cleanly but whose parent record carries no final state cannot be read afterwards as
completed, interrupted, or abandoned — and that is the state a later `resume` has to report as unknown.
It is a defect in the run, not a formatting detail.

### Retention

Retain run directories **30 days**. Automatic deletion is permitted **only** for a run that is all of:
completed or reviewed, older than 30 days, and not referenced by the active handoff. **Never delete an
active, unreviewed, failed, or referenced run** — those are the runs whose evidence is worth keeping.
The mechanism is specified here and implemented after the first pilot; until then, deletion is manual.

---

## 3. Outcome, Reason, Continuation

v1 had one status field, and `PARTIAL` was overloaded to mean four unrelated things — a declared scope
split, a missing owner decision, a failing gate, and an exhausted budget all returned the same word,
so the parent could not route on it. v2 requires **three** fields in every report, always all three:

```text
Outcome: COMPLETE | PARTIAL | BLOCKED | NO_CHANGE | FAILED
Reason: NONE | SCOPE_SPLIT | OWNER_DECISION | VALIDATION | REVIEW | ENVIRONMENT | PROTOCOL | BUDGET
Continuation: CONTINUE | SWITCH_WORKSTREAM | STOP_RUN
```

| `Outcome` | Meaning |
| --- | --- |
| `COMPLETE` | The packet's scope and its validation both finished |
| `PARTIAL` | Every unblocked part finished; every omission named |
| `BLOCKED` | No sound artifact could be produced |
| `NO_CHANGE` | The existing artifact already satisfies the request, after re-verification |
| `FAILED` | A tool or environment failure prevented completion |

| `Reason` | Use when |
| --- | --- |
| `NONE` | Only with `COMPLETE` or `NO_CHANGE` |
| `SCOPE_SPLIT` | The leaf chose a coherent subset under its scope ceiling |
| `OWNER_DECISION` | A decision the leaf may not invent is missing |
| `VALIDATION` | A build, test, or check failed |
| `REVIEW` | A reviewer finding blocks completion |
| `ENVIRONMENT` | A tool, path, credential, or service was unavailable |
| `PROTOCOL` | A required packet field or artifact path was missing or malformed |
| `BUDGET` | Context, output, or envelope budget was reached |

| `Continuation` | The parent's next move |
| --- | --- |
| `CONTINUE` | This workstream can proceed |
| `SWITCH_WORKSTREAM` | This stream is blocked; independent work remains elsewhere |
| `STOP_RUN` | Nothing independent remains, or a mandatory stop applies |

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

**`docs/open-questions.md` has exactly one writer: `Product Discovery v2`.** No other leaf appends to
it, whatever its own charter says about filing questions. A non-owner leaf that discovers an open
question writes, in its invocation report, the **exact proposed question text** and the **stream it
blocks**; the parent then delegates `Product Discovery v2` to deduplicate that proposal against the
existing register and append it. Any agent may **cite** an existing question by its ID; **none but
`Product Discovery v2` may add, reword, or renumber one.** The human owner supplies the decisions;
`Product Discovery v2` owns the file.

**Stop the whole run only when one of these holds:**

1. No independent work remains.
2. The uncertainty affects a **public API surface**, **security**, **data ownership or privacy**,
   **money or financial semantics**, **architecture**, or a **release commitment**.
3. A mandatory stop in §6 applies.

Categories in (2) are never invented — not defaulted, not "reasonably assumed", not inferred from a
sibling repository. They are elicited during discovery or deferred as a stream.

---

## 5. The Autonomous Run Envelope

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

Budgets are ceilings, not targets. On reaching one, the run enters `STOP_SAFE`: finish or revert to the
last validated boundary, write the handoff, and stop. Reaching a ceiling is a normal outcome
(`PARTIAL` / `BUDGET`), not a failure.

**Always reserve time for final validation and handoff.** A run that spends its whole envelope on
building and leaves no account of what it did has produced nothing a human can use.

---

## 6. Guardrails

### Git

| Allowed | Forbidden |
| --- | --- |
| Require a **clean baseline** before starting | Starting on an unexplained dirty tree — stop and report |
| Create and work on a dedicated `agent/<date>-<slug>` branch | Committing to `main` or any shared branch |
| Atomic commits, **only after scoped validation and review** | Committing unrelated baseline changes |
| Push that branch | Force-push, history rewrite, branch or tag deletion |
| Open or update a **draft** PR | Marking ready before every gate below passes |
| Mark a PR ready when **all** of: every named gate and CI check passes, the diff stays in scope, the handoff is complete, and no unresolved High or Critical finding exists | **Merging, unattended — never** |

An unexplained dirty baseline is a mandatory stop. It is indistinguishable from a human's in-progress
work, and discarding it is unrecoverable.

#### One executor

**`Repository Operator v2` is the only v2 agent that may execute any of the allowed actions above.** No
other leaf and no orchestrator stages, commits, pushes, tags, publishes, or changes pull-request state —
they read git, and they say what should happen. `Vanguard v2` reaches these actions only by delegating a
packet to the operator; it never runs the command itself.

**One operation per invocation.** Every operator packet carries exactly one `Operator mode:`, and a
packet with none, an unrecognized one, or more than one returns `BLOCKED` / `PROTOCOL` before any read or
command. Two operations are two packets with two report artifacts.

**Every mutating mode carries an expected HEAD and verifies it immediately before mutating.** If HEAD has
moved, the operator stops and reports both SHAs rather than acting on state that has changed underneath
it. Staging is by an **exact enumerated path list** — never a folder, a glob, or "the rest of the
change" — and an unenumerated changed path stops the run.

**Writing prose is never authorization to execute it.** `Commit Author v2` produces the message and the
PR body and runs no mutating command; `Changelog Author v2` records a version implication and changes no
version. The operator alone acts, and only on what a packet or manifest names.

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

- an unexplained dirty baseline, or a diff drifting outside `Allowed paths:`;
- an unresolved High or Critical review or security finding;
- a repair cycle or build-lap ceiling reached;
- a required check that cannot run at all, as distinct from one that ran and failed;
- an action that would be irreversible and is not named in the envelope or a release manifest;
- an owner decision required in one of the never-invent categories in §4, with no independent work
  left.

---

## 7. Morning Handoff

Every run ends by writing the handoff, whatever its outcome. The v2 handoff is
`<project-parent>/.agent-runs/session-handoff-v2.md`, owned by `Session Scribe v2`. The v1 handoff at
`prophets-pipelines/docs/session-handoff.md` is untouched by v2 during the pilot.

**It is operational, not a product artifact**, and it is deliberately *not* in a repository. It sits
beside the per-run directories, off the same `<project-parent>` resolved in §2, so it outlives them
without being one: **the 30-day run-directory retention does not apply to it**, and it is superseded in
place rather than aged out. Per-run retention is unchanged. `Vanguard v2` resolves the absolute path at
`BOOTSTRAP` and passes it verbatim in every `Session Scribe v2` packet; neither agent hardcodes a machine
path, and **there is no repo-local `docs/session-handoff-v2.md` in any repository**.

The consequence worth stating plainly: because the handoff is external, writing it **dirties no working
tree**. `resume`, `checkpoint`, and `wrapup` are therefore available even when repository preflight has
stopped the run — a run that may change nothing can still record what it found. That is not a loosening
of the Git guardrails. Without an authorized non-default agent branch, no repository artifact may be
edited, **documentation included**, and an envelope whose intended work requires a repository write has
no read-only remainder: it enters `STOP_SAFE` with the branch command named for a human.

It is **concise by contract**: current state, what to do next, and **at most three** short recent-session
entries. It **links** run reports rather than embedding them — the run directory holds the detail, and
the handoff is the index.

Its acceptance test: *could someone with no memory of the session read this and be productive in under
two minutes?* If reading it takes longer than that, it is too long, and the fix is to move detail into a
run report or its permanent home.

Durable content is pushed to its permanent home rather than left in the handoff — decisions to
`docs/decision-log.md`, product intent to `docs/product-brief.md`, requirements and architecture to
their documents, open questions to `docs/open-questions.md`. Anything left only in the handoff dies the
next time it is rewritten.

**Each of those files is promoted by its own owning agent, never by the Scribe.** `Session Scribe v2`
*verifies* that the promotion happened and lists whatever has not been promoted, naming the exact owner
and target for each item, as handoff work for the parent to route. A handoff may be stamped `fresh`
only when every required promotion is already complete.

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
