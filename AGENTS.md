# AGENTS.md — prophets-pipelines

**This repo is the source of truth for ProphetsWay conventions.**

The shared conventions block lives at [conventions/AGENTS.shared.md](conventions/AGENTS.shared.md).
Read it before doing anything in this repo or any sibling repo. It is not inlined here — unlike
every other repo, the master copy is already present on disk.

Every other `ProphetsWay.*` repo carries a **generated copy** of that block inside its own
`AGENTS.md`, delimited by `BEGIN SHARED BLOCK` / `END SHARED BLOCK` markers.

## Editing Conventions

1. Edit `conventions/AGENTS.shared.md` — never a generated copy in a sibling repo.
2. Run `/sync-agents-md` to regenerate the block in all sibling repos.
3. Commit this repo **and** every repo the sync touched.

A change here is a change to seven repos. Keep the block tight — it is loaded into the agent's
context on every single request in every repo that carries it. Detail that is not needed on every
request belongs in a linked doc, not in the block.

## Agent Toolbelt

[conventions/agent-toolbelt.md](conventions/agent-toolbelt.md) documents the custom agents and
prompts built for these repos — what exists, why each decision was made, and verified VS Code
behavior. It is **not** auto-loaded. Attach it with `#file` when working on agent customizations;
ignore it otherwise.

## This Repo

**Type:** Azure DevOps YAML templates · **Published:** no · **No .NET code**

Reusable pipeline templates consumed by every `ProphetsWay.*` repo. Consumers reference these via
a two-file pattern in their own root: `app-variables.yml` (per-repo values) and `local-pipeline.yml`
(a thin wrapper pulling the stage templates from here).

### Layout

| Folder | Contents |
|---|---|
| `stages/` | `prophets-pipeline.yml`, `ci-build.yml`, `pull-request.yml`, `deploy-release.yml` |
| `steps/` | `package-artifacts.yml`, `package-changelog.yml`, `create-github-release.yml`, `restore-build-test.yml` |
| `variables/` | `versions.yml` — derives `SemanticVersion`, `AlphaVersion`, `BetaVersion` from `Major`/`Minor`/`Patch` |
| `local/` | Reference copies of `app-variables.yml` and `local-pipeline.yml` for new repos to start from |
| `conventions/` | `AGENTS.shared.md` — the conventions master — plus `agent-toolbelt.md` and `toolbelt/`, the agent and prompt definitions |
| `docs/` | `session-handoff.md` |

### The Contract with Consuming Repos

Templates read these from a consumer's `app-variables.yml`:

| Variable | Meaning |
|---|---|
| `Major` / `Minor` / `Patch` | Hand-maintained version. **Agents must never change these.** |
| `TargetProject` | Glob to the library csproj, e.g. `**/ProphetsWay.EFTools.csproj` |
| `Product` | Library name without the `ProphetsWay.` prefix |
| `RepoName` | `ProphetManX/ProphetsWay.<Library>` |
| `PostTargetToNuGet` | `'yes'` builds alpha/beta/release NuGet packages |
| `HasSqlProj` | `'yes'` builds any `*.sqlproj` — **including SDK-style ones**; see below |
| `LocalTestsOnly` | `'yes'` skips tests in CI because they need a local database |
| `NuGetFeedCredentialName` | Service connection name |
| `GitHubConnectionName` | Service connection name |

**Renaming or removing a variable here breaks every consuming repo silently** — pipelines fail at
runtime, not at edit time. Any change to this contract must be applied to all seven repos in the
same change set. Enumerate the affected repos before proposing one.

#### `HasSqlProj` must not be renamed to `HasLegacySqlProj`

The shared build step is `projects: '**/*.csproj'` — **the pipeline never builds the `.sln`**, so a
`.sqlproj` is unreachable by the ordinary build. `HasSqlProj` gates `NuGetCommand@2` + `VSBuild@1`,
which makes it the **only** thing that builds any `.sqlproj` in CI, SDK-style ones included. It is
an active path, not a legacy one, and a local `dotnet build` succeeding does not transfer to CI.

