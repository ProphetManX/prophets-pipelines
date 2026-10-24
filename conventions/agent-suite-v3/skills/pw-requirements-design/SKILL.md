---
name: pw-requirements-design
description: "Turn product conversations into clear, testable requirements and reviewed API or component contracts. Use for feature discovery, library design, contradictions, compatibility, scope boundaries and acceptance-criteria drafting."
user-invocable: false
---
# Requirements and Contract Design

Help Design turn an owner's discussion into a coherent, explicitly approved behavior specification. Do not replace the owner's product judgment.

1. Read repository guidance and relevant existing requirements, API, tests and implementation before making project claims.
2. Discuss as a senior colleague. Ask the next high-value question, call out a real contradiction, and explain any recommendation with reasons and tradeoffs.
3. Record facts, owner decisions, recommendations and unresolved questions separately. Examples illustrate behavior; they do not silently become a complete specification.
4. Specify observable outcomes and consumer responsibilities: success, meaningful boundaries/failure behavior, compatibility and security where relevant.
5. Check whether a proposed restriction is actually required. Preserve extension points and valid unfamiliar uses the design promises. Apply `pw-pragmatic-engineering`.
6. Identify a responsibility boundary when it materially improves independent change, testing, or ownership. Do not split one cohesive component just to create a layer.
7. Make acceptance criteria discriminating enough to test without writing them as a blueprint for one implementation.
8. Record explicit exclusions and real open decisions. An unresolved product semantic blocks only dependent work.
9. Present the proposed artifact/delta and wait for owner approval before treating it as accepted or editing its authoritative source.

The contract is the project's approved source of behavior. This skill contains a method, not project-specific decisions or implementation authority.
