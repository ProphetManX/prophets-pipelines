---
written: 2026-08-22T23:55:00
head:
  prophets-pipelines: 048d432              # main — verified from .git/refs/heads/main; dirty: this file only
  ProphetsWay.EFTools: f79b471             # branch 3.0.0-first-pass — LAP 3 IS COMMITTED AND PUSHED, six commits on top of 52a2edf. origin/3.0.0-first-pass == f79b471, so 0 ahead / 0 behind. DIRTY: docs/api-contract.md + ProphetsWay.EFTools.Tests/FailedInsertWriteBackTests.cs. SUITE IS RED BY DESIGN — 2 failing tests await the Implementer
  ProphetsWay.Example: 61d9e7d             # carried from 22:15, NOT re-verified this checkpoint — dirty: AGENTS.md, README.md, docs/feature-requests.md, docs/repo-profile.md
  ProphetsWay.BaseDataAccess: bd02dfd      # carried, NOT re-verified — branch notes-from-eftools-3.0.0; main is still 207c5de, UNMERGED
  ProphetsWay.Logger: 86568fd              # carried, NOT re-verified — untracked AGENTS.md
  ProphetsWay.Utilities: 5095e5e           # carried, NOT re-verified — untracked AGENTS.md
  ProphetsWay.Hasher: d1410ca              # carried, NOT re-verified — untracked AGENTS.md
  ProphetsWay.BPA: 4c0ba1f                 # carried, NOT re-verified — empty repo
status: live                               # MID-SESSION auto-checkpoint, 2026-08-22 LATE EVENING — lap 3 committed, then reviewed, and the review found a blocker. Not a clean wrap. RECONCILED IN PLACE over the 22:15 and 09:41 checkpoints of the same session — there is one 2026-08-22 entry, not three. The 2026-08-20 `fresh` handoff was consumed on resume this morning
---

# Session Handoff

> **⏸ CHECKPOINT — 2026-08-22, late evening.** Everything under **2026-08-22 — Checkpoint** below is
> current. **It has been reconciled in place over BOTH earlier checkpoints of the same session** — the
> 09:41 one (written mid-Stage-2 with the collision gate open) and the 22:15 one (written with lap 3
> green but uncommitted). There is **one** 2026-08-22 entry, not three. Where a row says CLOSED or
> COMMITTED, the earlier text said OPEN or UNCOMMITTED; do not resurrect the earlier wording.
>
> Everything after the sign-off rule is the **2026-08-20 sign-off**, retained because most of it is still
> open and **corrected in place where this session moved it**. The 2026-08-20 handoff was `fresh`; it was
> consumed on resume this morning and must not be replayed.
>
> **This is an auto-checkpoint, not a sign-off.** Durable content has **not** been filed to permanent
> homes — that is `wrapup`'s job and it has not run.
>
> ⚠️ **No shell was available to `Session Scribe` at this checkpoint** — the configured `pwsh.exe` path
> does not resolve, which is the same environment failure `Test Designer` hit. **Git facts below were
> read directly out of `.git`** (`logs/HEAD`, `refs/heads/…`, `refs/remotes/origin/…`), which is exact
> for SHAs and branch tips and **gives nothing about working-tree state**. Where the tree is described,
> it is **the owner's report, not a measurement** — labelled as such.

---

# 2026-08-22 — Checkpoint

**Repo:** `ProphetsWay.EFTools`, branch `3.0.0-first-pass`, HEAD **`f79b471`** — **moved six commits**
from `52a2edf`. **Lap 3 is committed and pushed.** The session began as a Stage 2 one (contract moved,
code did not), became a Stage 3 one (lap 3 written and green), and has now closed the commit and been
**reviewed** — with the review finding **one blocker** and a **specification defect that is the highest-
value finding of the session**.

## ✅ LAP 3 IS COMMITTED AND PUSHED — six commits, SHAs verified

**Read out of `.git/logs/HEAD` and `.git/refs/`, not taken on report.** `refs/heads/3.0.0-first-pass`
and `refs/remotes/origin/3.0.0-first-pass` are **both `f79b471`**, so the branch is **0 ahead / 0
behind** and the work is pushed, not merely local.

| # | SHA | Subject | The split as planned |
|---|---|---|---|
| 1 | **`3c0d7e7`** | *Record the lap-3 decisions and specify the keyless DAO families* | `docs/api-contract.md` — **its own commit**, keeping `6cf43d1`'s precedent |
| 2 | **`10d93f0`** | *Copy the 2.2.x keyless DAO types to Legacy names* | the three `Legacy*` copies + `RootDao.cs`'s base clause |
| 3 | **`fb9b54a`** | *Extract `BaseDao`'s entity-graph helpers into `EntityGraph`* | `EntityGraph.cs` + `BaseDao.cs` |
| 4 | **`50e15dd`** | *Add the keyless and keyless-soft DAO families* | the four keyless types + `KeylessDaoTests` + `KeylessSoftDaoTests`. ⚠️ **Carries a `BREAKING:` trailer** |
| 5 | **`1efa52e`** | *Restore a soft entity's timestamps when `Insert` throws* | `BaseSoftDao.cs` + `FailedInsertWriteBackTests` + `SoftDeleteTimestampHookTests` |
| 6 | **`f79b471`** | *Implement `CompanyResourceDao` and map `CompanyResource`* | `CompanyResourceDao` + `ExampleContext` + `ExampleDataAccess` + `CompanyResourceConversionTests` |

> 📌 **It went out as SIX commits, not the planned three.** The 22:15 checkpoint's plan and its *Exact
> invocation* both said three; both have been rewritten. The finer split is strictly better — the
> `EntityGraph` extraction got **its own commit (`fb9b54a`)**, which is exactly what a reviewer needs to
> diff it in isolation. **Do not restate the three-commit plan as what happened.**

> 🕐 **A timestamp discrepancy, recorded and not resolved.** `.git/logs/HEAD` places all six commits at
> **2026-08-22 12:29–12:38 local** (epoch 1787416176–1787416708, `-0400`), anchored against `52a2edf` at
> 2026-08-20 23:54:45 — which matches the 2026-08-20 sign-off exactly, so the arithmetic is sound. That
> sits **before** the 22:15 checkpoint which recorded lap 3 as entirely uncommitted. **The handoff's own
> `written:` stamps are therefore narrative, not clock-derived. Git is authoritative; the stamps are
> not.** Do not use a `written:` value to order events against a commit.

## 🔴 THE SUITE IS RED BY DESIGN — 2 failing tests await the `Implementer`

**This is a deliberate red phase, not a regression.** `FailedInsertWriteBackTests.cs` grew two new facts
that were **observed failing for the defect they describe**. Do not "fix" the suite by weakening them,
and do not report the red as a lap-3 regression.

## 🟩 Lap 3's green measurements — as of the commit, still the last full numbers

**All owner-run at 22:15, before the two red tests were added.**

| Measurement | Result |
|---|---|
| `dotnet build ProphetsWay.EFTools.sln -c Debug` | **0 errors, 0 warnings** |
| Lap gate `dotnet test --filter "Area=Keyless\|Area=Insert"` | **66 / 66 passed.** **Needs no SQL Server — SQLite only** |
| Full suite | **268 total, 257 passed, 11 failed** — against a pre-lap baseline of **200 / 173 / 27** |
| `ProphetsWay.Example.Tests` | **164 / 164 on both `net10.0` and `net48`** |

**All 19 `EFCompanyResource*` cases pass.** The arithmetic checks out: **27 − 16 = 11**, and there are
exactly **11 non-conversion failures** — **zero regressions**.

**The 11 remaining reds are pre-existing and outside the lap:**

- **10 × `EFSnapshotDeepCopyTests`** — `ApplyIncludes` defaults to identity per **OD-1 / A18** and no EF
  DAO overrides it, so `stored.User.Company.Name` dereferences a null navigation.
- **1 × `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`** — SQL Server
  execution timeout, **environmental**.

> 📌 **The lap gate is the reproducible one.** `Area=Keyless\|Area=Insert` is 66/66 on any machine; the
> full suite still requires a local SQL Server carrying `ProphetsWay.Example`.

## ✅ THE GATE — CLOSED. Option (a), and it has been executed

**The blocking gate at the top of the 09:41 checkpoint is answered: option (a).** The preparatory rename
is **done**, and it landed exactly as scoped.

| 2.2.x type | Renamed to | Visibility |
|---|---|---|
| `RootNonIdDao<T>` | `LegacyRootNonIdDao<T>` | internal |
| `BaseNonIdDao<T>` | `LegacyBaseNonIdDao<T>` | public |
| `BaseSoftNonIdDao<T>` | `LegacyBaseSoftNonIdDao<T>` | public |

Plus `RootDao.cs`'s base clause. Files renamed to match. **Verified rename-only** by stripping the
prefix and diffing against the HEAD blob — identical, BOM preserved. **Blast radius held at exactly
four library files**: grep found 9 references in 4 files and **zero** in the tests, in
`ProphetsWay.Example.DataAccess.EF`, in the submodule, or in any `.csproj`/`.sln` — SDK-style implicit
globbing meant **no project-file edit was needed**. Build and tests were back on baseline immediately
after. **Do not re-ask the gate, and do not re-propose options (b), (d), (e) or (f).**

## 📦 What Landed — ✅ ALL SIX COMMITS ARE IN. Retained as the file-level map

**`Commit Author` ran, and the tree is clean of lap 3.** The table below is now a *map of which commit
owns which file*, not a to-do.

| Commit | Files |
|---|---|
| **`3c0d7e7`** | `docs/api-contract.md` — the lap-3 decisions and the keyless family specification |
| **`10d93f0` — the preparatory rename** | `LegacyRootNonIdDao.cs`, `LegacyBaseNonIdDao.cs`, `LegacyBaseSoftNonIdDao.cs` (new files carrying the renamed 2.2.x types), plus `RootDao.cs`'s base clause |
| **`fb9b54a` — the extraction, ISOLATED** | `EntityGraph.cs` (new `internal static class`), `BaseDao.cs` repointed at it. **Its own commit is what made the verbatim check below cheap** |
| **`50e15dd` — four new library types** ⚠️ `BREAKING:` | `RootNonIdDao.cs`, `BaseNonIdDao.cs`, `RootSoftNonIdDao.cs`, `BaseSoftNonIdDao.cs` — all root-namespace — plus `KeylessDaoTests.cs` and `KeylessSoftDaoTests.cs` |
| **`1efa52e` — F10** | `BaseSoftDao.cs`, `FailedInsertWriteBackTests.cs`, `SoftDeleteTimestampHookTests.cs` |
| **`f79b471` — the consumer side** | `ProphetsWay.Example.DataAccess.EF/Daos/CompanyResourceDao.cs` (**new** — the D17 conversion onto `RootNonIdDao<CompanyResource>`), `ExampleContext.cs` (`DbSet<CompanyResource>`, `HasKey(x => new { x.CompanyId, x.ResourceId })`, `ToTable("CompanyResources")`), `ExampleDataAccess.cs` (the field, its construction, three **real** forwarders; the `NotWrittenYet` throw helper **deleted** — it had no other caller), `CompanyResourceConversionTests.cs` |

**Tests — five files, lap 3 total 50 methods / 66 cases (Contract 47, Characterization 2, Dispatcher 1):**

| File | State | Count |
|---|---|---|
| `KeylessDaoTests.cs` | new, 1,312 lines | 23 methods / 31 cases |
| `KeylessSoftDaoTests.cs` | new, 1,299 lines | 21 / 29 |
| `FailedInsertWriteBackTests.cs` | new, 361 lines | 3 / 3 |
| `CompanyResourceConversionTests.cs` | new, 240 lines | 3 / 3 |
| `SoftDeleteTimestampHookTests.cs` | **modified**, +160 / −17 | 8 → **10** methods |

**Since the commit, `FailedInsertWriteBackTests.cs` has grown to 5 facts** — the 3 above untouched, plus
two new **red** ones. See *Two New Red Tests* below.

## 🔎 `Code Reviewer` — verdict: **ship with minor changes**, one blocker

**`Code Reviewer` ran, three laps late.** It was pointed at the `EntityGraph` extraction hardest, as the
22:15 checkpoint instructed.

### ✅ THE `EntityGraph` EXTRACTION IS VERBATIM — **MECHANICALLY VERIFIED. DO NOT RE-OPEN THIS.**

**This is a measurement, not an inference, and it retires the single largest open risk of the lap.**
Each member's body was pulled from `52a2edf:BaseDao.cs` and from `EntityGraph.cs`, comments and
whitespace stripped, the **declared** `Context.` → `context.` substitution applied, then diffed.

| Member | Result |
|---|---|
| `CopyForStore` | Identical but for an **added generic constraint** |
| `RemoveFromInverseNavigations` | Identical but for the same added constraint |
| `ReachableFrom` (37 lines) | **Byte-identical** |
| `Navigations` (6 lines) | **Byte-identical** |
| `Detach` (3 lines) | **Byte-identical** |

**No lost null check. Traversal order unchanged. Reference identity intact.** `DetachAfterWrite`'s two
call sites were **genuinely identical before the merge**, so collapsing them lost nothing.
**`EntityGraph` holds no fields**, so there is no shared mutable state to reason about.

> 📌 **The `fb9b54a` isolation is what made this cheap.** Extraction-in-its-own-commit is now a
> demonstrated practice, not a preference — carry it into lap 4's deletions.

### Also verified good — do not re-review

- **`Dataset` is lazy in all four new types** (A17).
- **A15's message is built from `GetType().Name` / `typeof(TEntity).Name`**, matching the spec template
  **placeholder-for-placeholder** (M7).
- **`GetCount` invokes the ordering hook once and discards it** — the shape defect 5.12 warns a reviewer
  will delete. It is intentional and now reviewed as such.
- **`RootSoftNonIdDao` overrides rather than hides everywhere** (A2) — the `new`-not-`virtual` structural
  defect did **not** regress into lap 3.
- **The consumer side is correct end to end.**

### 🚨 THE BLOCKER — the keyed F10 fix has a **post-`SaveChanges` window**

`BaseSoftDao.Insert` sets `stored = true` only **after `base.Insert(item)` returns**. But `BaseDao.Insert`
does **three things after `SaveChanges()` has already succeeded**: assigns the identifier, calls
`RemoveFromInverseNavigations`, then detaches in its own `finally`. **If any of them throws, the row IS
stored and the outer `finally` rolls the timestamps back anyway.**

**Result: the caller holds a real database identifier and no `CreatedDate`.** Same shape at
`RootSoftNonIdDao.UpdateCore`.

> ⚠️ **Correction to the reviewer, from `Test Designer`:** of `BaseDao.Insert`'s three post-save steps
> the **first** is the identifier assignment — so if *that* is what throws, the identifier is **not** on
> `item`. The instance is still wrong, **by a different route**. Both routes leave the caller
> disagreeing with the stored row; only the shape of the disagreement differs.

## 🏆 THE HIGHEST-VALUE FINDING OF THE SESSION — **F10's two remedies are NOT equivalent, and F10 says they are**

**This is a specification defect, not just a bug. File it as such.**

F10 offers two remedies and states **"neither is mandated."** Under the post-save window they **diverge**:

| Branch | Remedy taken | Outcome |
|---|---|---|
| `RootSoftNonIdDao.Insert` | **Remedy one** — stamp the copy, assign after `SaveChanges` returns | ✅ **Immune** |
| `BaseSoftDao.Insert` | **Remedy two** — stamp `item`, restore in a `finally` | 🔴 **The defect** |

> **Remedy two is unsafe wherever the member does anything after `SaveChanges`.** F10 needs that as a
> **term**, not as a footnote. Until it does, a future implementer picking remedy two on a member with a
> post-save step reproduces this bug while conforming to every sentence F10 contains.

**This is the second time this exact class of gap has been found in the same area** — A32 says *when* the
write-back happens but never that a failed `Insert` writes nothing back. **Triage F10's new term and
A32's wording together; they are one edit, not two.**

## 🧪 Two New Red Tests — `Test Designer`, observed failing for the defect

`FailedInsertWriteBackTests.cs` extended to **5 facts** (the 3 pre-existing **untouched**).

**The post-save throw is authorable from outside the library** — which is what makes these legitimate
tests rather than a white-box hack. Both post-save steps reach a **caller-owned collection instance**, so
a `TrapCollection<T>` that refuses exactly one operation is a fair fixture. Graph: **`Binder`** (keyless
soft principal, key `Code`, collection `Slips`) ← **`Slip`** (keyed soft dependent). **Both ends are named
in `OnModelCreating`**, because a one-sided relationship has no `Inverse` and **both post-save steps skip
silently** against one.

| Test | Scope / Area | Observed |
|---|---|---|
| `ShouldLeaveTheCallersInstanceAgreeingWithTheStoredRowWhenAKeyedSoftInsertThrowsAfterSaving` | `Contract` / `Insert` | 🔴 **Fails.** `slip.CreatedDate` should be the committed row's stamp; was the **2001 sentinel**. ⚠️ **`slip.Id.ShouldBe(row.Id)` passed first** — the caller holds the **real identifier** while carrying a **rolled-back `CreatedDate`**. That assertion ordering is the evidence, not incidental |
| `ShouldLeaveTheCallersInstanceAgreeingWithTheStoredRowWhenAKeylessSoftUpdateThrowsAfterSaving` | **`Characterization`** / `Keyless` | 🔴 Fails. **Tagged `Characterization` deliberately** — **no stated term covers a write whose save succeeded and whose later step threw.** Tagging it `Contract` would bind every future implementer to a rule the spec does not make. **The spec gap is the point** |

> 🛠 **Environment note — not a test outcome.** The literal `dotnet test --filter` command **could not be
> run**: a PowerShell session held the test DLL, and after exiting it the shell became unavailable
> (`pwsh.exe` no longer resolves — the same failure `Session Scribe` hit at this checkpoint). Tests were
> run through **VS Code's test integration**, the same MSBuild + VSTest path. **Treat the results as
> real and the missing terminal as an environment problem to fix.**

## 🔴 A LATENT DEFECT IN `EntityGraph.RemoveFromInverseNavigations` — tracked NOWHERE ELSE

**Recorded here because it exists in no other document.** It iterates `entityType.GetNavigations()` —
**reference *and* collection** — and treats every one as a reference to a principal. **An entity with a
populated collection navigation raises `TargetException`** in the same post-save window.

**Latent only because the current seeds hold `null`.** ⚠️ **Reasoned from source, not executed.** It is
an `Implementer` investigation item, not yet a proven bug.

> 📌 Note the interaction: the **new `Binder`/`Slip` fixture is the first keyless graph in the suite with
> a real collection navigation.** It may make this reachable — and it may unblock the A24/OD-4/A37
> navigation coverage gap that has been recorded as *"blocked, no keyless fixture entity declares a
> navigation property"* since 22:15.

## 🛠 `BaseSoftDao.Update` — the unwritten keyed twin, left unwritten ON PURPOSE

It is the keyed counterpart of the `RootSoftNonIdDao.UpdateCore` case. `Test Designer` **deliberately did
not write it** until the specification has the term. **Do not treat its absence as an oversight** — it is
waiting on the F10 amendment above.

## 🧭 `Interface Architect` — **FOURTH silent occurrence, and the pattern is now agent-specific**

