---
written: 2026-08-25T01:42:00
head:
  ProphetsWay.EFTools: e2f2120             # main, 0/0 — UNCHANGED since 08-24. DIRTY ×11: 7 tracked test files +
                                           # 2 tracked docs + 2 UNTRACKED (TestStore.cs, ProviderSelectionTests.cs).
                                           # MEASURED this checkpoint. e2f2120f59b4fdb47208cb82bb37c3e956d4440a
  ProphetsWay.Example: 39d0e72             # submodule pointer CONFIRMED this checkpoint: 3.1.1-1-g39d0e72. Repo itself not re-measured
  ProphetsWay.BaseDataAccess: 30bfc71      # main, 0/0, clean. NOT re-measured this checkpoint — out of scope
  prophets-pipelines: 8095b6e              # main, 0/0. DIRTY ×1: docs/session-handoff.md (this file). MEASURED this checkpoint
  ProphetsWay.BPA: 4c0ba1f                 # main, 0/0, clean. NOT re-measured this checkpoint — out of scope
  ProphetsWay.Logger: 66bfa3c              # main, 0/0, clean. NOT re-measured this checkpoint — out of scope
  ProphetsWay.Utilities: bb7bcaa           # master, 0/0, clean. NOT re-measured this checkpoint — out of scope
  ProphetsWay.Hasher: 4b286ae              # master, 0/0, clean. NOT re-measured this checkpoint — out of scope
status: live                               # CHECKPOINT 2026-08-25 01:42 by Session Scribe, delegated, scoped to EFTools +
                                           # prophets-pipelines. Supersedes the 2026-08-24 22:52 checkpoint.
                                           # 🔴 THE SUITE IS RED BY DESIGN — 327/328. Auto-save, not a clean wrap;
                                           # reconcile against git before trusting the five unscoped heads.
---

# Session Handoff

---

# 🔴 CHECKPOINT — 2026-08-25 01:42. GATE 1 IS AT ITS FINAL RED MICRO-LAP. **NOT GREEN RIGHT NOW.**

> ⚠️ **Read this before any figure below.** Gate 1 *was* green — twice, at 303/303 and again at 327/327 —
> and that evidence is real and preserved. **It is not the current state.** A deliberate red-phase test was
> added afterwards and the suite now stands at **328 total / 327 passed / 1 failed**. **Never report Gate 1
> as currently green.** The failure is intended, is the correct failure, and is one owner edit from closing.
>
> 🔒 **The remaining step cannot be delegated.** `Vanguard` cannot write code, and **no remaining leaf
> charter permits a behaviour-changing edit inside a test project on a red baseline.** The owner makes the
> edit. Exact instructions are below and are copy-ready.

**Measured this checkpoint** with `git status --porcelain`, `git log --oneline`, `git diff --stat`,
`git diff --check` and `git submodule status` in `ProphetsWay.EFTools` and `prophets-pipelines`.
**`ProphetsWay.EFTools` HEAD is still `e2f2120`, `main`, 0/0 — no commit has been taken all cycle.** The
entire Gate 1 body of work is **uncommitted**: 9 modified tracked files and 2 untracked files.
`git diff --check` exits **0** — the worktree is whitespace-clean.

## ✅ Prior green evidence — real, earned, and NOT the current state

Each row is one completed lap with a receipt. **These figures were true when measured and are superseded
as a description of *now*.** They are the certification evidence Gate 1 rests on; do not discard them.

| Lap | Receipt | Measured result |
|---|---|---|
| **Test migration** — enum-order fix + every non-exempt provider call site routed through the `TestStore` seam | `…test-designer-20260825-001530-6p7m.md`, `COMPLETE` | `EFTOOLS_PROVIDER=SqlServer`: build 0/0; **full suite 303 / 303 / 0** (13 s); gate `Scope=Contract\|Guard=Seam` **278 / 278 / 0**; `ProviderSelectionTests` **33 / 33 / 0**; `sys.databases LIKE 'EFToolsTest[_]%'` → **0 orphans**. Residual scanner green with an empty site list |
| **Cleanup / isolation surface** — `TestStore.cs` reporting cleanup, per-store `ClearPool` replacing process-global `ClearAllPools` | `…implementer-20260825-005358-rx3o.md`, `COMPLETE` | Baseline 21 failed / 36 passed → **`ProviderSelectionTests` 57 / 57 / 0**; **`Area=StoreCleanup` 24 / 24 / 0**; **full suite 327 / 327 / 0**; gate **302 / 302 / 0**; `sys.databases` → **0 orphans, no identities**. All 24 `*Tests.cs` files verified unmodified after the run |
| **Final correctness review** | `…code-reviewer-20260825-011452-h19l.md`, `COMPLETE` | 9 findings: **0 Must Fix**, 3 Should Fix, 6 Consider, 4 Untested Behaviour. **Verdict: ship with minor changes; checkpoint MAY PROCEED.** Read-only — repository unchanged |

**The counts reconcile exactly:** 270 pre-existing → **303** (+33 `ProviderSelectionTests`) → **327**
(+24 `Area=StoreCleanup`) → **328** (+1 this lap). Any figure that does not sit on that ladder is wrong.

## 🔴 The current state — one red case, and it is the right one

