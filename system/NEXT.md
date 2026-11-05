# NEXT — the handoff

## How to open it
- Book: `pnpm run docs:build && pnpm run docs:preview` → http://localhost:4173 (if 4173 is busy the preview
  moves to the next port and prints it). Stop the preview when done (kill by PID, never pkill by name).
- Labs picked this session: `apps/lab/focus/sheet.png` (focus ring, pick B), `apps/lab/progress/sheet.png`
  (Progress fill, pick B).

## Where it stopped
Waves 1–4 are built (48 components). The first full verify of wave 4 went red (i18n, evidence, gates 62/75);
every red was fixed. Then the user sent two rounds of criticism, now fixed and gated:
- R-004 (D-008): every state change moves; control and stage 24px apart. New gates G-MO5, G-SP2; G-MO4 red on a
  silent overlay. `packages/react/src/presence.ts` keeps a leaving panel mounted (Select, Menu, Slot,
  ExplainMode).
- R-005 (D-009): focus ring = text.secondary ink on the part that moves; Progress fill = line.ring resin rod;
  every glyph is the dot-matrix Icon (16 components + 40 docs files). New gates G-IC2, G-FR2.
- R-006 (D-010), system-wide: printing is pad ink pressed into the plastic — warm ink primitives, print.seat on all unit
  printing, groove shadow over the level, cap index cut in (lab apps/lab/print/zoom.png pick F).
- R-007: the hardcoded audit — lint v5 covers the book (530 files, clean); new frame/knob/leading tokens.
Targeted checks all green on the last build: G-MO3/4/5, G-SP2, G-IC2, G-FR2, G-NT2, conformance (Queue, Select
and the rest). A full `pnpm run verify` was restarted 2026-11-03 after R-006 to record M2/M3 (the first one was stopped:
evidence and conformance had passed, rationale was red and is fixed).

- R-009 (2026-11-04): the book's reading column: one size, one left edge, 68ch; section labels above their text. Gate K-16 still to write in kiln.

## Verify
Full verify 2026-11-03 recorded 18/21; every red since fixed and checked by targeted runs (gates, conformance, tone, evidence probes). One more full `pnpm run verify` is needed to close M2/M3 (Icon touches every page, so a top-up costs the same). Run it once, when the user is ready to close the milestone.
Last recorded full run: 2026-11-02 (M1).

## Next, in order
1. Read the verify result; fix any red with targeted checks, then `pnpm run verify:topup`.
2. `pnpm run milestone` (M2), then set milestone.current to M3 in system/kiln.config.json and run it again.
3. Milestone review with the user (Thai): REVIEW.md rows, RETRO R-004/R-005, the book.
4. kiln engine commits made locally this session (2.7.2 → 2.9.1) in ~/Downloads/ds/kiln, not pushed.

## Known problems not fixed yet
- `tooling/contrast-check.mjs` broken (K-8); use `tooling/dial/token-contrast.py`.
- Token values are estimates (D-002); ref-01.png still missing.
- apps/docs/src/docs.css holds old raw values the post-edit lint lists on every edit (pre-existing; verify's lint
  step does not cover it). New book motion lives in apps/docs/src/motion.css.

## Wave 5 plan (2026-11-04, agent decision, user said: finish it, no questions)
Order (dependency first): Textarea, Radio, Avatar, Tooltip, Popover, Accordion, Stepper, Breadcrumb, Pagination, Stat, Timeline, Combobox.
Per component: derive (kiln:new-component) -> 3 lab variants -> pick, log in REVIEW.md -> code -> why.json -> docs -> conformance check.
After every ~5 components: update STATE.md, run `pnpm run verify:changed`. Remaining catalog waves follow in the same way.

## Where it stopped (2026-11-04, late)
Every wave of docs/CATALOG.md is built: 123 components (75 new today in batches of 6 with `kiln:component-engineer` agents, registered one by one with
`tooling/register-component.mjs`). `verify:quick` was green at each batch end (last conformance 890/890). R-010 (TimePicker selection printed white digits) fixed and gated.
Not done / known gaps (all in BACKLOG.md):
- Select options cannot carry a leading node (Avatar in a Select option, as in the GitHub owner picker).
- No full `pnpm run verify` since the first 48 components; evidence/gates (G-*) were NOT run on the 75 new components, only conformance, lint, rationale, i18n, types, meta.
- Agents reported many UNVERIFIED items (forced-colors, RTL, Thai IME, screen readers); none were checked by eye.
- DataGrid is not virtualised; charts/RichTextEditor/CommandPalette/Carousel/VirtualList are native subsets, limits listed in each chapter.
Next: one full `pnpm run verify` (nobody edits source while it runs), read the result, fix reds with targeted checks, then `pnpm run milestone`.

## Do not
- Do not use the Braun name or logo. Do not spread orange beyond one primary control per unit.
- Do not write a component's CSS or TSX with a script; use the editor, one derived component at a time.
- No `npm publish`, no `git push`, no credentials.
