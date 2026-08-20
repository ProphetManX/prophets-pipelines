---
written: 2026-08-19T23:59:00
head:
  prophets-pipelines: f8ffcb4              # main — 1 ahead of origin; dirty: this file
  ProphetsWay.EFTools: 8401e2e             # branch 3.0.0-first-pass — pushed; dirty: docs/api-contract.md, docs/feature-requests.md + untracked AlternateKeyGuardSpikeTests.cs
  ProphetsWay.Example: 61d9e7d             # main — dirty: docs/feature-requests.md
  ProphetsWay.BaseDataAccess: 207c5de      # main — clean
  ProphetsWay.Logger: 86568fd              # main — untracked AGENTS.md
  ProphetsWay.Utilities: 5095e5e           # master — untracked AGENTS.md
  ProphetsWay.Hasher: d1410ca              # master — untracked AGENTS.md
  ProphetsWay.BPA: 4c0ba1f                 # main — empty repo, clean
status: fresh                              # wrapup 2026-08-19 — deliberate sign-off
---

# Session Handoff

## Where We Are

`ProphetsWay.EFTools` **3.0.0 first pass**, branch `3.0.0-first-pass`, **Stage 2 — the api-contract
specification**. The entire session went into that one document: **Revision 8 → Revision 10 across
three review→revise cycles, plus one empirical spike.**

**No Stage 3 code was written and no lap was run.** The six-family DAO shape pass **has not started**,
and that is the correct outcome — starting it would have meant writing a published API surface against
a document carrying five blocking defects.

`ProphetsWay.EFTools/docs/api-contract.md` is at **Revision 10, `under review`**. The rev 10 delta
review returned **not yet fit** — 2 blocking, 4 significant, 3 minor — and explicitly judged that **a
fourth full revision cycle is not warranted.**

## Current Focus

**Seven in-place fixes to `docs/api-contract.md`.** All unblocked; none needs an owner decision. Then
one delta pass over the changed sites plus a fresh obligation count. Then the shape pass.

> ⛔ **Do NOT run a fourth full revision cycle.** The reviewer's own judgement: *fix in place, then one
> delta pass over the changed sites plus a fresh count from zero.*

## Next Session — Start Here

### Step 1 — `@Interface Architect`, seven localized edits to `ProphetsWay.EFTools/docs/api-contract.md`

| # | Edit | Fixes |
|---|---|---|
| **1** | **Move A24 step 9c inside step 10's `finally`, ahead of the detach**, and **extend the A37 obligation with a failed-`SaveChanges` arrangement.** **Do this one first.** A37's entire mechanism is currently unreachable on the failure path — a failed `SaveChanges` leaves the library's copy sitting in the caller's collection, which is exactly what OD-7 exists to prevent. The guarding obligation tests the success path only | **blocking** |
| **2** | **Split A17's caching sentence.** Per closed generic type is right for **A8's identifier resolution** (a CLR-type fact) and wrong for **A32's generation branch** (a model+provider fact) — cache that **per `Context.Model` or per DAO instance.** As written it **contradicts D4**: one process running both certified legs over the same `BaseDao<Resource, Guid>` has the second DAL silently inherit the first's branch. **The only outstanding D-decision contradiction** | **blocking** |
| **3** | **Name the `IValueGeneratorSelector` member**, and say what a **throwing** selector means — an implementer calling the ordinary `Select` gets a throw where the document expects an absence. **Should be written by someone who can compile it** | significant |
| **4** | **Name A37's removal mechanism** — model navigation → `Inverse` → collection accessor. A37 is the **only rule in the document stating a behavior with no mechanism**, the exact defect A35 was refined to remove | significant |
| **5** | **Restate the keyless `MatchRow` purity constraint in *The two hooks***, with its failure mode and a stated diagnostic. It is a **new narrowing of a public extension point**, currently stated only in the A34 subsection — where the shape pass will not read it | significant |
| **6** | **Recount every obligation from zero — do not adjust by one.** Published 150 = 131/11/8; the reviewer counted **132/11/8 = 151**. `[X]` and `[D]` exact, `[C]` one high. **The three still sum, so the preamble's integrity check passes while being wrong** — the precise failure mode that section exists to catch. Where the drift entered could not be established | the tally |
| **7** | **Declare A35's limitation per Q14 — and do NOT narrow the exclusion.** It stays exactly as written (`IProperty.IsKey()`). What is owed is **self-diagnosing wording**: *it applies if and only if the property is declared in a key; a unique index alone is unaffected.* State the silent drop on the **A25 pattern** — `Update` returns `1`, the key-column change discarded. Re-cut A35's worked example: an `Email` `MatchRow` is far more often a unique index, in which case nothing is excluded | significant |

