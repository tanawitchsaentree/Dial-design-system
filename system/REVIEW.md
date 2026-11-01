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
| 2026-11-01 | Text | A size and position, sentence case | apps/lab/text/index.html (A size and position, B spaced capitals for small printing, C lowercase throughout) | P5 "one grotesk, regular and medium only; hierarchy by size and position"; B adds a second voice and capitalises the model name; C makes every label read as a model name. |
| 2026-11-01 | Heading | family of Text (A) | apps/lab/text/index.html (same three options, headings shown in each) | P5 "hierarchy by size and position": the four larger steps in medium weight, h1–h4 in the markup, no new voice. |
| 2026-11-01 | Switch | A slide switch, cap in a recessed groove | apps/lab/switch/index.html (A slide switch, B rocker, C toggle key with lamp) | P3 faders ride a groove: the cap's position is the state; P1 orange appears once per unit, so on is position + lamp + word, never a colour fill; P5 positions printed beside it. B tells state by shading only, C looks like a Button. |
| 2026-11-01 | IconButton | A round key, icon on the key | apps/lab/icon-button/index.html (A round key + icon, B round key + word printed below, C calculator key) | P3 keys are round or capsule, and every part keeps ≥44px hit area; P1 orange on the primary key's body only, icons never use it; P5 labels name their control (label prop is the accessible name). |
| 2026-11-01 | Checkbox | A tick printed on the key face | apps/lab/checkbox/index.html (A tick on the key, B key + lamp beside it, C latching key) | P1 selections never use orange; P4 a lit level uses ink at full step; on, off and mixed are three shapes (tick, empty, dash); P3 press drops height to 0 and the 44px row is the target. B's 8px lamp is too small to carry state as shape; C's latched key reads as disabled. |
| 2026-11-01 | Display | A segment window, unit beside the value | apps/lab/display/index.html (A segment window, B digits-only window + printed unit, C grotesk text window) | P2 the window is recessed into the body and says the state; P2 a 7-segment face for LCD values; P6 fixed positions, so tabular cells never shift. C kept as kind oled. |
| 2026-11-01 | Grille | A rectangle field, columns fill along the line | apps/lab/grille/index.html (A rectangle field, B circle field filling bottom to top, C sparse strip of large holes) | P4 grille pitch is one module step; P4 holes are the meter, lit in ink, never orange. B kept as shape circle + fill up; C breaks the pitch. |
| 2026-11-01 | Slider | A ruler fader, ticks above a narrow groove, numerals below | apps/lab/slider/index.html (A ruler fader, B channel fader, C notch rail) | P3 faders ride a groove with a ruler scale; P1 orange appears once per unit, so the cap stays plastic; P2 the narrow groove leaves the display as the deepest window. |
| 2026-11-01 | Rotary | A flat disc with one index line over a printed tick ring | apps/lab/rotary/index.html (A index-line disc, B dimple disc, C fixed pointer + turning scale) | P3 rotaries are circles with one index mark; P1 the loud control is the one round or largest part, dyed orange; B's dimple fades at 44px, C splits the orange. |