The correct sequence when this is resumed is a **behavior change, not a rename**: change the build
mechanism to reach the `.sqlproj` (build the `.sln`, or a glob covering both project types) → prove
it in `ProphetsWay.Example`'s CI → *then* retire `HasSqlProj` entirely. **No consumer pins a
template `ref`**, so a merge here is live for every in-flight build.

### `stages/deploy-release.yml` — rewritten 2026-08-23 in `6110d69`

HEAD is **`6110d69`**, read from `.git/logs/HEAD`. Its parent is `63dd56b`, and much of what it does
is a deliberate revert of that commit. **Read this before proposing anything about symbol packages
or step ordering — all three items below were settled the same day, and two of them cost a real
defect to find.** Every claim here was re-read from
[stages/deploy-release.yml](stages/deploy-release.yml) on 2026-08-23.

| Change | What it means |
|---|---|
| **Deleted** the `Detect/Stage {PackageType} Symbol Package` PowerShell step and the explicit `Push NuGet {PackageType} Symbol Package` task | **A substantial revert of `63dd56b`.** `nuget.exe` 6.4.0 already pushes a co-located `.snupkg` on the ordinary `.nupkg` push. **Measured, not inferred:** the `Push NuGet Alpha Package` log of 2026-08-23T04:45 shows an *unprompted* `PUT` to `/api/v2/symbolpackage/` returning **`Created`**. **`HasSymbolPackage` now has no reader in any YAML** — grepped repo-wide 2026-08-23; the only two hits are in `docs/session-handoff.md` |
| **Added** `NuGetToolInstaller@1` pinned to `versionSpec: '6.4.0'` | **Deliberately fatal** — no `continueOnError`. The pin is the thing that keeps the line above true: `nuget.exe` is otherwise whatever the hosted image ships, and its version decides whether one push also publishes the `.snupkg`. An image refresh could silently change what reaches the feed with no commit anywhere |
| **Moved** the `{PackageType}` artifact download **above** both GitHub release invocations | **This fixed a real, silent defect.** `steps/create-github-release.yml` globs `$(build.artifactstagingdirectory)/{PackageType}/*.nupkg` for its `assets`, and the download used to run *after* the release steps — so **every Beta and Release GitHub release for BaseDataAccess, EFTools and Logger was created with no package attached**, green and silent. The same move is what puts a `.snupkg` beside its `.nupkg` for the push, so **narrowing that download to `*.nupkg` would stop symbol publication with no error anywhere** |

**Two orderings in this file are load-bearing and must not be "tidied":**

- The `NuGetToolInstaller@1` sits at the top of the stage because it is cheap and failable and
  nothing below it is — Beta and Release create and delete GitHub releases, and the push cannot be
  un-published. It is a fail-fast gate for the whole stage, not a prerequisite of the release steps.
- The `PostTargetToNuGet` guard appears **twice**, deliberately, rather than as one merged block.
  Merging them would move the push above the GitHub release steps that sit between them, publishing
  a version before those steps can fail and stranding one that no re-run can replace.

**Symbol publication is achieved by the `nuget.exe` 6.4.0 pin, not by a push step.** A step was
written and reverted the same day. Do not send a reader looking for one, and do not "restore" it.

### Rules for Agents

- **Never edit `.yml` here without explicit instruction.** These files have no test suite; a
  mistake surfaces as a broken build across every repo.
- **Never bump a version** in any `app-variables.yml`.
- Do not add secrets, tokens, connection strings, or service-connection credentials to any
  template. Service connections are referenced **by name only**.
- When proposing a template change, list every consuming repo affected and what each must change.

### Known Gaps

**Gaps 1, 5, 6 and 7 were each re-verified on 2026-08-23 by opening the file named, not by carrying
the previous note.** All four are still real.

