---
written: 2026-08-20T23:59:00
head:
  prophets-pipelines: fd894e0              # main — in sync with origin; dirty: this file only
  ProphetsWay.EFTools: 52a2edf             # branch 3.0.0-first-pass — 0 ahead / 0 behind origin; TREE CLEAN
  ProphetsWay.Example: 61d9e7d             # main — in sync; dirty: AGENTS.md, README.md, docs/feature-requests.md, docs/repo-profile.md
  ProphetsWay.BaseDataAccess: bd02dfd      # branch notes-from-eftools-3.0.0 — in sync with origin; CLEAN (main is still 207c5de, UNMERGED)
  ProphetsWay.Logger: 86568fd              # main — untracked AGENTS.md
  ProphetsWay.Utilities: 5095e5e           # master — untracked AGENTS.md
  ProphetsWay.Hasher: d1410ca              # master — untracked AGENTS.md
  ProphetsWay.BPA: 4c0ba1f                 # main — empty repo, clean
status: fresh                              # deliberate sign-off 2026-08-20 after lap 2 — supersedes the live checkpoint written earlier the same day
---

# Session Handoff

> **Sign-off for 2026-08-20.** This **supersedes the `live` checkpoint** written earlier the same day;
> every still-open item from it has been folded forward, not dropped. It covers **laps 1 and 2**.
> Lap 1's content is retained because most of it is still open; everything superseded is marked so.

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

**Nothing is in flight. Laps 1 and 2 are committed and pushed; EFTools' tree is clean.** The session
ended at a clean boundary, which is the good case — tomorrow starts on **lap 3, the keyless families and
`CompanyResourceDao`**, where **16 of the 27 remaining failures** live.

Behind it, unchanged and all still open: lap 1's **thirteen** specification defects, lap 2's **nine**
(F1–F9), the **obligation tally recount**, **D16's unmet clause**, the **M5–M11** test obligations, and
`Insert` being **entirely unasserted**.

> ⚠️ **`Test Auditor`, `Code Reviewer` and `Refactorer` were NOT run in lap 2**, the same omission lap 1
> made. It was cheap to skip twice; it will not stay cheap.

## ⚠️ Process Finding — a silent subagent is a failed handoff

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
| **3 — NEXT** | Keyless: `RootNonIdDao` / `BaseNonIdDao` / `RootSoftNonIdDao` / `BaseSoftNonIdDao`, **and write `CompanyResourceDao`** | Kills **16** of the 27 current failures. **Must also carry F8** — the keyless half of R4-S2 |
| **4** | Delete the 18 closures + 2 bridges, the dead `#if NET4*` blocks, `ContextOwnership` constructors; add `ThrowIfDisposed` to the transaction members | Full suite |

> ⚠️ **Lap 3 has a name collision to handle.** 2.2.x already declares an `internal RootNonIdDao<T>` in the
> **root namespace**, and the redesign introduces a **`public`** one of the same name in the same place.
> Unlike laps 1 and 2, this lap is **not** purely additive — plan the collision before writing a line.

## Next Session — Start Here

**One-line orientation:** laps 1 and 2 of the EFTools 3.0.0 DAO redesign are committed and green; lap 3
is the keyless families plus a `CompanyResourceDao` that does not exist yet, and it is **the first lap
that is not purely additive**.

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Close D16's stated clause** — state which of `DepartmentDao`'s seven private helpers the soft-delete family absorbed. Reconstruct from `git show 52a2edf -- …/DepartmentDao.cs`, or the owner accepts the 299 → 97 shrink as the answer | owner, or reconstruct from the diff | **Cheap, and it must not carry a third time.** D16 exists precisely to stop the shrink being read as the answer *by inference* |
| 2 | **Lap 3 — the keyless families and `CompanyResourceDao`** | `Test Designer` → `Implementer` | **16 of the 27 remaining failures.** `CompanyResourceDao` **does not exist**: no file, no `DbSet`, no `ToTable` |
| 3 | **Plan the name collision before writing a line of lap 3** | `Interface Architect` | 2.2.x already declares an **`internal RootNonIdDao<T>` in the root namespace**; the redesign introduces a **`public`** one of the same name in the same place. Laps 1 and 2 stayed additive only because the old classes sat in `.Int` / `.Guid` / `.Long` sub-namespaces — **that no longer holds** |
| 4 | **Pick up F8 inside lap 3** — R4-S2's timestamp pair on the **keyless** branch | `Test Designer` | Only the keyed half exists. **If lap 3 does not carry it, the obligation is silently dropped** |
| 5 | **Answer F2 and F3** — the two lap 2 findings that are owner calls, not defects | owner | F2 gates whether a UTC-clock-only override is conforming; F3 is a stated tension between two rules of the same document |
| 6 | **Finish the obligation recount the owner had already started.** Mechanically confirmed twice: **`[C]` 132 / `[X]` 11 / `[D]` 8 = 151**, against a published **131 / 11 / 8 = 150** | `Interface Architect` | See the recount section — **resume it, do not restart it** |
| 7 | **Triage the thirteen lap-1 defects (5.1–5.13).** Escalate **5.3** and **5.6** first — both silent-corruption class | owner, then `Contract Reviewer` | Still entirely untouched after two laps |
| 8 | Decide the seven `Guard=Seam` tests' missing `Scope` trait; decide whether `ProphetsWay.BaseDataAccess`'s `notes-from-eftools-3.0.0` branch merges to `main` now or rides with 3.2.0 | owner | Both small; both leave something in a half-state until answered |
| 9 | Commit the four `ProphetsWay.Example` doc corrections and the three untracked `AGENTS.md` files | owner | See *Uncommitted Changes* — **Hasher's is a correction sitting outside version control** |

