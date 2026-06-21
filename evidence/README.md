# Agent Evidence Index

This directory tracks the evidence required by the Forge 2 handbook. Only original screenshots and exported transcripts count as proof.

## Current Status

| Requirement | Repository artifact | Status |
| --- | --- | --- |
| OpenClaw used | `openclaw.json` | Configuration added |
| Hermes used | `skills/hermes-orchestrator/SKILL.md` | Skill added |
| Real agent excerpts | `agent-log.md` | Remediation conversation added |
| Slack loop | `screenshots/slack-loop/` | Awaiting original Slack screenshots |
| Autonomous Hermes run | `evidence/autonomous-run/` | Awaiting original run export |
| Hermes cross-session memory | `evidence/hermes-memory/` | Awaiting original screenshots/export |
| Slack API round trip | `screenshots/slack-round-trip/` | Awaiting original screenshot |

Configuration files establish how the agents are intended to work; they do not alone prove that a historical run happened.

## Required Slack Captures

Add readable PNG files using these names:

1. `screenshots/slack-loop/01-human-request-and-hermes-plan.png`
2. `screenshots/slack-loop/02-openclaw-implementation.png`
3. `screenshots/slack-loop/03-result-and-verification.png`

Each image must visibly include Slack chrome, sender names, timestamps, and enough surrounding context to establish the sequence. Do not crop away the workspace/channel context. If the full loop fits legibly in fewer screenshots, keep the filenames ordered and update this index.

## Required Autonomous-Run Proof

Export one real run to `evidence/autonomous-run/hermes-run.md` or add screenshots there. It must show:

- the initial human request;
- Hermes planning and delegating without an intervening human message;
- OpenClaw implementing and returning results;
- Hermes verifying and reporting the final result;
- timestamps or platform metadata that establish ordering.

Use `evidence/autonomous-run/TEMPLATE.md` when exporting text. Replace every placeholder with verbatim content; do not commit the template itself as proof.

## Required Memory Proof

Add original evidence under `evidence/hermes-memory/` showing a fact stored in one Hermes session and recalled in a later session. Both sessions and timestamps must be visible.

## Required Slack Round-Trip Proof

Add a screenshot under `screenshots/slack-round-trip/` showing successful `auth.test`, `chat.postMessage`, and `conversations.history` outputs. Redact token values only; retain the successful response and context.