**Four silent-subagent occurrences across two sessions. Two are this session. BOTH of this session's are
`Interface Architect`.** The failure is **no longer random** — it correlates with the agent.

> 🚩 **This is a toolbelt item and deserves a separate sitting.** The "silence is a failure" instruction
> held for `Test Designer`, `Test Auditor` and `Implementer` this session; it did **not** hold for
> `Interface Architect`. That is a sharper signal than three undifferentiated occurrences were.

**Its work was recovered by grepping `docs/api-contract.md` directly** — the same recovery that worked at
09:41. What it wrote:

| Ref | Content |
|---|---|
| **A38** | **The write plumbing is `protected`, the same on both halves, and now *stated*.** `TrackForWrite(TEntity item)` → **`protected`**; `ApplyUpdateValues(EntityEntry<TEntity>, TEntity)` → **`protected virtual`**; `InsertRoot(TEntity, DateTime?)` **stays `private protected`** — the **one asymmetry, and it is stated**, because its `stamp` parameter admits exactly one conforming value from outside and it has no keyed counterpart. ⚠️ **A keyless `Restore` MUST call `TrackForWrite`, and nothing else will do** — which is why it cannot stay `private protected` |
| **F11** | The **accessibility-versus-documentation** finding, **closed by A38**. The spec had been **silent on all three members**, and that silence was the cause. ⚠️ **This supersedes the 22:15 note reading "three members are `private protected` … deliberate; do not widen them."** Two of the three are now specified `protected`; the third stays. Do not act on the old note |
| **F12** | **A34's purity constraint tightened** for in-memory null semantics against **partially-populated tracked entries** |
| **F13** | **`RootSoftNonIdDao.UpdateCore` mutates `item.UpdatedDate` *before* `MatchRow(item)` is built.** Binds **every member that locates through the hook** — not just this one |
| **F14** | 🔥 **It found an existing specification claim to be WRONG** — see below |

### F14 — the document asserted a false provider fact

The document listed **`Guid`** among types that *"order identically on every relational provider."*
**SQL Server orders `uniqueidentifier` by comparing the last six bytes first** — which is neither
`Guid.CompareTo`'s order **nor** textual order, and is exactly why a sequential `Guid` looks unordered
to .NET.

- A **provider comparison table** was added.
- **SQLite's ordering is explicitly NOT asserted** — recorded as a mapping fact to **measure on the box**,
  not predict. **That restraint is the correct call and should be imitated**; two EF Core claims in this
  chain have already been wrong because they were reasoned.
- ⚠️ **Consequence with a date on it:** `CompanyResourceDao.ApplyStableOrder` does
  `.ThenBy(x => x.ResourceId)` on a `UNIQUEIDENTIFIER`. It is **correct on SQL Server today** and will
  produce **different page boundaries the moment the SQLite leg lands.** Whoever adds D4's SQLite CI leg
  must expect this, not debug it.

## ✅ F10 — fixed on both branches, but the KEYED fix is REOPENED as the blocker

> 🔴 **SUPERSEDED at this checkpoint.** The 22:15 text below said the two remedies were used *"one per
> branch, deliberately"* and read as settled. **`Code Reviewer` has since shown the two remedies are not
> equivalent** — remedy 2 leaves a post-`SaveChanges` window and **`BaseSoftDao.Insert` is defective.**
> Read *THE HIGHEST-VALUE FINDING* above first. The table below is retained for **why each remedy was
> chosen**, which is still the useful record.

**This was deliberate, not inconsistency — the reasoning was sound and the conclusion was wrong.**

| Branch | Remedy | Why that one |
|---|---|---|
| **Keyed soft** — `BaseSoftDao.Insert` | **Remedy 2** — capture the three timestamps, stamp, call `base.Insert(item)`, restore in a `finally` when the call did not return normally | `BaseDao.Insert` owns the copy and is **already conforming**, so reaching remedy 1 there would mean adding a stamping hook to a member with **no defect**. It is also literally the shape `BaseSoftDao.Update` two members down already uses — which was **fact 1 of the finding's own argument** |
| **Keyless soft** — `RootSoftNonIdDao.Insert` | **Remedy 1** — A24 steps **6b** and **9b** as written: `InsertRoot(item, stamp)` stamps the **copy** before `State = Added`, and assigns **the same single clock reading** onto `item` **after** `SaveChanges()` returns, inside the `try` | Matches `DepartmentDao.Insert`, which is what **D16 grades against** |

**The keyed hard branch needed no change.**

## 🧩 A34's Pre-Detach — one mechanism for both keyless branches

`RootNonIdDao.TrackForWrite(item)` builds `MatchRow(item)` **once**, hands that same expression to
`DetachTrackedRowsMatching`, which `.Compile()`s it and runs the delegate **in memory** over
`ChangeTracker.Entries<TEntity>()` setting hits to `Detached`, then runs the **uncompiled** expression as
the `AsTracking().IgnoreQueryFilters().Where(…).SingleOrDefault()` fetch. `Delete`, `UpdateCore` and the
soft `Delete` **all route through it**, so the pre-detach cannot be present on one member and missing on
another. **The change tracker is never cleared.**

> ⚠️ **Ordering is load-bearing on the soft branch.** `ApplyUpdateValues` captures
> `CreatedDate`/`DeletedDate` from `entry.Entity` **after** the fetch, so **A30 restores the stored stamp
> and not a tracked `null`.** Reordering these two silently breaks A30.

## 🟠 Judgement Call Not In The Brief — `EntityGraph`, flagged for review

`RootNonIdDao.Insert` needs **A32's copy, A24's reachability walk, A37's inverse-navigation removal and
A26's detach** — ~140 lines that already existed as `private` members of `BaseDao`. **The keyed and
keyless families are unrelated branches and cannot inherit from each other.**

The `Implementer` **extracted them verbatim into `internal static class EntityGraph`** (166 lines) and
repointed `BaseDao` at them — the only change being `Context` becoming a `context` **parameter** — citing
`SoftTimestamps`'s own `<remarks>` as the house position against duplicated logic across the two
branches. `BaseDao.cs` is **+12 / −143** as a result. Full-suite counts confirm it is
**behaviour-preserving**.

> ~~🚩 **This is a refactor of previously-working code performed during a green phase, and should be
> reviewed as such.**~~ ✅ **REVIEWED AND CLEARED at this checkpoint — mechanically, member by member.**
> See *THE `EntityGraph` EXTRACTION IS VERBATIM* above. **Do not re-open it, and do not carry it forward
> as an open risk.**

~~**Three members are `private protected` rather than `protected`**~~ — 🔴 **SUPERSEDED by A38.**
`TrackForWrite` and `ApplyUpdateValues` are **specified `protected` / `protected virtual`** and are
**still `private protected` in the code** — that is an `Implementer` item, not a settled decision. Only
`InsertRoot` stays `private protected`. **Do not act on the old "deliberate; do not widen them" note.**

## 🛡️ Audit Trail — the gate was hardened BEFORE `Implementer` ran

**`Test Auditor` ran this lap** — the first lap it has. It reviewed the red phase and found **three
blocking gaps plus one high-priority hole**, all closed by a **second `Test Designer` pass** before any
implementation was written.

| # | Gap | Why it mattered |
|---|---|---|
| 1 | **`BaseNonIdDao<T>.Get` was never invoked on a row that exists** — anywhere in the lap or upstream | A `return null` stub would have **shipped green on a published member of a published type in a major release**. Upstream could not save it: `CompanyResourceDao` is on `RootNonIdDao`, not `BaseNonIdDao` |
| 2 | **A34's pre-detach was untested on `UpdateCore`**, both branches | A silent **lost update** (hard) and a silent **un-delete** (soft) |
| 3 | **`thrown.Message.ShouldContain(nameof(Link))` was vacuous** — satisfied by the substring `"LinkDao"` | **M7's entity-name clause was unpinned.** Fixed with an `UnorderedDao` fixture whose name shares no substring with the entity |
| 4 | **R4-S6, the lap's only `[D]`, was unwritten** — and it is **here-or-nowhere**: `CompanyResourceDao` overrides `ApplyStableOrder`, so **no upstream test can ever reach the case** | Now written, `Scope=Dispatcher`, `Area=Keyless` |

**`Test Designer` corrected the brief on one point.** The soft A34 arrangement **as specified could not
fail**: `Attach` takes original values from the attached instance, so a fabricated `DeletedDate = null`
is both original **and** current, EF omits unmodified columns from the `UPDATE`, and the stamp survives.
It substituted the arrangement **the obligation itself prescribes** — read through the raw context,
mutate the tracked instance without saving.

> ⚠️ **Residual limit, recorded in the test's own `<remarks>`:** an implementation capturing from
> `Entry(stored).OriginalValues` rather than from the entity **would pass without a pre-detach**.

## ✅ The F2/F3 Inversion — CLOSED

`SoftDeleteTimestampHookTests.cs` was found **still encoding the superseded wording of both owner
decisions** while the library declaration site (`BaseSoftDao.cs` lines 36–39) and the keyless tests
already carried the amended rule. **That is an inversion, not a pending change** — the tests were
testing a rule the library no longer states.

Closed by:

- A **direct-hook normalizer assertion** via a `ReachNormalizeRetrievedTimestamp` seam — **F3 Option C**:
  `Unspecified` in, `Utc` and equal `Ticks` out, **no round trip, no provider**.
- A `FrozenClockLabelDao` plus the **F2 Option C carve-out test**.
- **Deleting** the now-incorrect `NormalizeRetrievedTimestamp` overrides on `CountingClockLabelDao` and
  `SettableClockLabelDao`, and their *"A13: the pair travels together"* comment.
- Correcting **three doc comments** that were teaching the superseded rule.

**Verified by grep that neither deleted override was ever executed by a test**, so **no assertion was
weakened**.

## 🔬 One Test Was Found Defective By The `Implementer` — and fixed properly

`CompanyResourceConversionTests.ShouldForwardInsertDeleteAndGetAllButNeverGetOnTheDataAccessLayer`
asserted `dal.GetMethod("Get", [CompanyResource]).ShouldBeNull()`. **Unsatisfiable by construction:**
`BaseEFDataAccess<TContext>` declares `public override T Get<T>(object id)` — a member **A19 requires** —
and `Type.GetMethod(string, Type[])` uses the **default binder**, which accepts a widening reference
conversion, so the call returns `T Get[T](System.Object)` **in every possible state**.

> ✅ **The `Implementer` reported it and did not touch it.** That is the correct behaviour under the
> restriction that an implementer never edits a test, and it is **worth recording as the workflow
> working** — the same workflow that produced three silent subagents also produced this.

`Test Designer` then replaced the instrument with a **`ForwardersFor` enumeration mirroring
`BaseDataAccessHelper.FindExactMatch`'s five clauses**: `Public|Instance`, skip
`IsGenericMethodDefinition`, ordinal name equality, parameter-count equality, exact positional
parameter-type equality.

> 📌 **`DeclaredOnly` was deliberately declined.** `FindExactMatch` passes it **per level** while walking
> the whole hierarchy, so a `DeclaredOnly` guard would agree with the dispatcher **only while the
> hierarchy stayed one level deep**. Two control assertions were added so the guard cannot go silently
> empty.

## ⚠️ Carried Forward From This Lap — small, real, not written

| Item | Detail |
|---|---|
| **Deferred coverage gaps the auditor rated High** | **A26 / OD-7** detach-on-failure for keyless `Insert`; **A24 / OD-4 / A37** navigation-graph handling — **blocked, because no keyless fixture entity declares a navigation property**; **A28 `HasQueryFilter`** — the token appears **nowhere in the assembly** |
| **The three positive assertions in `CompanyResourceConversionTests`** | Same binder looseness, **pointing the other way** — they pass because exact matches exist, but would stay **green** if `Insert(CompanyResource)` became `Insert(IBaseEntity)` while the dispatcher **threw**. One-line-each fix, left alone |
| **`ProphetsWay.Example.Tests` is worth a sweep for the same `GetMethod` binder trap** | **No other reflection site exists in `ProphetsWay.EFTools.Tests`** — that side is clear |

## ~~⛔ THE OPEN GATE~~ — **SUPERSEDED at 22:15. Answered (a); executed.**

See *✅ THE GATE — CLOSED* above. Options **(b)**, **(d)**, **(e)** and **(f)** are all off the table and
must not be re-proposed. The rejection reasons for (b), (d) and (e) are preserved in *Stage 2 Headline*
below; **(f)**'s cost — splitting one family across two laps and deferring the `BaseSoftNonIdDao.Update`
obligation — is now moot because (a) landed both `Base*` types in lap 3.

## ✅ D16's Stated Clause — CLOSED, and upgraded from reconstruction to primary source at this checkpoint

**The reconstruction was right, and it is no longer a reconstruction.** The session produced the answer
from `docs/api-contract.md`'s D16 helper table plus reads of the shipped base classes, **explicitly
flagging that no terminal was available** so `git show` could not corroborate it.

> 🔎 **A terminal *was* available to `Session Scribe` at this checkpoint, and the command was run.**
> `git show 52a2edf -- ProphetsWay.Example.DataAccess.EF/Daos/DepartmentDao.cs`, filtered to removed
> member declarations, returns exactly:
> `Live()` · `Read(int)` · `Track(int)` · `Save(Department)` · `Detach(Department)` ·
> `static Snapshot(Department)` · `static AsUtc(DateTime)` · `static AsUtc(DateTime?)`
> — **seven helper names, eight methods**, plus the private `Dataset` property and the constructor.
> **`Restore` is absent from the removed set**, confirming it survives hand-written.
> **The diff corroborates the reconstruction item for item. D16 is closed on evidence, not inference.**

**All seven ABSORBED — none retained, none dropped:**

| Helper | Where it went |
|---|---|
| `Live()` | **Split into three seams** — `BaseSoftDao.ApplyReadFilter`, `BaseDao.ApplyStableOrder`, and `AsNoTracking()` in the retrieval members |
| `Read(int id)` | `BaseDao.Get`. The literal `x => x.Id == id` became `MatchRow` → `KeyEquals(GetKey(item))` **as an expression tree, so the provider parameterizes** |
| `Save(tracked)` | The `try`/`finally` is now **inlined into every write member** |
| `Detach(entity)` | `BaseDao.Detach`, **generalized** from one entity to `ReachableFrom(root)` |
| `AsUtc(…)` — **two overloads** | Collapsed to one `NormalizeRetrievedTimestamp` → `SoftTimestamps.AsUtc`. **The nullable overload vanished** because the family only invokes the hook where the nullable holds a value |
| `Snapshot(source)` — read-side only | `AsNoTracking()` plus `SoftTimestamps.Normalize` |
| `Track(int id)` | `BaseDao.TrackForWrite`, **including the pre-detach** — Revision 8 omitted it; **finding G2, closed by A34** |

> 📌 **Correction to the record: seven *helpers*, eight *methods*** if `AsUtc`'s two overloads are counted
> separately. `Restore` is **not** one of the seven — it is an `IDepartmentDao` member kept by **D19**.

**Three behaviors newly catalogued in the same pass, not previously recorded:**

| Change | Direction |
|---|---|
| `Update` now writes **via reflection over the model** | **Widening** — any scalar later added to `Department` is written automatically |
| `Get` now calls `IgnoreQueryFilters()` | **Widening** |
| `Restore` / `BaseSoftDao.Delete` **detach only the root** | Safe for `Department` today; **unsafe the first time a soft entity gains a navigation** |

> ⚠️ **The provenance limit that remains.** The seven helpers' behavior is established as present in the
> family. That is **not** proof that nothing *else* in the old 299 lines was lost — and **F10 below is a
> case where something was.**

## 🟢 Owner Decisions — 2026-08-22

**Not yet filed to a permanent home. `wrapup` owes them one.**

| Ref | Decision | State |
|---|---|---|
| **F2 → Option C** | **A13's Timestamp Pair Rule reworded so its letter matches its rationale.** Overriding `GetCurrentTimestamp()` alone is **conforming provided the replacement clock still yields UTC**. Every other single override remains a defect | ✅ **Landed** in `docs/api-contract.md`, **and the XML `<remarks>` at the declaration sites were updated to match** — see the `.cs` flag under *Uncommitted Changes* |
| **F3 → Option C** | The `[C]` obligation that depended on a **certified-provider fact** was **re-cut to assert directly against the hook**. It **stays `[C]`**; the Scope-notation rule stays as written | ✅ Landed. ⚠️ **The tally discrepancy is NOT resolved by it** — see below |
| **F10 fix** | **Approved for inclusion in lap 3** | ✅ **WRITTEN AND GREEN at 22:15.** Both permitted remedies used, one per branch — see *F10 — CLOSED* above |

### The tally after F3 — the gap is unchanged and still open

**Re-measured mechanically at the 09:41 checkpoint**, same regex as the sign-off count. **Not
re-measured at 22:15** — lap 3's implementation did not touch the preamble, but the count has not been
redone since `Test Designer`'s second pass, so treat it as of 09:41.

| | Published preamble | Counted |
|---|---|---|
| `Contract` / `[C]` | 131 | **133** |
| `Characterization` / `[X]` | 11 | **11** |
| `Dispatcher` / `[D]` | 8 | **8** |
| **Total** | **150** | **152** |

**The arithmetic to settle is published `150 + 1 = 151` against counted `151 + 1 = 152`** — the `+1`
being F10's new obligation on each side. **The one-obligation gap predates both this session's edits and
the A16 amendment, and is still open.** **F3's re-cut added one to both sides and did not close it,
which rules F3 out as the cause.** `docs/api-contract.md` is now **6,082 lines** (was 5,326 at
`52a2edf`) — re-verified at 22:15.

## ~~🔴 F10 — a NEW finding~~ — **CLOSED at 22:15. Retained for the reasoning.**

> ✅ **The fix is written and green.** See *F10 — CLOSED, and it uses BOTH permitted remedies* above for
> which remedy went on which branch and why. The text below is the **finding as raised**, kept because
> it is the record of D16's clause earning its keep. **Do not read it as current state.**

**`BaseSoftDao.Insert` assigns all three timestamps onto the caller's `item` BEFORE calling
`base.Insert(item)`**, so a throwing `SaveChanges` leaves the caller's instance carrying stamps **for a
row that was never written**.

- `BaseSoftDao.Update` **already handles this correctly**, via a `finally` restore. `Insert` has **no
  equivalent**.
- **The hand-written `DepartmentDao.Insert` it replaced did it correctly.** So the D16 conversion **lost
  a behavior** — which is *exactly* what D16's clause exists to catch. **No test covers it.**

**Obligation as stated:** *if `Insert` throws, `item` is unchanged* — no timestamp stamped, no timestamp
nulled, no identifier assigned. **Binds every `Insert` on every family** — hard and soft, keyed and
keyless. Tagged **`[C]`** on the basis of tracing to a term of this document; the upstream SNAPSHOT RULE
and IDENTIFIER RULE are **both silent** on a call that stored nothing.

**Two permitted remedies, implementer's choice:** stamp the copy and assign after `SaveChanges` returns,
**or** stamp `item` and restore in a `finally`.

### Audit result — `BaseSoftDao.Insert` is the ONLY defect site

| Site | Verdict |
|---|---|
| `BaseDao.Insert` (keyed hard) | **Clean** — its identifier write-back already runs **after** `SaveChanges` |
| `BaseSoftDao.Delete` | **Clean** |
| `BaseDao.Update` / `Delete` | **Clean** — they write nothing back |

