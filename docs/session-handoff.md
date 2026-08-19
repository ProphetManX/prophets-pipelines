---
written: 2026-08-18T23:00:00
head:
  prophets-pipelines: f28798c              # main — dirty: this file
  ProphetsWay.EFTools: a72b60b             # branch 3.0.0-first-pass — dirty: docs/purpose-and-scope.md (this wrapup)
  ProphetsWay.Example: 61d9e7d             # main — clean; PR #21 merged (squash)
  ProphetsWay.BaseDataAccess: 207c5de      # main — clean
  ProphetsWay.Logger: 86568fd              # main — untracked AGENTS.md
  ProphetsWay.Utilities: 5095e5e           # master — untracked AGENTS.md
  ProphetsWay.Hasher: d1410ca              # master — untracked AGENTS.md
  ProphetsWay.BPA: 4c0ba1f                 # main — empty repo, clean
status: fresh
---

# Session Handoff

## Where We Are

`ProphetsWay.EFTools` **3.0.0 first pass**, Stage 3, **end of lap 3**, branch `3.0.0-first-pass`.
THE BLOCKER and THE TRAP are cleared, the seam guard is hardened and audited, and the hand-written
`DepartmentDao` is written, reviewed and measured. **All of it is committed** — `08deda6`, `b9320fd`,
`a72b60b` — and the EFTools working tree is clean apart from this wrapup's own edit.

**151 tests · 123 passed · 28 failed**, up from 57/94 at the start of the day, against a suite that a
week ago was silently running on the in-memory implementation.

The session's real output is not the DAO. It is **the finding underneath it** — the existing EF DAO
bases *adopt the caller's instance*, which the SNAPSHOT rule forbids, and several tests were green only
*because* of that violation — and the **five owner decisions** that reordered the plan around it.

## Current Focus

**The generic DAO family collapse (FR 10), carrying the corrected semantics inside it.** Blocking Q9 —
the scope of the adoption fix — is **closed by D14 in favour of route (b)**: fix the bases *as* the
collapse rather than patch them and collapse afterwards.

## Next Session — Start Here

**Exact first invocation:** `@Interface Architect` — one scoped pass over `ProphetsWay.EFTools` to
shape the six generic DAO families: names, generic parameters, and specifically which members are
`virtual` / `abstract` / `sealed`, with XML docs. Follow it immediately with `Contract Reviewer`.

**Semantics are not being invented in that pass.** They are already settled by `DepartmentDao`
(`ProphetsWay.EFTools/ProphetsWay.Example.DataAccess.EF/Daos/DepartmentDao.cs`, 299 lines, 33/33 green).
The pass decides **surface only**.

**Why shape comes first — recorded so it is not skipped as ceremony.** The fatal flaw in the current
bases is a **shape** flaw: every member is declared `new` instead of `virtual`, so it can only be
hidden, never overridden. That is exactly the kind of decision made by accident when the author is
focused on behaviour — and it is a published API surface that lives for a whole major version.

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Shape the six generic families** — names, type parameters, `virtual`/`abstract`/`sealed`, XML docs | `Interface Architect` | Shape is the flaw; settle it before any body is written |
| 2 | Review that surface | `Contract Reviewer` | A published API for a whole major version |
| 3 | **Fill the bodies from `DepartmentDao`'s semantics** | `Implementer` | D15 — the families are derived *from* the concrete DAO |
| 4 | **Repoint the five existing DAOs onto the families** | `Implementer` | D17 — `CompanyDao`/`JobDao`/`UserDao`/`ResourceDao`/`TransactionDao` stay on the bases |
| 5 | **Convert `DepartmentDao` onto the soft-delete family** | `Implementer` | **D16 — this conversion is the family's acceptance test.** 33/33 must still pass |
| 6 | **`CompanyResourceDao` + the `CompanyResource` mapping.** Fold in the `NotWrittenYet` message fix | `Implementer` | ~16 of the 28 reds; D17's second justification |

**Open design question, deliberately not pre-answered:** does `Restore` belong on the soft-delete
family, or stay specific to `IDepartmentDao`?

**Likely family shape — confirm, do not assume.** 18 classes = 3 key types × 6 shapes, so the six
families are *probably* the six shapes made generic over key type. **Verify before building.**

## Owner Decisions Taken This Session — D14–D18

