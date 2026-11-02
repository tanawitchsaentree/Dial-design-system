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
    content: ['A verb first, then the object, as in Start wash or Turn off.', 'Sentence case and no full stop.'],
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
        <p><code>Switch</code> is a slide switch. It has a raised cap in a 52px recessed groove, a printed label beside it, optional position words at each end and a 6px lamp. It is a native button with <code>role="switch"</code>, 44px tall. Space or Enter throws it, and the cap slides to the other end over 245ms, at once under reduced motion.</p>
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
    content: ['The label names the setting as a noun, such as Keep warm or Child lock.', 'Position words are short, like Off and On, or Warm and Cook.'],
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
    content: ['Sentence case and plain words.', 'Write the model name in lowercase.', 'Put the unit next to the number, as in 22.0° or 38 min.'],
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
      ex('HeadingPage', 'A page outline runs from the page to rooms to units.'),
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
    content: ['The label starts with a verb, as in Next track, Turn off or Volume up.', 'Name the action, not the picture.'],
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
    content: ['Name the option, such as Pre-wash or Child lock.', 'Sentence case, no full stop, no negatives.'],
    dodont: [
      { do: 'Show on as a tick in ink.', dont: 'Fill the key with orange or blue.' },
      { do: 'Write Child lock.', dont: 'Write Don’t lock the door.' },
    ],
    a11y: ['A native checkbox, so Space toggles it and it is announced as checked, unchecked or mixed.', 'The printed label is the accessible name, and clicking it presses the key.', 'On, off and mixed are three shapes, so the state does not depend on colour.'],
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
    hero: ex('DisplayBasic', 'A thermostat reading shows segment digits, the unit and one detail line.'),
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
    content: ['The value, the unit, then a short detail, as in 21.5 °C with Heating to 22.0.', 'Keep words out of the segments.'],
    dodont: [
      { do: 'Use one window per unit.', dont: 'Stack two windows in one unit.' },
      { do: 'Say the state now, in numbers.', dont: 'Show a coloured arrow for the change.' },
    ],
    a11y: ['role status with aria-live polite, so a changed reading is announced without moving focus.', 'The full reading is in the window as text; the drawn segments are hidden from assistive tech.', 'Every glyph holds 4.5:1 on its window.', 'The window never takes focus.'],
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
        <p><code>Grille</code> is a field of round recesses. <code>value</code> out of <code>max</code> lights that share of the holes, in the order <code>fill</code> sets. It is a meter, with a required <code>label</code>, a value and a text reading for assistive tech.</p>
      </>
    ),
    hero: ex('GrilleBasic', 'A volume level, lit column by column from the start of the line.'),
    ladder: [
      ex('GrilleLevels', 'Empty, partly lit and full. The lit holes are the reading.'),
      ex('GrilleShapes', 'shape is rect (the default) or circle.'),
      ex('GrilleFill', 'fill is inline (the default) or up.'),
      ex('GrilleInUnit', 'In a unit, next to the keys that change it.'),
    ],
    whenToUse: ['Show a level, such as volume, fan speed or battery.', 'Show signal or activity in coarse steps.'],
    whenNotToUse: [['The exact number matters', 'Display'], ['The person sets the level', 'Slider']],
    anatomy: [['Field', 'A grid of cols × rows on a space-2 + space-1 pitch.'], ['Hole', 'grille.hole, corner.round, elevation.well.'], ['Lit hole', 'grille.hole-on.']],
    states: [['Changing', 'Holes fade on or off in motion.fill, in fill order.'], ['Reduce motion', 'Holes switch with no fade.']],
    content: ['The label names what is measured, such as Volume or Fan speed.', 'valueText says the reading in words, as in Volume 6 of 10.'],
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
    youMust: ['Give every fader a label that names the amount.', 'Put the unit in formatValue so the value text says it, for example 60 %.', 'Keep the fader plastic, because the orange belongs to the unit’s knob.'],
    usage: '<Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />',
    backdrops: 'In light the cap is warm white plastic over a light grey groove, in dark it is charcoal over a darker groove. The ink and the shadow direction are the same in both themes, and nothing is orange.',
    purpose: 'Sets an amount between two ends, as a plastic cap that rides a groove and settles into the nearest step.',
    importLine: "import { Slider } from 'dial-react';",
    overview: (
      <>
        <p><code>Slider</code> is a fader, a 24 by 32px plastic cap in a recessed groove under a printed ruler with one tick per step. The track is 44px tall and as long as its column, at least 220px, and it keeps that size from the lowest value to the highest. <code>scale</code> prints the numerals under the groove. When you let go, the cap settles into the nearest step on the spring (mass 1.4, stiffness 520, damping 46).</p>
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
    content: ['Name the amount, such as Volume or Brightness.', 'Put the unit in formatValue, not in the label.'],
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
      ex('RotaryInUnit', 'unitSide sizes the knob from its unit, at 0.36 of the short side.'),
      ex('RotaryKeyboard', 'Arrow keys turn one detent, Page keys turn further, and Home and End reach the ends.'),
      ex('RotaryStates', 'Steps of five, and a disabled knob.'),
    ],
    whenToUse: ['Set the main value of a device, such as a temperature or a station.', 'A value with clear steps, such as a timer.'],
    whenNotToUse: [['A secondary amount along a range', 'Slider'], ['Starting or stopping something', 'Button']],
    anatomy: [['Tick ring', 'One control.tick tick per step in text.primary, across mechanism.sweep.'], ['Disc', 'corner.round, elevation.part; action.accent with action.accent-rim, or surface.raised with line.ring.'], ['Index line', 'width.bar of text.on-accent ink, or text.secondary on a key knob.'], ['Value and label', 'type.body in tabular figures; type.label in text.secondary.']],
    states: [['Hover', 'Orange one step lighter, or the index darkens on a key knob. No lift.'], ['Turning', 'The disc follows the pointer.'], ['Released', 'Settles into the nearest step on the spring; at once with reduced motion.'], ['Disabled', 'No shadow, opacity.disabled.']],
    content: ['Name the setting, such as Temperature or Timer.', 'Put the unit in formatValue, as in 21 °C or 20 min.'],
    dodont: [
      { do: 'Use one orange knob per unit.', dont: 'Put an orange key or a second orange knob beside it.' },
      { do: 'Keep a key knob smaller than the primary knob.', dont: 'Make the secondary dial the biggest part.' },
    ],
    a11y: ['The disc has role slider with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext.', 'The printed label is the accessible name, through aria-labelledby.', 'Every step can be reached with keys or a press on the tick ring, with no drag.', 'In forced colours the disc, its index and the ticks are drawn as borders.'],
    keyboard: [['Arrow keys', 'Turn one step', 'Rotary: arrow keys turn one step and Home and End reach the ends'], ['Page Up / Page Down', 'Turn several steps', 'Rotary: Page Up and Page Down turn more than one step'], ['Home / End', 'Turn to the first or last step', 'Rotary: arrow keys turn one step and Home and End reach the ends']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/slider', 'Slider', 'A secondary amount along a range.'], ['/components/button', 'Button', 'An action rather than a value.']],
  },
  {
    name: 'Input',
    slug: 'input',
    status: 'beta',
    limitations: ['There is no multi-line text area yet.', 'There is no clear button or icon slot at the start of the well.', 'The unit is printed after the value only; there is no prefix.'],
    youMust: ['Give every field a label that names the thing, and never use the placeholder as the label.', 'Write the error as the fix, in words, and show it after the person leaves the field or submits.', 'Use inputMode and autoComplete so phones show the right keyboard.'],
    usage: '<Input label="Room name" defaultValue="Living room" />',
    backdrops: 'In light the well is a light grey recess in warm white plastic, in dark it is a near-black recess in charcoal. The shade always sits on the top-left inner edge, and nothing is orange in either theme.',
    purpose: 'Takes a short piece of text in a recessed well, with its name printed above it.',
    importLine: "import { Input } from 'dial-react';",
    overview: (
      <>
        <p><code>Input</code> is a recessed well the full width of its column, 44px tall at <code>md</code> and 52px at <code>lg</code>, with corner.media and a hairline edge. The label is printed above it. <code>hint</code> prints a line below, <code>error</code> prints the problem with a glyph and sets <code>aria-invalid</code>, and <code>unit</code> prints a unit after the value. The text sits on a 1.45 line box so stacked Thai marks are not cut. Every other prop goes to the native input.</p>
      </>
    ),
    hero: ex('InputBasic', 'A label printed above a recessed well.'),
    ladder: [
      ex('InputSizes', 'size is md (44px, the default) or lg (52px).'),
      ex('InputUnit', 'unit prints the unit after the value.'),
      ex('InputHint', 'hint prints a short line under the well. Thai marks fit.'),
      ex('InputError', 'error prints the problem with a glyph and marks the field invalid.'),
      ex('InputStates', 'Read-only keeps the recess; disabled loses it.'),
      ex('InputInUnit', 'In a sheet, one field per row above the orange key.'),
    ],
    whenToUse: ['Enter a short piece of free text, such as a device name.', 'Enter an exact number with its unit.'],
    whenNotToUse: [['A choice from a known list', 'Select'], ['An amount along a range', 'Slider']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, at least control.md tall.'], ['Text', 'type.body on type.leading-body, text.primary.'], ['Unit', 'type.label in type.weight-medium, text.secondary.'], ['Hint and error', 'type.caption; the error in status.critical-mark with a glyph.']],
    states: [['Focus', 'width.ring in focus.ring around the well.'], ['Invalid', 'The edge in status.critical-mark, the message with a glyph below.'], ['Disabled', 'No well shadow, opacity.disabled.']],
    content: ['Name the thing, such as Room name or Wi-Fi password.', 'Put the unit in unit and the format in hint.', 'Write the error as the fix.'],
    dodont: [
      { do: 'Print the label above the well.', dont: 'Use the placeholder as the label.' },
      { do: 'Say how to fix an error, with the glyph.', dont: 'Show only a red edge.' },
    ],
    a11y: ['A native input, labelled by the printed label through for and id.', 'The unit, the hint and the error are tied to the field with aria-describedby.', 'An error sets aria-invalid and is shown with a glyph and words as well as colour.', 'In forced colours the well keeps a real border and the ring uses the highlight colour.'],
    keyboard: [['Tab', 'Moves focus into the field and shows the ring', 'Input: Tab reaches the field and the focus ring shows on the well'], ['Typing', 'Enters text; the field keeps its width', 'Input: typing Thai text keeps the field at its width']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/select', 'Select', 'A choice from a known list.'], ['/components/slider', 'Slider', 'An amount along a range.']],
  },
  {
    name: 'Select',
    slug: 'select',
    status: 'beta',
    limitations: ['One choice only; there is no multiple selection.', 'There is no search field in the list; type-ahead matches the start of an option.', 'The panel always opens below the well and does not flip when it is near the bottom of the screen.', 'Options cannot be disabled one by one yet.'],
    youMust: ['Give every select a label that names the setting.', 'Use a placeholder only when there is no sensible default.', 'Leave room under the field, or keep the list short, so the panel is not cut by a container that clips its content.'],
    usage: '<Select label="Programme" options={programmes} defaultValue="cotton" />',
    backdrops: 'In light the well is a light grey recess and the panel is warm white plastic; in dark the well is near-black and the panel charcoal. The chosen option is ink and weight in both themes, never orange.',
    purpose: 'Picks one option from a list, in a recessed well that opens a plastic panel of options.',
    importLine: "import { Select } from 'dial-react';",
    overview: (
      <>
        <p><code>Select</code> is a select-only combobox, built by hand on the WAI-ARIA pattern. The trigger is a native button with <code>role="combobox"</code> in the same well as Input, 44px at <code>md</code> and 52px at <code>lg</code>, with a printed chevron. It opens a listbox panel of surface.solid plastic with elevation.float and corner.inner, on layer.overlay. The chosen option has a tick and medium weight. Pass <code>value</code> and <code>onValueChange</code> to control it, or <code>defaultValue</code> to leave it to the field.</p>
      </>
    ),
    hero: ex('SelectBasic', 'A well with a printed chevron that opens a panel of options.'),
    ladder: [
      ex('SelectSizes', 'size is md (44px, the default) or lg (52px).'),
      ex('SelectPlaceholder', 'placeholder prompts before anything is chosen.'),
      ex('SelectControlled', 'Controlled with value and onValueChange.'),
      ex('SelectLong', 'A long list scrolls in the panel; type to jump.'),
      ex('SelectStates', 'A disabled select cannot be opened.'),
      ex('SelectInUnit', 'In a unit, above the orange key.'),
    ],
    whenToUse: ['Pick one of four or more named options.', 'A setting in a sheet, next to text fields.'],
    whenNotToUse: [['Two to five modes that should stay visible', 'SegmentedControl'], ['Only on and off', 'Switch']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, at least control.md tall.'], ['Chevron', 'control.icon-sm, text.secondary, printed at the end.'], ['Panel', 'surface.solid, elevation.float, corner.inner, layer.overlay.'], ['Option', 'At least control.md tall, corner.media. The chosen one has a tick and type.weight-medium in text.primary.']],
    states: [['Focus', 'width.ring in focus.ring around the well, kept while open.'], ['Active row', 'surface.sunken with elevation.well.'], ['Chosen', 'A tick and type.weight-medium.'], ['Disabled', 'No well shadow, opacity.disabled.']],
    content: ['Label the setting, such as Programme or Room.', 'Options are short nouns in sentence case.'],
    dodont: [
      { do: 'Mark the chosen option with the tick.', dont: 'Fill the chosen row with a colour.' },
      { do: 'Use a switch or a segmented control for two options.', dont: 'Hide two options behind a press.' },
    ],
    a11y: ['The trigger is a button with role combobox, aria-haspopup listbox, aria-expanded and aria-controls.', 'Focus stays on the trigger; the active option is pointed to with aria-activedescendant.', 'Options have role option and aria-selected; the chosen one is marked by a glyph and a weight, never by colour alone.', 'Escape closes the list and keeps focus on the trigger; a press outside closes it too.'],
    keyboard: [['Down / Up / Enter / Space', 'Open the list on the chosen option', 'Select: Down opens the list on the chosen option and Escape closes it with focus kept'], ['Arrow keys / Home / End', 'Move the active option', 'Select: arrow keys, Home and End move the active option and Enter chooses it'], ['Letters', 'Jump to an option by its first letters', 'Select: type-ahead jumps to the option that starts with the typed letters'], ['Enter / Space', 'Choose the active option and close', 'Select: arrow keys, Home and End move the active option and Enter chooses it'], ['Escape', 'Close without choosing', 'Select: Down opens the list on the chosen option and Escape closes it with focus kept']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/input', 'Input', 'Free text in the same well.'], ['/components/switch', 'Switch', 'Only on and off.']],
  },
  {
    name: 'SegmentedControl',
    slug: 'segmented-control',
    status: 'beta',
    limitations: ['Options cannot be disabled one at a time; disable the whole bank.', 'Words do not wrap on a key. Keep them short or use fewer keys.'],
    youMust: ['Give every bank a label that names the setting.', 'Use it for two to five modes; more belong in a Select.'],
    usage: '<SegmentedControl label="Band" options={[{ value: \'fm\', label: \'FM\' }, { value: \'am\', label: \'AM\' }]} defaultValue="fm" />',
    backdrops: 'In light the keys are warm white plastic in a darker recessed strip, in dark they are charcoal. The lit lamp is the primary ink in both themes, never orange, and the shadow always falls down and to the right.',
    purpose: 'Picks exactly one of a few modes, as a bank of keys that latch down and release each other, like a radio’s band keys.',
    importLine: "import { SegmentedControl } from 'dial-react';",
    overview: (
      <>
        <p><code>SegmentedControl</code> is a radio group of button keys in one recessed strip, with its <code>label</code> printed above. Pressing a key latches it. It drops 3px in 65ms, its shadow collapses, its 6px lamp fills with ink and its word turns medium weight. The key that was down returns on the spring. Arrow keys move and latch, Home and End reach the ends. Pass <code>options</code> as value, label and an optional icon; use <code>value</code> and <code>onValueChange</code> to control it.</p>
      </>
    ),
    hero: ex('SegmentedControlBasic', 'On band keys, the latched key sits down with its lamp lit.'),
    ladder: [
      ex('SegmentedControlControlled', 'value and onValueChange keep the mode in your state.'),
      ex('SegmentedControlSizes', 'size is md (44px, the default) or lg (52px).'),
      ex('SegmentedControlIcons', 'An icon on each option, printed in the same ink as the word.'),
      ex('SegmentedControlStates', 'No key latched yet, and a disabled bank.'),
      ex('SegmentedControlInUnit', 'Inside a unit, under the display and before the one orange key.'),
    ],
    whenToUse: ['Pick one mode of a device, such as Heat, Eco or Frost.', 'A setting with two to five options that people change often.'],
    whenNotToUse: [['Moving between sections of a screen', 'Tabs'], ['Turning one setting on or off', 'Switch']],
    anatomy: [['Printed label', 'type.label in type.weight-regular, text.primary, above the bank.'], ['Bank', 'surface.sunken strip, elevation.well, corner.round.'], ['Key', 'At least control.md tall and layout.touch wide, line.ring edge, elevation.part.'], ['Lamp', 'control.lamp recess, filled with text.primary when latched.'], ['Word', 'type.label; type.weight-medium when latched.']],
    states: [['Latched', 'Down motion.press-travel, no shadow, lamp lit, word medium.'], ['Hover', 'Word one step darker. No lift.'], ['Pressed', 'Drops in motion.press; the released key returns in motion.release.'], ['Disabled', 'Flat, opacity.disabled.']],
    content: ['One or two words per key, such as Heat, Eco or FM.', 'The label names the setting, such as Mode or Band.'],
    dodont: [
      { do: 'Show the chosen key by depth, lamp and weight.', dont: 'Fill the chosen key with orange.' },
      { do: 'Use it to set a mode.', dont: 'Use it to move between rooms.' },
    ],
    a11y: ['A radiogroup named by the printed label, with one radio per key and aria-checked on the latched one.', 'The bank is one tab stop. Arrows move and latch, and Home and End reach the ends.', 'The latched key differs in depth, lamp and weight, so the choice does not depend on colour.'],
    keyboard: [['Tab', 'Moves focus to the latched key', 'SegmentedControl: Tab reaches the latched key and the focus ring shows'], ['Arrow keys', 'Move to the next key and latch it', 'SegmentedControl: arrow keys move to the next key and latch it'], ['Home / End', 'Latch the first or last key', 'SegmentedControl: Home and End latch the first and last keys']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/tabs', 'Tabs', 'Move between sections.'], ['/components/switch', 'Switch', 'One setting, on or off.']],
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    status: 'beta',
    limitations: ['Tabs cannot be disabled one at a time.', 'There is no vertical row; the names wrap onto a second line when they do not fit.'],
    youMust: ['Give the row a label that says what the sections are, such as Rooms.', 'Use one row of tabs per screen, never tabs inside tabs.'],
    usage: '<Tabs label="Rooms" items={[{ value: \'living\', label: \'Living room\', content: <LivingRoom /> }]} />',
    backdrops: 'The names are ink printed on the page or unit, with no plastic of their own, so they read the same on light and dark. The index mark is the primary ink in both themes, never orange.',
    purpose: 'Moves between sections of one screen, such as rooms, as names printed in a row with one ink index mark under the chosen one.',
    importLine: "import { Tabs } from 'dial-react';",
    overview: (
      <>
        <p><code>Tabs</code> takes <code>items</code>, each a value, a printed label and its content, and follows the WAI-ARIA tabs pattern, with a tablist named by <code>label</code>, one tab per item and one tabpanel each. The chosen name is medium weight with a 24px ink mark under it. The mark appears at once and never slides. Activation is automatic by default, because every panel is already on the page; <code>activation="manual"</code> makes arrows move focus only, for panels that are slow to show.</p>
      </>
    ),
    hero: ex('TabsBasic', 'Rooms printed in a row, with an ink mark under the chosen one.'),
    ladder: [
      ex('TabsControlled', 'value and onValueChange keep the chosen section in your state.'),
      ex('TabsManual', 'With activation="manual", arrows move focus and Enter or Space opens.'),
      ex('TabsWithUnits', 'Each panel holds its room’s units.'),
      ex('TabsManyRooms', 'Five names wrap in a narrow column without shifting.'),
      ex('TabsInScreen', 'Tabs pick the room; a SegmentedControl inside sets a mode.'),
    ],
    whenToUse: ['Move between rooms or areas on one screen.', 'Two to six sections of the same kind.'],
    whenNotToUse: [['Setting a mode on a device', 'SegmentedControl'], ['Turning one setting on or off', 'Switch']],
    anatomy: [['Row of names', 'A flex row, gap.xs, no rule across it.'], ['Name', 'type.label, text.secondary; text.primary in type.weight-medium when chosen; at least control.md tall and layout.touch wide.'], ['Index mark', 'control.thumb wide, width.bar tall, corner.round, text.primary.'], ['Panel', 'The chosen section, focusable, focus.ring on focus.']],
    states: [['Chosen', 'Medium weight, primary ink, index mark under it.'], ['Hover', 'Name one step darker. Nothing rises.'], ['Focus', 'focus.ring around the name or the panel.']],
    content: ['Name the section with a noun, such as Kitchen or Schedule.', 'One or two words, sentence case.'],
    dodont: [
      { do: 'Use tabs to move between rooms.', dont: 'Use tabs to set a mode on a device.' },
      { do: 'Show the chosen name by weight and a mark.', dont: 'Colour the chosen tab or slide a bar under it.' },
    ],
    a11y: ['A tablist named by label, tabs with aria-selected and aria-controls, panels labelled by their tab.', 'The row is one tab stop. Arrows choose the next tab, Home and End reach the ends, and Tab moves on into the panel.', 'The chosen tab differs in weight and by its mark, so the choice does not depend on colour.'],
    keyboard: [['Tab', 'Moves focus to the chosen tab, then into its panel', 'Tabs: Tab reaches the chosen tab and the focus ring shows'], ['Left / Right', 'Choose the next or previous tab', 'Tabs: arrow keys choose the next tab and show its panel'], ['Home / End', 'Choose the first or last tab', 'Tabs: Home and End choose the first and last tabs'], ['Enter / Space', 'With manual activation, choose the focused tab', 'Tabs: with manual activation arrows move focus and Enter chooses']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/segmented-control', 'SegmentedControl', 'Set a mode on a device.'], ['/components/heading', 'Heading', 'Name the screen above the tabs.']],
  },
  {
    name: 'Dialog',
    slug: 'dialog',
    status: 'beta',
    limitations: ['There is one size only.', 'Clicking the scrim does nothing; the sheet closes through its keys or Escape.', 'On a phone it docks to the bottom edge, but it cannot be dragged down.'],
    youMust: ['Give every dialog a title that is the question.', 'Put at most one Button kind="primary" in actions, and put it last.', 'Close it from onOpenChange when you control open.'],
    usage: '<Dialog open={open} onOpenChange={setOpen} title="Turn off all lamps?" actions={<><Button>Cancel</Button><Button kind="primary">Turn off</Button></>} />',
    backdrops: 'The sheet is warm white plastic in light and charcoal in dark, over a plain warm ink scrim with no blur. Its shadow falls down and to the right in both themes.',
    purpose: 'Asks one question about a device before an action that is hard to undo, on a sheet that keeps focus until it is answered.',
    importLine: "import { Dialog } from 'dial-react';",
    overview: (
      <>
        <p><code>Dialog</code> is the native <code>dialog</code> element opened with <code>showModal()</code>, so the focus trap, Escape and the inert page come from the browser. The sheet has the 28px panel radius and 24px inset, so anything nested in it takes 28 − 24. It arrives over 160ms and leaves over 120ms, at once under reduced motion. Focus goes to the first field, or to the first plastic key, and returns to the opener on close.</p>
      </>
    ),
    hero: ex('DialogBasic', 'A question, what will happen, Cancel and the one orange key.'),
    ladder: [
      ex('DialogTrigger', 'trigger opens the sheet without any state of your own.'),
      ex('DialogWithField', 'A field in the sheet takes focus when it opens.'),
      ex('DialogNoPrimary', 'Two plain answers and no orange key.'),
      ex('DialogPending', 'preventDefault in a key keeps the sheet open while the device answers.'),
      ex('DialogInUnit', 'Opened from a unit; the display shows the answer.'),
    ],
    whenToUse: ['Ask before an action that is hard to undo.', 'Pick one small value before an action runs.'],
    whenNotToUse: [['Saying an action worked', 'Toast'], ['A setting that takes effect at once', 'Switch']],
    anatomy: [['Sheet', 'surface.solid, corner.panel, gap.inset padding, elevation.float with a lit top-left hairline.'], ['Scrim', 'surface.scrim, plain, no blur, layer.overlay.'], ['Question', 'Heading level 3, type.title.'], ['Description', 'Text, text.secondary.'], ['Keys', 'Buttons at the bottom, gap.md apart, aligned to the end.']],
    states: [['Open', 'Sheet and scrim fade in over motion.enter with a motion.rise lift.'], ['Closing', 'Fade out over motion.exit, slower.'], ['Reduced motion', 'No fade and no rise.']],
    content: ['The title is the question, such as Turn off all lamps?', 'Keys are verbs that answer it, like Turn off and Keep washing. Avoid Yes and No.'],
    dodont: [
      { do: 'Ask one question with one orange answer.', dont: 'Put an X in the corner as a second way out.' },
      { do: 'Say what will happen in the description.', dont: 'Ask “Are you sure?”.' },
    ],
    a11y: ['It is a native modal dialog, so focus is trapped and the page behind is inert.', 'aria-labelledby points at the question and aria-describedby at the description.', 'Focus goes to the first field or the first plastic key, and returns to the opener on close.', 'Escape closes the sheet, the same as Cancel.'],
    keyboard: [['Enter / Space on the opener', 'Opens the sheet', 'Dialog: Enter on the opener shows a modal sheet named by its question'], ['Tab / Shift+Tab', 'Moves between keys inside the sheet', 'Dialog: Tab and Shift+Tab stay inside the sheet'], ['Escape', 'Closes the sheet and returns focus', 'Dialog: Escape closes the sheet and focus returns to the opener']],
    inherits: 'HTMLAttributes<HTMLDialogElement>',
    related: [['/components/toast', 'Toast', 'Report what happened instead of asking.'], ['/components/button', 'Button', 'The keys in the sheet.']],
  },
  {
    name: 'Toast',
    slug: 'toast',
    status: 'beta',
    limitations: ['There is one size only.', 'At most three toasts show at once; older ones close first.', 'A toast cannot be swiped away; use its close key.'],
    youMust: ['Put one ToastProvider near the root before calling useToast().', 'Keep the message short and in the past tense.', 'Use the critical tone only for failures.'],
    usage: "const toast = useToast();\ntoast.show({ tone: 'positive', message: 'Lamp turned off' });",
    backdrops: 'The strip is warm white plastic in light and charcoal in dark, with its shadow down and to the right. The glyph takes the tone’s mark ink in both themes; nothing is orange.',
    purpose: 'Says in a glyph, a word and a short message what a device just did after a key was pressed, then goes away.',
    importLine: "import { Toast, ToastProvider, useToast } from 'dial-react';",
    overview: (
      <>
        <p><code>Toast</code> is one plastic strip with a 20px glyph and a status word, the message, an optional plastic action key and a 44px round close key. It is <code>role="status"</code>, or <code>role="alert"</code> when critical. <code>ToastProvider</code> renders a fixed region at the bottom of the viewport on <code>layer.toast</code>, and <code>useToast().show()</code> posts to it. A toast stays 6 s, 10 s with an action, never under 5 s, and the timer pauses on hover and focus.</p>
      </>
    ),
    hero: ex('ToastBasic', 'A glyph, the status word, the message and the close key.'),
    ladder: [
      ex('ToastTones', 'The four tones, each with its own glyph and word.'),
      ex('ToastAction', 'One plastic action key, such as Try again.'),
      ex('ToastStatus', 'status replaces the default word.'),
      ex('ToastProvider', 'ToastProvider and useToast post toasts to the bottom of the screen.'),
      ex('ToastUndo', 'Undo from the toast; the unit’s display follows.'),
    ],
    whenToUse: ['Confirm that an action ran.', 'Report a failure with Try again.', 'Offer Undo after an easy action.'],
    whenNotToUse: [['Asking before an action', 'Dialog'], ['A state that stays', 'Display']],
    anatomy: [['Strip', 'surface.solid, corner.panel, elevation.float with a lit top-left hairline.'], ['Glyph', 'control.icon-md, stroked at width.ring in the tone’s mark ink.'], ['Status word', 'type.label, type.weight-medium.'], ['Message', 'type.body, text.primary.'], ['Keys', 'A Button and a 44px IconButton, gap.sm apart.']],
    states: [['Arriving', 'Fades in and rises motion.rise over motion.enter.'], ['Leaving', 'Fades out over motion.exit.'], ['Reduced motion', 'No fade and no rise.']],
    content: ['Say what happened, as in Lamp turned off.', 'For a failure, say what failed and offer Try again.'],
    dodont: [
      { do: 'Tell the tone with a glyph and a word.', dont: 'Use a coloured stripe or dot alone.' },
      { do: 'Use a plastic action key.', dont: 'Make the action key orange.' },
    ],
    a11y: ['role="status" announces politely; the critical tone uses role="alert".', 'The glyph is hidden; the status word carries the tone.', 'The close key is named by closeLabel and is 44px.', 'The timer is at least 5 s and pauses while the pointer or focus is on a toast.'],
    keyboard: [['Tab', 'Reaches the action and close keys', 'Toast: Tab reaches the close key, it is at least the touch target and shows the focus ring'], ['Enter / Space', 'Runs the action or closes the toast', 'Toast: useToast posts a toast that stays at least 5 s and closes on its close key']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/dialog', 'Dialog', 'Ask before an action.'], ['/components/display', 'Display', 'A state that stays.']],
  },
  {
    name: 'Chip',
    slug: 'chip',
    status: 'beta',
    limitations: ['A chip toggles or it removes. One chip does one of the two.', 'There is no chip group with arrow-key navigation yet; each chip is its own Tab stop.', 'There is no icon set yet. Pass your own stroke SVG to icon.'],
    youMust: ['Keep the word short and name the filter or preset.', 'Move focus to the next chip after one is removed.', 'Use SegmentedControl when only one option may be on.'],
    usage: '<Chip defaultSelected>Eco</Chip>',
    backdrops: 'In light the chip is warm white plastic, in dark it is charcoal. A latched chip shows the sunken face and a lit ink lamp in both themes. No chip is ever orange.',
    purpose: 'Turns a filter or quick preset on or off, as a small key that latches down, or shows a removable choice.',
    importLine: "import { Chip } from 'dial-react';",
    overview: (
      <>
        <p><code>Chip</code> is a small capsule key. With <code>selected</code> or <code>defaultSelected</code> it is a toggle. Pressing it latches it down, lights its lamp and sets <code>aria-pressed</code>. With <code>onRemove</code> it shows a choice already made, with a round remove key at the end. <code>size="sm"</code> draws 36px and still takes a press across 44px.</p>
      </>
    ),
    hero: ex('ChipBasic', 'Three presets. The chosen one is latched down with its lamp lit.'),
    ladder: [
      ex('ChipSizes', 'size is md (44px, the default) or sm (36px drawn, 44px target).'),
      ex('ChipStates', 'Off, latched and disabled. A disabled chip loses its height.'),
      ex('ChipRemovable', 'onRemove adds a round remove key with its own 44px target.'),
      ex('ChipControlled', 'Controlled filters with selected and onSelectedChange.'),
      ex('ChipWithIcon', 'icon prints a small stroke symbol before the word.'),
      ex('ChipInUnit', 'Option chips sit between the display and the orange key.'),
    ],
    whenToUse: ['Filters where any number can be on.', 'Quick presets and options next to the control they change.', 'Choices already made that can be taken away.'],
    whenNotToUse: [['Only one option may be on', 'SegmentedControl'], ['A setting that takes effect at once', 'Switch'], ['A status nobody presses', 'Badge']],
    anatomy: [['Key', 'A capsule, corner.round, surface.raised, elevation.part, control.md or control.sm tall.'], ['Lamp', 'control.lamp, a recess when off, text.primary when latched.'], ['Printed word', 'type.label, regular, medium when latched.'], ['Remove key', 'control.thumb round key with a 44px target, a 2px ink cross.']],
    states: [['Hover', 'Ink one step darker. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Latched', 'Stays down, no shadow, surface.sunken face, line.ring edge, lamp lit.'], ['Disabled', 'Flat, opacity.disabled.']],
    content: ['One or two words, such as Eco, Night or Lamps.', 'Sentence case, no full stop, no verb.'],
    dodont: [
      { do: 'Let any number of chips be on.', dont: 'Use chips for a pick-one choice.' },
      { do: 'Show a chosen chip by its latch and lamp.', dont: 'Paint a chosen chip orange or tint its fill.' },
    ],
    a11y: ['A native button with aria-pressed, so Space and Enter work and it is announced as a toggle button.', 'The remove key is its own button, named Remove and the word.', 'The small chip and the remove key keep a 44px target.', 'A latched chip sits lower, has an edge and a lit lamp, so the state reads without colour.'],
    keyboard: [['Tab', 'Moves focus to the chip, then to its remove key', 'Chip: Tab reaches the chip and the focus ring shows'], ['Space / Enter', 'Latches or releases the chip', 'Chip: Space and Enter latch and release the chip'], ['Enter on the remove key', 'Removes the chip', 'Chip: the remove key takes the chip away']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/segmented-control', 'SegmentedControl', 'Only one option may be on.'], ['/components/switch', 'Switch', 'A setting that takes effect at once.'], ['/components/badge', 'Badge', 'A status nobody presses.']],
  },
  {
    name: 'Badge',
    slug: 'badge',
    status: 'beta',
    limitations: ['There is one size, caption text with a 10px lamp.', 'There is no live announcement when a badge changes. Put a live region on the unit if the change matters.'],
    youMust: ['Always pass a word that names the state.', 'Pick the tone from what the state means.'],
    usage: '<Badge tone="positive">Online</Badge>',
    backdrops: 'The word is ink in both themes. The glyph uses the status marks, which have a lighter step in dark. The amber triangle keeps an ink edge so it holds 3:1 on light plastic.',
    purpose: 'Prints the state of a device as a shaped lamp and a word, flat on the case.',
    importLine: "import { Badge } from 'dial-react';",
    overview: (
      <>
        <p><code>Badge</code> is printing, not a control. <code>tone</code> sets the lamp, with a ring for neutral, a dot for positive, a triangle for warning, a square for critical and a diamond for info. The children are the word, and the word is required. <code>count</code> prints a number before it, as in 3 offline.</p>
      </>
    ),
    hero: ex('BadgeBasic', 'A green dot and the word Online, printed flat.'),
    ladder: [
      ex('BadgeTones', 'Five tones, five shapes, each with its word.'),
      ex('BadgeCount', 'count prints a number in tabular figures before the word.'),
      ex('BadgeInList', 'Each row of a list ends with one badge.'),
      ex('BadgeSummary', 'A summary line of counts.'),
      ex('BadgeInUnit', 'On a unit the badge is printed under the display, beside the model name.'),
    ],
    whenToUse: ['Show the state of a device in a list or on a unit.', 'Count devices in a state.'],
    whenNotToUse: [['The person can press it', 'Chip'], ['A value that changes', 'Display'], ['A message that needs a reply', 'Toast']],
    anatomy: [['Lamp', 'A glyph of control.mark + space.0-5, filled with status.*-mark; neutral is a text.secondary ring.'], ['Count', 'Tabular figures, type.weight-medium.'], ['Word', 'type.caption in text.primary.']],
    states: [['Forced colours', 'Glyphs in the text colour; the shapes still differ.']],
    content: ['Name the state in one to three words, such as Online or Door open.', 'With a count, use lowercase after the number, as in 3 offline.'],
    dodont: [
      { do: 'Print a glyph and a word.', dont: 'Show a coloured dot with no word.' },
      { do: 'Keep the badge on the text line.', dont: 'Float a coloured pill over a corner.' },
    ],
    a11y: ['The word is real text, so it is read as it is printed.', 'The glyph is hidden from assistive tech because the word says the same.', 'Each tone has its own shape, so colour is never the only cue.', 'The word holds 4.5:1; the glyphs hold 3:1, the amber one through its ink edge.'],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/chip', 'Chip', 'The person can press it.'], ['/components/display', 'Display', 'A value that changes.'], ['/components/progress', 'Progress', 'How far a task has run.']],
  },
  {
    name: 'Progress',
    slug: 'progress',
    status: 'beta',
    limitations: ['There is no circular form.', 'The groove has no steps or markers for the phases of a cycle.', 'The indeterminate form does not move, by design.'],
    youMust: ['Give every progress bar a label that names the task.', 'Pass valueText in the unit people wait for, such as minutes left.', 'Switch from indeterminate to a value as soon as the device reports one.'],
    usage: '<Progress label="Washer" value={55} valueText="38 min left" />',
    backdrops: 'The groove is a recess one step darker than the body, and the fill is printing ink at full step, in both themes. The fill is never orange.',
    purpose: 'Shows how far a device task has run, as a groove in the body that fills with ink.',
    importLine: "import { Progress } from 'dial-react';",
    overview: (
      <>
        <p><code>Progress</code> prints its <code>label</code> and reading on one line and fills a recessed groove to <code>value</code> out of <code>max</code>. The reading is <code>valueText</code>, or the percent. Leave <code>value</code> out for the indeterminate form, a still row of ink ticks and the word Working. It does not loop, because nothing in dial moves while idle.</p>
      </>
    ),
    hero: ex('ProgressBasic', 'A washer cycle with the time left printed above the groove.'),
    ladder: [
      ex('ProgressSizes', 'size is md (an 8px groove, the default) or sm (4px).'),
      ex('ProgressLevels', 'Not started, part way and done.'),
      ex('ProgressIndeterminate', 'Without a value the groove shows still ticks and says Working.'),
      ex('ProgressControlled', 'Driven by the device, with max in megabytes and a reading to match.'),
      ex('ProgressInUnit', 'The display says the state and the groove says how far the task has run.'),
    ],
    whenToUse: ['A task with a known end, such as a wash cycle or an update.', 'Under the display of a running unit.'],
    whenNotToUse: [['A level that goes up and down', 'Grille'], ['The person sets the amount', 'Slider'], ['Only the time left matters', 'Display']],
    anatomy: [['Label line', 'type.caption, with the label in text.primary and the reading in text.secondary with tabular figures.'], ['Groove', 'surface.sunken, elevation.well, corner.round, control.track or width.bar tall.'], ['Fill', 'grille.hole-on from the start of the line.'], ['Ticks', 'Twelve control.tick capsules of grille.hole-on, still.']],
    states: [['New value', 'The fill grows in motion.fill.'], ['Indeterminate', 'Still ticks, no aria-valuenow.'], ['Reduce motion', 'The fill jumps at once.']],
    content: ['The label names the task, such as Washer or Firmware update.', 'valueText says what people wait for, as in 38 min left or 12 of 48 MB.'],
    dodont: [
      { do: 'Print the reading in words.', dont: 'Leave people to judge the fill by eye.' },
      { do: 'Show a still pattern when the end is unknown.', dont: 'Loop a stripe for as long as the task runs.' },
    ],
    a11y: ['role progressbar with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext.', 'The indeterminate form leaves out aria-valuenow, as ARIA asks.', 'The label is required and names the bar through aria-labelledby.', 'Nothing moves on its own, so there is nothing to pause.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/grille', 'Grille', 'A level that goes up and down.'], ['/components/display', 'Display', 'The time left as a number.']],
  },
  {
    name: 'Card',
    slug: 'card',
    status: 'beta',
    limitations: ['A card is not a link or a button. Put a key inside it for the action.', 'There is no selected or pressed state for the whole card.', 'The corner follows the measured short side, so it is set after the first layout in the browser.'],
    youMust: ['Give a card shown as a section or article a name, with a heading inside it or aria-label.', 'Keep at most one orange part in a card.', 'Never use the model name as the only name of the card.'],
    usage: '<Card header={<Heading level={3}>Washer</Heading>} wordmark="dial" model="wash 1">…</Card>',
    backdrops: 'The body is warm white plastic in light and charcoal in dark. The shadow always falls down and to the right, 3px deep, and the printing keeps 4.5:1 on both.',
    purpose: 'Holds one unit of content on a rounded plastic body, with its corner set by its own short side.',
    importLine: "import { Card } from 'dial-react';",
    overview: (
      <>
        <p><code>Card</code> is the body of a unit, one rounded rectangle of matte plastic lit from the top left. Its corner is 0.16 of its short side and never more than 28px, so a small card has a small corner and a wide panel stays firm. <code>padding</code> sets the inset to <code>sm</code>, <code>md</code> (the default), <code>lg</code>, or <code>unit</code>, which follows the short side like a device. <code>header</code> and <code>footer</code> are optional rows, and <code>wordmark</code> and <code>model</code> print on the bottom edge. A Display inside it nests its corner.</p>
      </>
    ),
    hero: ex('CardBasic', 'A card with a title, a state line, a main key and its printing.'),
    ladder: [
      ex('CardPadding', 'padding is sm, md (the default), lg or unit.'),
      ex('CardSlots', 'header and footer are optional; the body alone is a card too.'),
      ex('CardPrinted', 'as="section" with a heading; the wordmark and model are printing.'),
      ex('CardList', 'Small cards in a list.'),
      ex('CardWithDisplay', 'A Display inside the card nests its corner.'),
    ],
    whenToUse: ['Hold one room, one device or one topic as a unit.', 'Group a state line with the keys that act on it.'],
    whenNotToUse: [['A whole appliance with a display and a knob', 'DeviceCard'], ['Only spacing between blocks', 'Stack']],
    anatomy: [['Body', 'unit.bg (surface.solid), unit.shadow (elevation.unit), radius unit.radius-ratio × short side capped at corner.panel.'], ['Inset', 'gap.2xl, gap.inset or gap.section; unit.inset-ratio × short side for padding unit.'], ['Header, content, footer', 'Rows with gap.xl between them.'], ['Printing', 'Wordmark type.body medium; model type.caption in text.secondary, lowercase.']],
    states: [['Rest', 'Raised 3px with a short shadow down and to the right.'], ['Resized', 'Corner and unit inset follow the new short side.']],
    content: ['Name the room or device in the header.', 'One short line of state, in sentence case.', 'Print the model in lowercase with a number, as in wash 1.'],
    dodont: [
      { do: 'Keep one orange key in a card.', dont: 'Put two orange keys in one card.' },
      { do: 'Use gaps between the parts of one card.', dont: 'Put a card inside a card or split it with lines.' },
    ],
    a11y: ['Card renders as the element you pass in, one of div, section, article or li. A section or article needs a name.', 'The body is never focusable; Tab goes to the controls inside it.', 'The printing is real text with 4.5:1 contrast on the plastic.', 'In forced colours the body keeps a 1px border.'],
    keyboard: [['Tab', 'Moves to the first control inside the card, never to the body', 'Card: Tab never stops on the body, only on the keys inside it']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/device-card', 'DeviceCard', 'The unit is a whole appliance.'], ['/components/stack', 'Stack', 'Only spacing, no body.']],
  },
  {
    name: 'DeviceCard',
    slug: 'device-card',
    status: 'beta',
    limitations: ['There is one knob per card. A second dial needs its own Rotary in children.', 'The layout switches to one column below a set width; there is no in-between layout.', 'The knob and the fader do not talk to the device. Wire their values to your own state.'],
    youMust: ['Keep the display in step with the device. Pass its current reading as well as the set value.', 'Give the key row a name with keysLabel.', 'Use either a knob or a primary key as the orange part, not both.'],
    usage: '<DeviceCard model="tuner 1" display={{ label: \'Radio\', value: \'88.6\', unit: \'MHz\' }} knob={{ label: \'Tuning\' }} keys={[{ label: \'FM\' }, { label: \'AM\' }]} />',
    backdrops: 'The body is warm white plastic in light and charcoal in dark, 3px above the page like anchor A. The knob and the primary key stay the same orange in both themes; the LCD and OLED windows keep their own inks.',
    purpose: 'Shows one appliance with its display, its one orange control, its keys and its printing, laid out from anchor A.',
    importLine: "import { DeviceCard } from 'dial-react';",
    overview: (
      <>
        <p><code>DeviceCard</code> is a Card with the system’s own parts mounted on it. <code>display</code> is the window across the top. <code>knob</code> is the orange Rotary, 0.36 of the short side; with no knob, <code>primary</code> is the orange key. <code>keys</code> are plastic keys, <code>meter</code> a Grille and <code>fader</code> a ruler Slider. <code>layout</code> is <code>a</code> (anchor A, the default), <code>tall</code> or <code>compact</code>. Below the width where two columns hold 44px parts, every part takes its own row.</p>
      </>
    ),
    hero: ex('DeviceCardAnchor', 'Anchor A, the card the system is built from, is a radio with all its parts.'),
    ladder: [
      ex('DeviceCardThermostat', 'layout="tall" puts everything in one column, with the knob centred under the display.'),
      ex('DeviceCardSpeaker', 'layout="compact" puts the knob right of an OLED window.'),
      ex('DeviceCardLamp', 'With no knob, the primary key is the orange part.'),
      ex('DeviceCardWasher', 'With a knob, every key stays plastic.'),
      ex('DeviceCardNarrow', 'On a narrow body the parts stack in one column.'),
    ],
    whenToUse: ['Show one device with its state and the controls that change it.', 'A device with one main value, or one main action.'],
    whenNotToUse: [['A unit with text and keys but no display', 'Card'], ['Only the knob, in your own layout', 'Rotary']],
    anatomy: [['Body', 'Card with padding unit, unit.inset-ratio × short side, and elevation.unit.'], ['Display', 'The first row, across the inner width.'], ['Knob', 'Rotary kind primary, unit.knob-ratio × short side.'], ['Keys', 'Button or IconButton kind key, gap.lg apart.'], ['Meter and fader', 'Grille and Slider with its ruler scale.'], ['Printing', 'Wordmark bottom-left, model bottom-right.']],
    states: [['Rest', 'The body sits 3px above the page.'], ['Narrow', 'Every part takes its own row.'], ['No knob', 'The primary key takes the knob’s place in orange.']],
    content: ['Name the device in display.label, as in Thermostat.', 'Print the model in lowercase with a number, as in thermostat 1.', 'Name each part by what it sets, such as Temperature or Volume.'],
    dodont: [
      { do: 'Use one orange part, which is the knob, or the primary key when there is no knob.', dont: 'Add an orange key next to the orange knob.' },
      { do: 'Show a grille only when it carries a level.', dont: 'Add a grille as decoration.' },
    ],
    a11y: ['The body is a region named by the display label, or by aria-label.', 'The display is a polite live region and never a control.', 'Tab order is the knob or primary key first, then the keys, then the fader.', 'Every part keeps a 44px target, on a 375px phone too.'],
    keyboard: [['Tab', 'Goes to the knob first, then the keys and the fader', 'DeviceCard: Tab reaches the knob first, after the display'], ['Arrow keys', 'Turn the knob or move the fader one step', 'Rotary: arrow keys turn one step and Home and End reach the ends']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/card', 'Card', 'A unit with no display or knob.'], ['/components/rotary', 'Rotary', 'Only the knob.'], ['/components/display', 'Display', 'Only the window.']],
  },
  {
    name: 'RangeSlider',
    slug: 'range-slider',
    status: 'beta',
    limitations: ['There is no vertical form; the groove always runs along the line of text.', 'There are always two caps; a band with more stops is not supported.', 'When both caps stand on one value they overlap, and the focused cap is drawn on top.'],
    youMust: ['Give every range a label that names the band.', 'Put the unit in formatValue so both values say it.', 'Keep the range plastic, because the orange belongs to the unit’s knob.'],
    usage: '<RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale />',
    backdrops: 'In light both caps are warm white plastic over a light grey groove, in dark they are charcoal over a darker groove. The band is told by darker, thicker ruler ticks in both themes, and nothing is orange.',
    purpose: 'Sets a band between a low and a high end, as two plastic caps in one groove that stop at each other.',
    importLine: "import { RangeSlider } from 'dial-react';",
    overview: (
      <>
        <p><code>RangeSlider</code> is Slider with two caps. Both 24 by 32px caps ride one recessed groove under the printed ruler, and each is its own <code>role="slider"</code> with a 44px target. The value is a pair, <code>[low, high]</code>. The caps stop at each other, and <code>minGap</code> keeps them apart. Ticks inside the band print in full ink at twice the stroke; the groove stays empty. Each cap settles into the nearest step on the spring (mass 1.4, stiffness 520, damping 46).</p>
      </>
    ),
    hero: ex('RangeSliderBasic', 'A heating band from 18 to 22 °C.'),
    ladder: [
      ex('RangeSliderScale', 'The ruler is always there; scale adds the numerals.'),
      ex('RangeSliderGap', 'minGap keeps the band at least two steps wide.'),
      ex('RangeSliderControlled', 'Controlled with value and onValueChange, with named caps.'),
      ex('RangeSliderInUnit', 'Under the orange knob, as the band around its target.'),
      ex('RangeSliderStates', 'A disabled range loses both caps’ height.'),
    ],
    whenToUse: ['Set a band with a low and a high end.', 'Show where the band sits in the whole range.'],
    whenNotToUse: [['One amount', 'Slider'], ['The main setting of the unit', 'Rotary'], ['A level that is only read', 'Meter']],
    anatomy: [['Label and values', 'type.label in type.weight-medium; both values in tabular figures.'], ['Ruler', 'width.hairline ticks in text.secondary; inside the band width.ring in text.primary.'], ['Groove', 'control.track tall, surface.sunken, elevation.well, a line.ring edge.'], ['Caps', 'control.cap-w by control.cap-h, surface.raised, elevation.part, an ink line; each in a layout.touch target.'], ['Numerals', 'type.micro, tabular, text.secondary.']],
    states: [['Hover', 'The cap’s ink line darkens one step. No lift.'], ['Dragging', 'The nearer cap follows the pointer and stops at the other.'], ['Released', 'Settles into the nearest step on the spring; at once with reduced motion.'], ['Disabled', 'No cap shadows, opacity.disabled.']],
    content: ['Name the band, such as Heating band or Quiet hours.', 'Put the unit in formatValue, not in the label.', 'Name the caps with lowLabel and highLabel when Low and High are not the right words.'],
    dodont: [
      { do: 'Show the band with the ruler printing.', dont: 'Fill the groove between the caps with a colour.' },
      { do: 'Use one range for one band.', dont: 'Use two Sliders that let the low end pass the high end.' },
    ],
    a11y: ['Each cap has role slider with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext; its min or max is the other cap’s value.', 'Each cap is named by the label and its own name, such as Heating band Low, through aria-labelledby.', 'The two caps sit in a group named by the label.', 'Every value can be reached with keys or a single press on the track, with no drag.'],
    keyboard: [['Tab', 'Move from the low cap to the high cap', 'RangeSlider: Tab reaches each cap and the focus ring shows on it'], ['Arrow keys', 'Move the focused cap one step', 'RangeSlider: arrow keys move one cap one step and the caps never cross'], ['Page Up / Page Down', 'Move a larger step', 'RangeSlider: Page Up and Page Down move more than one step'], ['Home / End', 'Move the focused cap as far as it may go', 'RangeSlider: Home and End stop each cap at the other one']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/slider', 'Slider', 'One amount, one cap.'], ['/components/rotary', 'Rotary', 'The main setting, as the orange knob.']],
  },
  {
    name: 'Scrubber',
    slug: 'scrubber',
    status: 'beta',
    limitations: ['There is no preview of the frame under the pointer.', 'Chapter titles are announced but not printed; only their marks are drawn.', 'There is no vertical form.'],
    youMust: ['Give every scrubber the title of what is playing as its label.', 'Pass duration in seconds, and value in seconds when a player drives it.', 'Keep the scrubber plastic, because the orange belongs to the play key.'],
    usage: '<Scrubber label="Ruhe, side A" duration={225} defaultValue={83} />',
    backdrops: 'In light the cap is warm white plastic over a light grey groove and the buffered stretch is a thin line in line.ring; in dark the same parts run in charcoal. Nothing fills behind the cap and nothing is orange.',
    purpose: 'Shows and changes the position in a track or a video, as a plastic cap in a groove with the times printed under it.',
    importLine: "import { Scrubber } from 'dial-react';",
    overview: (
      <>
        <p><code>Scrubber</code> is a fader for time. The 24 by 32px cap rides the recessed groove at <code>value</code> out of <code>duration</code>, both in seconds. The elapsed time is printed under the start and the remaining time under the end, in tabular figures. <code>chapters</code> print ink marks above the groove and <code>buffered</code> draws the loaded stretch as a thin line along its floor. The value text reads 1:23 of 3:45. Arrows move 5 seconds and Page Up and Page Down 30.</p>
      </>
    ),
    hero: ex('ScrubberBasic', 'A track at 1:23 of 3:45.'),
    ladder: [
      ex('ScrubberBuffered', 'buffered draws the loaded stretch as a thin line.'),
      ex('ScrubberChapters', 'chapters print marks above the groove.'),
      ex('ScrubberControlled', 'Driven by a player, under the orange play key.'),
      ex('ScrubberLong', 'Over an hour, the times print hours.'),
      ex('ScrubberStates', 'Disabled while nothing is loaded.'),
    ],
    whenToUse: ['Show and change the position in a track or a video.', 'Print the elapsed and remaining time at a glance.'],
    whenNotToUse: [['How far a device task has run', 'Progress'], ['An amount the person sets', 'Slider']],
    anatomy: [['Label', 'type.label in type.weight-medium.'], ['Chapter marks', 'width.ring in text.primary, control.mark tall.'], ['Groove', 'control.track tall, surface.sunken, elevation.well, a line.ring edge.'], ['Buffered', 'width.ring tall, line.ring, along the groove floor.'], ['Cap', 'control.cap-w by control.cap-h, surface.raised, elevation.part, an ink line.'], ['Times', 'type.micro, tabular, text.secondary.']],
    states: [['Playing', 'The cap steps with the time, no spring.'], ['Hover', 'The cap’s ink line darkens one step. No lift.'], ['Seek by key', 'Travels on the spring; at once with reduced motion.'], ['Disabled', 'No cap shadow, opacity.disabled.']],
    content: ['The label says what is playing.', 'Leave the times to the scrubber; the label carries none.'],
    dodont: [
      { do: 'Keep the scrubber plastic under an orange play key.', dont: 'Fill the played part in red behind a round dot.' },
      { do: 'Print the elapsed and remaining time all the time.', dont: 'Show the time only in a bubble on hover.' },
    ],
    a11y: ['The track has role slider with aria-valuemin 0, aria-valuemax the duration, aria-valuenow and aria-valuetext such as 1:23 of 3:45.', 'A chapter title is added to the value text while the cap is inside it.', 'The label is the accessible name, through aria-labelledby.', 'Every position can be reached with keys or a single press on the track, with no drag.'],
    keyboard: [['Arrow keys', 'Move 5 seconds', 'Scrubber: arrow keys move five seconds and Home and End reach the ends'], ['Page Up / Page Down', 'Move 30 seconds', 'Scrubber: Page Up and Page Down move thirty seconds'], ['Home / End', 'Go to the start or the end', 'Scrubber: arrow keys move five seconds and Home and End reach the ends']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/progress', 'Progress', 'How far a task has run.'], ['/components/slider', 'Slider', 'An amount the person sets.']],
  },
  {
    name: 'Meter',
    slug: 'meter',
    status: 'beta',
    limitations: ['There is no round dial form.', 'A range has at most three regions, as on the HTML meter.', 'Region names longer than their span are cut with an ellipsis on screen; the full name is still announced.'],
    youMust: ['Give every meter a label that names what is read.', 'Put the unit in formatValue, or the whole reading in valueText.', 'Name the regions in the words people use for that reading.'],
    usage: '<Meter label="Battery" value={18} low={20} high={80} formatValue={(v) => `${v} %`} />',
    backdrops: 'The scale is a recess one step darker than the body with printed ink ticks and an ink needle, in both themes. Region glyphs take the positive and critical marks only with optimum, and the shape and word always say the region. Nothing is orange.',
    purpose: 'Reads a level in a known range, as a printed scale with one ink needle, and names its region with a glyph and a word.',
    importLine: "import { Meter } from 'dial-react';",
    overview: (
      <>
        <p><code>Meter</code> prints its <code>label</code> and reading on one line and stands an ink needle at <code>value</code> on a printed scale from <code>min</code> to <code>max</code>. <code>low</code> and <code>high</code> split the range into up to three regions. The reading then carries a glyph (down point, disc, up point) and the region word, and the names are printed under the scale. <code>optimum</code> marks the preferred region. A meter is read and never set, so it takes no focus and nothing on it moves.</p>
      </>
    ),
    hero: ex('MeterBasic', 'A battery at 64 %.'),
    ladder: [
      ex('MeterRegions', 'low and high give three regions, each with its own glyph.'),
      ex('MeterOptimum', 'optimum marks the preferred region.'),
      ex('MeterValueText', 'valueText and regionLabels for water hardness.'),
      ex('MeterSignal', 'A range below zero, in decibels.'),
      ex('MeterInUnit', 'Under the display of a purifier.'),
    ],
    whenToUse: ['A level in a known range, such as a battery or the water.', 'A range with regions people care about.'],
    whenNotToUse: [['How far a task has run', 'Progress'], ['Activity such as sound', 'Grille'], ['The unit’s one state', 'Display']],
    anatomy: [['Label line', 'type.caption, with the label in text.primary, the value in text.secondary with tabular figures, the region word in type.weight-medium.'], ['Glyph', 'control.mark plus 2px, text.primary; status.positive-mark or status.critical-mark with optimum.'], ['Scale', 'control.badge tall, surface.sunken, elevation.well, a line.ring edge, control.tick and control.mark ticks.'], ['Needle', 'width.ring in text.primary.'], ['Region names', 'type.micro in text.secondary; the current one in text.primary and medium weight.']],
    states: [['New value', 'The needle moves at once, no sweep.'], ['In a region', 'Glyph and word after the reading.'], ['Preferred region', 'Positive mark in it, critical mark two regions away.']],
    content: ['The label names what is read, such as Battery or Air quality.', 'regionLabels in the words of the trade, such as Soft, Medium and Hard.'],
    dodont: [
      { do: 'Name the region with a glyph and a word.', dont: 'Paint a gauge arc from green to red.' },
      { do: 'Use a meter for a level that goes up and down.', dont: 'Use a meter for a task that runs to its end.' },
    ],
    a11y: ['role meter with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext.', 'With regions, the value text adds the region word, such as 18 %, Low.', 'The label is required and names the meter through aria-labelledby.', 'Regions have their own glyph shape and word, so colour never carries them alone (WCAG 1.4.1).'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/progress', 'Progress', 'How far a task has run.'], ['/components/grille', 'Grille', 'Activity shown in holes.']],
  },
  {
    name: 'Sheet',
    slug: 'sheet',
    status: 'beta',
    limitations: ['There is one size only.', 'Only a docked sheet can be dragged; a sheet at the end edge closes from its key, Escape or the scrim.', 'The header scrolls with the controls when the sheet is taller than the screen.'],
    youMust: ['Give every sheet the device name as its title.', 'Make the controls inside act at once; a sheet has no Save key.', 'Close it from onOpenChange when you control open.'],
    usage: '<Sheet open={open} onOpenChange={setOpen} title="Living room lamp" model="lamp 02"><Slider label="Brightness" max={100} step={10} defaultValue={60} /></Sheet>',
    backdrops: 'The sheet is warm white plastic in light and charcoal in dark, over a plain warm ink scrim with no blur. The drag bar is printed in the primary ink in both themes.',
    purpose: 'Holds every control of one device at once, rising from the bottom edge of a phone and standing as its own unit at the lower end of a wide screen.',
    importLine: "import { Sheet } from 'dial-react';",
    overview: (
      <>
        <p><code>Sheet</code> is the native <code>dialog</code> element opened with <code>showModal()</code>, family of <code>Dialog</code>. On a screen taller than it is wide it docks to the bottom edge with a 32 by 4px ink bar to drag it down; otherwise it stands 24px in from the lower inline end, at most the reading measure wide. It slides in over 245ms and out over 120ms, at once under reduced motion. It closes from the 44px close key in its header, Escape, a click on the scrim, or a drag past a quarter of its height.</p>
      </>
    ),
    hero: ex('SheetBasic', 'A lamp’s display, two faders and a schedule switch, opened from a key.'),
    ladder: [
      ex('SheetTrigger', 'trigger opens the sheet without any state of your own.'),
      ex('SheetBottom', 'placement bottom docks it on every screen, with the bar to drag.'),
      ex('SheetEnd', 'placement end keeps it a unit at the lower end.'),
      ex('SheetActions', 'actions holds keys that are not controls, at the bottom.'),
      ex('SheetInPlace', 'modal false shows the docked sheet in the page.'),
    ],
    whenToUse: ['Show every control of one device.', 'Change several settings in a row, each acting at once.'],
    whenNotToUse: [['Asking before an action', 'Dialog'], ['Saying an action worked', 'Toast']],
    anatomy: [['Body', 'surface.solid, corner.panel, gap.inset padding, elevation.float with a lit top-left hairline.'], ['Scrim', 'surface.scrim, plain, no blur, layer.overlay.'], ['Bar', 'control.cap-h by width.bar in text.primary, square ends, on a control.sm strip.'], ['Header', 'Heading level 3, the lowercase model name in type.caption, a 44px IconButton.'], ['Controls', 'A grid gap.xl apart.']],
    states: [['Open', 'Slides in from its edge over motion.release on motion.easing.'], ['Dragging', 'Follows the pointer with no transition.'], ['Closing', 'Slides out over motion.exit on motion.easing-exit.'], ['Reduced motion', 'No slide and no fade.']],
    content: ['The title is the device name, such as Living room lamp.', 'Control labels are nouns, such as Brightness and Warmth.'],
    dodont: [
      { do: 'Let each control act at once.', dont: 'Add a Save key to a sheet of controls.' },
      { do: 'Put the device display first.', dont: 'Open on a list of rare actions.' },
    ],
    a11y: ['It is a native modal dialog, so focus is trapped and the page behind is inert.', 'aria-labelledby points at the device name.', 'Focus goes to the sheet itself on open and returns to the opener on close.', 'The drag bar is hidden from assistive tech; the close key and Escape are the keyboard’s way out.'],
    keyboard: [['Enter / Space on the opener', 'Opens the sheet', 'Sheet: Enter on the opener shows a modal sheet named by the device'], ['Tab / Shift+Tab', 'Moves between keys inside the sheet', 'Sheet: Tab and Shift+Tab stay inside the sheet'], ['Escape', 'Closes the sheet and returns focus', 'Sheet: Escape closes the sheet and focus returns to the opener']],
    inherits: 'HTMLAttributes<HTMLDialogElement>',
    related: [['/components/dialog', 'Dialog', 'Ask one question instead of showing controls.'], ['/components/slider', 'Slider', 'The faders in the sheet.']],
  },
  {
    name: 'Banner',
    slug: 'banner',
    status: 'beta',
    limitations: ['There is one size only.', 'The banner does not remove itself; the screen removes it when the condition ends or onDismiss runs.', 'It has no motion; it appears and goes at once.'],
    youMust: ['Remove the banner when the condition ends.', 'Leave out onDismiss while a condition blocks controls.', 'Show one banner per region.'],
    usage: '<Banner tone="critical" status="Offline">The hub is offline. Controls will work again when it reconnects.</Banner>',
    backdrops: 'The strip is warm white plastic in light and charcoal in dark, with a short shadow down and to the right. Only the glyph takes the tone’s mark ink; nothing is orange.',
    purpose: 'Says in a glyph, a word and a message what condition holds on a screen, and stays in place until it ends.',
    importLine: "import { Banner } from 'dial-react';",
    overview: (
      <>
        <p><code>Banner</code> is one plastic strip in the flow at <code>elevation.unit</code> with the 12px media radius: a 20px glyph and a status word, the message, an optional plastic action key and an optional 44px round dismiss key. It is <code>role="status"</code>, or <code>role="alert"</code> when critical. The glyphs are Toast’s. There is no start-edge stripe, no tint and no disc. When the strip is narrow the keys wrap under the message.</p>
      </>
    ),
    hero: ex('BannerBasic', 'A glyph, the status word, what happens next and one key.'),
    ladder: [
      ex('BannerTones', 'The four tones on the same plastic, each with its own glyph and word.'),
      ex('BannerDismiss', 'onDismiss adds the round dismiss key.'),
      ex('BannerActionDismiss', 'One action key and the dismiss key together.'),
      ex('BannerCondition', 'The banner goes when the condition ends.'),
      ex('BannerInRoom', 'At the top of the room it speaks for.'),
    ],
    whenToUse: ['Say a condition that holds, such as the hub being offline.', 'Say that something needs care soon.'],
    whenNotToUse: [['Saying an action worked', 'Toast'], ['The state of one device', 'Badge']],
    anatomy: [['Strip', 'surface.solid, corner.media, elevation.unit with a lit top-left hairline.'], ['Glyph', 'control.icon-md, stroked at width.ring in the tone’s mark ink.'], ['Status word', 'type.label, type.weight-medium.'], ['Message', 'type.body, text.primary.'], ['Keys', 'A Button and a 44px IconButton, gap.sm apart.']],
    states: [['Shown', 'In the flow at once, announced politely.'], ['Critical', 'role alert, announced at once.'], ['Forced colours', 'A real border; the glyph in the text colour.']],
    content: ['The status word names the condition, such as Offline.', 'Say what holds and what happens next, in the present tense.'],
    dodont: [
      { do: 'Tell the tone with a glyph and a word.', dont: 'Paint a coloured stripe on the start edge.' },
      { do: 'Keep one banner per region.', dont: 'Stack three banners above the controls.' },
    ],
    a11y: ['role="status" announces politely; the critical tone uses role="alert".', 'The glyph is hidden; the status word carries the tone.', 'The dismiss key is named by dismissLabel and is 44px.', 'A banner never takes focus when it appears.'],
    keyboard: [['Tab', 'Reaches the action and dismiss keys', 'Banner: Tab reaches the dismiss key, it is at least the touch target and shows the focus ring'], ['Enter / Space', 'Runs the action or dismisses', 'Banner: Enter on the dismiss key calls onDismiss']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/toast', 'Toast', 'Say what just happened.'], ['/components/badge', 'Badge', 'The state of one device.']],
  },
  {
    name: 'EmptyState',
    slug: 'empty-state',
    status: 'beta',
    limitations: ['There is one size only.', 'The drawing is one of two parts of the system; it takes no image or icon.', 'It paints no body; place it in a Card or on a page.'],
    youMust: ['Say what is missing and where in the title.', 'Give one key at most, orange only when filling the place is the screen’s main action.', 'Show progress, never an empty state, while a list is loading.'],
    usage: '<EmptyState drawing="display" title="No devices in the kitchen yet" action={<Button kind="primary">Add a device</Button>}>Plug one in near the hub, then add it here.</EmptyState>',
    backdrops: 'The words are printed in the primary and secondary inks of the surface below, warm white in light and charcoal in dark. The drawing is the LCD window or the grille holes of that theme.',
    purpose: 'Says what a room or a list is missing and the one step that fills it, with at most a quiet drawing made of an unlit display or an empty grille.',
    importLine: "import { EmptyState } from 'dial-react';",
    overview: (
      <>
        <p><code>EmptyState</code> is printing, with no body: an optional drawing, the line at <code>type.emphasis</code> in medium weight, one sentence in <code>text.secondary</code> up to the reading measure, and one key, all start-aligned with 8px between them. The drawing is a small LCD <code>Display</code> reading two dashes or a 12 by 3 <code>Grille</code> with nothing lit, and it is hidden from screen readers.</p>
      </>
    ),
    hero: ex('EmptyStateBasic', 'An empty room with the unlit display and the room’s one orange key.'),
    ladder: [
      ex('EmptyStateGrille', 'drawing grille, with a plastic key.'),
      ex('EmptyStateWordsOnly', 'Words only, for a list that fills by itself.'),
      ex('EmptyStatePlainKey', 'A plastic key when the orange key is elsewhere.'),
      ex('EmptyStateFilled', 'The empty state gives way to the list.'),
      ex('EmptyStateSearch', 'No results for a filter, with a key to clear it.'),
    ],
    whenToUse: ['A room or list with nothing in it yet.', 'A filter that leaves no results.'],
    whenNotToUse: [['Content still loading', 'Progress'], ['Something does not work', 'Banner']],
    anatomy: [['Drawing', 'Display size sm with two dashes, or Grille 12 by 3 at value 0.'], ['Line', 'type.emphasis, type.weight-medium, text.primary.'], ['Sentence', 'type.body, text.secondary, max type.measure.'], ['Key', 'One Button, gap.md above it.']],
    states: [['Empty', 'Drawing, line, sentence and key.'], ['Filled', 'The screen replaces it with the content.']],
    content: ['Say what is missing and where, ending in yet.', 'One sentence for the step, then the key as a verb.'],
    dodont: [
      { do: 'Use an unlit display or an empty grille.', dont: 'Use a stock illustration.' },
      { do: 'Start-align on the inset line.', dont: 'Centre a headline, a body and two buttons.' },
    ],
    a11y: ['The line and the sentence are plain text, read in order.', 'The drawing is aria-hidden; the line says the same in words.', 'The key is a native button, at least 44px tall.'],
    keyboard: [['Tab', 'Reaches the key', 'EmptyState: Tab reaches the key and it is at least the touch target']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/card', 'Card', 'The room it sits in.'], ['/components/banner', 'Banner', 'A condition that holds.']],
  },
  {
    name: 'List',
    slug: 'list',
    status: 'beta',
    limitations: ['A queue chooses one row at a time; there is no multiple selection yet.', 'Rows cannot be dragged to a new order yet.', 'There is no built in empty state; show your own words when the list has no rows.', 'Long lists are not windowed, so keep a list to a few hundred rows.'],
    youMust: ['Give every list a label or a heading that names it.', 'Give a switch or key at the end of a row a name that includes the row, such as the device name.', 'Keep one action per row. A row with href or onPress holds printing only at its end.'],
    usage: '<List label="Kitchen"><List.Item label="Ceiling lamp" description="On · 40%" trailing={<Switch aria-label="Ceiling lamp" />} /></List>',
    backdrops: 'In light the body is warm white plastic with the unit shadow; in dark it is charcoal. Names are primary ink and states secondary ink in both themes. The chosen row of a queue is an ink mark and weight, never orange.',
    purpose: 'Sets rows of devices or tracks on one plastic body, each with a glyph, a name, its state in words and one part at the end.',
    importLine: "import { List } from 'dial-react';",
    overview: (
      <>
        <p><code>List</code> is a compound component. Write each row as <code>List.Item</code> with a <code>label</code>, a <code>description</code> for the state in words, a <code>leading</code> glyph or a printed <code>index</code>, and one <code>trailing</code> part. Pass <code>href</code> to make the whole row a link with a printed chevron, or <code>onPress</code> to make it a button. Set <code>selectable</code> on the list to make it one listbox, as in a play queue, with <code>value</code> and <code>onValueChange</code>. The body is surface.solid with elevation.unit and corner.panel; rows are at least control.lg tall, kept apart by gap.xs, and a pressed row sinks into a corner.inner recess.</p>
      </>
    ),
    hero: ex('ListBasic', 'Devices in a room, each with its state in words and a switch at the end.'),
    ladder: [
      ex('ListLinks', 'href makes the whole row a link with a printed chevron.'),
      ex('ListQueue', 'selectable makes a queue, one listbox with one chosen row.'),
      ex('ListWithMenu', 'A Menu key at the end holds the rarer actions of a device.'),
      ex('ListLongNames', 'Thai and long names wrap; the part at the end keeps its place.'),
      ex('ListStates', 'onPress makes a row one button; a disabled row fades.'),
    ],
    whenToUse: ['Devices in a room, each with its state and one switch.', 'A queue or playlist with one playing track.'],
    whenNotToUse: [['One device with a display and several parts', 'DeviceCard'], ['Picking a value for a setting', 'Select']],
    anatomy: [['Body', 'surface.solid, elevation.unit, corner.panel, gap.md inset.'], ['Row', 'At least control.lg tall, gap.xl inline inset, corner.inner when pressed.'], ['Leading', 'control.icon-md glyph or a tabular index in text.secondary.'], ['Name and state', 'type.body in text.primary over type.label in text.secondary.'], ['End part', 'One Switch, IconButton, Menu or Badge; a chevron on a link row.']],
    states: [['Pressed', 'surface.sunken with elevation.well.'], ['Focus', 'width.ring in focus.ring inside the row.'], ['Chosen', 'An ink mark and type.weight-medium.'], ['Disabled', 'opacity.disabled.']],
    content: ['Name the row after the thing, such as Kitchen lamp.', 'Put the state in words under it, value first: On · 40%.'],
    dodont: [
      { do: 'Make the whole row the link to the device page.', dont: 'Put a small Open key at the end of a row.' },
      { do: 'Keep rows apart by the gap of the body.', dont: 'Draw a rule between every pair of rows.' },
    ],
    a11y: ['The list is a list with its count; give it a label when no heading names it.', 'A link row is one link and a button row one button, the full size of the row.', 'A queue is a listbox with aria-activedescendant; the chosen row has aria-selected and an ink mark, not colour alone.', 'Glyphs and printed numbers are hidden from assistive tech; the name carries the row.'],
    keyboard: [['Tab', 'Move to a link row, a button row or the part at the end', 'List: Tab reaches a link row and the focus ring shows'], ['Enter', 'Follow a link row or press a button row', 'List: a link row is one link the full size of the row and at least the touch target tall'], ['Up / Down / Home / End', 'Move the active row in a queue', 'List: in a queue the arrow keys, Home and End move the active row and Enter chooses it'], ['Enter / Space', 'Choose the active row in a queue', 'List: in a queue the arrow keys, Home and End move the active row and Enter chooses it']],
    inherits: 'HTMLAttributes<HTMLUListElement>',
    related: [['/components/card', 'Card', 'A unit with its own content.'], ['/components/menu', 'Menu', 'The actions at the end of a row.']],
  },
  {
    name: 'Menu',
    slug: 'menu',
    status: 'beta',
    limitations: ['There are no submenus.', 'There are no checkable or radio actions; use a Switch or a SegmentedControl for a setting.', 'Actions are words with an optional glyph; there is no second line of help text.'],
    youMust: ['Name the round key after the thing it belongs to, such as More for Kitchen lamp.', 'Start every action with a verb.', 'Mark every action that removes something for good as destructive.'],
    usage: '<Menu label="More for Kitchen lamp" items={actions} onAction={run} />',
    backdrops: 'In light the panel is warm white plastic and in dark charcoal, with the same short float shadow as Select. Words are ink in both themes; the critical lamp uses the status mark, which has a lighter step in dark.',
    purpose: 'Opens a plastic panel of actions from a key, such as Rename, Move to room and Remove for one device.',
    importLine: "import { Menu } from 'dial-react';",
    overview: (
      <>
        <p><code>Menu</code> is a menu button, built by hand on the WAI-ARIA pattern. The key is the system's IconButton with three dots (<code>trigger="icon"</code>, the default) or a Button with the label and a chevron (<code>trigger="word"</code>). It opens a panel of surface.solid with elevation.float and corner.inner on layer.overlay, placed on the page body so no clipping frame cuts it. The panel is at least the key's width and control.menu-min, grows to its longest action, flips above the key when there is more room there and shifts along it to stay on the screen. Pass <code>items</code> and <code>onAction</code>; a destructive item is printed last after a gap with the critical lamp before its word.</p>
      </>
    ),
    hero: ex('MenuBasic', 'A round key that opens the actions of one device.'),
    ladder: [
      ex('MenuWord', 'trigger="word" prints the label and a chevron on a capsule key.'),
      ex('MenuIcons', 'An icon on each action; the words line up in one column.'),
      ex('MenuThai', 'The panel grows to its longest action, Thai included.'),
      ex('MenuInClippedFrame', 'Inside a frame that clips, the panel still shows whole.'),
      ex('MenuStates', 'A disabled action stays in place; a disabled key cannot open.'),
    ],
    whenToUse: ['The rarer actions of one device: Rename, Move to room, Remove.', 'Three to six actions behind one small key.'],
    whenNotToUse: [['Picking a value for a setting', 'Select'], ['The one action a unit is for', 'Button']],
    anatomy: [['Key', 'IconButton (control.key, 44px) or a Button with a control.icon-sm chevron.'], ['Panel', 'surface.solid, elevation.float, corner.inner, layer.overlay, at least control.menu-min wide.'], ['Action', 'At least control.md tall, corner.media, type.body in text.primary.'], ['Glyph', 'control.icon-sm in text.secondary.'], ['Critical lamp', 'A filled square in status.critical-mark before the word, after gap.sm.']],
    states: [['Focus', 'width.ring in focus.ring around the key.'], ['Active action', 'surface.sunken with elevation.well, plus the ring from the keyboard.'], ['Disabled action', 'opacity.disabled.'], ['Disabled key', 'The key loses its height and fades.']],
    content: ['Start each action with a verb in sentence case.', 'Name a destructive action after what it removes.'],
    dodont: [
      { do: 'Put Remove last with its lamp.', dont: 'Paint the removal red or orange.' },
      { do: 'Name the key More for Kitchen lamp.', dont: 'Name every key More.' },
    ],
    a11y: ['The key is a button with aria-haspopup menu and aria-expanded, and aria-controls while open.', 'The panel has role menu and the key’s name; actions have role menuitem and take focus in turn.', 'A destructive action is a glyph and a word, never colour alone.', 'Escape and Tab close the menu and put focus back on the key; a press outside closes it.'],
    keyboard: [['Enter / Space / Down', 'Open the menu on the first action', 'Menu: Enter opens the menu with focus on the first action, and Escape closes it with focus back on the key'], ['Up', 'Open the menu on the last action', 'Menu: Up opens on the last action, and the arrows, Home and End move and wrap'], ['Arrow keys / Home / End', 'Move between actions', 'Menu: Up opens on the last action, and the arrows, Home and End move and wrap'], ['Letters', 'Move to the action that starts with the letter', 'Menu: type-ahead moves to the action that starts with the typed letter'], ['Enter / Space', 'Run the action and close', 'Menu: Enter runs the action, closes the menu and returns focus to the key'], ['Escape', 'Close with focus back on the key', 'Menu: Enter opens the menu with focus on the first action, and Escape closes it with focus back on the key']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/select', 'Select', 'Picks a value in the same panel.'], ['/components/list', 'List', 'The rows a menu key sits in.']],
  },
  {
    name: 'Skeleton',
    slug: 'skeleton',
    status: 'beta',
    limitations: ['It does not move, by design. There is no shimmer or pulse to turn on.', 'It does not know when the content arrives. The region around it sets aria-busy and swaps it out.', 'kind display draws digits only. A Display with the oled kind has no ghost form yet.'],
    youMust: ['Put aria-busy="true" and a name on the region the skeleton stands in.', 'Match the part that replaces it with the same digits, size and lines.', 'Replace it with an error and a way to try again if the request fails.'],
    usage: '<div aria-busy="true" aria-label="Thermostat, loading"><Skeleton kind="display" digits={3} unit="°C" /></div>',
    backdrops: 'Text lines, discs and blocks are flat plastic one step off the body in both themes. The display kind is the grey-green LCD window with ghost segments, and the grille kind uses the unlit hole colour. None of it is orange.',
    purpose: 'Holds the exact place of content that is still loading, drawn as the part with its power off.',
    importLine: "import { Skeleton } from 'dial-react';",
    overview: (
      <>
        <p><code>Skeleton</code> draws one part of a unit with the power off. <code>kind="text"</code> holds lines of text, <code>display</code> a Display window with ghost segments, <code>grille</code> unlit holes, <code>disc</code> a key or knob and <code>block</code> a chart or picture. It never moves. It is hidden from assistive tech; the region it stands in carries <code>aria-busy</code> and a name.</p>
      </>
    ),
    hero: ex('SkeletonBasic', 'A thermostat card loading, with a ghost window, a flat disc for the knob, unlit holes and one line.'),
    ladder: [
      ex('SkeletonKinds', 'kind is text (the default), display, grille, disc or block.'),
      ex('SkeletonSizes', 'size is sm, md (the default) or lg, matched to the part that replaces it.'),
      ex('SkeletonText', 'lines and lastLine hold a paragraph that ends short.'),
      ex('SkeletonListRow', 'A list of devices, one small disc and two lines per row.'),
      ex('SkeletonSwap', 'The reading lands in the box the ghost window held.'),
      ex('SkeletonInUnit', 'A washer card whose window, groove and start key wait as unlit parts.'),
    ],
    whenToUse: ['The first load of a card, a list or a reading whose shape you know.', 'A wait of more than a moment.'],
    whenNotToUse: [['A task with a known end', 'Progress'], ['A reading that has arrived, even an old one', 'Display']],
    anatomy: [['Text line', 'One line box of type.caption, type.body or type.title; a bar the cap height in surface.placeholder-hi, corner.mark.'], ['Ghost window', 'display.lcd-bg, elevation.well, Display’s padding and radius; every segment display.lcd-ghost.'], ['Unlit holes', 'grille.hole with elevation.well on the space.2 pitch.'], ['Disc and block', 'surface.placeholder-hi, no shadow; corner.round and corner.media.']],
    states: [['Loading', 'Still unlit parts; the region says aria-busy.'], ['Loaded', 'The content takes the same box.'], ['Reduce motion', 'The same; there is no motion.']],
    content: ['The region is named for what is loading: Thermostat, loading.', 'Hold the lines and digits the content usually has.'],
    dodont: [
      { do: 'Draw the parts the content will have.', dont: 'Fill the card with blocks that match nothing.' },
      { do: 'Keep it still.', dont: 'Sweep a shimmer across it for as long as the wait lasts.' },
    ],
    a11y: ['Skeleton is aria-hidden; screen readers hear the region’s name and its busy state.', 'Put aria-busy="true" on the region and set it back to false when the content lands.', 'Nothing moves, so there is nothing to pause.', 'It never takes focus.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/display', 'Display', 'The reading once it has arrived.'], ['/components/progress', 'Progress', 'A task with a known end.']],
  },
  {
    name: 'TimePicker',
    slug: 'time-picker',
    status: 'beta',
    limitations: ['There are no seconds.', 'There is no date. Pair it with the days in the hint or a Select.', 'The value is always HH:MM on the 24 hour clock; time zones are up to the product.'],
    youMust: ['Give every picker a label that says what happens at that time.', 'Pass hourLabel and minuteLabel in the product’s language.', 'Use hourCycle 12 only where people read the 12 hour clock.'],
    usage: '<TimePicker label="Night mode starts" defaultValue="22:30" />',
    backdrops: 'The well is a recess one step darker than the body with a hairline ring, in both themes. The figures are primary ink, and the unlit segments a quiet step of ink. Nothing is orange.',
    purpose: 'Sets a time of day as an hour and a minute in a recessed well, each field a spinbutton with set keys under it.',
    importLine: "import { TimePicker } from 'dial-react';",
    overview: (
      <>
        <p><code>TimePicker</code> holds an hour and a minute in Input’s recessed well. Each field is a spinbutton: arrows, PageUp and PageDown, Home and End, and typed digits. <code>kind="segment"</code> draws 7-segment figures with a pair of set keys under each field; <code>kind="text"</code> sets the grotesk with no keys. With <code>hourCycle="12"</code> the hour stops at 12 and AM and PM are printed. The value is <code>HH:MM</code> on the 24 hour clock.</p>
      </>
    ),
    hero: ex('TimePickerBasic', 'When night mode starts, with figures in the well and set keys under each field.'),
    ladder: [
      ex('TimePickerKinds', 'kind is segment (the default) or text.'),
      ex('TimePickerTwelveHour', 'hourCycle 12 prints AM and PM and marks the current one.'),
      ex('TimePickerStates', 'Not set, invalid, read only and disabled.'),
      ex('TimePickerMinuteStep', 'minuteStep 5 for arrows and keys; typed minutes stay exact.'),
      ex('TimePickerControlled', 'Controlled start and end, with the length of the night.'),
      ex('TimePickerThai', 'Thai labels, hint and key names.'),
      ex('TimePickerInUnit', 'A night schedule unit with a display, a picker, a switch and the one orange key.'),
    ],
    whenToUse: ['A time of day that repeats: a schedule, a wake-up time.', 'The start and end of a period, as a pair.'],
    whenNotToUse: [['A length of time', 'Input'], ['A few fixed times', 'Select'], ['Showing the time', 'Display']],
    anatomy: [['Label', 'type.label medium, text.primary, above the well.'], ['Well', 'surface.sunken, elevation.well, line.ring hairline, corner.media.'], ['Fields', 'At least control.md wide and control.lg tall; figures on space.10 cells in text.primary, unlit in surface.quiet.'], ['AM and PM', 'type.caption; the current one text.primary medium with a lit lamp.'], ['Set keys', 'IconButton keys, 44px, under each field.']],
    states: [['Focused field', 'focus.ring around its cell on surface.quiet.'], ['Invalid', 'status.critical-mark well edge, glyph and words.'], ['Disabled', 'No well shadow, figures at opacity.disabled, no keys.'], ['Reduce motion', 'Segments switch with no fade.']],
    content: ['The label says what the time does: Night mode starts.', 'Days and time zone go in the hint.'],
    dodont: [
      { do: 'Name what happens at that time.', dont: 'Label the field Time.' },
      { do: 'Keep the picker in ink; the orange key acts.', dont: 'Make the time the unit’s orange control.' },
    ],
    a11y: ['role group named by the label; each field is role spinbutton with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext.', 'Arrows, PageUp, PageDown, Home, End and digits set each field; left and right arrows move between fields.', 'The set keys are 44px and left out of the tab order, because the arrows do the same.', 'The label line box holds Thai marks, and typing never widens the well.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/input', 'Input', 'A length of time or another number.'], ['/components/select', 'Select', 'A few fixed times.']],
  },
  {
    name: 'PullToRefresh',
    slug: 'pull-to-refresh',
    status: 'beta',
    limitations: ['The pull is a touch gesture only. A mouse uses the refresh key.', 'One detent; there is no second stop for a deeper action.', 'The list must start at the top of its scroller, so a header above the rows belongs in the bar.'],
    youMust: ['Name the list with label.', 'Return a promise from onRefresh, or control refreshing yourself.', 'Pass the time the hub took the readings in updated.'],
    usage: '<PullToRefresh label="Readings" onRefresh={ask} updated={time}><List label="Readings">…</List></PullToRefresh>',
    backdrops: 'The bar and the band are printing in text.primary and text.secondary on whatever body holds the list, in both themes. The refresh key is a plain body coloured key. Nothing is orange and nothing glows.',
    purpose: 'A list that asks the hub for fresh readings when it is pulled down past one detent or when its refresh key is pressed.',
    importLine: "import { PullToRefresh } from 'dial-react';",
    overview: (
      <>
        <p><code>PullToRefresh</code> prints a bar with the <code>label</code>, the time of the readings and a round refresh key, and wraps your list. Pulled down at its top, the list reveals a short ruler whose ink index rides into one detent. Released there, it calls <code>onRefresh</code>, holds a still Working reading while the promise runs, and prints the new time, which a screen reader hears politely. The key does the same with no gesture, and every other drag scrolls the list as usual.</p>
      </>
    ),
    hero: ex('PullToRefreshBasic', 'Readings from the hub, with the time and the refresh key.'),
    ladder: [
      ex('PullToRefreshInUnit', 'Inside a plastic unit.'),
      ex('PullToRefreshFailed', 'The hub did not answer.'),
      ex('PullToRefreshControlled', 'refreshing and updated controlled by the app.'),
      ex('PullToRefreshHeight', 'A long list in its own frame with height.'),
      ex('PullToRefreshMessages', 'Other words with messages and a 12 hour clock.'),
      ex('PullToRefreshDisabled', 'disabled while the hub is set up.'),
    ],
    whenToUse: ['A list of readings the hub sends on request.', 'A phone screen where people pull to check for news.'],
    whenNotToUse: [['Readings the hub pushes by itself', 'Display'], ['A task with a known end', 'Progress'], ['A first load', 'Skeleton']],
    anatomy: [['Bar', 'type.label medium name, type.caption time in text.secondary with tabular figures, a 44px IconButton.'], ['Band', 'Printing above the list, at most one detent tall (layout.touch × 1.5).'], ['Ruler', 'width.hairline ticks in text.secondary, a width.ring detent and a width.bar index in text.primary.'], ['Working', 'Progress size sm with no value, named by the list and reading Working.']],
    states: [['Pulling', 'The index rides down the ruler.'], ['Past the detent', 'Release to refresh in medium weight.'], ['Working', 'Still ticks, the key ignores presses.'], ['Failed', 'The status line says the hub did not answer.']],
    content: ['The label names the list in one or two words.', 'messages carries the words for other languages.'],
    dodont: [
      { do: 'Keep the refresh key in the bar.', dont: 'Offer the gesture as the only way to refresh.' },
      { do: 'Show still ticks while the hub works.', dont: 'Drop a spinning circle from the top of the list.' },
    ],
    a11y: ['The refresh key is a button named Refresh, so keyboard and switch users reach the same refresh (WCAG 2.5.1).', 'The time is a polite status line; Asking the hub and then Updated 10:42 are spoken without moving focus.', 'The list is a region named by the label, and it is aria-busy while working.', 'Under reduce motion the list lands at once with no throw (WCAG 2.3.3).'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/list', 'List', 'The rows inside.'], ['/components/progress', 'Progress', 'The Working reading.']],
  },
  {
    name: 'Environment',
    slug: 'environment',
    status: 'beta',
    limitations: ['One layout, with the window on top.', 'The main reading is always the temperature.', 'The kinds know four levels; any other level is a Meter you set by hand.'],
    youMust: ['Name the room with room.', 'Pass the time of the reading in readAt.', 'Set status to stale or offline when the sensor is late or stops answering.'],
    usage: '<Environment room="Living room" temperature={21.5} readAt="10:42" readings={[{ kind: \'humidity\', value: 38 }]} />',
    backdrops: 'The body is Card plastic, the window an LCD or OLED recess, the meters printed scales in a narrow recess. The notice is a Badge in ink. Nothing is orange in either theme.',
    purpose: 'One room’s air at a glance on one plastic unit, the temperature in a window and the other levels on meters.',
    importLine: "import { Environment } from 'dial-react';",
    overview: (
      <>
        <p><code>Environment</code> is a Card with a Display for the <code>temperature</code>, a notice line for the sensor <code>status</code>, one Meter per entry in <code>readings</code> and an optional Grille for <code>activity</code>. The <code>room</code> is printed bottom left and <code>readAt</code> bottom right. A late or offline sensor keeps its readings in place and says so in words.</p>
      </>
    ),
    hero: ex('EnvironmentBasic', 'The living room with humidity, air quality and CO2.'),
    ladder: [
      ex('EnvironmentActivity', 'A noise meter and a sound grille.'),
      ex('EnvironmentStale', 'A sensor that is late.'),
      ex('EnvironmentOffline', 'A sensor that stops answering.'),
      ex('EnvironmentOled', 'displayKind oled.'),
      ex('EnvironmentCustom', 'Fahrenheit and ranges set by hand.'),
      ex('EnvironmentRooms', 'One unit per room.'),
    ],
    whenToUse: ['The climate of one room.', 'A screen that compares rooms.'],
    whenNotToUse: [['A device you set', 'DeviceCard'], ['One level alone', 'Meter'], ['Many sensors', 'List']],
    anatomy: [['Body', 'Card with padding unit, eight layout.touch wide.'], ['Window', 'Display lcd by default, three digit cells.'], ['Notice', 'Badge positive, warning or critical, on a line control.badge tall.'], ['Meters', 'Meter per reading, gap.xl apart.'], ['Labels', 'Card wordmark and model.']],
    states: [['Live', 'Up to date.'], ['Late', 'Warning glyph and the time of the last reading.'], ['Not answering', 'Critical glyph, Not answering in the window.']],
    content: ['The room as people say it at home.', 'A detail the meters do not say.'],
    dodont: [
      { do: 'Name the air with a glyph and a word on a meter.', dont: 'Paint a coloured AQI pill.' },
      { do: 'Say a late reading in words with its time.', dont: 'Show an old reading as if it were new.' },
    ],
    a11y: ['The unit is a section named by the room.', 'The window is a polite status region, so a new temperature is spoken.', 'Every meter is named and reads its region in words.', 'The notice is a polite status line with a glyph and words, never colour alone.'],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/device-card', 'DeviceCard', 'A device you set.'], ['/components/meter', 'Meter', 'One level.']],
  },
  {
    name: 'MediaPlayer',
    slug: 'media-player',
    status: 'beta',
    limitations: ['There is no video; the player plays audio only.', 'There is no shuffle or repeat key yet.', 'The level meter reads nothing from a file on another site that sends no CORS headers; the holes stay dark there.'],
    youMust: ['Start sound only from a press on play; never call play on load.', 'Give every track a title, and an artist and a source when they are known.', 'Keep one player per room on a screen, because its play key is the unit’s one orange part.'],
    usage: '<MediaPlayer tracks={tracks} />',
    backdrops: 'In light the body is warm white plastic and the window near-black with white ink; in dark the body is charcoal and the window gives off its own soft light. Play is the only orange part in both.',
    purpose: 'Plays a list of tracks in one unit, with a window that says the state, the position, three round transport keys and a volume control.',
    importLine: "import { MediaPlayer } from 'dial-react';",
    overview: (
      <>
        <p><code>MediaPlayer</code> is the MP3 player of the reference sheet. Pass <code>tracks</code>, each with an <code>id</code>, a <code>title</code> and a <code>src</code>. The OLED window prints the state with a glyph and a word, the place in the queue, the title, the artist and the source. Under it are the Scrubber, the previous, play and next keys with the level holes, and the volume fader. Play is a 52px orange disc and the only orange part. The player drives an HTMLAudioElement and starts only when a person presses play. Space toggles play while focus is in the player outside a key.</p>
      </>
    ),
    hero: ex('MediaPlayerBasic', 'Three tracks of tones, rendered in the browser. Press play.'),
    ladder: [
      ex('MediaPlayerWithQueue', 'With its queue. A move in the queue changes what plays next.'),
      ex('MediaPlayerRotary', 'volume="rotary" sets volume on a plastic knob.'),
      ex('MediaPlayerSingle', 'One track and no meter, as for a radio programme.'),
      ex('MediaPlayerStates', 'Loading, offline and a file that cannot play.'),
      ex('MediaPlayerThai', 'Thai titles and words.'),
    ],
    whenToUse: ['Play a list of tracks, a stream or a podcast in a home app.', 'Show what plays and from where, at a glance.'],
    whenNotToUse: [['Only the position of something another part plays', 'Scrubber'], ['A device that is not a player', 'DeviceCard']],
    anatomy: [['Window', 'display.oled-bg, display.oled-ink, elevation.well, emit.display; radius nests in the body.'], ['State line', 'type.caption in type.weight-medium, a glyph and a word, the place in tabular figures.'], ['Title', 'type.emphasis in type.weight-medium.'], ['Scrubber', 'The system Scrubber with its title line hidden.'], ['Transport keys', 'IconButton 44px, play IconButton primary 52px in action.accent.'], ['Level', 'Grille 8 by 2 holes, lit in ink.'], ['Volume', 'Slider 0 to 100 in steps of 5, or Rotary kind key 44px.']],
    states: [['Loading', 'Three printed squares and Loading; parts wait; aria-busy.'], ['Paused', 'Two bars and Paused.'], ['Playing', 'A triangle and Playing; play is pressed and shows a pause sign.'], ['Ended', 'A ring and Ended.'], ['Error', 'A square and Can’t play this file.'], ['Offline', 'A triangle pointing up and Offline.']],
    content: ['The title is the track’s own title.', 'The source is one word, such as Library or Radio.', 'The player prints the states; keep them out of the title.'],
    dodont: [
      { do: 'Keep play the one orange part of the unit.', dont: 'Put a green play circle on a dark bar with album art.' },
      { do: 'Say the state in the window with a glyph and a word.', dont: 'Tell playing from paused by the key’s icon alone.' },
    ],
    a11y: ['The player is a section named Player, or by label.', 'The window is a polite status region that reads the state, the title and the place in the queue.', 'Play is a toggle button named Play with aria-pressed true while it plays. Previous and next are named in words.', 'The scrubber is a slider whose value text reads the position, such as 0:05 of 0:07.', 'Sound starts only from a press, and only one player sounds at a time.'],
    keyboard: [['Space', 'Toggle play while focus is in the player outside a key', 'MediaPlayer: Space toggles play while focus is in the player outside a key'], ['Arrow keys on the scrubber', 'Seek five seconds', 'MediaPlayer: arrow keys on the scrubber seek the audio five seconds'], ['Enter or Space on play', 'Play or pause', 'MediaPlayer: pressing play really starts the audio element and pressing it again pauses it']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/queue', 'Queue', 'The list of what plays next.'], ['/components/scrubber', 'Scrubber', 'The position on its own.'], ['/components/device-card', 'DeviceCard', 'A unit for a device that is not a player.']],
  },
  {
    name: 'Queue',
    slug: 'queue',
    status: 'beta',
    limitations: ['A row moves one place per key press; there is no cut and paste of several rows.', 'Dragging scrolls nothing; in a long queue, use the keys or the menu to move far.', 'There is no built in empty state; show an EmptyState when the queue is empty.'],
    youMust: ['Pass the id of the playing track, the same one the player uses.', 'Give each track a stable id, so a moved row keeps its focus.', 'Keep the order in one list shared with the player.'],
    usage: '<Queue tracks={tracks} onTracksChange={setTracks} playing={current} onPlay={setCurrent} />',
    backdrops: 'In light the body is warm white plastic with the unit shadow; in dark it is charcoal. Titles are primary ink, artists and lengths secondary ink. The playing row is an ink mark and a word in both themes, never orange.',
    purpose: 'Lists what plays next on one plastic body, with the playing row marked, and lets the person move and remove tracks by key, menu or handle.',
    importLine: "import { Queue } from 'dial-react';",
    overview: (
      <>
        <p><code>Queue</code> is the up-next list of a player. Pass <code>tracks</code> with an <code>id</code>, a <code>title</code>, an <code>artist</code> and a <code>duration</code> in seconds, and the <code>playing</code> id. Each row is a key that plays its track, with the number and the length in tabular figures. The playing row has an ink index mark and the word Playing. Alt with the up or down arrow moves a row, Delete removes it, and the menu key at the row’s end holds the same moves in words. The printed handle drags a row as a pointer shortcut.</p>
      </>
    ),
    hero: ex('QueueBasic', 'Four tracks, the second one playing.'),
    ladder: [
      ex('QueuePlayer', 'Beside a MediaPlayer, sharing one list of tracks.'),
      ex('QueueControlled', 'Controlled, with the order printed under it.'),
      ex('QueueFixed', 'With removable={false} the menu holds the two moves only.'),
      ex('QueueLong', 'Nine tracks on a narrow column.'),
      ex('QueueThai', 'Thai titles, menu and announcements.'),
    ],
    whenToUse: ['Show what plays next beside a player.', 'Let the person reorder or cut a short programme.'],
    whenNotToUse: [['Rows that are never reordered', 'List'], ['A few actions on one item', 'Menu']],
    anatomy: [['Body', 'unit.bg, unit.shadow, corner.panel, gap.md inset.'], ['Index mark', 'width.ring wide, text.primary, on the playing row.'], ['Handle', 'Six dots in text.secondary, control.icon-md wide, the row’s height.'], ['Row', 'control.lg tall at least, corner.inner.'], ['Number and length', 'type.label, tabular, text.secondary.'], ['Title', 'type.body; medium on the playing row.'], ['Menu key', 'Menu, 44px round key.']],
    states: [['Playing row', 'Ink mark, medium title, the word Playing.'], ['Pressed', 'A small recess at once.'], ['Dragging', 'The row in a recess and an ink line where it lands.'], ['Focus', 'A dark 2px ring around the row.']],
    content: ['Each row shows the track’s own title and its artist.', 'Leave numbers and lengths out of the title; the queue prints them.', 'Name the queue after what it holds, such as Up next.'],
    dodont: [
      { do: 'Mark the playing row with ink and the word Playing.', dont: 'Animate a green equaliser on the playing row.' },
      { do: 'Offer keys and a menu for every move, with the handle as a shortcut.', dont: 'Let tracks move only by dragging.' },
    ],
    a11y: ['The queue is an ordered list named Up next, or by label.', 'Each row is a button named by its title, artist and length; the playing row has aria-current true and the word Playing.', 'Every move and removal is announced by a polite status, such as Kiln song moved to 2 of 4.', 'The drag handle is hidden from assistive tech, because the keys and the menu do the same thing.'],
    keyboard: [['Alt + Up / Alt + Down', 'Move the focused track', 'Queue: Alt with an arrow moves a row of the queue and focus stays on it'], ['Up / Down, Home / End', 'Move focus between rows', 'Queue: arrow keys move focus between rows and Home and End reach the ends'], ['Delete', 'Remove the focused track', 'Queue: Delete removes the focused track and focus goes to the next row']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/media-player', 'MediaPlayer', 'The player the queue feeds.'], ['/components/list', 'List', 'Rows that are never reordered.'], ['/components/menu', 'Menu', 'The row’s actions.']],
  },
  {
    name: 'BottomNav',
    slug: 'bottom-nav',
    status: 'beta',
    limitations: ['There is one size only.', 'It holds three to five sections; more squeeze the targets.', 'There is no badge on a section yet.'],
    youMust: ['Pass current with the value of the section on screen.', 'Give every section a word as well as a glyph.', 'Call preventDefault in onNavigate when the app routes on its own.'],
    usage: '<BottomNav items={sections} current="rooms" onNavigate={(value, e) => { e.preventDefault(); go(value); }} />',
    backdrops: 'The strip is warm white plastic in light and charcoal in dark. Words print in the secondary ink and the current one in the primary ink with an ink mark; nothing is orange.',
    purpose: 'Prints the phone app’s main sections along the bottom edge, glyph over word, with the section on screen marked in ink.',
    importLine: "import { BottomNav } from 'dial-react';",
    overview: (
      <>
        <p><code>BottomNav</code> is a <code>nav</code> landmark named Main holding one link per section. Each link is a quarter of the strip and at least 52px tall: a 20px glyph, the word at the label size and a 24 by 4px ink mark under the current word, which is set in medium weight and carries <code>aria-current="page"</code>. The strip pads its bottom by the phone’s safe area. With layout auto it becomes a 280px rail at the inline start on a screen wider than it is tall.</p>
      </>
    ),
    hero: ex('BottomNavBasic', 'Home, Rooms, Media and Settings with Rooms current.'),
    ladder: [
      ex('BottomNavRail', 'layout rail prints the sections down the side.'),
      ex('BottomNavAuto', 'layout auto picks the strip or the rail from the screen.'),
      ex('BottomNavThree', 'Three sections share the strip in equal parts.'),
      ex('BottomNavThai', 'Thai words keep their marks and their width.'),
      ex('BottomNavInShell', 'In a phone frame, the page follows the link.'),
    ],
    whenToUse: ['Move between the main sections of a phone app.', 'Show which section is on screen.'],
    whenNotToUse: [['Panels inside one page', 'Tabs'], ['Picking a mode', 'SegmentedControl']],
    anatomy: [['Strip', 'surface.solid, elevation.unit, safe-area padding at the bottom.'], ['Link', 'A quarter of the strip, control.lg tall at least.'], ['Glyph', 'control.icon-md, stroked at width.ring.'], ['Word', 'type.label; the current one type.weight-medium in text.primary.'], ['Mark', 'control.thumb by width.bar in text.primary under the current word.']],
    states: [['Hover', 'The ink turns one step darker over motion.hover.'], ['Current', 'Medium weight and the ink mark.'], ['Focus', 'The focus ring inside the link.'], ['Rail', 'On a wide screen, glyph beside word, the mark beside the row.']],
    content: ['Each section is one noun, the same word as its page heading.', 'Every section has a glyph and a word.'],
    dodont: [
      { do: 'Mark the current section with weight and the ink mark.', dont: 'Put a tinted pill behind the current glyph.' },
      { do: 'Keep three to five sections.', dont: 'Squeeze six or more into the strip.' },
    ],
    a11y: ['It is a nav landmark named by label, Main by default.', 'The link to the page on screen carries aria-current="page".', 'Glyphs are hidden; the word names each link.', 'Every link is at least 44px wide and 52px tall.'],
    keyboard: [['Tab / Shift+Tab', 'Moves between the section links', 'BottomNav: Tab reaches each link and shows the focus ring'], ['Enter', 'Follows the link', 'BottomNav: pressing a link marks it as the current page and moves no neighbour']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/tabs', 'Tabs', 'Panels inside one page.'], ['/components/snackbar', 'Snackbar', 'The message above the strip.']],
  },
  {
    name: 'ActionSheet',
    slug: 'action-sheet',
    status: 'beta',
    limitations: ['There is one size only.', 'It cannot be dragged down; Cancel, Escape and the scrim close it.', 'By its key on a wide screen it has no Cancel key.'],
    youMust: ['Give every sheet the object’s name as its title.', 'Put destructive actions last and mark them destructive.', 'Close it from onOpenChange when you control open.'],
    usage: '<ActionSheet title="Kitchen lamp" items={actions} onAction={run} trigger={<IconButton label="Actions for Kitchen lamp">{dots}</IconButton>} />',
    backdrops: 'The lid is warm white plastic in light and charcoal in dark, over a plain warm ink scrim when docked. The destructive lamp is the critical mark ink in both themes; nothing is orange.',
    purpose: 'Offers a few actions for one object, rising from the bottom of a phone with a separate Cancel key and standing by its key on a wide screen.',
    importLine: "import { ActionSheet } from 'dial-react';",
    overview: (
      <>
        <p><code>ActionSheet</code> is the native <code>dialog</code> element opened with <code>showModal()</code>. On a screen taller than it is wide it docks to the bottom edge: the name, the actions as full-width rows at least 44px tall, and Cancel as a full-width 52px plastic key. It slides up over 245ms and leaves over 120ms. On a wide screen it stands under or above its trigger like Menu’s panel, shifted to stay on the screen, with no scrim and no Cancel key. The chosen action runs after focus is back on the opener.</p>
      </>
    ),
    hero: ex('ActionSheetBasic', 'Rename, Move to room and Remove for the Kitchen lamp.'),
    ladder: [
      ex('ActionSheetBottom', 'placement bottom docks it on every screen.'),
      ex('ActionSheetAnchored', 'placement anchored stands it by its key.'),
      ex('ActionSheetInPlace', 'modal false shows the docked lid in the page.'),
      ex('ActionSheetDisabled', 'An action that cannot run keeps its place.'),
      ex('ActionSheetUndo', 'Remove, then Undo from a Snackbar.'),
      ex('ActionSheetInClippedFrame', 'A key in a clipping frame still opens a whole panel.'),
    ],
    whenToUse: ['Offer a few actions for one object on a phone.', 'Keep rare actions off the card.'],
    whenNotToUse: [['Controls that act at once', 'Sheet'], ['Asking before an action', 'Dialog']],
    anatomy: [['Lid', 'surface.solid, corner.panel on top, elevation.float with a lit top-left hairline.'], ['Scrim', 'surface.scrim when docked; none by the key.'], ['Header', 'The name at type.emphasis in medium weight, the detail at type.caption.'], ['Rows', 'control.md tall at least, corner.media, Menu’s recess on focus.'], ['Destructive row', 'Last after gap.sm, with the critical square lamp.'], ['Cancel', 'A Button, full width, control.lg tall.']],
    states: [['Open, docked', 'Slides up over motion.release on motion.easing.'], ['Open, by its key', 'Rises motion.rise and fades in.'], ['Closing', 'Leaves over motion.exit on motion.easing-exit.'], ['Reduced motion', 'No slide and no fade.']],
    content: ['The title is the object’s name, such as Kitchen lamp.', 'Each action starts with a verb.'],
    dodont: [
      { do: 'Put Remove last with its lamp.', dont: 'Paint Remove in red text alone.' },
      { do: 'Keep Cancel a plain plastic key.', dont: 'Colour Cancel blue.' },
    ],
    a11y: ['It is a native modal dialog, so focus is trapped and the page behind is inert.', 'aria-labelledby points at the object’s name.', 'Focus goes to the first action on open and back to the opener on close.', 'The destructive lamp is hidden; the word carries the action.'],
    keyboard: [['Enter / Space on the opener', 'Opens the sheet', 'ActionSheet: Enter on the opener shows a modal sheet named by the object with focus on the first action'], ['Arrow Down / Up', 'Moves between the actions and Cancel', 'ActionSheet: arrow keys move between the actions and Cancel and Tab stays inside'], ['Escape', 'Closes the sheet and returns focus', 'ActionSheet: Escape closes the sheet and focus returns to the opener']],
    inherits: 'HTMLAttributes<HTMLDialogElement>',
    related: [['/components/sheet', 'Sheet', 'Controls instead of actions.'], ['/components/menu', 'Menu', 'Actions on a wide screen.']],
  },
  {
    name: 'Snackbar',
    slug: 'snackbar',
    status: 'beta',
    limitations: ['There is one size only.', 'Only one shows at a time; a new one replaces it.', 'It cannot be swiped away; it leaves on its own or with Escape.'],
    youMust: ['Put one SnackbarProvider near the root before calling useSnackbar().', 'Give at most one action, the one that undoes.', 'Pass aboveNav false in an app with no bottom nav.'],
    usage: "const snackbar = useSnackbar();\nsnackbar.show({ message: 'Lamp removed', action: { label: 'Undo', onAction: restore } });",
    backdrops: 'The strip is warm white plastic in light and charcoal in dark, never a dark bar on a light screen. The glyph takes the tone’s mark ink; nothing is orange.',
    purpose: 'Says in a glyph, a word and a short message what just happened on a phone, with one key that undoes it, then goes away.',
    importLine: "import { Snackbar, SnackbarProvider, useSnackbar } from 'dial-react';",
    overview: (
      <>
        <p><code>Snackbar</code> is Toast’s plastic strip: a 20px glyph and a status word, the message and at most one plastic key. It is <code>role="status"</code> in every tone. <code>SnackbarProvider</code> shows one at a time, centred at the bottom and lifted above the BottomNav strip on a tall screen. It stays 8 s by default and never less than 5 s, pauses while the pointer or focus is on it, and closes on Escape.</p>
      </>
    ),
    hero: ex('SnackbarBasic', 'Lamp removed, with one Undo key.'),
    ladder: [
      ex('SnackbarTones', 'The four tones, each with its own glyph and word.'),
      ex('SnackbarProvider', 'SnackbarProvider and useSnackbar post to the bottom of the screen.'),
      ex('SnackbarUndo', 'Undo puts the lamp back in the list.'),
      ex('SnackbarReplace', 'A new message replaces the one on screen.'),
      ex('SnackbarThai', 'status replaces the default word, in Thai.'),
    ],
    whenToUse: ['Offer Undo after a removal on a phone.', 'Confirm a quick change without covering the page.'],
    whenNotToUse: [['Several notes at once', 'Toast'], ['A state that stays', 'Banner']],
    anatomy: [['Strip', 'surface.solid, corner.panel, elevation.float with a lit top-left hairline.'], ['Glyph', 'control.icon-md, stroked at width.ring in the tone’s mark ink.'], ['Status word', 'type.label, type.weight-medium.'], ['Message', 'type.body, text.primary.'], ['Key', 'One Button.']],
    states: [['Arriving', 'Fades in and rises motion.rise over motion.enter.'], ['Leaving', 'Fades out over motion.exit.'], ['Reduced motion', 'No fade and no rise.']],
    content: ['Say what happened: Lamp removed.', 'The key is one verb, usually Undo.'],
    dodont: [
      { do: 'Use Toast’s plastic strip.', dont: 'Use a near-black bar on a light screen.' },
      { do: 'Give one plastic Undo key.', dont: 'Make the action word orange or add a second key.' },
    ],
    a11y: ['role="status" announces politely in every tone.', 'The glyph is hidden; the status word carries the tone.', 'The timer is at least 5 s and pauses while the pointer or focus is on it.', 'Escape closes it while focus is inside.'],
    keyboard: [['Tab', 'Reaches the Undo key', 'Snackbar: the Undo key is at least the touch target and runs its action'], ['Escape', 'Closes the snackbar', 'Snackbar: Escape closes the snackbar while focus is inside']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/toast', 'Toast', 'Several notes at once.'], ['/components/bottom-nav', 'BottomNav', 'The strip it sits above.']],
  },
];
