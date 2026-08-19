---
written: 2026-08-18T00:00:00
head:
  prophets-pipelines: 2aa3632              # main — dirty: this file
  ProphetsWay.EFTools: 699bde3             # branch 3.0.0-first-pass — dirty: submodule pointer, Constants.cs, 2 untracked
  ProphetsWay.Example: 61d9e7d             # main — clean; PR #21 merged (squash)
  ProphetsWay.BaseDataAccess: 207c5de      # main — clean
  ProphetsWay.Logger: 86568fd              # main — untracked AGENTS.md
  ProphetsWay.Utilities: 5095e5e           # master — untracked AGENTS.md
  ProphetsWay.Hasher: d1410ca              # master — untracked AGENTS.md
  ProphetsWay.BPA: 4c0ba1f                 # main — empty repo, clean
status: live
---

# Session Handoff

## Where We Are

`ProphetsWay.EFTools` **3.0.0 first pass**, Stage 3, **lap 3**, branch `3.0.0-first-pass`. THE BLOCKER
and THE TRAP that dominated the previous two sessions are both **cleared**, and the first honest
measurement of EF conformance in the history of this repo has been taken. `ProphetsWay.Example` PR #21
is merged to `main` and the repo is clean.

The cycle is now in the ordinary red phase, with one caveat: `Test Auditor` says the guard that makes
the red trustworthy is **not yet trustworthy itself**.

## ✅ THE BLOCKER — cleared

Owner merged `ProphetsWay.Example` `3.1.1-eftool-findings` → `main` as PR #21 (squash **`61d9e7d`**),
then ran `git submodule update --remote --init ProphetsWay.Example` in EFTools. Pointer moved
`d845863` → **`61d9e7d`**.

**Verified at checkpoint:** `git submodule status` → `+61d9e7dfb209… (3.1.0-1-g61d9e7d)`; the leading
`+` is the giveaway — **the pointer advance is staged in the working tree and has not been committed.**
`ProphetsWay.Example` `main` is at the same `61d9e7d`, clean.

Full solution build green: `dotnet build ProphetsWay.EFTools.sln -c Debug` — **0 warnings, 0 errors**,
all 10 project/TFM combinations including the `.sqlproj` dacpac. (Owner-run; recorded, not re-measured
here.)

## ✅ THE TRAP — disarmed, but the disarming device is unaudited

`Test Designer` created two files in `ProphetsWay.EFTools.Tests` — **both untracked, verified on disk
at checkpoint**:

| File | Contains |
|---|---|
| `TestSeam.cs` | `internal static class TestSeam`; `[ModuleInitializer]` method `PointTheSuiteAtEntityFramework()` calling `TestDataAccessFactory.Use(() => Constants.GetExampleDataAccess)`. A module initializer rather than a fixture because xUnit runs collections in parallel |
| `TestSeamTests.cs` | `public class TestSeamTests`, **3 guard `[Fact]`s** asserting the factory hands out `ProphetsWay.Example.DataAccess.EF.ExampleDataAccess` |

It also modified `Constants.cs`, appending **`TrustServerCertificate=True`** to the connection string —
SQL Server at localhost presents a self-signed cert and `Microsoft.Data.SqlClient` defaults
`Encrypt=true`. Without it **all 71 SQL tests failed identically at login**. `Test Auditor` reviewed and
endorsed it as the right fix in the right file. Verified at `Constants.cs` line 12, with the reason in a
comment on line 10.

## 📊 First real EF conformance measurement ever taken

`dotnet test ProphetsWay.EFTools.Tests` — **147 total · 53 passed · 94 failed.**