**Filed in `ProphetsWay.EFTools/docs/purpose-and-scope.md` § Owner Decisions, as rows D14–D18, each
marked ⏳ — recorded by an agent, pending `Purpose Refiner` ratification of the numbering and status.**
The substance is the owner's and is **not to be re-litigated**. This table is an index, not a
restatement.

| Ref | Substance |
|---|---|
| **D14** | **Collapse first, do not fix-then-collapse.** FR 10 proceeds now, carrying the corrected `Insert`/`Update`/`Get` semantics inside it. Patching `RootNonIdDao.Insert`, `RootDao.Update` and `Int.BaseDao.Get` in place first was **declined as doing the work twice**. **Closes Blocking Q9 in favour of route (b).** |
| **D15** | **The families are modelled on the hand-written `DepartmentDao`** — D13 executed, not extended. Its precondition was satisfied on 2026-08-18 when the DAO landed. |
| **D16** | **`DepartmentDao` is converted onto the family once it exists, and that conversion is the family's acceptance test.** 33 tests against 19 numbered rules; if the thin derivation keeps all 33 green, the family is proven against the strictest contract in the repo. |
| **D17** | **The line for hand-writing a DAO:** *justified only when it is the source for a family that does not yet exist, or when the contract has no family to belong to.* `DepartmentDao` qualifies on the first, `CompanyResourceDao` on the second. **`CompanyDao`/`JobDao`/`UserDao` qualify on neither and stay on the bases.** Hand-writing those three to route around the adoption defect was **declined** — it would leave 2 of 7 DAOs exercising EFTools, making this a demo of BaseDataAccess rather than of EFTools, while the defect kept shipping. **Reversed an earlier agent recommendation; the owner caught it.** |
| **D18** | **One test suite, never two.** A second EF suite was **rejected** — the seam's value is one suite with one construction site; a second would drift until it proved nothing. **The variable is which DAOs derive from bases, never which suite runs.** |

## Measured State — 151 · 123 passed · 28 failed

Build 0 warnings, 0 errors. **No regressions.**

| Class | Result |
|---|---|
| `DepartmentDaoTests` | **33/33** |
| `DepartmentDataAccessTests` | 11/12 |
| `DataAccessTransactionTests` | **19/20**, up from 4/20 |
| `Guard=Seam` | 7/7 |

The 28 remaining:

| Count | Failure | Note |
|---|---|---|
| 16 | `CompanyResourceDao` `NotImplementedException` | Task 6 above |
| **9** | `Cannot insert explicit value for identity column in table 'Departments'` | **The adoption defect surfacing. These fail *because* `DepartmentDao` is correct** |
| 2 | `UserDao` null-navigation `NullReferenceException` | Pre-existing; no `Include`, and `NoTracking` prevents fix-up |
| 1 | `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance` | 30-second SQL Server lock timeout. `Scope=Characterization` and **failing correctly** — **do not "fix" it** |

**The gate is `--filter "Scope=Contract|Guard=Seam"`** — 139 + 7 = **146**. `Scope=Contract` alone omits
the seam guard entirely; any older text naming it as the complete gate is superseded.

## 🔥 The Major Finding — the EF DAO bases adopt the caller's instance

**Read this before writing any further DAO.** Filed as `ProphetsWay.EFTools/docs/feature-requests.md`
**entry 14**, status `Proposed` — set by no agent; awaiting `Purpose Refiner` triage.

`RootNonIdDao.Insert` is `Dataset.Add(item); SaveChanges();` — leaving **the caller's own instance**
tracked as `Unchanged`. `CompanyDao`/`JobDao` navigations survive `UserDao.Insert`'s graph paint **only
because of that adoption**, which the SNAPSHOT rule forbids. The correct `DepartmentDao` does not adopt,
which is exactly why 9 tests now fail on IDENTITY_INSERT.

Three extensions of the same defect:

1. `Int/BaseDao.Get` returns **store instances with no `AsNoTracking()`**. It escapes violation only
   because `QueryTrackingBehavior.NoTracking` is set on **one of three** `ExampleDataAccess`
   constructors — so a consumer using either DI-friendly constructor gets a DAL whose `Get` hands out
   tracked instances and whose next `Update` flushes edits nobody submitted.
2. `RootDao.Update` is whole-object replacement using `Single` rather than `SingleOrDefault`, so it
   **throws** where the ROW COUNT rule requires `0`.
3. `SnapshotDeepCopyTests.ShouldNotStoreEditsMadeToAUsersNavigationAfterInsertReturned` is **green by
   luck of ordering** — insert one more entity through the same DAL between the edit and the assertion
   and it fails. **Upstream: it belongs to `ProphetsWay.Example`.**

