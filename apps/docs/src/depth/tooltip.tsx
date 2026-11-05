// Usage tab for Tooltip (component-depth.md U1–U14). Tooltip is the printed name of a part.
import { Icon, IconButton, Stack, Tooltip } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const key = (label: string, side?: 'top' | 'bottom') => (
  <Tooltip content={label} side={side}><IconButton label={label}><Icon name="play" /></IconButton></Tooltip>
);

export const TOOLTIP: Depth = {
  overview: (
    <>
      <p>Tooltip prints the name of a part for a moment: “Next track” over a round key, “Set schedule” over a field. It is a small plastic tag, the same plastic as the Menu panel, with a hairline ring so it parts from the body.</p>
      <p>It shows when the pointer rests on the part, when the keyboard focuses it and when a finger is held on it. It names a part. It never explains one, and nothing the person needs can live only in it.</p>
    </>
  ),
  whenToUse: ['To name a key that shows only a symbol.', 'To give the reason a part is out of reach, in a few words.'],
  whenNot: [
    { situation: 'More than a few words, or a link, or a button', to: '/components/dialog', label: 'Dialog' },
    { situation: 'A list of actions behind a key', to: '/components/menu', label: 'Menu' },
    { situation: 'A word that must always be visible', to: '/components/text', label: 'Text' },
  ],
  variants: { na: 'Tooltip has one look, a plastic tag. Where it stands is a prop, covered under Modifiers.' },
  anatomy: {
    render: <Stack direction="row" gap="sm">{key('Next track')}</Stack>,
    parts: [
      { part: 'Tag', selector: '[data-component="Tooltip"]', what: 'A plastic plate with a hairline ring and one short soft shadow. It exists only while it shows. UNVERIFIED: this selector finds nothing until the tag is open.' },
      { part: 'Name', selector: '[data-component="Tooltip"] > span', what: 'A few words in primary ink, one line unless the screen is narrower than the name.' },
    ],
  },
  sizes: { na: 'Tooltip has one size. The tag grows to its words and stops at the reading measure.' },
  emphasis: { na: 'Tooltip is never orange, even over the unit’s orange key. The key is the loud part, the tag is printing.' },
  placement: {
    rows: [['Over a symbol-only key', 'The tag stands above the key and flips below it near the top of the screen.'], ['Over a part that cannot be pressed', 'Wrap the part in a span that takes focus so the keyboard can reach the reason.']],
    examples: [{ title: 'Over a row of transport keys', render: <Unit><Stack direction="row" gap="sm">{key('Previous track')}{key('Play')}{key('Next track')}</Stack></Unit> }],
  },
  combinations: {
    good: [['Tooltip + IconButton', 'The tag repeats the key’s name for sighted people; a screen reader hears the name once.'], ['Tooltip + Input', 'A short note on what a field is for, never its only label.']],
    avoid: [{ title: 'a Tooltip with a link inside', why: 'The tag leaves when focus moves away, so the link cannot be reached by keyboard. Use a Dialog.', render: <Unit><Tooltip content="See the manual"><IconButton label="Help"><Icon name="more" /></IconButton></Tooltip></Unit> }],
  },
  content: {
    formula: <p>Write the name of the part in two to four words, a noun or a verb first, as in <em>Next track</em> or <em>Set schedule</em>. Do not end with a full stop.</p>,
    pair: {
      do: key('Next track'), doNote: 'The part’s name, short.',
      dont: key('Press this key to skip to the next track in the queue.'), dontNote: 'A sentence that explains: it belongs on the page.',
    },
    overflow: { text: 'A long name wraps inside the reading measure and the tag grows taller. It never runs off the screen.', render: key('Move the living room lamp to the schedule for weekday evenings') },
    rtl: { text: 'In right-to-left languages the tag centres on the part the same way and its words read from the right.', render: <div dir="rtl">{key('المسار التالي')}</div> },
    expansion: { text: 'German and Finnish names can run 30% longer. The tag grows with them and stays centred on the part.', render: key('Nächster Titel in der Warteschlange') },
  },
  behaviours: {
    states: [
      ['Hidden', 'Nothing on the page.', 'The part has no description.'],
      ['Showing', 'The tag stands above or below the part.', 'The part is described by the tag, unless its aria-label already says the same words.'],
      ['Leaving', 'The tag fades and sinks back; the pointer passes through it.', 'Already removed from the description.'],
    ],
    interactions: [
      ['Pointer', 'Rest on the part', 'The tag shows after a short rest, stays while the pointer is on the part or the tag, and leaves when it moves away or the part is pressed.', 'pointerenter, pointerleave'],
      ['Keyboard', 'Tab to the part', 'The tag shows at once for keyboard focus and leaves on blur. Escape closes it and leaves focus where it was.', 'focus-visible, Escape'],
      ['Touch', 'Hold a finger on the part', 'The tag opens after half a second, the hold does not press the part, and the tag stays two seconds after the finger lifts.', 'pointerdown timer'],
      ['Screen reader', 'Focus the part', 'The tag is read as a description of the part with role="tooltip".', 'aria-describedby'],
    ],
    loading: <p>Tooltip has no loading state.</p>,
    focus: <p>Tooltip never takes focus and never moves it. Tab goes on to the next part while the tag leaves.</p>,
  },
  deepDive: { na: 'Tooltip has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'side',
      rules: <p><code>top</code> (default) stands the tag above the part and <code>bottom</code> below it. Either flips to the other side when the screen has no room.</p>,
      pair: { do: key('More', 'bottom'), doNote: 'Below a key at the top edge of a sheet.', dont: key('More', 'top'), dontNote: 'No room above at the top edge, so the tag flips on its own; ask for the side that fits.' },
    },
  ],
  related: [['/components/menu', 'Menu', 'Several actions behind one key.'], ['/components/icon-button', 'IconButton', 'The key a Tooltip most often names.'], ['/components/dialog', 'Dialog', 'Anything longer than a name.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Tooltip pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/', why: 'Role, description and Escape.' },
    { title: 'WCAG 2.2 · 1.4.13 Content on Hover or Focus', url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html', why: 'Why the tag can be dismissed, hovered and persists.' },
  ],
};
