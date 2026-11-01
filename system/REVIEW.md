# REVIEW — every pick the agent made, for the milestone review

autonomy.picks is "agent": after the anchor, the agent derives and picks each component itself,
renders the alternatives in `apps/lab/<component>/`, and logs the pick here. At the end of the
milestone the user reviews this list in one sitting; anything sent back becomes a RETRO entry and a
new round. Nothing here is final until the review.

Put the component name alone in the What cell (`| <Name> |`); `tooling/kiln/milestone.mjs` and
`rationale.mjs` find each pick by it.

| Date | What | Picked | Alternatives (lab) | Why, quoting the principles |
|---|---|---|---|---|
| 2026-11-01 | Button | A capsule key, word on the key | apps/lab/button/index.html (A capsule, B round + printed label, C calculator key) | P3 keys are round or capsule; P5 the word stays legible on the key; P1 one orange key per unit. B kept for IconButton. |
