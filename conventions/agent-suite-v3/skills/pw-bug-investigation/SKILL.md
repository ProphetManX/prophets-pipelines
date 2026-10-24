---
name: pw-bug-investigation
description: "Investigate a reported bug by establishing expected and observed behavior, reproducing it, gathering causal evidence and proposing regression requirements. Use for diagnosis only; this workflow does not implement the production fix."
user-invocable: false
---
# Bug Investigation

1. Establish expected versus observed behavior, affected revision/environment and permitted investigation scope with the owner.
2. Reproduce using the narrowest safe existing test or authorized isolated reproducer.
3. Record the exact command/selection, environment assumptions and actual output needed to interpret the result; redact secrets and do not copy indiscriminate logs.
4. Trace the failure through relevant source/contracts and compare plausible explanations. Change one variable at a time when that distinguishes causes.
5. Separate observed facts, evidence-backed causal inference, alternatives and uncertainty. State confidence and what observation would falsify the leading explanation.
6. Report affected code, reproduction, evidence, limitations, likely cause and recommended correction.
7. Propose testable regression behavior, but do not rewrite requirements, alter existing tests, or implement a production fix.
8. Return findings to the owner. Normal delivery starts only after corrective behavior is approved.

If the defect is not reproduced or cause remains uncertain, report that faithfully. Do not turn an investigation into broad code review or opportunistic refactoring.
