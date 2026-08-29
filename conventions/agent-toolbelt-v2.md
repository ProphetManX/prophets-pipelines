# Agent Toolbelt v2 — Migration Blueprint

**Status:** **Active selector generation.** v1 is archived for rollback, not deleted. **Created:**
2026-08-29. **Revised:** 2026-08-29 — selector cutover, v1 archive, and active-model cleanup. **Owner:** G. Gordon Nasseri
(ProphetManX). **Roster:** 29 v2 agents — `Vanguard v2`, twenty-seven project leaves in its allowlist,
and `Toolbelt Keeper v2` deliberately outside it.

**The selector cutover has happened; the behavioral gates have not.** As of 2026-08-29 the live picker
carries the v2 roster and the two prompts and nothing else: all 26 v1 agents were copied to
`conventions/toolbelt/archive/v1/`, hash-verified, and removed from the live folder and the flat current
mirror. That closes the two-roster overlap — one front door is selectable now. **It settles nothing
behavioral.** The full benchmark still does not exist, `Vanguard v2` has still never orchestrated end to
end, and the harness, operator, `LAND_PREVIEW`, `PUBLISH`, EFTools-pilot and BPA-discovery gates are all
still open on the evidence in §9 and §10. **Do not read "active" as "proven,"** and do not restate any
of the pre-cutover claims: that v1 is the production roster, that nothing in v1 is retired, or that the
roster is 28.

Rollback is a **generation restore** from `archive/v1/`, not a file-by-file undo — the scheme is written
in [toolbelt/archive/README.md](toolbelt/archive/README.md) and owned by `Toolbelt Keeper v2`.

Companion documents: [agent-protocol-v2.md](agent-protocol-v2.md) is the shared mechanics every v2 agent
defers to; [agent-toolbelt.md](agent-toolbelt.md) carries the v1 history and remains authoritative for
the archived generation.

---

## 1. Why v2 Exists

Four problems in v1 are structural rather than incidental, and each is fixed by a different piece of v2:

| Problem | v2 answer |
| --- | --- |
| Every agent carries a copy of the same receipt and delegation boilerplate, so a mechanics change is a 20-file edit and coverage silently drifted to 15 of 23 | One [protocol document](agent-protocol-v2.md); agents carry a charter and a compact fallback |
| Two artifacts — an OS-temp receipt and an ephemeral chat report — where the chat half provably does not survive | One invocation report in the run directory, written `STARTED` then completed |
| `PARTIAL` overloaded to mean a scope split, a missing decision, a failed gate, or an exhausted budget | Three fields: `Outcome`, `Reason`, `Continuation` |
| Requirements had no independent validator, while interfaces, tests, and infrastructure all had one | `Product Discovery v2` authors intent, `Solution Architect v2` authors requirements, `Requirements Reviewer v2` attacks them |

---

## 2. Role Map — All 26 Archived v1 Agents and Both Prompts

Every v1 responsibility has a home in the active roster. Nothing was dropped silently; where a role was
merged or retired, the row says where its work went.

**All 26 v1 agents are archived as of 2026-08-29** under `conventions/toolbelt/archive/v1/`. The archive
also holds the two original generation-specific prompt snapshots under `prompts/` and a sorted
28-entry `SHA256SUMS.txt` covering all rollback customizations; the archive README is documentation and
is outside that manifest. None is selectable. The "v1 agent" column names what each row came **from**,
not something still running.

### Orchestration and continuity

| v1 agent | Target | Disposition |
| --- | --- | --- |
| `Vanguard` | **`Vanguard v2`** | Rewritten around an explicit state machine, envelopes, and dependency routing. **Exists now**, and is the **only** selectable front door — v1 `Vanguard` is archived |
| `TDD Lead` | **`Vanguard v2`** | **Retired into it.** It duplicated `Vanguard`'s coverage and tripped the description-overlap rule; v2 has exactly one orchestrator. **Archived 2026-08-29 with the rest of v1**, which is what actually retired it — before that it was merely planned |
| `Session Scribe` | **`Session Scribe v2`** | Same three modes; concise linking handoff. **Exists now** |
| `Toolbelt Keeper` | **`Toolbelt Keeper v2`** | **Exists now.** Rewritten against the protocol for **four** locations — the flat live selector, the flat current mirror, the versioned generation archive, and the documentation — with whole-generation archive and restore. It maintains customization files rather than participating in a run, so it stays **outside every orchestrator's allowlist** and `Vanguard v2` cannot invoke it: changing the toolbelt remains a separate session. **The earlier plan to keep one shared v1 copy is superseded** — a shared v1 agent could not survive the v1 archive, and it had no vocabulary for generations |

### Discovery, requirements, and shaping

| v1 agent | Target | Disposition |
| --- | --- | --- |
| — | **`Product Discovery v2`** | **New.** Owns `docs/product-brief.md`, `docs/decision-log.md`, `docs/open-questions.md`. **Exists now** |
| — | **`Requirements Reviewer v2`** | **New.** The independent adversary requirements never had. **Exists now** |
| `Solution Architect` | **`Solution Architect v2`** | Keeps architecture and requirements; loses intent capture to discovery; gains one evidence-backed repair pass. **Exists now** |
| `Purpose Refiner` | `Purpose Refiner v2` | Retained. Sole owner of feature-request status transitions — the one agent that may change a request's state, and only against a quoted owner decision. **Exists now** |
| `Repo Analyst` | `Repo Analyst v2` | Retained, **plus `Modernizer` recon**. Also keeps the per-repo section of `AGENTS.md`. **Exists now** |
| `Interface Architect` | `Interface Architect v2` | Retained, including the Requirement Trace Audit. **Exists now** |
| `API Designer` | `API Designer v2` | Retained. **Exists now** |
| `Contract Reviewer` | `Contract Reviewer v2` | Retained, **expanded to explicit modes**: `csharp` for interface contracts, `http` for API contracts. One reviewer, two declared modes, so neither surface has an unnamed validator. The mode is a **required** packet field. **Exists now** |
| `Threat Modeler` | `Threat Modeler v2` | Retained. Design-time; writes under `docs/security/` only. **Exists now** |

### Build

| v1 agent | Target | Disposition |
| --- | --- | --- |
| `Test Designer` | `Test Designer v2` | Retained, **narrowed**. Writes executable specification files only — test cases, assertions, and declarations local to those same files — and observes red rather than predicting it. v1 could also write "test-project helper files"; that half moved to the harness role below. **Exists now** |
| — | **`Test Harness Engineer v2`** | **New, and v2-only — it has no v1 counterpart.** The phase-2 harness capability in §4, built as a separate agent rather than as a widening of `Implementer v2`. **Exists now** — see *The Harness Boundary* below |
| `Test Auditor` | `Test Auditor v2` | Retained, **extended to audit the harness** as well as the specification, including its hash evidence. **Exists now** |
| `Implementer` | `Implementer v2` | Retained, **still unable to edit a test** — and now unable to touch a test project at all, because the harness gap that motivated widening it has its own agent. **Exists now** |
| `Code Reviewer` | `Code Reviewer v2` | Retained, including PR-comment merit verdicts. Report-only, and it never posts a reply or changes PR state. **Exists now** |
| `Refactorer` | `Refactorer v2` | Retained. Behavior-preserving, never a test file, and it observes its own green baseline rather than accepting a claimed one. **Exists now** |

