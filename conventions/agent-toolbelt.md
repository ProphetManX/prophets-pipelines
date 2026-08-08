# Agent Toolbelt — Session Handoff

> **This file is not auto-loaded.** Attach it with `#file` when starting a session about
> building, changing, or debugging agent customizations. Do not add it to `AGENTS.md` — it
> is administrative context, irrelevant to day-to-day coding sessions.

**Built:** 2026-08-08 · **Owner:** G. Gordon Nasseri (ProphetManX)
**Covers:** 12 custom agents, 2 prompts, and the `AGENTS.md` conventions system across 7 repos.

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

### TDD Workflow

| File | Agent | Phase | Tools | Model |
|---|---|---|---|---|
| `tdd-a-interface-architect.agent.md` | Interface Architect | 0 · Design | read, search, edit | Opus 5 |
| `tdd-a-contract-reviewer.agent.md` | Contract Reviewer | 1 · Critique | read, search | Opus 5 |
| `tdd-a-test-designer.agent.md` | Test Designer | 🔴 2 · Red | read, search, edit | Opus 5 |
| `tdd-a-test-auditor.agent.md` | Test Auditor | 3 · Audit | read, search | Opus 5 |
| `tdd-a-implementer.agent.md` | Implementer | 🟢 4 · Green | read, search, edit, execute | Sonnet 4.5 |
| `tdd-a-refactorer.agent.md` | Refactorer | 🔵 5 · Blue | read, search, edit, execute | Sonnet 4.5 |
| `tdd-a-lead.agent.md` | TDD Lead | orchestrator | read, search, agent, todo | Sonnet 4.5 |

### Documentation Workflow

| File | Agent/Prompt | Tools | Model |
|---|---|---|---|
| `docs-a-repo-analyst.agent.md` | Repo Analyst | read, search, edit | Sonnet 4.5 |
| `docs-a-purpose-refiner.agent.md` | Purpose Refiner | read, search, edit | Opus 5 |
| `docs-a-readme-author.agent.md` | README Author | read, search, edit | Sonnet 4.5 |
| `docs-a-lead.agent.md` | Repo Docs Lead | read, search, agent, todo | Sonnet 4.5 |
| `docs-p-sweep-workspace.prompt.md` | `/sweep-workspace` | inherits | — |
| `docs-p-sync-agents-md.prompt.md` | `/sync-agents-md` | read, search, edit | Sonnet 4.5 |

### Meta

| File | Agent | Tools | Model |
|---|---|---|---|
| `meta-a-toolbelt-keeper.agent.md` | Toolbelt Keeper | read, search, edit, execute | Opus 5 |

Creates, changes, and deletes agents and prompts. Performs the full three-step update — live file,
mirror, docs — and audits for drift between locations. Also holds the restore procedure.

### Conventions System

| File | Role |
|---|---|
| `prophets-pipelines/conventions/AGENTS.shared.md` | **Master copy** of the shared conventions block |
| `<repo>/AGENTS.md` × 6 | Generated shared block + per-repo section |
| `prophets-pipelines/AGENTS.md` | Links to the master instead of inlining it |
| `conventions/toolbelt/` | Mirrored copies of all 14 customization files |

---

## 2. Load-Bearing Design Principles

These are the ideas the whole toolbelt rests on. Changing one changes everything downstream.

### Separation of authorship from verification

The agent that *creates* something never *validates* it, and vice versa. Applied three times:

| Creator | Validator | Why |
|---|---|---|
| Interface Architect | Contract Reviewer | An agent that designed an API is a weak critic of it |
| Test Designer | Test Auditor | Same reasoning, one level down |
| Test Designer | Implementer | **The critical one** — see below |

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

Every agent's tool list is the minimum for its job. Orchestrators (`TDD Lead`, `Repo Docs Lead`)
have **no edit tool at all** — if they feel the urge to write, they are in the wrong role.

### Subagents start with empty context

A subagent cannot see the parent conversation. Every agent's Approach section therefore begins with
"read the repo's `AGENTS.md` first," and orchestrators are instructed to pass forward everything a
subagent needs. This is why the conventions had to live in files rather than in an agent's head.

### Descriptions are the discovery surface

The `description:` field is how the default agent decides whether to delegate. Trigger phrases are
deliberately keyword-stuffed. A vague description means the agent never gets picked automatically.

---

## 3. Decisions and Why

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

### Other conventions settled

| Decision | Value | Note |
|---|---|---|
| Org name | `Prophet's Way` for display, `ProphetsWay` codified | `<Company>` uses the display form |
| Test project suffix | `.Tests` plural | Logger's `.Test` is the outlier |
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

---

## 6. Adding a New Agent

**Use the `Toolbelt Keeper` agent.** It performs all of the below and keeps the mirror and this
document in sync. Doing it by hand is how drift starts.

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
- **Security Reviewer** — security rules are embedded in the Implementer's standards instead.
- **Changelog Author** — plausible next addition; every repo packs a `CHANGELOG.md` into its nupkg.
- **Pipeline Auditor** — would compare each repo's yml against the shared templates.
