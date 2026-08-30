---
description: Convene the Vidra marketing war room — independent audits, cross-examination, debate, a ruling, then one implementer
argument-hint: 'focus, e.g. "homepage hero", "the compare page", "launch messaging" — omit for a full audit'
---

Convene the Vidra marketing war room on: $ARGUMENTS (if empty: a full audit of
the site and its positioning).

## Before anything

1. Read `.claude/war-room.md` — the operating protocol. It defines the seats,
   the ground rules, the creative mandate and the five rounds. Everything
   below assumes it.
2. Confirm agent teams are available (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`
   is set by `.claude/settings.json`; if teammate spawning fails, tell the
   user to restart Claude Code so the setting loads, and stop).
3. Read `.claude/agents/marketing-director.md` and **adopt it: you are the
   lead.** You moderate, you force evidence, you do not agree quickly, and
   you produce the ruling.

## Convene

Spawn teammates from the agent definitions in `.claude/agents/` — for a full
audit, the core six minus you: product-marketer, cro-specialist,
design-director, customer-skeptic, competitive-intelligence. For a channels
or pricing focus, swap in growth-marketer, seo-content-strategist and
pricing-monetization per the protocol's presets. Keep at most five teammates
active at once. Bring in technical-director whenever a claim needs its
SHIPPED / PLANNED / ASPIRATION classification — always before copy ships.

Tell each teammate its focus and that round 1 is independent: no sharing
until every audit is filed.

## Run the five rounds

1. **Independent audit** — collect each seat's findings and its one novel
   move with the research attached, per the creative mandate (the
   customer-skeptic and technical-director bring their recorded substitutes
   instead). Return unread any novel move missing its named artifact, date
   and evidence. No sharing until every audit is filed.
2. **Cross-examination** — strip the seat names off the findings, shuffle
   the order, and distribute the anonymised set; require each seat to name
   the strongest recommendation, the weakest, one claim it disputes,
   duplicates, and what everyone missed.
3. **Debate** — collect each seat's private ballot first (position on each
   contested point plus its strongest objection, to you only). Then direct
   the disputing seats to message each other and argue it out: evidence or
   concession, at most three exchanges per dispute. Name any seat whose
   public agreement contradicts its ballot. Assign one seat to oppose the
   biggest contested change with a full counter-recommendation. If the room
   agrees on something material within a single round, spawn a fresh
   no-history agent to attack that consensus before you accept it.
4. **Ruling** — run the protocol's premortem first, then produce the
   P0/P1/P2 backlog table: change, why, supporting seats, opposition
   preserved as a minority report (never averaged away), and the test that
   would prove each row worked. Protect one weird bet if the cycle produced
   one worth protecting.
5. **Implementation** — shut the teammates down, then hand the ruling to a
   single `site-implementer` subagent. It follows `AGENTS.md` to the letter:
   `npm run ci` green, committed, pushed. Feasibility objections come back to
   you; nothing gets silently descoped.

## Deliver

Report to the user: the ruling table, the genuine disagreements and how they
resolved, the weird bet (if any) and its kill criterion, and what the
implementer shipped (with the CI tail). Never present consensus that did not
happen.
