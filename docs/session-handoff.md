---
written: 2026-08-14T00:20:00
head:
  prophets-pipelines: 5df6e21
  ProphetsWay.BaseDataAccess: cce91be
  ProphetsWay.Example: 105b3be
  ProphetsWay.EFTools: f95caa5
  ProphetsWay.Logger: 86568fd
  ProphetsWay.Utilities: 5095e5e
  ProphetsWay.Hasher: d1410ca
  ProphetsWay.BPA: 4c0ba1f
status: fresh
---

# Session Handoff

Every claim below was verified against `git` at write time. Where the owner's sign-off notes and the
repository disagreed, the repository won and the discrepancy is called out.

## Where We Are

**`ProphetsWay.BaseDataAccess` 3.1.0 is shipped.** PR #39 **merged** — squash commit `cce91be`,
*"retarget the library to netstandard2.0 and net10.0 (#39)"*, on `main`, pushed, and tagged
**`3.1.0`** and **`3.1.0-495.Beta`** on the remote. The working tree is clean. The `net-10-update`
branch no longer exists locally.

**The shared pipeline is fixed and released.** `prophets-pipelines` `5df6e21` replaced `VSTest@2`
with `dotnet test`, so every TFM leg now actually runs. That commit is on `main` and pushed.

The next repo is **`ProphetsWay.Example`**, and its retarget is now a live CI problem rather than a
cosmetic one — see **Next Session**.

## 🚨 The Headline Finding — `net48` test legs were never running in CI

`VSTest@2` resolves a **single** `/Framework` per run and silently skips assemblies built for any
other TFM, while still reporting the build green. Confirmed empirically: the BaseDataAccess PR build
reported **115 tests where 230 existed**. Exactly one leg ran, so the `net48`
`Activator.CreateInstance<T>()` regression guard had never executed.

Fixed by `DotNetCoreCLI@2 command: test`, which invokes each target framework separately.

**The consequence that outlives the fix:** any "green" build on any repo, on any date before
`5df6e21`, covered one TFM leg. Do not treat historical CI green as evidence of multi-TFM health.

## Current Focus

Nothing in flight. The session closed at a clean boundary: BaseDataAccess shipped, pipeline shipped.

## Next Session — Start Here

Owner's stated order: **Example → EFTools → Logger.**

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **`ProphetsWay.Example` — retarget.** Tests `net48;net8.0;net9.0` → `net48;net10.0`; both DAL projects `netstandard2.0;net48;net8.0;net9.0` → `netstandard2.0;net10.0` | `Modernizer` | **Urgent, not cosmetic.** With `dotnet test` the pipeline now attempts all three legs where VSTest ran one, requiring .NET 8 *and* 9 runtimes on the agent. This is a live CI failure waiting on the next build. |
| 2 | `ProphetsWay.Example` — `docs/repo-profile.md` refresh, `docs/purpose-and-scope.md` **create** | `Repo Analyst`, `Purpose Refiner` | Follows the BaseDataAccess pattern. `purpose-and-scope.md` does not exist here; `repo-profile.md` does. |
| 3 | `ProphetsWay.Example` — README | `README Author` | Teaching artifact. Lead with the swap-the-DAL demonstration, not a project listing. |
| 4 | Fix the stale "TFM reference" claim in `ProphetsWay.Example/AGENTS.md` | `Repo Analyst` | It still tells a future agent to copy Example's TFM list, which is now the superseded one. Actively harmful guidance. |
| 5 | `ProphetsWay.EFTools` — take up as a **modernization project**, not a pointer bump | `Modernizer` + owner | Submodule pinned at `967fd26` (2025-04-23, pre-3.0.0). `<RepositoryType>GitHub</RepositoryType>` still there. TFMs `net461;net471;net48;net80;net90`. |
| 6 | `ProphetsWay.Logger` — discard the 7 modified `.cs` files, then work through interactively | owner | See hazards. **One of the seven is a test file.** |
| 7 | Commit the `AGENTS.md` files sitting untracked in five repos | owner | Verified propagated and current — just never added to git. |

### Differences to expect in `ProphetsWay.Example` — recorded so tomorrow does not rediscover them

1. **Example is not published.** No packaging-metadata pass. Its `<PackageId />`, `<RepositoryType />`
   etc. are **deliberately empty and must stay empty** — recorded as a correct non-deviation in its
   `AGENTS.md`. Verified: both DAL csprojs carry `<RepositoryType />` as an empty stub.