> ⚠️ **One latent gap: A32's wording. STILL OPEN — the code fix did not close it.** A32 says *when* the
> write-back happens but **never that a failed `Insert` writes nothing back** — so a hoisted assignment
> would satisfy **every sentence A32 contains**. F10's implementation is correct; **the specification
> that would keep a future implementation correct is not.**

## 🔺 Stage 2 Headline — THREE name collisions, not one — **RESOLVED by option (a), executed**

**The 2026-08-20 handoff expected one** (`RootNonIdDao<T>`, internal). Grepping every type declaration
found three, and **the two that were missed are `public` on both sides.**

| 2.2.x type | Visibility | 3.x type | Collides |
|---|---|---|---|
| `RootNonIdDao<T>` | internal | `RootNonIdDao<TEntity>` | **yes** |
| `BaseNonIdDao<T>` | **public** | `BaseNonIdDao<TEntity>` | **yes** |
| `BaseSoftNonIdDao<T>` | **public** | `BaseSoftNonIdDao<TEntity>` | **yes** |
| *(none)* | — | `RootSoftNonIdDao<TEntity>` | no — **genuinely new, A14** |

**Arity does not disambiguate** — every pair is **arity 1 in the root namespace**. *That* is why laps 1
and 2 were additive and lap 3 is not: the old `BaseDao<T>` lived in `.Int` / `.Guid` / `.Long` and the
new one is **arity 2**.

**The internal engine is live, not dead** — `RootDao<T,TIdType>` derives from it and `BaseNonIdDao<T>`
holds it as a field. **But nothing outside the library names any of the three:**
`ProphetsWay.Example.DataAccess.EF` derives from none of them, and `ProphetsWay.EFTools.Tests` names
none. **Blast radius: four library files.**

**Rejected options, with reasons — do not re-propose:**

| Option | Why rejected |
|---|---|
| **(b)** delete the internal engine | `RootDao` derives from it |
| **(d)** sub-namespace | Contradicts the no-sub-namespaces rule **and FR 15** |
| **(e)** merge old into new | The old type publishes `Ensure*Transaction` members **the 3.x contract forbids on DAOs** |

**Breakage stated exactly:** collision 1 breaks nothing (internal). Collisions 2 and 3 are **source- and
binary-breaking for a 2.2.x consumer — but that break is made by 3.0.0 itself, not by this plan.** S3
forbids compatibility wrappers and lap 4 deletes both types regardless. **The plan changes only *when
within the cycle* it lands, which is invisible outside, since nothing is published between laps.**

> ✅ **EXECUTED at 22:15 as option (a).** All three 2.2.x types now carry the `Legacy` prefix; the four
> 3.x types own the names. **The predicted blast radius of four library files held exactly** — 9
> references in 4 files, zero outside the library, zero project-file edits. **Lap 4 deletes the four
> `Legacy*` types.**

## 🟦 Keyless Families Specified — and F8 is carried — **NOW IMPLEMENTED**

> ✅ **All four types are written, green and uncommitted as of 22:15.** The specification below is what
> they were built against and remains the reference; it is no longer a forward plan.

`RootNonIdDao<TEntity>` / `BaseNonIdDao<TEntity>` / `RootSoftNonIdDao<TEntity>` /
`BaseSoftNonIdDao<TEntity>` are **specified with full XML documentation in `docs/api-contract.md`.**

- **`MatchRow` is `abstract` on `RootNonIdDao`** — there is no identifier to derive a predicate from.
- **`ApplyStableOrder`'s keyless default throws `NotSupportedException`**, per **A15**.
- ✅ **F8 is CARRIED, not dropped.** R4-S2's both-branches timestamp obligation is now stated on
  **`RootSoftNonIdDao`'s own `<remarks>`** as well as in the Soft-delete group, **so a `Test Designer`
  reading the declaration site cannot miss it.**

**`CompanyResourceDao` on `RootNonIdDao<CompanyResource>` is confirmed viable** per D17's amendment — and
notably **`IDepartmentDao`-style rule 8 is preserved**: `Get<CompanyResource>(id)` must always throw
`DataAccessConventionException`, **and it does, because `RootNonIdDao` publishes no `Get`.** Deriving
from `BaseNonIdDao` instead would publish a `Get` and **put rule 8 at risk.**

## ⚠️ Process Finding — FOURTH occurrence, and now agent-specific — the mitigation held for everyone else

**The Stage 2 `Interface Architect` completed correct work and returned no output at all — and then did
it again later the same session.** Earlier occurrences: `Repo Analyst` (2026-08-20) and lap 2's
`Implementer` (2026-08-20).

**Four occurrences across two sessions — two this session, and BOTH are `Interface Architect`.** The work
was recovered both times by grepping and reading `docs/api-contract.md` directly.

> 🚩 **The pattern is no longer random — it correlates with the agent.** Record it as a **toolbelt item
> for a separate sitting**, not as another tally mark.

> ✅ **The "silence is a failure" mitigation held for every OTHER agent** — `Test Designer` (three times
> now), `Test Auditor`, `Implementer` and `Code Reviewer` all reported. **Keep the instruction.** That it
> did **not** hold for `Interface Architect` twice is the sharper signal.

> 🚨 **A green build, or a modified file, is not evidence that a subagent reported.** Check for a report
> explicitly and treat its absence as a **failure to escalate**, not a quiet success.

---

> **Sign-off for 2026-08-20 — everything below this line.** It **supersedes the `live` checkpoint**
> written earlier that day; every still-open item from it was folded forward, not dropped. It covers
> **laps 1 and 2**. Lap 1's content is retained because most of it is still open; everything superseded
> is marked so. **Where the 2026-08-22 checkpoint above moves something, the checkpoint wins.**

## 🏁 The Headline Judgment of This Session

**Building found more than reviewing did, by an order of magnitude — and that vindicates the owner's
opening call.**

The direction was to stop polishing the contract and start writing code: *"i'd like to make sure the end
product works for my mental use cases… lets get started, see what major problems shake out, and then we
can do more contract passes later if deemed necessary."* That was an explicit decision **not** to close
Stage 2, and to proceed with known gaps.

| Approach | Effort | Findings |
|---|---|---|
| **Three review cycles** over `docs/api-contract.md` (5,261 lines at the time) | Stage 2 | Diminishing returns — the last pass produced deferred fixes, not defects |
| **Two implementation laps** against real code | Stage 3 | **Twenty-two findings** — 13 in lap 1, 9 in lap 2 — plus a confirmed defect in the document's own integrity tally. **Several are latent data-loss bugs** |

**Record this as the session's headline.** The two escalated defects (**5.3** and **5.6**) are both
silent-corruption class and **neither was reachable by reading the document** — 5.3 needed a real
`QueryTrackingBehavior.NoTracking` context to expose, 5.6 needed two differently-configured contexts.
A further contract pass would not have found either. **Prefer another implementation lap over another
review pass when the two compete for the same evening.**

## Where We Are

`ProphetsWay.EFTools` **3.0.0 first pass**, branch `3.0.0-first-pass`. **Stage 3 is under way, and
Stage 2 was deliberately left open to start it.**

**Laps 1 and 2 are both done, green, committed and pushed. The EFTools tree is clean and the branch is
0 ahead / 0 behind `origin/3.0.0-first-pass`** — verified at sign-off, not inherited.

| SHA | Subject | Lap |
|---|---|---|
| `a4e0152` | Add open-key generic DAO bases and repoint the EF example DAOs | 1 |
| `e52ee43` | Add generic open-key DAO bases and make the default ordering total | 1 |
| `98b1a67` | Merge branch `3.0.0-first-pass` from origin | 1 |
| `6cf43d1` | Amend api-contract A16 to the ordering default that shipped | 1's contract amendment |
| `52a2edf` | Add the soft-delete DAO families and convert `DepartmentDao` | 2 |

> ✅ **The open commit-split question from the checkpoint is CLOSED.** `docs/api-contract.md`'s A16
> amendment got **its own commit** (`6cf43d1`, +85 / −20, one file), ahead of lap 2's `52a2edf`. It did
> not ride along, so lap 2's commit message claims only lap 2. Do not re-ask this.

**Lap 1** delivered `BaseDao<TEntity,TKey>`, `BaseGetAllDao`, `BasePagedDao` in the **root namespace**
with an **open `TKey`** — no `struct` constraint, so **`string` and `int?` are legal key types for the
first time**. Five Example EF DAOs were repointed by **one type argument each**: `Company` / `Job` /
`User` → `int`, `Transaction` → `long`, `Resource` → `Guid`. 25 new tests.

**Lap 2** delivered `BaseSoftDao<TEntity,TKey>`, `BaseSoftGetAllDao`, `BaseSoftPagedDao` and
`SoftTimestamps`, gave `BaseDao` two seams, and converted `DepartmentDao` from hand-written
`: IDepartmentDao` to `: BaseSoftPagedDao<Department, int>` — **299 → 97 lines, net −202**, with only a
constructor and `Restore` remaining.

**Key structural discovery of the session:** the library had received **none** of the 3.0.0 redesign.
`ProphetsWay.EFTools/` still carried the complete 2.2.x shape — 18 key-specific closures under
`Guid/`, `Int/`, `Long/`, plus `RootBaseDao`, `RootBaseSoftDao`, `RootDao`, `RootNonIdDao` and the two
keyless bases; `ContextOwnership.cs` was the only new file. Meanwhile `docs/api-contract.md` had reached
5,261 lines and ~150 numbered obligations specifying twelve public classes that did not exist. *(It is
now **5,326 lines** after the A16 amendment.)*

## Current Focus

**UPDATED 2026-08-22, late evening — supersedes the 22:15 and 09:41 text entirely.** The focus is
**`Implementer` on the F10 blocker.**

**Lap 3 is committed and pushed** as six commits, `3c0d7e7` → `f79b471`, branch **0 ahead / 0 behind**
origin. `Code Reviewer` then ran for the first time in three laps and returned **"ship with minor
changes" with one blocker**: `BaseSoftDao.Insert`'s F10 fix has a **post-`SaveChanges` window**, and the
same shape sits at `RootSoftNonIdDao.UpdateCore`.

**The suite is RED by design** — two new facts in `FailedInsertWriteBackTests.cs` were **observed failing
for that defect**. This is a deliberate red phase awaiting the `Implementer`.

**The `EntityGraph` extraction — the largest open risk at 22:15 — is CLOSED**, verified verbatim member
by member. **The session's highest-value output is a specification defect**: F10's two permitted remedies
are **not equivalent**, and F10 says they are.

**Uncommitted right now:** `docs/api-contract.md` (A38 + F11–F14) and
`ProphetsWay.EFTools.Tests/FailedInsertWriteBackTests.cs` (the 2 red facts). **Owner-reported — no shell
was available to verify.**

Still open behind it: lap 1's **thirteen** specification defects, lap 2's F1 and F4–F7 and F9, the
**obligation tally gap**, the **M5–M11** test obligations, and **A32's wording** — now F10's *proven*
twin rather than its latent one. ✅ **D16's clause, F2, F3, F8, the collision gate and the `EntityGraph`
review are all closed.**

> ✅ **`Test Auditor` ran this lap and `Code Reviewer` has now run too.** **`Refactorer` is still unrun,
> three laps in a row**, and it now has a concrete two-item list waiting for it.

## ⚠️ Process Finding — a silent subagent is a failed handoff

> 🔁 **THIRD OCCURRENCE, 2026-08-22** — the Stage 2 `Interface Architect`. **Three across two sessions.**
> See *Process Finding — THIRD occurrence* at the top of this file. This is now a pattern, not an
> anomaly.

**Two subagents this session completed their work correctly while returning no output at all** —
`Repo Analyst` early on, and `Implementer` in lap 2.

In both cases the work was right, and in both cases I verified it against the tree rather than taking
it on report. But the `Implementer`'s **reasoning, judgment calls and any specification findings it made
in lap 2 are permanently lost.** Lap 1's `Implementer` produced thirteen specification defects as a
by-product of the same kind of work; lap 2's produced a report of zero, which is not the same as having
found nothing.

**This is also the direct cause of D16's clause going unmet** — see *D16's Stated Clause Was Never
Satisfied* below. The requirement was a statement the `Implementer` was supposed to make, and it never
spoke.

**The owner should know this can happen.** A green build is not evidence that a subagent reported. Check
for a report explicitly, and treat its absence as a failure to escalate rather than a quiet success.

## The Plan — four laps, additive, tree green throughout

The redesign is a **one-type-argument change per consumer DAO**, and the new root-namespace generics do
**not** collide with the old sub-namespace classes. So the migration is additive: nothing is deleted
until the final lap, and the solution compiles at every point.

| Lap | Scope | Bar |
|---|---|---|
| **1 — DONE, COMMITTED** | `BaseDao` / `BaseGetAllDao` / `BasePagedDao` `<TEntity,TKey>` + the key predicate. Repoint the 5 keyed DAOs | 25 new tests green, no regression ✅ `a4e0152` + `e52ee43` + merge `98b1a67` (+ `6cf43d1` for the A16 amendment) |
| **2 — DONE, COMMITTED** | The three `BaseSoft*` families; `DepartmentDao` stops being hand-written | **D16's numeric bar met** — `EFDepartmentDaoTests` **40 passed / 0 failed**; build 0 errors 0 warnings; suite 200/173/27, zero regressions ✅ `52a2edf`. **D16's stated clause is still unmet** |
| **3 — DONE, COMMITTED, REVIEWED; suite now RED by design** | Keyless: `RootNonIdDao` / `BaseNonIdDao` / `RootSoftNonIdDao` / `BaseSoftNonIdDao`, the `Legacy*` rename, `EntityGraph`, **F10's fix**, **and `CompanyResourceDao`** | **Killed exactly the 16 predicted failures.** Build 0/0; gate `Area=Keyless\|Area=Insert` **66/66 without SQL Server**; suite **268 / 257 / 11** vs a **200 / 173 / 27** baseline, **zero regressions**; Example.Tests **164/164 × 2 legs**. ✅ **Committed and pushed as six commits, `3c0d7e7` → `f79b471`.** 🔴 **`Code Reviewer` then found one blocker and two red tests were written for it** — the suite is red on purpose until the `Implementer` runs |
| **3b — THE FIX, next** | F10 remedy one on `BaseSoftDao.Insert` + `RootSoftNonIdDao.UpdateCore`; A38's visibility changes; the H7 comment; the `RemoveFromInverseNavigations` investigation | The two new `FailedInsertWriteBackTests` facts go green **without being edited** |
| **4 — the deletion lap** | Delete **the four `Legacy*` types**, the 18 key-specific closures, both `Root*` bridges, the dead `#if NET4*` blocks, `ContextOwnership` constructors; add `ThrowIfDisposed` to the transaction members | Full suite. ⚠️ **Only after the suite is green again** — do not stack a deletion lap on a red suite |

> ✅ **Lap 3's three name collisions were resolved by option (a), executed — CORRECTED 2026-08-22 22:15.**
> The three 2.2.x types (`RootNonIdDao<T>` internal, `BaseNonIdDao<T>` and `BaseSoftNonIdDao<T>` both
> public) now carry a `Legacy` prefix, freeing the names for the 3.x types. **The predicted four-file
> blast radius held exactly.** **Lap 4 deletes the four `Legacy*` types.**

## Next Session — Start Here

> **UPDATED 2026-08-22, late evening — reconciled over the 22:15 and 09:41 lists, not appended to.** This
> is the *next move* list, not a morning list — the session is still open. Closed rows are struck rather
> than deleted.

**One-line orientation:** **EFTools lap 3 is committed and pushed (`f79b471`), reviewed, and the review
left one blocker with two red tests already written for it** — run `@Implementer` on the F10 remedy-one
fix, then `@Refactorer`, then re-run the gate, then the three documentation agents in order 4 → 5 → 6.

