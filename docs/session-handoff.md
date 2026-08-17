---
written: 2026-08-17T01:30:00
head:
  prophets-pipelines: ccfdfc9              # main — dirty: this file
  ProphetsWay.EFTools: 8e78b94             # branch 3.0.0-first-pass — dirty: docs/feature-requests.md
  ProphetsWay.Example: 8493130             # branch 3.1.1-eftool-findings — dirty: CHANGELOG.md, README.md
  ProphetsWay.BaseDataAccess: 207c5de      # main — clean
  ProphetsWay.Logger: 86568fd              # main — untracked AGENTS.md
  ProphetsWay.Utilities: 5095e5e           # master — untracked AGENTS.md
  ProphetsWay.Hasher: d1410ca              # master — untracked AGENTS.md
  ProphetsWay.BPA: 4c0ba1f                 # main — empty repo, clean
status: fresh
---

# Session Handoff

## Where We Are

`ProphetsWay.EFTools` **3.0.0 first pass**, Stage 3, between laps 2 and 3. The build is green, the
disposal and transaction contracts are implemented, and the upstream test suite is discoverable from
EFTools' own assembly — but **it is pointed at the wrong implementation**, and one owner-run merge is
what unblocks everything else.

`ProphetsWay.Example` carries an unreleased **3.1.1** line on `3.1.1-eftool-findings` whose only job is
to hand EFTools that seam. `ProphetsWay.BaseDataAccess` and `prophets-pipelines` are stable and were
touched only for documentation corrections.

## ⚠️⚠️ THE TRAP — read before running or believing any EFTools test result

**`ProphetsWay.EFTools.Tests` contains thirteen `EF*Tests.cs` discovery adapters that compile,
discover the upstream suite, and will run it against the NoDB *in-memory* implementation — and PASS.**
Verified at wrapup: the thirteen files are on disk, `TestSeam.cs` is **not**.

**A green `dotnet test` on `ProphetsWay.EFTools` right now means nothing about Entity Framework.**
This is the hole `TestDataAccessFactory.Use`'s own XML documentation names — *"a consumer that never
calls `Use` runs green and proves nothing."* Nobody may read a passing EFTools suite as evidence of
anything until `TestSeam.cs` is wired.

## 🔴 THE BLOCKER — the seam is not in the code EFTools compiles against

`ProphetsWay.EFTools.Tests` project-references the **submodule** copy of `ProphetsWay.Example.Tests`.
Re-verified at wrapup:

- `git submodule status` → **`d845863 (3.1.0)`**
- `ProphetsWay.Example` `main` → **`d845863`**
- `TestDataAccessFactory.Use` exists only on **`3.1.1-eftool-findings`** @ **`8493130`**
  (confirmed at `ProphetsWay.Example.Tests/TestDataAccessFactory.cs` line 148, behind a first-use
  latch over the `_implementation` field at line 59)

Writing `TestSeam.cs` today yields `CS0117`. **`Implementer` correctly stopped rather than write it.**

`TestSeam.cs`, drafted and ready — the expression is verified against
`ProphetsWay.EFTools.Tests/Constants.cs`, which exposes `GetExampleDataAccess` (15 lines,
brace-balanced after the splice repair):

```csharp
[ModuleInitializer]
internal static void PointTheSuiteAtEntityFramework()
{
	TestDataAccessFactory.Use(() => Constants.GetExampleDataAccess);
}
```

> **Not a D11 violation.** D11 defers *tagging and releasing* `ProphetsWay.Example`; advancing the
> pointer so EFTools can consume in-progress work is a different act, and D11's premise silently
> assumed the submodule could see that work. **Filed at wrapup** into
> `ProphetsWay.EFTools/docs/feature-requests.md` § *Release Ordering — D11*, as a clarification that
> changes no status.

## Current Focus