2. **EFTools pins Example as a submodule** at a pre-3.0.0 commit. Moving Example does not break
   EFTools, but it widens the gap to close when EFTools is taken up.
3. `docs/purpose-and-scope.md` **does not exist**; `docs/repo-profile.md` does. Verified on disk.
4. Example partitions its suite by a **`Scope` trait** (`Contract` / `Characterization` /
   `Dispatcher`). The new pipeline filter deliberately uses **`Requires`** to avoid colliding with it.
5. Example's README angle differs — teaching artifact, not library.

## Open Questions — Blocking

None. Every question that blocked work last session is resolved or has been converted into a task.

## Open Questions — Non-Blocking

| # | Question | Notes |
|---|---|---|
| 1 | Where does `[Trait("Requires", "LocalDb")]` need applying? | **Verified: the trait exists nowhere in the workspace — zero occurrences across all repos.** The new pipeline filter `--filter "Requires!=LocalDb"` therefore currently excludes nothing. Most likely home is EFTools, whose `app-variables.yml` sets `LocalTestsOnly: 'yes'`. Until the trait is applied the filter is inert — harmless, but not yet doing the job it was written for. |
| 2 | Entry 8 (Source Link) rests on an unverified premise | `Microsoft.SourceLink.*` with `PrivateAssets="all"` may **not** create a package dependency, and SDK 8+ has Source Link built in. Re-check before the deferral hardens into a rule. Recorded in the entry itself. |
| 3 | `ProphetsWay.BPA` has **no `AGENTS.md`** | Verified. The sync prompt forbids creating one. Does BPA join the convention set or stay outside it? |
| 4 | `ProphetsWay.Utilities` and `ProphetsWay.Hasher` are on **`master`**, not `main` | Not worth fixing on its own, but it will bite any script that assumes `main`. |
| 5 | The agent roster in `%APPDATA%\Code\User\prompts` is **not version controlled** | Verified: no `.git`. The only versioned copies are the mirrors in `prophets-pipelines/conventions/toolbelt/`, which are tracked and current. Sync direction is prompts → toolbelt; nothing enforces it. |

## In Flight

**Nothing.** Every workstream this session reached a committed, pushed, terminal state. The only
loose material in the workspace is uncommitted files belonging to prior sessions or to work the
owner intends to discard — see below.

## Uncommitted Changes

Verified with `git status --porcelain` per repo at write time.

| Repo | Files | Description |
|---|---|---|
| `prophets-pipelines` | `M docs/session-handoff.md` | This file. Everything else in the repo is committed and pushed. |
| `ProphetsWay.BaseDataAccess` | **none — clean** | 3.1.0 fully landed. |
| `ProphetsWay.Example` | `M AGENTS.md` (+54/−15) | Shared-block sync output. Expected, wanted, needs committing. |
| `ProphetsWay.EFTools` | `?? AGENTS.md` | Sync output, **untracked** — needs `git add`, not just commit. |
| `ProphetsWay.EFTools` | `M ProphetsWay.Example` (submodule) | 🚩 The pointer still reads the committed `967fd26`; the dirty marker is a **modified `ProphetsWay.Example.DataAccess.csproj` *inside* the submodule**, which `AGENTS.md` forbids. **Discard from inside the submodule.** |
| `ProphetsWay.Logger` | `?? AGENTS.md` | Sync output, untracked. |
| `ProphetsWay.Logger` | **7 modified `.cs` files (+107/−40)** | Abandoned refactor the owner intends to **discard**. ⚠️ **One of them is a test file — `ProphetsWay.Logger.Test/FileDestinationTests.cs` (+25).** Do not salvage; do not let a later agent read it as intended behavior. |
| `ProphetsWay.Utilities` | `?? AGENTS.md` | Sync output, untracked. |
| `ProphetsWay.Hasher` | `?? AGENTS.md` | Sync output, untracked. |
| `ProphetsWay.BPA` | **none — clean** | No `AGENTS.md` exists here at all. |

**Nothing was committed, staged, or pushed by this wrapup.** All of the above is the owner's call.

### Corrections to the checkpoint's uncommitted list