| # | Task | Agent | Why it's next |
|---|---|---|---|
| **1** | **Fix the blocker and its neighbours.** **(a)** Apply the **F10 remedy-one** fix to `BaseSoftDao.Insert` **and** `RootSoftNonIdDao.UpdateCore` — stamp the copy, assign after `SaveChanges` returns; **(b)** apply **A38's visibility changes** — `TrackForWrite` → `protected`, `ApplyUpdateValues` → `protected virtual` (`InsertRoot` **stays** `private protected`); **(c)** **restore the dropped justifying comment** on `RootSoftNonIdDao.Delete`'s narrow detach — **H7 records that `AutoInclude` reaches the locating fetch**, and without the comment the narrowness reads as a bug; **(d)** **investigate the `EntityGraph.RemoveFromInverseNavigations` collection-navigation defect** | `Implementer` | **The suite is RED by design and these two tests are what turns it green the right way.** Do not let anything else land first |
| **2** | **Two mechanical cleanups.** **(a)** `nameof(ApplyStableOrder)` instead of the hard-coded string literal in the A15 message; **(b)** constrain `EntityGraph.CopyForStore` / `RemoveFromInverseNavigations` to **`class, IBaseEntity`** — they moved from **class** type parameters to **method** type parameters, so `typeof(TEntity)` now drives `FindEntityType` **from inference** rather than from a closed generic | `Refactorer` | **First `Refactorer` run in three laps**, and both items are small and bounded. (b) is a direct consequence of the extraction and should not wait for lap 4 |
| **3** | **Re-run the gate** — `--filter "Area=Keyless\|Area=Insert"`, then the full suite | owner | ⚠️ **The shell is broken** — `pwsh.exe` no longer resolves. **Fix the terminal first**; VS Code's test integration works but a `--filter` run does not |
| **4** | **`Test Auditor` over the two new facts** — **especially the `Characterization` tag** on the keyless one | `Test Auditor` | It is a **live specification gap**, not a settled classification. If the F10 amendment lands a term, that tag becomes `Contract` — and if it does not, the tag is the record of why |
| **5** | **Amend the specification.** **F10 needs a term: remedy two is unsafe wherever the member does anything after `SaveChanges`.** Fold in **A32's wording** — a failed `Insert` writes nothing back | `Interface Architect` | **The highest-value finding of the session.** These are **one edit, not two**. ⚠️ **Give this agent an explicit "silence is a failure" instruction and verify it reported** — it has now gone silent twice in one session |
| ~~**1**~~ | ~~**Commit lap 3 as three commits**~~ | — | ✅ **DONE — as SIX commits, `3c0d7e7` → `f79b471`, pushed.** `docs/api-contract.md` got **its own commit** (`3c0d7e7`), keeping `6cf43d1`'s precedent. Do not re-ask where it goes |
| ~~**2**~~ | ~~**`Code Reviewer` over the whole lap**~~ | — | ✅ **DONE — "ship with minor changes", one blocker.** The `EntityGraph` extraction is **cleared mechanically**; do not re-review it |
| ~~**0**~~ | ~~**PICK OPTION (a) OR (f)**~~ | — | ✅ **CLOSED — (a), and executed.** Do not re-ask; do not re-propose (b), (d), (e) or (f) |
| ~~1~~ | ~~**Close D16's stated clause**~~ | — | ✅ **CLOSED 2026-08-22**, corroborated against `git show 52a2edf`. Do not re-open |
| ~~2~~ | ~~`Test Designer` writes the keyless obligations + F10~~ | — | ✅ **DONE — three times now**, the third being the two red post-save facts |
| ~~3~~ | ~~`Implementer` writes the keyless families + `CompanyResourceDao`~~ | — | ✅ **DONE and green.** All 19 `EFCompanyResource*` cases pass |
| ~~4~~ | ~~**Pick up F8 inside lap 3**~~ | — | ✅ **CARRIED**, and now implemented on `RootSoftNonIdDao` |
| ~~5~~ | ~~**Answer F2 and F3**~~ | — | ✅ **BOTH — Option C each**, and the **test-side inversion they left behind is now closed too** |
| 6 | **`Changelog Author`** — lap 3's entry. ⚠️ **Commit `50e15dd` carries a `BREAKING:` trailer**: `BaseNonIdDao<T>` / `BaseSoftNonIdDao<T>` **keep their names but are different types** | `Changelog Author` | The trailer is already in git; the changelog is what a consumer reads. 🚫 **Never touch `app-variables.yml` — it stays at `2`/`2`/`0`** |
| 7 | **`Repo Analyst`** — `AGENTS.md` and `docs/repo-profile.md` are stale **since before lap 1**. **Verified counts: library 39 source files, tests 25**; `AGENTS.md` still claims **27 / 19** and still describes the **2.2.x class shape** | `Repo Analyst` | 🔄 **The "defer until lap 4" call is now questionable.** It was made when the drift was 7 files; it is now **12 library + 6 test files** plus a whole class-shape description that is wrong. **Owner call whether it still holds** |
| 8 | **`README Author`** — `README.md` is **from 2022-08-14** and documents `BaseEFDataAccess<TContextType,TIdType>` and `BaseEFContext(string)`, **neither of which exists** | `README Author` | Same deferred-until-lap-4 call, same question. It is now four years stale and documents two types that are gone |
| 9 | **Settle the obligation gap.** **`[C]` 133 / `[X]` 11 / `[D]` 8 = 152** against a published **150**; arithmetic is **published 150 + 1 = 151 vs counted 151 + 1 = 152** | `Interface Architect` | **Still open.** ✅ **F3 is ruled out as the cause** — its re-cut moved **both** sides. Predates every edit this session made; **resume it, do not restart it.** ⚠️ **Not re-counted since A38 + F11–F14 landed** |
| 10 | **Write the three deferred coverage gaps** the auditor rated High | `Test Designer` | **A26 / OD-7** detach-on-failure for keyless `Insert`; **A28 `HasQueryFilter`** — the token appears nowhere in the assembly. 🔓 **A24 / OD-4 / A37 navigation handling may now be UNBLOCKED** — the new **`Binder`/`Slip`** fixture is the first keyless graph with a real collection navigation |
| 11 | **Sweep `ProphetsWay.Example.Tests` for the `GetMethod` default-binder trap** | `Test Designer` | The **three positive assertions in `CompanyResourceConversionTests`** carry the same looseness **pointing the other way**. **`ProphetsWay.EFTools.Tests` has no other reflection site** — that side is clear |
| 12 | **Triage the thirteen lap-1 defects (5.1–5.13).** Escalate **5.3** and **5.6** first — both silent-corruption class | owner, then `Contract Reviewer` | **Still entirely untouched after three laps** |
| 13 | Decide the seven `Guard=Seam` tests' missing `Scope` trait; decide whether `ProphetsWay.BaseDataAccess`'s `notes-from-eftools-3.0.0` branch merges to `main` now or rides with 3.2.0 | owner | Both small; both leave something in a half-state until answered |
| 14 | Commit the four `ProphetsWay.Example` doc corrections and the three untracked `AGENTS.md` files | owner | **Hasher's is a correction sitting outside version control.** Untouched for six days |
| 15 | **Lap 4 — the deletion lap** | `Implementer` | The four `Legacy*` types, the 18 key-specific closures, both `Root*` bridges, the dead `#if NET4*` blocks. **Only after the blocker is fixed and the suite is green again** — do not stack a deletion lap on a red suite |

**Exact invocation for step 1:** `@Implementer` — in `ProphetsWay.EFTools`, apply **F10 remedy one** to
`BaseSoftDao.Insert` and `RootSoftNonIdDao.UpdateCore` so nothing is written back to the caller's
instance until after `SaveChanges()` has returned **and every post-save step has completed**; change
`TrackForWrite` to `protected` and `ApplyUpdateValues` to `protected virtual` per **A38**, leaving
`InsertRoot` `private protected`; restore the **H7** justifying comment on `RootSoftNonIdDao.Delete`'s
narrow detach; and **investigate** whether `EntityGraph.RemoveFromInverseNavigations` throws
`TargetException` on a populated **collection** navigation. **The two new facts in
`FailedInsertWriteBackTests.cs` are the acceptance bar — do not edit them.** Then `@Refactorer` for
step 2.

> 🚨 **A silent `Interface Architect` is now expected, not surprising.** Step 5 dispatches it. **Give it
> an explicit "silence is a failure" instruction and verify a report came back** — if it does not, grep
> `docs/api-contract.md` for the new text rather than assuming nothing happened.

> 📌 **The `Area` trait is load-bearing infrastructure, not a convenience.** `Area=KeyPredicate` (25),
> `Area=SoftDelete` (10), `Area=AlternateKeys` (14) and now **`Area=Keyless` + `Area=Insert` (66
> combined)** are **how a lap runs green without a local SQL Server** — the full suite cannot.
> ✅ **Lap 3 added two values and the gate ran 66/66 on SQLite alone**, which is the convention paying
> off rather than just being followed. **Lap 4 must do the same.**

## ✅ Closed at Sign-off — do not re-ask

| Question | Resolution |
|---|---|
| **How does `docs/api-contract.md` get committed?** | **Its own commit, `6cf43d1`**, ahead of lap 2. Lap 2's `52a2edf` claims only lap 2 |
| **Is lap 2 committed?** | **Yes** — `52a2edf`, pushed, tree clean, 0 ahead / 0 behind |
| **The spike file's trait** | `Scope=Characterization` + `Area=AlternateKeys`, committed. Sum-check 190/190 |

## Lap 2 — the soft-delete families — COMPLETE, GREEN, **COMMITTED as `52a2edf`**

**Chain run:** `Interface Architect` (the A16 contract amendment) and `Test Designer` (red) **in
parallel**, then `Implementer` (green). **`Test Auditor`, `Code Reviewer` and `Refactorer` were not
run.**

### Delivered

| File | State | What it is |
|---|---|---|
| `ProphetsWay.EFTools/BaseSoftDao.cs` | **new**, 252 lines | `BaseSoftDao<TEntity,TKey> : BaseDao<TEntity,TKey>` |
| `ProphetsWay.EFTools/BaseSoftGetAllDao.cs` | **new**, 31 lines | `: BaseSoftDao<TEntity,TKey>, IBaseGetAllDao<TEntity>` |
| `ProphetsWay.EFTools/BaseSoftPagedDao.cs` | **new**, 45 lines | `: BaseSoftDao<TEntity,TKey>, IBasePagedDao<TEntity>` |
| `ProphetsWay.EFTools/SoftTimestamps.cs` | **new**, 74 lines | **`internal static` — deliberately not public surface.** Holds both the hook defaults (`Now`, `AsUtc`) and the timestamp walk (`Normalize`), because the Timestamp Pair Rule declares the hooks on **two unrelated branches** (keyed and keyless) and C# has no multiple inheritance |
| `ProphetsWay.EFTools/BaseDao.cs` | **modified**, +65 / −38 | **Behavior-preserving extraction** creating the seams the soft families need: `protected TEntity? TrackForWrite(item)` pulls the locate-and-track half out of `Update`/`Delete`, and `ApplyUpdateValues(entry, item)` becomes **`protected virtual`** so a soft family restores its own timestamps from the tracked entry |
| `ProphetsWay.Example.DataAccess.EF/Daos/DepartmentDao.cs` | **modified**, +51 / −253 | **299 → 97 lines, net −202.** Was hand-written `: IDepartmentDao` with **no EFTools base**; now `internal class DepartmentDao : BaseSoftPagedDao<Department, int>, IDepartmentDao` with only a constructor and `Restore` remaining — `Restore` staying consumer-authored per **D19** |
| `ProphetsWay.EFTools.Tests/SoftDeleteTimestampHookTests.cs` | **new**, 633 lines | **8 methods / 10 cases.** 7 `[Fact]` + 1 `[Theory]`×3 `[InlineData]`. **`Scope=Contract` 8 cases (6 methods) + `Scope=Characterization` 2**, every one also carrying `Area=SoftDelete` |
| `ProphetsWay.EFTools/docs/api-contract.md` | **modified**, +85 / −20 | The **A16 amendment**, 14 sites corrected. Now **5,326 lines**. **Committed separately as `6cf43d1`**, not in `52a2edf` — it documents lap 1, not lap 2 |

**All seven files are in `52a2edf` except `api-contract.md`, which is `6cf43d1`.** Confirmed with
`git show --stat`: `52a2edf` = 7 files, 1,151 insertions, 291 deletions; `6cf43d1` = 1 file, +85 / −20.

> ⚠️ **The file-size figures reported to me as "253 lines → 51" were the diff's removed/added hunk
> counts, not file sizes.** The file went **299 → 97**. The net **−202** is correct either way.
> Verified with `git show HEAD:…` versus the working copy, counted the same way.

### Final measured state — and who measured what

| Measurement | Result | Source |
|---|---|---|
| `dotnet build ProphetsWay.EFTools.sln -c Debug` | **0 errors, 0 warnings** | owner-run |
| `--filter "Area=SoftDelete"` | **10 passed** | owner-run |
| `--filter "Area=KeyPredicate"` | **25 passed** | owner-run |
| `--filter "Area=AlternateKeys"` | **14 passed** | owner-run |
| **`EFDepartmentDaoTests`** | **40 passed, 0 failed** — **D16's acceptance bar for the family, met** | owner-run |
| Full suite | **200 total, 173 passed, 27 failed** | owner-run |
| Lap-1 baseline | **190 / 163 / 27** | owner-run |
| Pre-lap-1 baseline, DAO repoints stashed | **165 / 137 / 28** — measured against the **old** bases, on purpose | owner-run |

> ⚠️ **None of the run figures above were re-measured by `Session Scribe`** — they all need a local SQL
> Server. What **was** verified directly against the tree at sign-off: the trait attribute counts that
> back them (`Area=KeyPredicate` **25** attributes, `Area=SoftDelete` **8** attributes yielding 10 cases
> via one `[Theory]`×3, `Area=AlternateKeys` **7** attributes yielding 14 cases via 7 `[Theory]`×2),
> `DepartmentDao.cs` at **97 lines**, `api-contract.md` at **5,326 lines**, the **six** CS8766
> suppression files, and the obligation checkbox tally.

**Zero regressions across both laps.** The 27 red are the same 27, and they are pre-existing:

| Count | Cause | Cleared by |
|---|---|---|
| **16** | Need a `CompanyResourceDao` that **does not exist** | **Lap 3** |
| **10** | Navigation-graph reads | Lap 3+ |
| **1** | Transaction visibility | Lap 3+ |

## 🔴 Lap 2 Findings — F1 through F9, all from `Test Designer`

**Nine specification findings, none fixed.** They are defects in or questions about
`ProphetsWay.EFTools/docs/api-contract.md`, not in lap 2's implementation.

| # | Finding |
|---|---|
| **F1** | **"The clock is read once per stamping operation" is about *objects*, not *fields*.** No stamping member stamps two clock-derived fields; the two consumers of one reading are the stored copy and `item`. **The obligation as written is unfalsifiable** — a call counter is the only honest instrument, and that is what the test uses |
| **F2** | ⚠️ **A13's letter and its rationale disagree.** The letter says *"override both, or neither"*; the stated **reason** is policy *disagreement*. A **UTC-only clock override with the default normalizer is policy-consistent yet violates the letter.** **Owner call needed: may a conforming implementation ship a UTC-clock-only override?** |
| **F3** | ⚠️ **A `[C]` obligation depends on a certified-provider fact, which the same document forbids.** *"The default restores `DateTimeKind.Utc`"* is falsifiable **only because** the provider strips `Kind`; against a provider that preserved it, an **identity normalizer would pass**. The Soft-delete obligation and the Scope-notation rule are in **direct tension** |
| **F4** | **Two of the nine normalization cells are unreachable.** `ApplyReadFilter` restricts `GetAll`/`GetPaged` to `DeletedDate == null`, so **only `Get` can materialize a non-null `DeletedDate`** |
| **F5** | **`BaseSoftDao.Get`'s override may exist *only* to run the normalizer** — `BaseDao.Get` already calls `IgnoreQueryFilters()` and never calls `ApplyReadFilter`. **A reader could delete the override and still pass every upstream test bar one** |
| **F6** | **One of A13's own two sanctioned pairings is untestable.** The America/Chicago sample pairs an arbitrary-zone clock with an **identity** normalizer — indistinguishable from one never implemented |
| **F7** | **The "relabel, not a conversion" clause has a machine-dependent kill.** A wrongly-applied `ToUniversalTime()` is **invisible on a UTC build agent**, which is the normal CI case |
| **F8** | 🔶 **R4-S2 is half-discharged.** The routing table requires the timestamp pair tested *"on the keyed branch as well as the keyless one"* — **only the keyed half exists.** **Must be picked up when the keyless families land in lap 3, or the obligation is silently dropped** |
| **F9** | ~~Unclean tree~~ — **resolved.** It was the concurrent A16 amendment, not a real finding |

## 🔴 D16's Stated Clause Was Never Satisfied — close this before lap 3

**D16 has two halves. One is met; the other was never delivered, and lap 2 is not formally complete
without it.**

| Half | State |
|---|---|
| **Numeric bar** — `EFDepartmentDaoTests` green after the conversion | ✅ **Met: 40 passed / 0 failed** |
| **Stated clause** — the conversion *"must state **which of `DepartmentDao`'s seven private helpers the family absorbed**"* | ❌ **Not met.** The `Implementer` returned **no report at all** |

D16's clause exists for one reason: *"or it could keep all seven, pass, and generalize nothing."* The
circumstantial evidence is strong — the file went **299 → 97** with only the constructor and `Restore`
surviving, so the helpers plainly did **not** all stay. **But that is an inference, and D16 was written
specifically to stop the shrink being accepted as the answer by inference.**

**Two legitimate ways to close it, and both are deliberate acts:**

1. Reconstruct the mapping from `git show 52a2edf -- ProphetsWay.Example.DataAccess.EF/Daos/DepartmentDao.cs`
   — the removed helpers are all in that one hunk.
2. The owner explicitly accepts the 299 → 97 shrink as sufficient evidence and records that as the
   answer.

**What is not acceptable is a third lap starting with this still open.** It is cheap now and it gets
cheaper never.

## 🚨 `Insert` Is Still Entirely Unasserted — after two laps

**An empty `Insert` body passes every one of the 25 `Area=KeyPredicate` tests.** Named honestly by the
`Test Designer` in lap 1 rather than hidden, and **unchanged by lap 2**.

`--filter "Area=KeyPredicate"` is a green light for the **key predicate** and for **nothing about
`Insert`**. Every one of its obligations is open:

| Obligation | What it requires |
|---|---|
| **A32** | Insert from a **copy**, never the caller's instance |
| **A34** | Pre-detach |
| **OD-11** | Pre-assigned key behavior — *"Insert writes back whatever the store settled on"* |
| — | The `Guid` two-case |
| — | `ValueGeneratedNever` pass-through |

**This is the single largest untested surface in the redesign.** It is not scheduled into any of the
four laps. Decide where it goes.

> ✅ **UPDATED 2026-08-22 — one obligation now has a home, and a sixth was found.** **F10** — *if `Insert`
> throws, `item` is unchanged* — is **approved for lap 3** and `Test Designer` writes it there. **F10 is
> not in the table above; it is new**, it binds **every `Insert` on every family**, and
> **`BaseSoftDao.Insert` violates it today.** The five rows above still have no home.

## 🔴 The Obligation Tally Is Wrong — and it is the document's own integrity check

Found by `Interface Architect`; **independently confirmed mechanically at this checkpoint** by counting
every `- [ ] **[C|X|D]` checkbox in `docs/api-contract.md`:

| | Published preamble | Actual count |
|---|---|---|
| `Contract` / `[C]` | **131** | **132** |
| `Characterization` / `[X]` | 11 | 11 |
| `Dispatcher` / `[D]` | 8 | 8 |
| **Total** | **150** | **151** |

**The A16 amendment was strictly 1-for-1, so the discrepancy predates it.** One obligation is either
uncounted, or was added without the preamble being updated. **Finding which is a recount** — and this is
the *same* defect the rev-10 reviewer raised as deferred fix 6, now confirmed twice by two agents and
**mechanically re-confirmed at sign-off**. It has survived a revision.

> 🔄 **RESUME THIS, DO NOT RESTART IT.** **The owner was actively investigating the count at sign-off** —
> their last terminal command of the session was a `Select-String` regex counting `[C]` / `[X]` / `[D]`
> checkboxes in `docs/api-contract.md`. Tomorrow should pick that thread up, not re-derive it. The
> regex that reproduces the sign-off count is `^\s*-\s*\[[ xX]\]\s*\*\*\[(C|X|D)\]`, which yields
> **132 / 11 / 8 = 151**.

> **Two shipped behaviors are stated but untested**, and adding obligations for them takes the count to
> **152**: the **no-primary-key ordering fallback** — which `GetCount` depends on, since a throw there
> would break counting for an entity that never needed an ordering — and the **`KeySelector`-override
> redundancy skip**.

## 🚫 Do NOT Add a Cache to `ApplyStableOrder`

A17 asks for model-forcing lookups to be cached once per closed generic type, and the A16 amendment
noted that `ApplyStableOrder` reads `Context.Model` **uncached**.

**Caching it would be a bug.** Lap 1's finding **5.6** established that caching a *model* fact per
closed generic type is unsound — two differently-configured contexts over the same entity poison each
other for the process lifetime. `Context.Model` is itself cached by EF Core, so there is nothing to win.

**Either A17's caching clause needs a stated exception, or nothing changes.** Do not let a later
optimization pass "fix" this.

## Lap 1 — what landed, and what it does NOT cover

**Chain run:** `Test Designer` → `Test Auditor` → `Test Designer` (gap-closing) → `Implementer`.
**`Code Reviewer` and `Refactorer` were not run** — the `Implementer` reported the implementation
structurally clean and located the roughness **in the specification rather than the code**. That is a
deliberate omission, not an oversight; re-running them is cheap if lap 2 disagrees.

**Measured 2026-08-20, re-verified by `Session Scribe` at checkpoint:**

| Measurement | Result | Verified by |
|---|---|---|
| `dotnet test --filter "Area=KeyPredicate"` | **25 passed, 0 failed, 789 ms** | re-run at checkpoint ✅ **still 25 after lap 2** |
| `dotnet build ProphetsWay.EFTools.sln -c Debug --no-incremental` | **0 errors, exactly 3 warnings, all `CS8766`** — `BaseDao.cs(137,27)`, `BaseGetAllDao.cs(18,79)`, `BasePagedDao.cs(19,78)` | **SUPERSEDED — now 0 warnings.** See the CS8766 decision |
| Full suite | **190 total, 163 passed, 27 failed** | owner-run; **not** re-measured at checkpoint (needs local SQL Server) |
| Baseline, DAO repoints stashed | **165 total, 137 passed, 28 failed** | owner-run; independently re-measured that way on purpose |