| Bucket | Count | Detail |
|---|---|---|
| `NotImplementedException` stubs | **92** | Across 10 reached throw sites. **62 are the single member `IDepartmentDao.Insert`**; 14 are `ICompanyResourceDao.Insert`; the rest 1–3 each across Department `GetCount`/`GetPaged`/`Get`/`Update`/`Delete`/`Restore` and CompanyResource `Delete`/`GetAll`. `IDepartmentDao.GetAll` is **never reached** — `Insert` throws first |
| **Genuine contract mismatches** | **2** | Both `NullReferenceException`, both `Scope=Contract`, both in `SnapshotDeepCopyTests`: `ShouldNotStoreEditsMadeToAUsersNavigationAfterInsertReturned` (line 249) and `ShouldGiveTwoUsersNamingOneCompanyTheirOwnCompanyInstances` (line 553) |
| Connectivity failures | 0 | |
| Isolation failures | 0 | **Measured**, not assumed — suite run twice back-to-back against the dirty DB, failing sets diffed by name, identical |

**The 2 are the first genuine contract finding of the cycle.** Root cause: EF `UserDao` returns a `User`
whose `Company`/`Job` navigations are null — no `Include`, and `NoTracking` prevents fix-up. NoDB
satisfies the snapshot rule for free; EF does not.

**Six DAO classes fully green against real SQL Server — never true before:** `EFCompanyDaoTests` 7/7,
`EFJobDaoTests` 5/5, `EFResourceDaoTests` 5/5, `EFTransactionDaoTests` 6/6, `EFUserDaoTests` 7/7,
`EFBaseDataAccessTests` 7/7.

**147 is correct, not a shortfall.** The 20 `Scope=Dispatcher` `ConventionShowcase` tests construct
their own deliberately mis-wired DALs and belong to no implementation: 164 − 20 = 144 upstream + 3
guard = **147**. `Test Auditor` verified the exclusion independently.

## ⚠️ `Test Auditor` verdict — GAPS TO CLOSE FIRST

**Would not pass the guard as-is. All eleven findings are outstanding and unfixed.**

| # | Sev | Finding | Proposed fix |
|---|---|---|---|
| F1 | **CRITICAL** | Guard asserts on `TestDataAccessFactory`; the 144 tests read `BaseUnitTests<T>._da`. **Nothing binds them.** If upstream reintroduces a `CreateDataAccess` virtual hook, the guard stays green while 144 tests revert to NoDB | Derive `TestSeamTests` from `BaseUnitTests<ICompanyDao>`, assert on `_da` |
| F2 | **CRITICAL** | `ShouldBeAssignableTo<BaseEFDataAccess<ExampleContext>>` is a **compile-time tautology** (test 1 implies it), and "EF-backed" is satisfiable by `.UseInMemoryDatabase(...)`. Both InMemory and Sqlite are already on the compile path — this reproduces the original false-green hazard one layer up | Assert `Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer"` |
| F3 | HIGH | Changing `=>` to `=` in `Constants.GetExampleDataAccess` — **one character** — yields one shared instance that guard test 1 disposes; all 3 guard tests still pass, all 144 real tests throw `ObjectDisposedException` | Assert fresh-instance-per-call and instance-is-usable |
| F4 | HIGH | `TestSeamTests` carries **no `[Trait("Scope",…)]`** — confirmed at checkpoint — so `--filter "Scope=Contract"`, the documented gate, omits it. `LocalTestsOnly: 'yes'` means CI never runs these, so the filtered human run is the **only** runner | Separate key `[Trait("Guard","Seam")]` |
| F5 | HIGH | With the seam present the Department/CompanyResource adapters cannot pass, so **deleting `TestSeam.cs` makes the run look dramatically better**. The guard's failure mode invites its own deletion | Custom failure messages that state the consequence |
| F6 | MEDIUM | `TestSeamTests` lacks `[Collection(TestCollections.SharedStore)]` — confirmed at checkpoint — so it runs concurrently with the shared-store collection. Harmless only while the guard touches no DB, and **every proposed strengthening changes that** | Add it now |
| F7 | MEDIUM | Nothing detects an upstream test class gaining no adapter. Submodule advances, upstream adds a class, no adapter, nothing red, **silently never runs against EF** | — |
| F8 | MEDIUM | Suite depends on an **undeclared external precondition** (SQL Server at localhost with a `ProphetsWay.Example` database); nothing creates, asserts, or names it | — |
| F9 | LOW | `Microsoft.EntityFrameworkCore.Sqlite` referenced in the test csproj for a certification leg that **does not exist**; unused | — |
| F10/F11 | NONE | Dispatcher exclusion correct; disposal handling correct | — |

