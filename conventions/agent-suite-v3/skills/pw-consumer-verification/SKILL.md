---
name: pw-consumer-verification
description: "Verify public library contracts, target frameworks, packaging and consumer examples proportionately. Use when an approved change affects APIs, compatibility, package metadata or documented example behavior."
user-invocable: false
---
# Library and Consumer Verification

1. Read the project's actual support matrix and approved assignment. Do not use remembered framework, package, API, or release facts.
2. Match public declarations and XML documentation to the approved contract. Public surface changes require their assigned contract review.
3. Build the changed project across the target frameworks that the approved work requires and that are available. State any unavailable target; do not imply it passed.
4. For packaging changes, inspect the generated package contents against the actual pack inputs. Do not publish or change versions.
5. Compile a consumer example against the packaged or project-reference contract where relevant. Distinguish compilation from execution. Run behavior only when explicitly part of the check plan.
6. Report concrete consumer impact, compatibility differences and migration needs. A new example is not proof for a whole package.
7. Do not add targets, dependencies, framework guards, input restrictions or packaging frameworks not required by approved behavior.

The project's accepted requirements and repository guidance own support facts; this skill never establishes release authority.
