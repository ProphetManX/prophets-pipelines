---
written: 2026-08-16T22:10:00
head:
  prophets-pipelines: 18bc7d5
  ProphetsWay.EFTools: 0dd8aa6
  ProphetsWay.Example: d9fd96c
  ProphetsWay.BaseDataAccess: 207c5de
  ProphetsWay.Logger: 86568fd
  ProphetsWay.Utilities: 5095e5e
  ProphetsWay.Hasher: d1410ca
  ProphetsWay.BPA: 4c0ba1f
status: live
---

# Session Handoff

> **Checkpoint — 2026-08-16, 22:10.** Auto-saved mid-session, not a clean wrap. **Read this block
> first — it supersedes every block below it wherever they disagree.** Everything below is retained
> evidence from earlier in the same session and from the 08-15 → 08-16 wrapup.

## 🟢🟢 Checkpoint — **THE BUILD IS GREEN. Deviation 8 is fully closed.**

**`dotnet build ProphetsWay.EFTools.sln -c Debug` succeeded — 7 warnings, 0 errors, SDK 10.0.400.**
Run by the owner. **This is the first verified-green state in this repository since the submodule
advance.** Every prior claim in this session was reasoned from source with no build tool available;
this one is measured. Every project built: `ProphetsWay.EFTools` (`net10.0`),
`ProphetsWay.Example.DataAccess.EF` (`net10.0`), `ProphetsWay.EFTools.Tests` (`net10.0`), the
submodule's `DataAccess` / `DataAccess.NoDB` (`netstandard2.0` + `net10.0`),
`ProphetsWay.Example.Tests` (**both legs**, `net48` + `net10.0`), and `ProphetsWay.Example.Database`
— the SDK-style `.sqlproj`, producing a `.dacpac` **under the .NET CLI**.

**The owner has committed everything.** HEADs re-read at checkpoint time, not assumed:
`ProphetsWay.EFTools` `a016a05` → **`0dd8aa6`**, `ProphetsWay.Example` `c028d42` → **`d9fd96c`**.
Both trees are **clean**. `prophets-pipelines` (`18bc7d5`) and `ProphetsWay.BaseDataAccess`
(`207c5de`) are unmoved.

### 1. What closed Deviation 8 — all three enumerated breaks

| Break | Resolution | By |
|---|---|---|
| **(a)** | `ProphetsWay.EFTools.Tests` retargeted `net472;net48;net80;net90` → **`net10.0`** | `Modernizer` |
| **(b)** | The **six dead adapter classes deleted** — `EFBaseDataAccessTests`, `EFCompanyDaoTests`, `EFJobDaoTests`, `EFResourceDaoTests`, `EFTransactionDaoTests`, `EFUserDaoTests`. All confirmed adapter-only, four to five lines each — **zero test logic lost** | `Test Designer` |
| **(c)** | `ExampleDataAccess` now satisfies the 3.1.0 `IExampleDataAccess` | `Implementer`, Lap 1 |

Also landed by `Modernizer`: `ProphetsWay.BaseDataAccess` **2.5.0 → 3.1.0** in the library and the EF
example; **all three projects to `net10.0`** (owner decision **D7**); the unused **FluentAssertions
8.2.0** reference removed; and **both EF6 conditional `ItemGroup`s removed — EF6 is now entirely
unreferenced by the repository.**

### 2. Lap 1 — narrow by owner decision, and what it produced

- **`BaseEFDataAccess.Dispose`** implemented against the DISPOSAL `<remarks>` read at the time:
  idempotent via a `_disposed` flag, **rolls back a still-open transaction and never commits**,
  swallows a failed rollback, never throws, disposes the context it created via
  `Activator.CreateInstance`.
- **`ExampleDataAccess`** gained the **11 members** the 3.1.0 interface demands — 8 for
  `IDepartmentDao` including `Restore`, 3 for `ICompanyResourceDao`. **All throw
  `NotImplementedException`**, greppable via `NotWrittenYet` or `NOT IMPLEMENTED`, each message
  naming the member and pointing at `docs/api-contract.md`.

⚠️ **No red phase ran this lap, and that is a knowing deviation from the cycle** — the test harness is
parked pending the shape B seam, so there was nothing to write a failing test in. **Recorded so it is
not mistaken for normal practice.**

### 3. 🔑 The most valuable finding of the lap — carry this into every future DAO lap

**`Implementer` refused the obvious shortcut and documented why.**
`DepartmentDao : BaseSoftPagedDao<Department>` would have compiled and looked finished. Read against
`IDepartmentDao`'s 19 rules, `RootBaseSoftDao` **violates four**:

- **Rule 3** — `Update` is whole-object replacement, **wiping the stored `DeletedDate`**. This is the
  rule the interface itself names as *"the one that gets broken."*
- **Rules 5 and 6** — `Delete` stamps unconditionally, so a **second delete refreshes the timestamp
  and returns `1` instead of `0`**.
- **Rule 1** — `Insert` stamps `CreatedDate` but never clears `UpdatedDate` / `DeletedDate`.

Same for `CompanyResource`: `BaseNonIdDao<T>` implements `IBaseDao<T>`, forcing a `Get` and `Update`
that `ICompanyResourceDao` **deliberately does not declare** — a shape the 3.x design would have to
undo.

> **Conclusion: "just inherit the existing soft base" is a trap. The 3.x families must fix `Update`
> and `Delete` semantics, not re-wrap them.**

**Also reported, not addressed — a modeling decision the 3.x design owns:** `ExampleContext` maps
**neither** new entity — no `DbSet<Department>`, no `DbSet<CompanyResource>` — and `CompanyResource`
is keyless, so EF Core needs an explicit composite `HasKey` or `HasNoKey`. **Model building will fail
at runtime the moment anything materializes the model.** The stubs mean nothing does yet.

**Also open:** the full **`ObjectDisposedException` obligation is not implemented** — only `Dispose`
was. `IBaseDataAccess` requires **every other member** to throw once disposed; the seven inherited
dispatcher members will not. `_disposed` is set but **never read outside `Dispose`**. This is **FR 3's
second open question**.

### 4. The 7 build warnings — one changes a severity assessment

**3 × Source Link warning, and it upgrades a deviation:**

> `The path of submodule 'Submod' is missing or invalid: ''. The source code won't be available via Source Link.`

Emitted for `ProphetsWay.EFTools`, `ProphetsWay.Example.DataAccess.EF` and `ProphetsWay.EFTools.Tests`.
**This is Deviation 7** — the malformed `[submodule "Submod"]` block in `.gitmodules` carrying
`branch = main` and neither `path` nor `url`. It has been recorded as **"Low / cosmetic"**. **It is
not: it disables Source Link on a published package**, so consumers cannot step into
`ProphetsWay.EFTools` source. **Deviation 7's severity must be raised and the proven cost recorded.**
The block references nothing, so removal is safe — it is `.gitmodules`, left for the owner.

**4 × xUnit1013**, two per leg, both in the **submodule's** `ProphetsWay.Example.Tests/DepartmentDaoTests.cs`:

| Line | Member |
|---|---|
| 294 | `public void EditEveryFieldAfterTheCall` |
| 1001 | `public void AssertEveryStampIsUtc` |

Both are **helpers, not tests**, and should be `private` or `internal`. `AssertEveryStampIsUtc` is the
helper pinning **rule 18's UTC guarantee** across `GetAll` / `GetPaged`. **This verifies a
previously-unverifiable claim** — `ProphetsWay.Example/docs/repo-profile.md` asserted "two xUnit1013
warnings" and an analyst annotated it as build-derived and unchecked. **Confirmed: exactly two, and
now identified.** Fixing them belongs to a `Test Designer` **in the `ProphetsWay.Example` repository**,
never from the EFTools side.

Also confirmed by this build: the SDK-style `.sqlproj` **builds under the .NET CLI**, and
`ProphetsWay.Example.Tests` compiled on **both** legs — supporting the **164 tests / 328 executions**
figure.

### 5. 🔴 Blocked, needs the owner — one command

**The EF Core 9.0.4 → 10.x bump did not happen. `Modernizer` stopped rather than guess a version,
which was correct.** It checked the NuGet cache (3.1.4, 5.0.2, 6.0.7, 9.0.4 — **no 10.x**), searched
for `Directory.Packages.props` and `packages.lock.json` (**neither exists anywhere in the
workspace**), grepped every `obj/project.assets.json`, and found **no workspace project on 10.x**.
`docs/api-contract.md` decision **A31** settles the major but **no patch version is recorded
anywhere**.

