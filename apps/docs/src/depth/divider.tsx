// Usage tab for Divider (component-depth.md U1–U14). Divider is the seam between two regions of one unit.
import { Divider, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const two = (label?: string) => (
  <Stack gap="lg">
    <Text>Heating</Text>
    <Divider label={label} />
    <Text>Lighting</Text>
  </Stack>
);
const side = (
  <Stack direction="row" gap="xl" align="stretch">
    <Text>Day</Text>
    <Divider orientation="vertical" />
    <Text>Night</Text>
  </Stack>
);

export const DIVIDER: Depth = {
  overview: (
    <>
      <p>Divider parts two regions of one unit, such as the heating part of a card from its lighting part. It is cut into the body like a panel gap: a shade edge over a lit edge, one pixel each.</p>
      <p>Leave space first. A divider is for the places where space alone does not say that two things are apart. It can carry one short word printed on the line.</p>
    </>
  ),
  whenToUse: ['To part two groups inside one unit when the gap between them is not enough.', 'To print the name of a group on the line that starts it.', 'To part two regions that sit side by side, with a vertical seam.'],
  whenNot: [
    { situation: 'Splitting a long form into numbered sections', to: '/components/stepper', label: 'Stepper' },
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
  ],
  variants: { na: 'Divider has one look, a cut seam. Orientation and the label are options, covered under Modifiers.' },
  anatomy: {
    render: two('schedule'),
    parts: [
      { part: 'Seam', selector: '[data-component="Divider"]', what: 'Two pixels in all: the divider tone above and the lit edge below.' },
      { part: 'Label', selector: '[data-component="Divider"] > span', what: 'An optional lowercase word in secondary ink, with the seam running on both sides of it.' },
    ],
  },
  sizes: { na: 'Divider has one weight, two pixels. It runs the width of its column, or the height of its row when vertical.' },
  emphasis: { na: 'A seam is never the loud part of a unit. It has no orange and no emphasis levels.' },
  placement: {
    rows: [['Between two groups on a card', 'One divider, with the gap above and below it equal.'], ['Between side-by-side regions', 'A vertical divider in a row that stretches to the taller region.']],
    examples: [{ title: 'Between two groups', render: <Unit>{two()}</Unit> }, { title: 'Between two columns', render: <Unit>{side}</Unit> }],
  },
  combinations: {
    good: [['Divider + Text', 'Two short readings, one on each side of the seam.'], ['Divider + Input', 'A printed group name on the seam, with its fields under it.']],
    avoid: [{ title: 'a divider between every row of a list', why: 'Seams repeated on every row cut the unit into strips. Let the gap part the rows and keep one seam for a real change of group.', render: <Unit><Stack gap="md"><Text>One</Text><Divider /><Text>Two</Text><Divider /><Text>Three</Text></Stack></Unit> }],
  },
  content: {
    formula: <p>Print one or two lowercase words that name the group below the seam, as in <em>schedule</em> or <em>night</em>. Do not use a sentence.</p>,
    pair: {
      do: <Divider label="night" />, doNote: 'A short lowercase word.',
      dont: <Divider label="Settings for the night schedule of this room" />, dontNote: 'A sentence on the seam pushes the line out of sight.',
    },
    overflow: { text: 'A long label stays on one line and wraps only if the column is narrower than the word. The seam shrinks first.', render: <Divider label="a longer name for a group of settings" /> },
    rtl: { text: 'In right-to-left languages the short lead sits on the right and the word follows it.', render: <div dir="rtl"><Divider label="الجدول" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The long run of the seam gives way and the word keeps its size.', render: <Divider label="Zeitplan für die Nacht" /> },
  },
  behaviours: {
    states: [
      ['Horizontal', 'A seam across the column.', 'Announced as a separator.'],
      ['Vertical', 'A seam down the row, stretched to its height.', 'Announced as a vertical separator.'],
      ['Labelled', 'A word printed on the seam.', 'The word is the separator’s name.'],
      ['Decorative', 'The same look as the others.', 'Hidden from assistive tech.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'A divider takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Announced as a separator, with its label if it has one.', 'role="separator"'],
    ],
    loading: <p>Divider has no loading state.</p>,
    focus: <p>A divider is never focused and never moves focus.</p>,
  },
  deepDive: { na: 'Divider has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'orientation',
      rules: <p><code>horizontal</code> is the default and runs across its column. <code>vertical</code> stretches to the height of its row, so put it in a row that stretches. A label is ignored when vertical.</p>,
      pair: { do: <Unit>{side}</Unit>, doNote: 'A vertical seam in a stretching row.', dont: <Unit><Stack gap="md"><Text>Day</Text><Divider orientation="vertical" /><Text>Night</Text></Stack></Unit>, dontNote: 'In a column a vertical seam has no height and disappears.' },
    },
    {
      name: 'label',
      rules: <p>Print a short lowercase word on the seam when the group below it needs a name. Without a label the seam is silent.</p>,
      pair: { do: two('schedule'), doNote: 'One word names the group.', dont: <Stack gap="lg"><Text>Heating</Text><Divider label="OR" /><Text>Lighting</Text></Stack>, dontNote: 'OR is a connector, not a group name; leave the seam bare.' },
    },
    {
      name: 'decorative',
      rules: <p>Set <code>decorative</code> when headings already name the regions, so a screen reader does not announce a separator as well.</p>,
      pair: { do: <Stack gap="lg"><Text>Heating</Text><Divider decorative /><Text>Lighting</Text></Stack>, doNote: 'The gap is only visual.', dont: <Stack gap="lg"><Text>Heating</Text><Divider label="schedule" decorative /><Text>Lighting</Text></Stack>, dontNote: 'A decorative divider drops its name, so the label is announced by no one.' },
    },
  ],
  related: [['/components/stepper', 'Stepper', 'Numbered sections of a long form.'], ['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/card', 'Card', 'A unit that holds the regions a Divider parts.']],
  references: [
    { title: 'WAI-ARIA · separator role', url: 'https://www.w3.org/TR/wai-aria-1.2/#separator', why: 'How a separator and its orientation are announced.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'Why a purely decorative seam is exempt from the 3:1 rule.' },
  ],
};
