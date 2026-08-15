---
written: 2026-08-15T22:15:00
head:
  prophets-pipelines: 13313d1
  ProphetsWay.BaseDataAccess: cce91be
  ProphetsWay.Example: fd23854
  ProphetsWay.EFTools: f95caa5
  ProphetsWay.Logger: 86568fd
  ProphetsWay.Utilities: 5095e5e
  ProphetsWay.Hasher: d1410ca
  ProphetsWay.BPA: 4c0ba1f
status: fresh
---

# Session Handoff

Every claim below was verified against the working tree at write time. Where the owner's sign-off
notes and the repository disagreed, **the repository won** and the discrepancy is called out. Two
such discrepancies exist this session — see **Corrections** immediately below.

## 🚩 Corrections to the Sign-Off Notes

**1. PR #20 is _not_ merged.** The sign-off could not say either way; git can.
`ProphetsWay.Example` is on branch **`net10-support`** at **`fd23854`**, in sync with
`origin/net10-support`. `main` is still at `105b3be` (tagged `3.0.0`). Both commits exist and are
pushed — the owner committed and pushed, but did **not** merge. **Merging PR #20 is task 1
tomorrow**, and the pipeline rework is still correctly sequenced behind it.

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

**`ProphetsWay.Example` 3.1.0 is complete and pushed, but not merged.** The full pass ran — Stage 1
(`Modernizer` → `Purpose Refiner` → `Repo Analyst`), no Stage 2, no Stage 3, Stage 4
(`Changelog Author`, `README Author`) — and Azure DevOps build **`3.1.0.496`** passed on the PR with
both checks green and zero approvals required.

That build also **closed the SDK risk** flagged at checkpoint: `windows-latest` carries the .NET 10
SDK, and the `HasSqlProj` → `VSBuild@1` path built the SDK-style `.sqlproj` successfully. No
`UseDotNet@2` task or `global.json` is needed for now.

Next repo in the owner's order is **`ProphetsWay.EFTools`**, then **`ProphetsWay.Logger`**.

## Current Focus

Nothing is mid-flight. The session closed at a clean boundary: Example is committed and pushed,
awaiting a merge that is a single owner action.

## Next Session — Start Here

The exact invocation for the first real work item is in row 3.

| # | Task | Agent | Why it's next |
|---|---|---|---|
| 1 | **Merge PR #20** (`net10-support` → `main`), then tag. Build `3.1.0.496` is already green. | owner | Everything below is sequenced behind it. |
| 2 | **Run `/sync-agents-md`.** `conventions/AGENTS.shared.md` changed tonight (see *Decisions Made*), so the generated block in all six consuming repos is now out of date. | owner / sync prompt | A stale shared block is silently wrong in six places. |
| 3 | **`ProphetsWay.EFTools` — full pass.** First: `git -C ProphetsWay.EFTools/ProphetsWay.Example checkout -- .` to discard the dirty submodule working tree. Then `@Vanguard begin a full pass on ProphetsWay.EFTools` — it is a modernization project, not a pointer bump. | `Vanguard` → Stage 1 | Largest remaining piece; see the dossier below. |
| 4 | **`HasSqlProj` pipeline rework** as its own cross-repo change set. The sequence is a behavior change, not a rename — now recorded permanently in `prophets-pipelines/AGENTS.md`. Sweep up the two unrelated defects (Known Gaps 5 and 6) in the same set. | `Pipeline Engineer` → `Pipeline Auditor` | Deferred until #20 merged because no consumer pins a template ref. |
| 5 | **`ProphetsWay.Logger`** — discard the 7 modified `.cs` files **first**, then work through interactively. | owner, then `Vanguard` | One of the seven is a test file. |
| 6 | Optional: the markdownlint config decision, and Example's small genuine lint-defect list. | owner | Neither blocks anything. |

### EFTools dossier — so tomorrow does not rediscover it

- **README is stale by roughly three years** and is almost entirely inherited claims. Given decision
  4 below, **treat every sentence as unverified** and open the artifact behind it.
- `docs/repo-profile.md`, `docs/purpose-and-scope.md`, `docs/feature-requests.md` — **all missing**.
- `AGENTS.md` exists but is **untracked**.
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
- `docs/architecture.md` / `requirements.md` may apply here — EFTools is the one library repo where
  the multi-project-application test is arguably met. Owner's call.

## Open Questions — Blocking

None.

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

## In Flight

| Item | State | Where |
|---|---|---|
| **PR #20 — Example 3.1.0** | Committed, pushed, **CI green (`3.1.0.496`)**, **not merged** | `ProphetsWay.Example` branch `net10-support` @ `fd23854` |
| **Durable decisions filed tonight** | Written, **uncommitted** | `prophets-pipelines` — see *Uncommitted Changes* |
| **Shared block regeneration** | **Owed.** `AGENTS.shared.md` changed; the six generated copies have not | Run `/sync-agents-md` |
| **Markdownlint config** | **Investigated, no artifact exists.** Findings preserved below | nowhere on disk |
| **Pipeline rework** | Audited read-only; premise corrected and now filed. No `.yml` touched | sequenced after the merge |

## Uncommitted Changes

Verified with `git status --porcelain` in all eight repos at write time.

| Repo | Files | Description |
|---|---|---|
| `prophets-pipelines` | `M AGENTS.md`, `M conventions/AGENTS.shared.md`, `M conventions/agent-toolbelt.md`, `M conventions/toolbelt/proj-a-session-scribe.agent.md`, `M docs/session-handoff.md` | **Tonight's durable filing plus this file.** All deliberate. ⚠️ The `AGENTS.shared.md` change makes `/sync-agents-md` a prerequisite for the next session. |
| `ProphetsWay.Example` | **none — clean** | On `net10-support`, in sync with origin. Session output is fully committed. |
| `ProphetsWay.BaseDataAccess` | **none — clean** | 3.1.0 fully landed at `cce91be`. |
| `ProphetsWay.EFTools` | `?? AGENTS.md` · `M ProphetsWay.Example` (submodule) | 🚩 Submodule still dirty — the marker is `ProphetsWay.Example.DataAccess/ProphetsWay.Example.DataAccess.csproj` modified **inside** the submodule, which `AGENTS.md` forbids. **Discard from inside it before any EFTools work.** The pointer itself is unchanged at `967fd26`. |
| `ProphetsWay.Logger` | `?? AGENTS.md` + **7 modified `.cs`** | Abandoned refactor, to be **discarded before work reaches Logger**. ⚠️ One is a test file. Full list: `ProphetsWay.Logger.Test/FileDestinationTests.cs`, `Generics/Logger.cs`, `Logger.cs`, `LoggerDestinations/EventDestination.cs`, `LoggerDestinations/FileDestination.cs`, `LoggerDestinations/GenericEventDestination.cs`, `LoggingDestinationCore.cs`. Any agent reading these as current intent draws the wrong conclusion. |
| `ProphetsWay.Utilities` | `?? AGENTS.md` | Sync output, untracked. On `master`. |
| `ProphetsWay.Hasher` | `?? AGENTS.md` | Sync output, untracked. On `master`. |
| `ProphetsWay.BPA` | **none — clean** | No `AGENTS.md` here at all. |

**Four untracked `AGENTS.md` files** — EFTools, Logger, Utilities, Hasher. Verified propagated and
current; they were simply never `git add`ed. **They will be rewritten by task 2**, so add them after
the sync rather than before.

**Nothing was committed, staged, or pushed by this wrapup.** All of the above is the owner's call.

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
