# The Vidra war room — operating protocol

This document governs the marketing war room: the team of agents defined in
`.claude/agents/` when they are convened together (via Claude Code agent
teams) to scrutinise and improve how Vidra is taken to market. Every seat
reads this file before its first message. The repository rules in `AGENTS.md`
bind every seat at all times; nothing here overrides them.

The protocol's structure is not ceremony. It encodes measured failure modes
of multi-agent debate: sycophancy collapses naive agent debate into premature
consensus that underperforms a single agent; agents conform to majorities
rather than argument quality; agents publicly agree with positions they
privately oppose; and soft instructions ("think critically", "feel free to
disagree") are statistically indistinguishable from no instruction, while
explicitly assigned opposition produces near-total genuine disagreement.
Every rule below exists because the naive version demonstrably fails.

## What the war room is for

One agent auditing a site produces a report. A room of agents with opposed
incentives produces decisions. The war room exists to surface real
disagreements — conversion against brand, differentiation against evidence,
growth against honesty — argue them properly, and convert the argument into a
small ranked backlog that one implementer then executes.

Consensus reached in the first round is a failure signal, not a success
signal. If nobody disagreed, somebody didn't do their job.

## The seats

| Seat | Owns | Metric | Natural adversaries |
| --- | --- | --- | --- |
| marketing-director (lead) | Final rulings, the backlog | Decision quality | Everyone, on evidence |
| product-marketer | Positioning drafts, messaging, personas | Message comprehension + differentiation | competitive-intelligence, cro-specialist, seo-content-strategist |
| cro-specialist | CTA hierarchy, friction, activation | Visitor → activation | design-director, pricing-monetization, seo-content-strategist |
| design-director | Brand, hierarchy, perceived quality | Trust and perceived quality | cro-specialist |
| customer-skeptic | Objections of a hostile stranger | Objections unresolved | Every claim on the site |
| competitive-intelligence | The market as it actually is | Gaps found, me-too claims killed | product-marketer |
| growth-marketer | Acquisition channels, intent match | Qualified installs per effort | pricing-monetization, seo-content-strategist, customer-skeptic |
| seo-content-strategist | Organic discovery, content strategy | Qualified organic traffic | growth-marketer, cro-specialist, product-marketer |
| pricing-monetization | The money story: cost to run, TCO, packaging | Believable economics | growth-marketer, cro-specialist |
| technical-director | What may be claimed at all | Claims that survive scrutiny | Every flattering claim |
| site-implementer | The repo, after the ruling | Green `npm run ci` on `main` | Nobody — it stays out of strategy |

## Ground rules

1. **Evidence or silence.** Every claim about the product obeys `AGENTS.md`
   hard rule 5: a number or a mechanism, sourced from the Vidra repositories.
   `lib/site.ts` is the fact table. The technical-director's claim classes
   are binding: SHIPPED (cite the code), PLANNED (cite the roadmap and say
   so), ASPIRATION (unmarketable). `NOT_YET` in `lib/site.ts` is a hard
   fence — in-player peer-to-peer, DRM and a hosted tier must never read as
   shipping, and "no hosted tier" is a design decision, which changes what
   growth and pricing are allowed to want.
2. **Attack the argument, not the agenda.** When you disagree, message the
   seat you disagree with directly and say why: user behaviour, marketing
   principle, competitive evidence, or something observed on the site itself.
   "I have a different preference" is not an argument.
3. **No premature consensus.** Do not soften a finding to be agreeable. The
   lead breaks ties; that is what the lead is for.
4. **Separate observed evidence from hypothesis** in everything you write,
   and date your observations — competitor pages and market claims drift.
5. **Source quality is a rule, not a taste.** Left alone, research agents
   demonstrably drift to SEO content farms. Cite primary sources, official
   documentation, dated competitor pages, named studies. A claim sourced to
   a listicle is unsourced.
6. **The site's voice rules apply to your proposals.** Sentence case. Plain
   English. Mechanisms, not adjectives. No invented numbers even in a draft
   headline. The anti-slop gates below apply to every word you propose.
7. **Only site-implementer edits the repo during a war room.** Strategy seats
   produce findings and arguments, not diffs. Parallel teammates editing the
   same files overwrite each other; one implementer, after the ruling, is the
   rule. (Outside a war room, the three directors may still implement within
   their own remits, as their briefs describe.)

## The anti-slop gates

Vidra's audience is operators and developers — the most calibrated AI-content
detectors there are (Stack Overflow 2025: 46% of developers actively distrust
AI output). The research is blunt: audiences punish visible AI content about
4× more often than they reward it, AI-made ads under-perform human ones even
when viewers cannot consciously detect them, and every major 2024–2026 brand
backlash detonated on the same surfaces. So:

- **"Passes as human" is not the bar.** The bar is: specific and distinctive
  enough to publish under a named human's byline. Undetected mediocrity
  still under-performs.
- **The copy tells are banned, greppably — and this list is the canonical
  copy.** Other briefs point here; when the list evolves, it evolves here
  only. Beyond the brand gate's list:
  delve, elevate, unlock, leverage, robust, streamline, empower,
  transformative, testament, tapestry, pivotal, landscape-as-metaphor,
  boasts, nestled, vibrant, "diverse array", "serves as" / "stands as" where
  "is" belongs, "not just X, it's Y", "…highlighting the importance of"
  trailers, weasel attribution ("industry reports", "observers note"),
  rule-of-three adjective stacks, em dashes where commas belong, and
  weightless headlines that would fit ten thousand products ("Build faster.
  Ship smarter."). Treat this as a living list.
- **The median aesthetic is banned as a cluster.** Purple-adjacent gradients
  (the no-indigo rule is independently validated), gradient orbs, dark hero +
  pill badge + centred headline + three thin-line-icon cards, decorative
  scroll-triggered fade-ins. Any one element may be defensible; the cluster
  is the tell.
- **Human-identity surfaces are never synthesised.** No AI faces, models,
  testimonials, sentiment pieces, or "people using the product" imagery.
  Real product captures or deliberately drawn assets, or nothing — which is
  already the repo's rule, now with the case history behind it.
- **Never market the tooling.** How the site was made is not copy. Talk
  about what Vidra does.
- **The competitor-swap kill-test.** If a proposed headline, section or
  campaign still runs unchanged with a competitor's name in it, it is
  category wallpaper. Reject it — famous-but-not-unique is the quadrant to
  avoid.

## The creative mandate

Scrutiny alone produces a safer version of the same site — and models left
to themselves regress to the category median. Each cycle, every strategy
seat brings **one move Vidra's category has not made**, produced like a
professional, not a brainstorm. Two seats substitute by design: the
customer-skeptic brings the objection nobody wants to hear, and the
technical-director brings its list of underexploited shipped mechanisms.
For everyone else:

- Generate several candidate moves first, including deliberately
  low-probability ones, before choosing what to bring. Bring it rough — a
  paragraph, not a polished pitch. Divergence is the point of round 1;
  polish is round 4's problem.
- Name a structural steal from outside the category: a specific artifact
  and what the move borrows from it. The artifact must be the seat's own
  find — never an example named in a brief, never an anchor another seat
  already brought this cycle; shared anchors converge, and converged
  novelty is theatre. Far-from-category analogies measurably raise
  originality; "like Stripe but for video" is a near analogy and does not
  count.
- Before proposing, write down what every competitor's AI would produce for
  the same brief — then ban every item on that list for the cycle.
- The move must survive the customer-skeptic, the technical-director's claim
  classes, and the anti-slop gates like everything else. Novelty is not an
  evidence waiver.

The lead's corresponding duties: **gate the mandate and protect one weird
bet per cycle.** A novel move arriving without its named artifact, date and
observed evidence is returned unread and recorded as the seat's
non-compliance for the cycle — it does not enter debate. And when a
genuinely original, evidence-compatible idea is being sanded down to
consensus, the lead ships it as an experiment with a kill criterion instead
of letting the room average it away.

## The five rounds

**Round 1 — independent audit.** Every seat examines the site (and, where
relevant, the live deployment and the market) alone. No seat sees another's
conclusions — peer visibility during drafting measurably collapses the
diversity the room exists to produce. Output: findings, each tagged
observed/hypothesis, plus the seat's one novel move.

**Round 2 — cross-examination.** The lead collects all findings, strips the
seat names, shuffles the order, and distributes the anonymised set —
first-speaker anchoring and identity-based deference are both measured
effects. Each seat must name: the strongest recommendation it read, the
weakest, one claim it disputes, duplicates, and one issue everyone missed.

**Round 3 — debate.** Before the open round, each seat sends the lead a
private ballot: its position on each contested point and its single
strongest objection. Then seats message each other directly and argue.
Rules: evidence or concede; at most three exchanges per dispute (late rounds
add conformity, not information); the lead compares public positions against
private ballots, names any seat whose public agreement contradicts its
ballot, and enters the ballot in the record as that seat's true position —
the contested point is then not counted as agreed. For the most consequential contested change, the lead explicitly
assigns one seat to oppose it with a full counter-recommendation —
assigned opposition is the only kind that reliably happens. If the room
reaches agreement on something material within a single round, the lead
spawns a fresh agent with no conversation history to attack that consensus
before accepting it.

**Round 4 — ruling.** The lead first runs a premortem — "it is six months
later; these changes shipped and read as generic AI output; nobody remembered
Vidra; write the post-mortem" — and feeds what it surfaces back into the
decision. Then it produces the backlog:

| Priority | Change | Why | Supporting seats | Opposition | Test |
| --- | --- | --- | --- | --- | --- |

P0 means "the site is wrong or leaking trust without this". P1 means
"material improvement, sequence it". P2 means "worth an experiment". Every
row carries a test — the observable outcome that would prove it worked. The
strongest dissent is preserved in the table as a minority report, not
averaged away; a ruling is a decision with recorded opposition, never a
blend.

**Round 5 — implementation.** The ruling goes to site-implementer, which
executes against the repo's verification gates and git hygiene. Strategy
seats stand down; feasibility objections from the implementer go back to the
lead, not into silent scope changes.

## Convening the room

Agent teams must be enabled (`.claude/settings.json` sets
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`). Spawn teammates from the agent
definitions by name, e.g. "spawn a teammate using the customer-skeptic agent
type". Keep 3–5 teammates active at once — token cost scales roughly
linearly per teammate and coordination degrades past five; three focused
seats outperform five scattered ones. Teammates do not see the lead's
conversation history: every spawn prompt must carry the full task context
(focus, scope, where to look, what to return). Scale effort to the question —
a single-page question needs two seats, not the full room.

The lead moderates and rules; it does not do the seats' work for them, and
it does not begin implementing mid-debate.

- **Core six** (default full audit): marketing-director as lead, plus
  product-marketer, cro-specialist, design-director, customer-skeptic,
  competitive-intelligence.
- **Channels round**: growth-marketer, seo-content-strategist,
  pricing-monetization, with technical-director on call for claims.
- **Claims round** (before anything ships): technical-director and
  customer-skeptic against the proposed copy, alone.

The `/war-room` command runs the whole sequence.
