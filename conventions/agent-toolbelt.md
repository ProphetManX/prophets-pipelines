# Agent Toolbelt — Session Handoff

> **This file is not auto-loaded.** Attach it with `#file` when starting a session about
> building, changing, or debugging agent customizations. Do not add it to `AGENTS.md` — it
> is administrative context, irrelevant to day-to-day coding sessions.

**Built:** 2026-08-08 · **Revised:** 2026-08-22 · **Owner:** G. Gordon Nasseri (ProphetManX)
**Covers:** 26 custom agents, 2 prompts, and the `AGENTS.md` conventions system across 8 repos.

> **2026-08-12 — `Vanguard` is now the single front door.** One lead covers all project work, from
> resuming yesterday's session to shipping. `Start Here` and `Repo Docs Lead` were retired into it;
> `Session Wrap-Up` became `Session Scribe`; `Commit Author` was added. `TDD Lead` is retained
> temporarily as a fallback — see Open Items.

---

## 1. What Exists

### Three Locations, One Truth

| # | Path | Role |
|---|---|---|
| 1 | `%APPDATA%\Code\User\prompts\` | **Live.** What VS Code loads. Flat, no subfolders. Not version controlled. |
| 2 | `prophets-pipelines\conventions\toolbelt\` | **Mirror.** Version history and disaster recovery. |
| 3 | `prophets-pipelines\conventions\agent-toolbelt.md` | **Documentation.** This file. |

Direction of truth is **#1 → #2**. Edit live, then mirror. The flow reverses only when restoring
onto a new machine.

The mirror exists because Settings Sync is a convenience, not a backup — it has no history, and a
fresh sign-in or a sync conflict can lose the whole toolbelt silently.

**The `Toolbelt Keeper` agent owns keeping all three in agreement.** Use it rather than editing
agent files by hand.

Filenames use `<domain>-<type>-<name>` so they alpha-sort into workflow groups. The filename is
cosmetic — the `name:` frontmatter field controls what appears in the UI.

### The Front Door

| File | Agent | Tools | Model |
|---|---|---|---|
| `proj-a-vanguard.agent.md` | **Vanguard** | read, search, edit (feature-request append only), **execute (read-only inspection by charter)**, agent, todo, runTask/runTests/testFailure, GitHub PR tools | Opus 5 |
| `proj-a-session-scribe.agent.md` | Session Scribe | read, search, edit, execute | Sonnet 4.5 |
| `proj-a-solution-architect.agent.md` | Solution Architect | read, search, edit | Opus 5 |

`Vanguard` is the only agent the owner needs to start a session with. It orients, proposes a route,
delegates every phase, and synthesizes a **Direction Check** at each gate. It holds 23 subagents and
deliberately excludes `TDD Lead` and `Toolbelt Keeper` — orchestrators do not call orchestrators.

### The Stage Model

| Stage | Phases | Runs when |
|---|---|---|
| **0 · Orient** | Session Scribe (resume) | **every session, unprompted** |
| **1 · Ground** | Repo Analyst, Purpose Refiner, Modernizer (recon) | first visit to a repo, or a new major effort |
| **2 · Shape** | Solution Architect, Project Scaffolder, Interface Architect, API Designer, Contract Reviewer, Threat Modeler | new feature or project |
| **3 · Build** | 🔴 Test Designer → Test Auditor → 🟢 Implementer → Code Reviewer → 🔵 Refactorer | always; the only looping stage |
| **4 · Land** | Security Reviewer, Commit Author, PR triage, Changelog Author, README Author, Pipeline Engineer/Auditor, Azure agents | before shipping |

Stages 1, 2, and 4 are single-pass and individually skippable. Stage 3 is the only loop, and it runs
uninterrupted between checkpoints. Checkpoints land at **stage gates and each green Stage 3 lap** —
not at every phase.

### The Artifact Ledger

Every agent has one declared output. `Session Scribe` reports the state of each at Stage 0, and the
state dictates the route with no questions asked:

| State | Consequence |
|---|---|
| **missing** | that agent RUNs |
| **stale** — artifact's last commit predates the last commit touching source | FLAG, owner decides |
| **current** | SKIP, one line in an all-clear block |
| **n/a** | does not apply to this repo |

This is what replaced fourteen phase-by-phase permission prompts with a single route approval.

### Phase Reference — also the legacy `TDD Lead` roster

| File | Agent | Phase | Tools | Model |
|---|---|---|---|---|
| `docs-a-repo-analyst.agent.md` | Repo Analyst | -3 · Orient (rare) | read, search, edit | Sonnet 4.5 |
| `ops-a-modernizer.agent.md` | Modernizer | -2 · Modernize (conditional) | read, search, edit, execute | Opus 5 |
| `ops-a-scaffolder.agent.md` | Project Scaffolder | -1 · Scaffold (conditional) | read, search, edit, execute | Opus 5 |
| `tdd-a-interface-architect.agent.md` | Interface Architect | 0 · Design | read, search, edit | Opus 5 |
| `tdd-a-api-designer.agent.md` | API Designer | 0 · Design (HTTP) | read, search, edit | Opus 5 |
| `tdd-a-contract-reviewer.agent.md` | Contract Reviewer | 1 · Critique | read, search, edit (feature-request append only) | Opus 5 |
| `sec-a-threat-modeler.agent.md` | Threat Modeler | 1b · Threat model | read, search, edit | Opus 5 |
| `tdd-a-test-designer.agent.md` | Test Designer | 🔴 2 · Red | read, search, edit, execute | Opus 5 |
| `tdd-a-test-auditor.agent.md` | Test Auditor | 3 · Audit | read, search, edit (feature-request append only) | Opus 5 |
| `tdd-a-implementer.agent.md` | Implementer | 🟢 4 · Green | read, search, edit, execute | Sonnet 4.5 |
| `tdd-a-code-reviewer.agent.md` | Code Reviewer | 4b · Review | read, search, edit (feature-request append only), execute | Opus 5 |
| `tdd-a-refactorer.agent.md` | Refactorer | 🔵 5 · Blue | read, search, edit, execute | Sonnet 4.5 |
| `sec-a-security-reviewer.agent.md` | Security Reviewer | 🔒 6 · Security | read, search, edit, execute | Opus 5 |
| `docs-a-changelog-author.agent.md` | Changelog Author | 7 · Changelog (conditional) | read, search, edit, execute | Sonnet 4.5 |
| `docs-a-readme-author.agent.md` | README Author | 8 · Docs (conditional) | read, search, edit | Sonnet 4.5 |
| `tdd-a-lead.agent.md` | TDD Lead | orchestrator | execute/runTask, execute/runTests, execute/testFailure, read, edit (feature-request append only), search, agent, todo (+ `vscodeTasks`/`vscodeGeneral` duplicates, + GitHub PR tools) | Sonnet 4.5 |

The phase numbering above is `TDD Lead`'s. Under `Vanguard` these map to stages: -3/-2/-1 → Stage 1,
0/1/1b → Stage 2, 2–5 → Stage 3, 6/7/8 → Stage 4. `Modernizer` and `Project Scaffolder` are `ops`
agents shared with standalone use. Leaf agents may have more than one parent.

Use `API Designer` at phase 0 instead of — or alongside — `Interface Architect` when the surface is HTTP.
Phase 1b is conditional — run it when the work touches personal data, auth, payments, file handling,
or anything internet-reachable. Phase 6 is a **release gate**, not a formality.

### Build & Release Maintenance (`ops`)

| File | Agent | Tools | Model | Writes |
|---|---|---|---|---|
| `ops-a-modernizer.agent.md` | Modernizer | read, search, edit, execute | Opus 5 | `.csproj` / `.sqlproj` |
| `ops-a-scaffolder.agent.md` | Project Scaffolder | read, search, edit, execute | Opus 5 | **New** projects and `.sln` entries |
| `ops-a-pipeline-engineer.agent.md` | Pipeline Engineer | read, search, edit, execute, agent | Opus 5 | `.yml` / `.yaml` only |
| `ops-a-pipeline-auditor.agent.md` | Pipeline Auditor | read, search, edit | Opus 5 | `docs/feature-requests.md` append only; never YAML |

**Modernizer** has **two modes**. `recon` is read-only — EOL TFMs, outdated and deprecated packages,
stale project references, empty packaging metadata — and needs no approval, which is what lets
`Vanguard` call it automatically at Stage 1. `modernize` edits under plan-approve-verify discipline:
one repo at a time, build + test after every single change. Never bumps versions, never changes
namespaces. **Territory split:** Modernizer owns `--outdated` and `--deprecated`; `Security Reviewer`
owns `--vulnerable`.

**Project Scaffolder** creates new projects — correct TFMs, packaging metadata, naming, namespace,
and reference graph from the first commit — **and creates the `.sln` itself when a repository has
none**. **Structure, not behavior:** no interfaces, no tests, no implementations, at most an empty
namespace stub. It never touches an existing project's build configuration; that is `Modernizer`'s
job and the split is deliberate — see below.

**Pipeline Engineer** owns coherent cross-repo Azure DevOps YAML changes. It reads the whole template
chain and every consumer before editing, never changes version variables, states blast radius, and
stops for `Modernizer` when project files must change. **Pipeline Auditor** remains the independent,
read-only gate: Auditor diagnoses and proposes; Engineer applies; Auditor reviews the result.

### Cloud Infrastructure (`infra`)

| File | Agent | Tools | Model | Writes / mutates |
|---|---|---|---|---|
| `infra-a-engineer.agent.md` | Azure Infrastructure Engineer | read, search, edit, execute | Opus 5 | Bicep, parameters, repo-local deployment YAML, infrastructure docs; Azure only after approval |
| `infra-a-deployment-reviewer.agent.md` | Azure Deployment Reviewer | read, search, edit, execute | Opus 5 | `docs/feature-requests.md` append only; never deploys |

**Azure Infrastructure Engineer** designs cost-conscious, repeatable Azure deployments using pinned
Azure Verified Modules and a resource-group-scoped `solution.bicep` by default. It supports both
manual Azure CLI deployments and Azure DevOps automation from the same artifact and parameters.

**Azure Deployment Reviewer** independently checks Bicep resolution, `what-if`, cost, least privilege,
customer isolation, recovery, and pipeline safety. It can execute non-mutating checks but cannot edit
files or deploy resources.

### Security

| File | Agent | Scope | Writes |
|---|---|---|---|
| `sec-a-threat-modeler.agent.md` | Threat Modeler | **Design-time.** Data classification, encryption decisions, trust boundaries, exposure surface, authorization rules, STRIDE | `docs/security/threat-model.md`, `docs/security/data-classification.md` |
| `sec-a-security-reviewer.agent.md` | Security Reviewer | **Code-time.** OWASP Top 10, IDOR, injection, secrets, crypto misuse, log leakage, deserialization, dependency CVEs | `docs/security/security-review.md` |

Both are read-only on source and write only under `docs/security/`. Neither applies fixes — findings
route back through `Implementer`.

### Documentation Workflow

| File | Agent/Prompt | Tools | Model |
|---|---|---|---|
| `docs-a-repo-analyst.agent.md` | Repo Analyst | read, search, edit | Sonnet 4.5 |
| `docs-a-purpose-refiner.agent.md` | Purpose Refiner | read, search, edit | Opus 5 |
| `docs-a-readme-author.agent.md` | README Author | read, search, edit | Sonnet 4.5 |
| `docs-a-changelog-author.agent.md` | Changelog Author | read, search, edit, execute | Sonnet 4.5 |
| `docs-a-commit-author.agent.md` | Commit Author | read, search, edit (feature-request append only), execute | Sonnet 4.5 |
| `docs-p-sweep-workspace.prompt.md` | `/sweep-workspace` — runs as `Vanguard` | inherits | — |
| `docs-p-sync-agents-md.prompt.md` | `/sync-agents-md` | read, search, edit | Sonnet 4.5 |

**Repo Analyst** additionally owns the **per-repo section of `AGENTS.md`** — everything below the
generated shared block. It must never hand-edit the block itself. Every other agent reads that file
at step 0, so a repo without one leaves the whole roster blind.

**Commit Author** writes commit messages and PR bodies from the diff. Its prose output is text to
paste, it never runs a mutating git command, and its only file-write exception is appending a
deduplicated `Proposed` entry to `docs/feature-requests.md`.

### Meta

| File | Agent | Tools | Model |
|---|---|---|---|
| `meta-a-toolbelt-keeper.agent.md` | Toolbelt Keeper | read, search, edit, execute | Opus 5 |

**Toolbelt Keeper** creates, changes, and deletes agents and prompts. Performs the full three-step
update — live file, mirror, docs — and audits for drift. Also holds the restore procedure. It is the
only agent `Vanguard` does not cover, and that is on purpose: changing the toolbelt is a separate
session from using it.

### Conventions System

| File | Role |
|---|---|
| `prophets-pipelines/conventions/AGENTS.shared.md` | **Master copy** of the shared conventions block |
| `<repo>/AGENTS.md` × 6 | Generated shared block + per-repo section |
| `prophets-pipelines/AGENTS.md` | Links to the master instead of inlining it |
| `conventions/toolbelt/` | Mirrored copies of all 28 customization files |

---

## 2. Load-Bearing Design Principles

These are the ideas the whole toolbelt rests on. Changing one changes everything downstream.

### Separation of authorship from verification

The agent that *creates* something never *validates* it, and vice versa. Applied four times:

| Creator | Validator | Why |
|---|---|---|
| Interface Architect | Contract Reviewer | An agent that designed an API is a weak critic of it |
| Test Designer | Test Auditor | Same reasoning, one level down |
| Test Designer | Implementer | **The critical one** — see below |
| Azure Infrastructure Engineer | Azure Deployment Reviewer | Infrastructure mistakes spend money or alter live resources; the author cannot approve its own preview |

### The Implementer must not be able to edit tests

This is the single most important constraint in the TDD roster. If one agent writes both tests and
implementation, it doesn't do TDD — it writes an implementation, then writes tests describing
whatever it happened to produce. Even split across two agents, an implementer with write access to
`*Tests.cs` will "fix" a failing test rather than the code, because that's the shortest path to green.

**Enforcement is by tool restriction and explicit prohibition, not by polite instruction.** When
the Implementer believes a test is wrong in a **direct** run it must stop and escalate to the human
with: which test, what it asserts, what it believes is correct. In a **delegated** run there is no
turn to wait for, so it stops at the last green boundary and returns `BLOCKED` or `PARTIAL` carrying
the same three facts. Either way the lead routes a correction back through the Test Designer, and the
Implementer never fixes a test itself.

*If an agent ever edits a test to make it pass, the workflow has failed — report it rather than
accepting the green build.*

### Test Designer runs the red phase without negotiating with the result

`Test Designer` has terminal access so red is observed rather than predicted. It runs the narrowest
test command after writing tests and reports the command, exit code, counts, and exact failure. Because
it owns test files, its guard is explicit: it never weakens, loosens, or deletes an assertion to match
observed behavior. Unexpected red or green is the finding; it reports and stops. `Test Auditor` remains
the independent validator of whether those tests meaningfully constrain the implementation.

### Read-only by default

Every agent's tool list is the minimum for its job. Orchestrators (`Vanguard`, `TDD Lead`) may edit
only to append a deduplicated `Proposed` entry to `docs/feature-requests.md`; every authored project
artifact remains delegated. This narrow exception implements shared capture without making leads builders.
`Vanguard` now also holds `execute`, restricted by its charter to read-only orchestration evidence:
`git status` / `diff` / `log` / `show`, branch and revision inspection, directory listings, and file
hashes. It may not write through the shell, mutate git, install packages, run generators, manage
services, or touch cloud resources. Builds and tests remain on the dedicated task/test tools.

This restriction is instruction-enforced: VS Code exposes `execute` as one alias, not a read-only
subset. That broader technical capability is an accepted tradeoff and a reason to keep the allowed
command classes explicit in the agent itself.

### Subagents start with empty context

A subagent cannot see the parent conversation. Every agent's Approach section therefore begins with
"read the repo's `AGENTS.md` first," and orchestrators are instructed to pass forward everything a
subagent needs. This is why the conventions had to live in files rather than in an agent's head.

`Vanguard` passes a bounded one-shot task packet: objective, absolute repo root, included and excluded
scope, authoritative paths, quoted owner decisions, unresolved inputs, allowed writes, definition of
done, a **`Receipt artifact:` path plus the required receipt and receipt-update instructions**, and the
required final report. A question, progress update, or receipt is not completion. One report-only
recovery invocation is allowed; a second malformed return becomes `FAILED` rather than an infinite loop.
`TDD Lead` now passes the same packet fields.

### A long run can outlive its own report

The final report is the only thing a parent sees, and it is written **last** — after every edit, build,
and test the run performed. That ordering is the flaw: on a heavy multi-file run the report is the
first casualty of an exhausted output or context budget, and the parent then cannot distinguish a
finished run from an abandoned one.

Every delegated agent therefore writes a **receipt** before its first edit — or, for a read-only
reviewer, before its long read sequence — carrying the objective, task count, candidate files, intended
validation, rationale, and `Scope decision: PROCEED | SPLIT`. The receipt is a survivable account of
*intent*, never of completion, and `Vanguard` is instructed never to accept one as a final report.

**The receipt is a file, not a chat message — corrected 2026-08-22.** The original design had the leaf
*emit* the receipt into chat before working. That does not work, and the correction is the whole reason
this section changed:

> **`runSubagent` returns exactly one final message.** Anything a leaf writes into chat before that
> message is discarded. Measured on 2026-08-22: both `Interface Architect` and `Contract Reviewer`
> reported their receipt as "issued above", and the parent received no separate receipt at all.

An early chat message therefore cannot survive a missing final report — which was the single thing the
receipt existed to do. The mechanism was prose describing a channel that does not exist.

The replacement is a **durable receipt artifact**. `Vanguard` (and `TDD Lead`) composes one unused
absolute path per invocation under the OS temporary directory and passes it in the packet as
`Receipt artifact:`. The leaf writes that file with its own edit tool before its first production edit
or long read, ending it `State: STARTED`; after validation and before its final chat response it
overwrites the same file with a compact completion record — final status, changed paths or findings,
validation result, blockers and deferred tasks, and the exact handoff. The parent then **opens the file**
after every invocation and compares it with the response. A `STARTED` artifact is an incomplete run
whose planned scope is reported verbatim; a final state with no chat response is recovery input for the
existing single recovery invocation; changed files with no artifact at all is a named protocol violation.

Four sub-decisions are worth recording because each had a plausible alternative:

| Decision | Rejected alternative | Why |
|---|---|---|
| **OS temp directory** | A repo-local `.receipts/` folder | A recovery mechanism is not a project artifact. Repo-local files mean `.gitignore` churn, accidental commits, and reviewer noise in every repo, for a file whose entire useful life is one session. The tradeoff taken knowingly: temp files are **not** version-controlled and are left for normal OS cleanup, so there is no history — once the directory is cleaned the record is gone. Anything worth keeping goes to the handoff or a repo document by the normal route. |
| **One file per invocation, unique name** | One rolling file per agent | Two invocations of the same leaf in one session would overwrite each other's evidence, which is exactly the case where recovery matters most. |
| **Two writes — `STARTED`, then the completion record** | Update after every task | Per-task updates spend the very budget the ceiling exists to protect. Two writes bracket the run; more than that reintroduces the problem. |
| **Parent composes the path, leaf creates the file** | Leaf invents its own path | The parent must know where to look. Composing a path is non-mutating, so it stays inside `Vanguard`'s read-only terminal boundary; creating the file is the leaf's one write. Neither parent hardcodes a user profile path — the temp directory is resolved at runtime. |

Writing that one temp file is an **explicit operational-metadata exception** to each leaf's write
charter, stated as such in all 23, and it authorizes nothing else: `Implementer` and `Refactorer`
still cannot touch a test, the reviewers are still read-only apart from feature-request capture,
`README Author` still cannot touch a `.cs` file, `Pipeline Engineer` still writes no Markdown,
`Pipeline Auditor` still edits no YAML, and `Azure Infrastructure Engineer` still cannot run a mutating
Azure command.

Paired with it is a **scope ceiling**, deliberately judgment-based rather than a task count. Before
editing, a leaf enumerates its independently verifiable tasks and reserves capacity for validation and
the report — those come out of the same budget as the edits. If it cannot confidently finish, validate,
and report the whole packet, it picks a coherent subset first, declares `SPLIT`, completes that subset,
and returns `PARTIAL`. If scope grows materially mid-run it stops at the next validated boundary and
writes `PARTIAL` to the artifact *before* the chat report. A smaller verified result beats a larger
unverified one, and `Vanguard` accepts a declared `SPLIT` and routes the remainder — as a fresh packet
with a **new** receipt path — rather than pushing the leaf through its own ceiling.

`TDD Lead` carries the same packet fields and the same post-run artifact read. It had no delegation
contract section at all before this; without one the fallback orchestrator would have invoked leaves
that now demand a `Receipt artifact:` path and got an immediate `BLOCKED` from every one of them. Its
allowlist is 16 of `Vanguard`'s 23, so both parents now name their own count explicitly rather than
gesturing at "every leaf" — a count in the parent is checkable against the allowlist in its frontmatter,
and that check is what caught the eight-agent gap described next.

### Delegation is not approval — four leaves hold gates a parent cannot satisfy

**Added 2026-08-22 with the eight-agent extension.** `Modernizer` in `modernize` mode,
`Project Scaffolder`, `Pipeline Engineer` on a variable-contract change, and
`Azure Infrastructure Engineer` all require human approval before acting. Delegation removes the turn in
which that approval could be given, and the tempting reading — that a task packet *is* the approval —
would have quietly deleted four safety gates in the name of one-shot readiness.

The resolution is that delegation **narrows** what these agents may do rather than unlocking it. Each
applies only what the packet **quotes as a settled owner decision**, withholds everything else by name,
and returns `PARTIAL` with the decision required. Both parents are told never to write an approval into
a packet the owner did not give them, and never to re-invoke a leaf with the approval supplied by the
parent — the same rule that already governs a declared `SPLIT`.

`Azure Infrastructure Engineer` takes the strongest form: its charter says "explicit approval **in the
current conversation**", and a delegated run has no such conversation, so **no mutating Azure command
runs in a delegated run at all**. It authors, builds, lints, previews with `what-if`, and returns
`PARTIAL` naming the exact command the human must run. Three statements are now explicit in that agent
because each is a plausible misreading: a packet is not approval, a receipt path is not approval, and
writing the receipt is not approval. `Azure Deployment Reviewer` keeps the matching rule it already had
— a `Ready` verdict is not deployment permission.

### Toolbelt Keeper reproduced the silent run — and had no receipt to recover from

**Measured 2026-08-22, and the most direct evidence in this document.** The `Toolbelt Keeper` run that
added the durable receipt protocol to eighteen files **returned no final chat output at all**. One
report-only recovery invocation — the single retry the protocol allows — returned `COMPLETE`, and that
recovery is what discovered that **eight `Vanguard`-allowlisted leaves had been missed** by the update:
`Modernizer`, `Project Scaffolder`, `Threat Modeler`, `Security Reviewer`, `Pipeline Engineer`,
`Pipeline Auditor`, `Azure Infrastructure Engineer`, and `Azure Deployment Reviewer`.

Three things follow, and they should be read separately:

- **The failure mode is not confined to project leaves.** A toolbelt update is the same profile the
  receipt was designed for — many files, three locations, a hashing sweep, and one large report written
  last. The agent that maintains the mechanism was subject to it.
- **Report recovery works.** The one-recovery rule was exercised for real rather than in a fixture, and
  it returned a usable final status. That is a second, independent datapoint for the recovery path.
- **Durable-receipt recovery was *not* exercised, and must not be claimed.** That run had **no artifact
  at all**, because `Toolbelt Keeper` did not yet implement one — the recovery worked from the live
  files alone. These are two different mechanisms: recovering a **missing chat report** is proven twice
  over; recovering **from the durable artifact** is still unproven, because no failed run has yet left
  one behind. Do not let the first stand in for the second.

`Toolbelt Keeper` now carries the protocol itself. Its **direct and manual behavior is unchanged** — the
owner's normal session is untouched. Delegated, it requires a parent-supplied absolute OS-temp path,
writes `STARTED` before its first edit or a broad read of the prompts folder, finalizes the artifact only
after the full live/mirror/docs validation, and returns one normalized status. Two details are specific
to it: its completion record carries **hash counts** — files compared, matching, differing, present in
only one location — because a mirror asserted to be in sync without a hash sweep is exactly the drift it
exists to catch; and its `SPLIT` boundary is a **fully-synced agent, never a file**, because its first
constraint forbids finishing with only some of the three locations updated. A scope ceiling may not
soften that constraint, so the two are reconciled by choosing where the split may fall.

`Vanguard` is forbidden from invoking `Toolbelt Keeper`, so this is the one receipt-carrying agent
reached from outside the project workflow — by the owner, or by a parent outside it.

### What the heavy stress tests actually measured

**2026-08-22.** Three heavy replays in an isolated `ProphetsWay.EFTools` clone. Read these as three
separate properties, because they did not all pass:

| Run | Load | Result |
|---|---|---|
| `Implementer` | Four tasks, six production files, a 5,575-line spec, two tests over 1,000 lines | Returned `COMPLETE`. Independent checks: build 0 warnings / 0 errors, lap gate 68/68, full suite 270 / 259 / 11, and the preloaded test hash unchanged — it did not edit a test |
| `Interface Architect` | Four tasks, seven files, the same 5,575-line spec | Returned `COMPLETE`. Both `netstandard2.0` and `net10.0` built; every file diagnostic-clean |
| `Contract Reviewer` | Seven-file review of that output | Completed the long read and returned a full evidence report |

**What passed:** final reporting survived one realistic heavy run in all three agents, and
`Implementer`'s charter held under load. That is the first evidence that the report is not automatically
the first casualty on a heavy run.

**What did not:** `Contract Reviewer` found multiple untraced inventions in the `Interface Architect`
output — `HasMore == false` for a take of zero, a batch-relative `RowIndex`, a constructor validation
precedence, and a coupling between session state and writes. None were stated by the supplied contract.
So `COMPLETE` overstated contract fidelity: the *reporting* was sound and the *content* was not. That is
a different failure from the silent run, and it is why Objective B exists rather than being folded into
the receipt work.

**What was not measured at all:** the receipt. In all three runs the receipt existed only in chat and
the parent never saw it, so none of these runs verifies receipt creation, ordering, or content. The
separation matters — "the report survived" is not "the protocol worked."

The `Interface Architect` fixture was a **disposable stress fixture in a throwaway clone**, not product
work. Nothing from it is a proposal for any repository.

### Interface Architect must trace what it wrote before claiming COMPLETE

**Added 2026-08-22**, in response to the fidelity failure above.

Before returning `COMPLETE` in a delegated run, `Interface Architect` runs a **Requirement Trace Audit**
over every public behavior it wrote. Each behavioral statement in every `<summary>`, `<param>`,
`<returns>`, `<exception>` and `<remarks>` must land in exactly one of four buckets: a directly stated
requirement, a quoted owner decision, an inherited contract it names and cites, or an explicitly
non-binding open question.

**Silence is not a source.** It may not convert an absence into a default value, a boundary result at
zero/empty/null, a validation precedence, a semantic frame of reference — what an index or offset is
measured *relative to* — a coupling between members, or a claimed deliberate omission, which asserts an
intent the contract never expressed. `Unspecified by the supplied contract` is a legitimate thing to
write; an invented default stated as settled is not, because `Test Designer` reads those docs as the
specification with no other context and `Implementer` is then forced to satisfy the invention.

A consequential behavior that cannot be traced is omitted and raised as an Open Question. If omission
leaves the member untestable or the contract internally contradictory, the status is `PARTIAL` or
`BLOCKED` — never `COMPLETE`. The trace result appears in both the durable receipt's completion record
and the final report, as a table plus totals: behaviors written, traced, and omitted as untraceable.

**`Contract Reviewer` is preserved as the independent validator** and none of its charter changed. The
audit is the author's own honesty gate, not a substitute for review — separation of authorship from
verification still holds, and passing the audit is never a reason to skip stage 2e. It is worth being
plain about what the gate is: an instruction to the author to check its own work, caught the first time
only because an independent reviewer looked. It narrows the failure; it does not eliminate it.

### Descriptions are the discovery surface

The `description:` field is how the default agent decides whether to delegate. Trigger phrases are
deliberately keyword-stuffed. A vague description means the agent never gets picked automatically.

---

## 3. Decisions and Why

### Requirements are written for agents, not only humans

`Solution Architect` runs a **Downstream Readiness Check** before finishing: does the requirements
document actually contain what `Interface Architect`, `Test Designer`, `Threat Modeler`, and
`API Designer` each need? Any gap becomes an explicit Open Question rather than a silence.

This exists because subagents start with empty context. A vague requirement does not produce a
question downstream — it produces a **guess**, and the guess becomes a false requirement that nobody
notices until it ships. Acceptance criteria must be testable as written: "loads in under two seconds
with 500 students," never "fast."

Layers are scoped top-down — Core, then DataAccess, then Api/Web/Win. When a lower layer contradicts
the one above, the agent stops and fixes the higher layer first rather than working around it.

In a delegated run it does not wait for a conversation turn that cannot arrive. It completes every
supported requirement, records unknowns as Open Questions, and returns `PARTIAL` or `BLOCKED` with
the downstream agent each decision prevents.

### Conversational specialists also finish as one-shot subagents

**Chosen:** dual invocation modes for `Interface Architect`, `Repo Analyst`, `Solution Architect`,
`API Designer`, and `Purpose Refiner`.
**Rejected:** separate conversational and subagent copies of each role, and forcing direct owner
sessions into one-shot behavior.

Direct invocation remains conversational. Delegated invocation treats Vanguard's task packet and the
named repository artifacts as the complete available context: no questions, no confirmation pause,
all unblocked work completed now, and a mandatory final status:

| Status | Meaning |
| --- | --- |
| `COMPLETE` | Requested artifact and validation finished |
| `PARTIAL` | Every unblocked part finished; every omission named |
| `BLOCKED` | No sound artifact can be written without an owner decision |
| `NO CHANGE` | Existing artifact satisfies the request after re-verification |
| `FAILED` | A tool or environment failure prevented completion |

The domain-specific fail-closed behavior matters. `Interface Architect` omits unspecified members;
`Solution Architect` leaves unknowns as Open Questions; `API Designer` never invents authorization;
`Repo Analyst` reports exactly which evidence classes it did not inspect; and `Purpose Refiner`
treats `Cannot tell` as a completed verdict while requiring a quoted owner decision for any request
status transition.

The existing independent checks remain: `Contract Reviewer` validates Interface Architect and API
Designer output. No new validator was added for repository profiles, requirements documents, or
purpose analysis; those still rely on source citations plus Vanguard/owner stage gates. That is a
known design boundary, not independent verification.

### The silence was budget exhaustion, not interview dependence

**Corrected 2026-08-22.** The first diagnosis was that conversational charters caused delegated
silence: an agent built to interview would reach its "ask the owner" step, find no turn to wait for,
and stall. That is a real gap and the five specialists were right to be fixed for it — but it is not
the general case.

**The controlling evidence is a run that had no interview loop at all.** On 2026-08-22 `Implementer`
was delegated four tasks, modified six production files including roughly 190 lines across
`ProphetsWay.EFTools/BaseDao.cs` and `EntityGraph.cs`, and **returned no report**. Independent
measurement afterwards found the work was sound: 0 warnings and 0 errors, the lap gate at 68/68, and
the full suite at 270 total / 259 passed / 11 failed with no regressions. The run did the work and
lost the account of it.

So the better local hypothesis is **output and context budget exhaustion on heavy multi-file edit
runs**, of which interview dependence is one narrower cause. Two consequences follow:

- **Terminal-only final reporting is fragile.** Anything that exists solely in a closing message is
  lost when that message is never produced. The receipt is a deliberate second, earlier place for the
  same intent to survive — but only once it is a **file**, not an earlier chat message. See the
  corrected platform finding above: a subagent returns one message and everything before it is
  discarded, so the earlier chat message was never a second place at all.
- **Unbounded packets are the risk, not slow agents.** The fix is the scope ceiling: reserve budget
  for validation and reporting before spending it on edits, and split rather than overrun.

This does not restore the rejected option of hard task limits. A fixed number is wrong in both
directions — it blocks a leaf that could finish ten trivial tasks and permits one that cannot finish
two large ones. The leaf assesses; the parent accepts the assessment.

**Coverage as of 2026-08-22: all 23 `Vanguard` project leaves carry receipts and ceilings, plus
`Toolbelt Keeper` when it is invoked as a subagent outside `Vanguard`.** It arrived in two passes, and
the second pass exists because the first was believed complete:

| Pass | Agents | Note |
|---|---|---|
| Original five | `Interface Architect`, `Repo Analyst`, `Solution Architect`, `API Designer`, `Purpose Refiner` | Fixed first for delegated silence |
| Second, to fifteen | `Implementer`, `Test Designer`, `Refactorer`, `Code Reviewer`, `Test Auditor`, `Contract Reviewer`, `Changelog Author`, `README Author`, `Commit Author`, `Session Scribe` | Documented at the time as full coverage — **it was not** |
| Third, to 23 | `Modernizer`, `Project Scaffolder`, `Threat Modeler`, `Security Reviewer`, `Pipeline Engineer`, `Pipeline Auditor`, `Azure Infrastructure Engineer`, `Azure Deployment Reviewer` | The eight found by the recovery audit above |
| Separately | `Toolbelt Keeper` | Not a `Vanguard` leaf — `Vanguard` is forbidden from invoking it |

**Any earlier statement in this document that "all fifteen" leaves were covered was wrong when written**
and is superseded; fifteen of 23 is 65% of the allowlist, so a silent failure in a `Modernizer`,
`Security Reviewer`, or Azure run was still undetectable by the parent's post-run audit. The count now
appears in both parents so it can be checked against the `agents:` frontmatter rather than trusted.

All 23 require the packet's `Receipt artifact:` path and return `BLOCKED` without one, write that file
`STARTED` before their first edit or long read, and overwrite it with a completion record before the
final chat report. Both parents — `Vanguard` and `TDD Lead` — compose the path and read the file back.
No charter was widened to do it: the temp-file write is a named operational-metadata exception and
nothing else. `Implementer` and `Refactorer` still cannot touch a test, `Test Designer` still writes only
tests, the reviewers stay read-only apart from feature-request capture, `Session Scribe` and
`Commit Author` still never commit, `Pipeline Auditor` still edits no YAML, and
`Azure Infrastructure Engineer` still cannot mutate Azure. Direct conversational escalation is unchanged
in every one — each `stop and ask` became a fail-closed final status **for delegated runs only**.

Five shapes needed tailoring rather than a copy of the same block:

| Shape | Adaptation |
|---|---|
| Heavy read-only reviewers | The receipt artifact is written before the long **read**, and the final report must carry an evidence-coverage table, so a truncated read cannot masquerade as a completed review |
| `Session Scribe` `checkpoint` | A one-line receipt — in the artifact *and* in chat. Checkpoint runs inside the TDD loop and its three-line chat ceiling is itself a load-bearing decision; `resume` and `wrapup` use the full form |
| Approval-gated agents | The receipt records **changes withheld for want of approval** as a first-class field, so the gate is visible in the artifact even if the report never arrives |
| `Threat Modeler` | Its interview step has no turn to happen in, so unanswered questions become explicit assumptions and Open Questions in the written model — never silently-adopted defaults, and never an ungrounded compliance claim |
| `Pipeline Engineer` | A leaf **and** a parent: it must compose a fresh receipt path for its own `Pipeline Auditor` invocation and read that file back, exactly as `Vanguard` does for it |
| `Toolbelt Keeper` | Hash counts in the completion record, and a `SPLIT` boundary of one **fully-synced agent** rather than one file, so the ceiling cannot break its all-three-locations constraint |

Secret handling needed one explicit addition rather than a shape. Four of the eight routinely encounter
credentials — `Security Reviewer`, `Pipeline Auditor`, `Pipeline Engineer`, and both Azure agents — and
the receipt is a new place a value could be written. Each now states that the receipt carries location
and kind only, on the same terms as its report.

### Vanguard's terminal restriction held under direct pressure — once

**Empirical datapoint, 2026-08-22.** In a later session `Vanguard` had shell access, and so did
several of the subagents it invoked. It was **asked directly to commit**. It declined and routed the
git commands back to the owner, exactly as its Absolute Constraints require.

That is evidence that instruction-based enforcement of the read-only command boundary can hold under
direct pressure. It is **not proof**: one observation, one model, one phrasing of the request. The
boundary is still prose rather than a tool restriction, because VS Code exposes `execute` as a single
alias with no read-only subset.

The conclusion drawn is a priority, not a reversal: **technical enforcement of the terminal boundary
ranks below reporting reliability.** A leaf that silently loses its report costs real work every time
it happens; the terminal boundary has not yet failed once. Keep the allowed command classes explicit
in the agent, keep watching, and revisit if a single violation appears.

### Vanguard has guarded terminal access

**Chosen:** grant `Vanguard` the `execute` alias for direct, read-only repository and environment
inspection.
**Rejected:** keeping it unable to verify simple git evidence itself, and unrestricted shell use for
builds, edits, package operations, services, or deployment.

The grant improves recovery and synthesis without changing authorship: Vanguard still cannot produce
project artifacts, mutate git, or bypass leaf agents. Dedicated runTask/runTests tools still own
validation. Because tool-level read-only enforcement is unavailable for `execute`, the command
boundary is explicit in Vanguard's Absolute Constraints and should be checked in Chat diagnostics
after loading.

### Session continuity is a file, not memory

`Session Scribe` owns a **single workspace-level** handoff at `prophets-pipelines/docs/session-handoff.md`;
`Vanguard` reads it as Stage 0 of every session, unprompted. A per-repo handoff was rejected — a
session crosses several of the eight roots in an evening, and a per-repo file guarantees the wrong
one gets read.

**Three states, and the state machine is the point:**

| Status | Written by | On resume |
|---|---|---|
| `live` | auto-checkpoint at stage gates and green laps | Recap, but say plainly it is lower fidelity and reconcile against git |
| `fresh` | explicit sign-off | Full recap; durable content already filed |
| `consumed` | stamped when resumed | **Fresh start.** Never replayed. |

`consumed` is the whole reason the machine exists: coming back after forgetting to wrap up should
never hand you a days-old plan you have already moved past. There is deliberately **no age cutoff** —
a long break should still resume where it left off. Only *having already resumed* invalidates a handoff.

The `live` state exists because a closed window is more common than a clean sign-off. Checkpoints run
at **stage gates and each green Stage 3 lap only** — checkpointing every phase would add a delegation
to every step of the loop the owner spends the most time in.

The handoff holds **working state only**. Durable content is pushed to its permanent home:
decisions to `docs/architecture.md`, requirements to `<Project>/docs/requirements.md`, terms to
`docs/glossary.md`. Anything left only in the handoff dies the next time it is rewritten. Filing
those is `wrapup`'s job and needs the owner in the room, which is why `checkpoint` does not attempt it.

Its acceptance test is explicit: *could an agent with no memory of the session read this and start
working productively in under two minutes?* "Continue the DAL work" fails; naming the exact agent,
invocation, and blocking question passes.

`Session Scribe` verifies accomplishments against `git diff` rather than against the conversation —
something discussed but never written down is a loose end, not progress. It never commits.

### For mechanical rules, prefer config over agent instructions

A rule a tool can enforce belongs in that tool's config, not in `AGENTS.shared.md`. A linter cannot
forget and cannot be talked out of it, whereas the shared block is loaded into context on every
request in seven repos and is paid for whether or not it is relevant. Reserve the block for judgment
rules — the ones no tool can check.

The corollary is a scope test: before building a sync for a config file, ask who actually consumes
it. A setting read only by one editor extension on one machine does not need distribution.

### One lead, four stages, and a ledger instead of fourteen prompts

**Chosen:** `Vanguard` — a single lead covering resume, ground, shape, build, land, and sign-off.
**Rejected:** the previous split of `Start Here` (router) + `TDD Lead` + `Repo Docs Lead`.

Three entry points meant deciding *which* front door before doing any work, and `Start Here` had the
`agent` tool with **no `agents:` allowlist** — so the "advisor, not orchestrator" rule was prose with
nothing enforcing it. Folding all three into one lead removes the decision and closes the hole.

This is **not** the rejected top-level Orchestrator. That proposal put a router *above* `TDD Lead`,
which is two-level nesting. `Vanguard` calls leaf agents directly — exactly one level — and explicitly
excludes `TDD Lead` and `Toolbelt Keeper` from its `agents:` list.

**The stage model replaced the linear phase list.** Fourteen sequential phases each needing approval
made a two-minute fix feel like a project. Four stages, of which only Stage 3 loops, with **one route
approval up front**, gets the same rigor at a fraction of the ceremony.

**The artifact ledger is what makes the route automatic.** Every agent has one declared output;
missing means that agent runs, stale gets flagged, current is skipped silently. The owner is asked
nothing. On a healthy repo Stage 1 collapses to a single all-clear line — and that silence is the
feature. It also means a neglected repo *self-diagnoses* rather than relying on anyone remembering
what was never done.

The ledger scan remains in `Session Scribe`, not because Vanguard lacks `git log`, but because recap,
delta reconciliation, and artifact freshness form one continuity responsibility. One `resume` call
still returns all three; Vanguard's terminal is for direct evidence and recovery, not a competing ledger.

### Commit and PR prose is a fourth documentation audience

**Chosen:** a new `Commit Author`.
**Rejected:** extending `Changelog Author` to cover commits and PRs.

They look adjacent — both read a diff and classify changes — but the readers are different and that
drives everything: a commit message is for the owner bisecting in six months, a PR body is for a
reviewer deciding whether to approve, a changelog is for a consumer deciding whether to upgrade.
One agent serving all three writes upgrade guidance in commit messages.

`Commit Author` writes no release or project artifact and may run only read-only git. Its sole file
write is shared feature-request capture; it still cannot commit because commit and PR prose are text,
not actions.

`Vanguard` invokes it automatically at each stage gate and each green Stage 3 lap, which is where the
owner's commit checkpoints already were.

### PR review triage: the lead fetches, the reviewer judges

**Chosen:** `Vanguard` fetches PR comments with its GitHub tools and passes each **verbatim** to
`Code Reviewer` for a merit verdict, then routes the valid ones back through Stage 3.
**Rejected:** `Vanguard` judging the comments itself.

The lead may have proposed the design being criticized, so it is the wrong judge — same principle as
everywhere else. `Code Reviewer` did not write the code, is read-only, and already owns "is this code
correct." No new tools were needed on it.

**Every comment must be presented with its verdict.** A silently dropped comment is indistinguishable
from a dismissed one, and the risk case is specifically a comment criticizing the lead's own plan.

The GitHub PR extension ships a generic `address-pr-comments` skill that edits code directly and has
no concept of the Implementer-cannot-edit-tests rule. Routing through `Vanguard` is the reason to
keep ours; both will appear in the picker.

### Purpose Refiner became a gate, not a tool

It now answers **"does this planned work belong in this library?"** *before* the work starts — in
scope / widens the scope / out of scope / cannot tell. Catching a scope violation at design time
costs a conversation; catching it after implementation costs a deprecation.

The `cannot tell` verdict is deliberate. A purpose too vague to judge against is itself the finding,
and the fix is to settle the purpose before writing anything. In delegated mode it is a completed
gate result with the exact decision needed next, never an unanswered conversational prompt.

It also owns the **single-owner triage** side of `docs/feature-requests.md`. Any agent or the owner may
append a deduplicated `Proposed` entry so findings are not lost, but only Purpose Refiner may change
status. Entries are never deleted or renumbered because their reasoning and stable numbers are durable
assets. At every Stage 1 run it re-verifies every entry against current source and reports pending
candidates for the release; this closes the prior gap where request claims could rot without an owner.
A delegated packet may carry an owner decision verbatim; Vanguard's own recommendation never counts
as authorization to change a status.

### Repo Analyst owns the per-repo AGENTS.md section

Nobody did, and it was a real hole: `/sync-agents-md` regenerates the shared block, but the per-repo
section below it had no author. Every subagent reads that file at step 0, so a repo without one —
`ProphetsWay.BPA` — leaves the entire roster working blind.

It may write only *below* the `END SHARED BLOCK` marker. Hand-editing the block is silently
overwritten by the next sync.

Its one-shot report now includes an evidence-coverage matrix. A profile cannot claim `COMPLETE` when
source, tests, project metadata, examples, or repository documents required by its charter went unread.

### Four review agents, not one

`Contract Reviewer`, `Test Auditor`, `Code Reviewer`, and `Security Reviewer` all review — but each has
a single question and is told explicitly to stay out of the others' territory:

| Agent | Question |
|---|---|
| Contract Reviewer | Is this the right **interface**? |
| Test Auditor | Do these **tests** actually constrain anything? |
| Code Reviewer | Is this **code** correct and clear, including where tests are silent? |
| Security Reviewer | Can this be **attacked**? |

One combined reviewer produces a long undifferentiated list where the important finding is buried.
Separate agents each produce a ranked list against one standard.

`Code Reviewer` closed a real hole: before it existed, nothing asked whether the implementation was
*good* — only whether tests passed and whether it was secure.

### Pipeline authorship and review are separate

`Pipeline Engineer` authors `.yml` / `.yaml`; `Pipeline Auditor` independently diagnoses and reviews.
A bad `prophets-pipelines` change breaks **all seven** consumers, has no test suite, and fails at pipeline
runtime rather than at edit time, so combining those roles would make the author its own only gate.
Engineer must state blast radius, update the complete consumer set, and report what only a real run can
verify. Auditor remains unable to edit YAML. `Modernizer` still owns `.csproj` / `.sqlproj`; Engineer stops
when a pipeline fix requires either.

### Changelog Author never touches the version

It reads `Major`/`Minor`/`Patch` from `app-variables.yml` and writes an entry at that version. When the
changes imply a **different** bump — a removed public member under a minor version, say — it writes the
entry, flags the mismatch loudly, and changes nothing. Publishing a breaking change under a minor
version silently breaks consumers on restore, so surfacing that is the agent's highest-value output.

House changelog format is `# vX.Y.Z` headings with prose, newest first — **not** Keep a Changelog.
The agent is told not to impose that format.

