// Usage tab for Spacer (component-depth.md U1–U14). Spacer is empty room of a token size, or room that takes what is left.
import { Button, Spacer, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const rowEnd = (flexible: boolean) => (
  <Stack direction="row" align="center">
    <Text>Heating</Text>
    {flexible ? <Spacer axis="inline" flexible /> : null}
    <Button kind="primary">Save</Button>
  </Stack>
);

export const SPACER: Depth = {
  overview: (
    <>
      <p>Spacer leaves room where a layout needs it. A fixed spacer is one step of the 4px scale, the same five steps a Stack gap uses. A flexible spacer takes whatever room is left, so the part after it lands at the far end of the row or column.</p>
      <p>It draws nothing and is hidden from assistive tech. Use it when the gap between parts is not the same all the way along, such as a label at one end and a key at the other.</p>
    </>
  ),
  whenToUse: ['To push one part to the far end of a row or column.', 'To leave one extra step between two parts where the Stack gap is too small.'],
  whenNot: [
    { situation: 'The same gap between every child', to: '/components/stack', label: 'Stack' },
    { situation: 'Parting two groups with a visible line', to: '/components/divider', label: 'Divider' },
  ],
  variants: { na: 'Spacer has one look, which is no look. Its direction and whether it grows are props, covered under Modifiers.' },
  anatomy: {
    render: rowEnd(true),
    parts: [{ part: 'Room', selector: '[data-component="Spacer"]', what: 'An empty box of a token size that draws nothing and takes no focus.' }],
  },
  sizes: {
    xs: { use: '4px. One step, the pitch of the grille holes.', pairs: 'Tight pairs such as a lamp and its word.' },
    sm: { use: '8px. A label and the part it names.', pairs: 'Text and the field below it.' },
    md: { use: '16px. The default. Neighbouring parts in one face.', pairs: 'Rows of keys and display windows.' },
    lg: { use: '24px. One unit from the next.', pairs: 'Units on a home screen.' },
    xl: { use: '32px. Groups of units, such as rooms.', pairs: 'Section heads and the units under them.' },
  },
  emphasis: { na: 'Spacer draws nothing, so it has no emphasis. It is never orange.' },
  placement: {
    rows: [['Between a label and a key', 'A flexible spacer in the row pushes the key to the end.'], ['Inside a tall unit', 'A flexible spacer in the column keeps the main key at the foot.']],
    examples: [{ title: 'Label at the start, key at the end', render: <Unit>{rowEnd(true)}</Unit> }],
  },
  combinations: {
    good: [['Spacer + Stack', 'Stack sets the usual gap and a Spacer adds room at the one place that needs more.'], ['Spacer + Button', 'A flexible spacer puts the orange key at the end of the row.']],
    avoid: [{ title: 'a Spacer in place of a Stack gap', why: 'Spacers between every child repeat what the gap does and have to be edited one by one.', render: <Unit><Text>Heating</Text><Spacer /><Text>Lighting</Text><Spacer /><Text>Fans</Text></Unit> }],
  },
  content: {
    formula: <p>Spacer holds no content. Give it a size and leave the children out.</p>,
    pair: {
      do: <Unit>{rowEnd(true)}</Unit>, doNote: 'Room is set by a prop.',
      dont: <Unit><Text>Heating</Text><Text>{'      '}</Text><Text>Lighting</Text></Unit>, dontNote: 'Blank characters stand in for room and read out as nothing.',
    },
    overflow: { text: 'A flexible spacer gives way first. When the row is too narrow it shrinks to its size and the parts wrap.', render: <div style={{ inlineSize: 'var(--ds-space-32)' }}>{rowEnd(true)}</div> },
    rtl: { text: 'In right-to-left languages the room runs from the right, so the key lands at the left end.', render: <div dir="rtl"><Stack direction="row" align="center"><Text>التدفئة</Text><Spacer axis="inline" flexible /><Button kind="primary">حفظ</Button></Stack></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. A flexible spacer takes what remains and the key does not move.', render: <Stack direction="row" align="center"><Text>Heizungssteuerung</Text><Spacer axis="inline" flexible /><Button kind="primary">Speichern</Button></Stack> },
  },
  behaviours: {
    states: [['Fixed', 'The box keeps its token size on the chosen axis.', 'Hidden from assistive tech.'], ['Flexible', 'The box grows to take the room that is left.', 'Hidden from assistive tech.']],
    interactions: [
      ['Keyboard', 'Tab', 'A spacer takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Skipped, because it is aria-hidden.', 'aria-hidden'],
    ],
    loading: <p>Spacer has no loading state.</p>,
    focus: <p>Spacer is never focused and never moves focus.</p>,
  },
  deepDive: { na: 'Spacer has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'flexible',
      rules: <p><code>flexible</code> makes the spacer grow to fill the room that is left, with <code>size</code> as the least it keeps. Set <code>axis</code> to <code>inline</code> in a row. The parent must be a flex container, or there is nothing to grow into.</p>,
      pair: { do: <Unit>{rowEnd(true)}</Unit>, doNote: 'The key lands at the end of the row.', dont: <Unit>{rowEnd(false)}</Unit>, dontNote: 'No spacer, so the key sits next to the label.' },
    },
    {
      name: 'axis',
      rules: <p><code>block</code> (the default) leaves room in a column. <code>inline</code> leaves room in a row. Match it to the direction of the parent.</p>,
      pair: { do: <Unit><Stack direction="row" align="center"><Text>Day</Text><Spacer axis="inline" size="xl" /><Text>Night</Text></Stack></Unit>, doNote: 'Inline room in a row.', dont: <Unit><Stack direction="row" align="center"><Text>Day</Text><Spacer size="xl" /><Text>Night</Text></Stack></Unit>, dontNote: 'Block room in a row adds height and no width.' },
    },
  ],
  related: [['/components/stack', 'Stack', 'The same gap between every child.'], ['/components/divider', 'Divider', 'A visible seam between groups.'], ['/components/container', 'Container', 'The page margin and width.']],
  references: [
    { title: 'MDN · flex-grow', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow', why: 'How a flexible spacer takes the room that is left.' },
    { title: 'WAI-ARIA · aria-hidden', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-hidden', why: 'Why an empty box is hidden from assistive tech.' },
  ],
};