Entry 13 was strengthened the same day with the structural finding below and an **8-of-9** violation
count. Both entries record that making `DepartmentDao` adopt like its neighbours was an available
option and was **declined**.

## Verified Facts — checked tonight, do not re-derive

**All five pre-existing DAOs derive from EFTools bases** — verified by opening each file:

| DAO | Base |
|---|---|
| `CompanyDao` | `Int.BasePagedDao<Company>` |
| `JobDao` | `Int.BaseGetAllDao<Job>` |
| `UserDao` | `Int.BaseDao<User>` |
| `ResourceDao` | `Guid.BaseGetAllDao<Resource>` |
| `TransactionDao` | `Long.BasePagedDao<Transaction>` |

Only `DepartmentDao` is hand-written. **The ratio is 5:1** — not the 2:5 the plan rejected in D17 would
have produced.

**`ResourceDao.Insert` and `TransactionDao.Insert`/`Update` are declared `public new`** — FR 13's hiding
trap, live in this repository. Through the `IResourceDao`/`ITransactionDao` interfaces they still bind
correctly, so **nothing is broken today**; the hiding only bites through a base-class-typed reference.
The collapse will touch these.

**FR 13's `new`-not-`virtual` finding means the bases cannot be fixed *from below*, not that they
cannot be fixed *in place*.** An in-place fix needs no `virtual`. This distinction was blurred earlier
in the session and corrected — **do not re-blur it.**

## In Flight

| Item | State | Where |
|---|---|---|
| Six generic DAO families | **Not started.** Next session's first move | `ProphetsWay.EFTools/` |
| `CompanyResourceDao` | **Does not exist** | `ProphetsWay.Example.DataAccess.EF/Daos/` |
| `ExampleContext` mapping for `CompanyResource` | **Does not exist** — no `DbSet`, no `ToTable` | `ProphetsWay.Example.DataAccess.EF/` |
| `NotWrittenYet` message | Still claims Department has no EF DAO and that `ExampleContext` maps neither entity — **both now false for Department.** Thrown only from CompanyResource forwarders, so harmless today | `ProphetsWay.Example.DataAccess.EF/` |
| `docs/api-contract.md` | **Revision 8, under review.** J1–J10 folded in place; no pass has run against the text as it now stands | `ProphetsWay.EFTools/docs/` |
| `docs/feature-requests.md` entry 14 | `Proposed`, untriaged | `ProphetsWay.EFTools/docs/` |
| D14–D18 | Recorded ⏳, awaiting `Purpose Refiner` ratification | `ProphetsWay.EFTools/docs/purpose-and-scope.md` |

## Uncommitted Changes

