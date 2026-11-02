# NEXT — the handoff

## How to open it
- Book: `pnpm run docs:build && pnpm run docs:preview` → http://localhost:4173/direction (if 4173 is
  busy, the preview moves to the next port and prints it). Stop the preview when done.
- Anchor lab: http://localhost:4173/lab/anchor/index.html, or open `apps/lab/anchor/index.html` as a file.
- Lab contrast + screenshots: `node tooling/kiln/anchor-contrast.mjs` → `apps/lab/anchor/shots/`.

## Where it stopped
**M1 is done** (2026-11-02): `pnpm run verify` 20/20 recorded, `pnpm run milestone` 44/44. Waiting for the
user's milestone review of `system/REVIEW.md` and the book (http://localhost:4173 after `pnpm run docs:build && pnpm run docs:preview`).

## Verify
2026-11-02 full verify 20/20 on the current source hash (system/reports/verify-latest.json).

## Next, in order
0. Wave 2 starts with `node ~/Downloads/ds/kiln/tooling/engine/sync.mjs ~/Downloads/bauhouse-ds` (kiln 2.7.0), add `"verify:topup": "node tooling/kiln/verify.mjs --topup"` to package.json, ONE full verify (new hash format + manifest), fix G-MO3/G-MO4; afterwards fix → `pnpm run verify:topup` only (memory: verify-cost).
1. Milestone review with the user (Thai): every REVIEW.md row; anything sent back → system/RETRO.md + a new round.
2. When `system/refs/ref-01.png` lands: re-measure (D-002 กระทบ list), regenerate tokens via tooling/dial/gen-tokens.py, re-record anchor.
3. Wave 2 (home-iot): RangeSlider, Meter, List, Sheet, Banner, EmptyState, Skeleton, TimePicker; then media (player, progress, list). Follow system/PLAYBOOK.md; fresh session per wave.
4. Milestone menu leftovers (pnpm run milestone prints them): radio + text field family, second backdrop scene, motion playground, density modes, RTL check, dial icon set.

## Known problems not fixed yet
- `tooling/contrast-check.mjs` broken (K-8); use `tooling/dial/token-contrast.py`.
- Token values are estimates (D-002 กระทบ lists what to redo when ref-01.png lands).
- ref images missing (see above).
- `pnpm` is enabled via `corepack enable pnpm` on this machine (was not installed globally).

## Do not
- Do not use the Braun name or logo anywhere. Do not spread orange beyond one primary control per unit.
- Do not pick the anchor for the user. Do not ask the user any other question before the M1 review.
- No `npm publish`, no `git push`, no credentials.
