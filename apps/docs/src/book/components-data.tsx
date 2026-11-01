// Component chapters. The prose half of each page. Everything else on a component page is
// generated: props (meta.json, react-docgen-typescript), demo floor (meta.json), tokens used (the
// CSS module), keyboard verification (conformance.json), contrast (evidence.json).
// Examples are real files in ../examples, rendered and shown as source from the same module.
import type { ComponentType, ReactNode } from 'react';
import { Link } from './kit';

const MODS = import.meta.glob('../examples/*.tsx', { eager: true }) as Record<string, { default: ComponentType }>;
const SRCS = import.meta.glob('../examples/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface ExampleRef { file: string; title: string; intro: string; Render: ComponentType; code: string; plain?: boolean; backdrop?: 'field' }
// backdrop 'field': a structure diagram whose labels are measured on the plain Field, never on a photo (D-019)
const ex = (file: string, intro: string, plain?: boolean, backdrop?: 'field'): ExampleRef => {
  const key = `../examples/${file}.tsx`;
  if (!MODS[key]) throw new Error(`example ${file} is listed in a chapter but examples/${file}.tsx does not exist`);
  const code = SRCS[key] ?? '';
  return { file, title: code.match(/^\/\/ @example (.*)$/m)?.[1] ?? file, intro, Render: MODS[key].default, code, plain, backdrop };
};

export interface ComponentChapter {
  name: string;
  slug: string;
  purpose: string; // verb-first, one sentence (content-model point 1)
  importLine: string;
  overview: ReactNode;
  hero: ExampleRef;
  ladder: ExampleRef[]; // one per variant dimension + states + compositions
  whenToUse: string[];
  whenNotToUse: Array<[string, string]>;
  anatomy: Array<[string, string]>;
  states?: Array<[string, string]>;
  content: string[];
  dodont: Array<{ do: string; dont: string }>;
  a11y: string[];
  keyboard?: Array<[string, string, string]>; // key · does · conformance check that proves it
  inherits?: string;
  usage: string; // short, copy-ready snippet
  status: 'alpha' | 'beta' | 'stable'; // see /reference/status for what each one requires
  limitations: string[]; // what it does not do yet (Polaris and MUI keep this list on every page)
  youMust: string[]; // accessibility work left to the app (Primer: implementation requirements)
  backdrops: string; // what changes between themes and between the system's backdrops
  related: Array<[string, string, string]>; // path · label · "use it instead when…"
}

export const COMPONENTS: ComponentChapter[] = [
  {
    name: 'Container',
    slug: 'container',
    status: 'beta',
    limitations: ['It sets width and margins only. It does not centre content vertically.', 'There is no full-bleed escape hatch for one child.'],
    youMust: ['Wrap each page region once. Containers inside containers double the margins.', 'Choose a size from the reading width you need, not from the screen.'],
    usage: '<Container size="lg">…</Container>',
    backdrops: 'Container paints nothing, so it looks the same in both themes and on every backdrop. What changes is whatever sits inside it.',
    purpose: 'Centres a page or region at a maximum width, with the responsive page margin on both sides.',
    importLine: "import { Container } from 'dial-react';",
    overview: (
      <>
        <p>The outer frame of a page. <code>Container</code> caps its content at one of five widths and adds <code>layout.margin</code> on both sides. 16px on phones, 32px from md (768px), 48px from lg (1024px). The margin and the widths are tokens; the breakpoints come from the token build, so nothing here is typed twice.</p>
        <p>Use it once per page body and let <Link to="/components/grid">Grid</Link> divide what is inside.</p>
      </>
    ),
    hero: ex('ContainerPage', 'The page body here is centred at lg with the responsive margin.', true),
    ladder: [
      ex('ContainerSizes', 'Each outline shows one maximum width. sm is 640px, md 768, lg 1024, xl 1200 (the default) and 2xl 1440.', true),
      ex('ContainerReading', 'For long reading, size sm keeps lines near 60 to 75 characters.', true),
      ex('ContainerWithGrid', 'Container around a Grid is the usual page frame.', true),
    ],
    whenToUse: ['The body of every page.', 'A region that must not stretch on very wide screens (a form, an article).'],
    whenNotToUse: [['Spacing between siblings', 'Stack. Gaps belong to the parent'], ['Columns', 'Grid']],
    anatomy: [['Max width', 'container.max-{size} → layout.container-{size}.'], ['Inline margin', 'container.margin points at layout.margin, which is 16, 32 or 48px by breakpoint.']],
    content: ['Pick the narrowest size that fits the content.'],
    dodont: [
      { do: 'One Container per page body.', dont: 'Nest Containers to add more margin. Use Stack or Grid inside.' },
      { do: 'Use sm for long-form reading.', dont: 'Let paragraphs run 1,400px wide.' },
    ],
    a11y: ['A plain div. No landmark of its own. Put it inside <main>, or pass role/aria-label if it is the landmark.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/grid', 'Grid', 'When the inside needs columns.'], ['/foundations/grid', 'Grid & layout', 'Margins, gutters and breakpoints.']],
  },
  {
    name: 'Grid',
    slug: 'grid',
    status: 'beta',
    limitations: ['Spans are set per breakpoint in whole columns. There is no subgrid or row spanning.', 'Column counts are fixed by the tokens at 4, 8 and 12.'],
    youMust: ['Keep source order the same as visual order so keyboard and screen reader order match.', 'Use full span on small screens unless the content truly fits in a narrow column.'],
    usage: '<Grid>\n  <GridItem span="full" lg={8}>…</GridItem>\n  <GridItem span="full" lg={4}>…</GridItem>\n</Grid>',
    backdrops: 'Grids have no surface either. What sits inside them carries the theme.',
    purpose: 'Lays content out on 4, 8 or 12 columns depending on the screen, with token gutters.',
    importLine: "import { Grid, GridItem } from 'dial-react';",
    overview: (
      <>
        <p>This grid has 4 columns below md (768px), 8 from md and 12 from lg (1024px), with gutters of 16, 24 and 32px. <code>GridItem</code> spans a number of columns, set per breakpoint with <code>span</code>, <code>md</code> and <code>lg</code>. Spans are clamped to the current column count, so a 6-column item never overflows a 4-column phone grid.</p>
        <p>The breakpoint switching is generated by the token build from the breakpoint tokens. The component carries no pixel values at all.</p>
      </>
    ),
    hero: ex('GridResponsive', 'These boxes go full width on phones, halves at md and thirds at lg.', true),
    ladder: [
      ex('GridBasic', 'The column count changes from 4 to 8 to 12 as the screen grows. Resize the window to watch it.', true, 'field'),
      ex('GridPage', 'Main content and a sidebar. Under lg the sidebar drops below the content.', true),
      ex('GridColumns', 'Pass columns for a local grid that should keep its own count.', true),
    ],
    whenToUse: ['Page layouts with columns.', 'Collections that should reflow by screen size.'],
    whenNotToUse: [['A single row or column of things', 'Stack'], ['A data table', 'A real <table>']],
    anatomy: [['Grid', 'A CSS grid whose column count and gap come from the grid tokens.'], ['GridItem', 'Sets span variables and data attributes, and a generated rule picks the right span for each breakpoint.']],
    states: [['< 768px', '4 columns, 16px gutter, 16px margin.'], ['≥ 768px (md)', '8 columns, 24px gutter, 32px margin.'], ['≥ 1024px (lg)', '12 columns, 32px gutter, 48px margin.']],
    content: ['Think in fractions of the current column count. Four of twelve columns at lg is a third.'],
    dodont: [
      { do: 'Let items default to full width on phones.', dont: 'Force three columns on a 375px screen.' },
      { do: 'Keep source order = reading order.', dont: 'Reorder visually with spans and leave the DOM in a different order.' },
    ],
    a11y: ['Purely visual. The DOM order is the reading and tab order, whatever the spans.', 'Real Chromium confirms 4 columns at 375px, 8 at 800px and 12 at 1280px, and that spans clamp.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stack', 'Stack', 'When there is only one direction.'], ['/components/container', 'Container', 'The frame around the grid.'], ['/foundations/grid', 'Grid & layout', 'The full layout token set.']],
  },
  {
    name: 'Stack',
    slug: 'stack',
    status: 'beta',
    limitations: ['A row stack wraps, but its items do not line up in columns across lines. Use Grid for that.', 'Gaps are limited to the token scale.'],
    youMust: ['Use the smallest gap that still separates the items.', 'Use a list element inside the Stack when the items are a list.'],
    usage: '<Stack gap="md">…</Stack>',
    backdrops: 'Stacks only space things out, so they look the same in every theme.',
    purpose: 'Spaces children in one direction with a token gap, so children never carry their own margins.',
    importLine: "import { Stack } from 'dial-react';",
    overview: (
      <>
        <p><code>Stack</code> lays children out in one direction, a column by default or a wrapping row, with one of five gaps from 4 to 32px. Space belongs to the parent. Components have no outer margins, and Stack is how you separate them.</p>
      </>
    ),
    hero: ex('StackBasic', 'A stack holds a title, a line of detail and a row of actions.'),
    ladder: [
      ex('StackDirection', 'Stacks run in a column by default. Rows wrap.'),
      ex('StackGaps', 'Five gaps are available. xs is 4px, sm 8, md 16 (the default), lg 24 and xl 32.'),
      ex('StackAlign', 'align sets the cross axis to start, center, end or stretch.'),
      ex('StackForm', 'A settings group nests rows inside a column, with the label and value side by side.'),
      ex('StackRow', 'A row of short items wraps onto the next line when it runs out of room, and keeps its gap.'),
    ],
    whenToUse: ['Any vertical rhythm inside a component or region.', 'A row of buttons, tags or chips.'],
    whenNotToUse: [['Two-dimensional layouts', 'Grid'], ['Lists with semantics', 'A real <ul>/<ol>, laid out with Stack inside if needed']],
    anatomy: [['Flex container', 'flex-direction column | row (wrap).'], ['Gap', 'stack.gap-{xs…xl} → gap tokens.']],
    content: ['Choose the gap by relationship. Things that belong together sit tighter, and groups sit further apart.'],
    dodont: [
      { do: 'Space with the parent’s gap.', dont: 'Add margins to children to push them apart.' },
      { do: 'Nest stacks for groups within groups.', dont: 'Use one huge gap for everything.' },
    ],
    a11y: ['A plain div. Add role="group" + aria-label when the stack is a group of controls .'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/grid', 'Grid', 'When you need columns.'], ['/foundations/spacing', 'Spacing', 'The gap scale.']],
  },
  {
    name: 'Button',
    slug: 'button',
    status: 'beta',
    limitations: ['There is no loading state; show progress on the unit’s display instead.', 'There is no icon slot yet. Use IconButton for an icon on its own.'],
    youMust: ['Use one primary key per unit at most, and none when the unit already has an orange knob.', 'Write a verb on the key that says what happens.'],
    usage: '<Button kind="primary">Start wash</Button>',
    backdrops: 'In light the key is warm white plastic, in dark it is charcoal. The orange and its rim are the same in both themes, and the shadow always falls down and to the right.',
    purpose: 'Starts, stops or confirms one action, as a key that drops when pressed and returns on a spring.',
    importLine: "import { Button } from 'dial-react';",
    overview: (
      <>
        <p><code>Button</code> is a capsule key of matte plastic, 44px tall by default. <code>kind="primary"</code> dyes it orange for the one action a unit exists for; every other key stays plastic. Pressing drops it by 3px in 65ms and the spring brings it back.</p>
      </>
    ),
    hero: ex('ButtonBasic', 'One orange key for the main action and plastic keys for the rest.'),
    ladder: [
      ex('ButtonKinds', 'kind is key (the default) or primary.'),
      ex('ButtonSizes', 'size is md (44px, the default) or lg (52px).'),
      ex('ButtonStates', 'A disabled key loses its height. full stretches the key across its unit.'),
      ex('ButtonInUnit', 'In a unit, keys sit at the bottom, under the display.'),
    ],
    whenToUse: ['Start, stop, pause or confirm an action.', 'The main action of a sheet or dialog.'],
    whenNotToUse: [['An action shown only as an icon', 'IconButton'], ['A setting that stays on or off', 'Switch']],
    anatomy: [['Key body', 'A capsule, elevation.part, corner.round, at least control.md tall.'], ['Printed word', 'type.label in type.weight-medium.']],
    states: [['Hover', 'Ink one step darker; orange one step lighter on primary. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Disabled', 'Flat, opacity.disabled.']],
    content: ['A verb first, then the object: Start wash, Turn off.', 'Sentence case and no full stop.'],
    dodont: [
      { do: 'Use one orange key per unit.', dont: 'Put two orange keys side by side.' },
      { do: 'Say what happens on the key.', dont: 'Write OK or Yes.' },
    ],
    a11y: ['A native button, so Space and Enter work and it is announced as a button.', 'The printed word is the accessible name.', 'The focus ring is 2px of the darkest ink with a gap, on every key.'],
    keyboard: [['Tab', 'Moves focus to the key', 'Button: Tab reaches the key and the focus ring shows'], ['Space / Enter', 'Presses the key', 'Button: Space and Enter run the action']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/icon-button', 'IconButton', 'An icon with no word.'], ['/components/switch', 'Switch', 'Something that stays on or off.']],
  },
  {
    name: 'Switch',
    slug: 'switch',
    status: 'beta',
    limitations: ['There is one size only.', 'There is no pending state; if the device is slow to answer, show progress on the unit’s display.'],
    youMust: ['Give every switch a label, or an aria-label when the label is printed elsewhere.', 'Use it only for a setting that takes effect at once.'],
    usage: '<Switch label="Keep warm" offLabel="Off" onLabel="On" />',
    backdrops: 'In light the cap is warm white plastic in a darker groove, in dark it is charcoal. The lamp fills with the primary ink in both themes, and the shadow always falls down and to the right.',
    purpose: 'Turns one setting on or off, as a slide switch whose cap position, lamp and printed word all say the state.',
    importLine: "import { Switch } from 'dial-react';",
    overview: (
      <>
        <p><code>Switch</code> is a slide switch: a raised cap in a 52px recessed groove, a printed label beside it, optional position words at each end and a 6px lamp. It is a native button with <code>role="switch"</code>, 44px tall. Space or Enter throws it, and the cap slides to the other end over 245ms, at once under reduced motion.</p>
      </>
    ),
    hero: ex('SwitchBasic', 'A label, the two position words and the lamp.'),
    ladder: [
      ex('SwitchPositions', 'offLabel and onLabel name the two ends. Leave both out for a plain switch.'),
      ex('SwitchControlled', 'checked and onCheckedChange make it controlled.'),
      ex('SwitchStates', 'Off, on and disabled. A disabled cap loses its height.'),
      ex('SwitchInUnit', 'Inside a unit, under the display and above the one orange key.'),
    ],
    whenToUse: ['Turn a setting on or off that stays put.', 'Pick between two named positions, such as Cook and Warm.'],
    whenNotToUse: [['An action that runs once', 'Button'], ['A choice in a form that is sent later', 'Checkbox']],
    anatomy: [['Label', 'type.label, text.primary, printed before the switch.'], ['Groove', 'control.switch long, control.track tall, surface.sunken with elevation.well.'], ['Cap', 'control.cap-w by control.cap-h, corner.media, elevation.part, one index line.'], ['Position words', 'type.caption; the current one in type.weight-medium.'], ['Lamp', 'control.lamp, a recess while off, filled with text.primary while on.']],
    states: [['On', 'Cap at the far end, lamp filled, on word in medium weight.'], ['Hover', 'Position words one step darker. No lift.'], ['Disabled', 'Cap flat, opacity.disabled.']],
    content: ['The label names the setting as a noun: Keep warm, Child lock.', 'Position words are short: Off and On, or Warm and Cook.'],
    dodont: [
      { do: 'Show on by the cap, the lamp and the word.', dont: 'Colour the groove green or orange when on.' },
      { do: 'Name the setting in the label.', dont: 'Ask a question with Yes and No.' },
    ],
    a11y: ['A native button with role="switch" and aria-checked, so it is announced as a switch, on or off.', 'The printed label names it through aria-labelledby, and clicking the label throws it.', 'Position words are printing and are hidden from the accessible name.', 'The focus ring is 2px of the darkest ink with a gap.'],
    keyboard: [['Tab', 'Moves focus to the switch', 'Switch: Tab reaches the switch and the focus ring shows'], ['Space / Enter', 'Throws the switch', 'Switch: Space and Enter throw the switch']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/button', 'Button', 'An action that runs once.'], ['/components/checkbox', 'Checkbox', 'A choice in a form sent later.']],
  },
  {
    name: 'Text',
    slug: 'text',
    status: 'beta',
    limitations: ['There is no truncation with an ellipsis. Long text wraps.', 'There is no colour prop on purpose. Use a Badge for status.'],
    youMust: ['Pass htmlFor when Text renders a label, so it names its field.', 'Never let the lowercase model name be the only name of a device.'],
    usage: '<Text size="label" tone="secondary" numeric>Eco from 23:00</Text>',
    backdrops: 'In light the ink is dark grey on warm white plastic, in dark it is warm white on charcoal. Both inks hold 4.5:1 in both themes, and nothing is tinted.',
    purpose: 'Prints words on a unit, in one grotesk and two inks, with hierarchy by size and position.',
    importLine: "import { Text } from 'dial-react';",
    overview: (
      <>
        <p><code>Text</code> prints a label, a reading, a note or a paragraph. <code>size</code> picks one of five steps from 11 to 16px, <code>tone</code> picks the primary or secondary ink, <code>weight</code> is regular or medium, and <code>numeric</code> turns on tabular figures. It has no outer margin. Space it with Stack.</p>
      </>
    ),
    hero: ex('TextBasic', 'A label in medium weight, a reading in tabular figures and a note in the lighter ink.'),
    ladder: [
      ex('TextSizes', 'size is micro, caption, label, body (the default) or reading.'),
      ex('TextTones', 'tone is primary (the default) or secondary.'),
      ex('TextNumeric', 'numeric keeps digits at a fixed width, so times line up.'),
      ex('TextReading', 'reading prose stops at the measure, so lines stay short enough to read.'),
      ex('TextWeights', 'weight is regular (the default) or medium. There is no bold.'),
      ex('TextInUnit', 'On a unit, the wordmark and the model name sit on the bottom inset line.'),
    ],
    whenToUse: ['Name a control or a reading.', 'Add a short note under a part.', 'Write prose on a sheet.'],
    whenNotToUse: [['The name of a unit, a section or a page', 'Heading'], ['The live state of a device', 'Display']],
    anatomy: [['Printed line', 'p, span, div or label in type.family, margin 0.'], ['Size', 'type.micro to type.reading; reading caps at type.measure.'], ['Ink', 'text.primary or text.secondary.']],
    content: ['Sentence case and plain words.', 'Write the model name in lowercase.', 'Put the unit next to the number: 22.0°, 38 min.'],
    dodont: [
      { do: 'Use size and position for hierarchy.', dont: 'Make words orange or tinted to stand out.' },
      { do: 'Turn on numeric for numbers that change.', dont: 'Set labels in spaced capitals.' },
    ],
    a11y: ['Both inks hold 4.5:1 on plastic in both themes.', 'As a label element with htmlFor, it is the accessible name of its field.', 'Text has no role of its own and never takes focus.'],
    inherits: 'LabelHTMLAttributes<HTMLElement>',
    related: [['/components/heading', 'Heading', 'The name of a unit, a section or a page.'], ['/components/display', 'Display', 'The live state of the device.']],
  },
  {
    name: 'Heading',
    slug: 'heading',
    status: 'beta',
    limitations: ['There are four levels. h5 and h6 are not offered.', 'The level sets both the element and the size. They cannot be set apart.'],
    youMust: ['Use one level 1 per page.', 'Do not skip levels on the way down.'],
    usage: '<Heading level={3}>Living room heater</Heading>',
    backdrops: 'In light the ink is dark grey on warm white plastic, in dark it is warm white on charcoal. The size and weight do not change.',
    purpose: 'Names a page, a section, a unit or a group, as the largest printing on the case.',
    importLine: "import { Heading } from 'dial-react';",
    overview: (
      <>
        <p><code>Heading</code> renders h1 to h4 from <code>level</code>, at 37, 26, 22 or 18px. It is always medium weight and primary ink, with no outer margin. Level 3 is the default, the name of one unit.</p>
      </>
    ),
    hero: ex('HeadingBasic', 'A unit name as a level 3 heading, with a note under it.'),
    ladder: [
      ex('HeadingLevels', 'level is 1, 2, 3 (the default) or 4.'),
      ex('HeadingPage', 'A page outline: the page, then rooms, then units.'),
      ex('HeadingInUnit', 'On a unit, the heading sits first, above the reading and the keys.'),
      ex('HeadingSheet', 'Level 4 names a group of settings inside a sheet.'),
    ],
    whenToUse: ['The title of a page.', 'The name of a room, a unit or a group of settings.'],
    whenNotToUse: [['The name of a control or a reading', 'Text'], ['The live state of a device', 'Display']],
    anatomy: [['Printed name', 'h1 to h4, type.weight-medium, type.leading-tight, text.primary, margin 0.'], ['Size', 'type.display, type.headline, type.title or type.emphasis.']],
    content: ['A short name in sentence case.', 'No full stop.'],
    dodont: [
      { do: 'Pick the level by structure.', dont: 'Pick a level for its size.' },
      { do: 'Use one heading per unit.', dont: 'Make a detail a heading.' },
    ],
    a11y: ['A real h1 to h4 element, so screen readers list it at its level.', 'Primary ink holds 4.5:1 on plastic in both themes.'],
    inherits: 'HTMLAttributes<HTMLHeadingElement>',
    related: [['/components/text', 'Text', 'Labels, notes and prose.']],
  },
  {
    name: 'IconButton',
    slug: 'icon-button',
    status: 'beta',
    limitations: ['There is no printed word under the key yet. Use Button when a word is needed.', 'There is no toggle state. Use Switch for something that stays on.'],
    youMust: ['Give every key a label that says what it does, in words.', 'Use one primary key per unit at most, counting Buttons and knobs.'],
    usage: '<IconButton label="Play" kind="primary"><PlayIcon /></IconButton>',
    backdrops: 'In light the key is warm white plastic, in dark it is charcoal. The orange and its rim are the same in both themes, and the shadow always falls down and to the right.',
    purpose: 'Runs one action shown as a symbol, on a round key that drops when pressed and returns on a spring.',
    importLine: "import { IconButton } from 'dial-react';",
    overview: (
      <>
        <p><code>IconButton</code> is a round key of matte plastic, 44px across by default, with one icon printed on it. The <code>label</code> prop is required and becomes the name screen readers announce. <code>kind="primary"</code> dyes the key orange for the one action a unit exists for. Pressing drops it by 3px in 65ms and the spring brings it back.</p>
      </>
    ),
    hero: ex('IconButtonBasic', 'One orange key to play and plastic keys to skip.'),
    ladder: [
      ex('IconButtonKinds', 'kind is key (the default) or primary.'),
      ex('IconButtonSizes', 'size is md (44px, the default) or lg (52px).'),
      ex('IconButtonStates', 'A disabled key loses its height.'),
      ex('IconButtonInUnit', 'Transport keys under the display of a speaker unit.'),
    ],
    whenToUse: ['Play, pause, skip, power and volume on a device.', 'A short row of keys whose symbols everyone knows.'],
    whenNotToUse: [['An action that needs a word', 'Button'], ['A setting that stays on or off', 'Switch']],
    anatomy: [['Key body', 'A disc, elevation.part, corner.round, control.key across.'], ['Printed symbol', 'control.icon-md, 2px stroke in currentColor, aria-hidden.']],
    states: [['Hover', 'Symbol one step darker; orange one step lighter on primary. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Disabled', 'Flat, opacity.disabled.']],
    content: ['The label is a verb first: Next track, Turn off, Volume up.', 'Name the action, not the picture.'],
    dodont: [
      { do: 'Write a label that says what the key does.', dont: 'Name the icon, such as Plus or Arrow.' },
      { do: 'Use one orange key per unit.', dont: 'Make every transport key orange.' },
    ],
    a11y: ['A native button, so Space and Enter work and it is announced as a button.', 'The label prop is the accessible name. The icon is hidden from screen readers.', 'The focus ring is 2px of the darkest ink with a gap, on every key.'],
    keyboard: [['Tab', 'Moves focus to the key', 'IconButton: Tab reaches the key and the focus ring shows'], ['Space / Enter', 'Presses the key', 'IconButton: Space and Enter run the action']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/button', 'Button', 'The action needs a word.'], ['/components/switch', 'Switch', 'Something that stays on or off.']],
  },
  {
    name: 'Checkbox',
    slug: 'checkbox',
    status: 'beta',
    limitations: ['There is no group component yet. Stack checkboxes and give the list a heading.', 'There is one size only.'],
    youMust: ['Give every checkbox a label printed beside it.', 'Phrase the label so that a tick means yes.'],
    usage: '<Checkbox label="Pre-wash" defaultChecked />',
    backdrops: 'In light the key is warm white plastic with a grey ring edge, in dark it is charcoal. The tick is the darkest ink in both themes and never orange.',
    purpose: 'Turns one option on or off, as a small square key that prints a tick when it is on.',
    importLine: "import { Checkbox } from 'dial-react';",
    overview: (
      <>
        <p><code>Checkbox</code> is a native checkbox under a 24px square key of matte plastic, with its <code>label</code> printed beside it. The whole row is 44px tall and any of it presses the key. When the option is on, a 2px ink tick appears on the key; <code>indeterminate</code> shows a dash. Use <code>checked</code> and <code>onChange</code> to control it, or <code>defaultChecked</code> to leave it alone.</p>
      </>
    ),
    hero: ex('CheckboxBasic', 'Washer options, each with an ink tick when on.'),
    ladder: [
      ex('CheckboxControlled', 'checked and onChange keep the value in your state.'),
      ex('CheckboxIndeterminate', 'indeterminate shows a dash on a parent when only some children are on.'),
      ex('CheckboxStates', 'A disabled key loses its height and keeps its tick readable.'),
      ex('CheckboxInUnit', 'Options under a display, before the one orange key.'),
    ],
    whenToUse: ['Options that change what the main key will do.', 'A list where any number of items can be on.'],
    whenNotToUse: [['A setting that takes effect at once', 'Switch'], ['Exactly one of a few modes', 'SegmentedControl']],
    anatomy: [['Row', 'A native label, at least control.md tall, gap.lg between key and name.'], ['Key', 'control.check square, corner.check, line.ring edge, elevation.part.'], ['Tick', 'control.icon-sm, width.ring stroke in text.primary.'], ['Printed name', 'type.label in type.weight-regular.']],
    states: [['On', 'Ink tick on the key.'], ['Mixed', 'Ink dash on the key.'], ['Hover', 'Edge one step darker. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Disabled', 'Flat, opacity.disabled.']],
    content: ['Name the option: Pre-wash, Child lock.', 'Sentence case, no full stop, no negatives.'],
    dodont: [
      { do: 'Show on as a tick in ink.', dont: 'Fill the key with orange or blue.' },
      { do: 'Write Child lock.', dont: 'Write Don’t lock the door.' },
    ],
    a11y: ['A native checkbox, so Space toggles it and it is announced as checked, not checked or mixed.', 'The printed label is the accessible name, and clicking it presses the key.', 'On, off and mixed are three shapes, so the state does not depend on colour.'],
    keyboard: [['Tab', 'Moves focus to the checkbox', 'Checkbox: Tab reaches the checkbox and the focus ring shows'], ['Space', 'Turns the option on or off', 'Checkbox: Space toggles the option']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/switch', 'Switch', 'The setting acts at once.'], ['/components/button', 'Button', 'Run an action.']],
  },
  {
    name: 'Display',
    slug: 'display',
    status: 'beta',
    limitations: ['LCD segments draw digits, a minus, a decimal point and a few letters. Other characters stay blank, so put words in the detail line.', 'There is no built-in bar or progress line inside the window. Pair the window with a Grille for a level.'],
    youMust: ['Give every window a label that names the device or the reading.', 'Use one window per unit, at the top of the unit.'],
    usage: '<Display label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />',
    backdrops: 'The LCD window is grey-green with dark segments in both themes, a step darker in dark. The OLED window is near-black with white text. Both are set into the body, with the shade on the top-left inner edge.',
    purpose: 'Says what the device is doing now, in a window set into the unit, as LCD segments or OLED text.',
    importLine: "import { Display } from 'dial-react';",
    overview: (
      <>
        <p><code>Display</code> is a window recessed into the body. <code>kind="lcd"</code> draws the value as 7-segment digits with the unit beside them; <code>kind="oled"</code> sets value and detail in white grotesk on near-black. The window is a polite live region and is never a control.</p>
      </>
    ),
    hero: ex('DisplayBasic', 'A thermostat reading: segment digits, the unit, one detail line.'),
    ladder: [
      ex('DisplayKinds', 'kind is lcd (the default) or oled.'),
      ex('DisplaySizes', 'size is sm (24px digits), md (40px, the default) or lg (56px).'),
      ex('DisplayDigits', 'digits pads short readings with unlit cells, so the window keeps one width.'),
      ex('DisplayInUnit', 'At the top of a unit; the keys below change the reading at once.'),
    ],
    whenToUse: ['Show the current state of a device.', 'A reading that changes while someone watches.'],
    whenNotToUse: [['A level shown as lit holes', 'Grille'], ['A number inside a sentence', 'Text']],
    anatomy: [['Window', 'elevation.well, radius = outer − inset (corner.inner by default).'], ['Value', 'SVG segments in display.lcd-ink, ghosts in display.lcd-ghost; or grotesk in display.oled-ink.'], ['Unit and detail', 'type.label and type.caption in the grotesk.']],
    states: [['Changing', 'The new value at once; each segment fades on or off in motion.segment.'], ['Reduce motion', 'Segments switch with no fade.']],
    content: ['The value, the unit, then a short detail: 21.5 °C, Heating to 22.0.', 'Keep words out of the segments.'],
    dodont: [
      { do: 'Use one window per unit.', dont: 'Stack two windows in one unit.' },
      { do: 'Say the state now, in numbers.', dont: 'Show a coloured arrow for the change.' },
    ],
    a11y: ['role status with aria-live polite: a changed reading is announced without moving focus.', 'The full reading is in the window as text; the drawn segments are hidden from assistive tech.', 'Every glyph holds 4.5:1 on its window.', 'The window never takes focus.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/grille', 'Grille', 'A level shown as lit holes.'], ['/components/text', 'Text', 'A number inside running text.']],
  },
  {
    name: 'Grille',
    slug: 'grille',
    status: 'beta',
    limitations: ['There is one hole size, 8px on a 12px pitch.', 'The field does not wrap. Choose cols for the narrowest column you expect.'],
    youMust: ['Give every grille a label that names what it measures.', 'Use a grille only where it carries a reading, never as decoration.'],
    usage: '<Grille label="Volume" value={6} max={10} cols={12} rows={4} />',
    backdrops: 'Unlit holes are recesses one step darker than the body; lit holes are printing ink at full step, in both themes. No hole is ever orange.',
    purpose: 'Shows a level, an activity or a signal as lit holes in a perforated field, with the value named for screen readers.',
    importLine: "import { Grille } from 'dial-react';",
    overview: (
      <>
        <p><code>Grille</code> is a field of round recesses. <code>value</code> out of <code>max</code> lights that share of the holes, in the order <code>fill</code> sets. It is a meter: it has a required <code>label</code>, a value and a text reading for assistive tech.</p>
      </>
    ),
    hero: ex('GrilleBasic', 'A volume level, lit column by column from the start of the line.'),
    ladder: [
      ex('GrilleLevels', 'Empty, partly lit and full: the lit holes are the reading.'),
      ex('GrilleShapes', 'shape is rect (the default) or circle.'),
      ex('GrilleFill', 'fill is inline (the default) or up.'),
      ex('GrilleInUnit', 'In a unit, next to the keys that change it.'),
    ],
    whenToUse: ['Show a level: volume, fan speed, battery.', 'Show signal or activity in coarse steps.'],
    whenNotToUse: [['The exact number matters', 'Display'], ['The person sets the level', 'Slider']],
    anatomy: [['Field', 'A grid of cols × rows on a space-2 + space-1 pitch.'], ['Hole', 'grille.hole, corner.round, elevation.well.'], ['Lit hole', 'grille.hole-on.']],
    states: [['Changing', 'Holes fade on or off in motion.fill, in fill order.'], ['Reduce motion', 'Holes switch with no fade.']],
    content: ['The label names what is measured: Volume, Fan speed.', 'valueText says the reading in words: Volume 6 of 10.'],
    dodont: [
      { do: 'Put the grille next to what it measures.', dont: 'Use a grille as a background pattern.' },
      { do: 'Light holes in ink.', dont: 'Colour the holes orange, green or red.' },
    ],
    a11y: ['role meter with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext.', 'The label is required, so every grille has a name.', 'Lit holes hold 3:1 against unlit holes.', 'The grille never takes focus.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/display', 'Display', 'The exact number in a window.'], ['/components/slider', 'Slider', 'The person sets the level.']],
  },
  {
    name: 'Slider',
    slug: 'slider',
    status: 'beta',
    limitations: ['There is no vertical fader yet; the groove always runs along the line of text.', 'There is no range with two caps.', 'The ruler prints its own numbers; it cannot take custom labels yet.'],
    youMust: ['Give every fader a label that names the amount.', 'Put the unit in formatValue so the value text says it, for example 60 %.', 'Keep the fader plastic: the orange belongs to the unit’s knob.'],
    usage: '<Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />',
    backdrops: 'In light the cap is warm white plastic over a light grey groove, in dark it is charcoal over a darker groove. The ink and the shadow direction are the same in both themes, and nothing is orange.',
    purpose: 'Sets an amount between two ends, as a plastic cap that rides a groove and settles into the nearest step.',
    importLine: "import { Slider } from 'dial-react';",
    overview: (
      <>
        <p><code>Slider</code> is a fader: a 24 by 32px plastic cap in a recessed groove, under a printed ruler with one tick per step. The track is 44px tall and as long as its column, at least 220px, and it keeps that size from the lowest value to the highest. <code>scale</code> prints the numerals under the groove. When you let go, the cap settles into the nearest step on the spring (mass 1.4, stiffness 520, damping 46).</p>
      </>
    ),
    hero: ex('SliderBasic', 'A volume fader with 11 steps and its numerals.'),
    ladder: [
      ex('SliderScale', 'The ruler is always there; scale adds the numerals.'),
      ex('SliderSteps', 'step sets the detents; formatValue prints the unit.'),
      ex('SliderControlled', 'Controlled with value and onValueChange.'),
      ex('SliderStates', 'A disabled fader loses the cap’s height.'),
    ],
    whenToUse: ['Set an amount such as volume, brightness or fan speed.', 'Show where a value sits in the whole range.'],
    whenNotToUse: [['The main setting of the unit', 'Rotary'], ['Only on and off', 'Switch']],
    anatomy: [['Label and value', 'type.label in type.weight-medium; the value in tabular figures.'], ['Ruler', 'width.hairline ticks in text.secondary, the ends and middle in text.primary.'], ['Groove', 'control.track tall, surface.sunken, elevation.well.'], ['Cap', 'control.cap-w by control.cap-h, surface.raised, elevation.part, an ink line.'], ['Numerals', 'type.micro, tabular, text.secondary.']],
    states: [['Hover', 'The cap’s ink line darkens one step. No lift.'], ['Dragging', 'The cap follows the pointer.'], ['Released', 'Settles into the nearest step on the spring; at once with reduced motion.'], ['Disabled', 'No cap shadow, opacity.disabled.']],
    content: ['Name the amount: Volume, Brightness.', 'Put the unit in formatValue, not in the label.'],
    dodont: [
      { do: 'Keep the fader plastic next to an orange knob.', dont: 'Colour the groove or the cap.' },
      { do: 'Set a step when the device has steps.', dont: 'Let a five-speed fan land on 2.37.' },
    ],
    a11y: ['The track has role slider with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext.', 'The printed label is the accessible name, through aria-labelledby.', 'Every value can be reached with keys or a single press on the track, with no drag.', 'In forced colours the cap, the groove and the ticks are drawn as borders.'],
    keyboard: [['Arrow keys', 'Move one step', 'Slider: arrow keys move one step and Home and End reach the ends'], ['Page Up / Page Down', 'Move a larger step', 'Slider: Page Up and Page Down move more than one step'], ['Home / End', 'Go to the lowest or highest value', 'Slider: arrow keys move one step and Home and End reach the ends']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/rotary', 'Rotary', 'The main setting, as the orange knob.'], ['/components/switch', 'Switch', 'Only on and off.']],
  },
  {
    name: 'Rotary',
    slug: 'rotary',
    status: 'beta',
    limitations: ['The knob turns through steps only; there is no free turning without detents.', 'There is no endless knob for scrolling through a list.', 'The mouse wheel does not turn it.'],
    youMust: ['Use one primary knob per unit, and no orange key on the same unit.', 'Give every knob a label and put the unit in formatValue.', 'Show the device’s own reading on the unit’s display when it differs from the set value.'],
    usage: '<Rotary label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} />',
    backdrops: 'The orange disc and its rim are the same in both themes. The key knob is warm white plastic in light and charcoal in dark. The tick ring is ink on the case, and the shadow always falls down and to the right.',
    purpose: 'Sets the unit’s main value by turning a knob through its steps, with the value and label printed below.',
    importLine: "import { Rotary } from 'dial-react';",
    overview: (
      <>
        <p><code>Rotary</code> is a flat disc with one printed index line, over a ring of ticks that marks every step across 270 degrees. <code>kind="primary"</code> (the default) dyes it orange as the unit’s one loud part; <code>kind="key"</code> is a plastic knob for a second dial. <code>size</code> is 44, 72 or 108px across, or <code>unitSide</code> makes it 0.36 of the unit’s short side. Drag up or down, press the tick ring or use the keys; it settles into the nearest step on the spring.</p>
      </>
    ),
    hero: ex('RotaryBasic', 'The orange knob with its value and label.'),
    ladder: [
      ex('RotaryKinds', 'kind is primary (the default) or key.'),
      ex('RotarySizes', 'size is sm (44px), md (72px, the default) or lg (108px).'),
      ex('RotaryInUnit', 'unitSide sizes the knob from its unit: 0.36 of the short side.'),
      ex('RotaryKeyboard', 'Arrow keys turn one detent, Page keys turn further, and Home and End reach the ends.'),
      ex('RotaryStates', 'Steps of five, and a disabled knob.'),
    ],
    whenToUse: ['Set the main value of a device, such as a temperature or a station.', 'A value with clear steps, such as a timer.'],
    whenNotToUse: [['A secondary amount along a range', 'Slider'], ['Starting or stopping something', 'Button']],
    anatomy: [['Tick ring', 'One control.tick tick per step in text.primary, across mechanism.sweep.'], ['Disc', 'corner.round, elevation.part; action.accent with action.accent-rim, or surface.raised with line.ring.'], ['Index line', 'width.bar of text.on-accent ink, or text.secondary on a key knob.'], ['Value and label', 'type.body in tabular figures; type.label in text.secondary.']],
    states: [['Hover', 'Orange one step lighter, or the index darkens on a key knob. No lift.'], ['Turning', 'The disc follows the pointer.'], ['Released', 'Settles into the nearest step on the spring; at once with reduced motion.'], ['Disabled', 'No shadow, opacity.disabled.']],
    content: ['Name the setting: Temperature, Timer.', 'Put the unit in formatValue: 21 °C, 20 min.'],
    dodont: [
      { do: 'Use one orange knob per unit.', dont: 'Put an orange key or a second orange knob beside it.' },
      { do: 'Keep a key knob smaller than the primary knob.', dont: 'Make the secondary dial the biggest part.' },
    ],
    a11y: ['The disc has role slider with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext.', 'The printed label is the accessible name, through aria-labelledby.', 'Every step can be reached with keys or a press on the tick ring, with no drag.', 'In forced colours the disc, its index and the ticks are drawn as borders.'],
    keyboard: [['Arrow keys', 'Turn one step', 'Rotary: arrow keys turn one step and Home and End reach the ends'], ['Page Up / Page Down', 'Turn several steps', 'Rotary: Page Up and Page Down turn more than one step'], ['Home / End', 'Turn to the first or last step', 'Rotary: arrow keys turn one step and Home and End reach the ends']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/slider', 'Slider', 'A secondary amount along a range.'], ['/components/button', 'Button', 'An action rather than a value.']],
  },
];
