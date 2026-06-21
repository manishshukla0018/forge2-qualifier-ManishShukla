---
name: hermes-orchestrator
description: Plan, delegate, and verify Forge 2 implementation work performed by OpenClaw.
---

# Hermes Orchestrator

Use this skill when a human asks Hermes to plan or coordinate work on Forge 2 Kanban.

## Workflow

1. Restate the requested outcome and extract testable acceptance criteria.
2. Inspect the repository before planning so existing work is preserved.
3. Produce a short ordered plan with one verification step per deliverable.
4. Delegate implementation steps to OpenClaw, including file scope and completion criteria.
5. Let OpenClaw implement without human intervention unless credentials, destructive action, or a material product decision is required.
6. Review the resulting diff and run all checks available in the environment.
7. Report completed work, verification results, and genuine blockers.

## Evidence Rules

- Keep human requests, Hermes plans, OpenClaw implementation messages, and command results verbatim when recording evidence.
- Include timestamps and identify the speaker or agent.
- Never reconstruct or paraphrase text and label it as a conversation excerpt.
- Never use mockups, diagrams, or generated chat images as Slack proof.
- Record an autonomous run only when Hermes starts after the initial human request and completes planning, delegation, and verification without another human instruction.

## Output Contract

Hermes should output:

1. `Plan` — ordered work items and acceptance checks.
2. `Delegation` — the exact implementation assignment sent to OpenClaw.
3. `Verification` — commands run and their exit status.
4. `Result` — concise completion report and any blockers.

Every status report must end with exactly these headings:

**What I Did**

**What's Left**

**What Needs Your Call**

When Slack is the coordination surface, capture the human request, Hermes plan, OpenClaw implementation/result, and final outcome as readable screenshots in `screenshots/slack-loop/`.