| # | Gap | Notes |
|---|---|---|
| 1 | **README is two lines** | **Re-verified 2026-08-23 by opening `README.md`:** `# prophets-pipelines` and "A generic repo to store my reusable pipeline templates" — that is the whole file. Nothing documents the variable contract, the stage graph, or how to onboard a new repo. Highest-value documentation target in the workspace — it is the piece a new developer needs to understand the build system, and it is now also the only place the `6110d69` behaviour above could be explained to a human. |
| 2 | `ProphetsWay.Hasher` does not consume these templates | It still uses standalone `azure-pipelines.yml` + `version-variables.yml`. |
| 3 | `ProphetsWay.Utilities` has no pipeline at all | It consumes nothing from this repo. |
| 4 | No versioning on the templates themselves | Consumers presumably track `main`, so a breaking template change hits everyone at once with no opt-in. Consider tagging releases and having consumers pin a ref. **`6110d69` is a live illustration**: it changed publish behaviour for every consumer at once, with no opt-in and no way to stay on the old shape. |
| 5 | `steps/create-github-release.yml` hardcodes `gitHubConnection` | It ignores its own parameter. Found by `Pipeline Auditor`, unfixed — **re-verified 2026-08-23 by opening the file, still real:** it declares `GitHubConnectionName: ''` at line 3 and then passes the literal `'ProphetsWay@GitHub'` to `GitHubRelease@1` at **line 15**. `deploy-release.yml` does forward `${{ variables.GitHubConnectionName }}` into it from both call sites, so the value is supplied and discarded. Harmless only because every consumer's service connection happens to carry that name. |
| 6 | `local/local-pipeline.yml` passes an undeclared parameter | It passes `PostTargetToNuGet:` to a template that declares no such parameter — **the reference copy new repos start from fails at compile.** Found by `Pipeline Auditor`, unfixed — **re-verified 2026-08-23 by opening both files, still real:** `local/local-pipeline.yml` line 56 passes `PostTargetToNuGet: ${{ variables.PostTargetToNuGet }}`, and `stages/prophets-pipeline.yml` declares only `PoolType`, `PoolName` and `LocalVariables`. Every working consumer's `local-pipeline.yml` — BaseDataAccess, EFTools, Logger, Example — omits the line, so the reference copy is the only one that breaks. |
| 7 | `local/app-variables.yml` omits `LocalTestsOnly` | The variable contract above lists it, and `ci-build.yml` (line 113) and `pull-request.yml` (line 41) both pass `${{ variables.LocalTestsOnly }}` into `steps/restore-build-test.yml`, which gates the test task on it at line 29. An undefined variable expands to an empty string, so this does **not** break the build — the effect is that a new repo copying the reference file never sees the knob. **Re-verified 2026-08-23 by opening the file:** it is still prefilled with `ProphetsWay.BaseDataAccess` values for `TargetProject`, `Product` and `RepoName`, and still carries the stale `2`/`1`/`1` version. |
| 8 | **Auditor finding A2 — the Beta `GitHubRelease@1 action: 'delete'` is fatal and non-idempotent** | **New here 2026-08-23. Medium, and NOT approved — recorded, not fixed.** In the `Release` block of [stages/deploy-release.yml](stages/deploy-release.yml), the *Delete GitHub Beta Release* task carries no `continueOnError`, so **a Release stage that fails at or after it can never be re-run to green**: the second run's delete finds no Beta tag and fails the stage before anything else executes. The proposed remedy is `continueOnError: true` on that one task and nothing else. **It was recorded only in [docs/session-handoff.md](docs/session-handoff.md), which is rewritten every session** — which is why it is here. The decision is the owner's; do not apply it. |

> **`docs/session-handoff.md` is not durable.** It is rewritten each session, so any finding that
> survives its session has to be lifted into this file or into a template comment. Gap 8 is the
> first item moved for that reason; check that file for others before treating it as an archive.
