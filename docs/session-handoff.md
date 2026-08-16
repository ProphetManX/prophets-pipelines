---
written: 2026-08-15T23:35:00
head:
  prophets-pipelines: 6569a59
  ProphetsWay.BaseDataAccess: cce91be
  ProphetsWay.Example: d845863
  ProphetsWay.EFTools: 947fcbf
  ProphetsWay.Logger: 86568fd
  ProphetsWay.Utilities: 5095e5e
  ProphetsWay.Hasher: d1410ca
  ProphetsWay.BPA: 4c0ba1f
status: live
---

# Session Handoff

Every claim below was verified against the working tree at write time. Where the owner's sign-off
notes and the repository disagreed, **the repository won** and the discrepancy is called out. Both
Corrections below are now **closed**; the live discrepancy at this checkpoint is that
`ProphetsWay.EFTools/docs/api-contract.md` is **tracked and modified, not untracked**, and that the
**submodule advance has already landed** — see **Uncommitted Changes** and **Current Focus**.

## 🚩 Corrections to the Sign-Off Notes

**1. ✅ RESOLVED 2026-08-15 — PR #20 is merged.** The correction below was true at the previous
write and is now closed. Verified: `origin/main` is at **`d845863`** ("Retarget to
netstandard2.0;net10.0 and add the docs index (#20)"), carrying tags **`3.1.0`** and
**`3.1.0-498.Beta`**; `origin/net10-support` is **gone**, deleted on merge. **Example 3.1.0 is
merged, tagged, and published.** ✅ **Fully closed at this checkpoint** — the local clone is on
**`main` @ `d845863`**, and the EFTools submodule has been advanced to it and committed.

> _Original text, retained for the record:_ PR #20 is _not_ merged. `ProphetsWay.Example` is on
> branch `net10-support` at `fd23854`, in sync with `origin/net10-support`. `main` is still at
> `105b3be` (tagged `3.0.0`). Both commits exist and are pushed — the owner committed and pushed,
> but did **not** merge.

The two commits, verified by `git log 105b3be..HEAD --stat`:

| Commit | Message | Files |
|---|---|---|
| `bb378a3` | Retarget to netstandard2.0;net10.0 and add the docs index | `AGENTS.md`, 3 × `.csproj`, `app-variables.yml`, publish profile, `docs/repo-profile.md`, `docs/feature-requests.md`, `docs/purpose-and-scope.md` |
| `fd23854` | Document v3.1.0 and correct the README's stale and false claims | `CHANGELOG.md`, `README.md`, `docs/feature-requests.md` |

The Markdown-only second commit is exactly as `Commit Author` scoped it. Example's working tree is
**clean** — nothing from this session is left unstaged there.

**2. The two `.markdownlint.jsonc` files do not exist.** The sign-off records them as created in
`prophets-pipelines/conventions/` and `ProphetsWay.Example/`. Verified absent:

- A recursive, `-Force` search for `.markdownlint*` across all of `c:\Projects\ProphetManX` returns
  **nothing**.
- The same search under the prompts folder returns nothing.
- `ProphetsWay.Workspace.code-workspace` contains **no** `markdownlint` or `MD0` reference.
- `git status --untracked-files=all conventions/` in `prophets-pipelines` is **empty**.

They were either never written to disk or were discarded. **The lint investigation's _findings_
survive below and are worth keeping; its _artifacts_ do not exist.** Anyone acting on this tomorrow
is starting the config from scratch, not editing an existing file.

## Where We Are

**`ProphetsWay.Example` 3.1.0 is shipped** — merged via PR #20, tagged `3.1.0`, published. The full
pass ran Stage 1 (`Modernizer` → `Purpose Refiner` → `Repo Analyst`), no Stage 2, no Stage 3, Stage 4
(`Changelog Author`, `README Author`); Azure DevOps build **`3.1.0.496`** was green on the PR.

That build also **closed the SDK risk** flagged at checkpoint: `windows-latest` carries the .NET 10
SDK, and the `HasSqlProj` → `VSBuild@1` path built the SDK-style `.sqlproj` successfully. No
`UseDotNet@2` task or `global.json` is needed for now.

The previous handoff was **consumed** by a `resume` at the top of this session; this entry is a
`checkpoint` written over it. Next repo in the owner's order is **`ProphetsWay.EFTools`**, then
**`ProphetsWay.Logger`**.

**Current session — `ProphetsWay.EFTools` 3.x.** The owner switched to the **`Vanguard`** lead
mid-effort and ordered a **full independent verification** of the prior agent's work before Stage 3.
That verification **withdrew the "Stage 2 closed" claim**. See **Current Focus**.

## Current Focus

**`ProphetsWay.EFTools` 3.x pass — Stage 2 is CLOSEABLE. Next move is Stage 3.**

### ✅ Since the 21:50 checkpoint — this is the current picture

**`ProphetsWay.EFTools/docs/api-contract.md` went Revision 4 → Revision 6.** ⚠️ **It is now a
*tracked* file, modified — not untracked.** It was committed at `947fcbf`; the Revision 6 delta is
unstaged on top of that.

| Revision | What happened |
|---|---|
| **5** | Closed **N1–N12**. Implemented **OD-4** (`Insert` writes the root only) and **OD-5** (global query filters **DEFENDED** on `Get`). Self-reported one new collision — the **`Update` cascade** question. |
| **5 → review** | Third **`Contract Reviewer`** pass: **PASS WITH FINDINGS**. All twelve prior findings **verified closed against source**. Obligations **106 → 135**, **zero blocked groups** (was three), **~93% authorable**. Readiness verdict: *"Yes — start now."* A28's widening beyond OD-5 judged **sound but under-argued** — **A12 is the stronger justification**. |
| **6** | Closed the eleven review findings **plus** OD-6 and OD-7. Obligations now **142, zero blocked**. |

Revision 6's load-bearing items:

- The **`ToQueryString()` observation seam** is named once in the preamble — **nine obligations were
  unauthorable without it**.
- **`Attach`'s default-key heuristic** named as a trap in **A24**.
- **A30** — the soft-`Update` timestamp exclusion. **A31** — pins **EF Core 10**.
- **A28 re-justified from A12 first.**
- The Revision 4 finding IDs **renumbered `R4-S1`–`R4-S8`** so they stop colliding with settled
  decisions **S1–S13**.

### ✅ New owner decisions — ⚠️ owed to `Purpose Refiner` for permanent filing

| # | Decision |
|---|---|
| **OD-4** | **`Insert` writes the root only.** (Answers the previous entry's blocking question 1.) |
| **OD-5** | **EF Core global query filters are DEFENDED on `Get`.** (Answers blocking question 2.) |
| **OD-6** | **The `Update` cascade question resolves in favour of the current design — `Update` writes the root only.** The conflicting `Scope=Contract` assertion in `ProphetsWay.Example` was a **mis-scoped `NoDB` denormalization detail**; the retrait was authorized and **has landed**. |
| **OD-7** | **Detachment of the reachable graph happens in `finally` — on success *and* failure.** Reverses Revision 5's post-success-only rule. A failed write must not poison the DAL instance; **discarding a pending `Added` insert is the intent.** |

### 🟢 First non-Markdown change of the whole effort — `ProphetsWay.Example`

`Test Designer` edited **`ProphetsWay.Example.Tests/SnapshotDeepCopyTests.cs` and nothing else**:

- Class-level `[Trait("Scope","Contract")]` **removed and applied per method** — required because
  **xUnit *accumulates* traits** rather than letting a method shadow the class, so a method-level
  override would have appeared in **both** filters. Matches house precedent in `CompanyDaoTests` and
  `DataAccessTransactionTests`.
- The cascade assertion **split into a new `Characterization` fact**,
  `ShouldReadANavigationPropertyEditBackInsideTheTransactionThatSubmittedIt`, with an XML doc naming
  the **deep-copy-into-the-row** mechanism so it is not promoted back.
- **161 tests, 0 failed, on both `net10.0` and `net48` — 322 executions.** Traits now
  **Contract 138 / Characterization 3 / Dispatcher 20**. **`Contract` staying at exactly 138 is the
  evidence the change was minimal:** no test left the contract set; one assertion did.

### ⚠️ Newly stale — flagged, not edited (`Repo Analyst` owns both)

`ProphetsWay.Example/AGENTS.md` and `ProphetsWay.Example/docs/repo-profile.md` **line 41** both still
say *"160 tests / 320 executions / Contract 138, Characterization 2, Dispatcher 20"*. Correct values
are **161 / 322 / 138-3-20**.

### ✅ Submodule advance — DONE, contrary to the route below

`git submodule status` in EFTools returns
`d84586335a11d7c9efb7277b947015df0c15967e ProphetsWay.Example (3.1.0)` — **advanced and committed at
`947fcbf`** ("committing stage progression and example submodule update"). Expect **`CS0534` on
`BaseEFDataAccess`'s missing `Dispose`** next — **that break is Stage 3's first red, not a
regression.**

---

**Everything from here to the end of Current Focus is retained history from earlier checkpoints.**
Where it conflicts with the block above, the block above wins.

### 🚩 History — Stage 2 was reopened earlier this session (superseded; see the block above)

A fresh `Contract Reviewer` pass over **`ProphetsWay.EFTools/docs/api-contract.md` Revision 3**
returned **BLOCK**: **5 blocking (B1–B5), 8 significant (S1–S8), 7 minor (M1–M7)**. The previous
entry's *"Stage 2 closed; passed Contract Reviewer"* is withdrawn — **the checkpoint recording it
(19:50) predated the file's last write (20:22)**, so the PASS it reported was against an earlier
revision than the one on disk.

### ✅ Verification performed this session — three parallel read-only passes

| Agent | Result |
|---|---|
| **`Contract Reviewer`** | Re-reviewed Revision 3 → **BLOCK**, 20 findings (B1–B5, S1–S8, M1–M7). Status line not earned; see above. |
| **`Repo Analyst`** | Verified the **Stage 1 evidence base against source**. **Every headline count confirmed** — 26 files, 24 public / 23 abstract, 18 key-specific classes, 6 test adapters, 35 inherited tests, submodule at `967fd26`. Found **7 documentation omissions (D-1…D-7)** and **two previously unrecorded source defects**. Made **one authorized edit**: added the **D7 `net10.0`-only ratified exception** to the per-repo section of `ProphetsWay.EFTools/AGENTS.md` and qualified Known Deviation 2. **Uncommitted.** |
| **`Modernizer`** (recon, read-only, commands actually run) | **Every C# project compiles on all TFM legs under the .NET 10 SDK with no targeting packs needed**; **all tests pass in isolation**; **no CVEs**. Two obstacles found — see below. |

#### The two `Modernizer` obstacles — both fixed by advancing the submodule

1. **`dotnet build` on the `.sln` always fails** on the pinned submodule's **legacy SSDT `.sqlproj`**.
2. **`ShouldGetGenericPaged` is non-deterministic under solution-level parallelism** — ~50% failure,
   a **different TFM leg each time**, caused by six parallel xUnit collections over a
   **`static DataStore`**.

**Both are fixed by advancing the `ProphetsWay.Example` submodule pointer to 3.1.0** — already on the
plan, and now the single highest-leverage action available.

### 🚩 Corrections to the previous entry's claims

- **Owner decisions D1–D9 *are* already filed** to `ProphetsWay.EFTools/docs/purpose-and-scope.md`.
  The previous handoff said they were not. That row of the Next Session table is **not owed**.
- **A green baseline *does* exist, per project.** The previous session left this as an open unknown;
  `Modernizer` established it by running the builds and tests.

### ✅ Owner decisions taken this session — settled, ⚠️ needing permanent filing by `Purpose Refiner`

| # | Decision |
|---|---|
| **OD-1** | **Navigation loading is an opt-in hook** — `protected virtual IQueryable<TEntity> ApplyIncludes(IQueryable<TEntity>)`, **default identity**. Base members load **nothing** unless a DAO declares it. EF Core **model-level `AutoInclude` remains an equally sanctioned alternative**. |
| **OD-2** | **String key equality is collation-defined.** The library neither imposes nor promises a collation; a forced `EF.Functions.Collate` is **explicitly rejected**. |
| **OD-3** | **`default(TKey)` is an ordinary key value** — no short-circuit. |

### ⏳ History — Revision 4, reviewed, BLOCK (superseded: N1–N12 are all closed in Revisions 5–6)

`Interface Architect` produced **Revision 4** of `docs/api-contract.md`, implementing OD-1/OD-2/OD-3
and addressing all 20 findings. A second `Contract Reviewer` pass: **18 of 20 closed**; the **2
refusals (S2, S6) accepted as reasoned**. But Revision 4 **introduced two new blocking findings**:

| # | New blocking finding |
|---|---|
| **N1** | The **hook input contract is stated two incompatible ways in six places**, including **two mutually exclusive test obligations** — *"an override receives the raw `Dataset`"* vs *"`ApplyIncludes` receives the filtered query"*. **One sentence must die.** |
| **N2** | B1 closed the **read** half of the deep-snapshot rule and **left the write half unspecified**. **`Insert`'s mechanism is never stated**; EF Core's `Add` marks **every reachable untracked entity `Added`**, so a naive implementation **re-inserts already-stored related rows**. **Three tests in `SnapshotDeepCopyTests` exercise that path.** |

Plus significant findings:

| # | Significant finding |
|---|---|
| **N3** | `GetCount`'s `NotSupportedException` **contradicts the composition table**. |
| **N4** | **EF Core global query filters are never mentioned** — a consumer's soft-delete `HasQueryFilter` would **double-filter and break `IDepartmentDao` rule 8**. |
| **N5** | `AsNoTracking()` **"interaction: None" is wrong** — it suppresses **identity resolution**, which the design depends on. |
| **N6** | The **collation obligation is unauthorable on the SQLite leg**, and it names **`HasColumnType` where `UseCollation` is the API**. |

Minors **N7–N12** also open.

**Test obligations went from ~70% to ~94% authorable — 106 total.** **Three of eleven groups remain
blocked:** *Hooks and overrides*, *Navigation loading*, *Snapshot and tracking*.

#### The contract, in brief — so tomorrow does not reopen it

| Area | Settled shape |
|---|---|
| Direction | **`net10.0` / EF Core 10 / relational-provider-neutral**, carried forward unchanged from Stage 1 |
| Public surface | **12 public base classes plus a `ContextOwnership` enum**: `BaseEFContext`; `BaseEFDataAccess<TContext>`; **six keyed generic families**; `RootNonIdDao`/`BaseNonIdDao`; `RootSoftNonIdDao`/`BaseSoftNonIdDao` |
| Keys | **Any key type — no `struct` constraint.** Parent-compatible identifier-name resolution plus a `CanWrite` rule. Predicates are **expression trees** |
| Shape | **Flat keyed surface**; interfaces declare capabilities |
| Keyless paging | Custom paging uses **conventional methods on the concrete DAL forwarding to the DAO**, plus a **`virtual ApplyStableOrder`** whose default throws `NotSupportedException`. **Write-only keyless DAOs need no ordering stub** |
| Context | **Passed in directly**, with `ContextOwnership` = `Owned` \| `Borrowed`. The **consumer** constructs the provider options / connection-string context. A borrowed *or* owned context **must be exclusive to one live DAL**. Owned is disposed; borrowed is not |
| Transactions | **DAL-only transaction authority.** The DAO `Ensure*` helpers are **removed** |
| Members | `Context` and `Dataset` are **protected**; **`nullable` enabled** |
| Soft timestamps | **`GetCurrentTimestamp`** (default UTC) plus **`NormalizeRetrievedTimestamp`**; a timezone policy overrides **both** |
| Soft keyless | `RootSoftNonIdDao` has a **`virtual GetCore` override** for normalization and a **sealed soft `UpdateCore`** to prevent a hard-update bypass |
| Semantics | `Update` on an absent row **returns 0**; **stable ordering** required; **no tracking or snapshot obligations**; the `ProphetsWay.BaseDataAccess` **3.1 disposal and transaction contracts are fully specified** |

### ✅ Done at the previous checkpoint — Stage 1 Ground

- **`/sync-agents-md` ran.** The generated block is regenerated across the consuming repos —
  `AGENTS.md` is now modified in `ProphetsWay.BaseDataAccess` (+11) and `ProphetsWay.Example` (+11),
  and rewritten-while-still-untracked in EFTools, Logger, Utilities, and Hasher. **The item is no
  longer owed.** Nothing committed.
- **`Purpose Refiner`** created `ProphetsWay.EFTools/docs/purpose-and-scope.md` and
  `docs/feature-requests.md`, carrying **FRs 1–11**, scheduled as reported.
- **`Repo Analyst`** created `ProphetsWay.EFTools/docs/repo-profile.md` and corrected the EFTools
  **per-repo** section of `AGENTS.md` (below the shared block).
- **`Modernizer` recon** completed — **recon only; no `.csproj`, `.sqlproj`, or `.yml` was touched.**
- **The dirty EFTools submodule working tree was discarded.** `ProphetsWay.EFTools/ProphetsWay.Example`
  is now **clean**; the pointer is unchanged and **still pinned pre-3.0.0 at `967fd26`** (verified
  with `git submodule status`).

**No source, project, YAML, or version artifact changed anywhere in this session.** The entire
output is Markdown.

### Owner decisions taken at the Stage 1 checkpoint — ✅ **filed, contrary to the previous entry**

The previous entry marked these "not yet filed to permanent homes." **That was wrong.** They are
filed to `ProphetsWay.EFTools/docs/purpose-and-scope.md` as **D1–D9**, and **D7** — the `net10.0`-only
ratified exception — was propagated into the EFTools per-repo `AGENTS.md` this session. Retained
below as an index only; the document is the source of truth.

| # | Decision |
|---|---|
| 1 | **EFTools 3.x is EF Core-only.** The EF6 branch goes. |
| 2 | **`net10.0` only** for the EFTools library, its tests, and the local EF example project. No `netstandard2.0`, no `net4x` — a consequence of decision 1, since the EF6 conditional was the only thing `net4x` served. |
| 3 | **Relational-provider-neutral.** No provider is forced by the published package. |
| 4 | **Certified on SQLite and SQL Server.** Both are proven: **SQLite for the fast CI leg, SQL Server in a container** for provider fidelity. Both test sets are wanted — not one or the other. |
| 5 | **Replace the 18 `Guid`/`Int`/`Long` public DAO classes with six generic root classes.** No compatibility wrappers. |
| 6 | **`docs/architecture.md` and per-project `docs/requirements.md` are `n/a` for EFTools.** This settles the open question in the dossier below — it is a library repo, not a multi-project application solution. |
| 7 | **The old submodule edit is discarded**, not salvaged. |

Decisions 1, 2, and 5 are collectively **binary-breaking** and confirm the 3.x major.

### ⏭️ Stage 3 — � **ungated. Stage 2 is closeable.**

`Contract Reviewer` returned **PASS WITH FINDINGS** on Revision 5, those findings are closed in
Revision 6, and obligations stand at **142 with zero blocked groups**.

1. ~~**Establish the current baseline**~~ — **done per project**: everything compiles on every TFM
   leg under the .NET 10 SDK, all tests pass in isolation, no CVEs.
2. ~~**Advance the `ProphetsWay.Example` submodule to 3.1.0**~~ — ✅ **done, committed at `947fcbf`.**
   Still owed in the same version step: move the `ProphetsWay.BaseDataAccess` reference from `2.5.0`
   to **3.1.0**, and modernize the projects.
3. **`Test Designer`** writes **red** tests **from the 142 obligations in `docs/api-contract.md`**,
   then **`Test Auditor`**.
4. **`Implementer`** takes them green, then **`Code Reviewer`** / **`Refactorer`**.
5. Gates: **SQLite first, then SQL Server.**

## Next Session — Start Here

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Stage 3: author the red suite from the 142 obligations** in `ProphetsWay.EFTools/docs/api-contract.md`. | `Test Designer` | **Stage 2 is closeable and Stage 3 is ungated.** The submodule advance already landed, so the baseline is legible. Expect **`CS0534` on `BaseEFDataAccess`'s missing `Dispose`** — that is the first red, **not** a regression. |
| 2 | **A fourth `Contract Reviewer` pass over the Revision 6 delta.** | `Contract Reviewer` | Recommended by `Interface Architect`, not yet run. **Every revision so far has introduced new contradictions** — cheap insurance, and it can run alongside row 1. |
| 3 | **`Test Auditor` over the `ProphetsWay.Example` test change.** | `Test Auditor` | Recommended, not yet run. The trait re-partition is subtle and the suite is the workspace's executable specification. |
| 4 | **Owner authorizes the second mis-scope retrait** — `UserDaoTests.ShouldGetCustomFunctionality` (see Non-Blocking question 9). | owner → `Test Designer` | Same class of decision as **OD-6**. The suite is currently **inconsistent with itself**. |
| 5 | **Route the SQLite-vs-`NoDB` scope question** (Non-Blocking question 10) to `Purpose Refiner`. | `Purpose Refiner` | It goes to **the heart of what `ProphetsWay.Example` exists to prove**. Not yet routed. |
| 6 | **Refresh the two stale Example docs** — `AGENTS.md` and `docs/repo-profile.md` line 41 — to **161 / 322 / Contract 138, Characterization 3, Dispatcher 20**. | `Repo Analyst` | Both were flagged, neither was `Test Designer`'s to fix. |
| 7 | **Append two `Proposed` feature-request entries** to `ProphetsWay.EFTools/docs/feature-requests.md`: the **`RootNonIdDao.EnsureBeginTransaction` silent no-op**, and the **`BaseEFDataAccess` leaked `DbContext`** — framed as a **shipped 2.2.0 defect**, therefore relevant to `Changelog Author` as **Fixed**, not Changed. | any agent may append; `Purpose Refiner` triages | Two source defects `Repo Analyst` found. **Still recorded only here.** |
| 8 | **File OD-1 … OD-7** to `ProphetsWay.EFTools/docs/purpose-and-scope.md`. | `Purpose Refiner` | A checkpoint does not file durable content. D1–D9 are filed; **all seven ODs are not**. |
| 6 | **`HasSqlProj` pipeline rework** as its own cross-repo change set — a behavior change, not a rename. Sweep up Known Gaps 5 and 6 in the same set. | `Pipeline Engineer` → `Pipeline Auditor` | No consumer pins a template ref, so it goes live for everyone at once. |
| 7 | **`ProphetsWay.Logger`** — discard the 7 modified `.cs` files **first**, then work through interactively. | owner, then `Vanguard` | One of the seven is a test file. |
| 8 | Optional: the markdownlint config decision, and Example's small genuine lint-defect list. | owner | Neither blocks anything. |

**`ProphetsWay.EFTools/README.md` is stale — last commit 2022-08-14.** Stage 4 work; not scheduled yet.

### EFTools dossier — so tomorrow does not rediscover it

- **README is stale by roughly three years — last commit 2022-08-14** and is almost entirely
  inherited claims. Given decision
  4 below, **treat every sentence as unverified** and open the artifact behind it. Not yet corrected
  — Stage 4 work.
- ~~`docs/repo-profile.md`, `docs/purpose-and-scope.md`, `docs/feature-requests.md` — all missing.~~
  **All three now exist** and are **committed at `f13f77f`.** `feature-requests.md` carries **FRs 1–11**.
- ~~`AGENTS.md` … is **still untracked**.~~ **Committed at `f13f77f`** with the `Repo Analyst`
  correction and the re-synced shared block.
- **`docs/api-contract.md` — Stage 2's output, and the spec Stage 3 builds against.** 🔴 **Revision 4;
  `Contract Reviewer` verdict BLOCK.** Stage 2 is **not** closed. **Untracked.** Read it before
  writing a single test — and read the N1–N6 findings in Current Focus before trusting any sentence
  in it about hooks, snapshots, `GetCount`, query filters, `AsNoTracking`, or collation.
- **`ProphetsWay.BaseDataAccess` is referenced at `2.5.0` in three `.csproj` files** — verified at
  this checkpoint: `ProphetsWay.EFTools.csproj:62`, `ProphetsWay.Example.DataAccess.EF.csproj:23`,
  and `ProphetsWay.Example/ProphetsWay.Example.DataAccess.csproj:35` (inside the submodule). Current
  is **3.1.0**, and 3.0.0 was a breaking major — `IBaseDataAccess` gained `IDisposable`, exceptions
  stopped being wrapped. This is the single clearest reason the pass is modernization, not a bump.
- TFMs are `net461;net471;net48;net80;net90` — no `netstandard2.0`, undotted monikers, two EOL
  targets. Dual EF6 / EF Core support is keyed on `$(TargetFramework.StartsWith('net4'))`, so
  dropping `net4x` would delete the whole EF6 conditional branch. Weigh that deliberately.
- **Submodule pinned at `967fd26`** (verified via `git submodule status`) — pre-3.0.0, and 3.1.0 puts
  it two minor versions behind. **FR 9 in Example records that the database schema is complete**, so
  advancing the pointer carries **no schema prerequisite**. Verified independently tonight: all seven
  tables exist under `ProphetsWay.Example.Database/dbo/Tables/`, `Departments.sql` and
  `CompanyResources.sql` among them.
- `.gitmodules` carries a **stray `[submodule "Submod"]` block** with only `branch = main` — no
  `path`, no `url`. Verified. Harmless today, but it is malformed and should go.
- **FR 4** (ambient `TransactionScope`) was routed here from Example — a test against an in-memory
  store could never fail, so it only means something against a real EF context.
- ~~`docs/architecture.md` / `requirements.md` may apply here — owner's call.~~ **Settled: both are
  `n/a` for EFTools.** See owner decision 6 above. Do not re-report them as missing.

## Open Questions — Blocking

**None.** ✅ Both prior blockers were answered by the owner this session and implemented in
Revision 5:

| # | Question | Answer |
|---|---|---|
| 1 | What does `Insert` do with a populated navigation graph? | **OD-4 — `Insert` writes the root only.** |
| 2 | Are EF Core global query filters sanctioned, conflicting, or unsupported? | **OD-5 — DEFENDED on `Get`.** |

The `Update` cascade collision that Revision 5 raised is likewise settled — **OD-6**.

## Open Questions — Non-Blocking

| # | Question | Notes |
|---|---|---|
| 1 | **`MD022` and `MD012` were disabled but flagged for reconsideration** | `MD022` is **not** cosmetic — a heading with no preceding blank line stops rendering as a heading on strict parsers. `MD012` had previously been assessed as "should fix", and disabling it reverses that. Unresolved. Moot until a config file actually exists again. |
| 2 | Where does the markdownlint config live? | **Recommendation, not yet acted on:** the `.code-workspace` `settings` block, with **no sync built**. The only consumer is one editor extension on one machine; agents do not lint and there is no CI markdown step. `docs-p-sync-agents-md.prompt.md` **cannot** do it as written — it is scoped to `AGENTS.md` and explicitly forbids editing anything else. |
| 3 | Is the 446-warning count trustworthy as a workspace figure? | Effectively all 446 were in `ProphetsWay.Example/README.md`; every document the agents wrote is clean. **Caveat:** markdownlint in VS Code may analyze only *open* files, so other repos' "zero" is unproven. |
| 4 | `ProphetsWay.BPA` has **no `AGENTS.md`** | Verified again tonight — the repo is clean and carries none. The sync prompt forbids creating one. Does BPA join the convention set? |
| 5 | `ProphetsWay.Utilities` and `ProphetsWay.Hasher` are on **`master`**, not `main` | Verified. Will bite any script assuming `main`. |
| 6 | The agent roster in `%APPDATA%\Code\User\prompts` is **not version controlled** | The only versioned copies are the mirrors in `prophets-pipelines/conventions/toolbelt/`. Sync direction is prompts → toolbelt; nothing enforces it. **I edited both copies tonight** to keep them in step. |
| 7 | Entry 8 (Source Link) rests on an unverified premise | `Microsoft.SourceLink.*` with `PrivateAssets="all"` may not create a package dependency, and SDK 8+ has Source Link built in. Re-check before the deferral hardens into a rule. |
| 8 | `[Trait("Requires", "LocalDb")]` exists **nowhere** in the workspace | The pipeline filter `--filter "Requires!=LocalDb"` therefore currently excludes nothing. Most likely home is EFTools, whose `app-variables.yml` sets `LocalTestsOnly: 'yes'`. Harmless but inert. |
| 9 | **A second mis-scoped test — found and deliberately left alone** | `ProphetsWay.Example.Tests/UserDaoTests.cs`, `ShouldGetCustomFunctionality`, asserts `co2.Whatever.ShouldBe("custom functionality triggered")` — a **`private const` in the NoDB implementation** — under a **blanket class-level `Contract` trait**. `IUserDao`'s own `<remarks>` **explicitly declines to specify that behaviour**, and the counterpart `CompanyDaoTests.ShouldGetCustomCompanyFunction` **is** correctly marked `Characterization`, so **the suite is inconsistent with itself**. Needs the same owner authorization as **OD-6**. → Next Session row 4. |
| 10 | **Should `ProphetsWay.Example.DataAccess.NoDB` be replaced by a SQLite-backed implementation?** | Raised by the owner, prompted by quirks surfacing from the in-memory store. **A scope question, not a technical one** — it goes to the heart of what the repo exists to prove. `Purpose Refiner`'s call; **not yet routed**. → Next Session row 5. |

## In Flight

| Item | State | Where |
|---|---|---|
| **PR #20 — Example 3.1.0** | ✅ **Merged, tagged `3.1.0`, published.** Closed. | `ProphetsWay.Example` `origin/main` @ `d845863` |
| **Example local clone** | ✅ **On `main` @ `d845863`.** Closed. | `ProphetsWay.Example` |
| **Example test change** | 🟢 **First non-Markdown change of the effort.** `SnapshotDeepCopyTests.cs` only — per-method traits, cascade assertion split into a `Characterization` fact. **161 tests / 322 executions / 0 failed** on `net10.0` + `net48`. **Uncommitted.** `Test Auditor` recommended, not run | `ProphetsWay.Example.Tests/SnapshotDeepCopyTests.cs` |
| **Example doc staleness** | ⚠️ `AGENTS.md` and `docs/repo-profile.md` line 41 still say **160 / 320 / 138-2-20**; correct is **161 / 322 / 138-3-20**. `Repo Analyst` owns both | `ProphetsWay.Example` |
| **Durable decisions filed last session** | ✅ **Committed** at `6569a59` | `prophets-pipelines` `main` |
| **Shared block regeneration** | ✅ **Done — `/sync-agents-md` ran.** Uncommitted everywhere. No longer owed | all six consuming repos |
| **`ProphetsWay.EFTools` full pass** | **Stage 1 committed. Stage 2 CLOSEABLE. Stage 3 UNGATED** | `ProphetsWay.EFTools` @ `947fcbf` on `3.0.0-first-pass` |
| **`docs/api-contract.md`** | 🟢 **Revision 6.** Revision 5 drew **PASS WITH FINDINGS** (all twelve prior findings verified closed **against source**; readiness verdict *"Yes — start now"*); Revision 6 closed those eleven findings plus OD-6/OD-7. ⚠️ **Tracked and modified**, not untracked — committed at `947fcbf`, Revision 6 delta unstaged | `ProphetsWay.EFTools/docs/api-contract.md` |
| **Test obligations** | **142 total, zero blocked groups** (was 106 with three blocked). ~93% authorable at Revision 5; the `ToQueryString()` seam unblocked the last nine | derived from `docs/api-contract.md` |
| **Fourth `Contract Reviewer` pass** | ⏳ **Recommended over the Revision 6 delta, not yet run.** Every revision so far introduced new contradictions | `ProphetsWay.EFTools/docs/api-contract.md` |
| **EFTools submodule** | ✅ **Advanced to Example 3.1.0 (`d845863`) and committed** at `947fcbf`. Expect **`CS0534` on `BaseEFDataAccess.Dispose`** — Stage 3's first red, not a regression | `ProphetsWay.EFTools/ProphetsWay.Example` |
| **EFTools `AGENTS.md` D7 edit** | ✅ **Committed** at `947fcbf`. Working tree clean for that file | `ProphetsWay.EFTools/AGENTS.md` |
| **OD-1 … OD-7** | ⚠️ **Recorded in this handoff only.** None filed to `docs/purpose-and-scope.md` | see Current Focus |
| **Two unrecorded source defects** | ⚠️ **Recorded in this handoff only.** `RootNonIdDao.EnsureBeginTransaction` silent no-op; `BaseEFDataAccess` leaked `DbContext` (a **shipped 2.2.0 defect** — `Changelog Author` **Fixed**, not Changed) | owed to `ProphetsWay.EFTools/docs/feature-requests.md` |
| **Seven documentation omissions D-1…D-7** | Found by `Repo Analyst` against source. Not yet actioned | `ProphetsWay.EFTools/docs/` |
| **Markdownlint config** | **Investigated, no artifact exists.** Findings preserved below | nowhere on disk |
| **Pipeline rework** | Audited read-only; premise corrected and filed. No `.yml` touched | now unblocked by the merge |

## Uncommitted Changes

Re-verified with `git status --porcelain --untracked-files=all` in all eight repos at this checkpoint.

| Repo | Files | Description |
|---|---|---|
| `prophets-pipelines` | `M docs/session-handoff.md` | **This file only.** `main` @ `6569a59`. |
| `ProphetsWay.EFTools` | `M docs/api-contract.md` | **The whole list**, on `3.0.0-first-pass` @ **`947fcbf`**. ⚠️ **Correction to the sign-off notes: the file is tracked, not untracked** — it was committed at `947fcbf` along with the submodule advance and the `AGENTS.md` D7 edit; what is dirty is the **Revision 6 delta** (+415 / −128). ✅ Submodule advanced to `d845863` **(3.1.0)** and committed. **No `.cs`, `.csproj`, `.sln`, `.yml`, or version artifact modified here.** |
| `ProphetsWay.BaseDataAccess` | `M AGENTS.md` | **Sync output only.** `main` @ `cce91be`. |
| `ProphetsWay.Example` | `M AGENTS.md`, `M ProphetsWay.Example.Tests/SnapshotDeepCopyTests.cs` | ✅ On **`main` @ `d845863`**. `AGENTS.md` is **sync output only** — it does **not** yet carry the 161/322 correction. **`SnapshotDeepCopyTests.cs` (+72 / −3) is the session's only source change** and is **intended**: per-method traits plus the new `Characterization` fact. |
| `ProphetsWay.Logger` | `?? AGENTS.md` + **7 modified `.cs`** | Abandoned refactor, to be **discarded before work reaches Logger**. ⚠️ One is a test file. Full list: `ProphetsWay.Logger.Test/FileDestinationTests.cs`, `Generics/Logger.cs`, `Logger.cs`, `LoggerDestinations/EventDestination.cs`, `LoggerDestinations/FileDestination.cs`, `LoggerDestinations/GenericEventDestination.cs`, `LoggingDestinationCore.cs`. Any agent reading these as current intent draws the wrong conclusion. |
| `ProphetsWay.Utilities` | `?? AGENTS.md` | Sync output, untracked. On `master`. |
| `ProphetsWay.Hasher` | `?? AGENTS.md` | Sync output, untracked. On `master`. |
| `ProphetsWay.BPA` | **none — clean** | No `AGENTS.md` here at all. |

**Nothing was committed, staged, or pushed by this checkpoint, and no source or project artifact was
touched.** All of the above is the owner's call.

**Nothing was committed, staged, or pushed by this checkpoint, and no source or project artifact was
touched.** All of the above is the owner's call.

## Decisions Made This Session

All five are now **filed in permanent homes**, not just recorded here.

| # | Decision | Filed in |
|---|---|---|
| 1 | **`docs/architecture.md` and per-project `docs/requirements.md` are `n/a` for a utility or reference library.** Their architecture lives in `AGENTS.md`, the README, and XML `<remarks>`. They apply to multi-project **application** solutions — BPA certainly, EFTools possibly. | `conventions/AGENTS.shared.md` → Repo Layout; and the artifact ledger in **both** copies of `proj-a-session-scribe.agent.md`, which previously listed both unconditionally |
| 2 | **When a hygiene fix has a teaching cost, genericize rather than delete** — and record the declined option in the feature-request entry so it is not re-proposed later as unfinished work. Established by FR 6. | `conventions/AGENTS.shared.md` → Rules for Agents |
| 3 | **`HasSqlProj` must not be renamed to `HasLegacySqlProj`.** The pipeline never builds the `.sln` (`projects: '**/*.csproj'`), so `HasSqlProj` is the *only* thing building any `.sqlproj` in CI — the SDK-style one included. Correct sequence: change the build mechanism to reach the `.sqlproj`, prove it in Example's CI, *then* retire the variable. Behavior change, not a rename. | `prophets-pipelines/AGENTS.md` → new subsection under the variable contract, plus the contract table row |
| 4 | **A documentation agent affirming an inherited claim is not the same as verifying it.** Three false README claims survived multiple passes because nobody opened the artifact. Before restating any claim as accurate, open the file — and say which one you opened. | `conventions/AGENTS.shared.md` → Rules for Agents |
| 5 | **For mechanical rules, prefer config over agent instructions.** A linter cannot forget; `AGENTS.shared.md` costs context on every request in seven repos. Reserve the block for judgment rules. Corollary: before building a sync for a config file, ask who consumes it. | `conventions/agent-toolbelt.md` |

Also filed: the two pipeline defects found read-only by `Pipeline Auditor` are now **Known Gaps 5
and 6** in `prophets-pipelines/AGENTS.md` — `steps/create-github-release.yml` hardcodes
`gitHubConnection` and ignores its own parameter; `local/local-pipeline.yml` passes
`PostTargetToNuGet:` to a template declaring no such parameter, so **the reference copy new repos
start from fails at compile.**

### What the session produced in `ProphetsWay.Example` — verified against the commits

- **`Changelog Author`** wrote the v3.1.0 entry and independently confirmed MINOR by classification:
  adding `net10.0` repoints consumers to a differently-compiled asset; dropping `net8.0`/`net9.0`
  strands nobody while `netstandard2.0` remains.
- **`README Author`** corrected three stale build facts, rewrote the EFTools claim as **pending
  rather than false** (a submodule can only lag, never drift), added a VS onboarding note (FR 7), a
  version marker under the badge, and a "Further reading" block routing to `docs/`.
- **`Purpose Refiner`** set FR 6 to `Done`, propagated that to `purpose-and-scope.md`, corrected its
  own now-obsolete "stale claims" table, and filed **FR 9** — seed data for `Resources`,
  `Departments`, `CompanyResources`; status **Deferred on timing rather than merit**, revisit
  alongside FR 5.
- **Three false README claims caught and fixed** — the substance behind decision 4:
  1. "The database project lacks `Departments` and `CompanyResources` tables." **False** — both exist
     and are correctly shaped. `README Author` had reported the bullet as "still accurate" without
     opening the folder; `Purpose Refiner` caught it. Independently re-verified tonight.
  2. "Every showcase DAL fails with `DataAccessConventionException`." **False** — five of seven do;
     `ThrowingDal` and `EntityFailureDal` propagate their own `ShowcaseFailureException` unwrapped.
  3. `EntityFailureDal` was **missing entirely** from the showcase table, despite carrying the
     entities that pin the `Activator.CreateInstance<T>()` .NET Framework divergence.

  Also corrected: the seeding claim now names the four tables actually seeded — verified on disk as
  Companies, Jobs, Transactions, Users — linking the rest to FR 9.
- **`Commit Author`** produced the second commit message and caught two internal inconsistencies,
  both fixed before commit: the changelog said "entries 1–8" while the same commit added entry 9, and
  FR 9's index row was unbolded.

## Deliberately Deferred

| Item | Why | Revisit when |
|---|---|---|
| **FR 9 — seed data for `Resources`, `Departments`, `CompanyResources`** | Deferred on **timing, not merit**. Schema is complete; only the `PostBuildScripts` seeds are absent. | Alongside FR 5 (advancing the EFTools submodule) |
| **xunit v3 migration** | 0 source lines, 3 csproj lines, proven on a scratch probe. The `VSTest@2` blocker is **gone** since `5df6e21`, so this is now a scheduling choice. ⚠️ **Do not lose this:** `Microsoft.NET.Test.Sdk` is still required under xunit v3 unless you opt into `TestingPlatformDotnetTestSupport` — without it `dotnet test` quietly degrades to a build and **exits 0 having run nothing**. | After Example and EFTools are modernized |
| `net48` in the BaseDataAccess and Example **test** projects | Deliberately retained against the "trim targets" instinct. Only leg verifying .NET Framework exception-wrapping, and as of `5df6e21` it actually runs. | Never, while that code path exists |
| Conformance kit (`ProphetsWay.BaseDataAccess.Conformance`) | Sibling package only — never inside the contracts package. | After EFTools is updated; possibly after BPA |
| Source Link / `.snupkg` | Owner declined a project dependency for now; the premise is flagged for re-checking. | Next packaging pass |
| Markdownlint config placement | Investigated fully, no artifact exists. `MD022`/`MD012` still unresolved. | Owner's choice; nothing blocks on it |
| `ProphetsWay.BPA` joining the conventions set | No `AGENTS.md`; the sync prompt forbids creating one. | Owner decides |
| No consumer pins a `ref` of `prophets-pipelines` | All seven track the default branch, so a breaking template change hits everyone at once. | Owner decides |

## Markdown Linting — investigated, then set aside

Recorded so it is not rediscovered. **Findings only — no config file exists on disk.**

- **446 warnings, effectively all in `ProphetsWay.Example/README.md`.** Every document the agents
  wrote is clean.
- **No `.markdownlint.*` config existed anywhere** — the 446 were VS Code defaults nobody chose. Still
  true as of tonight.
- Rules the owner settled on disabling, should a config be recreated: `MD010` (code_blocks only —
  tabs are the house standard in `.cs` samples), `MD049`, `MD060`, plus `MD013` at 120, `MD009`,
  `MD022`, `MD012`, `MD025`.
- `MD025` off **is** well-founded — `CHANGELOG.md` is a stack of `# vX.Y.Z` H1s by design.
- **`MD022` and `MD012` are the two flagged for reconsideration** — see Non-Blocking question 1.
- Genuine defects deliberately left **enabled**: `MD040`, `MD001`, `MD031`, `MD036`.

## Recent Sessions

### 2026-08-15

Completed the **`ProphetsWay.Example` 3.1.0** pass end to end — Stage 1 (`Modernizer` →
`Purpose Refiner` → `Repo Analyst`) and Stage 4 (`Changelog Author`, `README Author`), no Stage 2 or
3. PR #20 opened and **built green (`3.1.0.496`)**, confirming `windows-latest` carries the .NET 10
SDK and that `HasSqlProj` → `VSBuild@1` builds the SDK-style `.sqlproj`. **Not merged.** Caught three
false README claims that had survived multiple documentation passes because no agent opened the
artifact behind them — the session's most transferable lesson, now a rule in `AGENTS.shared.md`.
Filed FR 9 (seed data, Deferred) and closed FR 6. Investigated 446 markdownlint warnings and set the
work aside; **the two config files the sign-off believed existed do not.** Filed five durable
decisions into permanent homes, which leaves `/sync-agents-md` owed.

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