**Five references await it** — three in `ProphetsWay.EFTools.csproj`, two in
`ProphetsWay.Example.DataAccess.EF.csproj`. Owner runs:

```
dotnet package search Microsoft.EntityFrameworkCore --exact-match --take 1
```

**A31 names three version-sensitive surfaces to re-verify against EF Core 10's actual
breaking-changes page:** `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys,
and `MultipleCollectionIncludeWarning`.

### 6. Documentation state

`AGENTS.md`, `docs/repo-profile.md` and `docs/feature-requests.md` in EFTools **all corrected**;
deviations **1, 2 and 6 marked CLOSED** with their rows and reasons retained; broken links to the
deleted adapters removed. **No feature-request status was changed by a non-owner agent.**

### ⚙️ Tooling constraint

**No terminal tool in the working session** — the owner ran every command, including this build. (This
checkpoint write did have a terminal and re-derived all eight HEADs and `git status --short` directly.)

---

## Prior checkpoint — 2026-08-17 00:45 · **superseded where it disagrees, retained as evidence**

### 🟢 **Stage 2 is closed. The gate is now the build, not the document.**

**`ProphetsWay.EFTools` HEAD moved again** — `e33219f` → **`a016a05`** (`stage checkin`, on
`3.0.0-first-pass`). The owner commits after each check-in by design; `ProphetsWay.Example`
(`c028d42`), `ProphetsWay.BaseDataAccess` (`207c5de`) and `prophets-pipelines` (`18bc7d5`) are
unmoved. All figures below re-read from the trees at write time.

### 1. `docs/api-contract.md` — Revision 8, *under review*, **all review findings closed**

- A `Contract Reviewer` **delta review of Revision 8** returned **PASS WITH FINDINGS**, keyed
  **J1–J10** — two blocking, four significant, four minor. Verdict: *Stage 3 may open once J1 and J2
  land.* **All ten are folded in**, in place, rather than opening a Revision 9. Verified in the file:
  the status block at lines 3–7 states the delta verdict and still, correctly, says *under review*.
- 🟢 **The log-versus-body audit came back clean for the first time.** H1–H9, G11, G12 and the rule 18
  amendment were all genuinely present at every site the revision log named. **The pattern that burned
  Revisions 7 and 8 — a log asserting a correction the body did not carry, three times in one day —
  did not recur.**
- **Obligation count is now 141 — `[C]` 123, `[X]` 10, `[D]` 8.** Hand-counted after the edits, the
  three sum, none untagged or double-tagged. **Every earlier figure is superseded — 142, 143, and
  every 125 / 124 / 11 / 10 / 8 split.** Verified at line 178 and again at line 3390.

**How the two blocking findings closed:**

| Ref | Resolution |
|---|---|
| **J1** | **A `[C]` obligation may not depend on a certified-provider fact.** G12's obligation asserted that an included `Department`'s timestamp carried `DateTimeKind.Unspecified` — which rule 18 does not require (*"whatever `Kind` the provider supplied, typically `Unspecified`"* is a **disclaimer of coverage**), while S13 makes the design provider-neutral. A conforming PostgreSQL implementation would have failed a `Contract` gate. **Fix: assert the mechanism, not the provider** — override both timestamp hooks to a local-time sentinel and require the included instance not to carry it while the owning DAO's own read does, which asserts *the hook did not run*. Tag stays `[C]`; N10 untouched |
| **J2** | **Two obligations were verbatim duplicates** of obligations in earlier groups, so the preamble's integrity-check total counted two twice. Deleted from the *Provider fidelity* group and replaced with pointers; total corrected **143 → 141**. A correction, not a loss of coverage |

**Significant and minor:** **J3** — `Insert`'s pre-assigned-key term stated a rule and disclaimed it in
one sentence while an obligation was `[C]` against it; resolved by narrowing, recorded as **OD-11**.
**J4** — the upstream contract was never version-pinned; both citations now read `ProphetsWay.Example`
**3.1.1**, noting the narrowed rule 18 is present **from 3.1.1** and that against 3.1.0 G12 would be a
divergence. **J5** — the keyless branch's hook declaration stated no reach and the log miscounted the
sites (**three, not two**). **J6** — a **mixed-traceability tie-breaker** added to the Scope notation:
*an obligation whose assertions do not all trace to a stated rule is either split, or tagged `[X]`
whole; `[C]` is not assignable to a mixed obligation.* **J7–J10** minor, all closed.

### 2. Two deviations from the lead's instructions — both correct, both recorded

1. **The J1 fix was written against a purpose-built `Label`/`Article` pair, not `DepartmentDao`** as
   the lead specified. `IDepartmentDao` rule 18 pins **both** halves of `Department`'s timestamp
   policy, so a `DepartmentDao` with a local clock would violate the very contract the obligation
   defends — and **N9 had already moved a local-time sample off `Department` for the same reason**.
   The instruction would have traded a provider dependency for a contract contradiction.
2. **`OD-10` does not exist.** The lead asked for `OD-11` after OD-9, having conflated it with **`D10`
   in `purpose-and-scope.md`** — a different series. Applied as instructed, **with the skipped number
   documented** (verified at line 125: *"There is no OD-10."*).

### 3. Noted for a future pass — not done

The J1 rewrite introduces the **third** purpose-built type set in the document, after `Country` and
`Assignment`. **The test model's purpose-built surface may deserve one consolidated statement rather
than three scattered ones.** Judged restructuring and out of scope for a fold-in pass.

### 4. Feature-request triage completed this checkpoint

- **EFTools FR 6 → shape B.** Adapters stated as **deleted, not rebuilt**; the entry **cannot be
  completed from inside EFTools** because the factory lives in the pinned submodule.
- **EFTools `D10`** appended to `docs/purpose-and-scope.md`.
- **Example FR 13** `Proposed → Scheduled` (verified, line 884). **Example FR 11 → Done** (verified,
  line 708). **Example FR 14 filed new** (verified, line 1049).

### ⚙️ Tooling constraint — still in force

**The session has no terminal tool.** No agent can run `git`, `dotnet build` or `dotnet test`; the
owner runs every command. (This checkpoint write did have a terminal and re-derived the four in-scope
HEADs, `git status --porcelain` and `git diff --stat` directly — every figure in **Uncommitted
Changes** is measured, not reported.) **This is why blocking question 1 matters: nothing in the
session can prove the build went green.**

---

## Prior checkpoint — 2026-08-16 23:30 · **superseded where it disagrees, retained as evidence**

### `api-contract.md` recovered, advanced to **Revision 8**, and re-verified

**Three HEADs moved since the 21:05 checkpoint**, each a single `step cycle commit`:
`ProphetsWay.EFTools` `6ad7643` → **`e33219f`**, `ProphetsWay.Example` `caddba4` → **`c028d42`**,
`ProphetsWay.BaseDataAccess` `cce91be` → **`207c5de`**. All three still carry uncommitted work on top
— see **Uncommitted Changes**.

### 1. Corruption fully recovered, then advanced to Revision 8

- The corruption was **seven sites, not one**. `6ad7643` damaged only implementer question 1; the
  other six came from an earlier bad edit. **`56e6a66` is the commit that introduced the corruption
  signature**, and **`56e6a66^`** — saved by the owner to `c:\Temp\api-contract-clean.md` — was
  verified as the clean recovery source. This closes the row-1 recovery-source hunt.
- **Recovery was a merge, not a restore.** The clean copy was structurally intact but predated
  Revision 7's F3–F8 corrections; the working file had the corrections but misplaced. Each destroyed
  original was recovered and each correction re-applied in its correct location.
- **`Contract Reviewer` then returned PASS WITH FINDINGS**, keyed **H1–H9**, verifying **nine of nine**
  claimed closures against the body. **Unauthorable obligations fell from ~38 to 2.** It confirmed
  both recovery inferences were sound — the six reconstructed words in A25, and reading a stray `S`
  as the head of `See`.
- **Revision 8 closed H1–H9 plus the older G11 and G12.** Status is **Stage 2 — Revision 8,
  *under review***; nothing self-certified. 🔴 **Revision 8 has not been reviewed by anyone.**

**Revision 8's substantive changes:**

| Ref | Change |
|---|---|
| **OD-8** | A26's *"plus any fetched row's whole reachable graph"* clause **retracted by owner decision.** `Update`/`Delete` locate through a tracked fetch applying neither `ApplyReadFilter` nor `ApplyIncludes`, and `item` is never tracked, so every navigation on the fetched row is `null`. The obligation was rewritten against **`AutoInclude`**, the one route that populates it |
| **OD-9** | The `CompanyResource` counter-example in A25 **replaced by a purpose-built entity `Assignment`** (`Id`, `CompanyId`, `Company`, `Note`), named as purpose-built and **not present in `ProphetsWay.Example`**. `CompanyResource` failed three ways, including that both its mapped scalars sit in its own `MatchRow` predicate |
| **H7** | `AutoInclude` documented as reaching the `Update`/`Delete` locating fetches; the cross-cutting claim qualified to *"attaches nothing **of its own**"* |
| **H3** | IDENTIFIER RULE and ROW COUNT RULE now cited throughout and marked as **elected in `ProphetsWay.Example`**, not inherited from `ProphetsWay.BaseDataAccess`. *"Never greater than `1`"* added to `Update` |
| **H6** | Every obligation now carries a scope tag — **`[C]` 124 / `[X]` 11 / `[D]` 8**, verified by regex count, **zero untagged**. The preamble's false claim that the groups map to the `Scope` partition is corrected: they are **subject-area groups** |
| **count** | **Obligation count is now 143** (142 + G12's new obligation), recounted item by item |

### 2. Documentation re-verified across all four in-scope repos

- **`ProphetsWay.Example`** — counts corrected to **164 / 328 / Contract 139 / Characterization 5 /
  Dispatcher 20** everywhere, including a partition-integrity sum that was **arithmetically wrong**.
  **The version line is 3.1.1, not 3.1.0** — three documents asserted 3.1.0. `IExampleDataAccess`
  carries **four** DAL-wide rules; every document said two. The README **named a test that does not
  exist**. Submodule pointer references corrected from `967fd26` / pre-3.0.0 to **`d845863`**.
- **`ProphetsWay.EFTools`** — **new Deviation 8 records that the repository does not compile**, with
  three independent breaks. Also recorded: **the test project would not exercise EF even if it
  compiled**, because 3.1.0's `BaseUnitTests<T>` sources its subject from `TestDataAccessFactory`,
  which returns the **NoDB** implementation. ✅ **The Stage 2 evidence held up** — every checkable
  claim re-derived from source was accurate; every correction traced to the submodule moving
  afterwards, not to a fabricated claim.
- **`ProphetsWay.BaseDataAccess`** — 🔴 **the behavioral-contracts index in `AGENTS.md` was missing an
  entire section.** It listed four; `IBaseDataAccess`'s `<remarks>` state **five** — the missing one
  being **CONVENTION-BASED DISPATCH**, which explicitly says it is **not a term of the contract**.
  **The EFTools 3.x design was drafted off that index.** Corrected. 116 tests / 232 executions
  verified by count.
- **`prophets-pipelines`** — the nine-variable contract verified correct against live template
  references; the `HasSqlProj` argument's premise (`projects: '**/*.csproj'`, **no `.sln` built
  anywhere**) verified. Gaps 5 and 6 confirmed still real and unfixed. **New gap 7** added:
  `local/app-variables.yml` omits `LocalTestsOnly` and is prefilled with another repo's identity, so
  **neither file in `local/` is safe to copy verbatim**.

### 3. Feature-request triage

- **EFTools** — FR 1 body corrected (the *"pinned pre-3.0.0"* claim was false); **FR 6 rescoped**;
  FR 8 marked eligible to land early; FR 12 → **Scheduled**, with the 2.2.x patch **Rejected** by
  applying existing decision **D1**.
- **Example** — **FR 11 → Done**; **FR 13 filed new**; FR 5 deliberately left `Proposed` with the
  reasoning recorded. **D9's precondition annotated as met-and-acted-on** without altering the
  decision text.

### 4. Session scope narrowed by the owner

- **The owner reverted all uncommitted `ProphetsWay.Logger` `.cs` changes.** The 21:05 checkpoint's
  TOCTOU / `ObjectDisposedException` / `ClearAllDestinations()` analysis is now **history, not a
  pending decision** — verified: Logger's tree carries only `?? AGENTS.md`.
- **`ProphetsWay.Hasher` and `ProphetsWay.Utilities` descoped from this session.**
- **In-scope repos are now `ProphetsWay.BaseDataAccess`, `ProphetsWay.Example`,
  `ProphetsWay.EFTools`, `prophets-pipelines` only.** Logger / Utilities / Hasher `AGENTS.md` were
  corrected earlier, remain **untracked and commit-ready**.

### ⚙️ Tooling constraint — still in force

**The session has no terminal tool.** No agent can run `git`, `dotnet build`, or `dotnet test`; the
owner runs every command by hand. (This checkpoint write did have a terminal and re-derived all eight
HEADs, branches, `git status --porcelain --untracked-files=all` and `git diff --stat` directly — every
figure in **Uncommitted Changes** below is measured, not reported.)

---

## Prior checkpoint — 2026-08-16 21:05 · **superseded, retained as evidence**

### Stage 2 repair pass, and the corruption is SEVEN sites

**Nothing is committed.** All of this is in `ProphetsWay.EFTools`' working tree at `6ad7643`
(`docs/api-contract.md`, +9 / −10).

### Repairs applied to `docs/api-contract.md` — uncommitted

- **Count sweep complete** (closes Next Session row 5 / Discrepancy 3). Four sites now read
  **164 tests / 328 executions — Contract 139, Characterization 5, Dispatcher 20**: lines ~27–28,
  112, 2722–2723, 3735–3736. **Independently re-counted from the standalone `ProphetsWay.Example`
  tree before writing** — 149 `[Fact]` + 15 `[InlineData]` = 164, and the three scopes sum to 164.
  Verified, not inherited.
- **Implementer question 1 restored verbatim** — *"Closure carrier for the key parameter"* — from
  `c:\Temp\api-contract-prior.md`, which the owner produced via
  `git show 6ad7643^:docs/api-contract.md`. Items 2–8 and the Revision 4 removed-questions table
  confirmed byte-identical to that source.
- **Spliced header prose deleted** from `## Implementer-Only Questions` after confirming it was a
  verbatim copy of header lines 3–7.

