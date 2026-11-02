// Usage tab for Icon (component-depth.md U1–U14). Icon is printing made of holes: a glyph of round dots
// on the Grille's grid, in currentColor, hidden unless it is labelled.
import { Icon, IconButton, Stack } from 'dial-react';
import type { Depth } from './types';

const Line = ({ children }: { children: React.ReactNode }) => <Stack direction="row" gap="sm" align="center">{children}</Stack>;

export const ICON: Depth = {
  overview: (
    <>
      <p>Icon prints one glyph from dial’s own set. Every glyph is a pattern of round dots on a 7 by 7 field, the same holes the Grille uses for a level, so a symbol on a key reads as part of the same perforated case. A dot is two thirds of the pitch, the Grille’s ratio of an 8px hole on a 12px pitch.</p>
      <p>A glyph is printing. It is flat, it never moves, and it takes the ink of the part it sits on through currentColor. It is hidden from assistive tech unless it has a label, because the key or the word next to it already says what it means.</p>
      <p>The status glyphs keep the lamp shapes of Badge. Warning is a triangle, critical a square, info a diamond and positive a dot. Each one prints its sign as missing dots, so the hole itself carries the meaning.</p>
    </>
  ),
  whenToUse: ['On a small round key where a word will not fit, such as play, next or close.', 'At the start of a list row, to mark the kind of device.', 'Beside a short word on the text line, such as a lock beside Front door.'],
  whenNot: [
    { situation: 'The person presses it', to: '/components/icon-button', label: 'IconButton' },
    { situation: 'A status that needs its word', to: '/components/badge', label: 'Badge' },
    { situation: 'A level or a signal that changes', to: '/components/grille', label: 'Grille' },
  ],
  variants: { na: 'Icon has one drawing system. The glyph is chosen with name, and every name uses the same dots.' },
  anatomy: {
    render: <Icon name="lock" size="lg" />,
    parts: [
      { part: 'Field', selector: '[data-component="Icon"]', what: 'A square of 7 by 7 cells, sized from the control icon tokens.' },
      { part: 'Dots', selector: '[data-component="Icon"] path', what: 'One path of round dots in currentColor, two thirds of the pitch.' },
    ],
  },
  sizes: {
    sm: { use: 'Inline with a caption or a body line, beside a word. 16px, the dots drawn at four fifths of the pitch so each holds 3:1 on a 1x screen.', pairs: 'A word in body or caption size on the same line.' },
    md: { use: 'On a 44px round key or at the start of a list row. 20px, the default.', pairs: 'IconButton md and List rows.' },
    lg: { use: 'On a 52px key or in a sparse empty place. 24px, one module step above md.', pairs: 'IconButton lg and the main key of a sheet.' },
  },
  emphasis: {
    text: <p>A glyph is quiet printing, so it never becomes the loud part of a unit. The orange key is loud because of its body, and its glyph only takes the key’s printing colour. Use one glyph per key and at most one per row.</p>,
    pair: {
      do: <IconButton label="Play" kind="primary"><Icon name="play" /></IconButton>,
      doNote: 'The key is orange, and the glyph is its printing.',
      dont: <Stack direction="row" gap="sm"><IconButton label="Play" kind="primary"><Icon name="play" /></IconButton><IconButton label="Next track" kind="primary"><Icon name="next" /></IconButton></Stack>,
      dontNote: 'Two orange keys for two glyphs. Only the main action is loud.',
    },
  },
  placement: {
    rows: [['On a round key', 'Transport, close, more and other actions everyone knows.'], ['At the start of a list row', 'The kind of device, before its name.'], ['Before a word on the text line', 'A short sign that the word explains.']],
    examples: [{ title: 'Transport keys', render: <Stack direction="row" gap="md" align="center"><IconButton label="Previous track"><Icon name="previous" /></IconButton><IconButton label="Pause" kind="primary"><Icon name="pause" /></IconButton><IconButton label="Next track"><Icon name="next" /></IconButton></Stack> }],
  },
  combinations: {
    good: [['Icon + IconButton', 'The key has the label, the glyph is hidden.'], ['Icon + a word', 'The word says it, the glyph helps the eye find it.']],
    avoid: [{ title: 'two glyphs for one meaning', why: 'A word already explains the lock. A second glyph only adds printing to read.', render: <Line><Icon name="lock" size="sm" /><Icon name="check" size="sm" /><span>Front door locked</span></Line> }],
  },
  content: {
    formula: <p>A label says what the glyph means in this place, such as <em>Strong signal</em> or <em>Battery half full</em>. It never names the drawing, so <em>Signal bars icon</em> is wrong. Leave the label out when a word beside the glyph says the same.</p>,
    pair: {
      do: <Icon name="battery" size="sm" label="Battery half full" />, doNote: 'Says the reading.',
      dont: <Icon name="battery" size="sm" label="Battery icon" />, dontNote: 'Names the drawing and leaves out the reading.',
    },
    overflow: { text: 'A glyph never shrinks. When the word beside it wraps, the glyph stays on the first line at its full size.', render: <div data-overflow-demo="" style={{ inlineSize: 160 }}><Stack direction="row" gap="sm" align="start"><Icon name="warning" size="sm" /><span>Water tank almost empty, fill it before the next wash</span></Stack></div> },
    rtl: { text: 'In right-to-left pages the glyph moves to the right of the word and keeps its own drawing, so play still points the way the tape runs.', render: <div dir="rtl"><Line><Icon name="lock" size="sm" /><span>الباب الأمامي مقفل</span></Line></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The word grows sideways and the glyph keeps its size.', render: <Line><Icon name="clock" size="sm" /><span>Heizung schaltet um 06:30 Uhr ein</span></Line> },
  },
  behaviours: {
    states: [
      ['Hidden', 'With no label the glyph has aria-hidden and is never focusable.', 'The key or the word next to it gives the meaning.'],
      ['Named', 'With a label the glyph is role img with that name.', 'Use it when the glyph stands alone and means something.'],
      ['Changing', 'A new name prints the new pattern at once.', 'Nothing fades, pulses or turns.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Skips the glyph, because it is printing.', 'focusable="false"'],
      ['Screen reader', 'Read', 'Hidden glyphs are skipped. A labelled glyph is read as an image with its label.', 'aria-hidden or role="img"'],
      ['Forced colours', 'View', 'The dots take the system text colour through currentColor.', 'currentColor'],
    ],
    loading: <p>A glyph has no loading state. While a device reports, show its glyph as usual and let the word say Checking.</p>,
    focus: <p>Icon never takes focus. Put it on an IconButton when the person should press it.</p>,
  },
  deepDive: { na: 'Icon has one drawing system and no kinds to compare. The sizes are covered above.' },
  modifiers: [
    {
      name: 'label',
      rules: <p>Makes the glyph an image with a name. Use it only when the glyph stands alone and carries meaning, such as a signal reading beside a device name. On a key, the key’s label names the action and the glyph stays hidden.</p>,
      pair: {
        do: <Line><span>Hall speaker</span><Icon name="signal" size="sm" label="Strong signal" /></Line>, doNote: 'The glyph is the only place the reading appears.',
        dont: <IconButton label="Close"><Icon name="close" label="Close" /></IconButton>, dontNote: 'The name is read twice, once for the key and once for the glyph.',
      },
    },
  ],
  related: [['/components/icon-button', 'IconButton', 'A round key that prints a glyph.'], ['/components/badge', 'Badge', 'A status lamp and a word.'], ['/components/grille', 'Grille', 'The same holes, as a meter.']],
  references: [
    { title: 'WCAG 2.2 · 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html', why: 'Why a decorative glyph is hidden and a meaningful one is named.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'Why the dots grow at 16px to keep 3:1.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
