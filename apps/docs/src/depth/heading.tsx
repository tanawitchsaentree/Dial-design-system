// Usage tab for Heading (component-depth.md U1–U14). Heading is the largest printing on a unit or a page.
import { Heading, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const HEADING: Depth = {
  overview: (
    <>
      <p>Heading names a page, a section, a unit or a group. It is the same printing as Text, in the same grey ink, only larger and always in the medium weight. It sits first on the top inset line of whatever it names.</p>
      <p>The level sets both the element and the size. Level 1 is the page title, level 2 a section such as a room, level 3 one unit, level 4 a group inside a unit or a sheet. Screen reader users move through a page by these levels, so pick the level by structure.</p>
    </>
  ),
  whenToUse: ['For the title of a page, once.', 'To name a section, such as a room on a home screen.', 'To name a unit or a sheet.', 'To name a group of settings inside a sheet.'],
  whenNot: [
    { situation: 'The name of a control or a reading', to: '/components/text', label: 'Text' },
    { situation: 'The live state of a device', to: '/components/display', label: 'Display' },
  ],
  variants: { na: 'Heading has one look: medium weight and primary ink. Level picks the size and the element, and is described under Modifiers.' },
  anatomy: {
    render: <Heading level={3}>Living room heater</Heading>,
    parts: [{ part: 'Printed name', selector: '[data-component="Heading"]', what: 'An h1 to h4 element in medium weight, primary ink and tight leading, with no outer margin.' }],
  },
  sizes: { na: 'Heading has no size prop. Each level has its own size, from 37px at level 1 to 18px at level 4.' },
  emphasis: {
    text: <p>One level 1 per page. Inside a unit, one heading at most, so the unit reads as one appliance. A heading is never orange and never tinted: size and position make it loud enough.</p>,
    pair: {
      do: <Unit><Stack gap="xs"><Heading level={3}>Washer</Heading><Text size="label" tone="secondary">38 min left</Text></Stack></Unit>,
      doNote: 'One heading names the unit and a note sits under it.',
      dont: <Unit><Stack gap="xs"><Heading level={3}>Washer</Heading><Heading level={3}>38 min left</Heading></Stack></Unit>,
      dontNote: 'A second heading for a detail competes with the name.',
    },
  },
  placement: {
    rows: [['Top of the page', 'Level 1, the page title.'], ['Top of a section', 'Level 2, such as a room.'], ['Top inset line of a unit', 'Level 3, the name of the device.'], ['Inside a sheet', 'Level 4, the name of a group of settings.']],
    examples: [{ title: 'On a unit', render: <Unit><Stack gap="sm"><Heading level={3}>Bedroom heater</Heading><Text size="label" tone="secondary" numeric>19.0° · eco from 22:30</Text></Stack></Unit> }],
  },
  combinations: {
    good: [['Heading + secondary Text', 'A name with one line of detail under it.'], ['Level 2 + several level 3', 'A room and the units in it.']],
    avoid: [{ title: 'skipping levels', why: 'A level 4 straight under a level 2 leaves a gap in the outline that screen reader users hear.', render: <Stack gap="sm"><Heading level={2}>Kitchen</Heading><Heading level={4}>Hob light</Heading></Stack> }],
  },
  content: {
    formula: <p>A noun or a short name in sentence case, with no full stop: <em>Living room</em>, <em>Heater settings</em>, <em>Night setback</em>.</p>,
    pair: {
      do: <Heading level={3}>Heater settings</Heading>, doNote: 'Sentence case and a plain name.',
      dont: <Heading level={3}>Configure Your Heater Settings Here</Heading>, dontNote: 'Title case and extra words.',
    },
    overflow: { text: 'A long heading wraps onto the next line and keeps its tight leading. A long word breaks inside the column.', render: <div data-overflow-demo style={{ inlineSize: 200, overflowWrap: 'anywhere' }}><Heading level={3}>Kitchen extractor hood boost schedule</Heading></div> },
    rtl: { text: 'In right-to-left languages the heading starts on the right.', render: <div dir="rtl"><Heading level={3}>غرفة المعيشة</Heading></div> },
    expansion: { text: 'German and Finnish names run about 30% longer and wrap within the column.', render: <Heading level={3}>Wohnzimmerheizung Einstellungen</Heading> },
  },
  behaviours: {
    states: [['Rest', 'Flat ink on the surface, with no shadow and no outline.', 'Heading has no hover, focus or pressed state.']],
    interactions: [
      ['Screen reader', 'Headings list', 'Lists the heading at its level, so users can jump to it.', 'h1–h4'],
      ['Screen reader', 'Read', 'Announced as a heading with its level.', 'role heading'],
    ],
    loading: <p>Heading has no loading state. Print the name as soon as it is known. It does not wait for the device.</p>,
    focus: <p>Heading never takes focus by itself. When a page opens, the docs shell moves focus to the page’s level 1.</p>,
  },
  deepDive: { na: 'Heading has a single variant, so there is no per-variant deep dive.' },
  modifiers: [
    {
      name: 'level',
      rules: <p>Pick the level by structure first. 1 is the page title (37px), 2 a section (26px), 3 a unit (22px, the default), 4 a group inside a unit or a sheet (18px).</p>,
      pair: { do: <Stack gap="sm"><Heading level={2}>Kitchen</Heading><Heading level={3}>Hob light</Heading></Stack>, doNote: 'A room, then a unit inside it.', dont: <Stack gap="sm"><Heading level={3}>Kitchen</Heading><Heading level={2}>Hob light</Heading></Stack>, dontNote: 'The unit is louder than the room it sits in.' },
    },
  ],
  related: [['/components/text', 'Text', 'Labels, notes and prose.'], ['/components/display', 'Display', 'The live state of the device.']],
  references: [
    { title: 'WAI · Headings tutorial', url: 'https://www.w3.org/WAI/tutorials/page-structure/headings/', why: 'How heading levels build the outline of a page.' },
    { title: 'WCAG 2.2 · 1.3.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html', why: 'Why the level is a real h1 to h4 element.' },
    { title: 'Vitsœ · Dieter Rams: ten principles for good design', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
