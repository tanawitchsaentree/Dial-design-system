# FORM — dial

Read from the reference (Braun / Ulm appliances, `system/refs/ref-01.png` when it lands; estimated from
chat until then) for form only. One material: **matte ABS** (`material.height` 5px, `material.unit-height`
3px, `material.rough` 3px, `material.gloss` 0.2), one light top-left. Mechanisms from
`docs/style-recipes/tactile.md`; spring `mechanism.mass` 1.4 / `stiffness` 520 / `damping` 46
(ζ ≈ 0.85, settle ≈ 245ms). Locked as D-003.

## Class table

| Class | Members (wave 1) | Silhouette | Depth | Corner | Label | Pressed |
|---|---|---|---|---|---|---|
| **control** | Button, IconButton, Switch, Checkbox, Slider, Rotary, SegmentedControl, Tabs, Chip | round key (44px disc) or capsule key; rotary = disc with one index mark over a tick ring; fader = cap in a recessed groove; rocker = two faces on a pivot | raised `elevation.part` (offset = height × light) | disc / `corner.round`; caps `corner.media` | printed beside or below the part, never inside it, except a capsule key's word | height → 0 in `motion.press` (65ms), shadow collapses under the part, part moves `motion.press-travel`; returns on the spring |
| **input** | Input, Select | recessed well, full width of its column | `elevation.well` (inverse light) | `corner.media` | label printed above on the inset line | none; focus = ring |
| **surface** | Card, DeviceCard, Dialog, Toast | rounded rectangle body | `elevation.unit` (unit height 3px); Dialog/Toast `elevation.float` | radius = `corner.unit-ratio` × short side, capped at `corner.panel`; inner = outer − inset | wordmark bottom-left, model name lowercase bottom-right (DeviceCard) | none |
| **display** | Display (LCD, OLED), Grille, Progress, Badge, Text, Heading | window recessed into the body; grille = field of recessed holes; badge = printed lamp + word | `elevation.well`; text and badges flat (printing) | window nests in the body | value right-aligned in LCD, unit beside it | none |
| **separator** | Divider (via `line.divider`) | a seam, 1px | none | — | — | — |

## NEVER rules

- **control:** never a flat pill with intent fills (primary/secondary/tertiary colours); never more than one orange control in a unit; never a drag-only knob without keys, value and label.
- **input:** never a bordered 8px rectangle floating on the page; never a placeholder used as the label.
- **surface:** never a white rectangle with a 12–16px radius and a soft drop shadow from straight above; never a second light direction; never a gradient body.
- **display:** never glow on LCD segments; never orange in a grille or a meter; never status told by colour alone (lamp + word).
- **separator:** never a hard dark rule between regions of one unit; gaps first.

## Gaps found

- No icon set yet: wave 1 uses a minimal stroke set drawn on the 2px printing stroke (`width.ring`).
- No 7-segment font: Display draws segments as SVG (lab `apps/lab/anchor/anchor.js`).
