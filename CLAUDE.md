# CLAUDE.md — vidra-site

The agent rules for this repo live in AGENTS.md — the single source of truth,
imported below. Do not duplicate rules here; edit AGENTS.md instead. The design
guardrail it points at is `.ralph/specs/design-system.md`, and reading it before
any UI change is not optional.

Pay particular attention to **"Git hygiene — finished means merged"**: commit
early and push often; a task is finished only when its work is on `main`, pushed,
and the GitHub Actions run on it is green (a red run is "open — awaiting a green
run", never "done"). Never force-push `main`.

@AGENTS.md