### Routing, not nested orchestration

> **Superseded 2026-08-12** by *One lead, four stages* above. `Start Here` is retired; `Vanguard`
> replaces it and calls leaf agents directly. The nesting analysis below still holds and is why
> `Vanguard` does not call `TDD Lead`.

**Chosen:** `Start Here` recommends an agent and gives the exact invocation to type.
**Rejected:** A top-level orchestrator that invokes `TDD Lead`, which in turn invokes `Implementer`.

Two reasons. First, **nested subagent depth is unverified** — VS Code exposes
`chat.subagents.allowInvocationsFromSubagents`, which implies nesting is constrained in some way,
and nobody has tested a two-level chain here. Second, the leads' value is the **human checkpoint at
every phase transition**; a router that drives a lead which drives specialists puts two layers between
the human and the work, which is precisely what the checkpoints exist to prevent.

`handoffs:` frontmatter (buttons that switch agents with a pre-filled prompt) is a plausible upgrade
for `Start Here` and would sidestep nesting entirely. **Untested** — the `handoffs.agent` field wants
an "agent identifier" and it is unconfirmed whether that means the display name or the filename.

### Orchestrators cannot call each other

`Vanguard` lists neither `TDD Lead` nor `Toolbelt Keeper` in `agents:`, and `TDD Lead` lists neither
`Vanguard` nor `Toolbelt Keeper`. Circular handoffs are a listed anti-pattern, and calling a lead
from a lead is the two-level nesting rejected above.

