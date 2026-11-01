# NEXT — the handoff

## How to open it
- Book: `pnpm run docs:build && pnpm run docs:preview` → http://localhost:4173/direction (if 4173 is
  busy, the preview moves to the next port and prints it). Stop the preview when done.
- Anchor lab: http://localhost:4173/lab/anchor/index.html, or open `apps/lab/anchor/index.html` as a file.
- Lab contrast + screenshots: `node tooling/kiln/anchor-contrast.mjs` → `apps/lab/anchor/shots/`.

## Where it stopped
Phase 2 done (kiln state phase=6). Anchor = A (D-001, user pick). Tokens are dial's own (D-002), values
estimated from chat because the user said "ประมาณ" (2026-11-01); `tokens.allowSeed: false`,
`baseTheme: "light"`. Only Container, Grid, Stack exist. **Start wave 1 in this new session.**

## Verify
2026-11-01 `pnpm run verify:quick` 14/14 (not recorded). `node tooling/kiln/rationale.mjs`: 376 tokens,
0 problems. `python3 -I tooling/dial/token-contrast.py`: 0 of 24 pairs fail. Full verify not run.

## Next, in order
1. Read `CLAUDE.md`, `system/CONCEPT.md`, `system/DECISIONS.md` (D-001, D-002), then skill `kiln:production-run`
   and `kiln:ds-conventions`; tactile recipe at `~/.claude/plugins/cache/kiln-marketplace/kiln/2.5.2/docs/style-recipes/tactile.md`.
2. Wave 1 order (layout done): Text, Heading → Button (key), IconButton → Switch (rocker), Checkbox →
   Slider (fader), Rotary (dial's knob) → Select, Input → Display (LCD + OLED), Grille (meter) →
   Card, DeviceCard (anchor A; then set `docs.anchor.route` + re-record) → SegmentedControl, Tabs,
   Chip, Badge, Progress → Dialog, Toast. Every control: `mechanism` + `spring` in why.json
   (mass 1.4, stiffness 520, damping 46), 3 variants in `apps/lab/<Name>/`, agent picks, REVIEW.md row.
3. Replace `apps/docs/src/system/controls.tsx` native controls with dial Select and Slider (G-N1).
4. Docs page per component the day it passes QA; then the book chapters at standard depth.
5. `pnpm run verify` (full) → `pnpm run milestone` until M1 prints done → milestone review in Thai.
6. Rewrite this file at the end of each wave; start a fresh session per wave.

## Known problems not fixed yet
- `tooling/contrast-check.mjs` broken (K-8); use `tooling/dial/token-contrast.py`.
- Token values are estimates (D-002 กระทบ lists what to redo when ref-01.png lands).
- ref images missing (see above).
- `pnpm` is enabled via `corepack enable pnpm` on this machine (was not installed globally).

## Do not
- Do not use the Braun name or logo anywhere. Do not spread orange beyond one primary control per unit.
- Do not pick the anchor for the user. Do not ask the user any other question before the M1 review.
- No `npm publish`, no `git push`, no credentials.