#### The Harness Boundary

Real laps stall on infrastructure that is not the test itself — a fixture, a fake, a builder, an
in-memory store, an adapter, a data seed, a suite bootstrap or seam. §4 recorded the capability as wanted
and refused to obtain it by widening `Implementer v2`. `Test Harness Engineer v2` is the shape that was
named there: a **separate declared role with its own file boundary**, validated by `Test Auditor v2`.

**It does not weaken the TDD separation, and the reasons are structural rather than promissory:**

| Guard | Effect |
| --- | --- |
| It writes **only** the paths its packet enumerates | Authorization is an explicit list composed by the parent, never a folder, a glob, or the agent's own judgment |
| It may not write an assertion or a test-discovery attribute **anywhere** | It cannot author a test case even inside its own files, so no test can be smuggled past the audit |
| It refuses an allowed path that already contains one | A mislabeled specification file cannot be edited under a harness packet |
| It re-hashes every specification file before and after and requires equality | Untouched specifications are **proved**, not asserted; a mismatch is `FAILED` |
| Its success condition is **red**, not green | A suite that goes green after harness work is a failed lap by definition — the harness answered the implementation's question |
| A helper that needs an assertion routes back to `Test Designer v2` | The boundary fails closed rather than stretching |
| `Test Auditor v2` reviews it afterwards, hash evidence included | The author is still not the validator |

The distinction it turns on is **specification versus infrastructure**, not file location. `Implementer
v2` remains barred from the test project entirely, which is stricter than v1 — the pressure that would
have broken that rule now has somewhere legitimate to go.

### Land, ops, and infrastructure

| v1 agent | Target | Disposition |
| --- | --- | --- |
| `Security Reviewer` | `Security Reviewer v2` | Retained. Code-time; owns `--vulnerable`; writes `docs/security/security-review.md` and nothing else. **Exists now** |
| `Changelog Author` | `Changelog Author v2` | Retained, and made the **sole** `CHANGELOG.md` writer — no other agent may touch that file, which ends the drift where a changelog claim outlived its own release. **Exists now** |
| `README Author` | `README Author v2` | Retained, **narrowed to the root `README.md` alone**. v1 could also write under `docs/` and touch `CHANGELOG.md`; both are now other agents' files. **Exists now** |
| `Commit Author` | `Commit Author v2` | Retained. Prose only; never runs a mutating git command, and its message is an **input** to the operator below. **Exists now** |
| `Modernizer` | `Modernizer v2` | **Split.** `recon` merges into `Repo Analyst v2`; `Modernizer v2` is **mutation only** and applies an owner-approved change list one verifiable step at a time. `--outdated` and `--deprecated` moved with the recon, so they now belong to the analyst. **Exists now** |
| `Project Scaffolder` | `Project Scaffolder v2` | Retained. New projects and `.sln` entries; structure, never behavior. **Exists now** |
| `Pipeline Engineer` | `Pipeline Engineer v2` | Retained, and now the **sole** YAML writer for every purpose including a repo-local deployment pipeline. **Loses its `agent` tool**: v1 invoked `Pipeline Auditor` itself, and v2 has the parent drive audit → apply → re-audit. **Exists now** |
| `Pipeline Auditor` | `Pipeline Auditor v2` | Retained. Read-only; never YAML; unlike v1 it may not append a feature request. **Exists now** |
| `Azure Infrastructure Engineer` | `Azure Infrastructure Engineer v2` | Retained, **narrowed to Bicep, `.bicepparam`, and infrastructure docs — it writes no YAML at all.** v1 authored its own deployment pipeline; v2 specifies it and `Pipeline Engineer v2` writes it. **No mutating Azure command, in any mode.** **Exists now** |
| `Azure Deployment Reviewer` | `Azure Deployment Reviewer v2` | Retained. `Ready` is not deployment permission, and it now also reviews the deployment YAML the pipeline engineer wrote. **Exists now** |
| — | **`Repository Operator v2`** | **New, and v2-only.** The bounded Git/Release operator deferred in §4, built as one narrow mode-gated executor. **Exists now** — see *The Operator Boundary* below |

### Prompts

| v1 prompt | Responsibility | Target |
| --- | --- | --- |
| `/sweep-workspace` | Multi-repository grounding sweep, run as the orchestrator | **Retained as a prompt and retargeted, not folded away.** Its `agent:` is now `Vanguard v2`; it delegates only v2 leaves — `Repo Analyst v2`, `Purpose Refiner v2`, `README Author v2`, `Changelog Author v2` — discovers repository roots at runtime instead of carrying a fixed ranking, and excludes non-repository customization roots. **The earlier plan to fold it into the state machine was dropped**: the prompt is the entry point a human *types*, and `BOOTSTRAP` enumerating repositories gives nobody a way to ask for a sweep |
| `/sync-agents-md` | Regenerate the shared block from `conventions/AGENTS.shared.md` into every sibling repo | **Retained as a prompt, unchanged in kind.** It is one deterministic parameterized task, which is exactly what a prompt is for; making it an agent would add a persona to a file copy. It names no custom agent, so the v1 archive did not affect its routing; its active pin is `GPT-5.6 Luna (copilot)` |

**Count check: 26 v1 agents and 2 prompts, all accounted for.** One agent is retired into another
(`TDD Lead`), one is split (`Modernizer`), **both prompts stay prompts** — `/sweep-workspace` retargeted
to `Vanguard v2` and `/sync-agents-md` pinned to Luna — and four roles are new (`Product Discovery v2`,
`Requirements Reviewer v2`, `Test Harness Engineer v2`, `Repository Operator v2`). Everything else
carries forward. **All 26 v1 agents now have a v2 counterpart that exists**, `Toolbelt Keeper v2`
included.

**Two earlier claims are superseded and must not be restated:** that 25 of the 26 have a counterpart
with `Toolbelt Keeper` deliberately staying v1 and shared, and that `/sweep-workspace` folds into the
orchestrator.

**Roster arithmetic: 29 active v2 agents** — `Vanguard v2`, plus the **27** project leaves in its
`agents:` allowlist, plus `Toolbelt Keeper v2`, which is deliberately **not** in that allowlist. The
allowlist is unchanged at 27 by this cutover. **28 is the pre-cutover figure**; do not restate it.

### The Operator Boundary

§4 wanted a bounded Git/Release operator and refused to obtain it by handing commit, push, and publish
rights to a prose orchestrator or a document-writing leaf. `Repository Operator v2` is the shape named
there: **one agent whose entire charter is git and release mechanics**, with the packet's
`Operator mode:` and the release manifest as its only authorizations.