- The `M ProphetsWay.EFTools.sln` entry — 70 lines registering a `V3Probe` project under `%TEMP%` —
  **is gone.** It was reverted during the session. Do not go looking for it.
- `ProphetsWay.BaseDataAccess` was listed as three dirty files. All three shipped in PR #39.

## Decisions Made This Session

| # | Decision | Rationale | Filed at — **verified present** |
|---|---|---|---|
| 1 | **Entry 7, rollback-failure observability — REJECTED.** Not deferred. | Owner: implementers should build their own error handling around it. Reopening needs a new argument. | ✅ `ProphetsWay.BaseDataAccess/docs/feature-requests.md` § 7, status `Rejected`. Committed. |
| 2 | **Entry 6, transaction split — OPEN, rewritten to the owner's design.** | He **rejected** the original motivation ("non-transactional stores are forced to lie") — he cannot think of a real database implementation that would not want transactions. He **accepted the shape**: a separate `IBaseAccessWithTransactions`; `BaseDataAccess` would not implement it and would stop declaring three abstract members; a consumer's DAL implements them as interface members rather than overrides. Still v4, still binary-breaking. | ✅ same file § 6, *"Scheduled for a possible v4"*, with the rejected and accepted motivations recorded separately. Committed. **Supersedes the checkpoint's "SHELVED" wording — it is not shelved.** |
| 3 | **Entry 1, conformance kit — DEFERRED, explicitly not rejected.** | Revisit after EFTools is updated, possibly after BPA. **Sibling package only** (`ProphetsWay.BaseDataAccess.Conformance`) — never inside the contracts package, which would destroy its zero-package-reference property. | ✅ same file § 1. Committed. |
| 4 | **Entry 8, Source Link — DEFERRED.** | No project dependency for now. The unverified counter-premise is recorded in the entry rather than lost. | ✅ same file § 8. Committed. |
| 5 | **Entry 9, improve the `DataAccessConventionException` message — NEW, `Proposed`.** | Behaviour change, so **3.2.0 at the earliest**. ⚠️ **Mandatory sequencing: `Test Designer` updates the three `ShouldContain` assertions first, then `Implementer` changes the message.** Reversing that order is exactly the failure mode where an agent edits a test to make an implementation pass. | ✅ same file § 9 + Release Eligibility table. Committed. |
| 6 | **`feature-requests.md` ownership model — implemented.** Shared append; **only `Purpose Refiner` changes status**; nothing deleted; never renumbered. | A proposal (entry 6) had outlived its evidence and nobody noticed. | ✅ `AGENTS.shared.md` → Rules for Agents, propagated to all six sibling `AGENTS.md`. |
| 7 | **`Pipeline Engineer` agent created**; **`Test Designer`** gained terminal access plus a rule never to weaken an assertion to make a test agree with observed behaviour. | No agent in the roster could write pipeline YAML — that gap blocked the headline fix for a full session. | ✅ `conventions/toolbelt/ops-a-pipeline-engineer.agent.md` and `tdd-a-test-designer.agent.md`, both tracked in git. |
| 8 | **`<RepositoryType>` is `git`, not `GitHub`, everywhere published.** | `GitHub` is not a valid repository type value. | ✅ `conventions/AGENTS.shared.md` line 121, committed in `5df6e21`. **Verified propagated** — all six sibling `AGENTS.md` files carry `<RepositoryType>git</RepositoryType>`, regenerated 2026-08-13 23:43. |
| 9 | **Build once and promote.** `dotnet pack` no longer implies a build. | The pipeline previously compiled four times and shipped three separately-compiled binary sets. | ✅ `steps/package-artifacts.yml` — `configuration: 'Release'`, `nobuild: true`. Committed. |

### ⚠️ Consequence worth stating plainly

`--configuration Release` was absent from both build and pack until `5df6e21`. **Every NuGet package
published from this pipeline before that commit was a Debug build.** BaseDataAccess `3.1.0` /
`3.1.0-495.Beta` is the first Release-configuration package. If any prior release needs to be
described or re-cut, that is the reason.

## What Shipped — verified against git

**`prophets-pipelines` @ `5df6e21`** — one commit, four files:

| File | Change |
|---|---|
| `steps/restore-build-test.yml` | `VSTest@2` → `DotNetCoreCLI@2 command: test`; added `--configuration Release` and `--no-build`; replaced the dead `testFilterCriteria: 'Collection!="pipeline-skip"'` (`Collection` is not a property the xunit adapter surfaces) with `--filter "Requires!=LocalDb"`. The build step also now passes `--configuration Release`. |
| `steps/package-artifacts.yml` | `configuration: 'Release'`, `nobuild: true`. |
| `stages/ci-build.yml` | Release-notes script hardened — five unguarded assumptions, notably `GetElementsByTagName("PackageReleaseNotes")[0]` with no null guard, and a multi-match `Get-ChildItem` that could concatenate two csproj files into malformed XML. |
| `conventions/AGENTS.shared.md` | `<RepositoryType>` `GitHub` → `git`. **Confirmed applied** — it was pending at checkpoint; it landed in this commit. |

**`ProphetsWay.BaseDataAccess` 3.1.0 @ `cce91be`** — merged, pushed, tagged:

- `docs/repo-profile.md` created; `docs/purpose-and-scope.md` refreshed with a scope-gate section and
  a re-verification that **no NuGet extraction candidate clears the bar** — so
  `docs/nuget-extraction-proposal.md` deliberately does not exist. That is a recorded decision, not a
  ledger gap; do not report it as missing.
- XML `<remarks>` corrected in four files — `IBaseIdEntity.cs`, `DataAccessConventionException.cs`,
  `BaseDataAccess.cs`, `IBaseDataAccess.cs`. `IBaseIdEntity<T>` falsely claimed that implementing the
  interface *"satisfies the fallback"*; an **explicit** implementation compiles to a non-public,
  interface-qualified property, so neither the `{TypeName}Id` nor the `Id` lookup finds it. The docs
  were also silent on the identifier property needing to be **public** while stressing that a
  non-public *setter* is fine. **Documentation only — no behaviour change.**
- One characterization test added (`Wraith` entity) pinning that behaviour. Suite **115 → 116 per
  TFM, 232 executions**, verified in Debug and Release.
- csproj: `<PackageProjectUrl>` and `<Copyright>` populated; `<RepositoryType>` `GitHub` → `git`.
- README, CHANGELOG, `AGENTS.md`, repo-profile, purpose-and-scope all corrected to 116/232.
- `app-variables.yml` reads `Major: '3' / Minor: '1' / Patch: '0'`. Library TFMs
  `netstandard2.0;net10.0`; tests `net48;net10.0`.

> Local tags are behind the remote — `3.1.0` and `3.1.0-495.Beta` exist on `origin` but are not
> fetched locally. `git fetch --tags` when convenient.

## Hazards for Next Session

| # | Hazard | Detail |
|---|---|---|
| 1 | **`ProphetsWay.Logger` CI will go red on its next build** | Four of its eleven test TFMs — `netcoreapp2.1`, `netcoreapp3.1`, `net50`, `net60` — have no runtime on `windows-latest`. `VSTest@2` hid this by running one leg. **Known and accepted.** Fix by trimming the TFM list (`Modernizer`) — **never** by reverting the template. |
| 2 | **`ProphetsWay.Example` CI is the same failure, sooner** | `net48;net8.0;net9.0` in the test project needs .NET 8 *and* 9 runtimes on the agent. This is why task 1 is first. |
| 3 | **`/sync-agents-md` exited code 1** | It was run from the `ProphetsWay.BaseDataAccess` directory rather than `prophets-pipelines`. **Verified: the shared block did propagate anyway** — all six sibling `AGENTS.md` files were regenerated at 2026-08-13 23:43 and all carry the `RepositoryType` correction. The exit code is a **prompt/working-directory bug worth fixing**, not stale content. Run it from `prophets-pipelines` next time. |
| 4 | **The `ProphetsWay.Example` submodule inside EFTools is dirty** | A csproj modified *inside* the submodule, which `AGENTS.md` forbids. Discard it from within the submodule before touching EFTools. |
| 5 | **`[Trait("Requires", "LocalDb")]` exists nowhere** | Zero occurrences workspace-wide. The new filter excludes nothing until it is applied. |
| 6 | **Logger's uncommitted diff includes a test file** | `FileDestinationTests.cs`, +25. An agent that reads it as current intent will draw the wrong conclusion about Logger's behaviour. |

## Punch List — verified read-only survey

`<RepositoryType>` across every non-`bin`/`obj` csproj:

| Project | Value | Action |
|---|---|---|
| `ProphetsWay.BaseDataAccess` | `git` | ✅ done |
| `ProphetsWay.EFTools` | **`GitHub`** | ❌ fix — published |
| `ProphetsWay.Logger` | **`GitHub`** | ❌ fix — published |
| `ProphetsWay.Hasher` | `<RepositoryType />` | ❌ empty stub — published; needs the full metadata pass |
| `ProphetsWay.Utilities` | `<RepositoryType />` | ❌ empty stub — publication status unclear; settle purpose first |
| `ProphetsWay.Example.DataAccess`, `.NoDB` | `<RepositoryType />` | ✅ **leave empty — deliberate.** Not published. |

Guidance now lives in `conventions/AGENTS.shared.md` and is propagated to every repo.

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| **xunit v3 migration** | Trivial in code — 0 source lines, 3 csproj lines, proven on a scratch probe (9/9 both TFMs, traits and coverage working). It was blocked by the `VSTest@2` glob: xunit v3 needs `<OutputType>Exe</OutputType>` and on `net48` emits no `.dll`. **That blocker is now removed** by the move to `dotnet test`. The deferral is now a scheduling choice, not a technical one. ⚠️ **Do not lose this:** `Microsoft.NET.Test.Sdk` is still required under xunit v3 unless you opt into `TestingPlatformDotnetTestSupport` — without it, `dotnet test` quietly degrades to a build and **exits 0 having run nothing**. | After Example and EFTools are modernized |
| `net48` in the BaseDataAccess **test** project | Deliberately retained against the general "trim targets" instinct. It is the only leg verifying .NET Framework exception-wrapping, and as of `5df6e21` it actually runs. | Never, while that code path exists |
| Entry 1 — conformance kit (`ProphetsWay.BaseDataAccess.Conformance`) | Sibling package only — never inside the contracts package. | After EFTools is updated; possibly after BPA |
| Entry 8 — Source Link / `.snupkg` | Owner declined a project dependency for now; the premise is flagged for re-checking in the entry. | Next packaging pass |
| Entry 9 — exception message | Behaviour change; 3.2.0 earliest; **test assertions must move first**. | 3.2.0 |
| `ProphetsWay.BPA` joining the conventions set | No `AGENTS.md`; the sync prompt forbids creating one. | Owner decides |
| Example's `<NullableContextOptions>` spelling | Inert either way at C# 7.3 while `netstandard2.0` is in the TFM list. Cosmetic, but misleading in a repo meant to be read. | The Example docs pass |
| `GitHubConnectionName` threaded through the templates and then ignored | `create-github-release.yml` hardcodes the connection. Dead parameter. | Next pipeline pass |
| No consumer pins a `ref` of `prophets-pipelines` | All seven track the default branch, so a breaking template change hits everyone at once. `5df6e21` is the proof of the risk. | Owner decides |

## Recent Sessions

### 2026-08-13 → 08-14

Found and fixed the `VSTest@2` single-TFM defect — half of every test suite in the workspace had
never run in CI. Shipped `prophets-pipelines` `5df6e21`: `dotnet test`, Release configuration
everywhere, build-once-and-promote, hardened release-notes script, `RepositoryType` correction.
Shipped **BaseDataAccess 3.1.0** via PR #39 (`cce91be`, tagged): `netstandard2.0;net10.0`, four XML
`<remarks>` corrections around explicit interface implementation, one new characterization test
(116 per TFM / 232 executions). Triaged five feature-request entries to permanent status and
implemented the shared-append ownership model. Created the `Pipeline Engineer` agent, closing the
roster gap that had blocked the pipeline fix for a full session.

### 2026-08-12 → 13

Shipped Example 3.0.0 (PR #19 merged, tagged `3.0.0`) after a `Repo Analyst` pass that produced the
repo's first `docs/repo-profile.md` and corrected the EFTools-submodule claim in `AGENTS.md`;
`Code Reviewer` rejected the one outstanding bot review comment as backwards. Rewrote the TFM
standard in `conventions/AGENTS.shared.md` — LTS-only, nine rules — and applied it to
BaseDataAccess as 3.1.0 (`net-10-update` pushed, PR #39 open, CI green). Assessed xunit v3 and
deferred it on discovering that the shared `VSTest@2` glob would silently drop the `net48` test leg.
Closed by running `/sync-agents-md` into all six consuming repos.