**Lap:** final red-phase `Test Designer` run — receipt `…test-designer-20260825-012254-4sm1.md`, `PARTIAL`
**by design** ("all four packet tasks landed and validated; `PARTIAL` because this is a deliberate red-phase
change"). It changed **two files only** — `ProviderSelectionTests.cs` and `IdentifierResolutionTests.cs`.
**`TestStore.cs` was read-only in that lap**, which is precisely why the suite is red.

| Measurement | Value |
|---|---|
| `dotnet build ProphetsWay.EFTools.Tests.csproj -c Debug` | **exit 0**, six projects, **0 warnings / 0 errors** |
| Full `dotnet test` | **Total 328 · Passed 327 · Failed 1 · Skipped 0** — 1 m 30 s |
| `--filter "Area=StoreCleanup"` | **25 total · 24 passed · 1 failed** (area count 24 → 25) |
| Conformance gate `--filter "Scope=Contract\|Guard=Seam"` | **303 with 1 red** — ⚠️ **derived** from the class-level `Guard=Seam` trait, **not separately re-run** |
| Orphan risk from the new case | **None** — it opens no store and touches no database |

**The one failing test, named exactly:**
`ShouldRegisterAStoreBeforeProvisioningItAndForgetItIfProvisioningFails` — `Area=StoreCleanup`, inheriting
the class-level `Guard=Seam`. It is **structural**: it walks the IL of the compiled
`TestStore.Store(TestStoreProvider, string)` constructor and locates registration, provisioning and
rollback **by shape**, not by name or line number.

**Its failure message, verbatim:** `registration should be less than 6 but was 9` — the constructor *"brings
the store into being (`Microsoft.Data.Sqlite.SqliteConnection..ctor`) before it registers the identity
(`ProphetsWay.EFTools.Tests.TestStore.RegisterIdentity`)"*. **That is the real defect**, independently found
by the `Code Reviewer` as Should Fix 1: a window in which a database exists on the server and is absent from
`LiveIdentities`, producing a false-positive orphan and a flaky
`ShouldLeaveNoDisposableStoreBehindOnTheServer`. **The test is correct and the code is wrong. Do not weaken,
skip, retrait or delete it.**

**Also landed in that lap, all green:** `ShouldRouteEveryFixtureStoreThroughTheReportingCleanup` widened from
methods *named* `WithStore` to **every method in the six fixture classes whose IL calls `OpenStore`**; both
plain-`using` store sites in `IdentifierResolutionTests` converted to `store` + `completed` +
`try/finally` → `TestStoreCleanup.DisposeReportingFailure`; and the stale *"red until the surface is
written"* clause removed from `TestStoreCleanup`'s `<remarks>`. That closes `Code Reviewer` Should Fix 2 and 3.

## 🔒 The blocker — a charter boundary, **not** a code failure

**Receipt `…implementer-20260825-013558-w2a0.md` — `State: BLOCKED`, `Changed paths: none`, validation not
run.** The `Implementer` charter absolutely forbids editing anything inside a test project, and
`ProphetsWay.EFTools.Tests/TestStore.cs` is inside one; the packet permitted no other path. **It wrote
nothing and ran nothing — so it reported nothing, honestly, rather than fabricating post-change counts.**

🚫 **Do not treat this as a build or test failure, and do not re-invoke `Implementer` on it.** The supplied
baseline it declined to alter is exactly the 327/328 above. `TestStore.cs`'s last write time is **00:57**,
before the 01:22 red lap and the 01:35 blocked run — corroborating that neither touched it.

## ✍️ THE OWNER'S EDIT — one constructor, copy-ready

**File:** `ProphetsWay.EFTools/ProphetsWay.EFTools.Tests/TestStore.cs` (324 lines)
**Method:** `Store(TestStoreProvider, string)` — the constructor, nothing else in the file.

1. **Register before provisioning.** After the `IsDisposableIdentity` refusal and after assigning the
   provider and identity fields, call **`RegisterIdentity(identity)`** — **above both provider branches**,
   so nothing is created on any server before the registry knows about it.
2. **Wrap the provisioning in a `try`** — the SQLite keeper construction **and** its `Open()`, and the SQL
   Server `CreateSqlServerDatabase(identity)`.
3. **On failure, roll back and rethrow:** dispose the partially constructed **`_sqliteKeeper` if it is
   non-null** (`SqliteConnection` inherits `Component`'s finalizer, so a leaked keeper takes the shared
   in-memory database with it), call **`ForgetIdentity(identity)`**, then **rethrow**.

**Do not edit either test file to accommodate this.** The guard asserts rollback *after* provisioning
precisely because a handler is emitted after its protected region — an unconditional `ForgetIdentity`
will not satisfy it.

### Then re-run, with `EFTOOLS_PROVIDER=SqlServer`, from `C:\Projects\ProphetManX\ProphetsWay.EFTools`

| # | Command | Expected |
|---|---|---|
| 1 | `dotnet build .\ProphetsWay.EFTools.Tests\ProphetsWay.EFTools.Tests.csproj -c Debug --nologo` | exit 0, **0 warnings / 0 errors** |
| 2 | `dotnet test .\ProphetsWay.EFTools.Tests\ProphetsWay.EFTools.Tests.csproj --filter "Area=StoreCleanup"` | **25 / 25 / 0** |
| 3 | `dotnet test .\ProphetsWay.EFTools.Tests\ProphetsWay.EFTools.Tests.csproj` | **328 / 328 / 0** |
| 4 | `dotnet test .\ProphetsWay.EFTools.Tests\ProphetsWay.EFTools.Tests.csproj --filter "Scope=Contract\|Guard=Seam"` | **303 / 303 / 0** — and this *measures* the figure only derived above |
| 5 | `sqlcmd -S localhost -E -Q "SELECT COUNT(*) FROM sys.databases WHERE name LIKE 'EFToolsTest[_]%'"` | **0** |

**Only when all five pass is Gate 1 green again**, and only then is the change set ready for
`Commit Author`. **Committing remains the owner's decision; nothing was staged, committed or pushed by this
checkpoint.**

## 📌 Deferred, and deliberately not lost

| Item | Owner | Why it is deferred, not dropped |
|---|---|---|
| **Direct SQL Server / `Microsoft.Data.SqlClient` `PackageReference`** | **`Modernizer`** | `Code Reviewer` **Must Fix 2**, *open and accepted by owner decision*, deferred until this cycle is green. **This is the one deferred item most likely to be forgotten — it is a Must Fix carried on purpose, not a resolved finding.** The test project uses SqlClient types transitively today |
| `Code Reviewer` Should Fix 5 — startup provider validation in `TestSeam.cs` | `Test Designer` | Open, unimplemented. `Test Auditor` ranked it post-Gate-1 / legibility. Not blocking |
| `Code Reviewer` Should Fix 7 — extract the IL scanner | — | `Refactorer` correctly declined (test code). Not blocking |
| 6 *Consider* + 4 *Untested Behaviour* findings | `Test Auditor` | Incl. the `reporting == null` fallback, the `!bodySucceeded` branch, `OpenStore`/`ConfigureExisting` argument validation, `SINGLE_USER` left set on a failed drop, `_disposed` read outside `_disposeLock`. Post-Gate-1 |
| SQLite whole-suite leg — `EFTOOLS_PROVIDER=Sqlite` | `Test Designer` | A later **non-gating** leg by prior settled decision |
| A real cleanup **failure** path | `Test Auditor` | Shape, quiet path, idempotence and routing are pinned; the failure branch still is not. Named as residual risk in the review |

## 🔵 Gate 2 — Azure SQL. A release gate, and NOT STARTED

**Settled owner decision: local Microsoft SQL Server *and* Azure SQL certification are BOTH release gates
before the EFTools 3.0.0 tag and publish.** This **answers the old Q5 / P2** — Azure SQL is a certified leg,
not merely in-scope-uncertified. Per the `Purpose Refiner` receipts the durable record now carries **D20–D22**
and **FR 19** in `ProphetsWay.EFTools/docs/`; ⚠️ **this checkpoint did not open those documents** — that is
read from the receipts, so verify the wording there before quoting it.

**Undecided and blocking Gate 2:** the **Azure infrastructure repository** (does one exist, is one to be
created, where does it live) and **10 other FR 19 inputs**. Nothing about Gate 2 has been started, and
**no Azure deployment is authorized.**

**Still unauthorized, unchanged:** any version bump, tag, publish, `.yml` change, or Azure deployment.

---

> 🔧 **CHECKPOINT — 2026-08-24 22:52. Stage 1 of the SQL Server certification cycle is COMPLETE.**
> ⚠️ **PARTIALLY SUPERSEDED by the 2026-08-25 01:42 checkpoint above.** Its Stage 1 record stands; its
> closing claims that *"Stage 3 has NOT started"* and *"nothing test-facing has been written"* are **dead** —
> Stage 3 ran to green twice and is now at a final red micro-lap. Read the 08-25 section first.
>
> Scope was **two repos**: `ProphetsWay.EFTools` and `prophets-pipelines`. Both were **measured with
> `git log -1 --format='HEAD %H %s'` and `git status -sb -uall`** in this pass, plus `git diff --stat`
> and `git submodule status` in EFTools. The other five heads are **carried, not re-measured** — they are
> labelled as such in the frontmatter. **The whole 2026-08-23 sign-off below is retained** and is still
> the substantive historical record; this checkpoint amends its Current Focus, Next Session, In Flight
> and Uncommitted sections and rewrites the release-gate section immediately below.
>
> ⚠️ **This is a `live` auto-save, not a sign-off.** ⚠️ **Stage 3 has NOT started.** Nothing test-facing
> has been written.

---

# ✅ 2026-08-24 — THE PACKAGING COMMIT LANDED, THE GATE MOVED, AND STAGE 1 IS DONE

**Measured this checkpoint.** `ProphetsWay.EFTools` HEAD is
**`e2f2120f59b4fdb47208cb82bb37c3e956d4440a`** — subject *"Complete package metadata and enable Source
Link"* — on `main`, **0 ahead / 0 behind**. Task 0 of the 08-23 list is **done**. 🔄 **The worktree is no
longer clean**, as it was at 22:30: `docs/feature-requests.md` and `docs/purpose-and-scope.md` now carry
**the expected Stage 1 `Purpose Refiner` edits**. Three files are dirty across two repos — see
*Uncommitted Changes*. **Nothing is accidental and nothing is mid-edit.**

## 🔴 The release gate — the owner's exact words, preserved

> *"if we can't say EFTools is cleared to work in SQL Server, then it's not worth pushing out."*

**SQL Server certification is a release gate, not a preference. `ProphetsWay.EFTools` 3.0.0 stays
untagged and unpublished until that evidence exists.** No version bump, tag or publish is authorized.
**Azure SQL as an *additional* certification leg remains an open owner decision** — now durably recorded
as **Q5** in `ProphetsWay.EFTools/docs/purpose-and-scope.md`, and still unanswered.

## ✅ Stage 1 is COMPLETE — the owner approved the stages, and both leaves reported

**New owner statement, verbatim, superseding the "unapproved route" wording this section used to carry:**

> *"i have a local instance of mssql running on local host, if we need to deploy the schema from Example's
> sqlproj dacpac, we can deploy it locally to then run our tests against it. please go ahead with your
> planned stages"*

**Still no authorization for:** a version bump, a tag, a publish, any `.yml` change, or any Azure
deployment. Unchanged.

### Leaf 1 — `Purpose Refiner`: FR 11 reconciled, D20 / D21 / Q5 recorded

**Receipt:** `C:\Users\Proph\AppData\Local\Temp\vanguard-receipt-purpose-refiner-20260824-223611-0amv.md`,
`State: COMPLETE`. Changed exactly two files, both uncommitted — see *Uncommitted Changes*.

| What landed | Detail |
|---|---|
| **D20** | Whole-suite SQL Server certification is a **release gate** on EFTools 3.0.0. Owner quote carried verbatim into the durable record |
| **D21** | **Local MSSQL is the certification environment**; deploying the `ProphetsWay.Example` DACPAC locally is authorized; the target is **one complete 270/270 SQL Server run**. Explicitly framed as *available evidence, not certification* |
| **Q5 — OPEN** | **Azure SQL**: certified leg, in-scope-uncertified, or out of scope for 3.x? **Owner decision required.** Deliberately **not** filed as a feature request — a request implies work is wanted, and the scope call comes first. This is the old **P2** in its durable form |
| FR 11 | **Release-blocking classification changed; the status token is unchanged at `Scheduled`.** Its dead "fact 2" re-scoped, and the corrected implementation scope recorded in the entry |

> ⚠️ **No status transition was taken on any entry — `Purpose Refiner` reported "Status transitions
> applied: None."** So **FR 16 is still `Proposed`** despite being materially closed by `e2f2120`, and
> **FR 18 is still open** despite `TestResults/` being gone. Both are follow-ups, not Stage 1 misses.

### Leaf 2 — `Modernizer` recon: no blocker, and the packaging gap is proven closed

**Receipt:** `C:\Users\Proph\AppData\Local\Temp\vanguard-receipt-modernizer-20260824-223611-gbus.md`,
`State: COMPLETE`, **read-only — changed paths: none.**

| Check | Result |
|---|---|
| `dotnet build ProphetsWay.EFTools.sln -c Debug` | **0 errors / 0 warnings**, 7 projects / 10 TFM outputs, incl. `ProphetsWay.Example.Database.dacpac` **under the .NET CLI** |
| `dotnet pack` + unpack | **`.nupkg` *and* `.snupkg`**; nuspec carries `<repository type="git" … commit="e2f2120…">`; README, CHANGELOG, `profile.png` and the XML doc all packed. **`e2f2120` closed the csproj packaging gap completely — proven by packing, not by reading** |
| `sqlcmd -S localhost -E` (read-only catalog query) | **Local SQL Server is reachable.** Database `ProphetsWay.Example` **exists with all seven tables**, `dbo.Departments` and `dbo.CompanyResources` included |
| `SqlPackage /Action:DeployReport` (**read-only**) | `<DeploymentReport><Alerts /></DeploymentReport>` — **zero schema drift. No deployment was performed**, and D21's DACPAC authorization is **not needed** |
| `dotnet test --list-tests --no-build` | **270 cases discovered. No test was executed** |
| `--outdated` / `--deprecated` / `--vulnerable` | Library and DAL projects clean; **no vulnerable package anywhere**. Three test-only packages behind, `xunit` 2.9.3 flagged *Legacy* → `xunit.v3`. **Do not bump before the certification run — runner/SDK bumps perturb discovery** |

**Verdict: no build, dependency, reference or packaging blocker stands between here and the certification
run.**

## ⚠️ The implementation scope must be RE-DERIVED — do not trust the 08-23 wording

The 08-23 sign-off and FR 11 both say *"make `Constants.GetExampleDataAccess` provider-selectable, then
run all 270 against SQL Server alone."* **That is not sufficient, and stating it as the plan will send the
next agent down a route that cannot reach the target.**

| Group | How it picks a provider today | What a `Constants` change reaches |
|---|---|---|
| **13 adapted upstream classes** | `TestSeam`'s `[ModuleInitializer]` → `TestDataAccessFactory.Use(() => Constants.GetExampleDataAccess, …)` | ✅ **Yes** — this is the seam |
| **8 locally-written classes** | Each **constructs its own SQLite in-memory / InMemory `DbContext` directly**; `AlternateKeyGuardSpikeTests` parameterizes both per `[Theory]` | ❌ **No** — they never call `Constants`, so changing it does not move them |

**Reaching an all-270 SQL Server run therefore requires provider-selectable wiring the locally-written
classes actually consume, not a one-line edit at the seam.** ✅ **Both Stage 1 leaves independently
re-verified this from source and agree**: `Purpose Refiner` grepped
`UseSqlite|UseSqlServer|UseInMemoryDatabase|SqliteConnection` and `EnsureCreated` across the test project
— **seven store-backed local classes build their own context and provision their own schema in-process,
and none of them calls `Constants`**; `Modernizer` put the same figure as **roughly 126 of the 270 cases
never touching SQL Server**. `CompanyResourceConversionTests` is the eighth local class and is
**reflection-only — no store, no connection**, so it needs no provider at all.

**Three things Stage 3 must settle, and none of them is decided:** the shape of the provider-selectable
wiring the seven store-backed classes consume (including **schema provisioning**, since they currently
call `EnsureCreated` themselves); what happens to `AlternateKeyGuardSpikeTests`, which **deliberately**
parameterizes two providers per `[Theory]`; and **per-test isolation on a real shared SQL Server**, which
an in-process SQLite connection gave for free and a shared database does not.

## 📋 The route — **APPROVED by the owner. Stage 1 done; Stage 3 NOT started.**

| Stage | What | Agent | State |
|---|---|---|---|
| **1** | Reconcile FR 11 + record D20/D21/Q5; build & dependency recon | `Purpose Refiner` + `Modernizer` | ✅ **COMPLETE** — 2026-08-24, both receipts `COMPLETE` |
| **2** | **Checkpoint / Direction Check** | `Session Scribe` | ✅ **This checkpoint** |
| **3** | **One coherent test-facing lap** — provider-selectable wiring that reaches **both** groups above, then a real **all-270 run against SQL Server**. Target **270/270, green** | **`Test Designer`** | 🔜 **NEXT — NOT STARTED.** Nothing test-facing has been written |
| **—** | **No tag until that run is green.** Unchanged | owner |

---

# 🔴 READ THIS FIRST — the purpose reveal

**The owner stated, for the first time anywhere in this workspace, what these libraries are *for*. It
reframes an open feature request from "deferred" into the release gate.** Verbatim, at sign-off:

> *"i want to pickup with this and get it SQLServer certified when we pickup. the whole point is to build
> these two pieces of software so i can leverage them when building a new app (BPA or even another web
> based tool that i've not mentioned yet HashDB) those will use a MSSqlServer locally for build/debugging,
> and i want to deploy to Azure SQL instance for production. if we can't say EFTools is cleared to work in
> SQL Server, then it's not worth pushing out. the one real customer is me, and it needs to be ready."*

## What is new here, and why each item matters

| # | Reveal | Why it is not recoverable from any file |
|---|---|---|
| 1 | **`HashDB` — a web-based tool, not previously mentioned** | **It appears in no document in this workspace.** No repo, no `AGENTS.md`, no feature-request index, no README. It exists only in this paragraph |
| 2 | **`ProphetsWay.BPA` has a stated purpose for the first time** | Measured tonight: HEAD `4c0ba1f` *"Initial commit"*, and `git ls-files` returns **exactly `.gitignore`** — no `AGENTS.md`, no `README.md`, no source. Every prior handoff called it *"a deliberate empty scaffold. Not neglect."* Still true — but it is now a scaffold **with a consumer relationship to EFTools** |
| 3 | **Deployment target: local MSSQL for dev/debug, Azure SQL for production** | **Nothing in this workspace has ever considered Azure SQL.** See the dedicated warning below — it is *not* simply remote SQL Server |
| 4 | **The release bar, in the owner's own words** | *"if we can't say EFTools is cleared to work in SQL Server, then it's not worth pushing out."* A stated gate on the 3.0.0 tag, not a preference. *"The one real customer is me"* — so there is no external pressure to ship early, and no external tolerance for shipping wrong |

## ⚠️ Azure SQL is a separate question from SQL Server — do not fold them together

The owner named **two** environments. Certifying against a local MSSQL instance does **not** certify Azure
SQL. The differences that bear on a DAL are real, and none of them has ever been looked at here:

- **Connection resiliency / retry.** Azure SQL disconnects routinely, so EF Core's `EnableRetryOnFailure`
  execution strategy is effectively mandatory — and **an execution strategy is incompatible with a
  user-initiated transaction unless that transaction is wrapped in `ExecuteInTransaction`.**
  `BaseEFDataAccess<TContext>` exposes `TransactionStart` / `Commit` / `RollBack` as first-class contract
  members, so this lands **directly on this library's transaction contract**, not on the consumer's code.
- **Transient fault handling** — error numbers and backoff behaviour a local instance never produces.
- **No `USE` statement**, different auth (Entra ID / managed identity rather than Integrated Security),
  and elastic-pool timeouts.

**Treat "certified on SQL Server" and "certified on Azure SQL" as two separate legs.** Recorded below as
blocking question **P2**.

---

# 🔴 FR 11 IS THE RELEASE GATE — reframed tonight

> **Disambiguation first, because the numbering collides.** Feature-request numbers are **per repository**.
> **`ProphetsWay.EFTools` FR 11 = the SQLite / SQL Server certification legs** — that is the one below.
> **`ProphetsWay.BaseDataAccess` FR 11 = `<Nullable>enable</Nullable>`**, an unrelated `Proposed` entry
> still sitting in *Deliberately Deferred*. **Never conflate the two.**

## The lead's error, recorded plainly so it is not repeated

Earlier tonight the lead advised: **"leave FR 11 where it is — not release-blocking."** The reasoning was
that the certification claim is not printed on the package, so the documents had not outrun the evidence.

**That was right about the documents and wrong about the purpose.** The owner then supplied the purpose,
and by their own bar **FR 11 is the release gate for EFTools 3.0.0.** `Purpose Refiner`'s earlier ruling —
that FR 11 was *not release-blocking*, and that *"nothing needs building within a week"* — **is superseded
by the same reveal.**

**The general lesson, worth keeping:** scope reasoning from written artifacts alone cannot see an unwritten
purpose. When a ruling turns on *who is this for and what will they do with it*, ask the owner before
ruling rather than inferring from the docs.

## What FR 11 actually requires — verified by reading the entry tonight

### ✅ Already done — do NOT re-do this

**SQL Server is wired and working.** `ProphetsWay.EFTools.Tests/Constants.cs` holds
`Data Source=localhost;Initial Catalog=ProphetsWay.Example;Integrated Security=True;TrustServerCertificate=True`;
the **13 adapted upstream classes** reach it through `TestSeam`'s `[ModuleInitializer]`; and **they ran for
real today** — that is where the **270 / 270 / 0** figure came from. **Schema deployment and pointing EF at
the instance is not the outstanding work.** Anyone starting there will spend a session rebuilding something
that already works.

### ❌ Genuinely outstanding — exactly two items

| # | Item | Detail |
|---|---|---|
| **1** | **No single provider runs the whole suite** | The split is **fixed by construction**: 8 locally-written classes on SQLite in-memory / InMemory, 13 adapted classes on SQL Server. The entry names the fix — **make `Constants.GetExampleDataAccess` provider-selectable**, so the adapted classes can also run on SQLite and **one provider can run all 270** |
| **2** | **`LocalTestsOnly: 'yes'`** | CI executes **none** of the 270, so a green pipeline proves **compilation only**. Its stated justification — a local SQL Server dependency — **has decayed**: the conformance gate now runs in **~2 seconds** and most locally-written classes need no database at all. `Pipeline Engineer` owns that edit; **it is NOT authorized** |

### 💀 Dead — do not restate

FR 11's own **"fact 2"** — *"the provider this package currently depends on is structurally unable to
verify the contract"* — **is false as of today.** After `77cfe5c` the package depends on **no provider at
all**: `ProphetsWay.EFTools.csproj` references `Microsoft.EntityFrameworkCore` and
`ProphetsWay.BaseDataAccess` and nothing else. The entry needs **re-scoping on that point**, not merely a
status move. **`Purpose Refiner` owns it.**

---

# ~~🚩 ONE UNCOMMITTED FILE IN THE WHOLE WORKSPACE~~ — ✅ SUPERSEDED 2026-08-24

> ✅ **This section is history.** The file it names was committed as **`e2f2120`** on 2026-08-24 and
> `ProphetsWay.EFTools` is now **clean**. Kept for the record of what the change contained and how it was
> proven. **The only uncommitted file in the workspace is now `prophets-pipelines/docs/session-handoff.md`.**

**Measured 22:00 on 2026-08-23 with `git status -sb -uall` in all eight repositories.**

| Repo | File | State |
|---|---|---|
| **`ProphetsWay.EFTools`** | **`ProphetsWay.EFTools/ProphetsWay.EFTools.csproj`** | ✅ **COMMIT THIS.** Complete, verified, proven by a real `dotnet pack` |
| Everything else | — | **Clean.** All eight repos 0 ahead / 0 behind. **No untracked files anywhere**, including `ProphetsWay.BPA` |

**What the change contains:** Source Link, symbol packages, `RepositoryType` `GitHub` → `git`,
`GenerateDocumentationFile`, and the previously-empty packaging metadata stubs filled.

**How it was proven — not inferred:** `dotnet pack` produced **a `.nupkg` *and* a `.snupkg`**, with the
nuspec carrying `type="git"` and an **embedded commit SHA**. Build **0 errors / 0 warnings**; tests
**270 / 270 / 0** (owner-reported).

**It needs a commit message and a commit. That is the owner's decision, and it is the first action of the
next session.** Note also that last night's `ProphetsWay.EFTools.sln` — flagged 🚩 **DISCARD** twice — **is
gone from the working tree.** That carried item is closed.

---

## Where We Are

`ProphetsWay.EFTools` **3.0.0 is functionally complete and green** — 270/270/0, provider-neutral, zero
preprocessor directives, packaging metadata now filled — **and it is deliberately not being tagged**,
because the owner's release bar is SQL Server certification and that is not yet claimable. The shared
release pipeline was rewritten and simplified today, and a **silent defect that had been shipping empty
GitHub releases for three repos** was found and fixed along the way. A four-repo documentation sweep
corrected roughly two dozen false claims.

## Current Focus

🔴 **The Gate 1 SQL Server certification cycle is at its final red micro-lap, and the last step belongs to
the owner.** Stage 3 ran, reached green **twice** — 303/303 after the migration lap, 327/327 after the
cleanup lap, both with **zero orphan databases** — and then took a deliberate red-phase test that exposed a
real ordering defect in `TestStore`'s constructor. **The suite stands at 328 total / 327 passed / 1 failed;
Gate 1 is NOT currently green.** The failure is correct and intended.

**The one remaining action is a hand edit to `ProphetsWay.EFTools.Tests/TestStore.cs`'s
`Store(TestStoreProvider, string)` constructor — register before provisioning, and roll back on failure.**
It cannot be delegated: `Vanguard` cannot write code and no remaining leaf charter permits a
behaviour-changing edit inside a test project on a red baseline. The `Implementer` invoked for it returned
`BLOCKED` having written nothing — **a charter boundary, not a code failure.** The exact edit and the five
validation commands are in the 2026-08-25 section at the top.

**Eleven files are dirty in `ProphetsWay.EFTools` and nothing has been committed all cycle** — HEAD is still
`e2f2120`. `git diff --check` is clean. **Gate 2 (Azure SQL) is also a release gate and has not started.**

---

# What This Session Did — summary, not an inventory

| Area | Outcome |
|---|---|
| **Release pipeline fixed and simplified** | `nuget.exe` 6.4.0 **auto-pushes a co-located `.snupkg`** — **measured**, a `Created` on `/api/v2/symbolpackage/` in the 04:45 `Deploy Alpha` log. The redundant explicit push and its detection step were **deleted**, `NuGetToolInstaller@1` **pinned to 6.4.0**, and the artifact download **hoisted above** the GitHub release steps. Landed as `6110d69`, a substantial revert of the same morning's `63dd56b` |
| 🔴 **A silent defect fixed by that hoist** | `steps/create-github-release.yml` globs the artifact folder for its `assets`, and the download used to run *after* the release steps — so **every Beta and Release GitHub release for `BaseDataAccess`, `EFTools` and `Logger` had been created with no package attached.** Green and silent. Both auditor passes rated this the strongest reason to take the change set |
| **BaseDataAccess 3.2.0 taken into EFTools** | Ten `CS8766` suppression pairs retired across eight files — **zero `#pragma` directives remain in the library** |
| **Providers no longer forced on consumers** | `Microsoft.EntityFrameworkCore.SqlServer` and `.InMemory` removed from the library; `.InMemory` moved to the test project. **Breaking, and deliberately landed before the tag** — after publishing it would have cost a 4.0.0 |
| **Nine `Scope=Contract` failures fixed** | A missing `ApplyIncludes` in the **proving ground**, never a library defect — see the corrected guardrail below |
| **A `StoreCapabilities` mechanism added upstream** | An implementation now **declares what its store can structurally do**; two permanently-failing `Characterization` tests branch instead of failing forever. **270/270/0, full run 32 s → 2 s** |
| **The D12 release-note obligation discharged** | All four 2.2.0 defects named — **three of which fail silently** |
| **A four-repo documentation sweep** | Roughly **two dozen false claims** found and corrected across `EFTools`, `Example`, `BaseDataAccess` and `prophets-pipelines` |

---

# Repository State — measured at sign-off

**All eight repos are 0 ahead / 0 behind their upstreams. One file is dirty in the entire workspace.**

| Repo | Branch | HEAD | State |
|---|---|---|---|
| `ProphetsWay.EFTools` | `main` | ~~`af43048`~~ → **`e2f2120`** *Complete package metadata and enable Source Link* | ✅ **CLEAN as of 2026-08-24**, 0/0. Re-measured this checkpoint |
| `ProphetsWay.Example` | `main` | **`39d0e72`** *Bring the documentation back in line with the tree* | Clean, 0/0 |
| `ProphetsWay.BaseDataAccess` | `main` | **`30bfc71`** *Correct the symbol-publication caveat and refresh the analysis documents* | Clean, 0/0 |
| `prophets-pipelines` | `main` | **`8095b6e`** *Record the deploy-release rewrite and the non-idempotent Beta delete* | Clean, 0/0. **Last night's handoff is now committed here** |
| `ProphetsWay.BPA` | `main` | **`4c0ba1f`** *Initial commit* | Clean — **empty scaffold; `.gitignore` is the only tracked file.** The `.toolbelt-stress-*` fixtures are gone |
| `ProphetsWay.Logger` | `main` | `66bfa3c` | Clean, 0/0 — untouched this session |
| `ProphetsWay.Utilities` | `master` | `bb7bcaa` | Clean, 0/0 — untouched this session |
| `ProphetsWay.Hasher` | `master` | `4b286ae` | Clean, 0/0 — untouched this session |

**Submodule.** `ProphetsWay.EFTools` pins `ProphetsWay.Example` at **`39d0e72`** — **that repo's own HEAD**,
so the two are in step and `git status` reports no pointer drift. `git submodule status` describes it as
**`3.1.1-511.Beta-1-g39d0e72`**: a **`3.1.1-511.Beta` tag now exists** on `ProphetsWay.Example` and the
pointer is **one commit past it**. **Every earlier pointer this file has carried — `61d9e7d`, `967fd26`,
`d845863`, `f93f0a4` — is superseded and must not be restated.**

**Publication status: `ProphetsWay.EFTools` 3.0.0 is set in `app-variables.yml`, still not tagged, and
nuget.org still serves 2.2.0.** As of tonight that is **deliberate**, gated on FR 11 — not an oversight.

---

# Next Session — Start Here

> 🔄 **Revised 2026-08-25 01:42.** Tasks 0 and 0b are done. **Stage 3 ran and is one owner edit from
> green** — it is **task 1** below and it is **not delegable**. Everything that follows it is blocked on it.

| # | Task | Agent | Why it's next |
|---|---|---|---|
| ~~**0**~~ | ~~Commit the Source Link / metadata csproj~~ | — | ✅ **DONE** — `e2f2120`, 2026-08-24 |
| ~~**0b**~~ | ~~Reconcile EFTools FR 11 + `Modernizer` recon~~ | — | ✅ **DONE** — Stage 1, 2026-08-24 |
| **1** | 🔴 **Edit `ProphetsWay.EFTools.Tests/TestStore.cs`'s `Store(TestStoreProvider, string)` constructor by hand** — `RegisterIdentity` **before** provisioning; `try` around the SQLite keeper construction/`Open()` and `CreateSqlServerDatabase`; on failure dispose a non-null `_sqliteKeeper`, `ForgetIdentity(identity)`, rethrow. Then run the five validation commands | **owner — NOT DELEGABLE** | **The suite is red at 327/328 until this lands.** No leaf charter permits it: `Implementer` returned `BLOCKED` with no writes. Targets: `Area=StoreCleanup` **25/25**, full **328/328**, gate **303/303**, orphan count **0**. Do not edit a test to accommodate it — the guard is correct |
| **2** | **`Commit Author`** — commit the whole Gate 1 change set once task 1 is green | `Commit Author` | `Code Reviewer` already cleared it: **0 Must Fix**, *"ship with minor changes, MAY PROCEED"*. **11 dirty files, nothing committed all cycle** — the single largest thing at risk in the workspace |
| **3** | **Add the direct SQL Server / `Microsoft.Data.SqlClient` `PackageReference`** | **`Modernizer`** | 🔴 `Code Reviewer` **Must Fix 2**, open and **accepted-deferred by owner decision** until the cycle is green. **The likeliest item to be lost** — it is a carried Must Fix, not a resolved finding |
| **4** | **Gate 2 — Azure SQL certification.** Decide the Azure infrastructure repository and the 10 other open FR 19 inputs, then plan the leg | **owner**, then `Purpose Refiner` | **A release gate by settled decision, alongside local MSSQL.** Not started; no Azure deployment authorized. `EnableRetryOnFailure` vs. a user-initiated transaction lands on this library's own transaction contract |
| **5** | Post-Gate-1 test debt — startup provider validation (Should Fix 5), the untested cleanup-**failure** branch, `OpenStore`/`ConfigureExisting` argument validation, the 6 *Consider* items | `Test Auditor` → `Test Designer` | All non-blocking, all recorded in the 011452-h19l receipt. Do not let them re-enter Gate 1's scope |
| **6** | **Move FR 16 → `Done`** and **FR 18 → re-scoped** | `Purpose Refiner` | Materially closed since 08-24, still reading open. Cheap; not gating |
| **2** | **Move FR 16 → `Done`** (closed by `e2f2120`, proven by `dotnet pack`) and **FR 18 → resolved** (`TestResults/` is gone and untracked) | `Purpose Refiner` | Stage 1 deliberately took **no** status transitions. Both are materially closed but still read open. Cheap; not gating |
| **3** | **Answer Q5 — does Azure SQL need its own certification leg, and when?** | owner | **Q5 is the durable form of the old P2**, now recorded in `docs/purpose-and-scope.md`. `EnableRetryOnFailure` vs. a user-initiated transaction lands on **this library's own transaction contract** |
| **4** | **Remove the dead `#if` guards from five proving-ground DAOs** — FR 17 | `Refactorer` / `Modernizer` | Owner asked for this on 08-23 and it was never routed. `CompanyDao`, `JobDao`, `ResourceDao`, `TransactionDao`, `UserDao` under a `net10.0`-only project |
| **5** | **Refresh `ProphetsWay.EFTools/AGENTS.md` deviations 5 and 7, its "What has not landed" list, and its submodule pointer — plus ~4 places in `docs/repo-profile.md`** | `Repo Analyst` | **Stale, and confirmed stale by both Stage 1 leaves.** Deviation 5 lists packaging gaps `e2f2120` closed; deviation 7's *"you will conclude Source Link works"* **has inverted — it now does work**; `AGENTS.md` still says the submodule is `f93f0a4` when **`git submodule status` reads `39d0e72` (`3.1.1-1-g39d0e72`)**; and `repo-profile.md` still says FR 11 is not release-blocking. **All of it is outside the Stage 1 leaf charters** — reported by both agents, edited by neither |
| 6 | **Decide auditor finding A2** — `continueOnError: true` on the Beta `GitHubRelease@1 action: 'delete'` | owner | **Medium, still NOT approved.** Fatal and non-idempotent. Recorded durably as `prophets-pipelines/AGENTS.md` gap 8 |
| 7 | **`LocalTestsOnly: 'yes'`** — narrow with a `--filter` rather than removing the flag | `Pipeline Engineer` | **FR 11 item 2, and not authorized.** The ~2-second conformance gate is the obvious candidate |
| 8 | **Tag and publish EFTools 3.0.0** | owner | **Gated on task 2 by the owner's own bar. No tag until green.** nuget.org still serves **2.2.0** |

**Exact invocation for a fresh start:**

```
@Vanguard — Read prophets-pipelines/docs/session-handoff.md first; it is a 2026-08-25 01:42 `live`
checkpoint, so reconcile the five unscoped repo heads against git before trusting them.
GATE 1 IS NOT GREEN RIGHT NOW. It reached green twice — 303/303 and 327/327, zero orphans — and a
deliberate red-phase test was added afterwards. The suite is 328 total / 327 passed / 1 FAILED.
The failure is INTENDED and CORRECT: ShouldRegisterAStoreBeforeProvisioningItAndForgetItIfProvisioningFails
proves TestStore's constructor provisions before it registers. Do NOT weaken, skip or delete it.
THE NEXT STEP IS THE OWNER'S AND CANNOT BE DELEGATED — a hand edit to
ProphetsWay.EFTools.Tests/TestStore.cs, constructor Store(TestStoreProvider, string): call
RegisterIdentity(identity) after the IsDisposableIdentity check and BEFORE both provider branches; wrap
the SQLite keeper construction/Open() and CreateSqlServerDatabase(identity) in a try; on failure dispose
_sqliteKeeper if non-null, ForgetIdentity(identity), rethrow. An Implementer already returned BLOCKED on
this with zero writes — a charter boundary, NOT a code failure. Do not re-invoke it for this.
Then with EFTOOLS_PROVIDER=SqlServer: build 0/0; Area=StoreCleanup 25/25; full 328/328; gate
"Scope=Contract|Guard=Seam" 303/303; sys.databases LIKE 'EFToolsTest[_]%' = 0. Only then Commit Author.
EFTools HEAD is e2f2120 with ELEVEN dirty files and NOTHING committed all cycle; git diff --check is clean.
DO NOT LOSE: the direct SQL Server / SqlClient PackageReference is an OPEN Code Reviewer Must Fix,
Modernizer-owned, deferred by owner decision until this cycle is green.
GATE 2 — Azure SQL — is ALSO a release gate and has NOT started; the Azure infrastructure repository and
10 other FR 19 inputs are undecided. No tag, publish, version bump, YAML change or Azure deployment.
```

---

## Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| ~~**P1**~~ | ~~**Can all 270 tests run against SQL Server alone?**~~ ✅ **ANSWERED 2026-08-25 — yes.** A whole-suite run reached **303/303/0** and then **327/327/0** on `EFTOOLS_PROVIDER=SqlServer` with **zero orphan databases**, every store-touching case outside the exempt 14-case provider-comparison spike reaching the selected provider. ⚠️ **The suite is red *right now* at 327/328** on one deliberately added test — see the top. **Gate 1 closes when that one case passes**, not when this question is re-asked | **The EFTools 3.0.0 tag and publish** — now jointly with **P2** | 08-23, answered 08-25 |
| ~~**P2 → Q5**~~ | ~~**Does Azure SQL need its own certification leg, and when?**~~ ✅ **ANSWERED — yes, it is a release gate.** Settled owner decision: **both local Microsoft SQL Server and Azure SQL certification gate the 3.0.0 tag and publish.** Recorded durably as **D20–D22** / **FR 19** per the `Purpose Refiner` receipts — ⚠️ **those documents were not opened this checkpoint**. 🔵 **What is still undecided is the *work*, not the scope:** the **Azure infrastructure repository** and **10 other FR 19 inputs**. `EnableRetryOnFailure` forbids a user-initiated transaction unless wrapped, which lands on `TransactionStart`/`Commit`/`RollBack` — **still never examined** | **Gate 2.** The 3.0.0 tag, and production readiness for BPA and HashDB | 08-23, recorded 08-24, answered 08-25 |
| **A2** | **Approve `continueOnError: true` on the Beta `GitHubRelease@1 action: 'delete'`?** Auditor finding, Medium, unapproved | A re-runnable Release stage. Today a failure at or after it is unrecoverable | 08-23 |

## Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
| **P3** | **What are `BPA` and `HashDB`, concretely?** BPA is an empty scaffold with no `AGENTS.md`; HashDB is a name and a sentence. Both are now stated consumers of EFTools, so their shape influences what "certified" has to mean | 08-23 |
| **B′** | Amend `63dd56b`'s commit message at all, now that its change is largely reverted by `6110d69`? **The stakes have collapsed** — it describes undone work | 08-23 |
| **C** | **Which EFTools test subset can run headless?** — needed to size the `--filter` for task 7. **Nearly answered:** the `Scope=Contract\|Guard=Seam` gate is 245 cases in ~2 s, and 7 of 8 local classes need no database | 08-23 |
| **a** | **What version does `ProphetsWay.Example` carry at *release*-tag time?** `app-variables.yml` reads 3/1/1 — a **patch** — but `TestDataAccessFactory.Use` is new public API (MINOR by house rule). **Partly overtaken:** a pipeline tag **`3.1.1-511.Beta`** now exists and HEAD is one commit past it | 08-16 |
| **b** | **`ThrowIfDisposed()` is missing from 32 of `ExampleDataAccess`'s 40 forwarders** — a contract requirement with no test | 08-18 |
| **c** | **Source Link for `Logger`, `Hasher` and `Utilities`** — the same small change. **EFTools' own gap closes with the uncommitted csproj**, leaving these three as the last holdouts | 08-16, revived 08-22 |
| **d** | **A31's three version-sensitive EF Core surfaces** — `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys, `MultipleCollectionIncludeWarning`. Nobody had a verifiable source **and nobody guessed** | 08-16 |
| **e** | Should the seven `Guard=Seam` tests also carry a `Scope` trait? A deliberate choice of a different trait key, not an omission | 08-20 |
| **f** | Whether to state hard-delete explicitly on the five silent DAOs | earlier |

---

## In Flight

> 🔄 **Revised 2026-08-25 01:42.** 🔴 **One thing IS mid-flight and it is the whole cycle:** the Gate 1
> change set is complete, reviewed and **red by one intended test**, awaiting a single owner edit. Nothing
> in it is half-written — every lap that touched it validated and reported.

| Item | State | Where |
|---|---|---|
| 🔴 **`TestStore.Store(TestStoreProvider, string)` — register before provisioning + rollback** | **THE ONLY OPEN STEP. Owner's, not delegable.** `Implementer` returned `BLOCKED`, zero writes, zero validation — charter, not failure. Targets: StoreCleanup 25/25, full 328/328, gate 303/303, 0 orphans | `ProphetsWay.EFTools/ProphetsWay.EFTools.Tests/TestStore.cs` — **untracked**, 324 lines |
| ✅ **Provider-selectable test seam + whole-suite SQL Server run** | **DONE and green when measured** — 303/303/0, gate 278/278/0, 0 orphans. Superseded as a *current* figure by the cleanup and red laps | `ProphetsWay.EFTools.Tests/` — 7 modified files |
| ✅ **Cleanup / isolation surface + reporting `Dispose`** | **DONE and green when measured** — 327/327/0, gate 302/302/0, StoreCleanup 24/24, 0 orphans. Per-store `ClearPool` replaced process-global `ClearAllPools` | `ProphetsWay.EFTools.Tests/TestStore.cs`, `ProviderSelectionTests.cs` |
| ✅ **Final correctness review** | **DONE** — 0 Must Fix, 3 Should Fix (2 now closed), 6 Consider. *"Ship with minor changes; MAY PROCEED"* | read-only — no file changed |
| 🔴 **The whole Gate 1 change set is UNCOMMITTED** | **11 dirty files, HEAD unmoved at `e2f2120` all cycle.** Cleared for commit once the edit above is green | `ProphetsWay.EFTools` |
| 🔴 **Direct SQL Server / `SqlClient` `PackageReference`** | **OPEN `Code Reviewer` Must Fix, accepted-deferred by owner decision** until the cycle is green. **Do not lose it** | `ProphetsWay.EFTools.Tests.csproj` — `Modernizer` |
| 🔵 **Gate 2 — Azure SQL certification** | **A release gate by settled decision. NOT STARTED.** Azure infrastructure repository + 10 other FR 19 inputs undecided. No deployment authorized | owner → `Purpose Refiner` |
| Post-Gate-1 test debt — Should Fix 5/7, the untested cleanup-**failure** branch, 6 *Consider*, 4 *Untested Behaviour* | Recorded, non-blocking. Keep out of Gate 1's scope | `Test Auditor` → `Test Designer` |
| SQLite whole-suite leg (`EFTOOLS_PROVIDER=Sqlite`) | Deferred by prior settled decision — **non-gating** | `ProphetsWay.EFTools.Tests/` |
| ~~Source Link / metadata csproj change~~ | ✅ **COMMITTED** as `e2f2120`, 2026-08-24 — proven by `dotnet pack`, not by reading | `ProphetsWay.EFTools/ProphetsWay.EFTools/ProphetsWay.EFTools.csproj` |
| ~~FR 11 reconciliation~~ | ✅ **DONE, uncommitted.** D20–D22 and FR 19 now in the durable record per the `Purpose Refiner` receipts — ⚠️ **not opened this checkpoint** | `ProphetsWay.EFTools/docs/feature-requests.md`, `docs/purpose-and-scope.md` |
| FR 16 → `Done`, FR 18 → re-scoped | Materially closed, still reading open | `ProphetsWay.EFTools/docs/feature-requests.md` |
| FR 17 — dead `#if` guards in five proving-ground DAOs | Owner asked on 08-23; still never routed | `ProphetsWay.EFTools/ProphetsWay.Example.DataAccess.EF/Daos/` |
| EFTools `AGENTS.md` deviations 5 and 7 | 🔴 **Stale** — `e2f2120` inverted deviation 7's Source Link caveat; the file still names the submodule `f93f0a4` where git reads `39d0e72` | `ProphetsWay.EFTools/AGENTS.md` |
| A2 remedy | Proposed, **unapproved**; recorded in `AGENTS.md` gap 8 | `prophets-pipelines/stages/deploy-release.yml` |
| EFTools 3.0.0 tag + publish | **Gated on BOTH Gate 1 and Gate 2. No tag until both are green** | owner / Azure DevOps |

---

## Uncommitted Changes

> 🔄 **Re-measured 2026-08-25 01:42** with `git status --porcelain`, `git diff --stat` and
> `git diff --check`, in the two scoped repos only. **Nothing here is accidental.** Both repos are `main`,
> 0 ahead / 0 behind. 🔴 **`ProphetsWay.EFTools` HEAD has not moved all cycle — the entire Gate 1 body of
> work is uncommitted.**

| Repo | File | Description |
|---|---|---|
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.Tests/`**`TestStore.cs`** | 🆕 **UNTRACKED, 324 lines.** The provider seam and cleanup surface. 🔴 **The one file the owner must edit** — constructor only |
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.Tests/`**`ProviderSelectionTests.cs`** | 🆕 **UNTRACKED, 2 460 lines.** 57 cases: provider certification, the residual seam scanner, `TestStoreCleanup`, and the 25 `Area=StoreCleanup` guards — **1 of which is the intended red** |
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.Tests/Constants.cs` | Modified, ±40. Provider selection via `EFTOOLS_PROVIDER`; the `_sqliteStore` keeper and its non-obvious finalizer comment |
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.Tests/IdentifierResolutionTests.cs` | Modified, ±84. `WithStore` migrated; `UnopenedContext(store)`; **both plain-`using` sites routed through `DisposeReportingFailure`** in the final lap |
| **`ProphetsWay.EFTools`** | `FailedInsertWriteBackTests.cs`, `KeyPredicateOpenKeyTests.cs`, `KeylessDaoTests.cs`, `KeylessSoftDaoTests.cs`, `SoftDeleteTimestampHookTests.cs` | Modified, ±23–26 each. `WithStore` migrated to `TestStore.OpenStore(…)` + `store.Configure(builder)`; interceptor/recorder overloads and `EnsureCreated` preserved; unused `Microsoft.Data.Sqlite` usings removed |
| **`ProphetsWay.EFTools`** | `docs/feature-requests.md` | ✅ **Expected — `Purpose Refiner`.** +499. FR 11 re-scoped and release-blocking; **FR 19** filed. Last touched only to strip one EOF blank line |
| **`ProphetsWay.EFTools`** | `docs/purpose-and-scope.md` | ✅ **Expected — `Purpose Refiner`.** +287. The certification-gate section carrying **D20–D22** |
| **`prophets-pipelines`** | **`docs/session-handoff.md`** | ✅ **This file.** The 01:42 checkpoint. The only dirty file in that repo |
| The other five repos | — | **Not re-measured this checkpoint** — out of scope. Reconcile against git before trusting the carried heads |

**Total: 12 files, 2 repos** — 9 tracked + 2 untracked in EFTools, 1 here. `git diff --stat` in EFTools:
**940 insertions, 90 deletions across the 9 tracked files** — 154/46 code, 786/44 docs.
✅ **`git diff --check` exits 0** — measured this checkpoint, confirming the `Purpose Refiner` whitespace
lap (one extra EOF newline removed from `docs/feature-requests.md`, no semantic change, no status moved).
🔎 **Submodule confirmed unchanged:** `39d0e72` — `3.1.1-1-g39d0e72`.

~~✅ **Two carried items are closed:**~~ still true — `ProphetsWay.EFTools.sln` is no longer dirty and
`ProphetsWay.BPA`'s `.toolbelt-stress-*` fixtures are gone.

**Committing is the owner's decision. Nothing was staged, committed or pushed by this checkpoint.**

---

## Corrections to Carried Claims — check these before trusting an older note

| Claim | Status |
|---|---|
| 🚩 **Guardrail: *"Do not 'fix' the 10 `EFSnapshotDeepCopyTests` failures by overriding `ApplyIncludes` on an EF DAO"*** | **CONTRADICTED BY TONIGHT'S `3ac9615`**, which cleared nine of them by doing exactly that. The reconciliation: identity remains the **library's** default per OD-1 / A18, and what changed is the **proving ground's own DAOs** overriding the seam — a consumer using an extension point as designed, not a change to the library. **Flagged rather than silently rewritten; the owner should confirm the guardrail's new wording** |
| **Guardrail: submodule pinned at `61d9e7d`** | **Superseded.** It is `39d0e72`. The rule itself stands: **never edit under `ProphetsWay.EFTools/ProphetsWay.Example/`** |
| **Guardrail: don't "fix" `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`** | **Superseded.** Renamed to `…OnlyWhereTheStoreDoesNotIsolateThem` and now **passes** by branching on `StoreCapabilities`. The rule survives in a stronger form: **`StoreCapabilities` flags are positive capabilities on two independent axes, not a store-kind label** — adding `DenormalizedNavigationWrites` to a relational DAL to "fix" a failure asserts an in-memory outcome against a relational store |
| **FR 18 — *"the committed `.trx` files read authoritative and are stale"*** | **PREMISE DISPROVEN.** They are **not tracked**: `.gitignore` line 43 `[Tt]est[Rr]esult*/` already excludes them, confirmed tonight by `git status -uall` reporting them nowhere. Seven stale files sit **on disk only**. The entry should be **re-scoped** — *never cite a local `.trx` as current* — rather than closed |
| **EFTools FR 11 "fact 2"** | **DEAD.** The package depends on no provider at all as of `77cfe5c` |
| **EFTools `AGENTS.md` deviations 5 and 7** | **Stale on commit of the pending csproj.** Deviation 7's *"read the two rows together or you will conclude Source Link works"* is the specific sentence that inverts |
| **`ProphetsWay.EFTools.sln` — 🚩 DISCARD** | ✅ **Closed.** Gone from the working tree; measured with `git status -uall` |
| **`ProphetsWay.BPA` `.toolbelt-stress-*` untracked fixtures** | ✅ **Closed.** BPA is entirely clean |
| **Open question A** — did 3.2.0 publish and did symbols push? | ✅ **CLOSED overnight.** Both succeeded; symbols returned `Created` |

---

## 🤖 Process Observations — the reason to keep the receipt protocol

- **Three delegated agents ended silently tonight**, each having done substantial work. **All three were
  recovered from their receipt artifacts.** Without the protocol, three change sets would have landed as
  unexplained diffs with no account of intent. **The receipt protocol earned its keep, again.**
- **Two agents reported having no terminal and said so** rather than fabricating verification. That is the
  behaviour to preserve; it costs a round-trip and buys a true record.
- 🔴 **The recurring failure mode all evening was carrying a claim instead of checking it** — including
  **one agent introducing a fresh false claim during the sweep that existed to remove them.** The shared
  block's *"affirming an inherited claim is not verifying it"* rule is doing real work and must not be
  softened.
- **Scope reasoning from written artifacts alone cannot see an unwritten purpose.** Tonight's FR 11
  reversal is the case study — see the lead's error above.

---

## Verification Record — what this wrapup ran and opened

**Ran** (22:00, 2026-08-23): `git log -1 --format='HEAD %h %s'` and `git status -sb` in **all eight**
repositories; `git status -sb -uall` in `ProphetsWay.EFTools` and `ProphetsWay.BPA`;
`git submodule status` in `ProphetsWay.EFTools`; `git ls-files` in `ProphetsWay.BPA`;
`git describe --tags` in `ProphetsWay.Example`; a heading outline and line count of the outgoing handoff.

**Opened:** this handoff in full — the 14:10 checkpoint, and the preserved 08-22 sign-off's open questions,
Deliberately Deferred, Standing Guardrails and Recent Sessions — before rewriting it.

**Not measured — owner-reported and labelled where used:** every build and test figure (0/0 build,
270/270/0 suite, 245/245/0 gate, 32 s → 2 s), the `dotnet pack` nuspec inspection, the `nuget.exe` 6.4.0
log excerpt, `Constants.cs`'s connection string, `.gitignore` line 43, and the text of the FR 11 entry.
**These come from the session record, not from a run in this scribe pass.**

**Not done:** no artifact-ledger scan — that is `resume`'s job, not `wrapup`'s.

---

<!-- ══════════════════ END OF THE 2026-08-23 SIGN-OFF ══════════════════
     Everything below is the 2026-08-22 → 08-23 sign-off, PRESERVED VERBATIM.
     It is ALSO committed as prophets-pipelines 8095b6e — the alarm it carries
     about being the sole copy is discharged. Read it as history only, and
     read the Corrections table above before trusting any claim in it.
     ═══════════════════════════════════════════════════════════════════ -->

# ⬇ PRESERVED — the 2026-08-22 → 08-23 sign-off

> ⚠️ **Historical as of the 2026-08-23 22:05 sign-off above.** It is **also committed** as
> `prophets-pipelines` **`8095b6e`**, so the alarm it carries about being the sole copy of itself is
> **discharged** — read every 🚨 in it as answered.
>
> **Closed since it was written:** blocking question **A** (the 3.2.0 publish fired and symbols pushed);
> question **B** is largely moot; the `ProphetsWay.EFTools.sln` 🚩 **DISCARD** item; the BPA
> `.toolbelt-stress-*` fixtures; the EFTools follow-on and the `CS8766` suppressions; and the F10 filing.
>
> 🔴 **Read the *Corrections to Carried Claims* table above before trusting anything below.** Three of its
> **Standing Guardrails** are now wrong — the `ApplyIncludes` rule, the `61d9e7d` submodule pointer, and
> the `ShouldExposeUncommittedWritesToAnotherInstance` rule.
>
> ✅ **Two sections below are still the LIVE lists, not history:** *Deliberately Deferred* and *Standing
> Guardrails*. They were not duplicated into the new sign-off; they are amended by the Corrections table
> above and otherwise stand as written. **Also still live:** non-blocking questions **a–f**, which the new
> sign-off carries forward by name.

> ✅ **SIGN-OFF — 2026-08-22 → 2026-08-23.** This supersedes the **three `live` checkpoints** written
> during 2026-08-22 (09:41, 22:15 and 23:55). There is now **one** entry for that session, not three.
> Everything those checkpoints held open about laps 3 and 4, the name-collision gate, the F10 blocker
> and the `notes-from-eftools-3.0.0` merge is **closed and landed**. Do not resurrect their wording.
>
> 🔧 **A shell WAS available this time.** Every git fact, file count, version value and consumer-impact
> claim below was **measured**, not reported. Where a figure is the owner's report — test runs, which
> need a local SQL Server — it is labelled as such. See *Verification Record* near the end for exactly
> what was opened and run.
>
> ⚠️ **Two claims in the sign-off brief were wrong and are corrected below**, both in ways that matter:
> the uncommitted `.sln` is **not** benign Visual Studio churn, and the session's highest-value finding
> **was never filed** into the document it contradicts.

---

## Where We Are

**Two releases were prepared this session and both are merged to `main`; neither is published.**
`ProphetsWay.EFTools` **3.0.0** — the four-lap EF Core rewrite — landed via **PR #19** (`b18052a`).
`ProphetsWay.BaseDataAccess` **3.2.0** — nullable annotations plus Source Link — landed via **PR #40**
(`48fa10c`). A symbol-push fix landed in `prophets-pipelines` (`63dd56b`). The agent toolbelt was
repaired mid-session after four silent-subagent failures.

**Every repo is committed and pushed.** The only working-tree change in the workspace is one `.sln`,
and it must be discarded rather than committed.

## Current Focus

**Nothing is mid-edit.** The session ended at a clean boundary in every repo. The next move is a
**check, not a build**: whether the BaseDataAccess 3.2.0 publish fired, and what the `Deploy Alpha`
log says about the symbol push.

---

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Check whether the BaseDataAccess 3.2.0 publish fired**, then read the `Deploy Alpha` log for the symbol-push outcome | owner — portal | Gates item 7 and the FR 8 status. The owner expects it to fire today |
| 2 | **Discard `ProphetsWay.EFTools.sln`** — `git checkout -- ProphetsWay.EFTools.sln` | owner | It is **not** VS churn. See the correction below. Committing it breaks the solution build |
| 3 | **File the F10 non-equivalence finding** into `ProphetsWay.EFTools/docs/api-contract.md` | `Contract Reviewer`, then `Interface Architect` | The document **still asserts the equivalence this session disproved**, in two places. See the correction below |
| 4 | **EFTools follow-on** — reference BaseDataAccess 3.2.0, delete the **10 `CS8766` suppression pairs across 8 library files**, absorb the `CS8767` wave | `Implementer` | This is *why* the owner reversed FR 10's sequencing. It is what lets EFTools 3.0.0 ship clean |
| 5 | **Tag and publish EFTools 3.0.0** | owner | Merged since 2026-08-22; nuget.org still serves **2.2.0** |
| 6 | **Decide what to do about `63dd56b`'s commit message** | owner | Amend + force-push `main`, or leave it and rely on this file. Owner's call — see below |
| 7 | `Purpose Refiner` on **FR 8**, once item 1's outcome is known | `Purpose Refiner` | Its index row still reads *"the pipeline push step is still owed"* — that step **now exists**. Only `Purpose Refiner` may move the status |

**Exact invocation for a fresh start:**

```
@Vanguard — EFTools 3.0.0 and BaseDataAccess 3.2.0 are both merged to main and neither is published.
Read prophets-pipelines/docs/session-handoff.md first. Start by confirming the 3.2.0 publish fired,
then run the EFTools follow-on that deletes the 10 CS8766 suppression pairs.
```

---

## 🔴 Defect — `prophets-pipelines` commit `63dd56b` has the wrong message

**Measured, not inherited.** `git log -1 --format='%s'` returns a **207-character** sentence (the brief
estimated 175); `%b` returns **zero characters**. The subject is:

> *"Body covers the minimatch reason, why the one-glob edit was rejected, the ordering fix from the
> audit, and — per AGENTS.md's requirement — every consuming repo enumerated with what each will
> actually do."*

That is the lead's **description of** the message, pasted in place of the message.

**The change itself is correct and was independently audited.** `git show --stat` confirms exactly
`stages/deploy-release.yml | 27 +++`, one file, +27/−0 — precisely what was intended. **Only the record
is lost**, and it is lost in the one repo whose `AGENTS.md` explicitly requires a template change to
enumerate its affected consumers.

**Options, owner's call:**

- **Leave it** and rely on this handoff as the record. Zero risk.
- **Amend and force-push `main`.** Rewrites shared history. Deliberately not done at midnight.

### The intended message, reconstructed and verified — use this verbatim if amending

Every factual claim in the block below was re-verified against the files on 2026-08-23.

```text
Push the symbol package alongside the NuGet package in the release stage

The release stage pushed '*.nupkg' only. That glob does not match '*.snupkg' —
minimatch requires a literal '.' before 'nupkg', so a symbol package produced by
a project setting IncludeSymbols was built, uploaded as a build artifact, and
then silently never pushed to the feed.

Adds a detection step plus a symbols-only push, both non-fatal.

Why not the one-glob edit ('*.*nupkg' or a brace pattern):

The push is NuGetCommand@2, which runs nuget.exe rather than 'dotnet nuget push',
and there is no NuGetToolInstaller@1 in this pipeline, so the agent's bundled
nuget.exe version is whatever the pool supplies. Adjacent-symbol behaviour is
version-dependent: some nuget.exe versions push a co-located .snupkg
automatically. If that happens and an explicit second push follows, the feed
returns 409 Conflict and the release fails. If the feed has no symbol endpoint
at all, the push errors and the release fails. The governing constraint is that
this cannot fail a release, so the symbol push is conditioned on detection and
carries continueOnError.

Ordering, from the Pipeline Auditor pass:

The detect step is placed BEFORE the package push, not after it. The auditor
returned "safe to merge with one hardening" and this is it. Previously the
detect step ran after the publish and unprotected — a script throw would have
published the package, failed the stage, and made the re-run fail on a duplicate
version conflict. Detection must never fail a release it cannot un-publish.

Consuming repos — zero edits required in any of them:

  ProphetsWay.BaseDataAccess  PostTargetToNuGet 'yes', and the ONLY repo with
                              <IncludeSymbols>true</IncludeSymbols>. This is the
                              repo the change exists for. Detect finds 1, pushes.
  ProphetsWay.EFTools         PostTargetToNuGet 'yes', no IncludeSymbols. Detect
                              logs 0, push step is skipped by its condition.
  ProphetsWay.Logger          PostTargetToNuGet 'yes', no IncludeSymbols. Same.
  ProphetsWay.Example         PostTargetToNuGet is commented out, so the whole
                              block is removed at template-compile time.
  ProphetsWay.Hasher          Standalone legacy pipeline; does not consume these
                              templates at all.
  ProphetsWay.Utilities       Has no pipeline of any kind.

Unresolvable from any file: whether the feed exposes a symbol-publish endpoint.
Only a real release settles it. Built so that "no" costs a warning rather than a
failure. Read the Deploy Alpha log on the next release.
```

---

## 🔴 CORRECTION — the uncommitted `ProphetsWay.EFTools.sln` is NOT Visual Studio churn

**The brief said "almost certainly Visual Studio on open." It is not, and committing it would break the
solution build.** `git diff --numstat` reports **+84 / −0**, and the added lines include two project
entries pointing **outside the repository**:

| Added project | Path recorded in the `.sln` | Exists on disk? |
|---|---|---|
| `consumer` | `..\..\..\Users\Proph\AppData\Local\Temp\bda-consumer-probe\consumer.csproj` | ❌ **No** — verified with `Test-Path` |
| `Probe` | `..\..\..\Users\Proph\AppData\Local\Temp\fr10-probe-annotated\Probe.csproj` | ❌ **No** — verified with `Test-Path` |

Both are **BaseDataAccess FR 10 verification probes** — the scratch projects built this session to prove
the `CS8767` / `CS8766` behaviour against a nullable-enabled consumer. They were added to the EFTools
solution, their temp directories have since been cleaned up, and the `.sln` now references two dangling
paths. The remaining added lines are the x64/x86 platform configurations Visual Studio wrote to
accommodate them.

> 🔁 **This is a recurrence, not a novelty.** The 2026-08-20 session logged the identical incident — a
> scratch `OrderProbe` project added to the tracked `.sln` and then deleted, breaking the solution build.
> `git checkout --` was the right fix then and is the right fix now.

**Blast radius if committed:** `dotnet build ProphetsWay.EFTools.sln` fails for everyone, the owner
included. **CI would not catch it** — `steps/restore-build-test.yml` builds `**/*.csproj`, never the
`.sln`.

**Action: `git checkout -- ProphetsWay.EFTools.sln` in `ProphetsWay.EFTools`.** Do not commit it, and do
not hand-edit it back into shape.

---

## 🔴 CORRECTION — the session's highest-value finding was NOT filed

The brief records the finding correctly but presents it as settled work. **It is not written down
anywhere durable, and the document it contradicts still asserts the opposite.**

**The finding:** F10 offers two remedies for a failed `Insert` and calls them equivalent. **They are not.**
"Stamp the item, restore in a `finally`" is sound only where nothing happens after `SaveChanges` returns.
`SaveChanges` can **succeed** and a later step throw — at which point the `finally` restores the caller's
timestamps while the row *is* stored, leaving the caller holding a real database identifier beside a
rolled-back `CreatedDate`. Neither stored nor not-stored. **A `finally` cannot un-store a row.** This
proved the specification wrong on its own terms, which is a stronger class of finding than a code defect.

**`ProphetsWay.EFTools/docs/api-contract.md` still says the opposite, in two places — both opened and read
on 2026-08-23:**

| Line | What it still says |
|---|---|
| **~2049** | *"**Both remedies are sanctioned by F10 and neither branch is required to adopt the other's.** The asymmetry is in the mechanism, not in the contract"* |
| **~5206** | *"**The second remedy is legitimate here, unlike in A35.** … Here the throw comes from `SaveChanges`, which is strictly after the assignment, so the `finally` has something to restore. **Both remedies deliver the obligation; neither is mandated.**"* |

The second passage is the exact reasoning the finding refutes — it treats a throw out of `SaveChanges` as
the only failure shape, while F10's own obligation paragraph already binds *"an exception out of anything
the member does after reading `item`."* **The document contradicts itself and does not know it.**

**Action:** item 3 in *Next Session*. `Contract Reviewer` confirms the contradiction, `Interface Architect`
makes the edit. **The keyless branch's choice of remedy one is correct and must not be changed** — what is
wrong is the sentence licensing remedy two as equivalent.

### The second defect, which made the first reachable

**`EntityGraph.RemoveFromInverseNavigations` raised `TargetException`** — it read a *collection* navigation
as if it were a single principal. Fixed this session. This is what turned the post-`SaveChanges` window
from theoretical into reachable, and **neither defect was caught by an existing test.**

---

## EFTools 3.0.0 — merged, not published

**Merged to `main` via PR #19 as `b18052a`** — a squash merge of **83 files, +21,184 / −1,077**. Verified
with `git show --stat`.

| Fact | Measured value |
|---|---|
| Library source files | **15**, one flat folder, **zero subfolders** — down from 39 |
| Preprocessor directives in the library | **zero** |
| Target frameworks | `net10.0` only, all three projects (ratified exception **D7**) |
| `app-variables.yml` | **3 / 0 / 0** |
| Published on nuget.org | **2.2.0** — 3.0.0 is **not tagged and not published** |

**Laps 3 and 4 both happened this session.** Lap 3 added the keyless families (`RootNonIdDao`,
`BaseNonIdDao`, `RootSoftNonIdDao`, `BaseSoftNonIdDao`), a real `CompanyResourceDao`, and extracted
`EntityGraph` out of `BaseDao`'s privates. Lap 4 was a **pure deletion — 24 files, 773 lines, and no
modification to any surviving file**, which is why it moved no test count.

**Final numbers — owner-run on 2026-08-22, not re-measured here** (the full suite needs a local SQL Server):

| Measurement | Result |
|---|---|
| `dotnet build ProphetsWay.EFTools.sln` | **0 errors / 0 warnings** |
| Lap gate `--filter "Area=Keyless\|Area=Insert"` | **68 / 68** — SQLite only, reproducible anywhere |
| Full `ProphetsWay.EFTools.Tests` | **270 total / 259 passed / 11 failed** |
| `ProphetsWay.Example.Tests` | **164 / 164** on both `net10.0` and `net48` |

**The 11 failures are pre-existing and named:** 10 × `EFSnapshotDeepCopyTests` (that upstream class in its
entirety — `ApplyIncludes` defaults to identity per **OD-1 / A18** and no EF DAO overrides it) plus
`EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`, a SQL Server timeout.
**Neither is a regression; do not "fix" either to reduce a red count.**

---

## BaseDataAccess 3.2.0 — merged, awaiting publish

**Merged to `main` via PR #40 as `48fa10c`** — 12 files, +954 / −88. **The owner is waiting on the NuGet
publish to fire and expects it today. That is the first thing to check.**

### FR 10 — nullable annotations · status **Done**

Verified by opening `ProphetsWay.BaseDataAccess.csproj`:

```xml
<TargetFrameworks>netstandard2.0;net10.0</TargetFrameworks>
<LangVersion>9.0</LangVersion>          <!-- pinned, NOT `latest` -->
<Nullable>annotations</Nullable>        <!-- annotations, NOT `enable` -->
```

Annotated: `T? Get(T item)`, `IList<T> GetAll(T? item)`, `IList<T> GetPaged(T? item, int, int)`,
`int GetCount(T? item)`, `TEntityType? Get<TEntityType>(object? id)`, `T? Id`, and the `string?` /
`Exception?` surface. **Metadata-only — not binary-breaking**, but source-affecting for nullable-enabled
consumers.

**Four owner rulings that must survive:**

| # | Ruling |
|---|---|
| **(b)** | Truthful `T? item` on the type selectors, **knowingly accepting the `CS8767` wave** it creates in implementations |
| **(c)** | `IList<T>` and `GetCount` stay **non-nullable** |
| **(d)** | `object? id` and `T? Id` |
| **Reading A** | `Insert` / `Update` / `Delete` take non-null — *"null doesn't make any sense as input"* |

Plus: accept the **unpoliced non-null return**; add **no guard** in a metadata-only release.

> 📌 **`<Nullable>annotations</Nullable>` removes "neutral" as an option — a plain `T` becomes an
> assertion.** That finding corrected a claim the lead had already made to the owner. It is the reason
> ruling (b) had to be taken explicitly rather than defaulted into.

### FR 8 — Source Link · status **Scheduled**, not Done

**Its decline rested on not wanting a dependency, and that ground turned out to be empirically dead:**
`Microsoft.SourceLink.GitHub` ships **inside SDK 10.0.400**, so **no `PackageReference` was added.**
Verified from extracted artifacts — the `.nuspec` carries a resolved commit SHA and both PDBs carry the
document map.

**Recorded `Scheduled` rather than `Done` because the push step was outstanding at the time.** That step
now exists (`63dd56b`), so **the FR 8 index row is stale** — it still reads *"the pipeline push step is
still owed."* Only `Purpose Refiner` may move it, and it should not move until item 1 proves the symbols
actually reach the feed.

**Numbers — owner-run:** build 0/0 in Release on both TFMs; `dotnet pack` 0 warnings producing both a
`.nupkg` and a `.snupkg`; **116 tests on each of `net10.0` and `net48`**, 232 executions.

### FR 11 — `<Nullable>enable</Nullable>` · status **Proposed**, new

The second pass FR 10 deliberately scoped out. **Measured, which is the useful part: 17 warnings, all
internal, none on the public surface.**

---

## prophets-pipelines — the symbol push

`stages/deploy-release.yml`, **+27 / −0**. Content verified by reading the file at HEAD: the detect step
sits **ahead of** the package push and carries `continueOnError: true`; the symbols push is conditioned on
`HasSymbolPackage` and also `continueOnError`.

The full reasoning is in the reconstructed commit message above. **It is not repeated here** — if that
block is lost, this section is not a substitute.

**The one thing no file can settle: whether the feed exposes a symbol-publish endpoint.** Built so that
"no" costs a warning rather than a failure. **Read the `Deploy Alpha` log on the next release.** Three
possible outcomes:

1. **Symbols published** → FR 8 moves to `Done`.
2. **Warning but green** → the feed has no symbol endpoint; FR 8 stays `Scheduled`; decide whether to keep
   producing a `.snupkg` at all.
3. **Anything else** → unexpected; treat as a finding.

---

## Toolbelt — repaired mid-session, in two passes

`Interface Architect` went silent **twice**; `Repo Analyst` and `Implementer` **once each**. The owner ran
`Toolbelt Keeper`.

**The brief described this as one pass over six agents. `git show --stat` shows it was two, and the second
generalized it:**

| Commit | Time | Scope |
|---|---|---|
| `dfe98d7` | 14:11 | **Six agents** + `agent-toolbelt.md` — `purpose-refiner`, `repo-analyst`, `solution-architect`, `vanguard`, `api-designer`, `interface-architect`. **No receipts yet** — `git grep -l 'Receipt artifact'` at that commit returns **0 files** |
| `78ebdb0` | 20:06 | **27 files** — extended one-shot delegated modes to **all 26 agents** and introduced the **receipt artifact** protocol under `%TEMP%`. Measured: **26 of 28** toolbelt files carry both `Receipt artifact` and the `NO CHANGE` status vocabulary; the two that do not are the two `.prompt.md` files, correctly |

✅ **The live toolbelt and the versioned one are byte-identical.** `Get-FileHash` across
`prophets-pipelines/conventions/toolbelt/` (28 files) against `%APPDATA%\Code\User\prompts` (28 files):
**zero differences, zero missing, zero extra.** The prompts folder is **not** a git repo, so this mirror is
the only thing keeping the active agents and the source of truth aligned — re-check it whenever either
side is edited.

### The receipt protocol earned its keep immediately

`Repo Analyst` went silent after writing **754 lines across two files**. The diff looked like success. Its
receipt still read `State: STARTED` — **which is how the run was correctly identified as incomplete.** It
was: `docs/repo-profile.md` had been refreshed only through line 423 and contradicted itself below that.

> 🧭 **The original diagnosis was wrong and is recorded as such.** The "interactive charter,
> non-interactive invocation" theory was weakened when `Implementer` — which is not conversational — went
> silent too. **Output-budget exhaustion on heavy multi-file edit runs fits better.** Follow-up guidance
> was given to `Toolbelt Keeper` covering that, plus the still-uncovered executor agents, plus the note
> that **a *small* delegation cannot reproduce the failure**, so a stress fixture has to be genuinely
> heavy to be diagnostic.

---

## Open Questions — Blocking

| # | Question | Blocks | Raised |
|---|---|---|---|
| **A** | **Did the BaseDataAccess 3.2.0 publish fire, and did the symbol push succeed?** | FR 8's status; whether to keep producing a `.snupkg`; the shape of the EFTools 3.0.0 release | 08-23 |
| **B** | **Amend `63dd56b` and force-push `main`, or leave it?** A force-push rewrites shared history in the conventions repo | Nothing technically — but the record is the thing `AGENTS.md` requires | 08-23 |

## Open Questions — Non-Blocking

| # | Question | Raised |
|---|---|---|
| a | **What version does `ProphetsWay.Example` carry at tag time?** `app-variables.yml` reads 3/1/1 — a **patch** — but `TestDataAccessFactory.Use` is new public API (MINOR by house rule) and the IDENTIFIER and ROW COUNT rules were restated on five further DAO interfaces. **An implementation conforming to the 3.1.0 text can be non-conforming to this one without changing a line.** Settle before Example is tagged | 08-16 |
| b | **`ThrowIfDisposed()` is missing from 32 of `ExampleDataAccess`'s 40 forwarders** — a contract requirement with no test | 08-18 |
| c | **Source Link for `Logger`, `Hasher` and `Utilities`** — the same three-line change, now that the dependency objection is empirically dead. EFTools records its own gap as **deviation 5** | 08-16, revived 08-22 |
| d | **A31's three version-sensitive EF Core surfaces** — `IgnoreQueryFilters()` granularity, `SetValues` against shadow foreign keys, `MultipleCollectionIncludeWarning`. Nobody had a verifiable source **and nobody guessed** | 08-16 |
| e | **Should the seven `Guard=Seam` tests also carry a `Scope` trait?** A deliberate choice of a different trait key, not an omission. Cheap either way | 08-20 |
| f | Whether to state hard-delete explicitly on the five silent DAOs | earlier |
| g | ~~Should BaseDataAccess's `notes-from-eftools-3.0.0` branch be merged to `main`?~~ | ✅ **CLOSED — merged as `48fa10c`** |

---

## In Flight

**Nothing is mid-edit.** Every item below is *specified and unstarted*, not *half-written*.

| Item | State | Where |
|---|---|---|
| EFTools follow-on — drop the 10 `CS8766` pairs | Specified, unstarted. **Measured: 20 pragma lines = 10 pairs across 8 files** — `BaseDao`, `BaseGetAllDao`, `BasePagedDao`, `BaseSoftDao`, `BaseSoftGetAllDao`, `BaseSoftPagedDao` (3 lines each) plus `BaseNonIdDao`, `BaseSoftNonIdDao` (5 each) | `ProphetsWay.EFTools/ProphetsWay.EFTools/` |
| F10 non-equivalence, filed into the contract | Found, **not filed** | `ProphetsWay.EFTools/docs/api-contract.md` ~2049 and ~5206 |
| EFTools 3.0.0 tag + publish | Merged, unpublished | owner / Azure DevOps |
| BaseDataAccess 3.2.0 publish | Merged, awaiting the pipeline | owner / Azure DevOps |
| FR 8 status move | Waiting on question A | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` |

---

## Uncommitted Changes

| Repo | Files | Description |
|---|---|---|
| **`ProphetsWay.EFTools`** | `ProphetsWay.EFTools.sln` (+84/−0) | 🚩 **DISCARD, do not commit.** Two scratch FR 10 probe projects under `%TEMP%`, both now dangling, plus their x64/x86 configurations. See the correction above |
| **`ProphetsWay.BPA`** | `.toolbelt-stress-implementer/`, `.toolbelt-stress-implementer-receipt/`, `.toolbelt-stress-interface/`, `.toolbelt-stress-interface-receipt/` — all untracked | The toolbelt stress fixtures. **The owner's to remove once the diagnosis is finished** — they are the only reproduction attempt for the silent-subagent failure |
| Everything else | — | **Clean.** All seven other repos are 0 ahead / 0 behind their upstreams |

✅ **The three untracked `AGENTS.md` files that had sat in `Logger`, `Utilities` and `Hasher` for two
sessions are committed** — `66bfa3c`, `bb7bcaa`, `4b286ae`. That carried-forward item is closed.

**Committing is the owner's decision. Nothing was staged, committed or pushed by this wrapup.**

---

## Decisions Made This Session — and where each was filed

| Decision | Filed in |
|---|---|
| FR 10 ruling **(b)** — truthful `T? item`, accepting the `CS8767` wave | `ProphetsWay.BaseDataAccess/docs/feature-requests.md` § 10 *"The four contract judgements"* |
| FR 10 ruling **(c)** — non-nullable `IList<T>` and `GetCount` | same |
| FR 10 ruling **(d)** — `object? id` / `T? Id` | same |
| FR 10 **Reading A** — `Insert`/`Update`/`Delete` take non-null | same |
| Accept the unpoliced non-null return; no guard in a metadata-only release | same |
| FR 8's decline **reversed** — the dependency objection was empirically false | `…/feature-requests.md` § 8 *"The owner's reversal"* |
| FR 10 **sequencing reversed** — annotate BaseDataAccess *before* EFTools ships | `…/feature-requests.md` § 10 index row |
| v3.2.0 scoped as **metadata and packaging only**, hence MINOR | `…/feature-requests.md` § *Release Eligibility — v3.2.0* |
| The `.snupkg` push must **never fail a release**; the one-glob edit rejected | `prophets-pipelines/stages/deploy-release.yml` inline comments — **and the full reasoning only here**, because of the commit-message defect |
| Detect-before-push ordering, per `Pipeline Auditor` | same |
| Delegated one-shot modes + receipt artifacts across 26 agents | `prophets-pipelines/conventions/toolbelt/*.agent.md` |
| **F10's two remedies are not equivalent** | ❌ **NOWHERE — this is the filing gap. See item 3** |

---

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| **`steps/create-github-release.yml` attaches only `*.nupkg`** | Same minimatch bug, different destination — symbols will not reach GitHub releases. **Verified at HEAD.** The same file also hardcodes `gitHubConnection: 'ProphetsWay@GitHub'` while declaring and discarding its own `GitHubConnectionName` parameter (`AGENTS.md` known gap 5) | With the next `prophets-pipelines` pass — fix both in one commit |
| **FR 11** — the `<Nullable>enable</Nullable>` second pass | 17 warnings, all internal, none public. Measured, not estimated | After 3.2.0 publishes |
| **EFTools A26 / OD-7** — detach-on-failure coverage | Deferred at lap 4 | Any lap touching `Insert`'s failure path |
| **EFTools A24 / OD-4 / A37** — navigation handling coverage | 🚩 **Blocked, not merely deferred: no keyless fixture entity declares a navigation property**, so there is nothing to test against. The new `Binder`/`Slip` fixture may unblock it | When a fixture entity gains a navigation |
| **EFTools A28** — query-filter coverage | Deferred at lap 4 | Next EFTools test pass |
| **A39 is specified but unimplemented** — the keyless half has no throw site wrapping its compiled predicate | Found late; not a correctness break today | Next EFTools implementation lap |
| **The EFTools obligation recount** — 152 counted vs 151 published | F3's re-cut moved both sides and **is ruled out as the cause**, so the discrepancy is still unexplained. Recount from zero rather than adjust | Next `Contract Reviewer` pass |
| **Two stale `<remarks>` in `FailedInsertWriteBackTests.cs`** describing pre-fix source in the present tense | Cosmetic; the tests themselves are correct | Next test-file touch |
| **A vestigial `global::System.Guid`** in `AlternateKeyGuardSpikeTests.cs` **line 125** | Verified present. It was necessary when `ProphetsWay.EFTools.Guid` shadowed `System.Guid`; **lap 4 deleted that namespace**, so the qualification is now noise | Next test-file touch |
| **`purpose-and-scope.md` is not updated for FR 9, 10 or 11** | Only `Purpose Refiner` writes that file, and this session was scoped elsewhere. **Do not read the absence of a row there as a scope ruling** | Next `Purpose Refiner` pass |
| **`ProphetsWay.BPA`** | A deliberate empty scaffold. Not neglect | When the owner starts it |
| **The `public new` fix on `TransactionDao` / `ResourceDao`** | Invisible today only because `ExampleDataAccess` holds them as interfaces. Against the now-`virtual` bases, `new` is the wrong keyword | Next `ProphetsWay.Example` pass — **upstream, never from the EFTools side** |
| **`CompanyDao.GetCustomCompanyFunction` bypasses the read hooks** | Pre-existing; reads `Dataset` directly, skipping `ApplyReadFilter` / `ApplyStableOrder` | same |
| **M5–M11 test obligations** | A conscious scope decision from lap 1, still unwritten. **M10's trap:** its assertion must never say *which lookup* failed — A8 step 4 permits two resolver strategies and `HiddenKeyed` fails at a different step under each | Any lap touching identifier resolution |
| **EFTools deviation 3 — remove the SqlServer and InMemory package references** | The **code** half is done (zero `UseSqlServer` / `UseInMemoryDatabase` in the library); the **packaging** half is breaking | The provider-neutrality lap |

---

## Standing Guardrails

- 🚩 **Never add a scratch project to a tracked `.sln`.** Twice now — `OrderProbe` on 08-20, `consumer` and
  `Probe` on 08-22. Build probes in a temp directory with their own `.sln`, or `dotnet build` the `.csproj`
  directly. `git checkout --` is the fix, not hand-editing.
- **A green build is not evidence a subagent reported, and a diff is not evidence a run completed.**
  Check the receipt.
- **Never delete `TestSeam.cs` to reduce a red count.** A green EFTools suite is meaningful *only* while it
  is on disk; deleting it makes the run look dramatically better and proves nothing.
- **Do not "fix" `EFDataAccessTransactionTests.ShouldExposeUncommittedWritesToAnotherInstance`.**
  `Scope=Characterization`, failing correctly.
- **Do not "fix" the 10 `EFSnapshotDeepCopyTests` failures by overriding `ApplyIncludes` on an EF DAO.**
  Identity is the specified default per **OD-1 / A18**.
- **Never edit anything under `ProphetsWay.EFTools/ProphetsWay.Example/`** — it is a pinned submodule at
  `61d9e7d`. Edit upstream in `ProphetsWay.Example` and advance the pointer.
- **Never bump a version in any `app-variables.yml`.** Owner's decision, in every repo.
- **`ConventionShowcaseTests` and `ExceptionPassthroughShowcaseTests` stay excluded** — `Scope=Dispatcher`;
  they belong to `ProphetsWay.BaseDataAccess` and their DALs are deliberately mis-wired.
- **Every test carries exactly one `Scope`, and the trait sum is the check.** A mismatch means a test is
  untraited or double-traited, which is the defect the partition exists to prevent.
- **A `Scope=Contract` assertion must trace to a stated rule.** There is no enforcement mechanism; it holds
  only because whoever writes one asks the question.
- **Editing the toolbelt means editing `prophets-pipelines/conventions/toolbelt/`, then re-syncing
  `%APPDATA%\Code\User\prompts`.** The prompts folder is unversioned. The two were byte-identical at
  sign-off.

---

## Process Notes Worth Carrying

**Agents corrected the lead repeatedly this session, and that is the system working — not friction to
engineer out.** Every one of these was a case where the specialist was right and the coordinator wrong:

| Agent | What it caught |
|---|---|
| `Changelog Author` | A break was **compile-time, not runtime** |
| `Test Designer` | An arrangement the lead passed it **could not fail** |
| `Repo Analyst` | Its **own draft's** SQLite / SQL Server error |
| `README Author` | Declined a *"299 → 97"* proof **it could not verify** |
| `Contract Reviewer` | The README contradiction at a **fifth prose site nobody had counted** |
| `Commit Author` | Corrected file counts **twice**, and found **two extra `CS8767` cases** |
| `Implementer` | Proved a documented fix **described the wrong diagnostic sequence** |

Two rules fall out of the session and are worth keeping:

- **A green build is not evidence a subagent reported, and a diff is not evidence a run completed.**
- **`<Nullable>annotations</Nullable>` removes "neutral" as an option** — a plain `T` becomes an assertion.

---

## Verification Record — what this wrapup actually opened and ran

**Ran:** `git rev-parse --abbrev-ref HEAD`, `git log -1 --format`, `git rev-list --left-right --count
@{u}...HEAD` and `git status --porcelain -uall` across **all eight repos**; `git show --stat` on `48fa10c`,
`b18052a`, `63dd56b`, `78ebdb0`, `dfe98d7`; `git log --since=2026-08-22`; `git diff --numstat` and
`git diff -U0` on `ProphetsWay.EFTools.sln`; `git grep -l 'Receipt artifact' dfe98d7`; `Get-FileHash`
across the 28 toolbelt files against the 28 prompts files; `Test-Path` on both probe `.csproj` paths;
`Select-String` counts for `CS8766` pragmas, `Major`/`Minor`/`Patch`, `LangVersion`, `Nullable`,
`PostTargetToNuGet` and `IncludeSymbols`.

**Opened:** `stages/deploy-release.yml`, `steps/create-github-release.yml`,
`ProphetsWay.BaseDataAccess/docs/feature-requests.md` (index and both eligibility tables),
`ProphetsWay.BaseDataAccess/CHANGELOG.md` (head), `ProphetsWay.EFTools/docs/api-contract.md`
(lines 2035–2060 and 5157–5240), and the outgoing handoff.

**Not re-measured — owner-reported, and labelled as such wherever used:** every test-run figure. The full
EFTools suite requires a local SQL Server carrying `ProphetsWay.Example`; the lap gate
(`Area=Keyless|Area=Insert`, 68/68) does not, and is the reproducible one.

---

## Recent Sessions

> ✅ **This index is LIVE, not preserved history** — it simply sits at the foot of the file. Its newest
> entry is **tonight's, 2026-08-23**, written by the sign-off at the top.

### 2026-08-23 — *the purpose reveal, and a release gate that was not visible in any document*

**The session's most valuable output was a sentence, not a commit.** The owner stated for the first time
what these libraries are *for* — **`BPA`, and a previously-unmentioned web tool `HashDB`, on local MSSQL
for dev and Azure SQL for production** — and with it a release bar: *"if we can't say EFTools is cleared to
work in SQL Server, then it's not worth pushing out."* That **reversed a scope ruling made hours earlier**:
the lead and `Purpose Refiner` had both correctly reasoned from the written artifacts that FR 11 was not
release-blocking, and both were **wrong about the purpose**, which was nowhere written down. **EFTools
3.0.0 is now deliberately untagged** pending certification, and **Azure SQL is a second, never-examined
leg.**

Technically: the release pipeline was **simplified by measurement** — `nuget.exe` 6.4.0 auto-pushes a
co-located `.snupkg`, so a push step written that morning was **substantially reverted the same day**
(`63dd56b` → `6110d69`), the tool pinned to 6.4.0, and an artifact download hoisted — **which fixed a
silent defect that had been creating empty GitHub releases for three repos.** BaseDataAccess **3.2.0** was
taken into EFTools, retiring **ten `CS8766` suppressions**; **EF providers were removed from the package**
(breaking, deliberately pre-tag); a missing `ApplyIncludes` in the proving ground cleared **nine `Contract`
failures**; and a new **`StoreCapabilities`** mechanism let two permanently-failing `Characterization`
tests branch — **270/270/0, full run 32 s → 2 s.** A four-repo sweep corrected roughly two dozen false
claims. **Ended with exactly one dirty file** across eight repos: the verified Source Link csproj.

**Process:** three delegated agents ended silently and **all three were recovered from their receipts**;
two agents correctly reported having no terminal rather than fabricating verification; and the evening's
recurring failure was **carrying a claim instead of checking it** — once by an agent *inside the sweep that
existed to remove such claims.*

### 2026-08-22 → 08-23 — *two releases prepared, one toolbelt repaired*

**The longest session so far, and the only one to close two release lines at once.** EFTools 3.0.0 merged
via **PR #19** (83 files, +21,184/−1,077) after laps 3 and 4 — the keyless families, `CompanyResourceDao`,
`EntityGraph` extracted, then a **pure 24-file / 773-line deletion** that changed no surviving file and
moved no test count. The library went **39 source files → 15**, EF6 gone, `net10.0` only, **zero
preprocessor directives.** BaseDataAccess 3.2.0 merged via **PR #40**, carrying FR 10 (nullable
annotations, `LangVersion 9.0`, `Nullable annotations`, four owner rulings) and FR 8's csproj half — whose
decline was **reversed on an empirical finding: `Microsoft.SourceLink.GitHub` ships inside SDK 10.0.400**,
so no dependency was added after all.

**Two real defects were found and fixed, neither by an existing test** — F10's post-`SaveChanges` window,
and `EntityGraph.RemoveFromInverseNavigations` raising `TargetException` by reading a collection navigation
as a single principal. **The first proved the specification wrong on its own terms**, and that finding is
the session's highest-value output — **and it was never filed**; `api-contract.md` still asserts the
equivalence it disproved, at ~2049 and ~5206.

`prophets-pipelines` gained a symbol push (`stages/deploy-release.yml`, +27/−0) after `Pipeline Auditor`
returned *safe to merge with one hardening* — detect **before** the irreversible push, `continueOnError` on
both. **Its commit `63dd56b` carries a 207-character description-of-a-message as its subject and an empty
body**, which is the session's one process failure and lands in the one repo whose `AGENTS.md` requires
consumer enumeration.

**The toolbelt was repaired in two passes** — six agents at 14:11, then all 26 plus receipt artifacts at
20:06. **The receipts paid off within hours:** `Repo Analyst` went silent after 754 lines and its diff
looked like success, but the receipt still read `STARTED` — which is how the run was correctly called
incomplete. **The original "interactive charter" diagnosis was wrong**; output-budget exhaustion fits
better, since the non-conversational `Implementer` failed the same way.

**Ended clean everywhere but one file:** `ProphetsWay.EFTools.sln`, +84/−0, carrying two dangling FR 10
probe projects — **a recurrence of the 08-20 `OrderProbe` incident, and to be discarded, not committed.**
The three long-outstanding untracked `AGENTS.md` files were finally committed.

### 2026-08-20 — *laps 1 and 2, both committed and pushed*

**The headline: building found more than reviewing did, by an order of magnitude.** Three review cycles
over a 5,261-line contract produced diminishing findings; **two implementation laps produced twenty-two**,
several of them latent data-loss bugs. **The owner's call to stop polishing and start building was
vindicated.** Prefer another lap over another review pass when the two compete. Lap 1 shipped three new
`<TEntity,TKey>` bases and **25/25 on the new `Area=KeyPredicate` trait**, with **thirteen specification
defects** as its payload. Lap 2 shipped the three `BaseSoft*` families and converted `DepartmentDao` at
**299 → 97 lines**, suite **200/173/27**, zero regressions across both laps. `Area` was established as a
second trait dimension — which is what lets a lap prove itself **without a local SQL Server**. One
incident: a scratch `OrderProbe` project added to the tracked `.sln` broke the solution build.

### 2026-08-19

**Entirely Stage 2.** `api-contract.md` Revision 8 → 10 over three review→revise cycles. **No code, no
lap.** Q10 inverted the plan so `Contract Reviewer` ran before the shape pass — vindicated by five blocking
findings on rev 8. **Q14 closed by measurement** — the first measured fact in the chain, and it produced an
unasked-for finding that shrank A35's blast radius substantially. `Interface Architect` **rejected a bad
instruction from the coordinator's brief and was right to.**

### 2026-08-18

`ProphetsWay.Example` PR #21 merged (`61d9e7d`) and the EFTools submodule pointer advanced onto it — **the
blocker cleared**. `TestSeam.cs`'s `[ModuleInitializer]` points the upstream suite at the EF DAL, and the
guard was then **hardened against its own auditor**. **All 11 findings closed, four validated by applying
the cheat, watching the guard fail, and reverting.** **57/94 → 123/28.**

### 2026-08-16 → 08-17

Documentation re-verified against source across four repos, producing three findings that mattered more
than the corrections: `ProphetsWay.Hasher`'s `AGENTS.md` was instructing agents to make a binary-breaking
namespace change; `ProphetsWay.BaseDataAccess`'s behavioural-contracts index was missing an entire section
the EFTools 3.x design had been drafted off; and `ProphetsWay.Example`'s version line is 3.1.1 where three
documents said 3.1.0. **No terminal that session** — the owner ran every command, and two agents correctly
stopped rather than guess.
