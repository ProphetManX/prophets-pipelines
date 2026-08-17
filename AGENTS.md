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

### Rules for Agents

- **Never edit `.yml` here without explicit instruction.** These files have no test suite; a
  mistake surfaces as a broken build across every repo.
- **Never bump a version** in any `app-variables.yml`.
- Do not add secrets, tokens, connection strings, or service-connection credentials to any
  template. Service connections are referenced **by name only**.
- When proposing a template change, list every consuming repo affected and what each must change.

### Known Gaps

| # | Gap | Notes |
|---|---|---|
| 1 | **README is two lines** | "A generic repo to store my reusable pipeline templates" — that is the whole file. Nothing documents the variable contract, the stage graph, or how to onboard a new repo. Highest-value documentation target in the workspace — it is the piece a new developer needs to understand the build system. |
| 2 | `ProphetsWay.Hasher` does not consume these templates | It still uses standalone `azure-pipelines.yml` + `version-variables.yml`. |
| 3 | `ProphetsWay.Utilities` has no pipeline at all | It consumes nothing from this repo. |
| 4 | No versioning on the templates themselves | Consumers presumably track `main`, so a breaking template change hits everyone at once with no opt-in. Consider tagging releases and having consumers pin a ref. |
| 5 | `steps/create-github-release.yml` hardcodes `gitHubConnection` | It ignores its own parameter. Found by `Pipeline Auditor`, unfixed — **re-verified 2026-08-16, still real:** the template declares `GitHubConnectionName` and then passes the literal `'ProphetsWay@GitHub'` to `GitHubRelease@1`. `deploy-release.yml` does forward `${{ variables.GitHubConnectionName }}` into it, so the value is supplied and discarded. |
| 6 | `local/local-pipeline.yml` passes an undeclared parameter | It passes `PostTargetToNuGet:` to a template that declares no such parameter — **the reference copy new repos start from fails at compile.** Found by `Pipeline Auditor`, unfixed — **re-verified 2026-08-16, still real:** `stages/prophets-pipeline.yml` declares only `PoolType`, `PoolName` and `LocalVariables`. Every working consumer's `local-pipeline.yml` — BaseDataAccess, EFTools, Logger, Example — omits the line, so the reference copy is the only one that breaks. |
| 7 | `local/app-variables.yml` omits `LocalTestsOnly` | The variable contract above lists it, and `ci-build.yml` and `pull-request.yml` both pass `${{ variables.LocalTestsOnly }}` into `steps/restore-build-test.yml`. An undefined variable expands to an empty string, so this does **not** break the build — the effect is that a new repo copying the reference file never sees the knob. The same file is also prefilled with `ProphetsWay.BaseDataAccess` values for `TargetProject`, `Product` and `RepoName`, and carries a stale `2`/`1`/`1` version. Found 2026-08-16. |