**Also noted by the auditor:** `ProphetsWay.Example.Tests` is a project in `ProphetsWay.EFTools.sln`, so
a solution-wide `dotnet test` runs **164 unguarded NoDB tests alongside** this assembly's 147.

## Known-Outstanding Implementation Gaps

Reported, not fixed:

- `ExampleContext` maps **neither `Department` nor `CompanyResource`** — no `DbSet`, no `ToTable`, no
  soft-delete filter.
- **No `DepartmentDao` or `CompanyResourceDao` exist** in `ProphetsWay.Example.DataAccess.EF/Daos/`.

## Current Focus

**Hardening the seam guard before writing any implementation.** A second `Test Designer` pass to close
F1/F2/F3/F6/F7 — explicitly **not** `Implementer` yet. Hardening is cheap and everything downstream
rests on trusting the guard.

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Second `Test Designer` pass — harden the seam guard.** Close **F1, F2, F3, F6, F7** | `Test Designer` | Cheap, and every measurement after this one rests on the guard being trustworthy. **Not `Implementer` yet** |
| 2 | Decide the `Guard`/`Scope` trait question (F4) and add whichever key is chosen | Owner then `Test Designer` | The documented gate currently omits the guard entirely |
| 3 | Lap 3 — the **hand-written `DepartmentDao`** (owner decision **D13**) + map `Department` in `ExampleContext` | `Implementer` | Largest single win available: **~62 + 12 failures**. Verified against `DepartmentDaoTests`' 40 `Contract` tests. **Lap sizing not yet owner-approved** |
| 4 | Lap 4 — `CompanyResourceDao` + `CompanyResource` mapping | `Implementer` | ~17 failures. **Not yet approved** |
| 5 | Lap 5 — the navigation eager-loading fix for the 2 genuine contract mismatches | `Implementer` | The only non-stub failures in the run. **Not yet approved** |
| 6 | Check **A31**'s three version-sensitive surfaces against EF Core 10's real breaking-changes page | `Implementer` | Unblocked now that EF Core is pinned at `10.0.11` |

**Critical constraint, already proven — do not re-derive it.** `RootBaseSoftDao` **cannot** serve
`IDepartmentDao` by inheritance: it violates rules **1, 3, 5 and 6**, including `Update` silently
un-deleting a soft-deleted row by wiping the stored `DeletedDate`, and a second `Delete` refreshing the
timestamp and returning `1` instead of `0`. **"Just inherit the existing soft base" is a trap.**

**The keyless mapping question is settled: composite `HasKey` is the only viable answer.** `HasNoKey()`
makes the entity read-only and forbids the `Insert`/`Delete` `ICompanyResourceDao`'s contract requires.

## Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| 6 | **Harden the guard first, or accept it and proceed to `Implementer`?** `Vanguard`'s recommendation is harden first; `Test Auditor` says the guard would not pass as-is | The whole of lap 3 | 08-18 |
| 7 | **Lap size for `Implementer`.** Proposed: lap 3 = `DepartmentDao` + `ExampleContext` mapping (~62 + 12 failures), lap 4 = `CompanyResourceDao` (~17), lap 5 = the navigation eager-loading fix. **Not yet approved** | Sequencing of steps 3–5 above | 08-18 |
| 8 | **`Scope`/`Guard` trait on `TestSeamTests`** — omitted deliberately; the auditor suggests a **separate trait key** (`Guard=Seam`) rather than folding it into `Scope`, so the existing three-way `Scope` partition stays a clean sum | Whether `--filter "Scope=Contract"` remains a complete gate | 08-18 |

## Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
| 1 | **What version number does Example's line carry at tag time?** `app-variables.yml` reads `3`/`1`/`1` — a **patch**. But `Use` is new public API (minor floor), and the IDENTIFIER and ROW COUNT rules were **restated on five further DAO interfaces**, tightening a contract on implementers (arguably major). **An implementation conforming to the 3.1.0 text can be non-conforming to this one without changing a line. Downgraded from Blocking on 08-18** — the merge happened without settling it, so it no longer blocks anything, but it must be settled before Example is tagged | 08-16 |
| 2 | **SourceLink** — the owner wants it working before the NuGet deployment. Deviation 5's five missing properties (`PublishRepositoryUrl`, `EmbedUntrackedSources`, `IncludeSymbols`, `SymbolPackageFormat`, `ContinuousIntegrationBuild`) plus the `Microsoft.SourceLink.GitHub` reference. **Removing the `Submod` block stopped the warning; it did not deliver Source Link** — read Deviations 5 and 7 together or you will conclude it works | 08-16 |
| 3 | **A31's three version-sensitive EF Core surfaces** — `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys, `MultipleCollectionIncludeWarning`. Nobody in this session had a verifiable source **and nobody guessed** | 08-16 |
| 4 | Client-supplied `Guid` keys — `ProphetsWay.Example/…/ResourceDao.cs` line 48 | earlier |
| 5 | Whether to state hard-delete explicitly on the five silent DAOs | earlier |

## Environment Prerequisite

**The SQL Server `localhost` / `ProphetsWay.Example` database must exist** for the suite to run against
Entity Framework — this is why `LocalTestsOnly: 'yes'` is set. The connection string is in
`ProphetsWay.EFTools.Tests/Constants.cs`. **SQLite in-memory remains D4's future CI leg**; the provider
is already referenced by the test project at `10.0.11`.

## In Flight

| Item | State | Where |
|---|---|---|
| `TestSeam.cs` | **On disk, untracked.** `[ModuleInitializer]` verified at line 27 | `ProphetsWay.EFTools.Tests/TestSeam.cs` |
| `TestSeamTests.cs` | **On disk, untracked.** 3 `[Fact]`s verified; **no `[Trait]`, no `[Collection]`** — F4 and F6 confirmed by direct read | `ProphetsWay.EFTools.Tests/TestSeamTests.cs` |
| `Constants.cs` connection string | **Modified, uncommitted.** `TrustServerCertificate=True` verified at line 12 | `ProphetsWay.EFTools.Tests/Constants.cs` |
| Submodule pointer `d845863` → `61d9e7d` | **Staged, uncommitted** — `git submodule status` shows the leading `+` | `ProphetsWay.EFTools/ProphetsWay.Example` |
| 11 `Test Auditor` findings F1–F11 | **All outstanding, none fixed** | table above |
| 13 discovery adapters | Committed in `8e78b94`; now **actually running against Entity Framework** | `ProphetsWay.EFTools.Tests/EF*Tests.cs` |
| `BaseEFDataAccess<TContext>` | Committed, and **now executed against a real database** — `EFBaseDataAccessTests` 7/7 | `ProphetsWay.EFTools/BaseEFDataAccess.cs` |
| `NotImplementedException` stubs | Untouched. **10 throw sites reached, 92 failures** | `ProphetsWay.Example.DataAccess.EF/ExampleDataAccess.cs` |
| `ExampleContext` mappings for `Department` / `CompanyResource` | **Do not exist** | `ProphetsWay.Example.DataAccess.EF/` |
| `DepartmentDao` / `CompanyResourceDao` | **Do not exist** | `ProphetsWay.Example.DataAccess.EF/Daos/` |
| `docs/api-contract.md` | **Revision 8, *under review*** — J1–J10 folded in place; **no pass has run against the text as it now stands** | `ProphetsWay.EFTools/docs/` |

## Uncommitted Changes