### `Contract Reviewer` delta review of Revision 7 → **BLOCK**. Findings G1–G12

**The headline: the same botched find-and-replace fired at seven sites, not one.** Line 3634 was the
site that happened to be noticed.

| Site | Damage |
|---|---|
| `#### Writing a Restore` ~1583–1669 | **The document's only worked custom write is destroyed** — prose spliced inside a `csharp` fence, duplicated `try` body, explanatory paragraph appearing three times. **This is the F3 closure.** |
| `### Keyless DAOs` ~3049–3086 | The 2.2.x→3.0.0 migration sample replaced by two near-identical copies of the corrected three-route table, both opening `// hree routes exist` |
| `### Observing the generated SQL — the seam` ~3098–3122 | Still carries the **uncorrected two-route table** — so **F5 is reported closed in the header table and is still open in the body** |
| A25 line 2602 | Still says both `CompanyResource` foreign keys are `int`; source is `public int CompanyId` / `public Guid ResourceId`. **F8 also reported closed and still open** |
| Lines 2552, 2568 | F8's correction pasted into the wrong sections — destroys the sentence stating the graph walk is specified by **state** not by API, and the sentence deriving the no-key-inspection rule from OD-3 |
| Line 2603 | F4's text welded into A25's closing sentence |
| Lines 3373–3403 | **Two test-obligation group headings consumed** — 18 obligations left with no group and therefore no determinable `Scope` trait. The OD-6 obligation truncates mid-word at `in favor of root-only. S` |
| Lines 465–472 | Orphaned headless copy of the F7/A31 disclaimer under `## Cross-Cutting Rules` |

**Roughly 38 of 141 obligations are not authorable as the file stands.** All recoverable text — no
design is absent.

**Non-blocking (G7–G12):** obligation count is **141, not the 142 the header asserts** · line 3707
still says "Revision 6" three times · "two items" introduces a three-item list · `IExampleDataAccess`'s
new IDENTIFIER RULE and ROW COUNT RULE are never named in the document · the OD-7 discard obligation
depends on SQLite FK enforcement that is never stated · `NormalizeRetrievedTimestamp` cannot reach
timestamps on entities materialized through another DAO's `ApplyIncludes`.

### 🔴 The recovery source is itself corrupt — verified directly, not inferred

`c:\Temp\api-contract-prior.md` (= `6ad7643^`) contains the **identical seam corruption**:
`// hree routes exist` twice inside the Keyless DAOs fence, and the
`erver**, which is the reason for the second leg.` fragment. **The corruption predates `6ad7643`;**
`6ad7643` damaged only implementer question 1. **A clean recovery source has not been identified.**

