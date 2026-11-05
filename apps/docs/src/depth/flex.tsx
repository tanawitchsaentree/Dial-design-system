// Usage tab for Flex (component-depth.md U1–U14). Flex is a layout primitive: one line, a token gap, alignment and distribution.
import { Flex, FlexItem, Stack } from 'dial-react';
import type { Depth } from './types';

const Chip = ({ children }: { children: React.ReactNode }) => <span className="demo-chip">{children}</span>;
const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const three = (props: React.ComponentProps<typeof Flex> = {}) => (
  <Flex gap="sm" {...props}>
    <Chip>One</Chip>
    <Chip>Two</Chip>
    <Chip>Three</Chip>
  </Flex>
);

export const FLEX: Depth = {
  overview: (
    <>
      <p>Flex lays its children along one line, with a gap from the same five steps as Stack. On top of Stack it adds <code>justify</code>, a baseline alignment, an opt-in <code>wrap</code> and an inline form. FlexItem gives one child the spare room, or keeps it at full size.</p>
      <p>Use Stack when you only need the space between things. Use Flex when the line has to spread, push a part to the far end or let one part grow.</p>
    </>
  ),
  whenToUse: ['A row where one part grows and the others keep their size, such as a title between two keys.', 'A row with the first part at one end and the last at the other.', 'A line of text-like parts that must align on a baseline.'],
  whenNot: [
    { situation: 'Only the space between siblings', to: '/components/stack', label: 'Stack' },
    { situation: 'Parts that must line up in columns on a page', to: '/components/grid', label: 'Grid' },
  ],
  variants: { na: 'Flex has no variant prop. Direction, wrap, gap, align and justify are layout choices, covered under Modifiers.' },
  anatomy: {
    render: <Unit>{three()}</Unit>,
    parts: [
      { part: 'Container', selector: '[data-component="Flex"]', what: 'A flex box in row or column direction. It does not wrap unless asked.' },
      { part: 'Gap', selector: '[data-component="Flex"] > *', what: 'stack.gap, xs 4px to xl 32px, between every pair of children.' },
    ],
  },
  sizes: { na: 'Flex has no size prop. Its gap picks from the spacing scale, shown under Modifiers.' },
  emphasis: { na: 'Flex is invisible. It has no emphasis and paints nothing, so it never carries orange.' },
  placement: {
    rows: [['A title between two keys', 'A row, align center, with the title in a growing FlexItem.'], ['A footer with a key at each end', 'A row with justify between.']],
    examples: [
      { title: 'Title between keys', render: <Unit><Flex gap="sm" align="center"><FlexItem shrink={false}><Chip>Back</Chip></FlexItem><FlexItem grow>Living room</FlexItem><FlexItem shrink={false}><Chip>Next</Chip></FlexItem></Flex></Unit> },
      { title: 'Ends apart', render: <Unit><Flex justify="between" align="center"><Chip>Cancel</Chip><Chip>Save</Chip></Flex></Unit> },
    ],
  },
  combinations: {
    good: [['Flex + FlexItem', 'One growing child between two that keep their size.'], ['Flex + Stack', 'A Stack for a column of fields, a Flex for the row of keys under it.']],
    avoid: [{ title: 'a Flex used only for a gap', why: 'A column with a gap and nothing else is a Stack. Flex there says more than it does, and the next reader looks for the justify it does not use.', render: <Unit><Flex direction="column" gap="md"><Chip>One</Chip><Chip>Two</Chip></Flex></Unit> }],
  },
  content: {
    formula: <p>Flex holds no words of its own. Keep each child short enough to share the line, and let the one that can be long be the one that grows.</p>,
    pair: {
      do: <Unit><Flex gap="sm" align="center"><FlexItem grow>Living room</FlexItem><Chip>Edit</Chip></Flex></Unit>, doNote: 'The long name grows and the key keeps its size.',
      dont: <Unit><Flex gap="sm" align="center"><span>Living room</span><Chip>Edit</Chip></Flex></Unit>, dontNote: 'Without a growing child the key stays next to the name instead of at the end.',
    },
    overflow: { text: 'A child shrinks until its content fits, then the text wraps. Set shrink to false on a key so its target holds.', render: <div style={{ inlineSize: 'calc(var(--ds-space-24) + var(--ds-space-24))' }}><Flex gap="sm" align="center"><FlexItem grow>A long room name that needs two lines</FlexItem><FlexItem shrink={false}><Chip>Edit</Chip></FlexItem></Flex></div> },
    rtl: { text: 'Row direction follows the writing direction, so the first child sits on the right in right-to-left languages. Start and end are logical.', render: <div dir="rtl"><Unit><Flex justify="between"><Chip>الأول</Chip><Chip>الأخير</Chip></Flex></Unit></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. With wrap on, the last child drops to a new line instead of squeezing the others.', render: <Unit><Flex wrap gap="sm"><Chip>Heizungsplan</Chip><Chip>Beleuchtung</Chip><Chip>Rollladensteuerung</Chip></Flex></Unit> },
  },
  behaviours: {
    states: [
      ['Row', 'Children along the inline axis.', 'Read in DOM order.'],
      ['Column', 'Children stacked.', 'Read in DOM order.'],
      ['Wrap', 'A full line breaks to a new line.', 'Read in DOM order.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Flex takes no focus. Tab follows the DOM order of its children.', 'native'],
      ['Screen reader', 'Read', 'Flex adds no role. Its children are read in DOM order.', 'none'],
    ],
    loading: <p>Flex has no loading state.</p>,
    focus: <p>Flex is never focused. Reversed directions are not offered, so the focus order always matches what you see.</p>,
  },
  deepDive: { na: 'Flex has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'direction',
      rules: <p><code>row</code> is the default. <code>column</code> stacks the children. Reversed directions are left out on purpose: they move children on screen but not in the focus order.</p>,
      pair: { do: <Unit>{three()}</Unit>, doNote: 'Row for parts that sit side by side.', dont: <Unit>{three({ direction: 'column', align: 'stretch' })}</Unit>, dontNote: 'A column of three chips stretches them. Use Stack for plain columns.' },
    },
    {
      name: 'wrap',
      rules: <p>Off by default, so a line stays one line. Turn it on for groups of tags or keys that may outgrow the line.</p>,
      pair: { do: <Unit><Flex wrap gap="sm"><Chip>Layout</Chip><Chip>Spacing</Chip><Chip>Tokens</Chip><Chip>Themes</Chip><Chip>Motion</Chip><Chip>Typography</Chip></Flex></Unit>, doNote: 'Tags wrap to a second line.', dont: <div style={{ inlineSize: 'calc(var(--ds-space-24) + var(--ds-space-16))', overflow: 'hidden' }}>{three({ gap: 'lg' })}</div>, dontNote: 'Without wrap the line overflows its box and is cut off.' },
    },
    {
      name: 'gap',
      rules: <p>Five steps: xs 4px, sm 8, md 16, lg 24 and xl 32. Put the space in the gap and never as a margin on a child.</p>,
      pair: { do: <Unit><Stack gap="md">{(['xs', 'md', 'xl'] as const).map((g) => three({ key: g, gap: g }))}</Stack></Unit>, doNote: 'Three gaps from the scale.', dont: <Unit><Flex gap="sm"><span style={{ marginInlineEnd: 'var(--ds-space-4)' }}><Chip>One</Chip></span><Chip>Two</Chip></Flex></Unit>, dontNote: 'A margin on one child makes the spacing uneven.' },
    },
    {
      name: 'align and justify',
      rules: <p><code>align</code> places children across the line: start, center, end, stretch or baseline. <code>justify</code> spreads them along it: start, center, end or between. A FlexItem can override align for itself.</p>,
      pair: { do: <Unit><Flex justify="between" align="center"><Chip>Cancel</Chip><Chip>Save</Chip></Flex></Unit>, doNote: 'Keys at both ends, centred on the line.', dont: <Unit><Flex gap="md"><Chip>Cancel</Chip><Chip>Save</Chip></Flex></Unit>, dontNote: 'Both keys bunch at the start and the ends of the unit are empty.' },
    },
    {
      name: 'asChild and inline',
      rules: <p><code>asChild</code> makes the one child element the container, such as a <code>nav</code> or a <code>section</code>, so the markup stays meaningful. <code>inline</code> makes the container sit in a line of text.</p>,
      pair: { do: <Unit><Flex asChild gap="sm"><nav aria-label="Rooms"><Chip>One</Chip><Chip>Two</Chip></nav></Flex></Unit>, doNote: 'A real nav, laid out as a row.', dont: <Unit><Flex gap="sm"><div><Chip>One</Chip></div><div><Chip>Two</Chip></div></Flex></Unit>, dontNote: 'A div hides that these are navigation.' },
    },
  ],
  related: [['/components/stack', 'Stack', 'Only the space between siblings.'], ['/components/grid', 'Grid', 'Parts that line up in columns on a page.'], ['/components/container', 'Container', 'The page width that holds a Flex.']],
  references: [
    { title: 'MDN · CSS flexible box layout', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout', why: 'What grow, shrink, align and justify do.' },
    { title: 'WCAG 2.2 · 1.3.2 Meaningful Sequence', url: 'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html', why: 'Why reversed directions are not offered.' },
  ],
};