**Read from `git status --short` in all eight roots at sign-off.**

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.EFTools` @ `a72b60b` | ` M docs/purpose-and-scope.md` | **D14–D18 appended by this wrapup.** Nothing else — lap 3 is committed |
| `prophets-pipelines` @ `f28798c` | ` M docs/session-handoff.md` | This file |
| `ProphetsWay.Logger` @ `86568fd` | `?? AGENTS.md` | Long-standing, unrelated. Commit-ready |
| `ProphetsWay.Utilities` @ `5095e5e` | `?? AGENTS.md` | Same |
| `ProphetsWay.Hasher` @ `d1410ca` | `?? AGENTS.md` | Same — **this one carried a live hazard**: the pre-correction file instructed agents to make a binary-breaking namespace change, undoing a deliberate v2.0.0 decision |

`ProphetsWay.Example` (`61d9e7d`), `ProphetsWay.BaseDataAccess` (`207c5de`) and `ProphetsWay.BPA`
(`4c0ba1f`, empty) are **clean**. **Committing is the owner's call.**

### ⚠️ Discrepancy found and corrected

The sign-off report described lap 3 as **uncommitted** — `DepartmentDao.cs` new, plus `ExampleContext.cs`,
`ExampleDataAccess.cs` and `docs/feature-requests.md` modified, with the commit message in hand. **Git
says otherwise.** `a72b60b` — *"Implement the Entity Framework DepartmentDao"*, G. Gordon Nasseri,
Tue Aug 18 22:57:03 2026 — contains **exactly those four files**, +477/−10, and the EFTools working tree
was **clean** when this wrapup began. **The commit was made; the report was written just before it.**
`git submodule status` shows `61d9e7d` with **no leading `+`** — the pointer advance is committed too.
No other claim in the report contradicted git.

## Environment Prerequisite

**A SQL Server `localhost` / `ProphetsWay.Example` database must exist** or the suite cannot run against
Entity Framework — this is why `LocalTestsOnly: 'yes'` is set and CI never runs these. The connection
string is in `ProphetsWay.EFTools.Tests/Constants.cs`, carrying `TrustServerCertificate=True` (without
it all 71 SQL tests fail identically at login). **SQLite in-memory remains D4's future CI leg**; the
provider is referenced at `10.0.11` but no such leg exists.

## Open Questions — Blocking

**None.** Q9 — the scope of the adoption fix — is **closed by D14** in favour of route (b). Q6, Q7 and
Q8 were closed earlier in the session.

## Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
| 1 | **What version does `ProphetsWay.Example` carry at tag time?** `app-variables.yml` reads `3`/`1`/`1` — a **patch** — but `TestDataAccessFactory.Use` is new public API, a MINOR by house rule, and the IDENTIFIER and ROW COUNT rules were restated on five further DAO interfaces, tightening a contract on implementers (arguably major). **An implementation conforming to the 3.1.0 text can be non-conforming to this one without changing a line.** Must be settled before Example is tagged | 08-16 |
| 2 | **`Test Auditor` pass over `SnapshotDeepCopyTests.ShouldNotStoreEditsMadeToAUsersNavigationAfterInsertReturned`** — green by luck of ordering. **Must run in the `ProphetsWay.Example` repository, never from EFTools** | 08-18 |
| 3 | **`ThrowIfDisposed()` is missing from the other 32 forwarders** in `ExampleDataAccess` — a contract requirement with **no test**. 8 of 40 guarded. Routed as a separate sweeping change | 08-18 |
| 4 | **SourceLink** — wanted working before the NuGet deployment. Deviation 5's five missing properties plus the `Microsoft.SourceLink.GitHub` reference. **Removing the `Submod` block stopped the warning; it did not deliver Source Link** — read Deviations 5 and 7 together | 08-16 |
| 5 | **A31's three version-sensitive EF Core surfaces** — `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys, `MultipleCollectionIncludeWarning`. Nobody had a verifiable source **and nobody guessed** | 08-16 |
| 6 | Client-supplied `Guid` keys — `ProphetsWay.Example/…/ResourceDao.cs` line 48 | earlier |
| 7 | Whether to state hard-delete explicitly on the five silent DAOs | earlier |

## Standing Guardrails

- **No new test file in `ProphetsWay.EFTools.Tests`** beyond the thirteen discovery adapters,
  `TestSeam.cs`, `TestSeamTests.cs` and `AdapterCoverageTests.cs`. Local assertions are shape A through
  the back door, and **D10 committed to shape B**. Reinforced by **D18**.
- **The 9 IDENTITY_INSERT failures are not a defect in `DepartmentDao`.** Making it adopt the caller's
  instance like its neighbours would turn them green and would be **wrong** — an available option,
  explicitly declined. See FR 14.
- **Do not "fix" `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`.**
  `Scope=Characterization`, failing correctly; its own summary says a DAL over a store providing
  isolation fails it.
- **A green EFTools suite is meaningful only while `TestSeam.cs` is on disk.** Per F5, deleting it makes
  the run look dramatically better. **Never delete it to reduce a red count.**
- **`RootBaseSoftDao` cannot serve `IDepartmentDao` by inheritance** — it violates **8 of its 9**
  members, and its members are **`new`, not `virtual`**, so they cannot be overridden at all. *"Just
  inherit the existing soft base"* is a trap. Already proven; do not re-derive.
- **The keyless mapping question is settled: composite `HasKey` is the only viable answer.**
  `HasNoKey()` makes the entity read-only and forbids the `Insert`/`Delete` `ICompanyResourceDao`
  requires.
- **`UseQueryTrackingBehavior(NoTracking)` must be removed in the same lap that adds per-query
  `AsNoTracking()`** — not before, or every Example read silently becomes tracked.
- **Never edit anything under `ProphetsWay.EFTools/ProphetsWay.Example/`** — pinned submodule. Edit
  upstream and move the pointer.