**Fold in, non-blocking:** keyless `UpdateCore` on an entity whose mapped scalars are *all* key
properties (`CompanyResource`) **writes nothing and returns `1`** — declare it, do not leave it to be
discovered; the `Restore` sample's pre-detach hard-codes `e.Entity.Id == item.Id` where A34's keyed rule
is `GetKey`, **and the document itself says of that sample "both are copied; both must be right"**; A36
has no keyed counterpart to `RootNonIdDao`; N12's routing table adds a *"get-only identifier"* row
without the write-back limitation.

### Step 2 — `@Contract Reviewer`, one delta pass

Over the changed sites **only**, plus the fresh obligation count. **Not a full review.**

### Step 3 — `@Interface Architect`, the six-family DAO shape pass

Names, type parameters, which members are `virtual` / `abstract` / `sealed`, XML docs. **Surface only** —
semantics are already settled by `DepartmentDao`
(`ProphetsWay.EFTools/ProphetsWay.Example.DataAccess.EF/Daos/DepartmentDao.cs`, 299 lines, 33/33 green)
and by the contract. Nothing is being invented in that pass.

**The D17 amendment must be in that brief:** plan `CompanyResourceDao` as a **conversion onto
`RootNonIdDao<CompanyResource>`**, not as a permanent hand-written DAO.

**Why shape comes first, recorded so it is not skipped as ceremony:** the fatal flaw in the current
bases is a *shape* flaw — every member is declared `new` instead of `virtual`, so it can only be hidden,
never overridden. Exactly the kind of decision made by accident when the author is focused on behaviour,
on a surface that lives for a whole major version.

### Then, unchanged

| # | Task | Agent |
|---|---|---|
| 1 | Review that surface | `Contract Reviewer` |
| 2 | Fill the bodies from `DepartmentDao`'s semantics — **D15** | `Implementer` |
| 3 | Repoint the five existing DAOs onto the families — **D17** | `Implementer` |
| 4 | **Convert `DepartmentDao` onto the soft-delete family — D16, the family's acceptance test.** 33/33 must still pass, **and the conversion must state which of its seven private helpers the family absorbed** | `Implementer` |
| 5 | `CompanyResourceDao` + the `CompanyResource` mapping; fold in the `NotWrittenYet` message fix | `Implementer` |

## Open Questions — Blocking

**None.** Q13 and Q14 are both closed; nothing gates the seven fixes.

## Open Questions — Non-Blocking

### 1. Needs an owner decision — the spike file's fate

`ProphetsWay.EFTools.Tests/AlternateKeyGuardSpikeTests.cs` — untracked, 14 tests, **exit 0**, no package
references added, self-contained `SpikeUser` / `SpikeUniqueUser` / `SpikeContext` declared in the file.

**Coordinator's recommendation: keep it, traited `Characterization`, with a `Test Auditor` pass first**
— specifically checking whether the four `Record.Exception` sites could mask an exception thrown by the
**setup** rather than the **act**. The `SpikeUser` naming also wants a decision.

*For keeping:* it pins EF Core behavior A35 now leans on, **including the negative result for unique
indexes**, and would fail loudly if a future EF Core release relaxed the guard. *Against:* it defines its
own model and context, and every assertion in it is about a third party, not about EFTools.