| Guard | Effect |
| --- | --- |
| Exactly one `Operator mode:` per invocation | A run cannot commit and then push because both were convenient. Two operations are two packets with two reports |
| Every mutating mode verifies an **expected HEAD** immediately before acting | Closes the gap between reading state and acting on it, where an agent overwrites work that arrived in between |
| Staging is an **exact enumerated path list** | Never a folder, a glob, or `-A`. An unenumerated changed path stops the run rather than riding along |
| The commit message comes from `Commit Author v2`, verbatim | The agent that decides *what to say* is not the agent that decides *what to include* |
| It writes no project file except the exact version fields a manifest names | Its only other write is its own report. It authors nothing |
| No force-push, history rewrite, branch or tag deletion, or merge — in any mode | The irreversible actions are not gated, they are absent |
| A refused approval is `BLOCKED` / `ENVIRONMENT` | Naming the human command is the ending. Routing around the control is a charter violation whatever the result |

**It concentrates mutation rather than distributing it**, which is what makes the rest of the roster
safely read-only about git. `Vanguard v2` still cannot run any of these commands; it can only delegate
one named mode at a time, and the operator refuses a gate the orchestrator has not satisfied.

---

## 3. Separations That Must Remain

These are load-bearing. A merge that violates one is not a simplification.

| Creator | Validator | Why it cannot merge |
| --- | --- | --- |
| `Test Designer v2` | `Implementer v2` | **The critical one.** An implementer that can edit a test will fix the test, because that is the shortest path to green |
| `Test Designer v2` | `Test Harness Engineer v2` | Specification and infrastructure are different products with different failure modes. One agent holding both can move an assertion into a helper and call it plumbing |
| `Test Harness Engineer v2` | `Test Auditor v2` | A fake that encodes an expected value is an implementation written where nobody looks. The audit checks the hash evidence, not the claim |
| `Interface Architect v2` | `Contract Reviewer v2` (`csharp`) | An agent that designed an API is a weak critic of it |
| `API Designer v2` | `Contract Reviewer v2` (`http`) | Same reasoning, different surface |
| `Test Designer v2` | `Test Auditor v2` | Whether tests meaningfully constrain the implementation is a separate judgment from writing them |
| `Implementer v2` | `Code Reviewer v2` | Green proves the cases someone thought to write; the review is everything they did not |
| `Solution Architect v2` | `Requirements Reviewer v2` | **New in v2.** The gap that let vague requirements reach a build stage unchallenged |
| `Product Discovery v2` | `Solution Architect v2` | Intent and design are different failures; an agent doing both rationalizes its own scope |
| `Azure Infrastructure Engineer v2` | `Azure Deployment Reviewer v2` | Infrastructure mistakes spend money or alter live resources |
| `Project Scaffolder v2` | `Modernizer v2` | The scaffolder builds to the house standard; the modernizer audits against it |
| `Pipeline Engineer v2` | `Pipeline Auditor v2` | Auditor diagnoses, Engineer applies, Auditor reviews the result. **In v2 the parent drives all three legs** — v1's engineer invoked the auditor itself, which made the gate a subordinate of the thing it gates |
| `Commit Author v2` | `Repository Operator v2` | The agent that decides *what to say* about a change is not the agent that decides *what goes into it*. One writes the message; the other stages an enumerated list and can reject the run |
| `Changelog Author v2` | `Repository Operator v2` | The changelog states a version implication; only a manifest-driven operator changes a version. An agent doing both would publish against its own reading of the diff |
| `Azure Infrastructure Engineer v2` | `Pipeline Engineer v2` | **New in 2c, and an ownership split rather than a review.** The engineer that authors infrastructure does not also author the pipeline that deploys it — one file type, one owner, so a deployment pipeline is never edited from two directions |

Three ownership collisions v1 carried were removed in the 2c slice, and each was a real drift source:

| File or action | v1 | v2 |
| --- | --- | --- |
| `CHANGELOG.md` | `Changelog Author` **and** `README Author` could both write it | `Changelog Author v2` alone |
| `.yml` / `.yaml` | `Pipeline Engineer` owned build YAML; `Azure Infrastructure Engineer` also authored deployment YAML | `Pipeline Engineer v2` alone |
| git, PR state, release | Named for a human by whichever agent noticed | `Repository Operator v2` alone, one mode per invocation |

Two further invariants:

- **Read-only by default.** Every agent's tool list is the minimum for its job. An orchestrator writes
  no product artifact at all.
- **Reviewers do not author.** A reviewer that supplies replacement prose has become a co-author, and
  the independent review is gone.

---

## 4. Deferred Capabilities

Two capabilities were wanted and were **not** obtained by quietly widening an existing agent. **Both are
now built, and neither as a widening.**

| Candidate | Status |
| --- | --- |
| **Guarded test-harness mode** for `Implementer v2` | **Resolved 2026-08-29 — and not as a mode.** The evaluation concluded that granting `Implementer v2` any write inside a test project deletes the roster's most important constraint, whatever it is called. The capability shipped instead as `Test Harness Engineer v2`: a separate agent, an enumerated path list rather than a file pattern, no assertion anywhere, hash-proved specification files, red as its success condition, and `Test Auditor v2` reviewing the result. `Implementer v2` was **tightened** rather than widened — it may not touch a test project at all. See §2 *The Harness Boundary* |
| **Bounded Git/Release operator** | **Resolved 2026-08-29 in the 2c slice.** The protocol allows a run to branch, commit, push, and open a draft PR, and giving those to a prose orchestrator or a document-writing leaf would have been broad mutation in the wrong place. It shipped as the shape this row asked for: `Repository Operator v2`, one narrow agent whose entire charter is git and release mechanics, with one `Operator mode:` per invocation, an expected-HEAD check before every mutation, an enumerated staging list, and the release manifest as its only publication authorization. `Vanguard v2` still executes nothing itself. See §2 *The Operator Boundary* |

**Nothing is deferred now.** The next unknowns are behavioral, not structural — see §9.

---

## 5. Model Workload Classes

Verified against the local VS Code catalog on **2026-08-29**. Only these three labels may appear in a v2
file, exactly as written:

| Label | Class | Use for |
| --- | --- | --- |
| `GPT-5.6 Sol (copilot)` | **Judgment** | Orchestration, discovery, architecture, adversarial review — anything where a wrong inference is expensive and hard to detect |
| `GPT-5.6 Terra (copilot)` | **Bounded specialist** | Narrow, well-specified, verifiable work with a clear done condition. **In use as of the phase-2a slice** |
| `GPT-5.6 Luna (copilot)` | **Mechanical** | Recording, summarizing, reconciling against a diff — high volume, low judgment |

Rules: **one pin per agent, no fallback array.** A fallback chain hides which model produced a result,
which makes the benchmark unreadable. No Claude, Opus, Sonnet, GPT-5, or `auto` label belongs in any v2
file. A typo in a model label fails **silently** to the picker default, so every pin is checked in Chat
view → **Diagnostics** after loading.

### Current pilot pins