- **`ConventionShowcaseTests` and `ExceptionPassthroughShowcaseTests` stay excluded** from the adapters:
  `Scope=Dispatcher`, they belong to `ProphetsWay.BaseDataAccess`, and their DALs are deliberately
  mis-wired and self-constructing.

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| `ProphetsWay.EFTools/README.md` documents types that no longer exist — `BaseEFDataAccess<TContextType, TIdType>`, `BaseEFContext(string)` | Stage 4 work; **the list is growing**, and the family collapse will lengthen it further | Stage 4 |
| Deviation 3 — remove the SQL Server and InMemory provider references from the published library | Breaking; needs the provider-neutrality lap. **`Microsoft.EntityFrameworkCore.InMemory` now has zero call sites** | The provider-neutrality lap |
| `xUnit1013` on the submodule's `DepartmentDaoTests.cs` lines 294 and 1001 | Upstream — a `Test Designer` fixes it **in `ProphetsWay.Example`**, never from the EFTools side | Next Example pass |
| The three corrected untracked `AGENTS.md` files | Out of scope once the owner narrowed to four repos | Owner's convenience |
| A `conventions/AGENTS.shared.md` rule that **a revision-log entry is not evidence its own correction landed** | The shared block regenerates seven repos — that is an owner instruction, not a scribe's edit | Owner's call |

## Earlier Decisions — index only

Each already in a permanent home. **D1–D13** in `ProphetsWay.EFTools/docs/purpose-and-scope.md`
§ Owner Decisions; **OD-8, OD-9, OD-11** and the J1/J2 rulings in
`ProphetsWay.EFTools/docs/api-contract.md`. **`OD-10` does not exist** — an earlier lead conflated it
with `D10`. The Rule 18 UTC narrowing lives on `ProphetsWay.Example/…/IDepartmentDao.cs`, cited in
`api-contract.md` as present **from 3.1.1**.

## 🔑 The Lesson

**Three times this week a revision log or status line asserted a correction the body did not have.**
Every one was caught only by an **independent read of the body**, never by reading the claim. Two
splice-duplication defects came from a botched find-and-replace pasting a file header over live
content. The session-opening corruption made the same point twice: reported as one site, **turned out
to be seven**, and **the obvious recovery source was itself corrupt** — recovery was a *merge*, not a
restore.

Tonight's discrepancy is the same shape in miniature, in the safe direction: the report said lap 3 was
uncommitted; git said it was committed twenty minutes earlier. **Reading the artifact beat reading the
claim, again.**

The checks that catch these now live in the artifacts rather than as lessons someone must relearn: the
obligation-sum integrity check (`123 + 10 + 8 = 141`), the mixed-traceability tie-breaker, and the
`[C]`-must-trace-to-a-stated-rule discipline.

## Recent Sessions

### 2026-08-18

`ProphetsWay.Example` PR #21 merged (`61d9e7d`) and the EFTools submodule pointer advanced onto it —
**the blocker cleared**. THE TRAP disarmed and committed: `TestSeam.cs`'s `[ModuleInitializer]` points
the upstream suite at the EF DAL, and `Constants.cs` gained `TrustServerCertificate=True`. The guard was
then **hardened against its own auditor** — `TestSeamTests` now derives from `BaseUnitTests<ICompanyDao>`
and asserts on `_da`, with relational-provider, fresh-instance-per-call and store-reachability
assertions, `[Collection(TestCollections.SharedStore)]`, `[Trait("Guard","Seam")]`, and failure messages
that say plainly what a failure means; plus a new `AdapterCoverageTests.cs`. **All 11 findings closed,
four validated by applying the cheat, watching the guard fail, and reverting** (`b9320fd`). Lap 3
landed: `DepartmentDao` written, `Code Reviewer`-passed, committed as `a72b60b`. **57/94 → 123/28.**
FR 14 filed on the argument-adoption defect; FR 13 strengthened with the `new`-not-`virtual` structural
finding. **Five owner decisions, D14–D18**, reordered the plan onto the family collapse.

### 2026-08-16 → 08-17

Documentation re-verified against source across four repos, producing three findings that mattered more
than the corrections: `ProphetsWay.Hasher`'s `AGENTS.md` was instructing agents to make a
binary-breaking namespace change; `ProphetsWay.BaseDataAccess`'s behavioural-contracts index was missing
an entire section that the EFTools 3.x design had been drafted off; and `ProphetsWay.Example`'s version
line is 3.1.1 where three documents said 3.1.0. D11–D13 taken. **No terminal tool that session** — the
owner ran every command, and two agents correctly stopped rather than guess.