> ⚠️ **It is the first test to exist in `ProphetsWay.EFTools.Tests`.** EFTools `AGENTS.md`
> **deviation 4** still says that project holds no tests. **That needs revisiting either way** — keep the
> file and the deviation is wrong; delete it and the deviation is right only by accident. It is
> `Repo Analyst`'s artifact and was deliberately **not** edited at wrapup, because editing it before the
> file's fate is decided would only produce a second wrong statement.

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

## In Flight

| Item | State | Where |
|---|---|---|
| `docs/api-contract.md` Revision 10 | Written and delta-reviewed. **Not fit** — 7 fixes owed, 2 of them blocking | `ProphetsWay.EFTools/docs/api-contract.md`, uncommitted |
| `AlternateKeyGuardSpikeTests.cs` | 14 passing tests, **fate undecided — owner's call** | `ProphetsWay.EFTools/ProphetsWay.EFTools.Tests/`, untracked |
| Six-family DAO shape pass (FR 10) | **Not started.** Gated on the document | — |
| `CompanyResourceDao` and its `ExampleContext` mapping | **Do not exist** — no `DbSet`, no `ToTable`. ~16 of the 28 red tests | `ProphetsWay.Example.DataAccess.EF/` |
| `NotWrittenYet` message | Still claims Department has no EF DAO and that `ExampleContext` maps neither entity — **both now false for Department.** Thrown only from `CompanyResource` forwarders, so harmless today | `ProphetsWay.Example.DataAccess.EF/` |
| EFTools `AGENTS.md` deviation 4 | **Now stale** — records the test project as deliberately empty; one test file exists there | `ProphetsWay.EFTools/AGENTS.md` |
| `ProphetsWay.EFTools` FR 15 | Filed `Proposed` at wrapup, awaiting `Purpose Refiner` triage | `ProphetsWay.EFTools/docs/feature-requests.md`, uncommitted |
| `ProphetsWay.Example` FR 15 and 16 | Filed `Proposed` at wrapup, awaiting `Purpose Refiner` triage | `ProphetsWay.Example/docs/feature-requests.md`, uncommitted |
| `ProphetsWay.EFTools/README.md` | Documents types that no longer exist — `BaseEFDataAccess<TContextType, TIdType>`, `BaseEFContext(string)`. **The list grows with every lap**; the family collapse will lengthen it further | Stage 4 |

## Uncommitted Changes

**Verified against `git status` in all eight roots at wrapup — not carried over from any earlier report.**

> ⚠️ **Nothing was committed this session, and committing is the owner's call. No agent may commit,
> stage, or push.**

| Repo | Files | Description |
|---|---|---|
| `ProphetsWay.EFTools` @ `8401e2e` | ` M docs/api-contract.md` (**+547 / −122**) | Revision 10. Branch `3.0.0-first-pass`, **pushed and in sync with origin** |
| `ProphetsWay.EFTools` | `?? ProphetsWay.EFTools.Tests/AlternateKeyGuardSpikeTests.cs` | The Q14 spike. **Fate undecided — do not commit it reflexively** |
| `ProphetsWay.EFTools` | ` M docs/feature-requests.md` | **New at wrapup** — FR 15 plus its index row |
| `ProphetsWay.Example` @ `61d9e7d` | ` M docs/feature-requests.md` | **New at wrapup** — FR 15 and 16 plus their index rows. `main` otherwise clean and in sync |
| `prophets-pipelines` @ `f8ffcb4` | ` M docs/session-handoff.md` | This file. **`main` is 1 commit ahead of `origin/main`** — `f8ffcb4` is unpushed. The only repo ahead of its remote |
| `ProphetsWay.Logger` @ `86568fd` | `?? AGENTS.md` | Long-standing, untouched this session |
| `ProphetsWay.Utilities` @ `5095e5e` | `?? AGENTS.md` | Same |
| `ProphetsWay.Hasher` @ `d1410ca` | `?? AGENTS.md` | Same — **and this one is a correction sitting outside version control.** It is the file that was found instructing agents to make a binary-breaking namespace change. Worth committing on its own merit |

