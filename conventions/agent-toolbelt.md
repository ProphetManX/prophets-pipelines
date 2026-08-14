# Agent Toolbelt — Session Handoff

> **This file is not auto-loaded.** Attach it with `#file` when starting a session about
> building, changing, or debugging agent customizations. Do not add it to `AGENTS.md` — it
> is administrative context, irrelevant to day-to-day coding sessions.

**Built:** 2026-08-08 · **Revised:** 2026-08-13 · **Owner:** G. Gordon Nasseri (ProphetManX)
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
| `proj-a-vanguard.agent.md` | **Vanguard** | read, search, edit (feature-request append only), agent, todo, runTask/runTests/testFailure, GitHub PR tools | Opus 5 |
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
| `tdd-a-test-designer.agent.md` | Test Designer | 🔴 2 · Red | read, search, edit | Opus 5 |
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
the Implementer believes a test is wrong it must stop and escalate to the human with: which test,
what it asserts, what it believes is correct. The TDD Lead then routes a correction back through
the Test Designer. The Implementer never fixes a test itself.

*If an agent ever edits a test to make it pass, the workflow has failed — report it rather than
accepting the green build.*

### Read-only by default

Every agent's tool list is the minimum for its job. Orchestrators (`Vanguard`, `TDD Lead`) may edit
only to append a deduplicated `Proposed` entry to `docs/feature-requests.md`; every authored project
artifact remains delegated. This narrow exception implements shared capture without making leads builders.
`Vanguard` also holds no general terminal, only test/task runners and read-only GitHub tools; the
artifact ledger's `git log` work is delegated to `Session Scribe` rather than widening the lead.

### Subagents start with empty context

A subagent cannot see the parent conversation. Every agent's Approach section therefore begins with
"read the repo's `AGENTS.md` first," and orchestrators are instructed to pass forward everything a
subagent needs. This is why the conventions had to live in files rather than in an agent's head.

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

The ledger scan lives in `Session Scribe`, not `Vanguard`, because it needs `git log` and the lead
holds no general terminal. One `resume` call returns recap, delta, and ledger together.

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
and the fix is to settle the purpose before writing anything.

It also owns the **single-owner triage** side of `docs/feature-requests.md`. Any agent or the owner may
append a deduplicated `Proposed` entry so findings are not lost, but only Purpose Refiner may change
status. Entries are never deleted or renumbered because their reasoning and stable numbers are durable
assets. At every Stage 1 run it re-verifies every entry against current source and reports pending
candidates for the release; this closes the prior gap where request claims could rot without an owner.

### Repo Analyst owns the per-repo AGENTS.md section

Nobody did, and it was a real hole: `/sync-agents-md` regenerates the shared block, but the per-repo
section below it had no author. Every subagent reads that file at step 0, so a repo without one —
`ProphetsWay.BPA` — leaves the entire roster working blind.

It may write only *below* the `END SHARED BLOCK` marker. Hand-editing the block is silently
overwritten by the next sync.

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