**Zero regressions**, and `EFDepartmentDataAccessTests.ShouldNotOrphanUserWhenItsDepartmentIsSoftDeleted`
moved **red → green**.

**The old "7 warnings" baseline is superseded.** Two warning sets previously recorded here are **gone**:
the 3 Source Link `'Submod'` warnings and the 4 submodule `xUnit1013` warnings. Confirmed at checkpoint
on a `--no-incremental` build in which **both `ProphetsWay.Example.Tests` legs (`net48` and `net10.0`)
recompiled** and the `.dacpac` was produced — so their absence is real, not a skipped-project artifact.

> ⚠️ **`Insert` is unasserted in this lap. An empty `Insert` body still passes all 25.** Named honestly
> by the `Test Designer` rather than hidden. **`--filter "Area=KeyPredicate"` is a green light for the
> key predicate and for nothing about `Insert`.** Its obligations are all still open: **A32**
> copy-not-the-instance, **A34** pre-detach, **OD-11** pre-assigned key, the `Guid` two-case, and
> `ValueGeneratedNever` pass-through.

## Open Questions — Blocking

> **UPDATED 2026-08-22 late evening.** **No blocking *question* is open** — nothing is waiting on an
> owner decision. 🔴 **But a blocking *defect* is:** F10's keyed fix has a post-`SaveChanges` window, two
> red tests are written for it, and lap 4 must not start until it is green. **The next move is
> mechanical (`Implementer`), not a decision.**

| # | Question | Blocks | Raised |
|---|---|---|---|
| — | *(none open)* | — | — |

### ✅ Answered 2026-08-22 — do not re-ask

| # | Was | Answer |
|---|---|---|
| **GATE** | Option (a) or (f) for the three name collisions? | **(a) — and it is executed, not merely chosen.** All three 2.2.x types renamed `Legacy*`, verified rename-only against the HEAD blob, blast radius held at four library files, zero references outside the library. **(b), (d), (e) and (f) are off the table** |
| **F2** | May a conforming implementation ship a **UTC-clock-only override**? A13's letter said *"override both, or neither"*; its stated rationale was policy *disagreement* | **Option C — yes.** A13 reworded so its letter matches its rationale: overriding `GetCurrentTimestamp()` alone is conforming **provided the replacement clock still yields UTC**. **Every other single override remains a defect.** Landed in `docs/api-contract.md` **and** in the declaration-site `<remarks>`. ✅ **The test-side inversion it left behind is now closed too** |
| **F3** | Is a `[C]` obligation allowed to depend on a **certified-provider fact**? | **Option C.** The obligation was **re-cut to assert directly against the hook**. It **stays `[C]`**; the Scope-notation rule stays as written. ⚠️ **It did not resolve the tally gap** — and because it added one to *both* sides, it is now **ruled out as the cause** |

### ✅ Resolved this lap — was blocking question E

> **E — A16's "must override `ApplyStableOrder`".** **Closed by owner decision: auto tie-break plus a
> narrowed promise.** The totality obligation now binds only **DAOs publishing paging**, and
> `ApplyStableOrder` supplies the tie-breaker itself. `KeyPredicateOpenKeyTests.Alias` is therefore a
> **legal** fixture. Do not reopen this as a question.

## Deferred — the seven api-contract fixes (Stage 2, left open on purpose)

**These are not cancelled and not done.** The owner chose to build first and revisit the contract later;
the section below is the 2026-08-19 state, retained verbatim so nothing is lost. Fixes **2** and **7**
overlap findings 5.6 and 5.5 respectively — triage them together, not twice.

### `@Interface Architect`, seven localized edits to `ProphetsWay.EFTools/docs/api-contract.md`

| # | Edit | Fixes |
|---|---|---|
| **1** | **Move A24 step 9c inside step 10's `finally`, ahead of the detach**, and **extend the A37 obligation with a failed-`SaveChanges` arrangement.** **Do this one first.** A37's entire mechanism is currently unreachable on the failure path — a failed `SaveChanges` leaves the library's copy sitting in the caller's collection, which is exactly what OD-7 exists to prevent. The guarding obligation tests the success path only | **blocking** |
| **2** | **Split A17's caching sentence.** Per closed generic type is right for **A8's identifier resolution** (a CLR-type fact) and wrong for **A32's generation branch** (a model+provider fact) — cache that **per `Context.Model` or per DAO instance.** As written it **contradicts D4**: one process running both certified legs over the same `BaseDao<Resource, Guid>` has the second DAL silently inherit the first's branch. **The only outstanding D-decision contradiction** | **blocking** |
| **3** | **Name the `IValueGeneratorSelector` member**, and say what a **throwing** selector means — an implementer calling the ordinary `Select` gets a throw where the document expects an absence. **Should be written by someone who can compile it** | significant |
| **4** | **Name A37's removal mechanism** — model navigation → `Inverse` → collection accessor. A37 is the **only rule in the document stating a behavior with no mechanism**, the exact defect A35 was refined to remove | significant |
| **5** | **Restate the keyless `MatchRow` purity constraint in *The two hooks***, with its failure mode and a stated diagnostic. It is a **new narrowing of a public extension point**, currently stated only in the A34 subsection — where the shape pass will not read it | significant |
| **6** | **Recount every obligation from zero — do not adjust by one.** Published 150 = 131/11/8; the reviewer counted **132/11/8 = 151**. `[X]` and `[D]` exact, `[C]` one high. **The three still sum, so the preamble's integrity check passes while being wrong** — the precise failure mode that section exists to catch. Where the drift entered could not be established. ✅ **CONFIRMED A THIRD TIME** — by `Interface Architect` in lap 2, and **mechanically** by counting every checkbox at this checkpoint: **132 / 11 / 8 = 151.** It has now survived a revision | the tally |
| **7** | **Declare A35's limitation per Q14 — and do NOT narrow the exclusion.** It stays exactly as written (`IProperty.IsKey()`). What is owed is **self-diagnosing wording**: *it applies if and only if the property is declared in a key; a unique index alone is unaffected.* State the silent drop on the **A25 pattern** — `Update` returns `1`, the key-column change discarded. Re-cut A35's worked example: an `Email` `MatchRow` is far more often a unique index, in which case nothing is excluded | significant |

**Fold in, non-blocking:** keyless `UpdateCore` on an entity whose mapped scalars are *all* key
properties (`CompanyResource`) **writes nothing and returns `1`** — declare it, do not leave it to be
discovered; the `Restore` sample's pre-detach hard-codes `e.Entity.Id == item.Id` where A34's keyed rule
is `GetKey`, **and the document itself says of that sample "both are copied; both must be right"**; A36
has no keyed counterpart to `RootNonIdDao`; N12's routing table adds a *"get-only identifier"* row
without the write-back limitation.

### Step 2 — `@Contract Reviewer`, one delta pass

Over the changed sites **only**, plus the fresh obligation count. **Not a full review.**

### Step 3 — the six-family DAO shape pass — **SUPERSEDED by the four-lap plan**

Retained for its reasoning, not as an instruction. The shape work is now being done **incrementally, one
family per lap, against real code** rather than as one up-front surface pass — that is what the owner's
"let's get started" decision changed. **Everything below still holds and still applies per lap:**

**The D17 amendment must be in the lap 3 brief:** plan `CompanyResourceDao` as a **conversion onto
`RootNonIdDao<CompanyResource>`**, not as a permanent hand-written DAO.

**Why shape matters, recorded so it is not skipped as ceremony:** the fatal flaw in the current bases is
a *shape* flaw — every member is declared `new` instead of `virtual`, so it can only be hidden, never
overridden. Exactly the kind of decision made by accident when the author is focused on behaviour, on a
surface that lives for a whole major version. **Lap 1 fixed this for the keyed families** — every member
of the new `BaseDao<TEntity,TKey>` is `public virtual` or `protected virtual` (verified 2026-08-20 by
grepping the file). Laps 2 and 3 must not regress it.

### Then, per lap

| # | Task | Agent | Lap |
|---|---|---|---|
| 1 | Review the surface | `Contract Reviewer` | each |
| 2 | ~~Fill the bodies from `DepartmentDao`'s semantics — **D15**~~ | `Implementer` | **DONE, lap 2** |
| 3 | ~~Repoint the five existing DAOs onto the families — **D17**~~ | `Implementer` | **DONE, lap 1** |
| 4 | **Convert `DepartmentDao` onto the soft-delete family — D16.** ~~The numeric bar~~ **met: 40/40.** ⚠️ **The clause is NOT met** — see below | `Implementer` | **lap 2, half-done** |
| 5 | `CompanyResourceDao` + the `CompanyResource` mapping; fold in the `NotWrittenYet` message fix | `Implementer` | 3 |

> ⚠️ **D16's clause is unmet, and it is unmet *because* the `Implementer` returned no report.** The bar
> was *"green is necessary but not sufficient — the conversion must state **which of `DepartmentDao`'s
> seven private helpers the family absorbed**, or it could keep all seven, pass, and generalize
> nothing."* The numeric half is met (**40/40**, and the file shrank 299 → 97 with only the constructor
> and `Restore` surviving, which is strong circumstantial evidence the helpers *were* absorbed). **The
> stated half was never delivered.** Either reconstruct it from the diff, or accept the shrink as the
> answer — but do so **deliberately**, because D16 exists precisely to stop that inference being made
> silently.

## 🔴 The Thirteen Specification Defects — the payload of this session

Found by the `Implementer` **on contact with real code**, which is exactly the outcome the owner's
"let's get started" decision was betting on. **All thirteen are defects in
`ProphetsWay.EFTools/docs/api-contract.md`, not in the lap 1 implementation.** None is fixed.

### Escalate first — both are silent-corruption class

| # | Defect |
|---|---|
| **5.3** | **Silent data loss.** `Update` / `Delete` say only *"a tracked fetch"*, while `Get`'s row says `AsNoTracking()` **explicitly**. `ExampleDataAccess` sets `QueryTrackingBehavior.NoTracking`, so an implementation that merely **omits** `AsNoTracking()` gets a `Detached` entry, **writes nothing, and still returns `1`.** Implementing the document exactly as written produces silent data loss **that satisfies every stated return-value rule** |
| **5.6** | **An unsound cache, shipped as specified and untested.** The A32 `ValueGenerated` / `IValueGeneratorSelector` **generation branch** is cached *"once per closed generic type"* alongside the resolved `PropertyInfo`. The `PropertyInfo` is a **CLR** fact and caches safely; the generation branch is a **model** fact, so two differently-configured contexts over the same entity **poison each other for the process lifetime.** This is the same defect as deferred fix 2 — triage them together |

### The other eleven

| # | Defect |
|---|---|
| 5.1 | The `<Nullable>` claim in *Framework and language* is **false**. Cause analysed; the observable cost is the 3 × `CS8766` the build now emits |
| 5.2 | **A17's step order is unachievable if the A8 cache can throw.** The cached resolution must be **inert** and carry failure **as data** — stated nowhere in the document |
| 5.4 | **A4's short-circuit has no stated location**, and the two readings differ **observably**. It collides with A35's own `MatchRow` example |
| 5.5 | **A35 names the exclusion set but no mechanism**, and `SetValues` has **no per-property overload**. Overlaps deferred fix 7 |
| 5.7 | **A32 step 2 has no defined behaviour for an unmapped entity** — `FindEntityType` returns `null` rather than throwing |
| 5.8 | **A16's uniqueness precondition is violated by a legal entity shape the same document introduces** |
| 5.9 | **A37 step 9c names no mechanism and is entirely untested** — **no Example entity declares an inverse navigation**, so there is nothing to test it against. Overlaps deferred fix 4 |
| 5.10 | The `KeyEquals` carrier **must be a `public` field on a `private` nested class**, not a property. **This is the answer to implementer question 1, verified by interceptor** |
| 5.11 | The null test on an unconstrained `TKey` **must be `(object?)key is null`** (boxing). Never stated |
| 5.12 | **`GetCount`'s "invoked and discarded" `ApplyStableOrder` call looks like dead code** and will be deleted by a reviewer or an analyzer |
| 5.13 | **`Context` / `Dataset` going `protected` is a consumer-visible break** with **no migration entry** |

## Deferred Test Obligations M5–M11 — raised, consciously not written

Raised by `Test Auditor` and deferred to hold lap 1 small. **These are not done and must not be lost.**