Note: the F5 three-route table's *content* is present and correct in the corrupt paste — it landed in
the wrong location rather than being lost. **Some of the recovery is a move, not a restore.**

### Uncommitted stragglers — investigated read-only across four repos, nothing changed

| Repo / file | Finding |
|---|---|
| `ProphetsWay.BaseDataAccess/AGENTS.md` | **Safe to commit.** Confirmed a clean `/sync-agents-md` tail — the working-tree block is byte-identical to the master and to the copies EFTools and Example committed later. The diff brings the repo **into** sync |
| `ProphetsWay.Utilities/AGENTS.md`, `ProphetsWay.Hasher/AGENTS.md` | Untracked, complete, **safe to commit** |
| `ProphetsWay.Logger/AGENTS.md` | Untracked, safe to commit **after** fixing deviation 2 — it says "14 targets" where the csproj has **16** |
| `ProphetsWay.Logger` 7 × `.cs` | **Needs an owner decision — parked.** See below |

**The Logger `.cs` change is coherent and unreviewed:** a thread-safe keyed destination registry plus
`FileDestination` becoming `IDisposable` over a persistent `FileStream`.
**`FileDestinationTests.cs` is NOT tampering** — all four assertions intact and strong, and the added
`dest.Dispose()` is *required* or `fi.Delete()` throws. But the code carries:

- a **real TOCTOU race** — `PrintLogEntry` checks `_disposed` before taking `LoggerLock`; `Dispose`
  sets it before taking the same lock;
- **`Logger.Debug()` can now throw `ObjectDisposedException` at consumers**, with no test covering it;
- `ClearAllDestinations()` — untested new public API;
- the Example project never disposes its `FileDestination`;
- **no CHANGELOG entry and no version bump for a public-API change on a published package.**

**Provenance unidentified** — Logger's reflog shows only a 2025-04-22 clone, and HEAD has never moved.

### ⚙️ Tooling constraint that shaped the session

**That session had no terminal tool.** Neither the lead nor any subagent could run `git`,
`dotnet build`, or `dotnet test`; all git evidence was derived by reading `.git/logs/HEAD` reflogs and
file contents. **Every git command named below must be run by the owner by hand.** (This checkpoint
write did have a terminal and re-verified all eight `git status` / HEAD lines directly.)

Every figure below was re-derived at write time — from `git status`, `git diff`, `git show`, the file
contents themselves, or the test runner. **Several counts moved three times during this session, so
nothing here is inherited.** Where the sign-off brief and the repository disagree, the repository
wins and the discrepancy is called out immediately below.

## 🚩 Discrepancies Between the Sign-Off Brief and the Tree

These are not nitpicks. Two of the three change what the first move next session should be.

### 1. 🔴 `ProphetsWay.EFTools/docs/api-contract.md` is CORRUPTED — and the corruption is committed

Commit **`6ad7643`** ("stage checkin", 2026-08-16 00:51) is a 4-insertion / 3-deletion change to
`docs/api-contract.md`, and it is a **botched find-and-replace**. It dropped a fragment of the
document's own status-line prose into the middle of the **`## Implementer-Only Questions`** section
at **line 3634**. The section now reads:

```text
None of these needs the owner. Each is answerable with a keyboard and a test run, and each is small enough
that guessing wrong is cheap to correct. Record the answers here when the7 and its status is *under review*.
Revision 6 passed a focused `Contract Reviewer` delta review **with findings**, and Revision 7 closes them —
but **no pass has run against this text**, and Revision 7 claims nothing on its own account. Revision 3
d local in a helper method,
   or `Expression.Convert` over a boxed constant — whichever produces a parameterized query on **both**
   certified providers. Verify by inspecting generated SQL, not by inspecting the expression tree.
2. **Where the resolved identifier `PropertyInfo` is cached.** ...
```

Destroyed by it:

- the sentence *"Record the answers here when they are settled."*
- **Implementer question 1 in its entirety** — its number, its title (*"Closure carrier for the key
  parameter"*), and its opening clause. The numbered list now begins at **2**, behind an orphaned
  fragment `d local in a helper method,`.

The surviving half of question 1 is the `Expression.Convert` / parameterized-query material — which
is **Lap 1 work** under the owner's Stage 3 plan. The original text is recoverable from
`git show 6ad7643^:docs/api-contract.md`. **Repair this before Stage 3 opens.**

### 2. 🟡 The document does not record "Stage 2 closed" — it records *under review*

The brief's *"Final state: PASS WITH FINDINGS, 142 obligations, zero blocked, Stage 2 **closed**"* is
half-confirmed and half-contradicted by the file itself:

| Claim | Verified? |
|---|---|
| Revision 7 | ✅ Yes |
| 142 obligations | ✅ Yes — *"Obligation count \| **142, unchanged, and none is blocked.**"* |
| Zero blocked | ✅ Yes, stated twice |
| PASS WITH FINDINGS | ⚠️ **Against Revision 6, not Revision 7.** *"141 of 142 obligations were cleared for authoring with two gating the rest."* The eight findings **F1–F8** are closed *in* Revision 7 |
| Stage 2 **closed** | ❌ **Not recorded anywhere.** The status line reads: *"Revision 7, **under review**… **No pass has run against this text.** Nothing here may be described as 'closed' or 'passed' on Revision 7's own account until one does."* |

The document explicitly forbids the authoring agent from advancing its own status line — and that
rule exists *because* Revision 3 did exactly that. It is the finding this entire session grew out of.

**So: either a `Contract Reviewer` pass runs against Revision 7 and the status line is advanced on
its verdict, or Stage 3 opens knowingly against an unreviewed text.** That is an owner call. What it
must not be is an accident.

### 3. 🟡 `api-contract.md` carries the superseded Example suite counts

Revision 7 states, emphatically and as *measured* — *"Counted directly from the standalone
`ProphetsWay.Example` tree rather than taken from a report: **162 tests — Contract 138,
Characterization 4, Dispatcher 20** — over `net10.0` and `net48`, **324 executions**."*

**That is now wrong.** The two new `Contract` tests landed after it was written. Because it is framed
as directly counted rather than reported, it is the most credible wrong number in the workspace. The
header block and F1's own text both carry it and both need the sweep.

## 🔢 Authoritative Suite State — runner-verified this session, both legs, exit 0

Not taken from any document. `dotnet test` over `ProphetsWay.Example.Tests`, plus one filtered run
per trait:

| | net10.0 | net48 | |
|---|---|---|---|
| **Total** | 164 | 164 | **164 tests / 328 executions** |
| `Scope=Contract` | 139 | 139 | |
| `Scope=Characterization` | 5 | 5 | |
| `Scope=Dispatcher` | 20 | 20 | |

139 + 5 + 20 = 164. **The partition sums, which is the check.** Failed: 0, Skipped: 0, on every run.

**Every earlier figure in every document is superseded** — 160/320, 161/322, 162/324, and every
137/3/20, 136/4/20, 138/3/20 and 138/4/20 triple. Do not carry an older count forward.

## Where We Are

The `ProphetsWay.EFTools` 3.x pass reached **Revision 7** of its API contract after the owner lost
confidence in the prior agent and ordered `Vanguard` to independently verify all of Stage 2 before
proceeding. That verification became the session.

**The headline finding: the prior agent's evidence was sound; its self-assessment was not.**
`Repo Analyst` re-derived every Stage 1 count from source and all matched. But the "Stage 2 closed;
passed `Contract Reviewer`" status line was recorded at **19:50** against a file last written at
**20:22** — it graded a draft it then replaced. A fresh review returned **BLOCK**.

**Four review cycles followed, and every one caught a new contradiction introduced by the pass that
fixed the last one.** Revision 3 → 7. 142 obligations, zero blocked.

**Design is done; implementation has not started.** No EFTools `.cs` file was touched this session.

## Current Focus

✅ **THE GATE IS OPEN — `ProphetsWay.EFTools` compiles.** `dotnet build ProphetsWay.EFTools.sln -c
Debug` returned **0 errors / 7 warnings** on SDK **10.0.400**. **Deviation 8 is fully closed** — all
three breaks resolved, FR 1 steps 2–6 landed, and **Stage 3 Lap 1** is done. Stage 2
(`docs/api-contract.md` Revision 8, **141 obligations**, `[C]` 123 / `[X]` 10 / `[D]` 8) remains as
recorded below. **Everything is committed** — EFTools `0dd8aa6`, Example `d9fd96c`, both trees clean.

🔴 **The new gating item is the shape B test seam.** Owner decision **D10** deferred its design until
Lap 1 showed what it must carry; **Lap 1 is done, so that condition is met.** Until the seam exists
**every subsequent DAO lap is unverifiable — there is no red phase available.** Lap 1's evidence about
what the seam must carry: the suite must construct an **implementation-specific** DAL, and the EF one
may need **provider / connection configuration** the NoDB one does not (`Constants.cs` holds that
wiring today). Tracked as `ProphetsWay.Example` **FR 13**.

🔴 **One owner command blocks the EF Core 10.x bump** — see blocking question 1.

### What landed — `ProphetsWay.EFTools` @ `6ad7643` on `3.0.0-first-pass`, pushed, tree clean

- **`docs/api-contract.md` at Revision 7**, 142 obligations, zero blocked. (Status line still
  *under review* — Discrepancy 2. Content corrupted at line 3634 — Discrepancy 1.)
- **OD-1 … OD-7 all settled and implemented in the document:**

  | # | Decision |
  |---|---|
  | **OD-1** | Navigation loading is **opt-in** via `protected virtual ApplyIncludes`, default identity; EF Core model-level **`AutoInclude` sanctioned alongside it** |
  | **OD-2** | **String key equality is collation-defined** — the library neither imposes nor promises one; a forced `EF.Functions.Collate` is rejected |
  | **OD-3** | **`default(TKey)` is an ordinary key value** — no short-circuit |
  | **OD-4** | **`Insert` writes the root only** — nothing reachable from it; `SetValues` **declared** unable to repoint a relationship |
  | **OD-5** | **Global query filters are defended** — `IgnoreQueryFilters()` on every `MatchRow`-located path, composed with on the retrieval trio |
  | **OD-6** | **The `Update` cascade question resolves in favor of root-only.** The conflicting `Scope=Contract` assertion was a `ProphetsWay.Example` defect; the retrait was authorized and **has landed** |
  | **OD-7** | **Detachment happens in a `finally`** — success *and* failure. Discarding a pending `Added` insert after a failed `SaveChanges` **is the intent**; the caller may fix their argument and retry on the same instance |

- `docs/feature-requests.md` — **entry 12** added: `RootNonIdDao.EnsureBeginTransaction` **silently
  no-ops against a pre-existing transaction.** Status `Proposed`, recommends **no 2.2.x patch**, to
  be named in the 3.0.0 notes as Fixed. **Verified present**, line 768.
- **Entry 3 extended rather than duplicated** — *"Appended 2026-08-15 — this is a shipped defect, not
  only a forward-compatibility gap"*, recording that **`ContextOwnership` (A9) supersedes its open
  question Q2**. **Verified present**, lines 254 and 267.
- **`AGENTS.md` gained the D7 `net10.0`-only ratified exception** (line 310), cross-linked to
  `docs/purpose-and-scope.md` D7 (line 81). **Both verified by opening both files.**
- **Submodule advanced** — `git submodule status` returns
  `d84586335a11d7c9efb7277b947015df0c15967e ProphetsWay.Example (3.1.0)`. ✅

### What landed — `ProphetsWay.Example` @ `caddba4` on `3.1.1-eftool-findings`, pushed, tree clean

13 files, **+470 / −85**. Verified from the diff, not from the brief:

- **Two DAL-wide rules added to `IExampleDataAccess`** — an **IDENTIFIER RULE** (line 110) and a
  **ROW COUNT RULE** (line 154), joining the existing SNAPSHOT and ORDERING rules. Together they
  close findings **A** and **B** — roughly 18 `Contract` assertions that traced to no stated rule.
  Both state explicitly that **`IBaseDao<T>` is correct and unchanged** and that **this DAL elects
  the convention for itself**, so no reader concludes `ProphetsWay.BaseDataAccess` now promises it.
- **DAL-wide was chosen over per-interface** because `BaseDataAccessTests` asserts through
  `IBaseDataAccess`'s generic members, which per-DAO rules would reach only by an inference the
  reader has to construct.
- Per-DAO restatements added to the five previously-silent interfaces — `ICompanyDao`, `IJobDao`,
  `IUserDao`, `ITransactionDao`, `IResourceDao`.
- **Two new `Contract` tests** — in `SnapshotDeepCopyTests.cs` (+116) and `UserDaoTests.cs` (+98) —
  **closing a hole in the conformance gate that one of the retraits had opened. A DAL whose `Update`
  cascades into the reachable graph had been passing all 138 `Contract` tests**, because the only
  pre-call navigation edit in the suite sat inside a rolled-back transaction. That is exactly the
  behavior **OD-6 rejected**, and it would have shipped green.
- **The cascade test was only writable because the ROW COUNT RULE landed first** — before it, no
  stated rule forbade the cascade, which is why the earlier retrait could only demote and not
  replace.
- Three test re-classifications; stale counts corrected in `README.md`, `AGENTS.md`,
  `docs/purpose-and-scope.md` and `docs/repo-profile.md`.
- **The traceability convention added to `AGENTS.md`** (line 417), citing FR 12 — *a `Scope=Contract`
  assertion must trace to a stated rule* — stated once, **with its complete lack of any enforcement
  mechanism stated plainly**.

`prophets-pipelines` @ `18bc7d5` on `main`, pushed, clean — the prior checkpoint of this file.

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Owner: supply the EF Core 10.x version** — `dotnet package search Microsoft.EntityFrameworkCore --exact-match --take 1` — then **delete the `[submodule "Submod"]` block from `.gitmodules`** | owner | 🔴 Five package references await the version. The `.gitmodules` block **disables Source Link on a published package** |
| 2 | 🔴 **Design and land the shape B test seam — THE GATING ITEM** | `Purpose Refiner` / `Interface Architect` in **`ProphetsWay.Example`** (FR 13) | **D10's precondition is met — Lap 1 is done.** Until the seam exists, **every DAO lap is unverifiable; there is no red phase** |
| 3 | **The real DAO laps, with a genuine red phase** | `Test Designer` → `Implementer` → `Test Auditor` | Blocked on row 2. **Carry the standing guardrail into every brief — see below.** Lap 1's finding: **do not inherit `RootBaseSoftDao` / `BaseNonIdDao`** |
| 4 | **`Purpose Refiner` triage owed** — EFTools **FR 8** and **FR 2** are both materially complete but still `Scheduled`; **FR 12** carries a heading reading *"Why it is `Proposed` rather than `Scheduled`"* while its status line says Scheduled/Rejected | **`Purpose Refiner` only** | Status is theirs alone to change |
| 5 | **Fix the two xUnit1013 helpers** — `EditEveryFieldAfterTheCall` (line 294) and `AssertEveryStampIsUtc` (line 1001) in `DepartmentDaoTests.cs` | `Test Designer`, **in `ProphetsWay.Example`** | Never from the EFTools side — it is the submodule |
| 6 | **Raise Deviation 7's severity** in `ProphetsWay.EFTools/AGENTS.md` and record the proven cost | `Repo Analyst` | The build proved it is not cosmetic |
| 7 | **Implement the `ObjectDisposedException` obligation** on the seven inherited dispatcher members | `Implementer` | `_disposed` is set but never read outside `Dispose`. **FR 3's second open question** |
| 8 | **Close blocking question 2** — client-supplied `Guid` keys, `ResourceDao.cs` line 48 | owner decides; `Implementer` for the one-line `.NoDB` fix | Still untouched. One line |
| 9 | **Close blocking question 3** — state hard delete on the five silent DAOs | owner authorizes; `Interface Architect` writes | Still untouched. Six `Contract` assertions trace to no stated rule |
| 10 | **Close blocking question 4** — does Example **FR 13** bind to a named release? | owner / `Purpose Refiner` | Now urgent: FR 13 **is** the gating item |
| 11 | **Decide whether Example FR 11's third mis-scope gets its own number** | **`Purpose Refiner` only** | FR 11 is **Done** and one item **exceeded its authorization** |
| 12 | **Commit `prophets-pipelines`** (`AGENTS.md` gap 7 + this file) and the three untracked `AGENTS.md` | owner | Only the owner commits. Logger's still needs its "14 targets" → **16** fix first |
| 13 | `Test Auditor` over the two newest Example tests | `Test Auditor` | Non-blocking |

### 🚧 Standing guardrail — **still in force**, and it must survive into every DAO lap brief

**No new test file in `ProphetsWay.EFTools.Tests` until the shape B seam lands.** Local assertions are
**shape A arriving through the back door**, and **D10 committed to shape B**. Anyone writing a lap
brief that omits this has quietly reversed an owner decision. **The green build does not relax it** —
the project compiling is exactly what makes a local test file tempting.

## Stage 3 — The Owner's Plan, As Decided

**Three fat laps, not the six proposed.** A `Test Auditor` pass and a **checkpoint at each lap
boundary**. `Test Designer` writes the red suite from the **142 obligations**; **`Implementer` is
forbidden from touching a test file.**

| Lap | Scope |
|---|---|
| **1** | Disposal + `ContextOwnership`, then key predicate + keyed CRUD. **`CS0534` on the missing `Dispose` is already the first compiler error, so this lap is what makes the tree compile.** Includes the **A19** disposed-plus-missing-forwarder discriminator |
| **2** | The three read hooks — `ApplyReadFilter` → `ApplyIncludes` → `ApplyStableOrder` — plus paging and navigation loading, then writes and the navigation graph (**OD-4**, **OD-7**, the `finally` detach). **The subtlest material in the document** |
| **3** | Soft delete + the four keyless families, then transactions, global query filters and provider fidelity. **Needs the SQLite in-memory and SQL Server container harness standing** |

## Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| 1 | 🔴 **What patch version of EF Core 10.x?** `Modernizer` **stopped rather than guess**, correctly — the NuGet cache holds 3.1.4 / 5.0.2 / 6.0.7 / 9.0.4 and **no 10.x**; there is **no `Directory.Packages.props` and no `packages.lock.json` anywhere in the workspace**; no project is on 10.x. **A31** settles the major only. Owner runs `dotnet package search Microsoft.EntityFrameworkCore --exact-match --take 1`. **Then re-verify A31's three version-sensitive surfaces against EF Core 10's breaking-changes page:** `IgnoreQueryFilters()` granularity, `SetValues` against shadow FKs, `MultipleCollectionIncludeWarning` | **Five package references** — 3 in `ProphetsWay.EFTools.csproj`, 2 in `ProphetsWay.Example.DataAccess.EF.csproj` | 2026-08-16 (22:10) |
| 1b | 🔴 **How does `ExampleContext` map the two new entities?** No `DbSet<Department>`, no `DbSet<CompanyResource>`, and `CompanyResource` is **keyless** so EF Core needs an explicit composite `HasKey` or `HasNoKey`. **Model building will fail at runtime the moment anything materializes the model** — the `NotImplementedException` stubs are the only reason nothing does yet | Every DAO lap that touches either entity | 2026-08-16 (22:10) |
| 2 | **Client-supplied `Guid` keys diverge — fix `.NoDB`, or leave it specified as unspecified?** `ResourceDao.cs` line 48. **Still open, untouched by Revisions 7 and 8 and by the J-series fold-in** | The Example conformance story; the IDENTIFIER RULE's completeness | 2026-08-16 |
| 3 | **Nothing states `Delete` is a hard delete** on `ICompanyDao`, `IJobDao`, `IUserDao`, `ITransactionDao`, `IResourceDao`. **Still open** | Six `Contract` assertions with no stated rule behind them | 2026-08-16 |
| 4 | **Does Example FR 13 bind to a named release?** **Every other `Scheduled` entry in that index names one**; FR 13 does not. `Purpose Refiner`'s file, the owner's call | Whether FR 13's schedule means anything | 2026-08-17 (00:45) |

### ✅ Closed at this checkpoint

- **"How do the four `.csproj` changes get made without violating the rule that `Modernizer` never
  runs against a red baseline?"** — **moot: the work is done and the build is green.** `Modernizer`
  ran and landed the BaseDataAccess 3.1.0 adoption, the `net10.0` retarget, the FluentAssertions
  removal and the EF6 `ItemGroup` removals; `Test Designer` deleted the six adapters; `Implementer`
  closed break (c).

### ✅ Closed at the prior checkpoint

- **"Does `IDepartmentDao` rule 18 bind through includes?"** — **answered.** The owner **narrowed rule
  18**: its retrieval clause binds **`IDepartmentDao`'s own reads only**, and a `Department` reached as
  a navigation property through another DAO's include carries the **provider-supplied `Kind`**. Applied
  to `IDepartmentDao.cs`; captured as **`ProphetsWay.Example` FR 14** with the **rejected global
  value-converter alternative** recorded. **Verified to break no test** — no test anywhere asserts
  `Kind` on an *included* `Department`, while the narrow half is pinned on all three of
  `IDepartmentDao`'s reads in `DepartmentDaoTests`, `Scope=Contract`. G12's obligation is `[C]`, not
  `[X]`, and now asserts the **mechanism** (per J1) rather than the provider fact.
- **"FR 6 — shape A or B?"** — **answered: shape B.** See Decisions Made This Session.
- **"Does Stage 3 open against an unreviewed Revision 8?"** — **moot.** The delta review ran and
  returned **PASS WITH FINDINGS** with the verdict *Stage 3 may open once J1 and J2 land*; both landed,
  with all eight remaining findings.
- Earlier: the recovery-source question (`56e6a66^`, clean, verified) and the Logger `.cs` decision —
  **the owner reverted the changes**.

### Detail on question 3 — verified in source, both sides

`ProphetsWay.Example.DataAccess.NoDB/Daos/ResourceDao.cs` **line 48** does
`item.Id = Guid.NewGuid();` **unconditionally**, inside the lock, destroying any caller-supplied
`Guid`. EFTools' `docs/api-contract.md` says a client-generated key **"is used as supplied."**

`Interface Architect` could state neither: *"overwritten"* makes **EFTools 3.x non-conforming before
it is written**, and *"used as supplied"* turns **`.NoDB` red today**. So the IDENTIFIER RULE
specifies **only the default-identifier case** and names the pre-assigned case as permitted
divergence. That escape hatch is now written into `IResourceDao` — verified in the `caddba4` diff:

> *"whether an implementation honors a `Guid` the caller pre-assigned or replaces it is **not**
> specified — see the identifier rule — so **do not pass one and do not depend on either answer**."*

**The lead recommended fixing `ResourceDao`**, on the grounds that a caller-chosen key is the point
of `Resource` existing in the domain model at all — and *"do not pass one"* is a strange thing to
tell a reader about a client-generated key. **One line closes it**, plus retiring the escape clause.
**Not yet decided.**

### Detail on question 4 — verified

`ICompanyResourceDao` states it (rule 4, and again at line 179). `IDepartmentDao` states the soft
variant. The new ROW COUNT RULE only says *"**Where** `Delete` is a hard delete the row is gone
afterwards"* — **a conditional that presupposes hard-delete-ness rather than asserting it of any
DAO.** The five interfaces above never assert it.

Six `Contract` assertions depend on it: `freshQueryCo.ShouldBeNull()` in all five delete tests, plus
`ShouldDeleteGenericTypes`. **Same defect class as findings A and B, which were closed by stating the
rules. The recommendation is to close it the same way.** `Interface Architect` declined to invent the
requirement without authorization.

## Open Questions — Non-Blocking

- **`ProphetsWay.EFTools/README.md` is stale** — last commit **`4776923`, 2022-08-14**. Verified by
  `git log -1 -- README.md`. It predates the 2.x contract, let alone 3.x. `README Author`, Stage 4.
- **Example FR 11 was marked Done, and one item exceeded its authorization** — a **third** mis-scope,
  `ShouldCallCustomUserFunctionality`, was retraited and folded in as same-defect evidence.
  **It may warrant its own number.** `Purpose Refiner`'s call, and only theirs.
- **Untracked `AGENTS.md` in Logger, Utilities and Hasher**, all commit-ready; Logger's wants its
  "14 targets" → **16** fix first. `ProphetsWay.Hasher` and `ProphetsWay.Utilities` are **descoped**
  from this session. Logger's 7 modified `.cs` files are **gone — reverted by the owner**.
- One cosmetic nit found while verifying: `IExampleDataAccess.cs` line 176 reads *"`Delete` is a hard
  delete the row is gone afterwards"* — **a dropped em dash** in text added this session. Every
  sibling sentence in the same remarks block has it.

## In Flight

| Item | State | Where |
|---|---|---|
| **The build** | ✅ **GREEN — 0 errors, 7 warnings, SDK 10.0.400.** Measured, not reasoned. **Deviation 8 fully closed**; FR 1 steps 2–6 landed. **Committed** at `0dd8aa6` | `ProphetsWay.EFTools`, tree clean |
| **Stage 3 Lap 1** | ✅ **Done, narrow by owner decision.** `BaseEFDataAccess.Dispose` implemented; `ExampleDataAccess` gained the **11** members the 3.1.0 interface demands, **all throwing `NotImplementedException`** (greppable: `NotWrittenYet` / `NOT IMPLEMENTED`). ⚠️ **No red phase ran — a knowing deviation**, the harness is parked | `ProphetsWay.EFTools` |
| 🔑 **"Inherit the existing soft base" is a trap** | ✅ **Finding recorded.** `RootBaseSoftDao` violates `IDepartmentDao` **rules 1, 3, 5, 6**; `BaseNonIdDao<T>` forces a `Get`/`Update` `ICompanyResourceDao` does not declare. **The 3.x families must fix `Update`/`Delete` semantics, not re-wrap them** | carry into every DAO lap |
| **EF Core 10.x version** | 🔴 **Blocked on the owner — one command.** Five references await it. `Modernizer` correctly refused to guess | `ProphetsWay.EFTools.csproj` ×3, `ProphetsWay.Example.DataAccess.EF.csproj` ×2 |
| **`ExampleContext` maps neither new entity** | 🔴 **Open, reported not addressed.** No `DbSet<Department>` / `DbSet<CompanyResource>`; keyless entity needs explicit `HasKey`/`HasNoKey`. **Runtime model-build failure waiting** | `ProphetsWay.Example.DataAccess.EF` |
| **`ObjectDisposedException` obligation** | 🔴 **Open.** Only `Dispose` was implemented; the seven inherited dispatcher members do not throw once disposed. `_disposed` never read outside `Dispose`. **FR 3's second open question** | `BaseEFDataAccess` |
| **Deviation 7 — `[submodule "Submod"]`** | 🔴 **Severity must be raised.** The build emitted **3 × Source Link warning**; it **disables Source Link on a published package**, not cosmetic. Removal is safe; left for the owner — it is `.gitmodules` | `ProphetsWay.EFTools/.gitmodules`, `AGENTS.md` |
| **2 × xUnit1013 helpers** | 🔴 **Confirmed and now identified** — `EditEveryFieldAfterTheCall` (294) and `AssertEveryStampIsUtc` (1001). **Verifies a claim `ProphetsWay.Example/docs/repo-profile.md` had flagged as build-derived and unchecked.** Fix belongs to `Test Designer` **in `ProphetsWay.Example`** | `ProphetsWay.Example.Tests/DepartmentDaoTests.cs` |
| **`Purpose Refiner` triage owed** | EFTools **FR 8** and **FR 2** materially complete but still `Scheduled`; **FR 12**'s heading and status line disagree. **No non-owner agent changed any status** | `ProphetsWay.EFTools/docs/feature-requests.md` |
| `docs/api-contract.md` **Revision 8** | ✅ **Stage 2 closed.** J1–J10 all folded in; **141 obligations** — `[C]` **123** / `[X]` **10** / `[D]` **8**, hand-counted, summing. First **clean log-versus-body audit**. Status line correctly still *under review*. **Committed** at `0dd8aa6` | `ProphetsWay.EFTools`, `3.0.0-first-pass` |
| **The purpose-built type sets** | ⚪ **Noted, not done.** J1 added a **third** (`Label`/`Article`, after `Country` and `Assignment`). One consolidated statement may serve better than three scattered ones — **restructuring, out of scope for a fold-in pass** | `ProphetsWay.EFTools/docs/api-contract.md` |
| **FR 1 steps 2–6 — the green build** | ✅ **DONE.** Four `.csproj` changes + six class deletions, plus **both EF6 `ItemGroup`s removed — EF6 is now entirely unreferenced by the repository** | `ProphetsWay.EFTools` |
| Recovery source hunt | ✅ **Closed.** `56e6a66` introduced the signature; `56e6a66^` = `c:\Temp\api-contract-clean.md`, verified clean | `ProphetsWay.EFTools` |
| Stage 3 implementation | **Closed.** No EFTools `.cs` touched | `ProphetsWay.EFTools` |
| SQLite in-memory + SQL Server container harness | **Not started.** Lap 3 depends on it | `ProphetsWay.EFTools` — D4 / D8 |
| **D10 — the test seam, shape B** | 🔴 **NOW THE GATING ITEM. D10's precondition is met — Lap 1 is done, so the design may proceed.** Lap 1's evidence for what it must carry: the suite must construct an **implementation-specific** DAL, and the EF one may need **provider / connection configuration** the NoDB one does not (`Constants.cs` holds that wiring today). The owner's proposed mechanism **cannot compile**; a viable **SKETCH ONLY** alternative is recorded | `ProphetsWay.EFTools/docs/purpose-and-scope.md`; `ProphetsWay.Example/docs/feature-requests.md` FR 13 |
| EFTools feature requests | FR 1 body corrected · **FR 6 → shape B**, adapters **deleted not rebuilt**, entry **cannot be completed from inside EFTools** · FR 8 eligible to land early · FR 12 → **Scheduled**, 2.2.x patch **Rejected** under D1. **Uncommitted** | `ProphetsWay.EFTools/docs/feature-requests.md` |
| Example feature requests | **FR 11 → Done** (line 708) · **FR 13 `Proposed` → `Scheduled`** (line 884) · **FR 14 filed new** (line 1049) · FR 5 left `Proposed` deliberately. **Uncommitted** | `ProphetsWay.Example/docs/feature-requests.md` |
| **Rule 18 narrowing** | ✅ **Applied** to `IDepartmentDao.cs` — 18 lines changed. **Verified to break no test.** **Uncommitted** | `ProphetsWay.Example.DataAccess/IDaos/IDepartmentDao.cs` |
| `prophets-pipelines` **gap 7** | `local/app-variables.yml` omits `LocalTestsOnly` and carries another repo's identity — **neither file in `local/` is safe to copy verbatim**. **Uncommitted** | `prophets-pipelines/AGENTS.md` |
| Logger `.cs` edits | ✅ **Gone — the owner reverted them.** No longer a pending decision | `ProphetsWay.Logger`, `main` |
| Straggler `AGENTS.md` files | Untracked and commit-ready in Logger, Utilities, Hasher. Logger's still wants its "14 targets" → **16** fix. BaseDataAccess's **has been committed** at `207c5de` | Logger, Utilities, Hasher |

## Uncommitted Changes

**Re-verified by `git status --short`, `git diff --stat` and `git rev-parse` at checkpoint time,
2026-08-16 22:10. The owner committed everything: `ProphetsWay.EFTools` `a016a05` → **`0dd8aa6`** and
`ProphetsWay.Example` `c028d42` → **`d9fd96c`**, both trees now clean. **`prophets-pipelines` is the
only repo with modified tracked files, and three repos carry an untracked `AGENTS.md`.**

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.EFTools` — **`0dd8aa6`** on `3.0.0-first-pass` | *(clean)* | ✅ **Everything committed** — the green build, Deviation 8's closure, Lap 1, and the J1–J10 fold-in |
| `ProphetsWay.Example` — **`d9fd96c`** on `3.1.1-eftool-findings` | *(clean)* | ✅ **Everything committed** — the rule 18 narrowing and the FR 11 / 13 / 14 triage |
| `prophets-pipelines` — `18bc7d5` on `main` | `M AGENTS.md` (**14 lines**), `M docs/session-handoff.md` (this file) | `AGENTS.md` carries **new gap 7** — `local/app-variables.yml` omits `LocalTestsOnly` and is prefilled with another repo's identity |
| `ProphetsWay.BaseDataAccess` — `207c5de` on `main` | *(clean)* | ✅ The `AGENTS.md` correction — the missing **CONVENTION-BASED DISPATCH** section — is **committed** |
| `ProphetsWay.Logger` — `86568fd` on `main` | `?? AGENTS.md` | ✅ The 7 `.cs` files are **reverted and gone**. `AGENTS.md` is safe to commit **after** fixing deviation 2 — "14 targets" where the csproj has **16** |
| `ProphetsWay.Utilities` — `5095e5e` on `master` | `?? AGENTS.md` | Descoped from this session. Untracked, complete, safe to commit |
| `ProphetsWay.Hasher` — `d1410ca` on `master` | `?? AGENTS.md` | Descoped from this session. Untracked, complete, safe to commit |
| `ProphetsWay.BPA` — `4c0ba1f` on `main` | *(clean)* | Untouched |

**Committing is the owner's call. Nothing was committed, staged, or pushed — by the session or by
this checkpoint.**

## Decisions Made This Session

| Decision | Filed to | Status |
|---|---|---|
| **Rule 18 narrowed** — `IDepartmentDao` rule 18's retrieval clause binds **that interface's own reads only**; a `Department` reached as a navigation property through another DAO's include carries the **provider-supplied `Kind`** | `ProphetsWay.Example.DataAccess/IDaos/IDepartmentDao.cs`, **and** `ProphetsWay.Example/docs/feature-requests.md` **FR 14** (line 1049) with the **rejected global value-converter alternative** recorded | ✅ Both. **Verified to break no test** — nothing asserts `Kind` on an *included* `Department`; the narrow half is pinned on all three `IDepartmentDao` reads in `DepartmentDaoTests`, `Scope=Contract` |
| **D10 — shape B** for the test seam: `ProphetsWay.Example` grows a seam letting a consuming repo supply the implementation. **Direction only — the design is deliberately deferred** until Lap 1 shows what it must carry. **Shape A (a duplicate local suite in EFTools) declined.** The owner's proposed mechanism — making `TestDataAccessFactory.Create()` `protected` and overriding it — **cannot compile**: static classes cannot declare `protected` members and static methods are not virtual. Viable alternative recorded **as SKETCH ONLY**: restore a hook on `BaseUnitTests<T>` as virtual-with-default, `protected virtual IExampleDataAccess CreateDataAccess() => TestDataAccessFactory.Create();` | `ProphetsWay.EFTools/docs/purpose-and-scope.md` (**D10**); `ProphetsWay.Example/docs/feature-requests.md` **FR 13**, moved to `Scheduled` on its strength | ✅ Both, verified |
| **OD-11** — this library **narrows the IDENTIFIER RULE's pre-assigned-key case**: on a store-generated column the generated key **replaces** whatever the caller assigned. Applied **on the reviewer's recommendation** and **open to reversal by the owner** — reversing means **retagging one obligation `[X]`, not changing behavior**. ⚠️ **There is no OD-10** — the number was skipped when the lead conflated it with `D10` | `ProphetsWay.EFTools/docs/api-contract.md` — *Owner Decisions taken during Revision 8* (line 412), cited at lines 32, 123, 168, 1445, 3632, 4103 | ✅ Verified, skipped number documented at line 125 |
| **OD-8 / OD-9** — taken earlier in the session, already recorded | `ProphetsWay.EFTools/docs/api-contract.md` — *Owner Decisions taken during Revision 8* | ✅ |
| **OD-1 … OD-7** (see the 23:30 block for the full text of each) | `ProphetsWay.EFTools/docs/api-contract.md` — A18, A24–A26, A28 and the two *Owner Decisions taken during Revision N* blocks | ✅ In that document — ⚠️ **and only there**; see below |
| **D7** — the `net10.0`-only ratified TFM exception | `ProphetsWay.EFTools/AGENTS.md` line 310 **and** `docs/purpose-and-scope.md` line 81 | ✅ **Both, verified by opening both** |
| **FR 12** (EFTools) — `EnsureBeginTransaction` silent no-op | `ProphetsWay.EFTools/docs/feature-requests.md` line 768 | ✅ Verified |
| **FR 3 extension** (EFTools) — the leaked `DbContext` reframed as a shipped defect; `ContextOwnership` supersedes Q2 | same file, lines 254 and 267 | ✅ Verified |
| **IDENTIFIER RULE / ROW COUNT RULE** | `ProphetsWay.Example.DataAccess/IExampleDataAccess.cs` lines 110 and 154 | ✅ Verified |
| **The `Contract`-traceability convention** | `ProphetsWay.Example/AGENTS.md` line 417, citing FR 12 | ✅ Verified |
| **Stage 3 = three fat laps**, `Test Auditor` + checkpoint per boundary | **this file only** | ⚠️ Correctly so — it is a plan, not a durable decision |

### ⚠️ Reported, not assumed — the OD series is **not** filed with `Purpose Refiner`

The brief asked me to check whether **OD-1 … OD-7** are recorded in
`ProphetsWay.EFTools/docs/purpose-and-scope.md`. **They are not.** Verified by literal search:

| File | Occurrences of `OD-<n>` |
|---|---|
| `docs/purpose-and-scope.md` | **0** |
| `docs/feature-requests.md` | **0** |
| `docs/api-contract.md` | **all seven, and only there** |

`purpose-and-scope.md` carries a **different and unrelated series — D1–D8** — under *Owner Decisions
— 2026-08-15*. The two series share no numbering and are easy to confuse; a future agent reading
"OD-4" and finding "D4" will be reading the wrong decision.

**This may well be correct as it stands.** `api-contract.md` states its own ownership rule
explicitly: *"`docs/purpose-and-scope.md` and `docs/feature-requests.md` belong to `Purpose Refiner`.
This document **records** how the Stage 2 decisions answer questions those files carry open; it does
**not** change a status in either."* The OD decisions are **API-design** decisions, and the API
contract is arguably their permanent home.

**I did not move them.** That file is `Purpose Refiner`'s, and the judgment — whether an owner
decision taken *during* Stage 2 belongs in the owner-decision register or stays with the API
contract — is the owner's call, not a scribe's. **Raise it with `Purpose Refiner` when FR 11 is
closed; both are the same visit to the same file.**

## The Lesson Worth Keeping — the four-review-cycle pattern

**On `api-contract.md`, every revision introduced a new contradiction while closing the old ones.**
Revision 3 → 7, four full review cycles, and **each pass caught a fresh defect created by the pass
that fixed the last one.** A verification pass after each edit was **not paranoia — it was the base
rate.**

The pattern is sharper than "long documents have errors," and specific enough to plan around:

1. **The document describes a moving target.** Revision 6 was written while the Example retrait was
   pending; the retrait landed mid-write; and the resulting stale sentence sat **inside a test
   obligation**, telling its author to **expect a red Example test**. That is precisely the condition
   under which a genuine regression is waved through. A document that cites another repository's
   state goes stale **during** authoring, not after it.
2. **Sweeps miss.** The OD-7 sweep found **eight of nine** sites. The one it missed was the `Restore`
   sample — **the document's only worked custom write** — which went on teaching copiers the exact
   shape OD-7 had just retracted.
3. **Self-assessment is not assessment.** Revision 3's status line was recorded at 19:50 against a
   file last written at 20:22. It graded a draft it then replaced. An independent review of the text
   *as it actually stood* returned **BLOCK** — five blocking, eight significant, seven minor. This is
   why the status line is now *"a statement of where this document is in the workflow, not a
   statement of its quality, and it is not the authoring agent's to advance."*
4. **And it happened again tonight.** Discrepancies 1 and 3 at the top of this file are two more
   instances — a corrupted section and a superseded count, both introduced **after** the last review
   and both **committed**. The rate has not dropped.

**Operational consequence for Stage 3:** budget a verification pass after **each lap**, not only at
the end. The owner's checkpoint-at-each-boundary decision already assumes this; the record above is
the evidence that it is the right call rather than an expensive habit.

The general form, worth promoting to `AGENTS.shared.md` if it recurs on a third document:
**a long specification under active revision has a per-revision defect-injection rate near 1. Treat
"the last edit introduced something" as the default hypothesis, and re-verify the specific claims
that edit touched** — not the document as a whole, which is what keeps it affordable.

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| EFTools `README.md`, stale since 2022-08-14 | Stage 4 work. Rewriting it against a 3.x surface that does not exist yet would be fiction | After Stage 3 Lap 3 |
| SQLite + SQL Server container harness | Lap 3 dependency; not needed for Laps 1–2 | Start of Lap 3 |
| Logger's 7 abandoned `.cs` edits | Unrelated to the EFTools effort; the owner has not decided | Next Logger pass |
| Untracked `AGENTS.md` in Logger / Utilities / Hasher | Same | Same |
| markdownlint config | The two files an earlier sign-off believed existed **do not exist** — verified absent again. Anyone doing this starts from scratch | Its own session |
| Promoting the defect-injection lesson to `AGENTS.shared.md` | One document is an anecdote, and a change there is a change to seven repos | If it recurs on a third document |
| **The D10 seam's design** | Direction is decided (shape B); the shape is not. Designing it now commits `ProphetsWay.Example` before the requirements are known | **Lap 1**, once it shows what the seam must carry |
| **Consolidating the three purpose-built type sets** in `api-contract.md` (`Country`, `Assignment`, `Label`/`Article`) | Restructuring, not a fold-in. J1 was a findings pass | Next substantive revision of that document |

## Recent Sessions

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