| Agent | Pin | Class |
| --- | --- | --- |
| `Vanguard v2` | `GPT-5.6 Sol (copilot)` | Judgment |
| `Product Discovery v2` | `GPT-5.6 Sol (copilot)` | Judgment |
| `Requirements Reviewer v2` | `GPT-5.6 Sol (copilot)` | Judgment |
| `Solution Architect v2` | `GPT-5.6 Sol (copilot)` | Judgment |
| `Purpose Refiner v2` | `GPT-5.6 Sol (copilot)` | Judgment |
| `Repo Analyst v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Modernizer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Project Scaffolder v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Interface Architect v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `API Designer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Contract Reviewer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Threat Modeler v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Test Designer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Test Harness Engineer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Test Auditor v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Implementer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Code Reviewer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Refactorer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Security Reviewer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Pipeline Engineer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Pipeline Auditor v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Azure Infrastructure Engineer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Azure Deployment Reviewer v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Repository Operator v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `README Author v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Toolbelt Keeper v2` | `GPT-5.6 Terra (copilot)` | Bounded specialist |
| `Session Scribe v2` | `GPT-5.6 Luna (copilot)` | Mechanical |
| `Commit Author v2` | `GPT-5.6 Luna (copilot)` | Mechanical |
| `Changelog Author v2` | `GPT-5.6 Luna (copilot)` | Mechanical |

**Distribution across the 29 active agents: Sol 5, Terra 21, Luna 3.** Re-derived 2026-08-29 by reading
the `model:` line of every live `*-v2.agent.md`, not carried from this table. Every pin is a single
label; no fallback array survives anywhere in the roster. **The pre-cutover 5 / 20 / 3 figure is
superseded.**

**The current selector contains no legacy model pins or fallback arrays.** `/sync-agents-md` is the
one Luna-pinned prompt; `/sweep-workspace` inherits `Vanguard v2`. The v1 archive retains its historical
pins unchanged as rollback material and is not selectable.

**`Toolbelt Keeper v2` is the twenty-first Terra, and the class fits better than its ancestry suggests.**
The v1 agent it replaces ran on a judgment-class fallback chain, but the work is enumerable and checkable
end to end — hash sets, file counts, frontmatter fields, a stated done condition. Its failure mode is an
incomplete sweep, which a hash comparison catches; it is not a bad inference, which nothing catches.

**The 2c pins follow the same rule and add one deliberate test.** `Commit Author v2` and
`Changelog Author v2` are Luna because both are reconciliation against a diff — high volume, low
judgment, and a wrong answer is visible in the artifact. `README Author v2` is Terra rather than Luna
because its failure mode is **invention**, which is a judgment failure wearing a documentation costume.
`Repository Operator v2` is Terra despite executing the roster's only irreversible actions, because its
work is entirely checkable — verify a HEAD, stage a named list, run a named command — and dimension 1 of
§7 is exactly where a wrong call there would show up. **If a bounded pin is going to fail anywhere,
that is the agent where it matters most**, so the benchmark treats it as a disqualifying case.

**`Purpose Refiner v2` is the one grounding leaf on the judgment class, and that is deliberate.** Its
product is a scope verdict and an extraction argument — a wrong call there is expensive and hard to
detect, which is the definition of the judgment class. The remaining leaves have a clear done condition
and sit on Terra or Luna. **The split is itself a benchmark input**: if Terra under-performs on
`Contract Reviewer v2`, `Interface Architect v2`, or either of the two adversarial build roles, that is
the finding, not a reason to quietly re-pin.

**The two build reviewers on Terra are the sharpest test of that hypothesis.** `Test Auditor v2` and
`Code Reviewer v2` are adversarial roles, which §1's table puts in the judgment class — but both work
from a fixed checklist against a bounded artifact with a stated verdict, which is the bounded-specialist
profile. They are pinned to Terra on purpose so the benchmark can answer it, and dimensions 3 and 4 of
§7 are where the answer will show up.

---

## 6. Rollout

| Phase | Contents | Gate to the next phase |
| --- | --- | --- |
| **1 — Core slice** *(2026-08-29)* | Protocol, blueprint, and five agents: Vanguard, Product Discovery, Requirements Reviewer, Solution Architect, Session Scribe | Five agents load clean, mirror hash-identical, v1 byte-unchanged |
| **2a — Grounding and shaping slice** *(2026-08-29)* | Eight leaves — Repo Analyst, Purpose Refiner, Modernizer, Project Scaffolder, Interface Architect, API Designer, Contract Reviewer, Threat Modeler — and `Vanguard v2` allowlisting all twelve, with `GROUND` and `SHAPE` made executable | Twelve agents load clean, mirror hash-identical, v1 byte-unchanged, allowlist display names exact |
| **2b — Build slice** *(2026-08-29)* | Six leaves — Test Designer, **Test Harness Engineer**, Test Auditor, Implementer, Code Reviewer, Refactorer — and `Vanguard v2` allowlisting all eighteen, with `BUILD_LAP` made executable. Resolves the guarded test-harness capability in §4 as a separate agent rather than a mode | Eighteen leaves load clean, mirror hash-identical, v1 byte-unchanged, allowlist display names exact, harness boundary explicit and falsifiable |
| **2c — Land, ops, and infrastructure slice** *(2026-08-29)* | Nine leaves — Security Reviewer, Commit Author, Changelog Author, README Author, Pipeline Engineer, Pipeline Auditor, Azure Infrastructure Engineer, Azure Deployment Reviewer, and the v2-only **Repository Operator** — and `Vanguard v2` allowlisting all twenty-seven, with `LAND_PREVIEW` and `PUBLISH` made executable. Resolves the bounded Git/Release operator deferred in §4 and removes three ownership collisions | Twenty-seven leaves load clean, mirror hash-identical, v1 byte-unchanged, allowlist display names exact; then benchmark fixtures run across Sol, Terra, and Luna |
| **3 — Pilot** | One real, **owner-selected** `ProphetsWay.EFTools` finishing task, then `ProphetsWay.BPA` product discovery | Both complete with no charter violation and no unresolved High or Critical finding |
| **4a — Selector cutover** *(2026-08-29)* | All 26 v1 agents archived to `conventions/toolbelt/archive/v1/`; its two original prompt snapshots and a 28-entry SHA-256 manifest complete the rollback generation. The agents were removed from the live folder and the flat current mirror; `Toolbelt Keeper v2` was added as the twenty-ninth agent; `/sweep-workspace` retargeted to `Vanguard v2`. **v1 is kept as a rollback generation, not deleted** | Live and current mirror match 1:1 by name and hash with the archive excluded; archive manifest validates; no non-v2 agent selectable |
| **4b — Default cutover** | v2 is now the only roster a human *can* pick, so what remains is whether it has **earned** that. Rollback is a whole-generation restore from `archive/v1/` | **Still open.** Owner decision, on benchmark plus pilot evidence — neither exists yet |

