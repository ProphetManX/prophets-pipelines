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
| `steps/` | `package-artifacts.yml`, `package-changelog.yml`, `create-github-release.yml`, and others |
| `variables/` | Shared variable templates |
| `local/` | Reference copies of `app-variables.yml` and `local-pipeline.yml` for new repos to start from |
| `conventions/` | `AGENTS.shared.md` — the conventions master |

### The Contract with Consuming Repos

Templates read these from a consumer's `app-variables.yml`:

| Variable | Meaning |
|---|---|
| `Major` / `Minor` / `Patch` | Hand-maintained version. **Agents must never change these.** |
| `TargetProject` | Glob to the library csproj, e.g. `**/ProphetsWay.EFTools.csproj` |
| `Product` | Library name without the `ProphetsWay.` prefix |
| `RepoName` | `ProphetManX/ProphetsWay.<Library>` |
| `PostTargetToNuGet` | `'yes'` builds alpha/beta/release NuGet packages |
| `HasSqlProj` | `'yes'` builds any `*.sqlproj` |
| `LocalTestsOnly` | `'yes'` skips tests in CI because they need a local database |
| `NuGetFeedCredentialName` | Service connection name |
| `GitHubConnectionName` | Service connection name |

**Renaming or removing a variable here breaks every consuming repo silently** — pipelines fail at
runtime, not at edit time. Any change to this contract must be applied to all seven repos in the
same change set. Enumerate the affected repos before proposing one.

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
| 1 | **README is two lines** | "A generic repo to store my reusable pipeline templates." Nothing documents the variable contract, the stage graph, or how to onboard a new repo. Highest-value documentation target in the workspace — it is the piece a new developer needs to understand the build system. |
| 2 | `ProphetsWay.Hasher` does not consume these templates | It still uses standalone `azure-pipelines.yml` + `version-variables.yml`. |
| 3 | `ProphetsWay.Utilities` has no pipeline at all | It consumes nothing from this repo. |
| 4 | No versioning on the templates themselves | Consumers presumably track `main`, so a breaking template change hits everyone at once with no opt-in. Consider tagging releases and having consumers pin a ref. |
