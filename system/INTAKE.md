# INTAKE — every question, asked once, at the start

kiln asks these in one batch before any work starts (user setting: questions up front only). The
answers are the brief; after the anchor pick the agent works to the end of the milestone without
asking again, and records every choice it made in `system/REVIEW.md`.

| # | Question | Answer |
|---|---|---|
| 1 | Name of the system and its packages (`<name>-tokens`, `<name>-react`) | dial — packages `dial-tokens`, `dial-react` |
| 2 | What it is for: who uses it, where (platform, device) | Control app for home devices and media, web and mobile; everyday people at home |
| 3 | App type, one of `tooling/kiln/app-types.json` (dashboard, commerce, media, booking, chat, ai-assistant, finance, productivity, learning, home-iot, content). It picks wave 1's extra components, the next waves and the book's working scenarios; write it to kiln.config `intake.appType` | `home-iot`; waves 2–3 also pull media components (player, progress, list) |
| 4 | References: images, sites or objects in `system/refs/`, and which one leads | `system/refs/ref-01.png` leads (grid of Rams-era white appliances: tuner, audio 1, clock, MP3 player, calculator, speakers); `ref-02.png` second sheet. **Files not on disk yet (2026-11-01): values marked "(estimated from chat, re-measure from ref-01.png)" until they are** |
| 5 | Lineage: the tradition outside web UI it borrows from (kiln proposes three if blank) | Braun / Ulm school industrial design (Dieter Rams, "Weniger, aber besser"); Rams' ten principles are the source of the principles |
| 6 | Must never become (the failure the concept guards against) | Retro costume (fake logos, fake plastic texture, grime); the Braun name or logo (trademark — dial uses its own wordmark); orange spread across the screen; light-grey text on light grey (≥4.5:1 always); bloated round toy shapes |
| 7 | Themes: light, dark or both, and which is the base | Both. Light is the base (warm white matte plastic); dark = charcoal plastic (the black edition) |
| 8 | Backdrops: does the UI sit on plain surfaces, imagery or video | Plain flat surfaces, no imagery |
| 9 | Targets beyond React: Tailwind, SwiftUI, Compose, Flutter, Figma (the token build makes all of them; a native target means colours are written as hex, docs/TARGETS.md) | React + Tailwind + Figma + SwiftUI tokens (native target → colours as hex) |
| 10 | Budget: lean, standard or full (docs/BUDGET.md). Lean builds the core and the app type's wave 1 with shorter prose; nothing that is measured gets lighter. Write it to kiln.config `budget` | standard |
| 11 | Anchor pick: one of the 3–4 anchor variants rendered in `apps/lab/anchor/` (the only visual question) | (pending — anchor round) |

## Working notes from the brief

- Recipe: `docs/style-recipes/tactile.md` + a "matte ABS" material row (height ~5px, gloss ~0.2, roughness ~3px, mass ~1.4); one light source, top-left.
- Every interactive control declares `mechanism` + `spring` in its why.json.
- Motion: fast in, slow out (`kiln.state`); press lands instantly, returns on a spring; knob and fader settle on detents; Reduce motion = no overshoot.
- Anchor: a "device card" like the tuner/player (display, grille, knob, buttons, scale, model name, wordmark); 3–4 variants on proportion display:grille, knob size, shadow depth, label placement. **The user picks.**
- One accent: orange, only on each unit's primary control (one loud thing per unit).
- Displays: 7-segment LCD (dark grey on grey-green) and OLED (white on black) as separate display components.
- Grille: perforated dot grid as functional texture (volume, status), never ornament.
- Type: grotesk sans; model name lowercase bottom-right, wordmark bottom-left.
- Book language: English (default, agent). Replies to the user: Thai.
- Never `npm publish`; never touch credentials. Fresh session per wave via STATE.md/NEXT.md; capped command output.