### Security: split design-time from code-time

**Chosen:** Two agents — `Threat Modeler` (before/during design) and `Security Reviewer` (after code exists).
**Rejected:** One combined security agent.

Same principle as everywhere else: the thing that *defines* the standard should not be the thing that
*grades* against it. The Threat Modeler writes `docs/security/threat-model.md`; the Security Reviewer
audits code **against that document** rather than against standards it invents mid-review. When no
threat model exists the reviewer says so explicitly and falls back to general practice.

**Read-only on source, `execute` granted to the reviewer.** It needs
`dotnet list package --vulnerable --include-transitive` to work from real dependency data rather than
reading csproj files and guessing. Neither agent applies fixes — security fixes involve risk
acceptance, which is the human's call, and a reviewer that patches its own findings is unreviewed.

**Never print a discovered secret.** Report file, line, and kind only. The value would otherwise be
echoed into chat logs and model context, turning a review into a second disclosure.

**No exploit code.** Findings describe the attack in prose and cite the vulnerable line. Defensive
analysis does not require a working proof of concept.

### Azure infrastructure: author, review, then approve twice

**Chosen:** `Azure Infrastructure Engineer` authors Bicep and deployment workflows;
`Azure Deployment Reviewer` independently reviews them and never mutates files or Azure.
**Rejected:** One agent that designs, reviews, approves, and deploys its own infrastructure.

