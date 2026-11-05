// Usage tab for Center (component-depth.md U1–U14). Center is a layout primitive with no form of its own.
import { Button, Center, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) => (
  <div className="demo-box demo-full" style={tall ? { blockSize: 'var(--ds-space-24)' } : undefined}>{children}</div>
);

export const CENTER: Depth = {
  overview: (
    <>
      <p>Center puts its children in the middle of the box it is given. It centres on both axes, along the line only or from top to bottom only, and it can cap its inline size at a container width.</p>
      <p>It has no look of its own. Use it for a lone part such as an empty-state message or a single key, where the part should hold one place in the box.</p>
    </>
  ),
  whenToUse: ['To place one part in the middle of a box of fixed height.', 'To hold a short note or a form at a readable width in a wide page.'],
  whenNot: [
    { situation: 'Space between siblings', to: '/components/stack', label: 'Stack' },
    { situation: 'The page margin and width of a whole page', to: '/components/container', label: 'Container' },
  ],
  variants: { na: 'Center has no variants. The axis and the size are props, covered under Modifiers.' },
  anatomy: {
    render: <Unit tall><Center><Text>No rooms yet</Text></Center></Unit>,
    parts: [
      { part: 'Root', selector: '[data-component="Center"]', what: 'A flex column that centres its children and holds an optional maximum width.' },
    ],
  },
  sizes: { na: 'Center has no sizes. Its optional cap uses the container tokens, sm to 2xl.' },
  emphasis: { na: 'Center has no emphasis. It draws nothing and nothing in it is orange unless you put the one primary key there.' },
  placement: {
    rows: [['Inside a box of fixed height', 'Centring on both axes needs a parent with a height, or there is no room to centre in.'], ['Inside a Container', 'Cap the width with size so the part lines up with the page.']],
    examples: [{ title: 'An empty unit', render: <Unit tall><Center><Stack gap="md" align="center"><Text>Nothing is scheduled</Text><Button kind="primary">Add a schedule</Button></Stack></Center></Unit> }],
  },
  combinations: {
    good: [['Center + Stack', 'A Stack inside a Center keeps its own gaps while the pair sits in the middle.'], ['Center + Container', 'The Container holds the page, the Center holds one part inside it.']],
    avoid: [{ title: 'Center around a long form', why: 'Centred text is hard to scan over many lines. Keep Center for short content.', render: <Unit><Center axis="inline"><Text>A short note reads well in the middle.</Text></Center></Unit> }],
  },
  content: {
    formula: <p>Keep what you centre short: a line, a note or a single key. Long text reads better from the start edge.</p>,
    pair: {
      do: <Unit tall><Center><Text>No rooms yet</Text></Center></Unit>, doNote: 'One short line in the middle.',
      dont: <Unit><Center axis="inline"><Text>Rooms group your devices so a schedule can switch them together, and you can add as many as you need from the menu at the top.</Text></Center></Unit>, dontNote: 'A long paragraph centred line by line.',
    },
    overflow: { text: 'A long child wraps inside the box. The Center never grows wider than its parent.', render: <Unit><Center axis="inline" size="sm"><Text>A long line wraps once it meets the cap and stays in the middle of the box.</Text></Center></Unit> },
    rtl: { text: 'Centring has no direction, so a right-to-left page looks the same. The margin is logical.', render: <div dir="rtl"><Unit><Center axis="inline"><Text>لا توجد غرف بعد</Text></Center></Unit></div> },
    expansion: { text: 'Longer translated text wraps inside the cap and stays centred.', render: <Unit><Center axis="inline" size="sm"><Text>Noch keine Räume vorhanden, fügen Sie den ersten hinzu</Text></Center></Unit> },
  },
  behaviours: {
    states: [['Default', 'The only state. Center draws nothing and has no hover or focus.', 'It adds no role and no label.']],
    interactions: [
      ['Keyboard', 'Tab', 'Center takes no focus. Controls inside it keep their own keys.', 'native'],
      ['Screen reader', 'Read', 'Center adds nothing to the reading order.', 'div'],
    ],
    loading: <p>Center has no loading state.</p>,
    focus: <p>Center never moves or traps focus.</p>,
  },
  deepDive: { na: 'Center has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'axis',
      rules: <p><code>both</code> is the default and fills the height of the parent. <code>inline</code> centres along the line and keeps the top edge. <code>block</code> centres from top to bottom and keeps the start edge.</p>,
      pair: { do: <Unit tall><Center axis="both"><Text>Centred</Text></Center></Unit>, doNote: 'The parent has a height to centre in.', dont: <Unit><Center axis="both"><Text>No height</Text></Center></Unit>, dontNote: 'The parent has no set height, so nothing moves vertically.' },
    },
    {
      name: 'size',
      rules: <p>A container token, <code>sm</code> to <code>2xl</code>, caps the inline size. Leave it unset for no cap.</p>,
      pair: { do: <Unit><Center axis="inline" size="sm"><Text>A short note under a cap.</Text></Center></Unit>, doNote: 'The cap keeps the line short.', dont: <Unit><Center axis="inline" size="2xl"><Text>A short note under the widest cap.</Text></Center></Unit>, dontNote: 'The cap is wider than the note, so it does nothing.' },
    },
  ],
  related: [['/components/container', 'Container', 'The page width and margin.'], ['/components/stack', 'Stack', 'Space between siblings.'], ['/components/empty-state', 'EmptyState', 'A finished message for an empty unit.']],
  references: [
    { title: 'MDN · Box alignment in flexbox', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_alignment/Box_alignment_in_flexbox', why: 'How centring on each axis works.' },
    { title: 'Every Layout · The Center', url: 'https://every-layout.dev/layouts/center/', why: 'The layout pattern and its measure cap.' },
    { title: 'MDN · CSS logical properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values', why: 'Why the margin and cap use inline and block names.' },
  ],
};
