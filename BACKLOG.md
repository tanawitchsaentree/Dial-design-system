# BACKLOG — found, not decided (one list)

## kiln bugs / gaps (fix in kiln, then `node tooling/engine/sync.mjs <repo>`)

- **K-1 (fixed in kiln 2.5.2) create.mjs needs a global pnpm.** `node bin/create.mjs ~/Downloads/bauhouse-ds --name dial` printed
  `✗ pnpm install failed` (cause: `pnpm` not on PATH, `zsh: command not found: pnpm`). It stopped before
  the seed-token build and the git commit. Fixed locally with `corepack enable pnpm`. Suggest: try
  `corepack pnpm` / `npx pnpm@<packageManager>` before failing, and print the cause.
- **K-2 (fixed in kiln 2.5.2) lint hook blocks lab CSS.** `tooling/hooks/post-edit-lint.mjs` lints every `.css` path, including
  `apps/lab/anchor/anchor.css` (116 violations: raw hex, px, physical properties), so a lab file cannot
  hold raw estimated values. Worked around with inline `<style>` in `apps/lab/anchor/index.html` (as
  the starter's `apps/lab/index.html` does). Suggest: skip `apps/lab/**` in the hook (TARGETS already
  skip it in the full lint).
- **K-3 (fixed in kiln 2.5.2) kit principle parser runs past `## ` headings.** `apps/docs/src/book/kit.tsx` PRINCIPLES regex stopped
  only at `### P\d+` or end of file, so any `## ` section after the last principle (here `## Direction`,
  `## Light model`) was swallowed into P6. `tooling/kiln/rationale.mjs` already stops at `^## `. Patched
  locally in kit.tsx (added `|^## `); upstream the same change into the starter.
- **K-4 (fixed in kiln 2.5.2) `docs:preview` hard-codes port 4173 with `--strictPort`.** Another project's preview (title "Pane")
  held 4173, so `pnpm run docs:preview` failed (`ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`). Used
  `npx vite preview --port 4317 --strictPort` in `apps/docs`. Suggest: a per-system port in kiln.config.
- **K-5 (fixed in kiln 2.5.2) starter docs.css references `/scenes/night-sm.jpg`** that does not exist: the build warns
  `/scenes/night-sm.jpg referenced in /scenes/night-sm.jpg didn't resolve at build time`. dial has
  plain backdrops only; remove or guard the scene image in the starter.
- **K-6 (fixed in kiln 2.5.2) no CLI for the anchor-round contrast check.** `tooling/kiln/text-contrast.mjs` says it is shared by
  "the lab anchor round", but nothing runs it on `apps/lab/anchor/`. Added `apps/lab/anchor/check.mjs`
  (both themes, screenshots in `apps/lab/anchor/shots/`). Suggest: ship it in the engine.
- **K-7 (fixed in kiln 2.5.2) `baseTheme: "light"` on seed tokens builds `themes: light, light`.** The seed `$value` describes
  dark, so flipping baseTheme before Phase 2 drops dark. Kept `dark` until Phase 2 rewrites tokens.

## dial
- Reference images `system/refs/ref-01.png` / `ref-02.png` not on disk; every reference value is
  "(estimated from chat, re-measure from ref-01.png)".
- Lab is published into the book through the symlink `apps/docs/public/lab -> ../../lab` (dist also
  carries `check.mjs` and `shots/`); replace with a proper build input when the anchor is locked.
- ✓ fixed in kiln 2.5.3 — **K-8 `tooling/contrast-check.mjs` reads a file the token build no longer writes.** `node tooling/contrast-check.mjs text-primary:surface-solid`
  → `ENOENT ... packages/tokens/build/css/light.css`. The build writes `build/css/tokens.css` (themes as `[data-theme]`).
  Workaround: `python3 -I tooling/dial/token-contrast.py` (24 dial pairs).
- ✓ fixed in kiln 2.5.3 — **K-9 docs.css `.page-head .lede p` overrides a component that renders a `<p>`.** The live demo sits in the page
  head, so `<Text size="body">` measured 18px (want 15px) in conformance. Patched locally with `:not([data-component])`.
- ✓ fixed in kiln 2.5.3 — **K-10 G-SL1 measures Rotary as a slider.** It checks every `[role="slider"]` against the 200px minimum length;
  a rotary is a slider by role but has no length. Exempt `[data-component="Rotary"]` (or `data-mechanism="rotary"`).
- ✓ fixed in kiln 2.5.3 — **K-11 smoke-import imports the ESM build in plain Node, which cannot load the per-component CSS imports** the
  library build adds for tree-shaking: `ERR_UNKNOWN_FILE_EXTENSION ".css" … dist/css/components/Badge/Badge.css`
  (esm=0 cjs=27). Patched locally in `tooling/smoke-import.mjs`: probes run with a `--import` hook that stubs `.css`.
- ✓ fixed in kiln 2.5.4 — **K-12 G-NC1 reads only the top-left radius of a nested shape.** In a SegmentedControl bank the last key's top-left
  corner is the 6px seam to its neighbour, while its real end corners nest the bank; the gate reports
  "SegmentedControl … corner 6px". It should take the corner that faces the container's corner.
- ✓ fixed in kiln 2.7.1 — **K-14 G-PC1 counts an inline listbox as a popup.** `popupClipProbe` (tooling/kiln/ui-probes.mjs) checks every visible
  `[role=listbox]`, so a selectable List (a play queue, always on the page, role listbox) further down /components/list/code
  is reported "478px of it is off the screen" after a Menu opens. It should only measure a listbox that a trigger owns while
  open (`[aria-expanded=true][aria-controls]` → its id) or one inside `[popover]`/`[role=dialog]`. Found 2026-11-02 (wave 2, List/Menu).