Infrastructure combines three unusually consequential failure modes: an incorrect deployment can
destroy data, an oversized SKU can consume the subscription's credits, and a broad identity can cross
customer boundaries. A compiler pass is necessary but not independent verification. The reviewer
therefore owns the readiness verdict and exact `what-if` interpretation, while the human owns risk
acceptance and deployment approval.

**Two approvals for mutations.** First, the human approves the exact reviewed `what-if`. Second, the
human approves the mutating Azure command. A previous general request to "deploy the app" is not
approval for a later destructive or replacement change.

**AVM and Bicep are the source path.** Module paths and versions are confirmed from the Azure Verified
Modules registry, pinned, restored, and built. `solution.bicep` is the entry point for both Azure CLI
and Azure DevOps; generated JSON is an artifact, never the maintained source.

**Isolation unit:** one customer/deployment/environment per resource group by default, parameterized
rather than copied. This limits management-plane blast radius but does not prove tenant isolation —
the reviewer also traces data stores, identities, secrets, networks, pipeline scopes, and application
authorization for cross-customer paths.

**Cost is a gate, not a note.** Every plan carries a dated pricing source, assumptions, monthly floor
and expected range, variable-cost drivers, budget alerts, and teardown consequences. "Free credits"
are treated as an allowance; no resource is called free without checking current offer eligibility,
region, and limits.