**The selector cutover is not the default cutover, and the gate is unchanged.** Archiving v1 removed the
picker overlap; it produced no benchmark and no pilot evidence, and **no claim that v2 is proven follows
from it**. Phase 4b still requires the benchmark and one EFTools pilot to pass. The
sequence is deliberate: the specialist slices exist before the pilot, because a pilot run that has to
hand every build lap back to a human is not a test of the orchestrator. **2c closed the last structural
gap** — `Vanguard v2` can now ground a repository, shape a contract, run a full red → audit → green →
review lap, review it for security, write the changelog and README, draft the commit and PR prose, push a
branch, and open a draft PR, all without a human touching a command.

**What it hands back now is judgment, not capability, and that is the design.** No agent merges. `PUBLISH`
refuses to start without an exact owner-written release manifest. `Modernizer v2` refuses a change list
with no quoted approval. Those are not gaps to fill in a later slice — they are the decisions a human is
supposed to keep, and the rule that an absent authorization is never improvised around is unchanged.

**One capability is present but unproven in this environment.** The terminal auto-approval configuration
in use denies `git commit`, `git push`, branch checkout and switch mutations, and every `az` command, so
an unattended `Repository Operator v2` will legitimately return `BLOCKED` / `ENVIRONMENT` until an
attended pilot establishes narrowly scoped approval settings. **Nothing here claims remote automation is
proven**, and the correct response to that refusal is the named human command — never a second route to
the same effect. See §9.

---

## 7. Benchmark Rubric

Run each model class against representative fixtures — a discovery interview with deliberate gaps, a
requirements document with planted defects, a multi-file edit, and a long read-only review. Score:

| # | Dimension | What it catches |
| --- | --- | --- |
| 1 | **Instruction and write-boundary adherence** | The one that matters most — did it write outside its charter, even once |
| 2 | **Requirement invention** | Behaviors asserted as settled that no input states. Measured as a count, not an impression |
| 3 | **Reviewer recall** | Planted defects found, over planted defects total |
| 4 | **Reviewer false positives** | Findings against text that is actually correct — a noisy reviewer gets ignored, which is the same as no reviewer |
| 5 | **Tool success rate** | Malformed calls, wrong paths, retries |
| 6 | **Report recovery** | Runs that lost their chat report but left a usable artifact |
| 7 | **Context capacity** | The largest input handled before quality degrades, not before it errors |
| 8 | **Latency** | Wall clock per invocation class |
| 9 | **Validation accuracy** | Claimed green versus independently re-run green |
| 10 | **Diff cleanliness** | Unrelated changes, formatting churn, files touched outside scope |

Dimensions 1, 2, and 9 are disqualifying at any failure. The rest are comparative.

---

## 8. Accepted Defaults

| Area | Default |
| --- | --- |
| Build order | v2 was built beside v1, and v1 was left byte-unchanged throughout that build. **Superseded 2026-08-29 at the selector layer:** v1 now lives in `conventions/toolbelt/archive/v1/` rather than in the picker, so "beside" no longer describes what a human sees. The benchmark-then-switch gate for the **default** is unchanged |
| Generations | The live folder and the flat current mirror carry **exactly one** generation. Retired generations live under `conventions/toolbelt/archive/<generation>/`, are never loaded by VS Code, and are **excluded** from the current-mirror hash comparison. Each archive contains root agent definitions, generation-specific prompt snapshots under `prompts/`, and a sorted SHA-256 manifest over those rollback customizations; the archive README is documentation outside the manifest. Archive and rollback move a whole named generation, never individual files; manifest validation precedes deletion or restoration; an archive is never overwritten and is immutable except to repair proven corruption against Git history. A wanted change to a retired generation creates a new generation instead |
| Requirements flow | Discovery captures intent → Architect writes → Reviewer attacks → one automatic repair pass → Vanguard consumes. **Vanguard drives every leg** — neither leaf holds an `agent` tool, so they never invoke each other |
| Discovery artifacts | `docs/product-brief.md`, `docs/decision-log.md`, `docs/open-questions.md`, owned solely by `Product Discovery v2`. A non-owner leaf **reports** a proposed question and the stream it blocks; Vanguard routes it to Discovery to deduplicate and append |
| Reviewer writes | Its own invocation report only. Never a durable product artifact. **This tightened in 2a**: v1 `Contract Reviewer` could append a `Proposed` feature request, and `Contract Reviewer v2` cannot — it reports the proposal and `Purpose Refiner v2` appends it |
| Feature requests | `Purpose Refiner v2` is the only writer of `docs/feature-requests.md` and the only agent that may change a status, and only against an owner decision **quoted in the packet**. A parent's recommendation is not authorization, and a parent may not manufacture one |
| Contract review | `Mode: csharp` or `Mode: http` is a **required** packet field; a missing mode is `BLOCKED` / `PROTOCOL` before any read. Reviewing an HTTP design against interface-segregation criteria produces confident findings against the wrong criteria |
| Build lap | Red → audit → green → review → optional refactor → checkpoint, one coherent slice at a time, driven entirely by `Vanguard v2`. **Never proceed past a `Repair required` audit.** A behavior correction routes `Test Designer v2` → `Test Auditor v2` → `Implementer v2`; a structure-only correction may route `Refactorer v2`. Repair cycles and lap count are envelope ceilings, and reaching one is `PARTIAL` / `BUDGET`, not a failure |
| Test harness | `Test Harness Engineer v2` is routed **only** on a named standalone infrastructure blocker, and only with `Allowed helper paths:` enumerated exactly plus `Specification hashes:` from the designer's report. It writes no assertion and no test-discovery attribute anywhere, proves every specification file unchanged by hash, and **succeeds only if the suite still reaches red**. A green suite after harness work is a failed lap. A helper that needs an assertion routes back to `Test Designer v2` |
| Test edits | No agent may weaken, delete, skip, retag, or filter a test to obtain green. `Implementer v2` may not touch a test project at all; a test it believes is wrong stops that stream and is reported with the assertion and the conflicting contract statement quoted |
| Diagnosis versus repair | `Repo Analyst v2` finds build and packaging debt and proposes fixes unapplied; `Modernizer v2` applies only what an owner approved, one verifiable change at a time, and never during a deliberately red lap. An agent that both finds and fixes debt writes its own approval |
| Landing | Conditional gates with one owner each: `Security Reviewer v2` before anything ships and outright where real user data is in play; `Changelog Author v2` for a consumer-visible change; `README Author v2` when public use or documented behavior changes; `Pipeline Auditor v2` → `Pipeline Engineer v2` → `Pipeline Auditor v2` for any YAML; `Azure Infrastructure Engineer v2` → `Azure Deployment Reviewer v2` for infrastructure, with `Pipeline Engineer v2` owning the deployment YAML; `Commit Author v2` always, for the PR prose |
| Sole ownership | `CHANGELOG.md` → `Changelog Author v2`. Root `README.md` → `README Author v2`. Every `.yml` and `.yaml` → `Pipeline Engineer v2`. `docs/feature-requests.md` → `Purpose Refiner v2`. `docs/open-questions.md` → `Product Discovery v2`. Bicep and `.bicepparam` → `Azure Infrastructure Engineer v2`. No file has two writers |
| Git and release execution | `Repository Operator v2` only, one `Operator mode:` per invocation, expected HEAD verified immediately before every mutation, staging by exact enumerated path list. `Vanguard v2` delegates and never executes. **No agent merges, in any mode** |
| Environment refusal | A denied or unobtainable tool approval is `BLOCKED` / `ENVIRONMENT` and the exact human command is named. **Never a second route to the same effect** — not another tool, spelling, script file, or redirect |
| Repair loops | Every author/reviewer pairing is parent-mediated and bounded identically: create → review → **one** repair quoting finding IDs → focused re-review. What survives is `Blocked on owner decision`, and there is no third round in any pairing |
| Unknowns | Dependency-scoped: table and continue. Stop only per the protocol's three conditions |
| Run artifacts | `<project-parent>/.agent-runs/<run-id>/`, outside every repository, retained 30 days. `<project-parent>` is the common parent of the **repository roots named in the run**, excluding non-repository customization roots — folding in a multi-root workspace's prompts folder resolves it to a drive root |
| Deletion | Only completed or reviewed, unreferenced, older than 30 days. Never active, unreviewed, failed, or referenced |
| Handoff | `<project-parent>/.agent-runs/session-handoff-v2.md` — **operational, outside every repository**, beside the per-run directories and exempt from their 30-day retention. `Vanguard v2` resolves it at `BOOTSTRAP` and passes the exact path; no repo-local `docs/session-handoff-v2.md` exists, and v1's `docs/session-handoff.md` is untouched. Links reports; at most three recent entries; readable in under two minutes. Durable content is promoted by its **owning** agent — `Session Scribe v2` verifies and lists what is unpromoted, and stamps `fresh` only when none is |
| Branch refusal | A blocked `prepare_branch` leaves **only** operational reports, the external handoff, and read-only analysis. **No repository artifact may be edited on a default or shared branch, documentation included** — a repository doc is a repository write, not an exception to one. An envelope whose work requires any repository write has no read-only remainder and enters `STOP_SAFE` with the branch command named for a human |
| Unattended envelope | Stop by 07:00 local; 3 repair cycles per failed gate; 8 build laps; allowed repositories, paths, checks, and reviews are mandatory |
| Git | Clean baseline required; `agent/<date>-<slug>` branch; atomic commits after validation and review; draft PR allowed; never merge unattended; never force-push or rewrite history |
| Release | Exact manifest only — repository, version file, exact old and new values, channel, tag, feed, artifacts, gates, cost cap. Never infer a version or channel |
| Azure | No unattended deployment. Pipeline runs only when the envelope names them |
| BPA decisions | Elicited during discovery where possible. If later unknown, defer the dependent stream — architecture, product scope and users, data and privacy and auth, money and integrations, acceptance semantics, and release and deployment are never invented |
| First pilot | One owner-selected EFTools finishing task **after** the phase-2 specialist slice, then BPA discovery |

