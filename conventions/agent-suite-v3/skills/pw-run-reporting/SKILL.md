---
name: pw-run-reporting
description: "Report meaningful approved-work milestones and evidence to the local ProphetsWay journal MCP tools. Use during coordinated work, tests, review, blockers, completion claims, interruptions and resumptions."
user-invocable: false
---
# Run Reporting

The local journal is an observational aid, not an authority or product gate.

## Report meaningful activity

Use the journal tools exposed to your role:

- Lead registers an approved run, slices, and unique worker invocation identities.
- Workers report invocation start, meaningful phase changes, evidence availability, review request/return, blocker, failure, completion claim, and interruption.
- For an agent-to-agent request/response, use `handoff_sent` / `handoff_received` and reference the other registered invocation ID. Include a concise task/response summary so the dashboard shows the exchange without storing private reasoning or a full prompt.
- Include the run/slice/invocation context through the registered invocation ID. Summaries state concise facts and next action.
- Reference actual result/report paths inside the registered project. Never invent evidence or claim that a command ran when it did not.
- Do not submit private reasoning, full prompts, credentials, secret-bearing command output, or every small edit.

## Interpret acknowledgments

- `recorded` means the event was saved.
- A returned gap is a concrete data/evidence issue; correct it with actual information or leave it visible.
- Missing or invalid test output never becomes a passing result; zero tests, failures and unexplained skips require attention.
- A review reference's existence does not validate the review content or independence.
- `claimed_complete` is a claim even when all expected evidence references exist. The journal cannot certify a requirement, grant approval, review tests, or prove product correctness.
- The journal records a well-formed completion claim even when it has gaps. Do not hide an incomplete state to make the board look green.
- If journal/MCP is unavailable, continue safe approved work when possible and tell Lead about the observability gap. Never make reporting infrastructure failure look like a product test failure or vice versa.

The service owns exact JSON/tool schemas and mechanical validation. This skill describes meaning and safe use; it does not add a second schema, authorize work, or alter evidence requirements during an active run.
