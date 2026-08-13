---
written: 2026-08-13T00:17:03
head:
  prophets-pipelines: ed47c53
  ProphetsWay.BaseDataAccess: c83c138
  ProphetsWay.Example: 9a37ce0
  ProphetsWay.EFTools: f95caa5
  ProphetsWay.Logger: 86568fd
  ProphetsWay.Utilities: 5095e5e
  ProphetsWay.Hasher: d1410ca
status: fresh
---

# Session Handoff

> This is the **first** handoff in this workspace. There was no prior file — the session started
> cold. Everything below was verified against `git` at write time, not taken from conversation.

## Where We Are

The workspace is mid-way through a **workspace-wide .NET 10 retarget**. The TFM standard was
rewritten and committed to `conventions/AGENTS.shared.md`, then synced into all six consuming
repos. `ProphetsWay.Example` 3.0.0 shipped (PR #19 merged, tagged `3.0.0`).
`ProphetsWay.BaseDataAccess` 3.1.0 is the first repo migrated to the new standard — branch
pushed, **PR #39 open with CI green** (`3.1.0.489`).

The next material blocker is not in any library: it is a defect in the shared pipeline
(`steps/restore-build-test.yml`) that silently drops the `net48` test leg under xunit v3.

## Current Focus

Nothing is mid-edit. The session ended at a clean stopping point: `/sync-agents-md` completed and
verified. Tomorrow opens on **merging PR #39** and **committing the six synced `AGENTS.md` files**.

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | Merge PR #39 — BaseDataAccess 3.1.0 | *(owner)* | CI already green (`3.1.0.489`). Nothing is waiting on anything else; it is the cheapest win on the board. |
| 2 | Commit the six synced `AGENTS.md` files | *(owner)* | The sync is done but unrecorded. **`prophets-pipelines` itself is already committed** (`ed47c53`) — see correction below. Until the six land, every repo carries an untracked or dirty conventions block. |
| 3 | Correct two stale per-repo `AGENTS.md` claims | `Repo Analyst` | One of them actively instructs future agents to copy the *superseded* TFM standard. Details under Open Questions — Blocking #1. |
| 4 | Fix the `VSTest@2` glob in `steps/restore-build-test.yml` | `Pipeline Auditor` | Seven-repo blast radius, no test suite, fails at runtime not edit time. **Blocks item 5.** |
| 5 | xunit v3 migration across the repos | `Modernizer` | Assessed and ready — 0 source lines, 3 csproj lines per repo. Cannot start until (4) lands or the `net48` leg vanishes silently. |
| 6 | Example 3.1.0 — same TFM treatment | `Modernizer` | Its **test project must keep `net48`** — that leg is the only cover for the `Activator.CreateInstance<T>()` exception-passthrough guard. |
| 7 | EFTools: advance the submodule pointer past 3.0.0 | `Modernizer` / *(owner)* | Currently pinned at `967fd26`, i.e. pre-3.0.0. Also update `ProphetsWay.Example.DataAccess.EF` and clear the stray `[submodule "Submod"]` entry in `.gitmodules`. Owner has said EFTools being behind is "its problem" and is weighing alternatives to submodules entirely — **do not treat the submodule approach as settled**. |

## Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| 1 | `ProphetsWay.Example/AGENTS.md` (~line 306) states its TFMs are `netstandard2.0;net48;net8.0;net9.0` and declares **"This repo is the TFM reference; copy it rather than the older repos."** Under the new standard that sentence is actively harmful — it points a future agent at the superseded list. Rewrite to name the new standard, or drop the "reference" claim entirely? | Item 3; and any `Modernizer` run that reads Example for guidance | 2026-08-12, surfaced by `/sync-agents-md` |
| 2 | `ProphetsWay.BaseDataAccess/AGENTS.md` (~line 348) claims Known Deviations = **"None"** and cites the old TFM list as correct. Stale the moment `net-10-update` was cut. Update now, or wait until PR #39 merges so the file describes `main`? | Item 3 | 2026-08-12, same sync |
| 3 | The `VSTest@2` fix in item 4 — does the pipeline move to `DotNetCoreCLI@2 test`, or does the glob widen to catch `.exe`? The first is the real fix; the second is smaller but leaves the trap armed for the next person. | Item 5 | 2026-08-12 |

Both #1 and #2 sit **below `END SHARED BLOCK`** in repo-specific sections. `/sync-agents-md`
correctly left them untouched — this is not a sync bug.

## Open Questions — Non-Blocking

- **Example's `<NullableContextOptions>enable</NullableContextOptions>`** is an inert preview-era
  property name (shipped as `<Nullable>`). Rule 7 of the new standard now notes nullable reference
  types cannot work at C# 7.3 while `netstandard2.0` is in the TFM list — so the existing per-repo
  deviation note reads as an *incomplete* explanation: it says the property is inert without saying
  that fixing the spelling would still change nothing. Worth folding into item 3.
- **`ProphetsWay.Logger` has 7 modified `.cs` files (+107/−40) from a prior session**, still
  unexplained. Not touched this session. Someone has to decide whether that is work to finish or
  work to discard.
- **`ProphetsWay.BPA` has no `AGENTS.md`.** Not created — the sync prompt's rules forbid creating
  one. Does it want to join the convention set, or stay outside it?

## In Flight

| Item | State | Where |
|---|---|---|
| BaseDataAccess 3.1.0 | Branch pushed, PR #39 open, CI green `3.1.0.489`. Awaiting merge. | `ProphetsWay.BaseDataAccess` @ `net-10-update` (`c83c138`) |
| `/sync-agents-md` output | Applied to six repos, markers verified. **Uncommitted.** | six repos, `AGENTS.md` |
| Example 3.0.0 | **Shipped.** PR #19 merged as squash `105b3be`, tagged `3.0.0` / `3.0.0-488.Beta`. | `ProphetsWay.Example` @ `origin/main` |
| xunit v3 migration | Assessed, proven on a scratch probe, **deferred** — blocked by the pipeline defect. | see Deliberately Deferred |

## Uncommitted Changes

| Repo | Files | Description |
|---|---|---|
| `prophets-pipelines` | `?? docs/session-handoff.md` | ⚠️ **Correction to the session narrative:** `conventions/AGENTS.shared.md` is **not** uncommitted. It was committed at `ed47c53` — *"updated agents directive TFM to net10"*, 2026-08-13T00:04. Tomorrow's item 2 is therefore only about the six consuming repos. The one dirty item here is **this handoff file**, new and untracked — `docs/` did not previously exist in this repo. |
| `ProphetsWay.BaseDataAccess` | `M AGENTS.md` | Sync output. Expected. |
| `ProphetsWay.Example` | `M AGENTS.md` | Sync output. Expected. |
| `ProphetsWay.EFTools` | `?? AGENTS.md` | Sync output — file was **untracked before this session**, so it needs `git add`, not just commit. |
| `ProphetsWay.EFTools` | `M ProphetsWay.EFTools.sln` | 🚩 **Looks accidental — flagging.** 70 added lines adding a project `V3Probe` pointing at `..\..\..\Users\Proph\AppData\Local\Temp\v3probe\V3Probe\V3Probe.csproj`, plus new `x64`/`x86` solution platforms. This is the xunit v3 scratch probe, absorbed into the EFTools solution. The path is under `%TEMP%` and will not exist on any other machine or after a reboot. **Recommend `git checkout -- ProphetsWay.EFTools.sln`.** Do not commit this. |
| `ProphetsWay.EFTools` | `M ProphetsWay.Example` (submodule) | The pointer itself still reads `967fd26` — matching what is committed. The dirty marker comes from a modified `ProphetsWay.Example.DataAccess.csproj` **inside** the submodule, two levels down. Per convention, never edit files under `ProphetsWay.EFTools/ProphetsWay.Example/` — this should be reverted inside the submodule, not committed. |
| `ProphetsWay.Logger` | `?? AGENTS.md` + 7 modified `.cs` files | `AGENTS.md` is sync output, previously untracked. The 7 `.cs` files (+107/−40) predate this session and are **unexplained** — `Logger.cs`, `Generics/Logger.cs`, `LoggingDestinationCore.cs`, three `LoggerDestinations/*`, and `FileDestinationTests.cs`. |
| `ProphetsWay.Utilities` | `?? AGENTS.md` | Sync output, previously untracked. |
| `ProphetsWay.Hasher` | `?? AGENTS.md` | Sync output, previously untracked. |

**Nothing was committed, staged, or pushed by this wrapup.** All of the above is the owner's call.

### Branch-state notes worth knowing before you type anything

- **`ProphetsWay.Example` is still checked out on `3.0.0-feature-update`** (`9a37ce0`). PR #19 was
  merged as a **squash**, so none of the branch's 8 commits are ancestors of `origin/main` —
  `git branch -d` will refuse it even though the content shipped. Local `main` is also stale at
  `967fd26`; `origin/main` is `105b3be`. Expect to `git switch main && git pull` and then delete the
  branch with `-D`.
- `ProphetsWay.Utilities` and `ProphetsWay.Hasher` are on **`master`**, not `main`. Not drift to
  fix tonight, but it will bite a script that assumes `main`.

## Decisions Made This Session

| Decision | Rationale | Filed at |
|---|---|---|
| **New TFM standard: LTS-only, `netstandard2.0` permanent, `net48` conditional per-repo, `net10.0` as the modern target.** Nine numbered rules. | .NET 8 and 9 both EOL 2026-11-10; .NET 10 is current LTS. `netstandard2.0` reaches .NET Framework 4.6.1+ *and* .NET 8/9, so dropping those targets strands nobody. | ✅ `prophets-pipelines/conventions/AGENTS.shared.md` → Target Frameworks, committed `ed47c53`; synced into six repos (uncommitted) |
| **Adding a TFM is a MINOR bump, never a patch.** | A new target silently repoints an existing consumer to a *different assembly* — different compilation, different BCL bindings, no netstandard shims. A patch must be safe to take unread. | ✅ same file, rule 9 |
| **BaseDataAccess drops `net48` from the library but keeps it in the tests.** | Evidence, not preference: zero `#if` directives across 11 source files, zero package references, and `netstandard2.0`/`net48` both pinned at C# 7.3 — the two assets were the same compilation. The test leg stays because it is the only cover for the `Activator.CreateInstance<T>()` / `TargetInvocationException` path in `BaseDataAccessHelper`. | ✅ `ProphetsWay.BaseDataAccess/CHANGELOG.md` → `# v3.1.0` |
| **`windows-latest` ships a .NET 10 SDK; no `UseDotNet@2` step is needed.** | Open question at the time; settled empirically by build `3.1.0.489` going green. | ⚠️ **Recorded only here.** Consider folding into `prophets-pipelines/README.md` when item 4 is worked. |
| **Rejected the `copilot-pull-request-reviewer` comment on `[InlineData(new object[] { null })]`.** | The reviewer had it backwards. `new object[] { null }` is the correct idiom for a single null argument; the suggested `[InlineData(null)]` binds a null *array*, not a null *element*, and would break the only null-id row. Reply drafted on the thread. | ✅ PR #19 thread (merged) |
| **EFTools consumes Example as a git submodule pinned at `967fd26` — not a vendored copy.** Corrects a factual error that had been in `AGENTS.md`. | The two therefore *cannot* drift; the real consequence is a coordination requirement, not duplication. | ✅ `ProphetsWay.Example/AGENTS.md` → Known Deviations #1 (uncommitted) |
| Example 3.0.0 build/test verification banner corrected from "NOT PERFORMED" to the green CI run `3.0.0.486`. | The banner was stale and would have re-triggered a redundant verification pass. | ✅ `ProphetsWay.Example/docs/repo-profile.md` (shipped in PR #19) |

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| **xunit v3 migration** | **Blocked by a shared-pipeline defect, not by migration cost.** The migration is trivial: **0 source lines, 3 csproj lines**. The suite is 100% Shouldly, no fixtures, no `ITestOutputHelper`, one `Theory`, one `Record.Exception`; `xunit.v3` 3.2.2 supports net472+ so `net48` is fine. Proven on a scratch probe: 9/9 on both TFMs, trait filtering and coverage both working. **The blocker:** `prophets-pipelines/steps/restore-build-test.yml` uses `VSTest@2` with glob `**\*test*.dll`. xunit v3 requires `<OutputType>Exe</OutputType>`, and on `net48` that emits **no `.dll`** — so the `net48` leg would disappear with a green build, ~115 fewer tests, and the `Activator.CreateInstance<T>()` path uncovered. `net10.0` still emits a `.dll` and keeps running, which is exactly what makes the failure silent. | Item 4 lands |
| `net48` in the BaseDataAccess **test** project | Deliberately retained against the general "trim targets" instinct. It is the only leg that verifies .NET Framework exception-wrapping behavior. | Never, while that code path exists |
| `ProphetsWay.BPA` joining the conventions set | No `AGENTS.md`; the sync prompt forbids creating one. | Owner decides |
| Example's `<NullableContextOptions>` spelling | Inert either way at C# 7.3. Cosmetic, but misleading in a repo meant to be read. | Item 3 or Item 6 |

**Also learned, and easy to lose:** `Microsoft.NET.Test.Sdk` is still required under xunit v3
unless you opt into `TestingPlatformDotnetTestSupport`. Without it, `dotnet test` quietly degrades
to a build and **exits 0 having run nothing**.

## Recent Sessions

### 2026-08-12 → 13

Shipped Example 3.0.0 (PR #19 merged, tagged `3.0.0`) after a `Repo Analyst` pass that produced the
repo's first `docs/repo-profile.md` and corrected the EFTools-submodule claim in `AGENTS.md`;
`Code Reviewer` rejected the one outstanding bot review comment as backwards. Rewrote the TFM
standard in `conventions/AGENTS.shared.md` — LTS-only, nine rules — and applied it to
BaseDataAccess as 3.1.0 (`net-10-update` pushed, PR #39 open, CI green). Assessed xunit v3 and
deferred it on discovering that the shared `VSTest@2` glob would silently drop the `net48` test leg.
Closed by running `/sync-agents-md` into all six consuming repos.