**Repo-local automation first.** A deployment pipeline starts in the consuming application repo while
the pattern is being proven. Moving it into shared `prophets-pipelines` templates requires a separate,
explicit request that enumerates every affected consumer and migration requirement.

### Workspace-specific security knowledge baked in

These are hazards created by the ProphetsWay libraries themselves, and a generic security agent
would miss all four:

| Source | Hazard |
|---|---|
| `ProphetsWay.Hasher` | General-purpose hashes (MD5/SHA-*). **Unsuitable for passwords** regardless of salting — require Argon2id/scrypt/bcrypt/PBKDF2. MD5 and SHA-1 are broken for any adversarial use. |
| `ProphetsWay.Logger` | Console/file/event destinations with **no redaction**. Anything logged is persisted verbatim — the most common PII leak. `FileDestination` takes a caller-supplied path (traversal risk). |
| `ProphetsWay.Utilities.Serializer` | Deserializing untrusted input is a remote-code-execution class. |
| `BaseDataAccess` / `EFTools` | `Get(new Company { Id })` carries **no caller identity** — textbook IDOR unless the layer above enforces ownership on every path. `IBaseSoftEntity` rows remain readable to any query that omits the soft-delete filter. `IBasePagedDao` needs a maximum page size. |

### Placement: user profile, not workspace