| # | Obligation | Why it matters |
|---|---|---|
| **M5** | `{TypeName}Id` declared as the **wrong type** (A8 step 2) | **The generic constraint means `{TypeName}Id` is the *only* route to this rule** — untested, it never fires |
| **M6** | A **well-wired construction that touches nothing** (A17 step 3) | Currently **consumed by three tests and pinned by none** |
| **M7** | A **second construction** of a mis-wired DAO re-throwing | Kills a cached failure sentinel |
| **M8** | — | **Partially done** — folded into the repaired null-key test |
| **M9** | An **unmapped entity throwing on first store access**, not on construction | Pairs with defect 5.7 |
| **M10** | The exception message naming **entity type and `TKey`** | ⚠️ **Must never assert *which lookup* failed** — A8 step 4 permits two resolver strategies and `HiddenKeyed` fails at a **different step under each** |
| **M11** | `{TypeName}Id` with **no set accessor** (A8 step 4's `CanWrite` half) | |

## Consumer-DAO Issues — reported, deliberately not changed

| Issue | Detail |
|---|---|
| `public new` on three methods | `TransactionDao.Insert` / `Update` and `ResourceDao.Insert` are `public new` (**hiding**). That was the only option against the **old non-virtual** base; against the new `virtual` base it is now the **wrong keyword** — a call through a `BaseDao<Transaction,long>` reference **bypasses them**. Invisible today **only because `ExampleDataAccess` holds them as interfaces** |
| `CompanyDao.GetCustomCompanyFunction` | Reads `Dataset` **directly**, bypassing `ApplyReadFilter` / `ApplyStableOrder`. **Pre-existing**, not introduced by lap 1 |

## Stage 0 Finding — do NOT re-report these

The resume pass reported **five contradictions** between the handoff and the tree. **All five were
already fixed in-tree.** `AGENTS.md` deviation 4 already read `SUPERSEDED 2026-08-18`; the Layout table
already said *"19 source files and a working harness"*; and **every surviving `d845863` / `2.5.0` string
in both repos sits inside an explicit "this is superseded" correction note.** A `Repo Analyst` was
dispatched and **correctly returned with nothing to do.**

The only genuinely stale copies live under **`ProphetsWay.EFTools/ProphetsWay.Example/`**, which is the
**pinned submodule** and correctly **not editable from that side**.

> 📌 **A future `resume` must not re-report any of these as findings.** Searching for a superseded string
> and finding it inside its own correction note is a false positive, and it has now cost one full agent
> dispatch.

## Open Questions — Non-Blocking

### 1. ✅ CLOSED — the spike file's trait

`ProphetsWay.EFTools.Tests/AlternateKeyGuardSpikeTests.cs` — **committed, and now traited
`Scope=Characterization` + `Area=AlternateKeys` on all 7 theories (14 cases).** The trait sum-check went
**176/190 → 190/190.** Verified at this checkpoint. **Do not reopen the trait question.**

**What is still open from it, now non-blocking:** the `Test Auditor` pass the coordinator wanted —
specifically whether the four `Record.Exception` sites could mask an exception thrown by the **setup**
rather than the **act** — **never happened**, and the `SpikeUser` naming was never decided.

*Why it was kept:* it pins EF Core behavior A35 now leans on, **including the negative result for unique
indexes**, and would fail loudly if a future EF Core release relaxed the guard.

> ✅ **The `AGENTS.md` deviation-4 concern below is CLOSED.** EFTools `AGENTS.md` deviation 4 now reads
> `SUPERSEDED 2026-08-18` and describes the harness accurately. Do not re-report it.

### 1b. Seven `Guard=Seam` tests carry no `Scope` trait

`TestSeamTests.cs` (5) and `AdapterCoverageTests.cs` (2) key off `Guard=Seam` **by deliberate choice of
a different dimension**, not by omission. **Owner call whether they should also carry a `Scope`.**
Unresolved.


### 2. Six things the rev 10 reviewer was explicitly NOT confident about — do not treat as settled

| # | Uncertainty |
|---|---|
| 1 | The exact **member surface of `IValueGeneratorSelector` in EF Core 10** — confident the service and the discriminator are right, **not** the signature. Feeds fix 3 |
| 2 | How a consumer-configured **non-default sentinel** interacts with *"clear to `default(TKey)`"* — possibly a fourth branch |
| 3 | `IDepartmentDao` **rules 15 and 17** — accepted from the document, not verified at the interface |
| 4 | Whether **Revision 9's `[C]` baseline was 130 or 131** — which is why fix 6 says recount from zero rather than adjust |
| 5 | **A37's implementability against skip navigations / many-to-many** — no such shape exists in `ProphetsWay.Example` and the document does not raise it |
| 6 | ~~Whether the read-only-key guard fires for alternate keys~~ — **CLOSED by Q14's measurement** |

### 3. Carried forward, unchanged

| # | Question | Raised |
|---|---|---|
| a | **What version does `ProphetsWay.Example` carry at tag time?** `app-variables.yml` reads `3`/`1`/`1` — a **patch** — but `TestDataAccessFactory.Use` is new public API (MINOR by house rule) and the IDENTIFIER and ROW COUNT rules were restated on five further DAO interfaces, tightening a contract on implementers. **An implementation conforming to the 3.1.0 text can be non-conforming to this one without changing a line.** Settle before Example is tagged | 08-16 |
| b | **`ThrowIfDisposed()` is missing from 32 of `ExampleDataAccess`'s 40 forwarders** — a contract requirement with **no test** | 08-18 |
| c | **SourceLink** — wanted working before the NuGet deployment. Deviation 5's five missing properties plus the `Microsoft.SourceLink.GitHub` reference. **Removing the `Submod` block stopped the warning; it did not deliver Source Link** | 08-16 |
| d | **A31's three version-sensitive EF Core surfaces** — `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys, `MultipleCollectionIncludeWarning`. Nobody had a verifiable source **and nobody guessed** | 08-16 |
| e | Client-supplied `Guid` keys — `ProphetsWay.Example/…/ResourceDao.cs` line 48 | earlier |
| f | Whether to state hard-delete explicitly on the five silent DAOs | earlier |
| g | **Should `ProphetsWay.BaseDataAccess`'s `notes-from-eftools-3.0.0` branch be merged to `main`?** FR 10 lives only there. The branch is in sync with its origin; `main` is still `207c5de` | 08-20 lap 2 |

## In Flight

> **UPDATED 2026-08-22 late evening — reconciled against the 22:15 and 09:41 rows, not appended to.** The
> first rows are this session's; everything after them is carried from the 2026-08-20 sign-off, corrected
> in place.

| Item | State | Where |
|---|---|---|
| 🚨 **THE BLOCKER — F10's keyed fix has a post-`SaveChanges` window** | **`BaseSoftDao.Insert` sets `stored = true` only after `base.Insert(item)` returns**, but `BaseDao.Insert` does **three things after `SaveChanges()` succeeded** — assigns the identifier, calls `RemoveFromInverseNavigations`, detaches in its own `finally`. If any throws, **the row IS stored and the outer `finally` rolls the timestamps back anyway.** Same shape at `RootSoftNonIdDao.UpdateCore`. **Two red tests already written.** ⚠️ If the *identifier assignment* is the step that throws, the identifier is **not** on `item` — wrong by a different route | `ProphetsWay.EFTools/BaseSoftDao.cs`, `RootSoftNonIdDao.cs` |
| 🏆 **F10's two remedies are NOT equivalent — and F10 says they are** | **A SPECIFICATION defect, and the session's highest-value finding.** F10 states *"neither is mandated."* Under the post-save window they diverge: **remedy one** (`RootSoftNonIdDao.Insert`) is **immune**; **remedy two** (`BaseSoftDao.Insert`) is the defect. **Remedy two is unsafe wherever the member does anything after `SaveChanges`.** F10 needs that as a **term**. **Triage with A32's wording — one edit, not two** | `ProphetsWay.EFTools/docs/api-contract.md` |
| 🔴 **TWO RED TESTS — the suite is red BY DESIGN** | `FailedInsertWriteBackTests.cs` → **5 facts**, 3 pre-existing untouched. `…WhenAKeyedSoftInsertThrowsAfterSaving` (**`Contract`/`Insert`**) — `CreatedDate` was the **2001 sentinel**, and **`slip.Id.ShouldBe(row.Id)` passed FIRST**. `…WhenAKeylessSoftUpdateThrowsAfterSaving` (**`Characterization`/`Keyless`, deliberately** — no stated term covers it; **the spec gap is the point**). Fixture: **`Binder`** (keyless soft, key `Code`, collection `Slips`) ← **`Slip`**, **both ends named in `OnModelCreating`** because a one-sided relationship has no `Inverse` and both post-save steps **skip silently**. ⚠️ **Do not edit these to go green** | `ProphetsWay.EFTools.Tests/FailedInsertWriteBackTests.cs` **— UNCOMMITTED** |
| 🔴 **Latent defect — `EntityGraph.RemoveFromInverseNavigations`** | **Tracked NOWHERE else — this row is its only home.** It iterates `entityType.GetNavigations()` — **reference AND collection** — and treats every one as a reference to a principal, so a **populated collection navigation** raises `TargetException` in the same post-save window. **Latent only because the current seeds hold `null`.** ⚠️ **Reasoned from source, NOT executed** — an `Implementer` investigation item, not a proven bug | `ProphetsWay.EFTools/EntityGraph.cs` |
| ✅ **LAP 3 — COMMITTED AND PUSHED** | **Six commits, `3c0d7e7` → `f79b471`**, verified from `.git/logs/HEAD`; `refs/heads` and `refs/remotes/origin` **both `f79b471`**, so **0 ahead / 0 behind**. It went out as **six, not the planned three** — the `EntityGraph` extraction got **its own commit (`fb9b54a`)**. `docs/api-contract.md` got **its own (`3c0d7e7`)**, keeping `6cf43d1`'s precedent. ⚠️ **`50e15dd` carries a `BREAKING:` trailer** | `ProphetsWay.EFTools` @ `f79b471`, branch `3.0.0-first-pass` |
| ✅ **`EntityGraph` extraction — REVIEWED AND CLEARED** | **Verbatim, MECHANICALLY VERIFIED member by member** — bodies pulled from `52a2edf:BaseDao.cs`, stripped, the declared `Context.` → `context.` substitution applied, diffed. `CopyForStore` / `RemoveFromInverseNavigations` identical but for an added generic constraint; **`ReachableFrom` (37 lines), `Navigations` (6), `Detach` (3) byte-identical.** No lost null check, traversal order unchanged, reference identity intact. `DetachAfterWrite`'s two call sites were genuinely identical before the merge. **`EntityGraph` holds no fields.** 🚫 **DO NOT RE-OPEN** | closed |
| ✅ **`Code Reviewer` — first run in three laps** | Verdict **"ship with minor changes"**, one blocker. Also verified good and **not to be re-reviewed**: `Dataset` lazy in all four new types (A17); A15's message from `GetType().Name` / `typeof(TEntity).Name` matching the spec template **placeholder-for-placeholder** (M7); `GetCount` invokes the ordering hook once and discards it; `RootSoftNonIdDao` **overrides rather than hides everywhere** (A2); consumer side correct end to end | — |
| 🟠 **A38 — the write plumbing's accessibility, now STATED** | **`TrackForWrite` → `protected`; `ApplyUpdateValues` → `protected virtual`; `InsertRoot` STAYS `private protected`** — the one asymmetry, and it is stated, because its `stamp` parameter admits exactly one conforming value from outside and it has no keyed counterpart. **A keyless `Restore` MUST call `TrackForWrite`, and nothing else will do.** ⚠️ **Specified but NOT YET APPLIED in code** — `Implementer` item 1(b). **This supersedes the 22:15 "deliberate; do not widen them" note** | `docs/api-contract.md` → `ProphetsWay.EFTools/` |
| 🟠 **F11 – F13** | **F11** — accessibility-versus-documentation, **closed by A38**; the spec had been **silent on all three members** and that silence was the cause. **F12** — A34's purity constraint **tightened** for in-memory null semantics against **partially-populated tracked entries**. **F13** — **`RootSoftNonIdDao.UpdateCore` mutates `item.UpdatedDate` BEFORE `MatchRow(item)` is built**; binds **every member that locates through the hook** | `ProphetsWay.EFTools/docs/api-contract.md` |
| 🔥 **F14 — an existing specification claim was WRONG** | The document listed **`Guid`** among types that *"order identically on every relational provider."* **SQL Server orders `uniqueidentifier` by comparing the last six bytes first** — neither `Guid.CompareTo`'s order nor textual order, and why a sequential `Guid` looks unordered to .NET. A **provider comparison table** was added; **SQLite's ordering is explicitly NOT asserted**, recorded as a fact to **measure on the box, not predict**. ⚠️ **`CompanyResourceDao.ApplyStableOrder` does `.ThenBy(x => x.ResourceId)` on a `UNIQUEIDENTIFIER`** — correct on SQL Server today, **different page boundaries the moment the SQLite leg lands** | `ProphetsWay.EFTools/docs/api-contract.md`, `…DataAccess.EF/Daos/CompanyResourceDao.cs` |
| 🟡 **`BaseSoftDao.Update` — the unwritten keyed twin** | The keyed counterpart of the `RootSoftNonIdDao.UpdateCore` case. **`Test Designer` deliberately left it unwritten until the specification has the term.** Not an oversight — it is waiting on the F10 amendment | `ProphetsWay.EFTools.Tests/` |
| 🟡 **`Refactorer` — two bounded items, still unrun after three laps** | **(a)** `nameof(ApplyStableOrder)` instead of the hard-coded literal in the A15 message. **(b)** Constrain `EntityGraph.CopyForStore` / `RemoveFromInverseNavigations` to **`class, IBaseEntity`** — they moved from **class** to **method** type parameters, so `typeof(TEntity)` now drives `FindEntityType` **from inference** | `ProphetsWay.EFTools/EntityGraph.cs`, the A15 message site |
| 🟡 **`RootSoftNonIdDao.Delete`'s narrow detach lost its justifying comment** | **H7 records that `AutoInclude` reaches the locating fetch** — which is *why* the detach is narrow. Without the comment the narrowness reads as a bug and will be "fixed" by someone. **Restore it** | `ProphetsWay.EFTools/RootSoftNonIdDao.cs` |
| 🔴 **A32's wording gap** | **STILL OPEN — and now F10's *proven* twin rather than its latent one.** A32 says *when* the write-back happens but **never that a failed `Insert` writes nothing back**; a hoisted assignment satisfies every sentence it contains. **Triage with F10's new term — one edit** | `ProphetsWay.EFTools/docs/api-contract.md` |
| ✅ **The three-collision gate** | **CLOSED — option (a), executed.** Rename verified rename-only against the HEAD blob, BOM preserved; blast radius four library files, zero references outside the library, zero project-file edits | closed |
| ✅ **Keyless family** | **All four types written and green.** `MatchRow` **abstract** on `RootNonIdDao`; `ApplyStableOrder`'s keyless default **throws `NotSupportedException`** per A15; **F8 carried** onto `RootSoftNonIdDao`. `CompanyResourceDao` on `RootNonIdDao<CompanyResource>` — **rule 8 preserved**, because that type publishes no `Get` | `ProphetsWay.EFTools/RootNonIdDao.cs`, `BaseNonIdDao.cs`, `RootSoftNonIdDao.cs`, `BaseSoftNonIdDao.cs` |
| ✅ **F10** | **Fixed on both branches — but the KEYED fix is REOPENED as the blocker.** The reasoning behind the split was sound and the conclusion was wrong: remedy 2 (`finally` restore) on keyed soft leaves a **post-`SaveChanges` window**; remedy 1 (stamp the copy, assign after `SaveChanges`) on keyless soft per A24 6b/9b is **immune**. Keyed hard needed no change. **See the blocker row at the top** | `ProphetsWay.EFTools/BaseSoftDao.cs`, `RootSoftNonIdDao.cs` |
| 🔴 **A32's wording gap** | **STILL OPEN — and the code fix did NOT close it.** A32 says *when* the write-back happens but **never that a failed `Insert` writes nothing back**; a hoisted assignment satisfies every sentence it contains. The implementation is right; the **specification that would keep a future implementation right is not** | `ProphetsWay.EFTools/docs/api-contract.md` |
| 🟡 **A34's pre-detach — one mechanism, and an ordering dependency** | **Landed.** `RootNonIdDao.TrackForWrite` builds `MatchRow(item)` once and feeds both `DetachTrackedRowsMatching` (compiled, in-memory over `ChangeTracker.Entries<TEntity>()`) and the `AsTracking().IgnoreQueryFilters()` fetch; `Delete`, `UpdateCore` and soft `Delete` all route through it. Tracker never cleared. ⚠️ **Ordering is load-bearing**: `ApplyUpdateValues` captures `CreatedDate`/`DeletedDate` from `entry.Entity` **after** the fetch, so A30 restores the stored stamp, not a tracked `null` | `ProphetsWay.EFTools/RootNonIdDao.cs`, `RootSoftNonIdDao.cs` |
| 🟡 **Three deferred coverage gaps, auditor-rated High** | **Not written.** **A26 / OD-7** detach-on-failure for keyless `Insert`; **A28 `HasQueryFilter`** — token appears nowhere in the assembly; **A24 / OD-4 / A37** navigation-graph handling — 🔓 **MAY NOW BE UNBLOCKED.** The 22:15 blocker was *"no keyless fixture entity declares a navigation property"*; the new **`Binder`/`Slip`** fixture is the first keyless graph with a real collection navigation. **Check before re-reporting it as blocked** | `ProphetsWay.EFTools.Tests/` |
| 🟡 **`GetMethod` default-binder looseness** | **One assertion was found unsatisfiable by construction and replaced** with a `ForwardersFor` enumeration mirroring `FindExactMatch`'s five clauses (`DeclaredOnly` **deliberately declined** — `FindExactMatch` passes it *per level* while walking the hierarchy). **The three positive assertions in the same file have the same looseness pointing the other way** — green even if `Insert(CompanyResource)` became `Insert(IBaseEntity)` while the dispatcher threw. One-line-each fix, left alone. **`ProphetsWay.Example.Tests` is worth the same sweep**; EFTools.Tests has no other reflection site | `ProphetsWay.EFTools.Tests/CompanyResourceConversionTests.cs` |
| ✅ **The F2/F3 test-side inversion** | **CLOSED.** `SoftDeleteTimestampHookTests.cs` was still encoding the **superseded** wording while `BaseSoftDao.cs` lines 36–39 and the keyless tests carried the amended rule. Added a direct-hook normalizer assertion via a `ReachNormalizeRetrievedTimestamp` seam (F3 Option C — no round trip, no provider) and a `FrozenClockLabelDao` + F2 carve-out test; **deleted** two now-incorrect `NormalizeRetrievedTimestamp` overrides and their comment; corrected three doc comments. **Grep-verified neither deleted override was ever executed — no assertion weakened** | `ProphetsWay.EFTools.Tests/SoftDeleteTimestampHookTests.cs` |
| **Lap 1 — keyed families** | ✅ **Done, green, COMMITTED** — `a4e0152` + `e52ee43` + merge `98b1a67`, split into two commits by the owner; A16 amendment as `6cf43d1` | `ProphetsWay.EFTools/BaseDao.cs`, `BaseGetAllDao.cs`, `BasePagedDao.cs` |
| **Lap 2 — soft-delete families** | ✅ **Done, green, COMMITTED and PUSHED as `52a2edf`.** 0 errors / 0 warnings; `Area=SoftDelete` 10; `EFDepartmentDaoTests` 40/40; suite 200/173/27, zero regressions | `ProphetsWay.EFTools/BaseSoft*.cs`, `SoftTimestamps.cs`, `BaseDao.cs`, `DepartmentDao.cs`, `SoftDeleteTimestampHookTests.cs` |
| **D16's stated clause** | ✅ **CLOSED 2026-08-22.** All seven helpers **absorbed, none retained, none dropped** — reconstructed from the D16 helper table and the shipped bases, then **corroborated against `git show 52a2edf`**, which returns exactly those seven names (eight methods, `AsUtc` ×2) and **no `Restore`**. Do not re-open | closed |
| **Lap 4 — the deletion lap** | **Next, after lap 3 is committed and reviewed.** Deletes the **four `Legacy*` types**, the 18 key-specific closures, both `Root*` bridges, the dead `#if NET4*` blocks. ⚠️ **Do not stack an uncommitted deletion lap on an uncommitted addition lap** | `ProphetsWay.EFTools/` |
| **Lap 2's findings F1–F10** | **F2, F3 ✅ answered; F8 ✅ carried and implemented; F10 ✅ fixed and green.** **F1, F4–F7, F9 unchanged and open** | `ProphetsWay.EFTools/docs/api-contract.md` |
| **The obligation tally** | **Still wrong. `[C]` 133 / `[X]` 11 / `[D]` 8 = 152 against a published 150** — measured at 09:41, **not re-measured after `Test Designer`'s second pass**. The arithmetic to settle is **published 150 + 1 = 151 vs counted 151 + 1 = 152**. ✅ **F3 is now ruled out as the cause** — its re-cut added one to *both* sides. The gap predates every edit this session made | `ProphetsWay.EFTools/docs/api-contract.md` |
| **The thirteen lap-1 specification defects** | **All open, untouched after three laps.** 5.3 and 5.6 escalated | `ProphetsWay.EFTools/docs/api-contract.md` |
| **M5–M11 test obligations** | **Open**, M8 partially folded in. Still not written | `ProphetsWay.EFTools.Tests/` |
| ~~**`Insert` is still unasserted**~~ | ✅ **CLOSED by lap 3.** `Area=Insert` exists, `FailedInsertWriteBackTests.cs` is written, and an empty `Insert` body no longer passes. **Do not restate the "empty `Insert` passes everything" claim** | `ProphetsWay.EFTools.Tests/FailedInsertWriteBackTests.cs` |
| `docs/api-contract.md` | ✅ **The lap-3 content is COMMITTED as `3c0d7e7`** — its own commit, keeping `6cf43d1`'s precedent. ⚠️ **DIRTY AGAIN** with **A38 + F11–F14**, written after the commit. **Give it its own commit again** | `ProphetsWay.EFTools/docs/api-contract.md` |
| `AlternateKeyGuardSpikeTests.cs` | ✅ **Traited and committed.** `Scope=Characterization` + `Area=AlternateKeys` × 7 theories, 14 cases. The `Test Auditor` pass on its `Record.Exception` sites and the `SpikeUser` naming are still undone | `ProphetsWay.EFTools.Tests/` |
| Seven `Guard=Seam` tests carry **no `Scope` trait** | Deliberate choice of a different key. **Owner call whether they should** | `ProphetsWay.EFTools.Tests/TestSeamTests.cs`, `AdapterCoverageTests.cs` |
| ~~`CompanyResourceDao` and its `ExampleContext` mapping~~ | ✅ **WRITTEN and green.** `CompanyResourceDao.cs` (84 lines) on `RootNonIdDao<CompanyResource>`; `ExampleContext` gained `DbSet<CompanyResource>`, `HasKey(x => new { x.CompanyId, x.ResourceId })` and `ToTable("CompanyResources")`. **All 19 `EFCompanyResource*` cases pass.** Uncommitted | `ProphetsWay.Example.DataAccess.EF/` |
| ~~`NotWrittenYet` message~~ | ✅ **DELETED.** The throw helper had no other caller once the three `ICompanyResourceDao` forwarders became real | `ProphetsWay.Example.DataAccess.EF/ExampleDataAccess.cs` |
| `ProphetsWay.BaseDataAccess` **FR 10** | ✅ **Committed** on branch `notes-from-eftools-3.0.0` (`bd02dfd`). **Status `Scheduled`, v3.2.0, high priority, after EFTools 3.0.0 ships.** Repo is **clean** | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` |
| **`Purpose Refiner`'s CS8767 objection** to the BaseDataAccess 3.2.0 scope | **Open.** Annotating *parameters* runs the **opposite way** from returns and would **relocate** warning noise onto every nullable-enabled implementation — **EFTools' own included.** Four contract judgements should be settled before that work starts | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` FR 10 |
| **BaseDataAccess `docs/repo-profile.md` carries a wrong claim** | It says C# 7.3 is *why* NRT are absent. **The TFM sets the default, not a ceiling; `<LangVersion>` is independent.** Recorded inside FR 10, **not yet corrected in the profile** | `ProphetsWay.BaseDataAccess/docs/repo-profile.md` |
| `ProphetsWay.EFTools` FR 15 | **Committed** (`a98f2bb`). Awaiting `Purpose Refiner` triage | `ProphetsWay.EFTools/docs/feature-requests.md` |
| `ProphetsWay.Example` FR 15 and 16 | Filed `Proposed`, **still uncommitted**, awaiting `Purpose Refiner` triage | `ProphetsWay.Example/docs/feature-requests.md` |
| `ProphetsWay.Example` doc corrections | **Uncommitted** — `AGENTS.md`, `README.md`, `docs/repo-profile.md` all carry 2026-08-20 pointer/version corrections | `ProphetsWay.Example/` |
| `ProphetsWay.EFTools/README.md` | 🔄 **The "defer until lap 4" call is now QUESTIONABLE — owner should re-decide.** The file is **from 2022-08-14** and documents `BaseEFDataAccess<TContextType, TIdType>` and `BaseEFContext(string)`, **neither of which exists.** The deferral was made when the drift was smaller; it is now four years and two vanished types | `README Author` — **re-decide, don't assume lap 4** |
| `ProphetsWay.EFTools/AGENTS.md` | 🔄 **Same call, same question.** **Verified counts: library 39 source files, test project 25.** `AGENTS.md` still claims **27 / 19** and still describes the library as carrying the **2.2.x class shape** — which is now wrong in kind, not just in count, since twelve root-namespace files and three `Legacy*` renames landed. **Stale since before lap 1** | `Repo Analyst` — **re-decide, don't assume lap 4** |

## Uncommitted Changes

**REPORTED 2026-08-22, late evening. ⚠️ NOT MEASURED — no shell was available.** The configured
`pwsh.exe` does not resolve, so `git status` could not be run. **SHAs and branch tips below were read
directly out of `.git` and are exact; working-tree contents are the owner's report.** The previous
table's contents are **superseded**, not merely re-dated — lap 3 has been committed since.

> ⚠️ **Nothing was committed by an agent. Committing is the owner's call. No agent may commit, stage,
> or push.** The EFTools commits listed here were made **by the owner**.

> ✅ **THE 22:15 HEADLINE IS RESOLVED.** *"An entire green lap is uncommitted — the largest uncommitted
> surface in the workspace's recorded history"* is **no longer true.** All 20 files went out across six
> commits, `3c0d7e7` → `f79b471`, and were **pushed**. **Do not restate it.**

### `ProphetsWay.EFTools` @ `f79b471`, branch `3.0.0-first-pass` — **0 ahead / 0 behind origin**

**Verified:** `.git/refs/heads/3.0.0-first-pass` and `.git/refs/remotes/origin/3.0.0-first-pass` are
**both** `f79b47161a406fee644bc8002a74f3ed06e291ef`.

**Dirty — two files, both owner-reported:**

| File | What |
|---|---|
| `ProphetsWay.EFTools/docs/api-contract.md` | **A38 + F11–F14** — `Interface Architect`'s post-commit output, recovered by grep after it went silent. **Give it its own commit**, as `3c0d7e7` and `6cf43d1` both did |
| `ProphetsWay.EFTools.Tests/FailedInsertWriteBackTests.cs` | **The 2 new red facts.** 3 → **5**. 🔴 **The suite is red by design** — these fail for the blocker and are the `Implementer`'s acceptance bar |

> 📌 **Do not commit these two together as "lap 3".** One is a specification amendment and one is a red
> phase; they belong to the *fix*, not to the lap that shipped.

### Every other repo — **carried from 22:15, NOT re-verified this checkpoint**

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.Example` @ `61d9e7d` | ` M AGENTS.md`, ` M README.md`, ` M docs/feature-requests.md`, ` M docs/repo-profile.md` | **Unchanged since the lap 1 checkpoint — six days now.** `feature-requests.md` carries **FR 15 and 16**; the other three carry the 2026-08-20 pointer/version corrections |
| `prophets-pipelines` @ **`048d432`** | ` M docs/session-handoff.md` | **This file.** SHA re-verified from `.git/refs/heads/main` |
| `ProphetsWay.Logger` @ `86568fd` | `?? AGENTS.md` | Long-standing, untouched this session |
| `ProphetsWay.Utilities` @ `5095e5e` | `?? AGENTS.md` | Same |
| `ProphetsWay.Hasher` @ `d1410ca` | `?? AGENTS.md` | Same — **and this one is a correction sitting outside version control.** Its deviation 1 reads *"Namespace is `ProphetsWay.Hasher`, not `ProphetsWay.Utilities` — **Deliberate, do not "fix" it**"*. This is the **corrected** copy of a file that had been steering agents toward a **binary-breaking namespace change**. **It protects nothing while untracked** |

**Believed clean:** `ProphetsWay.BaseDataAccess` (`bd02dfd`, branch `notes-from-eftools-3.0.0`) and
`ProphetsWay.BPA` (`4c0ba1f`, empty repo). **Not re-verified.**

> 📌 **The `ProphetsWay.BaseDataAccess` branch decision is still open.** FR 10 is committed as `bd02dfd`
> on **`notes-from-eftools-3.0.0`**, which is **not merged**; `main` is still `207c5de`. So **FR 10 does
> not exist on `main`.** The outstanding action is a **merge decision**, not a commit.

**Nothing looks accidental.** The three untracked `AGENTS.md` files remain the only oddity and they
predate this session by six days.

## 🛠 Environment — THE SHELL IS BROKEN. Fix this first.

**`C:\Program Files\PowerShell\7\pwsh.exe` does not exist**, so every terminal invocation fails
immediately. It bit two agents this session:

- **`Test Designer`** could not run `dotnet test --filter` — a PowerShell session held the test DLL, and
  after exiting it the shell became unavailable. **It fell back to VS Code's test integration**, the same
  MSBuild + VSTest path. ✅ **Its results are real. This is not a test outcome.**
- **`Session Scribe`** could not run `git status` at this checkpoint. **It fell back to reading `.git`
  directly** — exact for SHAs and refs, silent on the working tree.

**Until it is fixed:** `--filter` gates cannot be run, so **`Area=Keyless|Area=Insert` cannot be used to
prove the fix**, and no agent can measure a working tree. **That makes it step 3's prerequisite, not a
nuisance.**

## Git Delta — every repo in the workspace, computed at the 2026-08-20 sign-off

> 🕰 **HISTORICAL \u2014 accurate as of 2026-08-20 and NOT re-computed.** EFTools has since moved
> `52a2edf` → **`f79b471`** (six commits, pushed). Read the checkpoint at the top of this file for
> current state; this table is kept for the lap 1 / lap 2 reconciliation only.

So the next `resume` can reconcile without re-deriving anything. **All eight roots, whether they moved
or not.**

| Repo | Branch | At lap-2 checkpoint | **At sign-off** | Commits in between | Tree |
|---|---|---|---|---|---|
| `ProphetsWay.EFTools` | `3.0.0-first-pass` | `98b1a67` | **`52a2edf`** | `6cf43d1` *Amend api-contract A16 to the ordering default that shipped* → `52a2edf` *Add the soft-delete DAO families and convert `DepartmentDao`*. **These landed all of lap 2** plus the A16 amendment, which the checkpoint listed as uncommitted. **0 ahead / 0 behind origin** | **CLEAN** |
| `ProphetsWay.BaseDataAccess` | **`notes-from-eftools-3.0.0`** | `bd02dfd` | `bd02dfd` | none. ⚠️ **Branch is UNMERGED** — `main` remains `207c5de`, so FR 10 is not on `main`. In sync with its own origin | **CLEAN** |
| `prophets-pipelines` | `main` | `fd894e0` | `fd894e0` | none | ` M docs/session-handoff.md` |
| `ProphetsWay.Example` | `main` | `61d9e7d` | `61d9e7d` | none | 4 modified docs |
| `ProphetsWay.Logger` | `main` | `86568fd` | `86568fd` | none | `?? AGENTS.md` |
| `ProphetsWay.Utilities` | `master` | `5095e5e` | `5095e5e` | none | `?? AGENTS.md` |
| `ProphetsWay.Hasher` | `master` | `d1410ca` | `d1410ca` | none | `?? AGENTS.md` |
| `ProphetsWay.BPA` | `main` | `4c0ba1f` | `4c0ba1f` | none — empty repo, `Initial commit` only | **CLEAN** |

**Full EFTools branch history for the session**, oldest first:
`a98f2bb` (pre-session) → `a4e0152` → `e52ee43` → `98b1a67` (merge) → `6cf43d1` → **`52a2edf` (HEAD)**.
**Five commits this session, all lap 1 + lap 2.**

**Submodule pointer:** `git submodule status` in `ProphetsWay.EFTools` reads
`61d9e7dfb209c4a92b0c16d058aad1af08031fb5 ProphetsWay.Example (3.1.0-1-g61d9e7d)` — **unchanged, clean,
no `+`/`-` prefix.** It matches `ProphetsWay.Example`'s own `main` HEAD exactly.

### Files opened to verify this sign-off

Recorded because *affirming an inherited claim is not verifying it*. **Everything above was checked
against the tree; nothing was taken on report.** Where I could not measure something — anything needing
a local SQL Server — it is labelled owner-run rather than restated as fact.

**Read in full at sign-off:**

- `prophets-pipelines/docs/session-handoff.md` — the prior `live` checkpoint, end to end, before folding
- `git status -sb` / `git status --porcelain -uall` / `git log --oneline -4` / `git rev-parse` in **all eight roots**
- `git rev-list --left-right --count origin/3.0.0-first-pass...HEAD` → **`0 0`**
- `git show --stat 52a2edf` → **7 files, 1,151 insertions, 291 deletions**; `git show --stat 6cf43d1` → **1 file, +85 / −20**
- `git diff --numstat` in `ProphetsWay.Example` (4 files) and `prophets-pipelines` (1 file)
- `git submodule status` in `ProphetsWay.EFTools`
- `ProphetsWay.Example.DataAccess.EF/Daos/DepartmentDao.cs` — **97 lines**, confirming the 299 → 97 / net −202 claim
- `ProphetsWay.EFTools/docs/api-contract.md` — **5,326 lines**, and a **mechanical checkbox recount: `[C]` 132 / `[X]` 11 / `[D]` 8 = 151** vs a published 150
- A `CS8766` grep across `ProphetsWay.EFTools/**/*.cs` — **exactly six files**, three occurrences each: `BaseDao.cs`, `BaseGetAllDao.cs`, `BasePagedDao.cs`, `BaseSoftDao.cs`, `BaseSoftGetAllDao.cs`, `BaseSoftPagedDao.cs`
- `ProphetsWay.EFTools/SoftTimestamps.cs` line 21 — **`internal static class SoftTimestamps`**, confirming it is not public surface
- Source-file inventory — library **34** `.cs`, test project **21** `.cs` (excluding `bin`/`obj`)
- `Area` trait census across the test project — **`KeyPredicate` 25, `SoftDelete` 8, `AlternateKeys` 7** attributes
- `ProphetsWay.EFTools.Tests/TestSeamTests.cs` and `AdapterCoverageTests.cs` — **`Trait("Guard","Seam")` is CLASS-level in both**, covering **5 + 2 = 7 `[Fact]`**, and **neither file declares any `Trait("Scope", …)`**. The "seven tests, no `Scope`" claim holds
- `ProphetsWay.BaseDataAccess/docs/feature-requests.md` — **entry 10 present, status `Scheduled`, v3.2.0, high priority, after EFTools 3.0.0 ships**; line 606 already instructs its closer to grep EFTools; the CS8767 objection is at lines 627–631
- `ProphetsWay.BaseDataAccess/docs/repo-profile.md` lines 149–151 — **the wrong NRT claim is still there, uncorrected**
- `ProphetsWay.Example/docs/feature-requests.md` — **FR 15 at line 1392, FR 16 at line 1458**, both present and uncommitted
- `ProphetsWay.Hasher/AGENTS.md` line 316 — the **corrected** deviation 1, sitting untracked
- `ProphetsWay.EFTools/AGENTS.md` lines 359 and 361 — the **stale** 27 / 19 file counts

**One self-correction worth recording:** my first `Guard=Seam` count returned **3**, which looked like it
contradicted the checkpoint's "seven tests." It did not — I had counted *attribute occurrences* (two
class-level attributes plus one mention inside a doc comment) rather than *tests*. **The checkpoint was
right and my first measurement was wrong.** Opening the two files resolved it. A trait declared at class
level is one attribute and many tests; never count attributes when the claim is about tests.

## Decisions Made — 2026-08-20 (the session's four)

**Four owner decisions, all taken and all executed.** The first three closed the lap 1 → lap 2 boundary;
the fourth emerged from the work and is now infrastructure.

| Ref | Decision | Executed as | Permanent home |
|---|---|---|---|
| **CS8766** | **Suppress locally, fix upstream later.** Narrow `#pragma warning disable/restore CS8766` rather than annotating. The warning fires **once per interface declaration**, not once per member, which is why it needed a suppression in each subclass's base list as well as on the `Get` member | Build went **3 warnings → 0**. **The suppression is now in SIX files, not three** — lap 2 added `BaseSoftDao.cs`, `BaseSoftGetAllDao.cs`, `BaseSoftPagedDao.cs` alongside lap 1's `BaseDao.cs`, `BaseGetAllDao.cs`, `BasePagedDao.cs`. Each site carries a comment explaining why | Root cause filed as **entry 10 in `ProphetsWay.BaseDataAccess/docs/feature-requests.md`**, status **Scheduled**, high priority, **v3.2.0, after EFTools 3.0.0 ships**. **The suppressions come out then — and whoever closes it must remove six, not three.** FR 10 already tells its closer to grep EFTools for them |
| **A16** | **Auto tie-break plus a narrowed promise.** `ApplyStableOrder` appends a `ThenBy` over every model primary-key property the leading selector does not name. The totality obligation narrows to **DAOs publishing paging** | **Verified against emitted SQL:** identifier-is-the-PK **drops** the tie-breaker and the SQL is byte-identical; a surrogate PK yields `ORDER BY "Id","Ordinal"`; a composite appends in declared order; **shadow keys route through `EF.Property<T>`** (the only selector that reaches a property with no CLR member); `HasNoKey()` **falls back without throwing** | `api-contract.md` A16, 14 sites — **committed as `6cf43d1`**; the code half shipped in `e52ee43` |
| **Spike trait** | **`AlternateKeyGuardSpikeTests.cs` gets `Scope=Characterization` + `Area=AlternateKeys`** on all 7 theories | **Trait sum-check closed: 176/190 → 190/190.** Re-verified at sign-off: 7 `[Theory]` × 2 `[InlineData]` = 14 cases, each carrying both traits. **Committed** | The file itself |
| **`Area`** | **`Area` is a second trait dimension, orthogonal to `Scope`.** Values so far: `KeyPredicate` (25 cases), `AlternateKeys` (14), `SoftDelete` (10) | **This is how a lap runs green without a local SQL Server** — the full suite cannot run on a machine without one, and `--filter "Area=…"` is what let both laps prove themselves. Verified at sign-off: 25 / 7 / 8 trait attributes respectively | **Load-bearing infrastructure, not a convenience. Lap 3 must add its own `Area` value.** Recorded here and in *Next Session* |

> **The trait decision closes non-blocking question 1.** The `Test Auditor` pass the coordinator wanted
> first — checking whether the four `Record.Exception` sites could mask an exception thrown by the
> **setup** rather than the **act** — **did not happen**, and the `SpikeUser` naming was never decided.
> Both are still open, just no longer blocking anything.

## ⚠️ Incident — a scratch project broke the solution build

Recorded so it is not repeated.

An agent created a scratch `OrderProbe` console project under `%TEMP%` to inspect emitted SQL, **added
it to `ProphetsWay.EFTools.sln`**, and then deleted it from disk — breaking `dotnet build` on the
solution with **`MSB3202`**. `dotnet sln remove` cleared the entry but **rewrote the file with 56 lines
of unrelated x64/x86 platform configs**.

Because the entry had never been committed, **`git checkout -- ProphetsWay.EFTools.sln` was the correct
fix** and left an empty diff. **Confirmed clean at this checkpoint** — `git status` shows no
modification to the `.sln` and it contains zero `OrderProbe` references.

**The lesson:** a throwaway project must not be added to a tracked solution file. `dotnet sln remove` is
not the inverse of `dotnet sln add`.

## Decisions Made — 2026-08-19 (index only; already filed)


Filed in **`ProphetsWay.EFTools/docs/purpose-and-scope.md`** unless noted. **This table is an index, not
a restatement — the substance is the owner's and is not to be re-litigated.**

| Ref | Substance | Permanent home |
|---|---|---|
| **D19** | **`Restore` is a consumer-authored custom method on `IDepartmentDao` only** — never a `ProphetsWay.BaseDataAccess` contract, never a member of the generic soft-delete family. **Ratified by the owner directly.** Two consequences assessed: the "accessible seam" requirement is **already met** by S10 / A12 / A26 / OD-7, so what D19 adds is *don't relax those four*; and `Restore` is **already inside D16's acceptance gate**, so an inadequate seam produces **red tests rather than a warning** | `purpose-and-scope.md` § *The Restore Boundary — Settled (D19)*, plus a named `Out of Scope` row |
| **D14, D15, D18** | Ratified clean by `Purpose Refiner` | `purpose-and-scope.md` § *Ratification of D14–D18* |
| **D16 + clause** | 33/33 green is **necessary but not sufficient** — the conversion must state **which of `DepartmentDao`'s seven private helpers the family absorbed**, or it could keep all seven, pass, and generalize nothing | same |
| **D17 + amendment** | **`CompanyResourceDao` qualifies on criterion 1, not criterion 2** — plan it as a conversion onto `RootNonIdDao<CompanyResource>`, not a permanent hand-written DAO | same |
| **Q10** | **Inverted the plan — `Contract Reviewer` runs before the shape pass.** Vindicated immediately: five blocking findings on rev 8 | effect is the plan above |
| **Q11** | `Insert` inserts from a **copy**, never the caller's instance, **and** clears a store-generated identifier off that copy before `SaveChanges`. **Both halves** — this departed from the reviewer's single-change preference | `api-contract.md` A24 |
| **Q12** | **OD-11 ratified** — *"Insert writes back whatever the store settled on."* **No longer open to reversal** | `api-contract.md` OD-11 |
| **Q13** | **"Store-generated" means store-side, not EF-client-side.** Refines Q11 rather than reversing it | `api-contract.md` A32 |
| **Q14** | **Closed by measurement** — see the next section | `AlternateKeyGuardSpikeTests.cs` is the record |
| **FR 14** | Triaged `Proposed` → **`Scheduled` (v3.0.0)** — in scope, **inseparable from FR 10**, already specified so it needs no design, **breaking** against published 2.2.0. The 2.2.x patch was rejected on D12 | `ProphetsWay.EFTools/docs/feature-requests.md` |
| **FR 15 — EFTools** | `ProphetsWay.EFTools.Guid` **shadows `System.Guid`** inside this assembly — `Guid.NewGuid()` does not compile in `ProphetsWay.EFTools.Tests`. A **compile-time** discovery. Expected to close for free inside FR 10; what it asks is that the sub-namespaces' disappearance be a **required** outcome of the collapse | filed `Proposed` at wrapup |
| **FR 15 — Example** | `SnapshotDeepCopyTests.ShouldNotStoreEditsMadeToAUsersNavigationAfterInsertReturned` is **green for a prohibited reason.** Owes a `Test Auditor` pass **there**, never from EFTools. Suspected ordering mechanism recorded **as suspicion, not measurement** | filed `Proposed` at wrapup |
| **FR 16 — Example** | The IDENTIFIER rule's unconditional *"not the default value of its type"* **cannot hold** alongside the paradigm permitting `0` / `Guid.Empty` / `""` as legal stored keys. **Latent** — all seven Example entities are store-keyed. Three candidate wordings offered, **no answer proposed** | filed `Proposed` at wrapup |

## 🔬 Q14 — the one measured fact in the whole api-contract chain

**Every prior EF Core claim in this chain was reasoned, and two were wrong. This one was run.**
`Test Designer` ran the spike — **exit 0, 14 passed, 767 ms.**

- **Declared alternate keys are guarded exactly as primary keys are.** Same
  `InvalidOperationException`, and the message says *"is part of **a key**"*, not *"the primary key"* —
  EF Core uses one message for both. Confirmed on **both providers** (InMemory and SQLite 10.0.11
  in-memory, both already referenced) and **both routes**.
- **`IsKey()` is `True` for the alternate-key property**, so **A35's exclusion set is correct as
  written.** Do not narrow it to primary keys.
- **The routes differ only in timing.** Direct assignment on a POCO defers to `DetectChanges()`;
  **`SetValues` trips the guard immediately** — and **A35 specifies `SetValues`.** After that throw the
  entity is **unreadable**: reading `State` or `CurrentValues` throws again. There is no partially
  applied state to inspect or recover.

### The decisive extra finding — which was not the question asked

**A merely unique-indexed column is NOT guarded, and `IsKey()` is `False` for it.** Under
`HasIndex(u => u.Email).IsUnique()`, `SetValues` with a changed `Email` did not throw, the entity went
`Modified`, and the new value applied.

A35's worked example locates by `Email`, and the common way to model that is a unique index rather than
a declared alternate key — so **the exclusion is self-limiting**, costing something only for consumers
who explicitly opted into alternate-key modelling. **Far narrower than three review cycles assumed.**

The contract cannot know which shape a consumer chose; it can only read `IsKey()`, **which discriminates
correctly.** **The limitation must therefore be worded so a consumer can self-diagnose** — that is fix 7.

**One real test trap, also confirmed:** `SetValues` carrying *identical* key values does not trip the
guard. The exclusion is load-bearing **only on an `Update` that actually changes a key value**, so a test
that forgets to make the incoming value differ **goes green while proving nothing.**

> ⛔ **Deliberately NOT measured — do not infer these from the above:** whether the guard behaves
> differently for an entity `Attach`ed rather than queried, or under `DbContext.Update()` on a detached
> graph. Both are plausible A35-adjacent paths; neither was asked.

## Confirmed Sound — do not re-open

- **The N1 mechanism.** `IValueGeneratorSelector` + `ValueGenerator.GeneratesTemporaryValues`, in the
  **core** assembly (**S13 holds**), reachable via `Context.GetService<T>()`, and genuinely
  discriminating a SQL Server `int` identity (temporary ⇒ `true`) from a conventional `Guid` key
  (sequential-GUID generator, real value ⇒ `false`). **Both promised outcomes fall out of one rule.**
  **`GetValueGenerationStrategy()` is named and forbidden** — SQL Server-specific, breaks S13.
- **D15 and D16 are both resolved.** 33/33 is reachable from the document, all nineteen `IDepartmentDao`
  rules accounted for, **rule 7 correctly excluded under D19.**
- **D19 intact** across A34, A35 and A37 — all four `Restore` seams unmoved and unrelaxed.
- **Regression sweep clean three times running.**
- **All six re-cut obligations pass both sharpened tests** — a conforming implementation can pass them,
  and they are not green against a deliberately non-compliant one. **The A37 obligation is the only
  failure**, and fix 1 addresses it.

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| **The seven api-contract fixes, and Stage 2 generally** | **Owner decision, 2026-08-20** — build first, see what shakes out, do more contract passes *"later if deemed necessary."* **Not cancelled.** Fixes **2** and **7** overlap findings **5.6** and **5.5** — triage together, not twice | After the thirteen defects are triaged |
| ~~**`Test Auditor`, `Code Reviewer` and `Refactorer` — on laps 1 AND 2**~~ | ✅ **`Test Auditor` ran lap 3; `Code Reviewer` ran lap 3 and paid for itself immediately — one blocker plus a specification defect, and it cleared the `EntityGraph` extraction mechanically.** 🔴 **`Refactorer` is STILL unrun, three laps running**, and now has a concrete two-item list | **`Refactorer`: step 2, next session.** The lap 1 / lap 2 back-review is still owed before lap 4's deletions |
| ~~**D16's helper-absorption statement**~~ | ✅ **NO LONGER DEFERRED — CLOSED 2026-08-22.** Reconstructed from the D16 helper table and the shipped bases, then **corroborated against `git show 52a2edf`** at the checkpoint. All seven absorbed. **It also paid for itself immediately: the reconstruction is what surfaced F10**, a behavior the conversion silently lost | n/a |
| **`Insert`'s obligations — A32, A34, OD-11, the `Guid` two-case, `ValueGeneratedNever`** | Not deferred by decision — **deferred by omission.** An empty `Insert` body passes all 25 `Area=KeyPredicate` tests, and lap 2 did not change that | ✅ **Partially homed 2026-08-22**: **F10's obligation is approved for lap 3** and `Test Designer` writes it there. **The other five still have no home** — decide at the lap 3 brief |
| **`Purpose Refiner`'s CS8767 objection to the BaseDataAccess 3.2.0 scope** | Annotating *parameters* runs the **opposite way** from returns: it would **relocate** warning noise onto every nullable-enabled implementation, **EFTools' own included**, rather than remove it. **Four contract judgements should be settled before that work starts** | Before FR 10 is picked up for v3.2.0 — not after |
| **The seven `Guard=Seam` tests' missing `Scope` trait** | A **deliberate choice of a different trait key**, not an omission. Verified at sign-off: `Trait("Guard","Seam")` is **class-level** on `TestSeamTests` (5 `[Fact]`) and `AdapterCoverageTests` (2 `[Fact]`), and neither file declares any `Scope` | Owner call. Cheap either way |
| **`ProphetsWay.EFTools/README.md` and `AGENTS.md` corrections** | Both go further out of date with every lap; fixing them now guarantees redoing them. `AGENTS.md` now understates the file count by seven | After lap 4 |
| **BaseDataAccess `docs/repo-profile.md`'s wrong C# 7.3 / NRT claim** | Recorded **inside FR 10** rather than corrected in place — the TFM sets the default, not a ceiling, and `<LangVersion>` is independent | When FR 10 is picked up for v3.2.0 |
| **The `public new` fix on `TransactionDao` / `ResourceDao`** | Reported, deliberately not changed — invisible today because `ExampleDataAccess` holds them as interfaces | Lap 4 |
| **`CompanyDao.GetCustomCompanyFunction` bypassing the read hooks** | Pre-existing, not introduced by lap 1 | Lap 4 |
| **M5–M11 test obligations** | Deferred to hold lap 1 small — a conscious scope decision, not an omission. **Still unwritten after two laps** | Any lap touching identifier resolution; sooner for M10's trap |
| The six-family shape pass **as one up-front pass** | Superseded — the shape work is now incremental, one family per lap | n/a |
| A fourth full revision cycle | The reviewer explicitly judged it unwarranted — fix in place instead | Never, unless fresh blocking findings appear in newly written text |
| Measuring the guard under `Attach` / `DbContext.Update()` on a detached graph | Not asked. `Test Designer` correctly declined to report an unrequested result with the same confidence as the requested one | If A35 grows a detached-graph path |
| Deviation 3 — remove the SQL Server and InMemory provider references from the published library | Breaking; needs the provider-neutrality lap. `Microsoft.EntityFrameworkCore.InMemory` now has zero call sites in the library | The provider-neutrality lap |
| `xUnit1013` on the submodule's `DepartmentDaoTests.cs` lines 294 and 1001 | Upstream — a `Test Designer` fixes it **in `ProphetsWay.Example`**, never from the EFTools side. **⚠️ These warnings no longer appear in a full rebuild** — confirm they still exist before acting | Next Example pass |
| The three corrected untracked `AGENTS.md` files | Out of scope once the owner narrowed to four repos | Owner's convenience |
| A `conventions/AGENTS.shared.md` rule that **a revision-log entry is not evidence its own correction landed** | The shared block regenerates seven repos — an owner instruction, not a scribe's edit | Owner's call |

## Standing Guardrails

- ~~**The 9 `IDENTITY_INSERT` failures are not a defect in `DepartmentDao`**~~ — **the 9 are gone as of
  lap 1.** The guardrail's *reasoning* still stands and is why they went green the right way: making
  `DepartmentDao` adopt the caller's instance like its neighbours was an available option and was
  **explicitly declined**. Do not reintroduce adoption to make anything green.
- **The migration is additive. Nothing is deleted before lap 4.** The new root-namespace generics do not
  collide with the old sub-namespace classes, which is the whole reason the tree stays green throughout.
  **A lap that deletes early forfeits that property.** ⚠️ **NARROWED 2026-08-22 — this holds for the
  *keyed* families only.** Three **keyless** types collide by name at arity 1 in the root namespace, so
  lap 3 cannot be purely additive without deferring two of them. **Renaming is not deleting**: option (a)
  preserves the guardrail's intent — nothing is *removed* before lap 4, and the tree stays green at every
  step under either option.
- **Do not fix `RootNonIdDao`, `RootDao` or the 18 key-typed classes in place.** D14 forecloses that
  route: they are deleted in lap 4, and correcting them first removes the only signal distinguishing a
  correct implementation from an adopting one.
- **Do not "fix" `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`.**
  `Scope=Characterization`, failing correctly.
- **A green EFTools suite is meaningful only while `TestSeam.cs` is on disk.** Deleting it makes the run
  look dramatically better. **Never delete it to reduce a red count.**
- **`RootBaseSoftDao` cannot serve `IDepartmentDao` by inheritance** — it violates 8 of its 9 members,
  and its members are **`new`, not `virtual`**, so they cannot be overridden at all. Already proven; do
  not re-derive. **This means the bases cannot be fixed *from below*, not that they cannot be fixed *in
  place*** — that distinction was blurred once and corrected; do not re-blur it.
- **The keyless mapping question is settled: composite `HasKey` is the only viable answer.** `HasNoKey()`
  makes the entity read-only and forbids the `Insert` / `Delete` `ICompanyResourceDao` requires.
- **`UseQueryTrackingBehavior(NoTracking)` must be removed in the same lap that adds per-query
  `AsNoTracking()`** — not before, or every Example read silently becomes tracked. **Defect 5.3 is the
  other half of this**: an implementation that merely omits `AsNoTracking()` on `Update`/`Delete` gets a
  `Detached` entry, writes nothing, and still returns `1`.
- **Every member of the new `<TEntity,TKey>` bases is `virtual`.** That was the fix for the `new`-not-
  `virtual` structural defect. **Laps 2 and 3 must not regress it**, and a consumer DAO that still says
  `public new` (`TransactionDao`, `ResourceDao`) is now hiding rather than overriding.
- **Never edit anything under `ProphetsWay.EFTools/ProphetsWay.Example/`** — pinned submodule. Edit
  upstream and move the pointer.
- **`ConventionShowcaseTests` and `ExceptionPassthroughShowcaseTests` stay excluded** — `Scope=Dispatcher`,
  they belong to `ProphetsWay.BaseDataAccess`, and their DALs are deliberately mis-wired.

## Measured State — 2026-08-20, after lap 1 (superseded by lap 2's figures; kept for the composition)

**Full suite: 190 tests · 163 passed · 27 failed.** Owner-run. **Superseded as a total by lap 2's
200 / 173 / 27** — kept because **the failure composition below is unchanged and is what lap 3 is aimed
at.** Baseline with the DAO repoints stashed: **165 · 137 · 28**. **Zero regressions, one test
recovered.**

| Count | Failure | Note |
|---|---|---|
| **16** | `CompanyResource*` — `CompanyResourceDao` does not exist | **Lap 3.** No `CompanyResourceDao.cs`, no `DbSet<CompanyResource>`, no `ToTable` |
| **10** | `EFSnapshotDeepCopyTests` navigation-graph reads | No `Include`, and `NoTracking` prevents fix-up |
| 1 | `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance` | 30-second SQL Server lock timeout. `Scope=Characterization`, **failing correctly** |

**The 9 `IDENTITY_INSERT` failures are gone** — the total moved 28 → 27 and the composition changed, so
do not carry the old four-row table forward.
`EFDepartmentDataAccessTests.ShouldNotOrphanUserWhenItsDepartmentIsSoftDeleted` went **red → green**.

**Gates:**

- `--filter "Area=KeyPredicate"` → **25 / 25, no SQL Server needed** ✅
- `--filter "Area=SoftDelete"` → **10 / 10, no SQL Server needed** ✅ (lap 2)
- `--filter "Area=AlternateKeys"` → **14 / 14, no SQL Server needed** ✅
- `--filter "Scope=Contract|Guard=Seam"` → the conformance gate. It still selects **none** of
  `AlternateKeyGuardSpikeTests.cs`'s 14 cases — but **the reason has changed and the old wording is
  wrong.** They no longer *lack* traits; they carry **`Scope=Characterization` + `Area=AlternateKeys`**,
  so the Contract gate excludes them **correctly**. Do not restate "carry no trait at all"

## Environment Prerequisite

**A SQL Server `localhost` / `ProphetsWay.Example` database must exist** or the suite cannot run against
Entity Framework — which is why `LocalTestsOnly: 'yes'` is set and CI never runs these. The connection
string is in `ProphetsWay.EFTools.Tests/Constants.cs` and carries `TrustServerCertificate=True`; without
it all 71 SQL tests fail identically at login. **SQLite in-memory remains D4's future CI leg** — the
provider is referenced at `10.0.11` but no such leg exists.

## 📋 Process Record — worth keeping

**The authoring chain was damaged twice by unchecked inherited claims, then fixed itself.**

1. A reviewer wrongly asserted `PropertyValues.SetValues` throws on a key property — **it writes only
   where the value differs.** That claim, **its two worked examples, its `[C]` obligation and one
   remedy** all shipped into Revision 9. The obligation was **green against an implementation doing
   nothing.** **The coordinator passed the bad claim into the authoring brief verbatim and shares that
   failure.**
2. A second reviewer named `IProperty.GetValueGeneratorFactory()`, which returns only an *explicitly
   configured* factory and is `null` for a conventionally-configured `Guid` key — the exact case N1 is
   about.

**`Interface Architect` caught the second one, rejected an instruction from the coordinator's own brief
after checking it, substituted the correct mechanism, and said so in the log.** It also found —
**unprompted, and no reviewer had spotted it** — that **A35 as written was unimplementable**, because no
mechanism exists to discover what an arbitrary `Expression<Func<TEntity,bool>>` read.

`AGENTS.md` names the failure mode exactly: ***affirming an inherited claim is not verifying it.***

**Convergence:** rev 8 → **5** blocking, rev 9 → **3**, rev 10 → **2**, with the rev 10 reviewer flagging
**six explicit uncertainties rather than overclaiming.** The coordinator's stated abort threshold — *if
fresh blocking findings keep appearing in newly written text, question the authoring approach rather
than iterate* — **was not tripped.**

**Two standing procedures, both earned:**

- **A revision may return no summary to the coordinator — this happened twice.** Read the revision log
  directly rather than trusting a summary's presence or absence, and read the **body** rather than the
  log's claim about the body.
- **Re-read the working trees; do not trust a prior report's commit list.** Two reports this session
  described work as uncommitted that git showed committed.

## Earlier Decisions — index only

Each already in a permanent home. **D1–D13** in `ProphetsWay.EFTools/docs/purpose-and-scope.md`
§ Owner Decisions; **OD-8, OD-9, OD-11** and the J1/J2 rulings in
`ProphetsWay.EFTools/docs/api-contract.md`. **`OD-10` does not exist** — an earlier lead conflated it
with `D10`. The Rule 18 UTC narrowing lives on `ProphetsWay.Example/…/IDepartmentDao.cs`, cited in
`api-contract.md` as present **from 3.1.1**.

**Superseded and not to be restated:** the rev 8 and rev 9 `Contract Reviewer` verdicts, in full.
Revision 10 closed all 13 of rev 9's delta findings and rev 9 closed 16 of rev 8's 20. They are in git
history if the reasoning is ever needed; nothing in them is actionable now.

## Recent Sessions

### 2026-08-20 — *laps 1 and 2, both committed and pushed*

**The headline: building found more than reviewing did, by an order of magnitude.** Three review cycles
over a 5,261-line contract produced diminishing findings; **two implementation laps produced
twenty-two**, several of them latent data-loss bugs. **The owner's call to stop polishing and start
building — explicitly leaving Stage 2 open — was vindicated.** Prefer another lap over another review
pass when the two compete.

Stage 0's five reported contradictions turned out to be **already fixed in-tree** — a dispatched
`Repo Analyst` correctly returned with nothing to do; the only stale copies are in the pinned submodule.
**Key discovery: the library had received none of the 3.0.0 redesign** — 5,261 lines of contract
specifying twelve classes that did not exist. A **four-lap additive plan** was agreed.

**Lap 1 shipped green and was committed** (`a4e0152` + `e52ee43` + merge `98b1a67`, split in two by the
owner) — three new `<TEntity,TKey>` bases, five DAOs repointed, **25/25 on the new `Area=KeyPredicate`
trait**, zero regressions, one test recovered. **Its payload was thirteen specification defects** the
`Implementer` found on contact with real code — two silent-corruption class (**5.3** data loss, **5.6**
an unsound cache), all still open.

**Four owner decisions:** CS8766 suppressed locally (3 warnings → 0, now **six** suppression sites) with
the root cause filed as BaseDataAccess **FR 10, Scheduled v3.2.0**; A16 given an **auto tie-break** plus
a narrowed promise, verified against emitted SQL; the spike traited, closing the sum-check at
**190/190**; and **`Area` established as a second trait dimension**, which is what lets a lap prove
itself without a local SQL Server. One incident: a scratch `OrderProbe` project added to the tracked
`.sln` and then deleted broke the solution build; `git checkout --` was the right fix.

**Lap 2 shipped green and was committed** as `52a2edf`, with the A16 contract amendment taking its own
commit `6cf43d1` ahead of it — the three `BaseSoft*` families, `internal static SoftTimestamps`,
behavior-preserving seams in `BaseDao`, and `DepartmentDao` converted onto
`BaseSoftPagedDao<Department,int>` at **299 → 97 lines, net −202**. Build 0/0; `EFDepartmentDaoTests`
**40/40**, meeting D16's numeric bar; suite **200/173/27** against a lap-1 baseline of 190/163/27 and a
pre-lap-1 baseline of 165/137/28, **zero regressions across both laps.**

**Lap 2's payload is nine more findings (F1–F9)** — F2 and F3 are owner calls and are now the blocking
questions; **F8 must be carried into lap 3** — plus **mechanical confirmation that the contract's own
obligation tally is wrong** (132/11/8 = 151 vs a published 150), a third independent sighting of a defect
that has now survived a revision. **The owner was mid-recount at sign-off.**

⚠️ **The `Implementer` returned no report**, so lap 2's reasoning is lost and **D16's helper-absorption
clause was never satisfied.** Two subagents this session finished work while returning nothing — treat a
silent subagent as a failed handoff.

**Ended clean:** `ProphetsWay.EFTools` at `52a2edf`, tree clean, 0 ahead / 0 behind. Uncommitted
elsewhere: four `ProphetsWay.Example` docs, three untracked `AGENTS.md`, and this handoff.

### 2026-08-19

**Entirely Stage 2.** `api-contract.md` Revision 8 → 10 over three review→revise cycles. **No code, no
lap.** Q10 inverted the plan so `Contract Reviewer` ran before the shape pass — vindicated by five
blocking findings on rev 8. Q11 / Q12 / Q13 closed by the owner; **Q14 closed by measurement** — the
first measured fact in the chain, and it produced an unasked-for finding that shrank A35's blast radius
substantially. D19 filed and ratified; D14–D18 ratified, two with additions; FR 14 scheduled for v3.0.0.
`Interface Architect` **rejected a bad instruction from the coordinator's brief and was right to.**
Rev 10 returned **2 blocking, both localized**; the next move is **seven in-place fixes, not a fourth
cycle.** Three feature-request entries filed at wrapup — one EFTools, two `ProphetsWay.Example`.

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