---

## 9. Open Items

| # | Item | Status |
| --- | --- | --- |
| 1 | Phase-2a grounding and shaping slice | **Done 2026-08-29.** Eight leaves added, `Vanguard v2` allowlists twelve, `GROUND` and `SHAPE` are executable |
| 2 | Phase-2b build slice | **Done 2026-08-29.** Six leaves added — including the v2-only `Test Harness Engineer v2` — `Vanguard v2` allowlists eighteen, and `BUILD_LAP` is executable |
| 3 | Run-directory cleanup mechanism | **Specified in the protocol, not implemented.** Deletion is manual until after the pilot, by design — the rule is easier to get right than the automation |
| 4 | `session-handoff-v2.md` does not exist yet | **Closed 2026-08-29 — it exists.** The active handoff is operational, so it moved out of `prophets-pipelines/docs/` to `<project-parent>/.agent-runs/session-handoff-v2.md`; §8 and protocol §7 carry the consequences. It was created by the direct `Session Scribe v2` `resume` in §10 — **by a `resume`, not the anticipated `wrapup`** — which found it absent, treated that as a fresh start rather than an error, wrote it, and stamped it `consumed`. That path is now specified in the Scribe charter instead of inferred. No repo-local `docs/session-handoff-v2.md` was created, and v1's `docs/session-handoff.md` was not touched |
| 5 | No v2 agent has been run | **Superseded 2026-08-29 — five have, report-only. Do not restate the old claim.** `Requirements Reviewer v2` (Sol), `Test Auditor v2` (Terra) and `Commit Author v2` (Luna) each ran once against planted-defect fixtures or a read-only diff; `Vanguard v2` (Sol) and `Session Scribe v2` (Luna) then ran in the stop-smoke. See §10. That establishes **load, resolution, report-artifact discipline, write-boundary obedience, and routable status fields on five agents out of twenty-nine**, and nothing more. The other twenty-four remain load-valid by static inspection only, **no run has been orchestrated end to end**, and the workload-class hypothesis behind the Terra pin is still untested at scale — one adversarial fixture review is a smoke test, not a benchmark. **The denominator moved from twenty-eight to twenty-nine when `Toolbelt Keeper v2` was added; the numerator did not move** |
| 6 | Benchmark fixtures do not exist | **Narrowed 2026-08-29, not closed.** Synthetic *smoke* fixtures now exist under the run directory in §10 — four requirements artifacts with planted defects, and one contract plus two cheatable tests. They were built to prove a leaf loads and stays inside its boundary, **not** to score anything: they feed none of the ten §7 dimensions, cover one v1/v2 pairing nowhere, and produce no comparative number. The rubric fixtures that would let v1 and v2 run the same real workload are still outstanding and still the phase-3 gate. **This remains the critical path**, and the 2026-08-29 selector cutover raised its cost rather than lowering it: v1 is archived, so any v1-versus-v2 comparison now needs a deliberate generation restore from `archive/v1/` first. **The cutover was taken on structural grounds, without the comparative number this row is about** |
| 7 | ~~Two rosters answer the same request~~ **Closed 2026-08-29 by the selector cutover** | `Vanguard` and `Vanguard v2` both plausibly matched "build this feature", which is exactly the description-overlap failure the roster forbids. It closed the way this row said it should rather than by lingering: **v1 was archived, not left beside v2**, so exactly one orchestrator is selectable and the `v2` suffix is no longer doing the disambiguating. Kept as a row because the reasoning still binds — a future v3 archives v2 at cutover rather than running two generations in one picker |
| 8 | v2 has no code-time security reviewer | **Closed 2026-08-29 by the 2c slice.** `Security Reviewer v2` exists, owns `docs/security/security-review.md` and the `--vulnerable` scan, and is a required `LAND_PREVIEW` gate. `Code Reviewer v2`'s `Valid — security` verdict now routes to a real owner, and `Threat Modeler v2` sets the standard it grades against. Kept as a row so the reason it mattered survives |
| 9 | **The harness boundary is unexercised** | Added 2026-08-29 with `Test Harness Engineer v2`. Its guards are structural and checkable — an enumerated path list, no assertion anywhere, hash equality before and after, red as the success condition — but **none has been run**. The specific unknowns: whether a designer reliably declares an infrastructure blocker instead of inlining a harness into a spec file; whether `Vanguard v2` composes an exact path list rather than a folder; and whether `Test Auditor v2` actually re-checks the hashes rather than repeating the claim. Until a real lap needs a fixture, this is a mechanism that is **present and unproven** |
| 10 | **Terminal auto-approval denies the operator's core commands** | Added 2026-08-29. The configuration in use denies `git commit`, `git push`, branch checkout and switch mutations, and all `az`. So an **unattended** `Repository Operator v2` will legitimately return `BLOCKED` / `ENVIRONMENT` on `checkpoint_commit`, `publish_branch`, and `release`, and an unattended Azure preview cannot run either. **This is documented, not fixed** — no settings file was edited to create the v2 roster, and narrowing those rules is an owner decision taken during an attended pilot, against real observed commands rather than a guessed allowlist. **Do not read any part of this document as a claim that unattended remote automation is proven.** The correct behavior on refusal is the named human command; a second route to the same effect is a charter violation |
| 11 | **`LAND_PREVIEW` and `PUBLISH` are executable and unexercised** | Added 2026-08-29. Every landing gate, the draft-PR path, and the release manifest path are specified and mirrored, and **not one of them has run**. The three things worth watching first: whether `Vanguard v2` evaluates the landing gates conditionally rather than routing all of them by habit; whether `Repository Operator v2` refuses a `mark_pr_ready` carrying an unresolved High finding instead of weighing it; and whether an absent release manifest genuinely stops entry to `PUBLISH` rather than producing a "prepared" release |
| 12 | Phase-2c land, ops, and infrastructure slice | **Done 2026-08-29.** Nine leaves added — including the v2-only `Repository Operator v2` — `Vanguard v2` allowlists twenty-seven, and `LAND_PREVIEW` and `PUBLISH` are executable. **The roster is structurally complete**; what remains is behavioral evidence |
| 13 | **`Vanguard v2` has never orchestrated anything** | **Partially exercised 2026-08-29 — the safe-stop half passed; nested delegation did not run.** In the stop-smoke it read the governing files, resolved `<project-parent>` to `C:\Projects\ProphetManX` **by excluding the prompts folder rather than walking to a drive root**, created only operational `run.md`, captured the dirty baseline (`main`, HEAD `8095b6e…`, 32 porcelain entries), refused to stash or branch on top of it, and finished with branch, HEAD, entry count and ordered porcelain hash all unchanged. What did **not** run is delegation: the runner used for the test exposed no nested `agent` tool, so the required `Session Scribe v2` calls were impossible and it stopped fail-closed rather than writing the Scribe's artifacts itself. **That is an environment limit of that invocation route, not evidence that a directly-invoked `Vanguard v2` lacks the tool** — VS Code's own custom-agent reference documents `agent` as the alias for invoking custom agents and `agents:` as the allowlist for them, and the frontmatter declares both. Still zero: envelope parsing, dependency routing, `SWITCH_WORKSTREAM` on a non-global blocker, the bounded repair loops, and the `STARTED`-artifact recovery table. **A manual picker invocation is required before anything here is called end-to-end** |
| 14 | **v2's one-file report recovery is still unexercised** | Added 2026-08-29, and kept separate from §10 because the two are easy to conflate. The real silent-run recovery that day exercised the **v1 `Toolbelt Keeper` receipt** protocol — a v1 agent, a temp-file receipt, and live files to check against. It is now recorded in the v1 document as one observed durable-receipt-assisted recovery, which is the correct claim for *that* protocol and carries over to nothing here. **No v2 leaf has gone silent**, so nothing has yet demonstrated a parent opening a v2 `STARTED` `Report artifact:`, reporting its planned scope verbatim, and spending its one permitted report-only recovery invocation. The mechanism is present, and the closest evidence for it belongs to a different protocol |
| 15 | ~~**Operational Markdown was specified only after a leaf got it wrong**~~ **Closed 2026-08-29 by a measured re-test** | Added 2026-08-29, when the rules had no result behind them. **The original failure was real and stays on the record.** The `Session Scribe v2` `resume` produced an accurate handoff and an accurate report, and `get_errors` on both returned MD010 hard tabs, MD022 headings without a following blank line, and MD032 lists without surrounding blank lines — the content was right, the artifacts were defective, and the run reported success, which is exactly the point that writing a file is not checking it. Protocol §2 then carried the rules once and the Scribe charter required a re-open-and-validate pass over both artifacts before the final response. **The re-test ran and it passed.** The `wrapup` on the same run returned `COMPLETE` / `NONE` / `STOP_RUN`, and both finalized artifacts — its own report and the external handoff — came back with **zero diagnostics** under an independent `get_errors` check: no hard tabs, heading and list spacing valid throughout. **Do not restate "not yet re-tested."** What closed this is the correction, not the specification — one leaf now demonstrably validates what it wrote, which is a result on one invocation and not a guarantee about the next |
| 16 | ~~**A parent `run.md` can finish unfinalized, and one did**~~ **Closed 2026-08-29 by correction** | Added 2026-08-29, and **the omission was real — it is not being written out of the record.** The report-only model smoke left `20260829-1245-v2-model-smoke/run.md` with **no final state marker** even though all three leaf reports finalized correctly, so the run read afterwards as neither completed, interrupted, nor abandoned, and both `Session Scribe v2` invocations correctly reported it as *lacking a recorded final state* rather than as complete. That defect is what motivated protocol §2's requirement that the parent update `run.md` at every state transition and finalize it before its final response, which `Vanguard v2` carries compactly. **The record has since been corrected:** that `run.md` now reads `State: SIGN_OFF` with `COMPLETE` / `NONE` / `STOP_RUN`, and carries the model evidence, its telemetry limitation, and the remaining gates. **The fix was retroactive, and that residual belongs to Open Item 13** — a parent finalizing *as it transitions*, during a real orchestrated run, is still unproven |
| 17 | **The rollback path is specified and unexercised** | Added 2026-08-29 with the selector cutover. The forward half is measured: 26 files copied to `archive/v1/`, every one hash-equal to its pre-move source, then removed from both current locations, with live and current mirror verified 31 / 31 identical afterwards. **The reverse half has never been run.** Nobody has restored `archive/v1/` into the live folder and confirmed the v1 roster reappears intact in the picker, and the mechanism has an asymmetry worth naming: a restore must also **re-archive the current generation first** and retarget `/sweep-workspace` back to a v1 `agent:` value, or it produces the mixed-generation state the scheme exists to prevent. Until someone performs one, \"v1 is kept for rollback\" is an argument from a verified archive, not from a verified restore |
| 18 | ~~`/sync-agents-md` carries a legacy-model fallback array~~ | **Closed 2026-08-29.** The prompt retains `agent: 'agent'`, its tools, and its deterministic synchronization behavior; its scalar pin is now `GPT-5.6 Luna (copilot)`. The current selector has no legacy model pins or fallback arrays. The v1 archive remains immutable and non-selectable |