**Re-read at this checkpoint from `git status --short` in every root, not assumed.**

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.EFTools` @ `699bde3` | ` M ProphetsWay.Example` (submodule pointer)<br>` M ProphetsWay.EFTools.Tests/Constants.cs`<br>`?? ProphetsWay.EFTools.Tests/TestSeam.cs`<br>`?? ProphetsWay.EFTools.Tests/TestSeamTests.cs` | The whole of this session's EFTools work. **Nothing here looks accidental.** Note the guard files are the ones `Test Auditor` says need a second pass — committing now commits a guard with 5 open CRITICAL/HIGH findings |
| `prophets-pipelines` @ `2aa3632` | `docs/session-handoff.md` | This file — the `status: consumed` stamp from this session's resume, plus this checkpoint |
| `ProphetsWay.Logger` @ `86568fd` | `AGENTS.md` **untracked** | Long-standing, unrelated. Commit-ready |
| `ProphetsWay.Utilities` @ `5095e5e` | `AGENTS.md` **untracked** | Same |
| `ProphetsWay.Hasher` @ `d1410ca` | `AGENTS.md` **untracked** | Same — **and this one carried a live hazard, see Decisions below** |

`ProphetsWay.Example` (`61d9e7d`, `main`), `ProphetsWay.BaseDataAccess` (`207c5de`) and
`ProphetsWay.BPA` (`4c0ba1f`) are **clean**. Example's previously-uncommitted CHANGELOG and README went
in with PR #21.

`ProphetsWay.BaseDataAccess` (`207c5de`) and `ProphetsWay.BPA` (`4c0ba1f`, an empty repo — `.git` and
`.gitignore` only) are clean. **Nothing here looks accidental.** Committing is the owner's call.

## Decisions Made — session of 2026-08-16 → 08-17

**Carried forward unchanged by the 08-18 checkpoint. Thirteen owner decisions and rulings.** Each is
already in a permanent home; this is an index, not a restatement.

| Ref | Substance | Filed in |
|---|---|---|
| **D11** | Release ordering — Example is tagged only after EFTools is green against it | `ProphetsWay.EFTools/docs/purpose-and-scope.md`, summarized in `docs/feature-requests.md` |
| **D11 clarification** | An interim submodule-pointer advance is not a D11 violation | `ProphetsWay.EFTools/docs/feature-requests.md` § *Release Ordering — D11* — **filed by this wrapup** |
| **D12** | Document the three shipped 2.2.0 defects rather than patch the 2.2.x line | `ProphetsWay.EFTools/docs/purpose-and-scope.md`, FR 3 and FR 12 |
| **D13** | `DepartmentDao` is hand-written, not inherited from `RootBaseSoftDao` | `ProphetsWay.EFTools/docs/purpose-and-scope.md`, FR 1 and FR 13 |
| **OD-8, OD-9, OD-11** | Contract-document decisions; **`OD-10` does not exist** — the lead conflated it with `D10` | `ProphetsWay.EFTools/docs/api-contract.md` |
| **Rule 18 narrowing** | `IDepartmentDao`'s UTC guarantee narrowed as a direct result of EF design work here | `ProphetsWay.Example/…/IDepartmentDao.cs`; cited in `api-contract.md` as present **from 3.1.1** |
| **J1 ruling** | **A `[C]` obligation may not depend on a certified-provider fact** | `api-contract.md`, plus a **mixed-traceability tie-breaker** added to the Scope notation |
| **J2 finding** | Two obligations were **verbatim duplicates**, so the preamble's integrity check had been counting two twice; **143 → 141**, a correction not a loss of coverage | `api-contract.md` |

**Code changes filed as closures:** FR 3's leaked `DbContext` (`Activator.CreateInstance` is gone) and
its disposal-guarding half; FR 12's silently no-opping transaction commit/rollback. **Deviation 8
closed** — all three enumerated breaks, by an owner-run `dotnet build`, SDK 10.0.400, 7 warnings,
0 errors.

**Documentation re-verified against source across all four in-scope repos**, producing three findings
that mattered more than the corrections themselves:

1. **`ProphetsWay.Hasher`'s `AGENTS.md` was instructing agents to make a binary-breaking namespace
   change** — undoing a deliberate v2.0.0 decision. **Corrected but still untracked.**
2. **`ProphetsWay.BaseDataAccess`'s behavioural-contracts index was missing an entire section** —
   CONVENTION-BASED DISPATCH, which explicitly states it is *not* a term of the contract.
   **The EFTools 3.x design was drafted off that index.**
3. **`ProphetsWay.Example`'s version line is 3.1.1** where three documents said 3.1.0, and its README
   named a test that does not exist.

## 🔑 The Lesson — carry this into every future documentation lap

**Three times in this session a revision log or status line asserted a correction the body did not
have** — Revision 7's F5 and F8, and Revision 8's `BaseSoftDao` overclaim. **Every one was caught only
by an independent read of the body, never by reading the claim.** Two **splice-duplication** defects
were also found — in `api-contract.md` and in `Constants.cs` — both from a botched find-and-replace
pasting a file header over live content.

The corruption that opened this session illustrates the same thing twice over: it was reported as one
site, **turned out to be seven**, and **the obvious recovery source was itself corrupt**. `56e6a66`
was identified as the commit that introduced the signature; `56e6a66^` was verified clean and used
instead. Recovery was a **merge, not a restore** — the clean copy predated Revision 7's F3–F8
corrections while the working file had them misplaced.

**The checks that caught these are now written into the artifacts rather than left as lessons someone
must relearn:** the obligation-sum integrity check (`123 + 10 + 8 = 141`, verified in the file at lines
178 and 3390), the mixed-traceability tie-breaker, and the `[C]`-must-trace-to-a-stated-rule discipline.

**A candidate for `conventions/AGENTS.shared.md` that was NOT applied:** a rule that a revision log
entry is not evidence its own correction landed. The shared block regenerates seven repos, so that is
an owner instruction, not a scribe's edit. Raising it here rather than doing it.

## Standing Guardrails

- **No new test file in `ProphetsWay.EFTools.Tests`** beyond the thirteen discovery adapters,
  `TestSeam.cs` and `TestSeamTests.cs`. Local assertions are shape A through the back door, and **D10
  committed to shape B**. `TestSeamTests.cs` is the seam's own guard, not a conformance test — the
  auditor's proposed strengthenings must keep it on that side of the line.
- **A green EFTools suite is now meaningful only while `TestSeam.cs` is on disk.** Per F5, deleting it
  makes the run look dramatically better. **Never delete it to reduce a red count.**
- **`UseQueryTrackingBehavior(NoTracking)` must be removed in the same lap that adds per-query
  `AsNoTracking()`** — not before, or every Example read silently becomes tracked.
- **Never edit anything under `ProphetsWay.EFTools/ProphetsWay.Example/`** — pinned submodule. Edit
  upstream and move the pointer.
- **`ConventionShowcaseTests` and `ExceptionPassthroughShowcaseTests` stay excluded** from the
  adapters: `Scope=Dispatcher`, they belong to `ProphetsWay.BaseDataAccess`, and their DALs are
  deliberately mis-wired and self-constructing.

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| `ProphetsWay.EFTools/README.md` documents types that no longer exist — `BaseEFDataAccess<TContextType, TIdType>`, `BaseEFContext(string)` | Stage 4 work; **the list is growing** | Stage 4 |
| Deviation 3 — remove the SQL Server and InMemory provider references from the published library | Breaking; needs the provider-neutrality lap. **`Microsoft.EntityFrameworkCore.InMemory` now has zero call sites**, which strengthens the case | The provider-neutrality lap |
| `xUnit1013` on the submodule's `DepartmentDaoTests.cs` lines 294 and 1001 | Upstream — a `Test Designer` fixes it **in `ProphetsWay.Example`**, never from the EFTools side | Next Example pass |
| The three corrected untracked `AGENTS.md` files | Out of scope once the owner narrowed to four repos | Owner's convenience |

## Also Noted

- **A seam call-site count was reported as 25 and is actually 29** (15 + 9 + 3 + 2). The original
  arithmetic was wrong and was caught on a recount; the design conclusion is unchanged.
- A `Test Designer` reported running an **invalid build probe that produced 280 spurious `CS0579`
  errors**; no source was modified and no residue remains. **Recorded because it was self-reported
  rather than hidden.**

## ⚙️ Tooling Constraint That Shaped the 08-16 → 08-17 Session

**No terminal tool in that working session.** No agent could run `git`, `dotnet build` or `dotnet test`;
**the owner ran every command.** Two agents **correctly stopped rather than guess** — one refusing to
invent an EF Core version, one refusing to reconstruct a destroyed obligation from context. Both
refusals were right, and both are the reason that day's measured claims are trustworthy.

**On 08-18 the owner again ran the build and the test suite**; the 147/53/94 figures above are
owner-measured and recorded here, not re-run by the scribe. This checkpoint did have a terminal and
re-derived every HEAD, branch and `git status --short`, plus `git submodule status` and the on-disk
contents of the three test files.

## Recent Sessions

### 2026-08-16 → 08-17

Opened as a routine resume to repair **one** corrupted obligation in `api-contract.md`; **it was seven,
and the recovery source was itself corrupt**, which redirected the day. Recovered by merge from
`56e6a66^`, then advanced to **Revision 8** through two `Contract Reviewer` passes — H1–H9, then a
delta review keyed **J1–J10**, all folded in place. Final: **141 obligations, `[C]` 123 / `[X]` 10 /
`[D]` 8**, still *under review*, nothing self-certified. **The build went green and Deviation 8
closed** (owner-run, SDK 10.0.400, 0 errors). Three shipped 2.2.0 defects closed in code;
`BaseEFDataAccess<TContext>` brought to the document's specification — `abstract`, sealed five-step
`Dispose`, `ThrowIfDisposed()`, seven guarded overrides, a real transaction state machine. The
**shape B seam** (`TestDataAccessFactory.Use`) designed and built in `ProphetsWay.Example`; thirteen
discovery adapters added to EFTools. **Thirteen owner decisions recorded.** Documentation re-verified
across four repos, catching an `AGENTS.md` that was **instructing a binary-breaking namespace change**
and a behavioural index **missing the section the 3.x design was drafted off**. Ends with the seam
**not wired** and a suite that would pass against the wrong implementation.

### 2026-08-15 → 08-16

Independently verified the whole `ProphetsWay.EFTools` Stage 2 output after the owner lost confidence
in the prior agent. **The evidence was sound; the self-assessment was not** — `Repo Analyst`
re-derived every Stage 1 count from source and all matched, but the "Stage 2 closed" status line had
been recorded at 19:50 against a file last written at 20:22. A fresh review returned **BLOCK**. Four
review cycles took the API contract from Revision 3 to **Revision 7** — 142 obligations, zero blocked
— **with every cycle catching a defect introduced by the one before it**. OD-1…OD-7 settled; EFTools
FR 12 filed and FR 3 extended; D7 recorded in `AGENTS.md`; submodule advanced to Example 3.1.0. In
`ProphetsWay.Example`, two DAL-wide rules added to `IExampleDataAccess` and **two new `Contract`
tests closing a gate hole — a cascading `Update` had been passing all 138 `Contract` tests**. Suite
now **164 / 328 — Contract 139, Characterization 5, Dispatcher 20**, green on both legs. Stage 3
scoped to **three fat laps**. Wrapup found a **committed corruption** in `api-contract.md` and a
status line never advanced.

### 2026-08-15

Completed the **`ProphetsWay.Example` 3.1.0** pass end to end — Stage 1 (`Modernizer` →
`Purpose Refiner` → `Repo Analyst`) and Stage 4 (`Changelog Author`, `README Author`), no Stage 2 or
3. PR #20 built green (`3.1.0.496`), confirming `windows-latest` carries the .NET 10 SDK and that
`HasSqlProj` → `VSBuild@1` builds the SDK-style `.sqlproj`; since merged at `d845863`, tagged
`3.1.0`, published. Caught three false README claims that had survived multiple documentation passes
because no agent opened the artifact behind them — now a rule in `AGENTS.shared.md`. Filed FR 9
(seed data, Deferred) and closed FR 6. Investigated 446 markdownlint warnings and set the work aside;
**the two config files that sign-off believed existed do not.**

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
BaseDataAccess as 3.1.0. Assessed xunit v3 and deferred it on discovering that the shared `VSTest@2`
glob would silently drop the `net48` test leg. Closed by running `/sync-agents-md` into all six
consuming repos.
