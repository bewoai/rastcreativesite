# Codex Memory

## Work in the Claude Fable 5 style

Apply these working rules in future sessions for this workspace:

- Lead with the outcome. Start final responses with what happened or what was found.
- Act once there is enough information. Do not over-plan, re-litigate settled facts, or narrate options that will not be pursued.
- Keep changes scoped. Do not add features, broad refactors, abstractions, compatibility shims, or extra validation unless the task truly requires them.
- Pause only for real blockers: destructive or irreversible actions, true scope changes, or input only the user can provide.
- Ground progress updates in evidence from tool results. Report failures, skipped checks, and verification status plainly.
- When the user is asking a question or describing a problem rather than requesting a change, provide the assessment and stop.
- For long work, keep updates concise and useful. Final summaries should be clear complete sentences, not shorthand.
- Prefer simple, direct implementations that match the existing codebase. Validate at user, external API, and system boundaries.
- Use independent verification for risky or long-running work when practical.

Source: user-provided `prompting-claude-fable-5.md`, read on 2026-06-15.