---

## 10. Smoke Evidence — 2026-08-29

**Report-only, five agents across two runs, no benchmark.** Two run directories under
`<project-parent>/.agent-runs/` hold the fixtures and the full reports:
`20260829-1245-v2-model-smoke/` and `20260829-1337-vanguard-stop-smoke/`. This section is the summary;
the detail stays there and is untracked by design.

### The model smoke — three leaves, invoked directly

Each leaf was invoked **directly** by the owner's parent session, not routed by `Vanguard v2` — see
Open Item 13.

| Leaf | Pin | Input | Returned | Wrote |
| --- | --- | --- | --- | --- |
| `Requirements Reviewer v2` | Sol | Four synthetic requirements artifacts with planted defects | `PARTIAL` / `OWNER_DECISION` / `STOP_RUN` | Its report only |
| `Test Auditor v2` | Terra | One contract, two cheatable tests | `PARTIAL` / `REVIEW` / `STOP_RUN` | Its report only |
| `Commit Author v2` | Luna | The real 31-path uncommitted toolbelt diff | `COMPLETE` / `NONE` / `CONTINUE` | Its report only |

What the three runs actually establish:

- The reviewer applied **all nine attacks**, and **left correctly-deferred `OQ-1` alone** rather than
  inventing an answer to it — the specific failure the never-invent categories exist to prevent.