**Exact invocation for step 2:** `@Test Designer` — write the keyless-family obligations
(`RootNonIdDao` / `BaseNonIdDao` / `RootSoftNonIdDao` / `BaseSoftNonIdDao`) against
`ProphetsWay.EFTools/docs/api-contract.md`, trait them `Scope=Contract` plus a **new `Area=` value** so
the lap runs without a local SQL Server exactly as `Area=KeyPredicate` and `Area=SoftDelete` did, **and
pick up F8** — R4-S2's routing table requires the timestamp pair tested on the keyless branch as well as
the keyed one, and only the keyed half exists. Then `@Implementer` writes `CompanyResourceDao` and its
`ExampleContext` mapping, planning it per **D17's amendment** as a **conversion onto
`RootNonIdDao<CompanyResource>`**, not as a permanent hand-written DAO.

> 📌 **The `Area` trait is now load-bearing infrastructure, not a convenience.** `Area=KeyPredicate` (25),
> `Area=SoftDelete` (10) and `Area=AlternateKeys` (14) are **how a lap runs green without a local SQL
> Server** — the full suite cannot. **Lap 3 must add its own `Area` value** or it loses the ability to
> prove itself on any machine but the owner's.

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

| # | Question | Blocks | Raised |
|---|---|---|---|
| **F2** | **May a conforming implementation ship a UTC-clock-only override?** A13's letter says *"override both, or neither"*; its stated rationale is policy *disagreement*, and a UTC-only clock override with the default normalizer is policy-**consistent**. **The letter and the reason do not agree** | How A13 is written, and whether the two `Characterization` tests in `SoftDeleteTimestampHookTests.cs` are pinning the right thing | 08-20 lap 2 |
| **F3** | **Is a `[C]` obligation allowed to depend on a certified-provider fact?** *"The default restores `DateTimeKind.Utc"`* is falsifiable only because the provider strips `Kind`. The Soft-delete obligation and the Scope-notation rule are in direct tension — **one of the two has to give** | Whether that obligation stays `[C]` or becomes `[X]`; feeds the tally recount | 08-20 lap 2 |

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

| Item | State | Where |
|---|---|---|
| **Lap 1 — keyed families** | ✅ **Done, green, COMMITTED** — `a4e0152` + `e52ee43` + merge `98b1a67`, split into two commits by the owner; A16 amendment as `6cf43d1` | `ProphetsWay.EFTools/BaseDao.cs`, `BaseGetAllDao.cs`, `BasePagedDao.cs` |
| **Lap 2 — soft-delete families** | ✅ **Done, green, COMMITTED and PUSHED as `52a2edf`.** 0 errors / 0 warnings; `Area=SoftDelete` 10; `EFDepartmentDaoTests` 40/40; suite 200/173/27, zero regressions. **Tree clean** | `ProphetsWay.EFTools/BaseSoft*.cs`, `SoftTimestamps.cs`, `BaseDao.cs`, `DepartmentDao.cs`, `SoftDeleteTimestampHookTests.cs` |
| **D16's stated clause** | ❌ **UNMET.** The numeric half is met (40/40); the *"which of the seven private helpers"* statement was never made, because the `Implementer` returned no report. **Close before lap 3** | reconstruct from `git show 52a2edf` |
| **Lap 3 — keyless families + `CompanyResourceDao`** | **Not started.** Next build step. **Has a name collision to plan** — an `internal RootNonIdDao<T>` already exists in the root namespace, and this lap is **not purely additive** | — |
| **Lap 2's nine findings F1–F9** | **All open.** F2 and F3 are **owner calls**, now the two blocking questions. **F8 must be carried into lap 3** | `ProphetsWay.EFTools/docs/api-contract.md` |
| **The obligation tally** | **Wrong, confirmed mechanically: 132/11/8 = 151 vs a published 131/11/8 = 150.** Predates the A16 amendment. Two untested-but-shipped behaviors would take it to **152** | `ProphetsWay.EFTools/docs/api-contract.md` |
| **The thirteen lap-1 specification defects** | **All open, untouched.** 5.3 and 5.6 escalated | `ProphetsWay.EFTools/docs/api-contract.md` |
| **M5–M11 test obligations** | **Open**, M8 partially folded in. Still not written after two laps | `ProphetsWay.EFTools.Tests/` |
| **`Insert` is still unasserted** | An **empty `Insert` body passes every `Area=KeyPredicate` test.** Unchanged by lap 2 | `ProphetsWay.EFTools.Tests/` |
| `docs/api-contract.md` | ✅ **COMMITTED as `6cf43d1`**, its own commit ahead of lap 2. **5,326 lines.** The commit-split question is closed | `ProphetsWay.EFTools/docs/api-contract.md` |
| `AlternateKeyGuardSpikeTests.cs` | ✅ **Traited and committed.** `Scope=Characterization` + `Area=AlternateKeys` × 7 theories, 14 cases. **Sum-check 190/190.** The `Test Auditor` pass on its `Record.Exception` sites and the `SpikeUser` naming are still undone | `ProphetsWay.EFTools/ProphetsWay.EFTools.Tests/` |
| Seven `Guard=Seam` tests carry **no `Scope` trait** | Deliberate choice of a different key. **Owner call whether they should** | `ProphetsWay.EFTools.Tests/TestSeamTests.cs`, `AdapterCoverageTests.cs` |
| `CompanyResourceDao` and its `ExampleContext` mapping | **Still do not exist** — no `DbSet`, no `ToTable`. **~16 of the 27 red tests.** Lap 3 | `ProphetsWay.Example.DataAccess.EF/` |
| `NotWrittenYet` message | Still claims Department has no EF DAO and that `ExampleContext` maps neither entity — **both now false for Department.** Thrown only from `CompanyResource` forwarders, so harmless today | `ProphetsWay.Example.DataAccess.EF/` |
| `ProphetsWay.BaseDataAccess` **FR 10** | ✅ **Committed** on branch `notes-from-eftools-3.0.0` (`bd02dfd`). **Status `Scheduled`, v3.2.0, high priority, after EFTools 3.0.0 ships.** Repo is **clean** | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` |
| **`Purpose Refiner`'s CS8767 objection** to the BaseDataAccess 3.2.0 scope | **Open.** Annotating *parameters* runs the **opposite way** from returns and would **relocate** warning noise onto every nullable-enabled implementation — **EFTools' own included.** Four contract judgements should be settled before that work starts | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` FR 10 |
| **BaseDataAccess `docs/repo-profile.md` carries a wrong claim** | It says C# 7.3 is *why* NRT are absent. **The TFM sets the default, not a ceiling; `<LangVersion>` is independent.** Recorded inside FR 10, **not yet corrected in the profile** | `ProphetsWay.BaseDataAccess/docs/repo-profile.md` |
| `ProphetsWay.EFTools` FR 15 | **Committed** (`a98f2bb`). Awaiting `Purpose Refiner` triage | `ProphetsWay.EFTools/docs/feature-requests.md` |
| `ProphetsWay.Example` FR 15 and 16 | Filed `Proposed`, **still uncommitted**, awaiting `Purpose Refiner` triage | `ProphetsWay.Example/docs/feature-requests.md` |
| `ProphetsWay.Example` doc corrections | **Uncommitted** — `AGENTS.md`, `README.md`, `docs/repo-profile.md` all carry 2026-08-20 pointer/version corrections | `ProphetsWay.Example/` |
| `ProphetsWay.EFTools/README.md` | Documents types that no longer exist — `BaseEFDataAccess<TContextType, TIdType>`, `BaseEFContext(string)`. **The list grows with every lap**; lap 4's deletions will lengthen it further | Lap 4 |
| `ProphetsWay.EFTools/AGENTS.md` | **Stale, measured at sign-off.** Layout table says the library has **27 source files** and the test project **19**; the tree has **34** and **21** — lap 1's three plus lap 2's four in the library, and `AlternateKeyGuardSpikeTests.cs` + `SoftDeleteTimestampHookTests.cs` in the tests. It also still describes the library as carrying the complete 2.2.x shape, which is true **plus** seven new root-namespace files | `Repo Analyst` — now unblocked, lap 2 is committed |

## Uncommitted Changes

**Verified against `git status --porcelain -uall` in all eight roots at sign-off — 2026-08-20, not
carried over from the checkpoint.**

> ⚠️ **Nothing was committed by an agent. Committing is the owner's call. No agent may commit, stage,
> or push.** The EFTools commits listed above were made **by the owner**.

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.Example` @ `61d9e7d` | ` M AGENTS.md` (+5/−3), ` M README.md` (+4/−3), ` M docs/feature-requests.md` (**+145/−0**), ` M docs/repo-profile.md` (+13/−9) | **Unchanged since the lap 1 checkpoint.** `feature-requests.md` carries **FR 15 and 16** (verified present at lines 1392 and 1458); the other three carry the 2026-08-20 pointer/version corrections. `main` in sync with origin |
| `prophets-pipelines` @ `fd894e0` | ` M docs/session-handoff.md` | **This file.** `main` in sync with `origin/main` |
| `ProphetsWay.Logger` @ `86568fd` | `?? AGENTS.md` | Long-standing, untouched this session |
| `ProphetsWay.Utilities` @ `5095e5e` | `?? AGENTS.md` | Same |
| `ProphetsWay.Hasher` @ `d1410ca` | `?? AGENTS.md` | Same — **and this one is a correction sitting outside version control.** Verified at sign-off: its deviation 1 reads *"Namespace is `ProphetsWay.Hasher`, not `ProphetsWay.Utilities` — **Deliberate, do not "fix" it**"*. This is the **corrected** copy of a file that had been steering agents toward a **binary-breaking namespace change**. **It protects nothing while untracked.** Worth committing on its own merit |