`ProphetsWay.BaseDataAccess` (`207c5de`) and `ProphetsWay.BPA` (`4c0ba1f`, empty) are **clean**.

**Nothing here looks accidental.** The three untracked `AGENTS.md` files are the only oddity and they
predate this session by three days.

## Decisions Made This Session

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
| The six-family shape pass | Would have been written against a document with five blocking defects. **Q10 inverted the order and was vindicated immediately** | The document passes its delta pass |
| A fourth full revision cycle | The reviewer explicitly judged it unwarranted — fix in place instead | Never, unless fresh blocking findings appear in newly written text |
| Editing EFTools `AGENTS.md` deviation 4 | The spike file's fate is undecided; editing now would only produce a second wrong statement | The owner decides on the spike file |
| Measuring the guard under `Attach` / `DbContext.Update()` on a detached graph | Not asked. `Test Designer` correctly declined to report an unrequested result with the same confidence as the requested one | If A35 grows a detached-graph path |
| Deviation 3 — remove the SQL Server and InMemory provider references from the published library | Breaking; needs the provider-neutrality lap. `Microsoft.EntityFrameworkCore.InMemory` now has zero call sites in the library | The provider-neutrality lap |
| `xUnit1013` on the submodule's `DepartmentDaoTests.cs` lines 294 and 1001 | Upstream — a `Test Designer` fixes it **in `ProphetsWay.Example`**, never from the EFTools side | Next Example pass |
| The three corrected untracked `AGENTS.md` files | Out of scope once the owner narrowed to four repos | Owner's convenience |
| A `conventions/AGENTS.shared.md` rule that **a revision-log entry is not evidence its own correction landed** | The shared block regenerates seven repos — an owner instruction, not a scribe's edit | Owner's call |

## Standing Guardrails

- **The 9 `IDENTITY_INSERT` failures are not a defect in `DepartmentDao`.** They are the **acceptance
  criterion for FR 10**, not a regression to clear first. Making `DepartmentDao` adopt the caller's
  instance like its neighbours would turn them green and would be **wrong** — an available option,
  explicitly declined.
- **Do not fix `RootNonIdDao`, `RootDao` or the 18 key-typed classes in place.** D14 forecloses that
  route: they are deleted by FR 10, and correcting them first removes the only signal distinguishing a
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
  `AsNoTracking()`** — not before, or every Example read silently becomes tracked.
- **Never edit anything under `ProphetsWay.EFTools/ProphetsWay.Example/`** — pinned submodule. Edit
  upstream and move the pointer.
- **`ConventionShowcaseTests` and `ExceptionPassthroughShowcaseTests` stay excluded** — `Scope=Dispatcher`,
  they belong to `ProphetsWay.BaseDataAccess`, and their DALs are deliberately mis-wired.

## Measured State — carried forward from 2026-08-18, not re-measured

**151 tests · 123 passed · 28 failed.** No lap ran this session.

| Count | Failure | Note |
|---|---|---|
| 16 | `CompanyResourceDao` `NotImplementedException` | Shape-pass task 5 |
| **9** | `Cannot insert explicit value for identity column in table 'Departments'` | **The adoption defect surfacing. These fail *because* `DepartmentDao` is correct** |
| 2 | `UserDao` null-navigation `NullReferenceException` | Pre-existing; no `Include`, and `NoTracking` prevents fix-up |
| 1 | `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance` | 30-second SQL Server lock timeout. `Scope=Characterization`, **failing correctly** |

**The gate is `--filter "Scope=Contract|Guard=Seam"`** — 139 + 7 = **146**. `Scope=Contract` alone omits
the seam guard entirely; any older text naming it as the complete gate is superseded.

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