**Chosen:** `%APPDATA%\Code\User\prompts\`
**Rejected:** `.github/agents/` in one repo.

This is a 7-root multi-root workspace. A workspace agent in `ProphetsWay.Logger/.github/agents/`
is not offered when working in `ProphetsWay.EFTools`. User profile makes them available everywhere
and they roam via Settings Sync.

### Version control: mirror, not relocate

**Chosen:** Live copies stay in the user profile; exact copies are committed to
`prophets-pipelines/conventions/toolbelt/`.
**Rejected:** Moving them into a repo's `.github/agents/`.

Moving them would scope the agents to one workspace and defeat the point of the user-profile
placement. The mirror is deliberately **not** in `.github/agents/` so VS Code does not register a
second, duplicate copy of every agent when this repo is open.

### Conventions distribution: generated block, not a pointer

**Chosen:** Each repo's `AGENTS.md` carries a full generated copy of the shared block, delimited by
`BEGIN SHARED BLOCK` / `END SHARED BLOCK`. `/sync-agents-md` regenerates them from the master.
**Rejected:** A single canonical doc in `prophets-pipelines` that other repos link to.

When someone clones only `ProphetsWay.Logger`, `prophets-pipelines` is not on disk — a "see the
shared doc" pointer resolves to nothing. Self-containment beats DRY here.

**Cost accepted:** ~90% duplication across 6 files. Mitigated by never hand-editing a generated
block and always editing the master.

### Conventions describe the target, not reality

**Chosen:** State the standard, then list per-repo deviations in a table.
**Rejected:** Document only what currently exists.

Deviations are marked as *known* so agents don't re-report them as discoveries every session.

### Namespace rule: family-dependent

This was decided across two rounds because the first answer conflicted with the evidence.

**Data gathered (library files only, excluding tests/examples):**

| Repo | Namespace | Files |
|---|---|---|
| Logger | `ProphetsWay.Utilities` | 13 |
| Utilities | `ProphetsWay.Utilities` | ~4 |
| Hasher | `ProphetsWay.Hasher` | 3 |
| EFTools | `ProphetsWay.EFTools` | 25 |
| BaseDataAccess | `ProphetsWay.BaseDataAccess` | 10 |

**Chosen:** Split by family. Utility family (Utilities, Logger, Hasher) shares
`ProphetsWay.Utilities`. Data Access family (BaseDataAccess, EFTools) uses per-library namespaces.

**Rejected — "namespace always matches assembly name":** would make Logger and Utilities the
outliers, contradicting the original stated intent that utilities share one `using`.
**Rejected — "everything moves to `ProphetsWay.Utilities`":** would be a binary-breaking change to
3 published packages across ~38 files, and semantically wrong — a DAL paradigm is not a utility.

**Consequence:** only `ProphetsWay.Hasher` deviates (3 files). Fixing it is binary-breaking and
requires a major version bump plus a CHANGELOG entry. **Do not do it without explicit instruction.**

### Assertion library: Shouldly, not FluentAssertions

**Chosen:** `Shouldly` — `result.ShouldBe(...)`.
**Rejected:** `FluentAssertions` — `result.Should().Be(...)`.

FluentAssertions 8.x requires a **paid commercial license**. Shouldly is permissively licensed, free
for any use, and preserves the readable should-style syntax that was the whole reason FluentAssertions
was adopted. The requirement — tests that read as specifications — has not changed; only the library
that satisfies it.

Mapping used consistently in every example across the toolbelt:

| FluentAssertions | Shouldly |
|---|---|
| `.Should().Be(x)` | `.ShouldBe(x)` |
| `.Should().NotBe(x)` | `.ShouldNotBe(x)` |
| `.Should().BeTrue()` | `.ShouldBeTrue()` |
| `.Should().NotBeNull()` | `.ShouldNotBeNull()` |
| `.Should().Contain(x)` | `.ShouldContain(x)` |
| `.Should().BeLessThanOrEqualTo(x)` | `.ShouldBeLessThanOrEqualTo(x)` |
| `.Should().Be(expected, because)` | `.ShouldBe(expected, because)` |

**The old convention was already fictional.** `ProphetsWay.EFTools.Tests` — the most modern test
project in the workspace — references only `xunit`, `xunit.runner.visualstudio`,
`Microsoft.NET.Test.Sdk`, and `coverlet.collector`. It has never referenced FluentAssertions. The
written convention and the actual code had disagreed for a while, which is precisely the drift the
conventions system exists to surface. Treat a documented convention with no code behind it as
unverified until checked.

**Documentation changed ahead of code, deliberately.** Prescribing Shouldly in the agents stops new
tests being written against a license-encumbered library. Migrating existing test code and
`PackageReference` entries is separate work — see Open Items.

### TDD Lead brackets the loop; no top-level Orchestrator

**Chosen:** Extend `TDD Lead` with five conditional phases — `Repo Analyst` at -3, `Modernizer` at -2,
`Project Scaffolder` at -1, `Changelog Author` at 7, `README Author` at 8.
**Rejected:** A new `Orchestrator` agent able to delegate to every agent in the roster.

An Orchestrator that drives `TDD Lead` is **two-level nesting** — already rejected under *Routing, not
nested orchestration*, still unverified, and it puts two layers between the human and the checkpoints
that are the whole point of a lead. An Orchestrator that instead calls leaf agents directly is just
`TDD Lead` with a longer list, and now two agents plausibly answer "build this feature." The ceiling
on this roster is **description distinctness**, not headcount. `Start Here` already covers routing.
*(2026-08-12: this decision was itself superseded — `Vanguard` is now that lead-with-a-longer-list,
and the roster was consolidated rather than grown. The nesting reasoning still stands.)*

Adding leaf agents to a lead is not nesting, so this carries none of that risk.

**Sequencing is load-bearing.** `Modernizer` and `Project Scaffolder` both require a **green baseline**
they cannot distinguish from the cycle's own breakage — and phases 2–5 are *deliberately red*. So both
run only before phase 0 or after phase 6, never interleaved. `TDD Lead` is instructed to refuse a
mid-cycle request and explain why.

Modernize **before** scaffolding: a new `net8.0;net9.0` project dropped into a solution still on
`net461` creates reference breakage.

**The -2 → 7 link is the real win.** Dropping a TFM strands every consumer on it. `Modernizer` is
required to say who it strands and get approval — but nothing carried that to the CHANGELOG, so the
break could ship silently. `TDD Lead` now passes it forward explicitly, because subagents start with
empty context and `Changelog Author` cannot see what `Modernizer` did.

**Source comments are not published documentation.** XML docs on the public surface are written at
phase 0 and maintained inside the loop — they never leave the code. `CHANGELOG.md` and `README.md`
are phases 7 and 8, and no subagent inside the loop may touch either. `README Author` is permitted
to edit `CHANGELOG.md` by its own charter, so phase 8 explicitly tells it not to; phase 7 owns that
file and a second pass would duplicate the entry.

### Repo Analyst is in the loop but almost never runs

**Chosen:** `Repo Analyst` at phase -3, gated on `AGENTS.md` being missing, stale, or contradicted.
**Rejected:** A standing phase 0 codebase review before every cycle.

It is the obvious-looking placement and it is wrong. `AGENTS.md` already carries purpose, layout, key
types, and known deviations, and **every subagent reads it at step 0** — so on a healthy repo the
analyst re-derives what the orchestrator already has, at the cost of reading every source file in the
solution. Its output is a documentation artifact, not a design input: `Interface Architect` does not
consume `docs/repo-profile.md`.

It earns its place in the roster for the case it is actually good at — an unfamiliar or undocumented
repo, where it runs **once** and the profile is reused by every later cycle. `ProphetsWay.BPA`, which
has no `AGENTS.md`, is the live example.

When it reports `AGENTS.md` as *wrong* rather than merely incomplete, that is a checkpoint. Every
other agent trusts that file.

**Phase 8 is a refresh, not the documentation workflow.** A full analyze → refine → rewrite pass on a
neglected repo stays with `Repo Docs Lead`. `TDD Lead` is told to recommend it and stop, so the two
orchestrators do not converge on the same job — which is what makes them stay distinct in the
delegation surface.

### Scaffolding is a separate agent from modernizing

**Chosen:** A new `Project Scaffolder`.
**Rejected:** Widening `Modernizer` to also create projects.

They look adjacent — both write `.csproj` — but the charters are incompatible. `Modernizer`'s work
queue *is* the `AGENTS.md` **Known Deviations** table, and it must record a green `dotnet build`
baseline before touching anything. A project that does not exist yet has no deviations row and no
baseline. Asked to scaffold, it would either refuse per its own constraints or improvise outside its
charter — an agent with `edit` on `.csproj` and `.sln` guessing at an unspecified job.

The risk profiles differ too: creating a file against a template is low-stakes and verified by a build;
mutating shipped build config breaks consumers silently at restore time.

**Who validates the Scaffolder?** `Modernizer` — it audits an existing csproj against the same house
standard the Scaffolder built to, and it is a different agent than the author. Separation of authorship
from verification holds without inventing a fifth reviewer.

### Other conventions settled

| Decision | Value | Note |
|---|---|---|
| Org name | `Prophet's Way` for display, `ProphetsWay` codified | `<Company>` uses the display form |
| Test project suffix | `.Tests` plural | Logger's `.Test` is the outlier |
| Assertion library | `Shouldly` | FluentAssertions 8.x is paid-license; see above |
| Target frameworks | `netstandard2.0;net48;net8.0;net9.0` | Write dotted (`net8.0`), not `net80` |
| Solution layout | base name = contracts, suffix = implementation | Extended from the existing `.DataAccess` / `.DataAccess.NoDB` / `.DataAccess.EF` pattern |
| Database projects | `Microsoft.Build.Sql` SDK | Legacy SSDT `.sqlproj` is debt |