**Clean at sign-off:** `ProphetsWay.EFTools` (`52a2edf`, branch `3.0.0-first-pass`, **0 ahead / 0
behind**), `ProphetsWay.BaseDataAccess` (`bd02dfd`, branch `notes-from-eftools-3.0.0`, in sync) and
`ProphetsWay.BPA` (`4c0ba1f`, empty repo).

> 📌 **The `ProphetsWay.BaseDataAccess` branch decision is still open.** FR 10 is committed as `bd02dfd`
> on **`notes-from-eftools-3.0.0`**, which is **not merged**; `main` is still `207c5de`. So **FR 10 does
> not exist on `main`.** The outstanding action is a **merge decision — does it merge now, or ride with
> 3.2.0?** — not a commit.

**Nothing here looks accidental.** The three untracked `AGENTS.md` files are the only oddity and they
predate this session by four days.

## Git Delta — every repo in the workspace, computed at sign-off

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
| **`Test Auditor`, `Code Reviewer` and `Refactorer` — on laps 1 AND 2** | Lap 1: the `Implementer` reported the code structurally clean and the roughness located **in the specification**. Lap 2: **no report at all was returned**, so this skip has **no stated justification** | **Before lap 4's deletions.** Skipped twice; a third time is where it stops being cheap |
| **D16's helper-absorption statement** | The `Implementer` returned no report, so it was never written. The 299 → 97 shrink is circumstantial evidence, not the statement D16 asked for. **Lap 2 is committed — this is now the one thing outstanding from it** | **Before lap 3 starts.** Reconstruct from `git show 52a2edf`, or the owner accepts the shrink deliberately |
| **`Insert`'s obligations — A32, A34, OD-11, the `Guid` two-case, `ValueGeneratedNever`** | Not deferred by decision — **deferred by omission.** An empty `Insert` body passes all 25 `Area=KeyPredicate` tests, and lap 2 did not change that. **It is not scheduled into any of the four laps** | **Needs a home.** Decide at the lap 3 brief at the latest |
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
  **A lap that deletes early forfeits that property.**
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