- The auditor caught the null-only and no-assertion cheats and the hardcode and parameter-ignore
  implementations that would ship green, and named the missing semantics and the absent trait context
  **without inventing the answers or writing replacement code**.
- `Commit Author v2` read the full diff, drafted a coherent message, **excluded the pre-existing
  `docs/session-handoff.md`** as out of scope, and ran **no mutating git**.
- All three finalized their artifacts with `State` plus `Outcome` / `Reason` / `Continuation`. **Zero
  unexpected artifacts**; no product repository was changed by any of them.

**The model-pin limitation, stated rather than glossed.** The VS Code local catalog lists the exact IDs
`gpt-5.6-sol`, `gpt-5.6-terra` and `gpt-5.6-luna`; the frontmatter labels were verified exact, and each
agent resolved by its v2 display name. But the current logs expose **no reliable per-invocation model
ID**, so this proves *agent resolution and pinned configuration* — **not** independent runtime telemetry
that a given reply came from a given model. Do not cite it as the latter.

**This run's own `run.md` finished unfinalized, and was corrected afterwards.** All three leaf reports
carried a final state; the parent record carried none, so for a time the run could not be read as
completed, interrupted, or abandoned. That is the defect Open Item 16 exists for, and the reason
protocol §2 now specifies parent finalization. It now reads `State: SIGN_OFF` with `COMPLETE` / `NONE` /
`STOP_RUN`, and carries the model evidence, the telemetry limitation above, and the remaining gates.
**The omission was real and the fix was retroactive** — do not read the corrected file as evidence that a
parent finalizes on its own transitions.

### The stop-smoke — `Vanguard v2`, then `Session Scribe v2`

Run directory `20260829-1337-vanguard-stop-smoke/`. **Two separate invocations, and they are separate
evidence — do not merge them into an end-to-end claim.**

**`Vanguard v2` (Sol), invoked through the platform's delegated-subagent runner.** It read `AGENTS.md`,
`AGENTS.shared.md`, the protocol and the Scribe charter; resolved the run root by excluding the prompts
folder; created **only** operational `run.md`; captured the baseline as `main`, HEAD
`8095b6e4dfdf91976a1f9c6a8416b7e101fb3629`, 32 porcelain entries and an ordered porcelain SHA-256; and
stopped fail-closed at `SIGN_OFF` with `PARTIAL` / `ENVIRONMENT` / `STOP_RUN`. Branch, HEAD, entry count
and hash were identical afterwards. **It refused to stash, clean, or branch on the dirty tree, and it
refused to write the Scribe's report or handoff in the Scribe's place** — which is the behaviour under
test, and it passed.

What it could **not** do is delegate: that runner exposed no nested `agent` tool, so the two required
`Session Scribe v2` calls were impossible. **State the limit precisely.** VS Code's custom-agent
reference documents `agent` as the alias for invoking custom agents and `agents:` as the list
restricting which subagents are allowed — both of which `Vanguard v2` declares. So this is a property of
**the delegated test route**, not a finding that a manually-invoked `Vanguard v2` lacks the capability.
**Nested delegation is environment-blocked on this route and remains unproven; a manual picker
invocation is required before any end-to-end claim.**

**`Session Scribe v2` (Luna), then invoked directly by the parent — leaf evidence, not Vanguard
evidence.** `resume`, against an **absent** external handoff. It treated the absence as a fresh start
rather than an error, wrote only its report and the external handoff, stamped the handoff `consumed`,
represented the 32 pre-existing dirty entries by **linking** the stop-smoke run record instead of
re-listing them, reported the model-smoke run as *lacking a recorded final state* rather than as
complete, created no repo-local `docs/session-handoff-v2.md`, and left branch, HEAD and status
unchanged. `COMPLETE` / `NONE` / `STOP_RUN`.

**And it failed on formatting.** `get_errors` over both artifacts returned MD010 hard tabs, MD022
headings with no following blank line, and MD032 lists with no surrounding blank lines. The account was
accurate; the artifacts were not clean; the run reported success. That is a real smoke failure, and it
is why protocol §2 now carries *Operational Markdown* and the Scribe charter requires a validation pass
— see Open Item 15. **The re-test followed, and it passed.**

**The re-test — `Session Scribe v2` (Luna) `wrapup`, same run directory.** `COMPLETE` / `NONE` /
`STOP_RUN`. It reconciled the parent record against actual state — branch `main`, HEAD
`8095b6e4dfdf91976a1f9c6a8416b7e101fb3629`, 32 porcelain entries and an ordered status SHA-256 matching
the recorded baseline — wrote **only** its own report and the external handoff, and made no repository
write. It stamped the handoff `fresh` rather than promoting anything, because no durable product
decision required promotion; the handoff stays concise, **links** the run record and both Scribe reports
instead of embedding them, and carries two recent-session entries.

**And the formatting held.** Both finalized artifacts were re-opened and checked independently with
`get_errors`: **zero diagnostics on each** — no hard tabs, heading and list spacing valid. That is the
Open Item 15 contract measured rather than asserted. Be precise about what it proves: the first Scribe
run got the content right and the artifact wrong, and it is the **correction** that demonstrated the
contract. One clean invocation is a result, not a guarantee that every future leaf validates.

### The recovery event — same day, different protocol

Recorded separately on purpose. The `Toolbelt Keeper` landing-slice invocation **returned no chat output
at all** and left its receipt at `STARTED`. The parent opened that receipt, and made **one report-only
recovery invocation**, which finalized the same artifact `COMPLETE` after independent hash, frontmatter,
and diagnostics checks.

This is the **first measured receipt-assisted recovery from a silent run** in this work, and it is real
evidence. It is also **v1 machinery** — the `Toolbelt Keeper` receipt protocol, not a v2 leaf's one-file
`Report artifact:`. The two are not interchangeable and citing this for v2 would overstate it; Open
Item 14 tracks what v2 still owes.