**Layout alternatives rejected:** `.iCore` (non-standard, Hungarian-ish on a project name) and a
separate `.Abstractions` project (correct .NET convention, but unnecessary — the existing
base/suffix pattern already solved this and business logic has one implementation).

### Agent behavior policies

| Area | Rule | Reasoning |
|---|---|---|
| Build badges | Only reuse URLs found in the repo; ask if missing | Azure DevOps `definitionId` cannot be derived; a guess renders broken on GitHub |
| NuGet badge | Only when `<PackageId>` is non-empty | `<PackageId />` is an empty stub, not a value |
| Packaging audit | Required fixes if published; FYI if not | Gaps only matter once publishing is on the table |
| csproj fixes | Propose as `PROPOSED — not applied` XML | Agents stay read-only on build files |
| NuGet extraction | Recommend only, never scaffold | Splitting is a permanent maintenance tax |
| Code examples | Prefer real code from tests/samples; illustrative ones must carry `> **Illustrative**` | Suggest promoting good illustrative examples into real tests |
| README tone | Marketing-first, then detail | Reader decides in ~15 seconds |
| Mocking | Prefer fakes; Moq only when a dependency can't be constructed | Matches existing repos — only Logger uses Moq |
| TDD cycle size | Agent assesses and proposes, human chooses | DAL needs whole-interface; business logic needs multi-interface; isolated members go one at a time |

---

## 4. Verified VS Code Behavior

Empirically tested this session. Do not re-litigate these.

| Fact | Detail |
|---|---|
| **Subfolders break discovery** | Tested: moving `contract-reviewer.agent.md` into `prompts/tdd/` removed it from the picker. User-profile customization files must be **flat**. |
| **The suffix is the type discriminator** | VS Code globs `*.agent.md` / `*.prompt.md`. Renaming to a prefix (`agent-foo.md`) makes the file invisible. |
| **Filename ≠ display name** | The `name:` frontmatter drives the picker label and slash command. Files can be renamed freely. |
| **`agents:` matches display names** | `agents: [Repo Analyst]`, not `[repo-analyst]`. A mismatch silently yields an empty allowlist. |
| **Model pin format** | `Model Name (vendor)` — e.g. `Claude Opus 5 (copilot)`. An array is a fallback chain. A typo fails **silently** to the picker default. |
| **Extra locations** | `chat.agentFilesLocations` / `chat.promptFilesLocations` can register more folders. Untested here. |
| **Agent Host caveat** | When Agent Host is enabled, user agents are read from `~/.copilot/agents`, **not** VS Code profile data. |
| **A subagent returns exactly one message** | `runSubagent` delivers only the leaf's *final* message to the parent; anything the leaf writes into chat before it is discarded. Measured 2026-08-22 — `Interface Architect` and `Contract Reviewer` both reported a receipt as "issued above" and the parent received nothing. **Any state that must outlive a missing final report has to be a file.** |
| **Diagnostics** | Right-click in Chat view → **Diagnostics** lists all loaded customizations and load errors. |

### Bugs made and fixed this session

Avoid repeating these:

1. **`agents: [repo-analyst, ...]`** in Repo Docs Lead used kebab filenames instead of display
   names, producing an allowlist that matched nothing. Fixed to `[Repo Analyst, Purpose Refiner, README Author]`.
2. **Prompt `name:` values** were `'Sync AGENTS.md'` / `'Sweep Workspace'`, so the slash commands
   didn't match the `/sync-agents-md` referenced in all 7 `AGENTS.md` files. Fixed to kebab.
3. **Model names** were copied from VS Code's doc examples (`Claude Opus 4.1`) rather than the
   actual picker. Corrected to `Claude Opus 5`.

### Restoring onto a new machine

The user profile is not version controlled. To rebuild it from the mirror:

```powershell
Copy-Item "c:\Projects\ProphetManX\prophets-pipelines\conventions\toolbelt\*" "$env:APPDATA\Code\User\prompts\" -Force
```

Then confirm every agent appears in the picker. Flat only — do not create subfolders.

---

## 5. Open Items