Unblocking the seam so the first honest red phase can run. Everything in *Next Session* is downstream
of step 1.

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | Merge Example `3.1.1-eftool-findings` → `main` (PR prepared); then `git submodule update --remote ProphetsWay.Example` in EFTools; rebuild | **Owner** | Nothing downstream can move. Not a D11 violation — see above |
| 2 | Write `TestSeam.cs` (drafted above) into `ProphetsWay.EFTools.Tests` | `Implementer` | Closes THE TRAP. Until it lands, a green suite is meaningless |
| 3 | **The first honest red phase** — run the suite against Entity Framework | `Test Designer` / owner | It will fail on **11 `NotImplementedException` stubs** (8 `IDepartmentDao`, 3 `ICompanyResourceDao`) and **two unmapped entities**. **Expect a large red; that red is the point** |
| 4 | Lap 3 — the **hand-written `DepartmentDao`** (owner decision **D13**) | `Implementer` | Verified against `DepartmentDaoTests`' **40 `Contract`** tests |
| 5 | Map `Department` and `CompanyResource` in `ExampleContext` | `Implementer` | Model building fails at runtime the moment anything materializes the model |
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
| 1 | **What version number does Example's line carry at tag time?** `app-variables.yml` reads `3`/`1`/`1` — a **patch**. But `Use` is new public API (minor floor), and the IDENTIFIER and ROW COUNT rules were **restated on five further DAO interfaces**, tightening a contract on implementers (arguably major). **An implementation conforming to the 3.1.0 text can be non-conforming to this one without changing a line.** The line is unreleased so the number is still open — settle it deliberately at tag time rather than discover it after. Note this is a question **before the tag, not before the merge**; step 1 above does not wait on it | Example's tag; the D11 sequence | 08-16 |

## Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
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
| `TestSeam.cs` | **Drafted, not on disk** — blocked on the submodule advance | text above |
| 13 discovery adapters | Committed in `8e78b94`, empty bodies, **will pass against NoDB — see THE TRAP** | `ProphetsWay.EFTools.Tests/EF*Tests.cs` |
| `BaseEFDataAccess<TContext>` | Committed, **compiles green, never executed against a database** | `ProphetsWay.EFTools/BaseEFDataAccess.cs` |
| 11 `NotImplementedException` stubs | Untouched, verified by count | `ProphetsWay.Example.DataAccess.EF/ExampleDataAccess.cs` |
| `docs/api-contract.md` | **Revision 8, *under review*** — J1–J10 folded in place; **no pass has run against the text as it now stands** | `ProphetsWay.EFTools/docs/` |
| Example 3.1.1 CHANGELOG + README | Written, **uncommitted** | `ProphetsWay.Example` |
| Example PR `3.1.1-eftool-findings` → `main` | Owner reports it prepared; branch is pushed to `origin` | GitHub |

## Uncommitted Changes

**Re-read at wrapup, not assumed.**

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.Example` @ `8493130` | `CHANGELOG.md` (+181), `README.md` (+150/−38) | The v3.1.1 entry and the README corrections. **Expected — this is the PR content.** |
| `ProphetsWay.EFTools` @ `8e78b94` | `docs/feature-requests.md` | The D11 clarification filed by this wrapup. Nothing else. |
| `prophets-pipelines` @ `ccfdfc9` | `docs/session-handoff.md` | This file. |
| `ProphetsWay.Logger` @ `86568fd` | `AGENTS.md` **untracked** | Corrected this session, then out of scope when the owner narrowed to four repos. Commit-ready. |
| `ProphetsWay.Utilities` @ `5095e5e` | `AGENTS.md` **untracked** | Same. |
| `ProphetsWay.Hasher` @ `d1410ca` | `AGENTS.md` **untracked** | Same — **and this one carried a live hazard, see Decisions below.** |

`ProphetsWay.BaseDataAccess` (`207c5de`) and `ProphetsWay.BPA` (`4c0ba1f`, an empty repo — `.git` and
`.gitignore` only) are clean. **Nothing here looks accidental.** Committing is the owner's call.

## Decisions Made This Session

**Thirteen owner decisions and rulings.** Each is already in a permanent home; this is an index, not a
restatement.

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

- **No new test file in `ProphetsWay.EFTools.Tests`** beyond the thirteen discovery adapters and
  `TestSeam.cs`. Local assertions are shape A through the back door, and **D10 committed to shape B**.
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

## ⚙️ Tooling Constraint That Shaped the Entire Session

**No terminal tool in the working session.** No agent could run `git`, `dotnet build` or `dotnet test`;
**the owner ran every command.** Two agents **correctly stopped rather than guess** — one refusing to
invent an EF Core version, one refusing to reconstruct a destroyed obligation from context. Both
refusals were right, and both are the reason the day's measured claims are trustworthy.

(This wrapup did have a terminal and re-derived all eight HEADs, branches, `git status --short`,
`git submodule status`, the obligation counts and the test-file inventory directly.)

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