| # | Item | Status |
|---|---|---|
| 1 | `Directory.Build.props`, `.editorconfig`, `Directory.Packages.props` | **Approved but not created.** Documented as recommendations only. These would mechanically eliminate whole categories of drift. |
| 2 | `ProphetsWay.Example` exists standalone **and** vendored inside `ProphetsWay.EFTools` | Unresolved. Largest architectural question in the workspace. Copies drift independently. |
| 3 | `ProphetsWay.BaseDataAccess` has no test project | Root of the DAL family; `BaseDataAccess` and `BaseDataAccessHelper` are concrete and untested. Best first TDD target. |
| 4 | `ProphetsWay.Utilities` + `ProphetsWay.Hasher` packaging metadata is empty stubs | Blocks a decent nuget.org listing |
| 5 | `ProphetsWay.Utilities` has no pipeline at all | Only repo with no CI |
| 6 | `ProphetsWay.Hasher` still on the legacy standalone pipeline | 4 files to replace with 2 |
| 7 | `prophets-pipelines/README.md` is two lines | Documents the build system every repo depends on |
| 8 | Legacy SSDT `.sqlproj` × 2 | Migrate to `Microsoft.Build.Sql` |
| 9 | Test dependency versions span `Microsoft.NET.Test.Sdk` 16.0.1 → 17.13.0 | Central package management would fix |
| 10 | Verify `chat.useAgentsMdFile` is enabled | If off, no `AGENTS.md` auto-loads |
| 11 | Migrate existing test code from FluentAssertions to Shouldly | **Docs are done; code is not.** The agents now prescribe Shouldly, but no `.cs` file or `PackageReference` has been changed. Audit every test project, swap the reference, apply the syntax mapping above. `ProphetsWay.EFTools.Tests` needs nothing — it never used FluentAssertions. |
| 12 | `AGENTS.shared.md` still names FluentAssertions | Line 122 of the conventions master, mirrored into 6 repos at line 118. Outside `Toolbelt Keeper`'s lane — requires editing the master and running `/sync-agents-md`. |
| 13 | `TDD Lead` declares every execute tool under two namespaces | `execute/runTests` **and** `vscodeGeneral/runTests`, `execute/runTask` **and** `vscodeTasks/runTask`. Belt-and-braces from an earlier debugging session. It works, so it was left alone rather than trimmed on a guess — an unrecognized tool name fails **silently**. Verify which namespace is canonical in Chat view → **Diagnostics**, then trim. |
| 14 | Terminal auto-approve lives only in `settings.json` | `chat.tools.terminal.autoApprove` allows `dotnet build/test/restore`, `dotnet list package`, and read-only `git`; denies `dotnet nuget/tool/publish/pack`, mutating git, all `az`, network fetch/eval, and file deletion. **Not mirrored** — the restore procedure rebuilds all 25 agents and none of this. |
| 15 | **Retire `TDD Lead` — review by 2026-08-26** | Kept only as a fallback while `Vanguard` is shaken out. It duplicates `Vanguard`'s coverage, so two agents plausibly answer "build this feature" — the exact description-overlap failure the roster is supposed to avoid. **Decide at the review date; do not let it linger.** Deleting it is one `Toolbelt Keeper` invocation. |
| 16 | Verify `Vanguard`'s Stage 0 actually fires | The behavior depends on instructions running on the first turn, not on a session hook — no such hook exists. Confirm it orients before answering a direct build request. |
| 17 | `ProphetsWay.BPA` has no `AGENTS.md` and no solution | Empty stub repo by design. First real Stage 1 + Stage 2 test: `Repo Analyst` writes the per-repo section, `Solution Architect` scopes it, `Project Scaffolder` creates the `.sln`. Not started. |
| 18 | Handoff file does not exist yet | `prophets-pipelines/docs/session-handoff.md` is created by the first `Session Scribe` wrapup. Until then every session is a fresh start, which is correct. |
| 19 | **Stress-test the receipt and scope ceiling** | **Partially verified 2026-08-22.** *Passed:* heavy final reporting survived in `Implementer` (four tasks, six production files, 5,575-line spec — `COMPLETE`, build 0/0, lap 68/68, full 270/259/11, test hash unchanged) and in `Interface Architect` (four tasks, seven files, both TFMs building clean); `Contract Reviewer` completed a seven-file heavy read with a full evidence report. *Failed:* the early **chat** receipt was never visible to the parent — which is what forced the durable artifact. *Separately found:* `Interface Architect`'s `COMPLETE` overstated contract fidelity, addressed by the Requirement Trace Audit. **Also measured, unplanned:** a `Toolbelt Keeper` run returned no final output at all, and the one permitted **report-only recovery** returned `COMPLETE` — so report recovery now has a second, real datapoint rather than a fixture one. **Still unverified:** whether a leaf declares `SPLIT` on its own judgment rather than overrunning, and whether `Vanguard` routes a declared `SPLIT` instead of pushing through it. Neither has been exercised, and neither should be described as working. |
| 20 | Receipts are artifact-backed but still instruction-enforced | **Revised 2026-08-22.** The receipt is now a real file at a path the parent chose, so its existence, its ordering relative to the change set, and its final state are all **observable** — that is a genuine improvement on prose describing a chat message that never arrived. What has not changed is enforcement: nothing technical stops a leaf editing a repository before it writes the receipt, and "no receipt before edits" is still detectable only **afterwards**, by the parent noticing changed files with no artifact. Same enforcement class as the terminal boundary. **A second limit surfaced the same day:** the mechanism is only as good as its coverage, and coverage was silently 15 of 23 — an agent without the instruction produces no artifact, which is indistinguishable to the parent from an agent that skipped it. Coverage is now complete; see item 23 for keeping it that way. Acceptable for now; revisit if a leaf is seen skipping it. |
| 21 | Requirement Trace Audit is unverified under load | Added 2026-08-22 alongside the audit itself. It has never been run: no heavy `Interface Architect` delegation has been replayed since. The questions are whether it actually suppresses an invented default rather than retroactively rationalising one, and whether it correctly downgrades to `PARTIAL` when omitting an untraceable behavior leaves a member untestable. `Contract Reviewer` remains the independent check either way — do not treat a passing audit as a reason to skip stage 2e. |
| 22 | **Durable-receipt recovery has never actually been exercised** | Added 2026-08-22, and worth keeping separate from item 19 because the two are easy to conflate. Recovering a **missing chat report** is now observed twice. Recovering **from the durable artifact** is observed **zero** times: the one real silent run belonged to `Toolbelt Keeper`, which had no artifact to leave, so the recovery worked from live files alone. Nothing has yet demonstrated a parent opening a `STARTED` artifact and reporting its planned scope verbatim, or using a completion record as recovery input. Until a failed run leaves one behind, the artifact is a mechanism that is **present and unexercised** — do not describe it as proven, and do not cite item 19's recovery evidence for it. |
| 23 | **Coverage claims need a count, not a word** | Added 2026-08-22. The eight-agent gap survived because the docs said "all fifteen delegated-capable leaf agents" while `Vanguard`'s allowlist held 23 — a claim that read as complete and was checkable only by counting the frontmatter by hand. Both parents now state their own leaf count inline (23 and 16). **When a leaf is added to or removed from an allowlist, that number and this document's coverage table move in the same change set**, or the same failure recurs. Consider whether a `Toolbelt Keeper` drift audit should compare the two automatically. |

---

## 6. Adding a New Agent

**Use the `Toolbelt Keeper` agent.** It performs all of the below and keeps the mirror and this
document in sync. Doing it by hand is how drift starts.

### How many is too many?

The limit is **description distinctness**, not a count. Every agent's `description` is loaded so the
default agent can decide delegation; two agents with overlapping descriptions get picked between
semi-randomly. Eight overlapping agents are worse than twenty-four distinct ones.

Signals you have gone too far:

1. You cannot remember what an agent does without opening the file
2. Two agents would both plausibly handle the same request
3. One has not been used in a month

**`TDD Lead` currently trips signal 2 against `Vanguard`** — knowingly and temporarily. See Open Item 15.

The four reviewers stay distinct only because each carries an explicit *"not your job"* table naming
the agent that owns the adjacent ground. Any new reviewer needs the same. Past roughly 30 agents,
expect delegation accuracy to degrade — the fix then is merging near-duplicates, not adding a second
router.

The steps it follows, for reference:

1. **Pick the primitive.** Agent = a persona with tool restrictions or context isolation.
   Prompt = one parameterized task. Skill = multi-step workflow with bundled assets.
   Instructions = always-on guidance.
2. **Name the file** `<domain>-a-<name>.agent.md` (or `-p-` for a prompt), flat in the prompts folder.
3. **Frontmatter:** `name`, `description` (keyword-rich, "Use when…" + trigger phrases), `tools`
   (minimum viable), `model` (array with fallbacks), `argument-hint`.
4. **Body:** Constraints (what it must NEVER do) → Approach (numbered, step 0 = read `AGENTS.md`)
   → Output Format.
5. **Ask: who validates this agent's output?** If it creates something, a different agent should
   check it. If it can edit files another agent owns, restrict it.
6. **If it's a subagent**, add its display name to the orchestrator's `agents:` list.
7. **Mirror** to `conventions/toolbelt/` and update this file.
8. Verify it appears in the picker; check **Diagnostics** if not.

### Roles deliberately not built

Considered and skipped — revisit if the need appears:

- **Spec Author** — a separate markdown spec per interface. Folded into Interface Architect, since
  XML docs live with the code and can't drift from it.
- **Master "do everything" agent** — would need every tool, which destroys the restriction model.
  The restrictions are the only thing stopping the Implementer from editing tests.
- **Performance analyst** — premature; no measured problem exists.
- **Accessibility reviewer** — relevant once a `.Web` UI exists, not before.
- **Runtime security testing** — `Security Reviewer` is **static analysis only**. Authentication
  bypasses, session handling, and infrastructure misconfiguration need a runtime tool or a human
  pen test before real user data sits behind a public web interface.
