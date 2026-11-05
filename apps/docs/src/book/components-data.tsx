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
      ex('ButtonLatched', 'A toggle key with aria-pressed latches down as glass.'),
      ex('ButtonStates', 'A disabled key loses its height. full stretches the key across its unit.'),
      ex('ButtonInUnit', 'In a unit, keys sit at the bottom, under the display.'),
    ],
    whenToUse: ['Start, stop, pause or confirm an action.', 'The main action of a sheet or dialog.'],
    whenNotToUse: [['An action shown only as an icon', 'IconButton'], ['A setting that stays on or off', 'Switch']],
    anatomy: [['Key body', 'A capsule, elevation.part, corner.round, at least control.md tall.'], ['Printed word', 'type.label in type.weight-medium.']],
    states: [['Hover', 'Ink one step darker; orange one step lighter on primary. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Latched', 'With aria-pressed true a plastic key stays down by motion.press-travel as glass.neutral.body glass with its edge; the orange key never turns to glass.'], ['Disabled', 'Flat, opacity.disabled.']],
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
    backdrops: 'In light the cap is warm white plastic in a darker groove, in dark it is charcoal. While on, the lamp lights as a small glass bead in the neutral ink range in both themes, and the shadow always falls down and to the right.',
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
      ex('SwitchLamp', 'The lit lamp is a glass bead.'),
      ex('SwitchStates', 'Off, on and disabled. A disabled cap loses its height.'),
      ex('SwitchInUnit', 'Inside a unit, under the display and above the one orange key.'),
    ],
    whenToUse: ['Turn a setting on or off that stays put.', 'Pick between two named positions, such as Cook and Warm.'],
    whenNotToUse: [['An action that runs once', 'Button'], ['A choice in a form that is sent later', 'Checkbox']],
    anatomy: [['Label', 'type.label, text.primary, printed before the switch.'], ['Groove', 'control.switch long, control.track tall, surface.sunken with elevation.well.'], ['Cap', 'control.cap-w by control.cap-h, corner.media, elevation.part, one index line.'], ['Position words', 'type.caption; the current one in type.weight-medium.'], ['Lamp', 'control.lamp, a recess while off, glass.neutral.lamp with glass.lit while on; solid ink with reduced transparency.']],
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
    usage: '<IconButton label="Play" kind="primary"><Icon name="play" /></IconButton>',
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
      ex('IconButtonLatched', 'A toggle disc with aria-pressed latches down as glass.'),
      ex('IconButtonStates', 'A disabled key loses its height.'),
      ex('IconButtonInUnit', 'Transport keys under the display of a speaker unit.'),
    ],
    whenToUse: ['Play, pause, skip, power and volume on a device.', 'A short row of keys whose symbols everyone knows.'],
    whenNotToUse: [['An action that needs a word', 'Button'], ['A setting that stays on or off', 'Switch']],
    anatomy: [['Key body', 'A disc, elevation.part, corner.round, control.key across.'], ['Printed symbol', 'An Icon at control.icon-md, dots in currentColor, aria-hidden.']],
    states: [['Hover', 'Symbol one step darker; orange one step lighter on primary. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Latched', 'With aria-pressed true a plastic disc stays down by motion.press-travel as glass.neutral.body glass with its edge; the orange disc never turns to glass.'], ['Disabled', 'Flat, opacity.disabled.']],
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
    youMust: ['Give every fader a label that names the amount.', 'Put the unit in formatValue so the value text says it, for example 60 %.', 'Pick tint for what the amount is, warm for heat and cool for cooling; the orange belongs to the unit’s knob.'],
    usage: '<Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />',
    backdrops: 'The cap is frosted glass in its tint over a sunken groove, and the groove is lit in the same tint up to the cap. In light the tint sits close to the warm white plastic, in dark close to the charcoal. The ink and the shadow direction are the same in both themes, and nothing is orange.',
    purpose: 'Sets an amount between two ends, as a glass cap that rides a groove and settles into the nearest step.',
    importLine: "import { Slider } from 'dial-react';",
    overview: (
      <>
        <p><code>Slider</code> is a fader, a 24 by 32px frosted glass cap in a recessed groove under a printed ruler with one tick per step. The track is 44px tall and as long as its column, at least 220px, and it keeps that size from the lowest value to the highest. <code>scale</code> prints the numerals under the groove. When you let go, the cap settles into the nearest step on the spring (mass 1.4, stiffness 520, damping 46).</p>
        <p>The cap is dial’s one accent material, glass (D-007). <code>tint</code> names the range of the value: <code>warm</code> for heat, <code>cool</code> for cooling, and <code>neutral</code>, the default, for anything else. The cap, its edge and the light in the groove up to the cap all take that one quiet hue. When the reader asks for less transparency, and in forced colours, the cap turns matte.</p>
      </>
    ),
    hero: ex('SliderBasic', 'A volume fader with 11 steps and its numerals.'),
    ladder: [
      ex('SliderScale', 'The ruler is always there; scale adds the numerals.'),
      ex('SliderSteps', 'step sets the detents; formatValue prints the unit.'),
      ex('SliderControlled', 'Controlled with value and onValueChange.'),
      ex('SliderTint', 'tint picks the warm, cool or neutral glass range.'),
      ex('SliderStates', 'A disabled fader loses the cap’s height.'),
    ],
    whenToUse: ['Set an amount such as volume, brightness or fan speed.', 'Show where a value sits in the whole range.'],
    whenNotToUse: [['The main setting of the unit', 'Rotary'], ['Only on and off', 'Switch']],
    anatomy: [['Label and value', 'type.label in type.weight-medium; the value in tabular figures.'], ['Ruler', 'width.hairline ticks in text.secondary, the ends and middle in text.primary.'], ['Groove', 'control.track tall, surface.sunken, elevation.well.'], ['Light in the groove', 'glass.<tint>.tint at glass.fill-opacity, from the start to the cap’s centre.'], ['Cap', 'control.cap-w by control.cap-h, glass.<tint>.body with a glass.<tint>.edge hairline, the glass blur, saturate and brightness, elevation.part, glass.lit, an ink line.'], ['Numerals', 'type.micro, tabular, text.secondary.']],
    states: [['Hover', 'The cap’s ink line darkens one step. No lift.'], ['Dragging', 'The cap follows the pointer.'], ['Released', 'Settles into the nearest step on the spring; at once with reduced motion.'], ['Disabled', 'No cap shadow, opacity.disabled.']],
    content: ['Name the amount, such as Volume or Brightness.', 'Put the unit in formatValue, not in the label.'],
    dodont: [
      { do: 'Tint the fader in the range of its value, next to an orange knob.', dont: 'Paint the groove or the cap in the orange or a saturated hue.' },
      { do: 'Set a step when the device has steps.', dont: 'Let a five-speed fan land on 2.37.' },
    ],
    a11y: ['The track has role slider with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext.', 'The printed label is the accessible name, through aria-labelledby.', 'Every value can be reached with keys or a single press on the track, with no drag.', 'In forced colours the cap turns matte with a border, the light in the groove becomes Highlight, and the ticks are drawn as borders.', 'With reduced transparency the cap and the groove light turn matte in the same tint.'],
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
    backdrops: 'In light the keys are warm white plastic in a darker recessed strip, in dark they are charcoal. The latched key is frosted ink grey glass with its lamp lit as a glass bead, never orange, its word at 4.5:1 on the glass, and the shadow always falls down and to the right.',
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
      ex('SegmentedControlGlass', 'The latched key is frosted grey glass.'),
      ex('SegmentedControlStates', 'No key latched yet, and a disabled bank.'),
      ex('SegmentedControlInUnit', 'Inside a unit, under the display and before the one orange key.'),
    ],
    whenToUse: ['Pick one mode of a device, such as Heat, Eco or Frost.', 'A setting with two to five options that people change often.'],
    whenNotToUse: [['Moving between sections of a screen', 'Tabs'], ['Turning one setting on or off', 'Switch']],
    anatomy: [['Printed label', 'type.label in type.weight-regular, text.primary, above the bank.'], ['Bank', 'surface.sunken strip, elevation.well, corner.round.'], ['Key', 'At least control.md tall and layout.touch wide, line.ring edge, elevation.part.'], ['Lamp', 'control.lamp recess, glass.neutral.lamp with glass.lit when latched.'], ['Word', 'type.label; type.weight-medium when latched.']],
    states: [['Latched', 'Down motion.press-travel, no cast shadow, glass.neutral.body face with the glass blur, lamp lit, word medium; matte with reduced transparency.'], ['Hover', 'Word one step darker. No lift.'], ['Pressed', 'Drops in motion.press; the released key returns in motion.release.'], ['Disabled', 'Flat, opacity.disabled.']],
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
    anatomy: [['Strip', 'surface.solid, corner.panel, elevation.float with a lit top-left hairline.'], ['Glyph', 'The dot-matrix Icon at control.icon-md (info, positive, warning or critical) in the tone’s mark ink.'], ['Status word', 'type.label, type.weight-medium.'], ['Message', 'type.body, text.primary.'], ['Keys', 'A Button and a 44px IconButton, gap.sm apart.']],
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
    limitations: ['A chip toggles or it removes. One chip does one of the two.', 'There is no chip group with arrow-key navigation yet; each chip is its own Tab stop.', 'Pass an Icon at size sm to icon; the chip does not draw a glyph of its own.'],
    youMust: ['Keep the word short and name the filter or preset.', 'Move focus to the next chip after one is removed.', 'Use SegmentedControl when only one option may be on.'],
    usage: '<Chip defaultSelected>Eco</Chip>',
    backdrops: 'In light the chip is warm white plastic, in dark it is charcoal. A latched chip turns to frosted ink grey glass with its lamp lit as a glass bead in both themes, and its word holds 4.5:1 on the glass. No chip is ever orange.',
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
      ex('ChipGlass', 'A latched chip turns to frosted grey glass.'),
      ex('ChipStates', 'Off, latched and disabled. A disabled chip loses its height.'),
      ex('ChipRemovable', 'onRemove adds a round remove key with its own 44px target.'),
      ex('ChipControlled', 'Controlled filters with selected and onSelectedChange.'),
      ex('ChipWithIcon', 'icon prints a small dot-matrix Icon before the word.'),
      ex('ChipInUnit', 'Option chips sit between the display and the orange key.'),
    ],
    whenToUse: ['Filters where any number can be on.', 'Quick presets and options next to the control they change.', 'Choices already made that can be taken away.'],
    whenNotToUse: [['Only one option may be on', 'SegmentedControl'], ['A setting that takes effect at once', 'Switch'], ['A status nobody presses', 'Badge']],
    anatomy: [['Key', 'A capsule, corner.round, surface.raised, elevation.part, control.md or control.sm tall.'], ['Lamp', 'control.lamp, a recess when off, glass.neutral.lamp with glass.lit when latched.'], ['Printed word', 'type.label, regular, medium when latched.'], ['Remove key', 'control.thumb round key with a 44px target, a 2px ink cross.']],
    states: [['Hover', 'Ink one step darker. No lift.'], ['Pressed', 'Drops motion.press-travel in motion.press, shadow collapses.'], ['Latched', 'Stays down, no cast shadow, glass.neutral.body face with the glass blur, glass.neutral.edge, lamp lit; matte glass.neutral.matte with reduced transparency.'], ['Disabled', 'Flat, opacity.disabled.']],
    content: ['One or two words, such as Eco, Night or Lamps.', 'Sentence case, no full stop, no verb.'],
    dodont: [
      { do: 'Let any number of chips be on.', dont: 'Use chips for a pick-one choice.' },
      { do: 'Show a chosen chip by its latch, its lamp and its glass face.', dont: 'Paint a chosen chip orange or a saturated hue.' },
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
    backdrops: 'The word is ink in both themes. The glyph uses the status marks, which have a lighter step in dark. A lit lamp is a glass bead. Its body takes the mark at glass.fill-opacity and its edge carries the full mark. The amber triangle keeps an ink edge so it holds 3:1 on light plastic.',
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
      ex('BadgeLamps', 'Lit lamps are glass beads with a full edge.'),
      ex('BadgeCount', 'count prints a number in tabular figures before the word.'),
      ex('BadgeInList', 'Each row of a list ends with one badge.'),
      ex('BadgeSummary', 'A summary line of counts.'),
      ex('BadgeInUnit', 'On a unit the badge is printed under the display, beside the model name.'),
    ],
    whenToUse: ['Show the state of a device in a list or on a unit.', 'Count devices in a state.'],
    whenNotToUse: [['The person can press it', 'Chip'], ['A value that changes', 'Display'], ['A message that needs a reply', 'Toast']],
    anatomy: [['Lamp', 'A glyph of control.mark + space.0-5, a glass bead of status.*-mark at glass.fill-opacity with a full width.hairline edge; neutral is a text.secondary ring.'], ['Count', 'Tabular figures, type.weight-medium.'], ['Word', 'type.caption in text.primary.']],
    states: [['Forced colours', 'Glyphs solid in the text colour; the shapes still differ.'], ['Reduced transparency', 'Lit lamps fill solid in their mark.']],
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
    backdrops: 'The groove is a recess one step darker than the body, and the fill is a resin rod in line.ring, lit along its upper edge, at 3:1 off the groove in both themes. The fill is never orange.',
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
    anatomy: [['Label line', 'type.caption, with the label in text.primary and the reading in text.secondary with tabular figures.'], ['Groove', 'surface.sunken, elevation.well, corner.round, control.track or width.bar tall.'], ['Fill', 'line.ring with a glass.lit upper edge, from the start of the line.'], ['Ticks', 'Twelve control.tick capsules of grille.hole-on, still.']],
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
    youMust: ['Give every range a label that names the band.', 'Put the unit in formatValue so both values say it.', 'Pick tint for what the band is, warm for heat and cool for cooling; the orange belongs to the unit’s knob.'],
    usage: '<RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale />',
    backdrops: 'Both caps are frosted glass in their tint over a sunken groove, and the groove between them is lit in the same tint. The band is also told by darker, thicker ruler ticks in both themes, and nothing is orange.',
    purpose: 'Sets a band between a low and a high end, as two glass caps in one groove that stop at each other.',
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
      ex('RangeSliderTint', 'tint lights the band between the caps.'),
      ex('RangeSliderStates', 'A disabled range loses both caps’ height.'),
    ],
    whenToUse: ['Set a band with a low and a high end.', 'Show where the band sits in the whole range.'],
    whenNotToUse: [['One amount', 'Slider'], ['The main setting of the unit', 'Rotary'], ['A level that is only read', 'Meter']],
    anatomy: [['Label and values', 'type.label in type.weight-medium; both values in tabular figures.'], ['Ruler', 'width.hairline ticks in text.secondary; inside the band width.ring in text.primary.'], ['Groove', 'control.track tall, surface.sunken, elevation.well, a line.ring edge.'], ['Light in the band', 'glass.<tint>.tint at glass.fill-opacity, between the two caps.'], ['Caps', 'control.cap-w by control.cap-h, glass.<tint>.body with a glass.<tint>.edge hairline, the glass blur, saturate and brightness, elevation.part, an ink line; each in a layout.touch target.'], ['Numerals', 'type.micro, tabular, text.secondary.']],
    states: [['Hover', 'The cap’s ink line darkens one step. No lift.'], ['Dragging', 'The nearer cap follows the pointer and stops at the other.'], ['Released', 'Settles into the nearest step on the spring; at once with reduced motion.'], ['Disabled', 'No cap shadows, opacity.disabled.']],
    content: ['Name the band, such as Heating band or Quiet hours.', 'Put the unit in formatValue, not in the label.', 'Name the caps with lowLabel and highLabel when Low and High are not the right words.'],
    dodont: [
      { do: 'Show the band with the ruler printing and the quiet tint of its range.', dont: 'Fill the groove between the caps with the orange or a saturated hue.' },
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
    youMust: ['Give every scrubber the title of what is playing as its label.', 'Pass duration in seconds, and value in seconds when a player drives it.', 'Leave tint neutral unless the source has a warmth or a coolness of its own; the orange belongs to the play key.'],
    usage: '<Scrubber label="Ruhe, side A" duration={225} defaultValue={83} />',
    backdrops: 'In light the cap is warm white plastic over a light grey groove and the buffered stretch is a thin line in line.ring; in dark the same parts run in charcoal. The played stretch behind the frosted glass cap is lit in its quiet tint, and nothing is orange.',
    purpose: 'Shows and changes the position in a track or a video, as a glass cap in a groove with the times printed under it.',
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
      ex('ScrubberTint', 'tint lights the played stretch behind the cap.'),
      ex('ScrubberStates', 'Disabled while nothing is loaded.'),
    ],
    whenToUse: ['Show and change the position in a track or a video.', 'Print the elapsed and remaining time at a glance.'],
    whenNotToUse: [['How far a device task has run', 'Progress'], ['An amount the person sets', 'Slider']],
    anatomy: [['Label', 'type.label in type.weight-medium.'], ['Chapter marks', 'width.ring in text.primary, control.mark tall.'], ['Groove', 'control.track tall, surface.sunken, elevation.well, a line.ring edge.'], ['Buffered', 'width.ring tall, line.ring, along the groove floor.'], ['Played light', 'glass.<tint>.tint at glass.fill-opacity, from the start to the cap’s centre.'], ['Cap', 'control.cap-w by control.cap-h, glass.<tint>.body with a glass.<tint>.edge hairline, the glass blur, saturate and brightness, elevation.part, an ink line.'], ['Times', 'type.micro, tabular, text.secondary.']],
    states: [['Playing', 'The cap steps with the time, no spring.'], ['Hover', 'The cap’s ink line darkens one step. No lift.'], ['Seek by key', 'Travels on the spring; at once with reduced motion.'], ['Disabled', 'No cap shadow, opacity.disabled.']],
    content: ['The label says what is playing.', 'Leave the times to the scrubber; the label carries none.'],
    dodont: [
      { do: 'Light the played part in the cap’s quiet tint under an orange play key.', dont: 'Fill the played part in red behind a round dot.' },
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
    anatomy: [['Strip', 'surface.solid, corner.media, elevation.unit with a lit top-left hairline.'], ['Glyph', 'The dot-matrix Icon at control.icon-md (info, positive, warning or critical) in the tone’s mark ink.'], ['Status word', 'type.label, type.weight-medium.'], ['Message', 'type.body, text.primary.'], ['Keys', 'A Button and a 44px IconButton, gap.sm apart.']],
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
    youMust: ['Put role="group", aria-busy="true" and a name on the region the skeleton stands in.', 'Match the part that replaces it with the same digits, size and lines.', 'Replace it with an error and a way to try again if the request fails.'],
    usage: '<div role="group" aria-busy="true" aria-label="Thermostat, loading"><Skeleton kind="display" digits={3} unit="°C" /></div>',
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
    anatomy: [['Strip', 'surface.solid, elevation.unit, safe-area padding at the bottom.'], ['Link', 'A quarter of the strip, control.lg tall at least.'], ['Glyph', 'An Icon at control.icon-md, in the link’s ink.'], ['Word', 'type.label; the current one type.weight-medium in text.primary.'], ['Mark', 'control.thumb by width.bar in text.primary under the current word.']],
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
    anatomy: [['Strip', 'surface.solid, corner.panel, elevation.float with a lit top-left hairline.'], ['Glyph', 'The dot-matrix Icon at control.icon-md (info, positive, warning or critical) in the tone’s mark ink.'], ['Status word', 'type.label, type.weight-medium.'], ['Message', 'type.body, text.primary.'], ['Key', 'One Button.']],
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
  {
    name: 'Legend',
    slug: 'legend',
    status: 'beta',
    limitations: ['Choices are words only; there is no icon or picture legend yet.', 'The arc holds about seven short words; longer lists use the column.', 'A choice cannot be greyed out on its own; leave it off the list instead.'],
    youMust: ['Keep the list to about ten choices, in the order the knob turns.', 'Write each word short and lowercase, as printed on the case.', 'Let the unit’s display say what the device is doing, and the legend what it is set to.'],
    usage: '<Legend label="Fan" options={[\'off\', \'low\', \'mid\', \'high\', \'auto\']} value={fan} onValueChange={setFan} />',
    backdrops: 'The words are ink printed on the case, text.primary for the lit word and text.secondary for the rest, in both themes. The knob is the same orange disc in light and dark, and nothing in the legend casts a shadow.',
    purpose: 'Prints every choice a knob has beside or round it and lights the one in use, so the range of the device is on the case.',
    importLine: "import { Legend } from 'dial-react';",
    overview: (
      <>
        <p><code>Legend</code> prints a control’s choices in a column beside its knob, in a row, or round the dial with <code>layout="arc"</code>. The lit word is full ink in medium weight with one ink mark; the rest wait one step lighter. Turning the knob walks the lit word, and pressing a word turns the knob to it. With <code>control="none"</code> the words stand alone as a radio group.</p>
      </>
    ),
    hero: ex('LegendBasic', 'A washer’s programmes beside its knob.'),
    ladder: [
      ex('LegendArc', 'layout arc puts each word at its detent round the knob.'),
      ex('LegendRow', 'layout row with control none, a radio group of words.'),
      ex('LegendAlone', 'control none in a column, beside a unit whose knob does something else.'),
      ex('LegendKnobs', 'knob is primary or key; knobSize is sm, md or lg.'),
      ex('LegendDisabled', 'A disabled legend keeps every word printed.'),
      ex('LegendControlled', 'Controlled, with the display saying what the fan does.'),
      ex('LegendInUnit', 'In a unit, under the display, with values of its own.'),
    ],
    whenToUse: ['A setting with up to about ten named positions, such as a fan’s speeds.', 'A knob that turns through words instead of numbers.'],
    whenNotToUse: [['More than about ten choices', 'Select'], ['A number along a range', 'Rotary'], ['Modes set by latching keys', 'SegmentedControl']],
    anatomy: [['Knob', 'A Rotary with one detent per word, its value line left off.'], ['Words', 'type.label in text.secondary, each a 44px target.'], ['Lit word', 'text.primary in type.weight-medium, its width reserved.'], ['Index mark', 'width.bar of text.primary ink, or a control.dot dot on the arc.']],
    states: [['Hover', 'A waiting word darkens one step. Nothing rises.'], ['Lit', 'Full ink, medium weight and the mark, which slides on the spring.'], ['Disabled', 'The knob loses its height and the words fade, all still printed.']],
    content: ['Short lowercase words from the manual: off, low, eco 40.', 'Keep the order the knob turns.'],
    dodont: [
      { do: 'Print every choice the device has.', dont: 'Hide five fan speeds in a dropdown.' },
      { do: 'Keep one tab stop for the knob and its words.', dont: 'Add a second legend or keys for the same value.' },
    ],
    a11y: ['With a knob, the knob is a slider whose aria-valuetext is the lit word, and its description lists every choice.', 'The printed words are pointer targets kept out of the reading order, so the list is heard once.', 'With control none, the words are one radiogroup with roving tabindex.', 'In forced colours the index mark is painted in the system text colour.'],
    keyboard: [['Tab', 'Reach the knob, or the lit word', 'Legend: one tab stop for the whole legend'], ['Arrow keys', 'Walk the lit word one step', 'Legend: arrow keys walk the lit word and Home and End reach the ends'], ['Home / End', 'Light the first or last word', 'Legend: arrow keys walk the lit word and Home and End reach the ends']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/rotary', 'Rotary', 'The knob a legend walks.'], ['/components/select', 'Select', 'More choices than fit on the case.']],
  },
  {
    name: 'SceneCard',
    slug: 'scene-card',
    status: 'beta',
    limitations: ['One card is held at a time on the whole page, so holding a card readies every slot on the page.', 'A card has one size; it cannot be made smaller for a dense shelf.', 'There is no picture on a card; scenes are told apart by their printed names.'],
    youMust: ['Show at least one Slot on the same screen, or the card cannot go anywhere.', 'Give each scene a stable value, so a slot can report which one went in.', 'Run the scene from the Slot’s onInsert, never from the card.'],
    usage: '<SceneCard value="movie" name="Movie night" steps={["Lamps 20%", "Blinds down"]} />',
    backdrops: 'The card is light stock with dark ink in both themes, one step lighter than the plastic. In dark it is the one light object on the charcoal unit, as a paper card would be. It is never orange.',
    purpose: 'Prints one scene of the home on a small card that the person picks up and inserts into a room’s Slot to run it there.',
    importLine: "import { SceneCard } from 'dial-react';",
    overview: (
      <>
        <p><code>SceneCard</code> is a scene printed on a card of light stock. Pass a <code>value</code>, the <code>name</code> printed on the top edge and up to three <code>steps</code> of what it does. A press or Enter picks the card up, and pressing a <code>Slot</code> inserts it there. Escape puts it back. The printed handle in the top corner drags the card onto a slot as a pointer shortcut.</p>
      </>
    ),
    hero: ex('SceneCardBasic', 'Three cards and one living room slot.'),
    ladder: [
      ex('SceneCardRooms', 'One shelf of cards and two rooms, walked with the arrows.'),
      ex('SceneCardShort', 'A name alone, one step and three steps.'),
      ex('SceneCardDisabled', 'A scene that cannot run now, with the reason beside it.'),
      ex('SceneCardLong', 'A long name on the card and in the slot.'),
      ex('SceneCardThai', 'Thai names, steps and announcements.'),
    ],
    whenToUse: ['Offer scenes that set several devices at once.', 'Let the person choose the room a scene runs in.'],
    whenNotToUse: [['A single action on one device', 'Button'], ['One of a few modes on one unit', 'SegmentedControl']],
    anatomy: [['Card', 'surface.light, text.on-light, line.divider hairline, elevation.unit, corner.media, three control.key wide and four tall.'], ['Name', 'type.body, medium, on the top edge.'], ['Steps', 'type.caption, up to three lines.'], ['Foot', 'The word scene and an arrow, type.caption.'], ['Handle', 'Six dots, layout.touch square in the top corner.']],
    states: [['Held', 'Rises one motion.rise step (8px) with elevation.part and an ink mark under it.'], ['Dragging', 'Follows the pointer.'], ['Focus', 'A dark 2px ring outside the card.'], ['Disabled', 'Flat, no shadow, readable.']],
    content: ['Name the scene for the moment, in two words or fewer.', 'Write each step as a device and its new state.', 'Leave the room out; the slot names it.'],
    dodont: [
      { do: 'Print the scene on plain light card stock.', dont: 'Fill scene tiles with gradients and a big emoji.' },
      { do: 'Insert the card into a named room’s slot.', dont: 'Run a scene the moment its tile is tapped.' },
    ],
    a11y: ['Each card is a toggle button named by its name and steps, with aria-pressed true while held.', 'A polite status says the card was picked up or put back.', 'The drag handle is hidden from assistive tech, because Enter, the arrows and the slot do the same thing.', 'Escape anywhere puts the held card back and returns focus to it.'],
    keyboard: [['Enter / Space', 'Pick the card up or put it back', 'SceneCard: Enter picks a card up, an arrow reaches a slot and Enter inserts it with an announcement'], ['Right / Down', 'Go to the first slot while holding', 'SceneCard: Enter picks a card up, an arrow reaches a slot and Enter inserts it with an announcement'], ['Escape', 'Put the held card back', 'SceneCard: Escape puts a held card back and focus returns to it']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/slot', 'Slot', 'Where a card goes in.'], ['/components/device-card', 'DeviceCard', 'The unit a slot can sit on.'], ['/components/button', 'Button', 'A single action that runs at once.']],
  },
  {
    name: 'Slot',
    slug: 'slot',
    status: 'beta',
    limitations: ['A slot holds one card; inserting another replaces it.', 'Dragging scrolls nothing; on a long page, press the card and then the slot.', 'The half card shows the name and the first step only.'],
    youMust: ['Name the slot after its room or device with label.', 'Run the scene from onInsert and stop it from onRemove.', 'Pass the running scene as defaultScene or scene, so it does not run again on load.'],
    usage: '<Slot label="Living room" onInsert={(scene) => run(scene.value)} />',
    backdrops: 'The slit is a recess in the plastic in both themes. The half card standing out is light stock with dark ink, also in dark. The lamp is Badge’s glyph and word, never orange.',
    purpose: 'The slit a room or device unit has for scene cards. A card inserted here runs its scene and stands half out with its name, and the lamp says Running.',
    importLine: "import { Slot } from 'dial-react';",
    overview: (
      <>
        <p><code>Slot</code> is the mouth of a room unit for a <code>SceneCard</code>. Pass a <code>label</code> and an <code>onInsert</code> that runs the scene. With a card held, a press or Enter on the slot inserts it, and arrows walk from slot to slot. A card dragged by its handle goes into the slot it is released over. The card then stands half out of the slit and Badge’s lamp says Running. With no card held, a press takes the card out.</p>
      </>
    ),
    hero: ex('SlotBasic', 'A living room unit with its slot and its own orange key.'),
    ladder: [
      ex('SlotRooms', 'Three rooms on one unit.'),
      ex('SlotControlled', 'Controlled, with the running scene printed under it.'),
      ex('SlotInserted', 'Scenes already running when the page opens.'),
      ex('SlotOffline', 'An offline unit whose slot takes no card.'),
      ex('SlotThai', 'Thai legend, lamp and announcements.'),
    ],
    whenToUse: ['Put a scene slot on a room or device unit.', 'Show which scene runs where at a glance.'],
    whenNotToUse: [['The scenes themselves', 'SceneCard'], ['One of a few modes', 'SegmentedControl']],
    anatomy: [['Bay', 'Two control.key tall, kept in every state.'], ['Inserted card', 'surface.light, text.on-light, corner.media on the top corners.'], ['Slit', 'surface.sunken, elevation.well, gap.md tall, corner.mark.'], ['Room name', 'type.label, text.primary.'], ['Lamp', 'Badge, positive Running or neutral Empty.']],
    states: [['Ready', 'A line.ring ring around the slit while a card is held.'], ['Over', 'A text.primary ring under a dragged card.'], ['Inserted', 'The card half out, the lamp on.'], ['Disabled', 'Takes no card.']],
    content: ['Name the slot after the room as people say it.', 'Keep the lamp words short, such as Running and Empty.'],
    dodont: [
      { do: 'Cut the slot into the room’s unit, beside its orange key.', dont: 'Draw a dashed drop zone that says Drop here.' },
      { do: 'Let a held card go in with Enter or a press.', dont: 'Accept cards only by dragging.' },
    ],
    a11y: ['The slot is one button named by its room, its scene and the first step its face prints, such as Living room slot, Movie night, Lamps 20%, inserted.', 'Each insert and removal is announced by a polite status, such as Movie night inserted into Living room.', 'The legend and the half card are hidden from assistive tech, because the button’s name says the same.', 'A disabled slot is a disabled button.'],
    keyboard: [['Enter / Space', 'Insert the held card, or take the card out', 'Slot: Enter on a card, an arrow to the slot and Enter again insert it, and the lamp says Running'], ['Arrows', 'Move between slots', 'Slot: with a card held every slot shows it is ready, and arrows walk between slots']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/scene-card', 'SceneCard', 'The card that goes in.'], ['/components/device-card', 'DeviceCard', 'The unit a slot can sit on.'], ['/components/badge', 'Badge', 'The lamp and its word.']],
  },
  {
    name: 'Tray',
    slug: 'tray',
    status: 'beta',
    limitations: ['The tray does not move focus with arrow keys; Tab goes through its keys.', 'It has one look and no sizes.', 'It does not stop you from putting the orange key inside; keep it out.'],
    youMust: ['Name the group with label.', 'Keep the unit’s orange part outside the tray.', 'Put the small keys of one unit in one tray.'],
    usage: '<Tray label="Playback"><IconButton label="Previous track">…</IconButton><IconButton label="Next track">…</IconButton></Tray>',
    backdrops: 'The tray is a recess in the plastic in both themes, surface.sunken with the well’s inverse light. The keys stand up from its floor in their own colours.',
    purpose: 'Gathers a unit’s small secondary keys into one recess so the one big orange part stands alone.',
    importLine: "import { Tray } from 'dial-react';",
    overview: (
      <>
        <p><code>Tray</code> is a recess for a unit’s small keys. Pass a <code>label</code> and the keys as children: IconButtons, Buttons and Badge lamps. The tray takes the display window’s nested corner inside a Card, keeps an even 8px inset and gap, and wraps to a second row before it would shrink a key.</p>
      </>
    ),
    hero: ex('TrayPlayer', 'A player with its small keys in the tray and the play key alone.'),
    ladder: [
      ex('TrayBasic', 'Two keys in one recess.'),
      ex('TrayLamp', 'Mode keys and a lamp.'),
      ex('TrayHeater', 'A heater unit with the orange knob beside the tray.'),
      ex('TrayWrap', 'A narrow tray that wraps to a second row.'),
      ex('TrayThai', 'Thai key words and lamp.'),
    ],
    whenToUse: ['Gather the small keys of one unit.', 'Let the main control stand alone.'],
    whenNotToUse: [['Picking one of a few modes', 'SegmentedControl'], ['The unit’s main key', 'IconButton']],
    anatomy: [['Tray', 'surface.sunken, elevation.well, gap.md inset and gap, corner nested as --display-outer minus --display-inset.'], ['Keys', 'IconButton and Button at control.md.'], ['Lamp', 'Badge at the tray’s end.']],
    states: [['Default', 'A recess with keys standing up from it.'], ['Wrapped', 'A second row with the same inset.']],
    content: ['Name the tray for what its keys do together.', 'Two to five keys read best.'],
    dodont: [
      { do: 'Sink the small keys into one tray beside the knob.', dont: 'Join outlined buttons into a toolbar.' },
      { do: 'Keep the orange key outside the tray.', dont: 'Put the play key in the tray with previous and next.' },
    ],
    a11y: ['The tray is a group named by label, read once when focus enters it.', 'Each key keeps its own accessible name.', 'The tray is not focusable itself.'],
    keyboard: [['Tab', 'Move through the keys in the tray', 'Tray: tray keys keep 44px, also when the tray wraps on a narrow unit']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/icon-button', 'IconButton', 'The small round keys.'], ['/components/device-card', 'DeviceCard', 'The unit around the tray.'], ['/components/segmented-control', 'SegmentedControl', 'When the keys pick one of a few.']],
  },
  {
    name: 'Icon',
    slug: 'icon',
    status: 'beta',
    limitations: ['Each glyph is a 7 by 7 field of dots, so a shape with fine detail, such as a brand mark, does not fit the set.', 'Glyphs do not turn round in right-to-left pages. Pick chevron-left or chevron-right for the direction you mean.', 'There is one weight. The small size draws larger dots on its own.'],
    youMust: ['Give the key or the word beside the glyph the meaning, or pass a label to the glyph.', 'Pick a name from the set. A missing glyph is a word on a key until it is drawn.'],
    usage: '<Icon name="play" />',
    backdrops: 'Glyphs take currentColor, so they are ink on plastic in both themes and the printing colour on the orange key.',
    purpose: 'Prints a glyph from dial’s set as round dots on the Grille’s grid.',
    importLine: "import { Icon } from 'dial-react';",
    overview: (
      <>
        <p><code>Icon</code> is printing, not a control. <code>name</code> picks one of the glyphs in the set, typed as <code>IconName</code>. <code>size</code> sets the box from the control icon tokens. Without <code>label</code> the glyph is hidden from assistive tech. With one it becomes an image with that name.</p>
      </>
    ),
    hero: ex('IconBasic', 'Five glyphs from the set, in the ink of the page.'),
    ladder: [
      ex('IconSizes', 'Three sizes, sm, md and lg. The small size draws larger dots.'),
      ex('IconSet', 'Every glyph in the set, each with its name.'),
      ex('IconOnKeys', 'On keys the key carries the name, so the glyph stays hidden.'),
      ex('IconBesideWord', 'Beside a word on the text line.'),
      ex('IconLabelled', 'A glyph that stands alone gets a label and is named.'),
      ex('IconInList', 'At the start of a list row.'),
    ],
    whenToUse: ['Print a symbol on a small key where a word will not fit.', 'Mark the kind of device at the start of a row.', 'Put a short sign beside a word, such as a lock beside Front door.'],
    whenNotToUse: [['The person presses it', 'IconButton'], ['A status with a word', 'Badge'], ['A level or a reading', 'Grille']],
    anatomy: [['Field', 'A square of 7 by 7 cells, control.icon-sm, control.icon-md, or control.icon-md plus space.1.'], ['Dots', 'Round dots in currentColor, two thirds of the pitch, four fifths at sm.']],
    states: [['Hidden', 'With no label it is aria-hidden and never focusable.'], ['Named', 'With a label it is role img, named by aria-label.']],
    content: ['A label says what the glyph means here, such as Strong signal, never the glyph’s name.', 'Leave the label out when a word next to the glyph says the same.'],
    dodont: [
      { do: 'Put a glyph on a key that has a label.', dont: 'Leave a glyph on its own with no word and no label.' },
      { do: 'Print the glyph in the ink of its key.', dont: 'Colour a glyph orange to mark it.' },
    ],
    a11y: ['Hidden by default, because the key or the word beside it gives the meaning.', 'With a label it is role img with that name.', 'Never focusable, so Tab skips it.', 'Every dot holds 3:1 on the plastic, also at 16px on a 1x screen.'],
    inherits: 'SVGAttributes<SVGSVGElement>',
    related: [['/components/icon-button', 'IconButton', 'The person presses it.'], ['/components/badge', 'Badge', 'A status with a word.'], ['/components/grille', 'Grille', 'A level in holes.']],
  },
  {
    name: 'Wiring',
    slug: 'wiring',
    status: 'beta',
    limitations: ['Lines are routed with one bend at most; when every such route crosses a part, the line goes over or under the parts between with two bends.', 'A line is drawn only when both of its parts are on the screen.', 'Lines cannot be dragged or edited; Wiring only shows relations.'],
    youMust: ['Give every link a full sentence in text.', 'Wrap each part a link joins in Wiring.Node with the id the link uses.', 'Name the relations with label.'],
    usage: "<Wiring label=\"Heating relations\" links={[{ from: 'thermostat', to: 'heater', label: 'after 23:00', text: 'Night mode lowers the heater to 18', active: true }]}>\n  <Wiring.Node id=\"thermostat\">…</Wiring.Node>\n  <Wiring.Node id=\"heater\">…</Wiring.Node>\n</Wiring>",
    backdrops: 'Lines, dots and words are printing in text.secondary ink, and an active relation is text.primary, in both themes. Wiring paints no surface of its own, so it sits on the page or on a body. Nothing is orange.',
    purpose: 'Prints the relations between parts that affect each other, like a schematic face, so a person sees what drives what.',
    importLine: "import { Wiring } from 'dial-react';",
    overview: (
      <>
        <p><code>Wiring</code> lays out its children and draws one hairline per entry in <code>links</code> between the <code>Wiring.Node</code> parts it names, measured with a ResizeObserver and routed on the module grid with right angles and one bend at most. A small dot marks each end and the link’s <code>label</code> is printed beside the line. <code>Wiring.Group</code> prints a box around related nodes. An <code>active</code> link prints at full ink with filled dots. Every link’s <code>text</code> is a sentence in a visually hidden list, and the controls at both ends are described by it.</p>
      </>
    ),
    hero: ex('WiringRoom', 'A room screen with the thermostat wired to the heater and the night schedule.'),
    ladder: [
      ex('WiringActive', 'Night mode on steps its line to full ink.'),
      ex('WiringAutomation', 'An automation view, one sensor and two lights.'),
      ex('WiringGroup', 'A printed box groups the tone knobs.'),
      ex('WiringStacked', 'In one column the lines run straight down.'),
      ex('WiringThai', 'Words and sentences in Thai.'),
    ],
    whenToUse: ['One setting changes what another does.', 'An automation view that shows what drives what.'],
    whenNotToUse: [['Parts with no effect on each other', 'Card'], ['Naming what each part does', 'ExplainMode']],
    anatomy: [['Line', 'A path at width.hairline in text.secondary, text.primary when active.'], ['Dot', 'A small circle at each end, hollow when waiting and filled when active.'], ['Word', 'type.caption, regular; medium when active.'], ['Box', 'width.hairline in text.secondary, corner.panel plus gap.xl, padding gap.xl.'], ['Box name', 'type.caption above the box.'], ['Sentences', 'A visually hidden list named by label.']],
    states: [['Waiting', 'Secondary ink, hollow dots.'], ['Active', 'Full ink, filled dots, medium word; the ink steps over motion.segment.'], ['Reduced motion', 'The ink steps at once.']],
    content: ['The word on a line is a condition or an effect in lowercase: after 23:00.', 'The sentence names both ends: Night mode lowers the heater to 18.'],
    dodont: [
      { do: 'Join two parts with right angles and one bend.', dont: 'Draw curves or diagonals from centre to centre.' },
      { do: 'Say an active relation with full ink and a filled dot.', dont: 'Colour the line or its ports.' },
    ],
    a11y: ['Every relation is a sentence in a list named by label.', 'Each control at either end is described by the sentences that touch it, so focusing one end names the other.', 'Lines, dots and words are hidden from assistive technology; the sentences carry them.', 'An active relation ends in on now and a waiting one in waiting.'],
    keyboard: [['Tab', 'Moves through the parts; the control at one end is described by its relation', 'Wiring: focusing one end describes the relation and names the other end']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/explain-mode', 'ExplainMode', 'Names what each part does.'], ['/components/device-card', 'DeviceCard', 'The device a relation acts on.']],
  },
  {
    name: 'ExplainMode',
    slug: 'explain-mode',
    status: 'beta',
    limitations: ['A note goes under, above, after or before its part; when none is free, a numeral stands beside the part and the note is printed in a key under the unit, which adds that height below it.', 'Parts added while the mode is open get their notes when it opens again.', 'There is one note per part, with one line of what it does.'],
    youMust: ['Mark each part with Explain or a data-explain attribute holding the name and the line split by a bar.', 'Leave room around the parts for the notes.', 'Write the line as what the part does, never its current value.'],
    usage: '<ExplainMode>\n  <Explain name="Volume" does="Sets how loud the speaker plays.">\n    <Rotary label="Volume" />\n  </Explain>\n</ExplainMode>',
    backdrops: 'Names are text.primary and lines text.secondary on the plastic, leaders in text.secondary, in both themes. The key is a plastic key. Nothing is orange and nothing covers the screen.',
    purpose: 'A how this works mode that prints each part’s name and one line of what it does beside it on the real screen, while every control keeps working.',
    importLine: "import { Explain, ExplainMode } from 'dial-react';",
    overview: (
      <>
        <p><code>ExplainMode</code> wraps a unit or a screen and prints a plastic How this works key after it. Pressing the key, or <kbd>?</kbd> while focus is inside, prints every part marked with <code>Explain</code> or <code>data-explain</code> with its name and its line in the free space next to it, joined by a hairline leader. The layer takes no pointer. <kbd>Escape</kbd> or the same key closes it. Pass <code>open</code> and <code>onOpenChange</code> to hold the state, and <code>toggle</code> false to print your own key.</p>
      </>
    ),
    hero: ex('ExplainModeRadio', 'A tuner whose window, knobs and band keys are named on the real screen.'),
    ladder: [
      ex('ExplainModeOpen', 'A thermostat with the mode already up.'),
      ex('ExplainModeControlled', 'The owner holds the state and prints its own key.'),
      ex('ExplainModeAttribute', 'Parts marked with a data-explain attribute.'),
      ex('ExplainModeKeyboard', 'The question mark key opens and closes it.'),
      ex('ExplainModeThai', 'Names, lines and spoken words in Thai.'),
    ],
    whenToUse: ['A unit with parts a newcomer may not know.', 'A help key on a screen people use rarely.'],
    whenNotToUse: [['Showing what drives what', 'Wiring'], ['A message about what just happened', 'Snackbar']],
    anatomy: [['Key', 'One plastic Button with aria-pressed, after the unit.'], ['Name', 'type.label, type.weight-medium, text.primary.'], ['Line', 'type.caption, text.secondary.'], ['Leader', 'A path at width.hairline in text.secondary.'], ['Note', 'At most control.menu-min wide, gap.md × 2 from its part.']],
    states: [['Off', 'Only the key shows.'], ['On', 'Every part prints its name, its line and a leader; the key is latched.']],
    content: ['The name is what the part is called on the unit.', 'The line starts with a verb and says what the part does.'],
    dodont: [
      { do: 'Print every name at once beside its part.', dont: 'Walk through the parts one at a time with Next keys.' },
      { do: 'Leave every control working while the names are up.', dont: 'Dim the screen behind a spotlight.' },
    ],
    a11y: ['The key has aria-pressed and aria-keyshortcuts.', 'While the mode is on, each part’s control is described by its printed name and line.', 'A polite status says the mode is on and that Escape closes it.', 'Escape closes it from anywhere on the page; focus never moves.'],
    keyboard: [['Enter or Space', 'Toggles the mode from the key', 'ExplainMode: the key prints every name and line, and the same key takes them away'], ['?', 'Toggles the mode while focus is inside', 'ExplainMode: the question mark key opens it and Escape closes it'], ['Escape', 'Closes the mode', 'ExplainMode: the question mark key opens it and Escape closes it']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/wiring', 'Wiring', 'Shows which part changes which.'], ['/components/device-card', 'DeviceCard', 'A unit whose parts it names.']],
  },
  {
    name: 'Textarea',
    slug: 'textarea',
    status: 'beta',
    limitations: ['The well does not grow with its text; it scrolls past the last row.', 'There is no clear button or icon slot.'],
    youMust: ['Give every field a label that names the thing, and never use the placeholder as the label.', 'Write the error as the fix, in words, and show it after the person leaves the field or submits.', 'Use Input, not Textarea, for a one-line value.'],
    usage: '<Textarea label="Note" defaultValue="Guests arrive on Friday." />',
    backdrops: 'In light the well is a light grey recess in warm white plastic, in dark it is a near-black recess in charcoal. The shade always sits on the top-left inner edge, and nothing is orange in either theme.',
    purpose: 'Takes a few lines of text in a recessed well, with its name printed above it.',
    importLine: "import { Textarea } from 'dial-react';",
    overview: (
      <>
        <p><code>Textarea</code> is the Input well made taller: recessed, the full width of its column, with corner.media and a hairline edge. The label is printed above it. <code>rows</code> sets the height (four by default), and the person can drag the lower edge to make it taller, never wider. <code>hint</code> prints a line below and <code>error</code> prints the problem with a glyph and sets <code>aria-invalid</code>.</p>
      </>
    ),
    hero: ex('TextareaBasic', 'A label printed above a tall recessed well.'),
    ladder: [
      ex('TextareaCount', 'maxLength prints a live count under the well.'),
      ex('TextareaHint', 'hint prints a short line under the well. Thai marks fit.'),
      ex('TextareaError', 'error prints the problem with a glyph and marks the field invalid.'),
      ex('TextareaStates', 'Read-only keeps the recess; disabled loses it.'),
    ],
    whenToUse: ['Enter a note or a description that runs over more than one line.', 'Collect free text of unknown length.'],
    whenNotToUse: [['A short value', 'Input'], ['A choice from a known list', 'Select']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, at least control.lg tall.'], ['Text', 'type.body on type.leading-body, text.primary.'], ['Hint and error', 'type.caption; the error in status.critical-mark with a glyph.']],
    states: [['Focus', 'width.ring in focus.ring around the well.'], ['Invalid', 'The edge in status.critical-mark, the message with a glyph below.'], ['Disabled', 'No well shadow, opacity.disabled.']],
    content: ['Name the thing, such as Note or Reason for the change.', 'Put the limit in hint.', 'Write the error as the fix.'],
    dodont: [
      { do: 'Print the label above the well.', dont: 'Use the placeholder as the label.' },
      { do: 'Say how to fix an error, with the glyph.', dont: 'Show only a red edge.' },
    ],
    a11y: ['A native textarea, labelled by the printed label through for and id.', 'The hint and the error are tied to the field with aria-describedby.', 'An error sets aria-invalid and is shown with a glyph and words as well as colour.', 'In forced colours the well keeps a real border and the ring uses the highlight colour.'],
    keyboard: [['Tab', 'Moves focus into the field and shows the ring', 'Textarea: Tab reaches the field and the focus ring shows on the well'], ['Typing', 'Enters text; the field keeps its width', 'Textarea: typing Thai text keeps the field at its width']],
    inherits: 'TextareaHTMLAttributes<HTMLTextAreaElement>',
    related: [['/components/input', 'Input', 'A short piece of text.'], ['/components/select', 'Select', 'A choice from a known list.']],
  },
  {
    name: 'Stepper',
    slug: 'stepper',
    status: 'beta',
    limitations: ['It is not interactive; steps cannot be pressed to jump between them.', 'The rail runs down only; there is no horizontal Stepper.', 'The numbers are counted by position and cannot be set.'],
    youMust: ['Name each step with a noun and leave the number to the window.', 'Mark at most one step current.', 'Move focus to the first field of the next section yourself when a step finishes.'],
    usage: '<Stepper>\n  <Step title="General" status="current">…</Step>\n  <Step title="Configuration">…</Step>\n</Stepper>',
    backdrops: 'In light the windows are light grey recesses in warm white plastic, in dark near-black recesses in charcoal. The dots of the rail are ring ink in both, and nothing is orange.',
    purpose: 'Numbers the sections of a long form in recessed windows joined by a dotted rail.',
    importLine: "import { Stepper, Step } from 'dial-react';",
    overview: (
      <>
        <p><code>Stepper</code> is an ordered list. Each <code>Step</code> prints its number, counted by position, in a 44px window cut into the body, and its title beside it. The section’s content stands under the title. <code>status</code> is <code>upcoming</code>, <code>current</code> (announced with aria-current) or <code>done</code> (a check in the window).</p>
      </>
    ),
    hero: ex('StepperBasic', 'Three steps: one done, one current, one upcoming.'),
    ladder: [ex('StepperStates', 'status is upcoming, current or done.'), ex('StepperForm', 'Fields stand under each title and the orange key comes last.')],
    whenToUse: ['Split a long form into two to five named sections.', 'Show which section of a setup the person is in.'],
    whenNotToUse: [['Switching between views', 'Tabs'], ['How far a task has got', 'Progress']],
    anatomy: [['Number window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md square.'], ['Title', 'type.emphasis in type.weight-medium.'], ['Rail', 'A column of dots in line.ring.'], ['Content', 'type.body under the title.']],
    states: [['Current', 'Primary ink and aria-current="step".'], ['Done', 'A check in the window.'], ['Upcoming', 'Secondary ink.']],
    content: ['Name each step with a noun.', 'Do not write the number in the title.', 'Keep it to five steps.'],
    dodont: [
      { do: 'Name the step with a noun and let the window count.', dont: 'Write “Step 1:” in the title.' },
      { do: 'Tell done by a check.', dont: 'Tell done by colour alone.' },
    ],
    a11y: ['An ordered list, so the order is read out.', 'The current step carries aria-current="step".', 'A done step’s check is announced as Done.', 'In forced colours the window keeps a real border and the rail uses the text colour.'],
    keyboard: [['Tab', 'Moves through the fields inside the steps', 'Stepper: the steps are a list in order and the current one is announced']],
    inherits: 'HTMLAttributes<HTMLOListElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/progress', 'Progress', 'How far a task has got.']],
  },
  {
    name: 'Avatar',
    slug: 'avatar',
    status: 'beta',
    limitations: ['It cannot be pressed; to make a person a target, wrap the row in a List item.', 'It has three fixed sizes (32, 44 and 80px); there is no custom size.', 'Initials come from the first and last word of the name, so a name with one word gives one letter.'],
    youMust: ['Print the person’s name beside the window, or pass label.', 'Pass the full name and let the window pick the letters.', 'Keep it away from the orange key.'],
    usage: '<Avatar name="Maren Solberg" />\n<Avatar src="/maren.jpg" name="Maren Solberg" size="lg" label="Maren Solberg" />',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The ring and the letters are ink in both, and nothing is orange.',
    purpose: 'Shows a person or owner as a picture or initials in a small recessed window.',
    importLine: "import { Avatar } from 'dial-react';",
    overview: (
      <>
        <p><code>Avatar</code> is a window cut into the body, 32, 44 or 80px square. It holds the picture from <code>src</code>, or up to two letters taken from <code>name</code> when there is no picture or it fails to load. With no name either, it prints one dash. It is not a control.</p>
      </>
    ),
    hero: ex('AvatarBasic', 'The three sizes, as initials and as a picture.'),
    ladder: [
      ex('AvatarSizes', 'Initials at each size, from a list row to a sheet header.'),ex('AvatarInList', 'Avatars lead the rows of a list; the name stands beside them.'), ex('AvatarStates', 'A broken picture, no name, custom letters and a Thai name.')],
    whenToUse: ['Show the owner or a member at the start of a list row.', 'Head a profile or a device card with the person it belongs to.'],
    whenNotToUse: [['A state that a row prints', 'Badge'], ['A glyph for a device or a room', 'Icon']],
    anatomy: [['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.avatar-sm, -md or -lg square.'], ['Picture', 'Fills the window and is clipped by its ring.'], ['Initials', 'type.caption, type.label or type.title in type.weight-medium.']],
    states: [['Picture', 'The image fills the window.'], ['Initials', 'Letters from name, or from the initials prop.'], ['Picture failed', 'Falls back to the initials.'], ['Empty', 'One printed dash.']],
    content: ['Pass the full name.', 'Use initials only for a device or a room.', 'Keep initials to two letters.'],
    dodont: [
      { do: 'Print the name beside the window.', dont: 'Leave the picture as the only identifier.' },
      { do: 'Use the rounded square.', dont: 'Round it into a disc that looks like a key.' },
    ],
    a11y: ['With label the window is an image with that name.', 'Without label it is hidden, because the name beside it is read instead.', 'It takes no focus.', 'In forced colours the ring uses the text colour and the inset shadow is dropped.'],
    keyboard: [['Tab', 'Does not stop on an Avatar', 'Avatar: a window with a label is an image and takes no focus']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/list', 'List', 'The row an Avatar usually leads.'], ['/components/badge', 'Badge', 'A state printed as a lamp and a word.']],
  },
  {
    name: 'Popover',
    slug: 'popover',
    status: 'beta',
    limitations: ['It holds a few lines or one field; a task that must be finished or cancelled belongs in a Dialog.', 'It opens by press only, never by hover.', 'The panel is at most 300px wide and scrolls when it is taller than the room on the screen.'],
    youMust: ['Name the key for what the panel explains, as in "About the water filter".', 'Keep the content to a few lines or one field.', 'Pass your own closeLabel when the product is not in English.'],
    usage: '<Popover label="About the water filter" title="Water filter">\n  Change it every three months.\n</Popover>',
    backdrops: 'In light the panel is warm-white plastic with a short soft shadow, in dark it is charcoal plastic. The title is primary ink and the content secondary ink, and nothing is orange.',
    purpose: 'Opens a small plastic panel of printed content next to a key.',
    importLine: "import { Popover } from 'dial-react';",
    overview: (
      <>
        <p><code>Popover</code> is a key that opens a small panel next to it. The panel is the same plastic as Menu and Select, with a title on the inset line, a round close key and the content under the title. It flips above the key and shifts along it so no screen edge cuts it.</p>
      </>
    ),
    hero: ex('PopoverBasic', 'A round info key opens a titled panel with two lines of text.'),
    ladder: [
      ex('PopoverInfo', 'A round info key opens a short explanation.'),
      ex('PopoverShort', 'The panel stays one column wide, so a short line does not stretch it.'),ex('PopoverWord', 'A word key opens a panel with one field and a save key.'), ex('PopoverControlled', 'The page opens and closes the panel through open and onOpenChange.'), ex('PopoverThai', 'Thai text keeps its line height inside the panel.')],
    whenToUse: ['Explain a reading or a setting in a few lines.', 'Ask for one short value, such as a name.'],
    whenNotToUse: [['A list of actions to pick from', 'Menu'], ['A task that must be finished or cancelled', 'Dialog']],
    anatomy: [['Key', 'A 44px round key, or a capsule key with a word and a chevron.'], ['Panel', 'surface.solid, elevation.float, corner.inner, layer.overlay, at most layout.frame-sm wide.'], ['Title', 'type.emphasis in type.weight-medium.'], ['Close key', 'A round 44px key at the end of the title row.'], ['Content', 'type.body in text.secondary.']],
    states: [['Closed', 'Only the key shows, aria-expanded="false".'], ['Open', 'The panel rises off the key, aria-expanded="true".'], ['Closing', 'The panel fades and sinks back, hidden from assistive tech.'], ['Disabled', 'The key fades to half and does not open.']],
    content: ['Name the key for what the panel explains.', 'Start the title with the thing it describes.', 'Keep the content to a few lines.'],
    dodont: [
      { do: 'Name the key "About the water filter".', dont: 'Name the key "More".' },
      { do: 'Open it by press and let Escape close it.', dont: 'Open it by hover only.' },
    ],
    a11y: ['The key carries aria-haspopup="dialog" and aria-expanded.', 'The panel is a dialog named by its title or by the key label.', 'Focus moves into the panel on open and returns to the key on close.', 'In forced colours the panel keeps a real border in the text colour.', 'Under Reduce motion the panel only fades.'],
    keyboard: [['Enter / Space', 'Opens the panel and moves focus into it', 'Popover: focus moves into the panel on open and Escape returns it to the key'], ['Escape', 'Closes the panel and returns focus to the key', 'Popover: focus moves into the panel on open and Escape returns it to the key'], ['Tab', 'Moves through the panel; past either end it closes onto the key', 'Popover: a press outside closes the panel and the close key is at least the touch target']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/menu', 'Menu', 'A list of actions to pick from.'], ['/components/dialog', 'Dialog', 'A task that must be finished or cancelled.']],
  },
  {
    name: 'Radio',
    slug: 'radio',
    status: 'beta',
    limitations: ['A group is a single column; there is no horizontal layout.', 'The options need a RadioGroup; a Radio outside one is a plain native radio with no shared state.', 'Home and End do not move the choice, because native radio groups do not map them.'],
    youMust: ['Give every RadioGroup a label, because it is the name of the group.', 'Give each Radio a value that is unique inside its group.', 'Keep a group to two to five options.'],
    usage: '<RadioGroup label="Heating mode" defaultValue="eco">\n  <Radio value="comfort" label="Comfort" />\n  <Radio value="eco" label="Eco" />\n</RadioGroup>',
    backdrops: 'In light the key is warm white plastic with a grey ring edge and the dot is dark ink. In dark the key is charcoal with a light ring edge and a light dot. The ring holds at least 3:1 against the body in both, and nothing is orange.',
    purpose: 'Picks one option out of a few, each a round key with its word printed beside it.',
    importLine: "import { RadioGroup, Radio } from 'dial-react';",
    overview: (
      <>
        <p><code>RadioGroup</code> is a fieldset with a printed name, and each <code>Radio</code> inside it is a round key with its word beside it. The chosen key carries a dot of ink and its word turns medium. Control it with <code>value</code> and <code>onValueChange</code>, or let it keep its own state with <code>defaultValue</code>.</p>
      </>
    ),
    hero: ex('RadioBasic', 'Three options under a printed name; one is chosen.'),
    ladder: [ex('RadioControlled', 'The screen keeps the value and prints it in words.'), ex('RadioStates', 'One option disabled, and a whole group disabled.'), ex('RadioInUnit', 'A choice in a unit, before the one orange key.')],
    whenToUse: ['Pick one of two to five options that all fit on screen.', 'Let the person compare the choices before picking.'],
    whenNotToUse: [['Turning one option on or off', 'Checkbox'], ['Picking from a long list', 'Select']],
    anatomy: [['Group name', 'type.label in text.secondary, as the legend of a fieldset.'], ['Key', 'control.check round, surface.raised, elevation.part, width.hairline in line.ring.'], ['Dot', 'control.dot ring in text.primary ink.'], ['Word', 'type.label, regular, medium when chosen.']],
    states: [['Chosen', 'A dot on the key and a medium word.'], ['Waiting', 'An empty key.'], ['Hover', 'The ring edge darkens one step.'], ['Pressed', 'The key drops by motion.press-travel.'], ['Focus', 'A ring around the key.'], ['Disabled', 'No height, faded.']],
    content: ['Name the group with a noun.', 'Keep option names short.', 'Do not repeat the group name in each option.'],
    dodont: [
      { do: 'Print a name above the group.', dont: 'Leave the options with no subject.' },
      { do: 'Tell chosen by a dot and a weight.', dont: 'Tell chosen by colour alone.' },
    ],
    a11y: ['A fieldset with a legend, so the group is announced with its name.', 'Native radio inputs share one name, so the browser handles arrow keys and the tab stop.', 'The whole row is a label of at least 44px.', 'In forced colours the key keeps a real border and the dot uses the text colour.'],
    keyboard: [['Tab', 'Moves into the group, to the chosen option', 'Radio: the group is a named radio group and exactly one option is chosen'], ['Arrow keys', 'Move to the next or previous option and choose it', 'Radio: an arrow key moves the choice to the next option and keeps one chosen'], ['Space', 'Chooses the focused option', 'Radio: pressing the printed word chooses the option and the row is at least the touch target']],
    inherits: 'FieldsetHTMLAttributes<HTMLFieldSetElement> (RadioGroup), InputHTMLAttributes<HTMLInputElement> (Radio)',
    related: [['/components/checkbox', 'Checkbox', 'Turning one option on or off.'], ['/components/select', 'Select', 'Picking from a long list.']],
  },
  {
    name: 'Tooltip',
    slug: 'tooltip',
    status: 'beta',
    limitations: ['It holds a name of a few words; there is no room for a link, a button or a second line of help.', 'A disabled button sends no events, so the part must be wrapped in a span that takes focus.', 'One tag shows at a time per part; there is no shared delay across a row of parts.'],
    youMust: ['Keep the name to two to four words.', 'Never put anything the person needs only in the tag.', 'Give a wrapped, disabled part tabIndex 0 so the keyboard reaches the reason.'],
    usage: '<Tooltip content="Next track">\n  <IconButton label="Next track">…</IconButton>\n</Tooltip>',
    backdrops: 'In light the tag is warm plastic with a grey hairline and primary ink at 9.3:1. In dark it is charcoal plastic with the same hairline and ink at 10.9:1. Nothing is orange.',
    purpose: 'Prints the name of a part in a small plastic tag on hover, keyboard focus and a resting finger.',
    importLine: "import { Tooltip } from 'dial-react';",
    overview: (
      <>
        <p><code>Tooltip</code> wraps one part and names it. The tag shows when the pointer rests on the part, when the keyboard focuses it and when a finger is held on it. Escape closes it, and the pointer can move onto the tag without losing it. The tag lives on the body, so no frame cuts it, and it flips below the part when there is no room above.</p>
      </>
    ),
    hero: ex('TooltipBasic', 'Three transport keys, each named by a tag.'),
    ladder: [
      ex('TooltipTop', 'A tag names a key that has no printed word of its own.'),ex('TooltipSide', 'The tag stands below the part when asked.'), ex('TooltipDisabledKey', 'A disabled key is wrapped in a span so the tag can say why.'), ex('TooltipThai', 'A Thai name keeps its marks and the tag grows to hold it.')],
    whenToUse: ['Name a key that shows only a symbol.', 'Give the reason a part is out of reach, in a few words.'],
    whenNotToUse: [['Several actions behind a key', 'Menu'], ['Anything longer than a name', 'Dialog']],
    anatomy: [['Tag', 'surface.solid, elevation.float, corner.media, width.hairline in line.ring, layer.overlay.'], ['Name', 'type.label in type.weight-regular, type.leading-body.']],
    states: [['Showing', 'The tag stands above or below the part and the part is described by it.'], ['Leaving', 'The tag fades and sinks back on motion.exit; the pointer passes through it.'], ['Disabled', 'The tag never shows.']],
    content: ['Name the part in two to four words.', 'Do not end with a full stop.', 'Do not repeat a visible label.'],
    dodont: [
      { do: 'Write the part’s name: “Next track”.', dont: 'Write a sentence that explains the part.' },
      { do: 'Wrap a disabled button in a focusable span.', dont: 'Put the tag on a disabled button and expect it to show.' },
    ],
    a11y: ['The tag has role="tooltip" and the part gets aria-describedby while it shows.', 'A name equal to the part’s aria-label is not announced twice.', 'Escape closes the tag; it can be hovered and it stays until the part is left.', 'Under Reduce motion the tag only fades. In forced colours it keeps a border in the text colour.'],
    keyboard: [
      ['Tab', 'Moves focus to the part and shows the tag at once', 'Tooltip: keyboard focus shows the tag at once and Escape closes it with focus left on the part'],
      ['Escape', 'Closes the tag and leaves focus where it was', 'Tooltip: keyboard focus shows the tag at once and Escape closes it with focus left on the part'],
    ],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/menu', 'Menu', 'Several actions behind one key.'], ['/components/icon-button', 'IconButton', 'The key a Tooltip most often names.']],
  },
  {
    name: 'Accordion',
    slug: 'accordion',
    status: 'beta',
    limitations: ['The content of a closed section is not mounted, so it is not found by page search and holds no state.', 'Opening a section moves the sections below it.', 'Every title is a heading, so more than eight sections add many landmarks for a screen reader.'],
    youMust: ['Name each section with a noun and let the plus and minus say open or closed.', 'Pass a headingLevel that fits the page outline.', 'Keep the unit’s one orange key outside the Accordion.'],
    usage: '<Accordion defaultValue={[\'schedule\']}>\n  <AccordionItem value="schedule" title="Schedule">…</AccordionItem>\n  <AccordionItem value="away" title="Away mode">…</AccordionItem>\n</Accordion>',
    backdrops: 'In light the titles are warm grey ink on warm-white plastic with 1px seams, in dark light ink on charcoal. The index bar is the title’s own ink in both, and nothing is orange.',
    purpose: 'Folds the sections of a unit as a printed legend, the open ones lit with an ink bar and a minus.',
    importLine: "import { Accordion, AccordionItem } from 'dial-react';",
    overview: (
      <>
        <p><code>Accordion</code> prints every section’s title in one column. A closed title is secondary ink with a plus; an open one is primary ink in medium weight with a short ink bar and a minus, and its content stands under it. By default opening a section closes the others. Pass <code>multiple</code> to keep several open.</p>
      </>
    ),
    hero: ex('AccordionBasic', 'Three sections, the first open.'),
    ladder: [ex('AccordionMultiple', 'Several sections open, held in your own state.'), ex('AccordionStates', 'Open, closed and disabled headers.')],
    whenToUse: ['Fold three to eight sections of settings or help.', 'Keep a long unit short when people read one section at a time.'],
    whenNotToUse: [['Switching between views', 'Tabs'], ['Numbering the sections of a form', 'Stepper']],
    anatomy: [['Index bar', 'A 4px bar in the title’s ink, shown only while open.'], ['Title', 'type.reading, medium weight while open.'], ['Plus or minus', 'The dot-matrix icon at the row’s end.'], ['Seam', 'width.hairline in line.divider between sections.'], ['Content', 'type.body under the title.']],
    states: [['Closed', 'Secondary ink, plus, no bar.'], ['Open', 'Primary ink, medium weight, minus, bar.'], ['Hover', 'The closed title darkens a step.'], ['Disabled', 'Faded, out of the tab order.']],
    content: ['Name each section with a noun.', 'Do not write “Show” or “Hide”.', 'Keep it to eight sections.'],
    dodont: [
      { do: 'Name the section with a noun.', dont: 'Write “Click to show the schedule”.' },
      { do: 'Keep the orange key outside the Accordion.', dont: 'Fold the unit’s main action into a section.' },
    ],
    a11y: ['Each title is a heading that holds a button with aria-expanded.', 'An open section’s content is a region named by its title.', 'Open is told by a bar, a minus and weight, not by ink alone.', 'Under Reduce motion the panel keeps its height and only fades.', 'In forced colours the bar is drawn in the button text colour and the seams stay borders.'],
    keyboard: [['Enter / Space', 'Open or close the focused section', 'Accordion: Enter and Space open a section and in single mode the open one closes'], ['Up / Down', 'Move to the previous or next header, the ends wrap', 'Accordion: Up, Down, Home and End move focus between headers and never open one'], ['Home / End', 'Move to the first or last header', 'Accordion: Up, Down, Home and End move focus between headers and never open one']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/stepper', 'Stepper', 'Numbering the sections of a form.']],
  },
  {
    name: 'Breadcrumb',
    slug: 'breadcrumb',
    status: 'beta',
    limitations: ['It does not build the path; you pass the levels in order.', 'It folds the middle levels only, never the first or the last.', 'The last level is always the current page and is never a link.'],
    youMust: ['Pass the levels from the top down and put the current page last.', 'Use the same noun a page uses as its title.', 'Give the landmark and the folded key a name in your own language.'],
    usage: '<Breadcrumb>\n  <Crumb href="/">Home</Crumb>\n  <Crumb href="/lamps">Lamps</Crumb>\n  <Crumb>Kitchen lamp</Crumb>\n</Breadcrumb>',
    backdrops: 'In light the names are grey ink on warm white plastic and the page you are on is dark ink with a bar under it. In dark they are light ink on charcoal. The leaders are ring ink in both and nothing is orange.',
    purpose: 'Prints the path to the current page as names joined by dotted leaders, and folds the middle on a narrow unit.',
    importLine: "import { Breadcrumb, Crumb } from 'dial-react';",
    overview: (
      <>
        <p><code>Breadcrumb</code> is a navigation landmark that holds an ordered list. Each <code>Crumb</code> above the page is a link, and the last one is the page you are on: plain text announced with aria-current=&quot;page&quot; and marked by a short ink bar. When the path does not fit its unit, the middle levels fold into one key; <code>fold</code> sets that to <code>auto</code>, <code>always</code> or <code>never</code>.</p>
      </>
    ),
    hero: ex('BreadcrumbBasic', 'Four levels, the last one the page you are on.'),
    ladder: [
      ex('BreadcrumbLabelled', 'A path in another language: the landmark name and the folded key name are passed in.'),
      ex('BreadcrumbFolded', 'The middle levels folded into one key.'),
      ex('BreadcrumbInUnit', 'A path inside a unit.'),
    ],
    whenToUse: ['Show where a page sits in a tree of three or more levels.', 'Give a way back up the tree.'],
    whenNotToUse: [['Switching between views', 'Tabs'], ['Naming the sections of one form', 'Stepper']],
    anatomy: [['Link', 'type.label in text.secondary, control.md tall, layout.touch wide at least.'], ['Leader', 'A run of dots in line.ring.'], ['Current page', 'type.label in type.weight-medium and text.primary, with an ink bar under it.'], ['Folded key', 'A dot-matrix more glyph, control.md tall and layout.touch wide.']],
    states: [['Hover', 'The link goes one ink step darker.'], ['Current', 'Primary ink, an ink bar and aria-current="page".'], ['Folded', 'The middle levels are out of the row and one key stands in their place.']],
    content: ['Use the noun the page uses as its title.', 'Do not add an arrow; the leaders draw it.', 'Keep it to five levels.'],
    dodont: [
      { do: 'Name each level with the title of its page.', dont: 'Write “Go to home page”.' },
      { do: 'Tell the current page by its bar and weight.', dont: 'Tell it by colour alone.' },
    ],
    a11y: ['A nav landmark with a name, holding an ordered list.', 'The current page carries aria-current="page" and is not a link.', 'The folded key is a button named “Show full path” and takes focus in order.', 'When the folded key is pressed, focus moves to the first level it printed back.', 'In forced colours the leader and the bar draw in the text colour.'],
    keyboard: [['Tab', 'Moves through the links and the folded key in order', 'Breadcrumb: the current page is announced and the folded key prints the path back'], ['Enter or Space', 'On the folded key, prints every level back', 'Breadcrumb: the current page is announced and the folded key prints the path back']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/stepper', 'Stepper', 'Naming the sections of one form.']],
  },
  {
    name: 'Divider',
    slug: 'divider',
    status: 'beta',
    limitations: ['It is a seam only; it cannot be dragged to resize the regions beside it.', 'A label is printed on a horizontal seam only.', 'It has one weight, two pixels.'],
    youMust: ['Give the gap first and add a divider only where the gap does not part two groups.', 'Put a vertical divider in a row that stretches, or it has no height.', 'Set decorative when headings already name the regions.'],
    usage: '<Divider />\n<Divider label="schedule" />\n<Divider orientation="vertical" />',
    backdrops: 'In light the seam is a warm grey edge over a white lit edge in warm white plastic, in dark a near-black edge over a faint lit edge in charcoal. Nothing is orange.',
    purpose: 'Parts two regions of one unit with a seam cut in the body, with an optional word printed on it.',
    importLine: "import { Divider } from 'dial-react';",
    overview: (
      <>
        <p><code>Divider</code> is a separator. It draws a seam of two pixels, the divider tone above and the lit edge below, so it reads as a panel gap. It runs across its column, or down its row when <code>orientation</code> is <code>vertical</code>. <code>label</code> prints a short word on the seam. <code>decorative</code> hides it from assistive tech.</p>
      </>
    ),
    hero: ex('DividerBasic', 'A seam between two groups of one unit.'),
    ladder: [
      ex('DividerLabel', 'A lowercase word printed on the seam.'),
      ex('DividerVertical', 'A vertical seam between side-by-side regions.'),
      ex('DividerDecorative', 'A decorative seam where headings name the regions.'),
      ex('DividerGroups', 'Two printed groups with their fields under each word.'),
    ],
    whenToUse: ['Part two groups inside one unit when the gap alone is not enough.', 'Print the name of a group on the line that starts it.'],
    whenNotToUse: [['Numbered sections of a long form', 'Stepper'], ['Switching between views', 'Tabs']],
    anatomy: [['Seam', 'border.hairline in line.divider over border.hairline in material.lit, two pixels in all.'], ['Label', 'type.caption in text.secondary, with the seam on both sides.']],
    states: [['Horizontal', 'A seam across the column, announced as a separator.'], ['Vertical', 'A seam down the row with aria-orientation="vertical".'], ['Labelled', 'A word on the seam, which names the separator.'], ['Decorative', 'role="none", hidden from assistive tech.']],
    content: ['Print one or two lowercase words.', 'Name the group below the seam.', 'Do not write a sentence.'],
    dodont: [
      { do: 'Name the group with one lowercase word.', dont: 'Print OR or a sentence on the seam.' },
      { do: 'Let the gap part rows and keep one seam for a real change of group.', dont: 'Put a divider between every row of a list.' },
    ],
    a11y: ['Announced as a separator, with aria-orientation when vertical.', 'A label becomes the separator’s name.', 'A decorative divider has role="none".', 'In forced colours the lit edge is dropped and the shade edge draws in the system grey.'],
    keyboard: [['Tab', 'A divider takes no focus', 'Divider: the separator is announced with its orientation']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stepper', 'Stepper', 'Numbered sections of a long form.'], ['/components/tabs', 'Tabs', 'Switching between views.']],
  },
  {
    name: 'Timeline',
    slug: 'timeline',
    status: 'beta',
    limitations: ['It is a log, not a control; events cannot be pressed, opened or removed.', 'The rail runs down only; there is no horizontal Timeline.', 'It does not sort or group; you pass the events in the order they are read.'],
    youMust: ['Pass the events newest first and set latest on the newest only.', 'Name each event with what happened, in the past tense.', 'Give the lit node a word in your own language with latestLabel.'],
    usage: '<Timeline>\n  <TimelineItem time="22:40" title="Night mode started" latest>Heater set to 18.</TimelineItem>\n  <TimelineItem time="21:05" title="Washer finished" />\n</Timeline>',
    backdrops: 'In light the times are grey ink on warm white plastic and the titles are dark ink. In dark they are light ink on charcoal. The rail and nodes are ink in both, and nothing is orange.',
    purpose: 'Prints a log of past events with the time in a column and a hairline rail with a node for each.',
    importLine: "import { Timeline, TimelineItem } from 'dial-react';",
    overview: (
      <>
        <p><code>Timeline</code> is an ordered list. Each <code>TimelineItem</code> prints its <code>time</code> in a column at the left, a ring node on a hairline rail, and its <code>title</code>, with optional detail under it. <code>latest</code> fills the node, sets the title in medium weight and names the node Latest for assistive tech.</p>
      </>
    ),
    hero: ex('TimelineBasic', 'Three past events, newest first, the latest one lit.'),
    ladder: [
      ex('TimelineLatest', 'latest fills the node and the title turns medium.'),
      ex('TimelineDays', 'Longer times stay in one column and dateTime gives the time element a machine value.'),
      ex('TimelineInUnit', 'A history under the title of a unit.'),
      ex('TimelineThai', 'Thai titles wrap in their column and latestLabel names the lit node.'),
    ],
    whenToUse: ['Show the last events of a device or a room, newest first.', 'Show a short history of one thing, such as a door or a cycle.'],
    whenNotToUse: [['Numbered sections of a form still to come', 'Stepper'], ['How far a task has got', 'Progress']],
    anatomy: [['Time', 'type.label in text.secondary with tabular figures, right-aligned.'], ['Rail', 'A hairline in line.ring, width.hairline.'], ['Node', 'A ring in text.primary, control.mark; filled on the latest event.'], ['Title', 'type.body, regular; medium on the latest event.'], ['Detail', 'type.body in text.secondary under the title.']],
    states: [['Event', 'A ring node and a regular title.'], ['Latest', 'A filled node, a medium title and the name Latest on the node.']],
    content: ['Name each event with what happened, in the past tense.', 'Keep the time short, as in 22:40.', 'Put the newest event first.'],
    dodont: [
      { do: 'Name the event with what happened: Washer finished.', dont: 'Name it Event 1.' },
      { do: 'Light the newest event only.', dont: 'Set latest on several events.' },
    ],
    a11y: ['An ordered list, so the order is read out.', 'Each time is a time element, with dateTime when you pass it.', 'The lit node is announced as Latest, so the lit event is not told by sight alone.', 'In forced colours the rail and nodes draw in the text colour and the lit node stays filled.'],
    keyboard: [['Tab', 'Moves to anything focusable inside an event', 'Timeline: the events are a list in order and the lit one is named Latest']],
    inherits: 'HTMLAttributes<HTMLOListElement>',
    related: [['/components/stepper', 'Stepper', 'Numbered sections still to come.'], ['/components/progress', 'Progress', 'How far a task has got.']],
  },
  {
    name: 'Stat',
    slug: 'stat',
    status: 'beta',
    limitations: ['It cannot be pressed; to make a figure a target, put a key beside it.', 'It shows one figure; two figures are two Stats.', 'The change is text you pass in; Stat does not work it out from the last reading.'],
    youMust: ['Pass the unit in unit and not inside value.', 'Pass trend whenever you pass change, or the change reads as flat.', 'Keep it away from the orange key.'],
    usage: '<Stat label="Energy today" value="12.4" unit="kWh" />\n<Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" size="lg" />',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The figure, the glyph and the words are ink in both, and nothing is orange.',
    purpose: 'Shows one named figure with its unit in a recessed window, and an optional change printed under it.',
    importLine: "import { Stat } from 'dial-react';",
    overview: (
      <>
        <p><code>Stat</code> prints the name of a figure above a small window, with the number and its unit inside. With <code>change</code> it adds a line under the window: a glyph, a word (Up, Down or No change), the amount and, with <code>compare</code>, what it is measured against. With no value the window prints a dash. It is not a control.</p>
      </>
    ),
    hero: ex('StatBasic', 'Energy today, with the change since yesterday.'),
    ladder: [
      ex('StatSizes', 'The figure at small, medium and large.'),
      ex('StatTrends', 'Up, down and no change, each told by a glyph and a word.'),
      ex('StatEmpty', 'A sensor with no reading keeps the window and prints a dash.'),
      ex('StatInUnit', 'Three small Stats in a row, with the orange key apart from them.'),
    ],
    whenToUse: ['Show one named figure, such as energy today, with its unit.', 'Put two or three readings side by side in a unit.'],
    whenNotToUse: [['The state the whole unit is about', 'Display'], ['A level in a range with regions', 'Meter']],
    anatomy: [['Name', 'type.caption in type.weight-regular, with the print seat.'], ['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Figure', 'type.emphasis, type.title or type.display in type.weight-medium, tabular numerals.'], ['Unit', 'type.label in text.secondary.'], ['Change', 'type.caption, with a control.icon-sm glyph, a word and the amount.']],
    states: [['Reading', 'The figure and the unit in the window.'], ['No reading', 'A dash in text.secondary, announced as No reading.'], ['With change', 'A glyph, a word and the amount under the window.'], ['Live', 'A polite status that reads the whole reading when it changes.']],
    content: ['Name the figure with a noun and a time.', 'Pass the unit in its own prop.', 'Write the change in the same unit as the figure.'],
    dodont: [
      { do: 'Tell the direction with a glyph and a word.', dont: 'Tell it with a green or a red.' },
      { do: 'Print a dash when there is no reading.', dont: 'Print a zero that looks like a real reading.' },
    ],
    a11y: ['A labelled group, so the name, the figure and the unit are read together.', 'The change is read as a word and an amount, for example Up 0.8 kWh.', 'It takes no focus.', 'With live it is a polite status.', 'In forced colours the window keeps a border in the text colour.'],
    keyboard: [['Tab', 'Does not stop on a Stat', 'Stat: a labelled group that takes no focus and names its figure']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/display', 'Display', 'The window that says what the unit is doing now.'], ['/components/meter', 'Meter', 'A level on a printed scale with regions.']],
  },
  {
    name: 'Pagination',
    slug: 'pagination',
    status: 'beta',
    limitations: ['It does not slice your data; you pass the page count and show the page yourself.', 'The numbers fold into gaps and there is no input to type a page.', 'There is no vertical Pagination and no page-size picker.', 'Pages as links use plain anchors; a router link needs buttons and onPageChange.'],
    youMust: ['Pass count, and page with onPageChange when you control it.', 'Hide it when the list fits on one page.', 'Name the landmark in your own language, and pageLabel when the word order differs.', 'Show the new page yourself; Pagination only reports the number.'],
    usage: '<Pagination count={12} page={page} onPageChange={setPage} />',
    backdrops: 'In light the numbers are grey ink on warm white plastic, the current one dark with a bar under it, and the two keys are raised plastic. In dark they are light ink on charcoal. Nothing is orange.',
    purpose: 'Turns the pages of a long list with two keys and printed numbers, folding a long range into gaps.',
    importLine: "import { Pagination } from 'dial-react';",
    overview: (
      <>
        <p><code>Pagination</code> is a navigation landmark with a list in one row: a previous key, the page numbers, a next key. The current number is marked with <code>aria-current="page"</code> and an ink bar. When <code>count</code> is larger than the row can show, the middle folds into a gap of three dots, and the row keeps the same number of places on every page.</p>
        <p>Pass <code>page</code> and <code>onPageChange</code> to control it, or <code>defaultPage</code> to let it keep the page. Pass <code>getHref</code> and the numbers become links.</p>
      </>
    ),
    hero: ex('PaginationBasic', 'Twelve pages on the sixth: gaps at both ends.'),
    ladder: [
      ex('PaginationShort', 'Five pages fit, so no gap, and the previous key is flat on page one.'),
      ex('PaginationControlled', 'Controlled: the slice on show follows the page.'),
      ex('PaginationLinks', 'Each number is a link with its own address.'),
      ex('PaginationWide', 'Two each side and two at the ends, with Thai names.'),
    ],
    whenToUse: ['Split a long list or table into numbered pages.', 'People need to jump to a page, not only step.'],
    whenNotToUse: [['Moving between views', 'Tabs'], ['The path to this page', 'Breadcrumb'], ['Numbering form sections', 'Stepper']],
    anatomy: [['Keys', 'Round, control.key, elevation.part, surface.raised, a chevron from Icon.'], ['Number', 'type.label with tabular figures, 44px tall, layout.touch wide at least.'], ['Index mark', 'width.bar in text.primary under the current number.'], ['Gap', 'The Icon more, three dots, hidden from assistive tech.']],
    states: [['Current', 'Primary ink, medium weight, an ink bar and aria-current="page".'], ['Hover', 'The number darkens one ink step.'], ['Key at the end', 'Flat, no shadow, opacity.disabled and aria-disabled.']],
    content: ['Name the landmark for what it pages when a screen has more than one.', 'Keep siblings and boundary small enough for a phone.', 'Hide it for one page.'],
    dodont: [
      { do: 'Print the count of items above the row.', dont: 'Print two paginations for one list.' },
      { do: 'Tell the current page by the bar and aria-current.', dont: 'Tell it by colour alone.' },
    ],
    a11y: ['A nav landmark with a name.', 'The current number carries aria-current="page" and is not a link to itself.', 'Each number is named “Page 4”; pass pageLabel to change it.', 'A key at the end of the range is aria-disabled, and focus moves to the current number when it goes flat.', 'In forced colours the keys keep a border and the bar and gap use the text colour.'],
    keyboard: [['Tab', 'Moves through the keys and numbers', 'Pagination: the current page is announced and the row keeps its places'], ['Enter or Space', 'Goes to the page', 'Pagination: pressing next to the end flattens the key and moves focus to the current page']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to this page.']],
  },
  {
    name: 'Spinner',
    slug: 'spinner',
    status: 'beta',
    limitations: ['It has no value, so it cannot show how far the work has got.', 'It has one look; the trail always walks a ring of eight holes.', 'Under reduced motion it stops, so a long wait needs its label shown.'],
    youMust: ['Mount it when the work starts and remove it when the work ends.', 'Name the work in the label, such as Saving or Asking the hub.', 'Show the label with showLabel on any wait that can run past a few seconds.'],
    usage: '<Spinner label="Asking the hub" showLabel />',
    backdrops: 'In light the holes are grey recesses in warm white plastic and the trail is dark ink, in dark the holes are near-black recesses in charcoal and the trail is light ink. Nothing is orange.',
    purpose: 'Says that the unit is busy and has no figure yet, with a short lit trail walking a ring of recessed holes.',
    importLine: "import { Spinner } from 'dial-react';",
    overview: (
      <>
        <p><code>Spinner</code> is a status region with nine recessed holes, the same holes as a <code>Grille</code>. Three lit holes walk the edge, one every 120ms. <code>label</code> names the wait and is always in the page for assistive tech; <code>showLabel</code> prints it beside the holes. <code>size</code> is <code>sm</code> or <code>md</code>.</p>
      </>
    ),
    hero: ex('SpinnerBasic', 'A lit trail walks the edge of nine holes.'),
    ladder: [
      ex('SpinnerLabelled', 'The label printed beside the holes.'),
      ex('SpinnerSizes', 'Small holes for a row, medium holes for a Spinner that stands alone.'),
      ex('SpinnerInUnit', 'It holds the place of a reading in a unit.'),
      ex('SpinnerSwap', 'It is mounted while the work runs and the reading replaces it.'),
    ],
    whenToUse: ['Wait for an answer of unknown length, such as asking the hub.', 'Hold the place of a reading before its shape is known.'],
    whenNotToUse: [['A task with a known end', 'Progress'], ['A card or list that is still loading', 'Skeleton']],
    anatomy: [['Hole', 'elevation.well, grille.hole in the lower ink step, 8px (sm) or 12px (md), corner.round.'], ['Lit trail', 'grille.hole-on, three holes, one step every motion.fill (120ms).'], ['Label', 'type.label, read as a status and drawn only with showLabel.']],
    states: [['Running', 'The trail walks the ring.'], ['Reduced motion', 'The trail stops; three holes stay lit.'], ['Forced colours', 'Each hole has a border and lit holes fill with the text colour.']],
    content: ['Name the work with a verb ending in ing.', 'Say what is waiting, not that something loads.', 'Keep the label to a few words.'],
    dodont: [
      { do: 'Name the work, as in Saving the schedule.', dont: 'Write Please wait.' },
      { do: 'Use one Spinner for one wait.', dont: 'Put two in one unit.' },
    ],
    a11y: ['A status region, so the label is read out when it appears.', 'The holes are hidden from assistive tech; the label is real text.', 'Under reduced motion the trail stops and three holes stay lit.', 'In forced colours each hole keeps a real border and a lit hole uses the text colour.'],
    keyboard: [['Tab', 'Passes over the Spinner; it takes no focus', 'Spinner: it is a status region and announces its label']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/progress', 'Progress', 'A task with a known end.'], ['/components/skeleton', 'Skeleton', 'The shape of a part that is still loading.']],
  },
  {
    name: 'Link',
    slug: 'link',
    status: 'beta',
    limitations: ['It has no disabled state; a link that cannot be followed should not be a link.', 'It does not do routing; pass your router link with asChild.', 'The visited rule is dotted only when you set the visited prop; CSS alone can step the ink but not the rule.'],
    youMust: ['Name the destination in the link words and never write “click here”.', 'Set external on a link that leaves the app.', 'Use a Button for anything that does something instead of going somewhere.'],
    usage: '<Text>\n  Read the <Link href="/manual">manual</Link>.\n</Text>\n<Link href="/lamps" variant="standalone">All lamps</Link>',
    backdrops: 'In light the words are dark ink on warm white plastic with a hairline rule, and a read link is one ink step lighter. In dark the words are light ink on charcoal. The mark is ink in both and nothing is orange.',
    purpose: 'Sends a person somewhere else in the ink and size of the sentence, with one thin rule under the words.',
    importLine: "import { Link } from 'dial-react';",
    overview: (
      <>
        <p><code>Link</code> is an anchor. Inside a sentence it takes the size and line height of the text around it and adds a hairline rule. <code>variant</code> is <code>inline</code> or <code>standalone</code>, a row 44px tall for a link on its own line. <code>external</code> prints a dot-matrix mark, opens a new tab and announces it. <code>visited</code> prints a link already read one ink step lighter with a dotted rule.</p>
      </>
    ),
    hero: ex('LinkBasic', 'Two links inside a sentence, each with a thin rule under the words.'),
    ladder: [
      ex('LinkStandalone', 'Links on their own lines, each 44px tall.'),
      ex('LinkExternal', 'The mark at the end of a link that leaves the app.'),
      ex('LinkVisited', 'A link already read, one ink step lighter with a dotted rule.'),
      ex('LinkAsChild', 'A router link given the link styles.'),
    ],
    whenToUse: ['Go to another page, a section or another site.', 'Name a place inside a sentence.'],
    whenNotToUse: [['Doing something, such as saving', 'Button'], ['Showing the path to the current page', 'Breadcrumb']],
    anatomy: [['Words', 'Inherit the size, weight and line height of the text around them, in text.primary.'], ['Rule', 'A hairline in the ink of the words, thickening to width.ring on hover.'], ['External mark', 'The dot-matrix share glyph, control.icon-sm, in the ink of the words.'], ['Standalone row', 'control.md tall and layout.touch wide at least.']],
    states: [['Hover', 'The rule thickens one step.'], ['Visited', 'Secondary ink; with the visited prop the rule turns dotted.'], ['External', 'A dot-matrix mark at the end.']],
    content: ['Name the destination.', 'Never write “click here” or “read more”.', 'Keep the link to a few words.'],
    dodont: [
      { do: 'Underline the words that name the place.', dont: 'Underline a whole sentence.' },
      { do: 'Tell a link by its rule.', dont: 'Tell a link by colour alone.' },
    ],
    a11y: ['A real anchor, so open, copy and new tab work as the browser gives them.', 'The rule is a cue that is not colour.', 'The external mark is named “Opens in a new tab”.', 'A standalone link is 44px tall; a link inside a sentence is the height of its line, as WCAG allows.', 'In forced colours the link takes the system link and visited colours.'],
    keyboard: [['Tab', 'Moves to the link', 'Link: keyboard focus draws a ring on the link'], ['Enter', 'Follows the link', 'Link: every link is a real anchor with an href, and the rule under it is drawn without colour']],
    inherits: 'AnchorHTMLAttributes<HTMLAnchorElement>',
    related: [['/components/button', 'Button', 'Doing something instead of going somewhere.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to the current page.']],
  },
  {
    name: 'Center',
    slug: 'center',
    status: 'beta',
    limitations: ['It centres one group; it does not space siblings, so use Stack for that.', 'Centring from top to bottom needs a parent with a set height.', 'The cap uses the five container widths and no other value.'],
    youMust: ['Give the parent a height before you centre on both axes.', 'Keep what you centre short, such as a line, a note or one key.', 'Leave the orange to the one primary key if one sits inside.'],
    usage: '<Center>\n  <Text>No rooms yet</Text>\n</Center>',
    backdrops: 'Center draws nothing, so it takes the surface behind it in both themes. Nothing is orange.',
    purpose: 'Puts its children in the middle of a box, on one axis or both, with an optional width cap.',
    importLine: "import { Center } from 'dial-react';",
    overview: (
      <>
        <p><code>Center</code> is a flex column that centres its children. <code>axis</code> is <code>both</code> (the default), <code>inline</code> or <code>block</code>. <code>size</code> caps the inline size at a container token, <code>sm</code> to <code>2xl</code>.</p>
      </>
    ),
    hero: ex('CenterBoth', 'One line centred on both axes in a box of fixed height.'),
    ladder: [
      ex('CenterInline', 'Centred along the line only; the top edge stays put.'),
      ex('CenterBlock', 'Centred from top to bottom only.'),
      ex('CenterMaxSize', 'A note held to the md container width.'),
      ex('CenterKey', 'A lone primary key in an empty unit.'),
    ],
    whenToUse: ['Place one short part in the middle of a box.', 'Hold a note at a readable width on a wide page.'],
    whenNotToUse: [['Space between siblings', 'Stack'], ['The width and margin of a page', 'Container']],
    anatomy: [['Root', 'A flex column with margin-inline auto and, with size, a max-inline-size from container.max.']],
    states: [['Default', 'The only state; it draws nothing.']],
    content: ['Keep it to a line, a note or one key.', 'Do not centre a paragraph.', 'Give the parent a height for both axes.'],
    dodont: [
      { do: 'Centre a short line in a box with a height.', dont: 'Centre a paragraph line by line.' },
      { do: 'Cap the width of a note with size.', dont: 'Cap it wider than the note itself.' },
    ],
    a11y: ['Center adds no role, label or focus stop.', 'The reading order is the source order.', 'Controls inside keep their own keyboard and 44px targets.', 'It draws nothing, so forced colours need no rule.'],
    keyboard: [['Tab', 'Center takes no focus; controls inside keep their own keys', 'Center: both-axis centring puts the child in the middle of its parent']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/container', 'Container', 'The page width and margin.'], ['/components/stack', 'Stack', 'Space between siblings.']],
  },
  {
    name: 'Box',
    slug: 'box',
    status: 'beta',
    limitations: ['It has no look of its own beyond the inset, ground and corner you choose.', 'The three grounds sit close to each other and do not mark a boundary alone.', 'It cannot set a width, a gap or a margin; use Stack and Container for those.'],
    youMust: ['Choose the inset from the named steps.', 'Pick the element with as when the content is a section, list or item.', 'Give a list a label when you render it as ul or ol.'],
    usage: '<Box padding="lg" surface="raised" corner="panel">\n  …\n</Box>',
    backdrops: 'In light the raised ground is warm grey and the sunken ground a step darker, in dark charcoal and near-black. Neither is orange.',
    purpose: 'Sets the inset, ground and corner of a block from the token steps and adds nothing else.',
    importLine: "import { Box } from 'dial-react';",
    overview: (
      <>
        <p><code>Box</code> is a plain block. <code>padding</code> takes <code>none</code> to <code>xl</code>, <code>surface</code> takes <code>page</code>, <code>raised</code> or <code>sunken</code>, and <code>corner</code> takes <code>mark</code>, <code>media</code>, <code>inner</code> or <code>panel</code>. <code>as</code> picks the element.</p>
      </>
    ),
    hero: ex('BoxBasic', 'A raised box with the lg inset and the panel corner.'),
    ladder: [
      ex('BoxList', 'as="ul" renders a list with no browser bullets.'),
      ex('BoxNested', 'A raised box inside a sunken box keeps its own padding and corner.'),
      ex('BoxPadding', 'The five insets from xs to xl.'),
      ex('BoxSurface', 'The page, raised and sunken grounds.'),
      ex('BoxCorner', 'The four corners from mark to panel.'),
      ex('BoxAs', 'A list and its items rendered with as.'),
    ],
    whenToUse: ['Give content an inset from the token steps.', 'Put a ground and a corner behind a group of parts.'],
    whenNotToUse: [['Spacing between siblings', 'Stack'], ['A page held to a width', 'Container']],
    anatomy: [['Box', 'padding from gap.xs to gap.section, optional surface.page, surface.raised or surface.sunken, optional corner.mark to corner.panel.'], ['Content', 'Whatever is placed inside, at the inset.']],
    states: [['Default', 'The chosen inset, ground and corner.']],
    content: ['Put the heading first.', 'Do not nest two grounds.', 'Keep a list labelled.'],
    dodont: [
      { do: 'Choose the inset from a named step.', dont: 'Add a second box only to get more space.' },
      { do: 'Use sunken for a recess and raised for a body.', dont: 'Mark a boundary by ground alone.' },
    ],
    a11y: ['Box has no role; the element you pick sets the semantics.', 'A ul or ol made with as needs a label.', 'Text on all three grounds holds at least 4.5:1 in both themes.', 'Box takes no focus.'],
    keyboard: [['Tab', 'Moves through the children in their own order', 'Box: it takes no focus of its own']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/stack', 'Stack', 'Spacing between siblings.'], ['/components/container', 'Container', 'A page held to a width.']],
  },
  {
    name: 'AspectRatio',
    slug: 'aspect-ratio',
    status: 'beta',
    limitations: ['The ratio comes from a closed list of four. Other proportions are not available.', 'It holds one child. The child is cropped, not squeezed, when its own shape differs.'],
    youMust: ['Give it exactly one child.', 'Name the child (alt text or a label), because the frame has no role.', 'Pick the ratio the content was made in.'],
    usage: '<AspectRatio ratio="16/9">\n  <Display kind="oled" label="Doorbell camera" value="Front door" />\n</AspectRatio>',
    backdrops: 'The frame draws nothing, so it looks the same in light and dark. The child brings its own colour.',
    purpose: 'Keeps its child at a fixed ratio, so the space is held before the content loads.',
    importLine: "import { AspectRatio } from 'dial-react';",
    overview: (
      <>
        <p><code>AspectRatio</code> is a frame as wide as its parent. Its height follows from <code>ratio</code>, which is <code>1/1</code>, <code>4/3</code>, <code>16/9</code> (the default) or <code>3/2</code>. The child fills it. <code>rounded</code> adds the media corner.</p>
      </>
    ),
    hero: ex('AspectRatioBasic', 'A camera view held at sixteen to nine.'),
    ladder: [
      ex('AspectRatioRatios', 'The four ratios. Each frame is as wide as its column and the height follows.'),
      ex('AspectRatioRounded', 'rounded adds the media corner. The default is square.'),
      ex('AspectRatioInCard', 'A square tile above its name.'),
      ex('AspectRatioSwap', 'The content changes and the frame keeps its height.'),
    ],
    whenToUse: ['Room for a picture or video before it loads.', 'A row of tiles that must be the same shape.'],
    whenNotToUse: [['Space between siblings', 'Stack'], ['Columns of equal width', 'Grid']],
    anatomy: [['Frame', 'inline-size 100%, aspect-ratio from the ratio, overflow hidden.'], ['Child', 'Absolutely filled, object-fit cover.'], ['Corner', 'corner.media, only when rounded is set.']],
    content: ['Do not put text that must stay whole in a frame, because a mismatched child is cropped.'],
    dodont: [
      { do: 'Match the ratio to the content.', dont: 'Put a wide view in a square frame.' },
      { do: 'Put one element in the frame.', dont: 'Stack two children in it.' },
    ],
    a11y: ['A plain div with no role. Name the child, not the frame.', 'The frame is not focusable.', 'It draws nothing, so forced colours leave it unchanged.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stack', 'Stack', 'Space between a frame and its caption.'], ['/components/grid', 'Grid', 'A row of equal frames.']],
  },
  {
    name: 'Spacer',
    slug: 'spacer',
    status: 'beta',
    limitations: ['It leaves room on one axis only; set the axis to match the parent.', 'It has five sizes, the same as the Stack gaps, and no others.', 'A flexible spacer needs a flex parent to have anything to grow into.'],
    youMust: ['Set axis to inline when the parent is a row.', 'Use a Stack gap first and add a Spacer only where the room differs.', 'Leave children out; a Spacer is hidden from assistive tech.'],
    usage: '<Spacer size="lg" />\n<Spacer axis="inline" flexible />',
    backdrops: 'A spacer draws nothing, so it looks the same on warm white plastic in light and charcoal in dark. Nothing is orange.',
    purpose: 'Leaves empty room of a token size, or room that grows to push the parts beside it apart.',
    importLine: "import { Spacer } from 'dial-react';",
    overview: (
      <>
        <p><code>Spacer</code> is an empty box. <code>size</code> picks one of five steps, from 4px to 32px, the same steps as a Stack gap. <code>axis</code> says whether the room is in a column (<code>block</code>) or a row (<code>inline</code>). <code>flexible</code> makes it take the room that is left. It is always <code>aria-hidden</code>.</p>
      </>
    ),
    hero: ex('SpacerFlexible', 'A label at the start of the row and the orange key at the end.'),
    ladder: [
      ex('SpacerBasic', 'Fixed room between two stacked parts.'),
      ex('SpacerInline', 'Fixed room inside a row.'),
      ex('SpacerSizes', 'The five sizes drawn as bars.'),
      ex('SpacerColumn', 'A flexible spacer keeps the key at the foot of a tall column.'),
    ],
    whenToUse: ['Push one part to the far end of a row or column.', 'Add one extra step of room where the Stack gap is too small.'],
    whenNotToUse: [['The same gap between every child', 'Stack'], ['Parting groups with a visible line', 'Divider']],
    anatomy: [['Room', 'An empty box sized by the stack gap tokens (xs to xl), on the block or inline axis.']],
    states: [['Fixed', 'Keeps its token size on one axis.'], ['Flexible', 'Grows to take the room that is left.']],
    content: ['Give it a size and no children.', 'Pick the axis that matches the parent.', 'Prefer a Stack gap when every child needs the same room.'],
    dodont: [
      { do: 'Use a flexible spacer to put a key at the end of the row.', dont: 'Pad the label with blank characters.' },
      { do: 'Set the Stack gap and add a Spacer only at the odd place.', dont: 'Put a Spacer between every child.' },
    ],
    a11y: ['Hidden from assistive tech with aria-hidden.', 'It takes no focus.', 'It draws nothing, so forced colours and contrast do not apply.'],
    keyboard: [['Tab', 'A spacer takes no focus', 'Spacer: the box is hidden from assistive tech and takes no focus']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stack', 'Stack', 'The same gap between every child.'], ['/components/divider', 'Divider', 'A visible seam between groups.']],
  },
  {
    name: 'Flex',
    slug: 'flex',
    status: 'beta',
    limitations: ['It lays out one line at a time; for rows and columns together use Grid.', 'Reversed directions are not offered, because they split the focus order from the visual order.', 'The gap is one of five steps; there is no free value.'],
    youMust: ['Put the space in the gap and never as a margin on a child.', 'Wrap a child in FlexItem only when it needs grow, shrink or its own align.', 'Keep the DOM order the same as the order you want read.'],
    usage: '<Flex justify="between" align="center">\n  <FlexItem grow>Living room</FlexItem>\n  <FlexItem shrink={false}><Button>Edit</Button></FlexItem>\n</Flex>',
    backdrops: 'Flex paints nothing, so it looks the same on light and dark. It takes the surface it is placed on, and nothing in it is orange.',
    purpose: 'Lays parts along one line with a token gap, alignment and distribution, and lets one part take the spare room.',
    importLine: "import { Flex, FlexItem } from 'dial-react';",
    overview: (
      <>
        <p><code>Flex</code> is a flex box with the gap taken from the spacing scale. <code>direction</code> is <code>row</code> or <code>column</code>, <code>wrap</code> lets a full line break, <code>align</code> and <code>justify</code> place the children, and <code>asChild</code> makes your own element the container. <code>FlexItem</code> gives one child <code>grow</code>, <code>shrink</code> or its own <code>align</code>.</p>
        <p>Use <a href="/components/stack">Stack</a> when you only need the space between things. Use Flex when the line has to spread, push a part to the far end or let one part grow.</p>
      </>
    ),
    hero: ex('FlexBasic', 'Three parts along one line with a medium gap.'),
    ladder: [
      ex('FlexGap', 'gap comes from the five steps of the token scale.'),
      ex('FlexColumn', 'A column uses the same gap steps as a row.'),
      ex('FlexGrow', 'The title grows between two keys that keep their size.'),
      ex('FlexJustify', 'The four justify values, one per line.'),
      ex('FlexWrap', 'A line that wraps when it runs out of room.'),
      ex('FlexAlign', 'Cross-axis alignment of parts of different heights.'),
    ],
    whenToUse: ['Put a title between two keys.', 'Push one part to the far end of a line.', 'Wrap a group of tags or keys onto more lines.'],
    whenNotToUse: [['Only the space between siblings', 'Stack'], ['Parts that line up in columns', 'Grid']],
    anatomy: [['Container', 'display flex, with the direction, wrap, align and justify you set.'], ['Gap', 'stack.gap, from 4px to 32px in five steps.'], ['Item', 'FlexItem: grow, shrink and its own align.']],
    states: [['Row', 'Children along the inline axis.'], ['Column', 'Children stacked.'], ['Wrap', 'A full line breaks to a new line.']],
    content: ['Flex holds no words.', 'Let the longest child be the one that grows.', 'Set shrink to false on a key so its target holds.'],
    dodont: [
      { do: 'Let the long name grow and keep the key at full size.', dont: 'Leave both to shrink in a tight line.' },
      { do: 'Use gap for the space between parts.', dont: 'Put a margin on one child.' },
    ],
    a11y: ['Flex adds no role and takes no focus.', 'Children are read and tabbed in DOM order, which is also the visual order.', 'A key in a FlexItem with shrink set to false keeps its 44px target.', 'In forced colours nothing changes, because Flex paints nothing.'],
    keyboard: [['Tab', 'Moves through the focusable children in DOM order', 'Flex: the row is laid out with no role of its own']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stack', 'Stack', 'Only the space between siblings.'], ['/components/grid', 'Grid', 'Parts that line up in columns on a page.']],
  },
  {
    name: 'VisuallyHidden',
    slug: 'visually-hidden',
    status: 'beta',
    limitations: ['It hides nothing from assistive tech, so it is the wrong tool for content that should be gone for everyone.', 'A focusable one shows only when something inside it can take focus.', 'The revealed key sits at the top start corner of the window and cannot be moved.'],
    youMust: ['Keep a phrase short and say it as you would aloud.', 'Put a focusable skip link first in the page.', 'Give asChild exactly one element.'],
    usage: '<VisuallyHidden>, opens the heating rules</VisuallyHidden>\n<VisuallyHidden focusable><Link href="#main">Skip to the content</Link></VisuallyHidden>',
    backdrops: 'Hidden, it has no colour. Revealed, the key is raised plastic with primary ink in both themes, and nothing is orange.',
    purpose: 'Holds words for a screen reader off the face, and shows a skip key while the keyboard is on it.',
    importLine: "import { VisuallyHidden } from 'dial-react';",
    overview: (
      <>
        <p><code>VisuallyHidden</code> clips its content to one pixel and takes it out of the flow. The words are still read aloud and can name a control. <code>focusable</code> shows a raised 44px key at the top start corner while focus is inside. <code>asChild</code> hands the styles to your own element.</p>
      </>
    ),
    hero: ex('VisuallyHiddenBasic', 'A link with its full destination read aloud and one word on the face.'),
    ladder: [
      ex('VisuallyHiddenSkipLink', 'A skip link that appears on the first Tab.'),
      ex('VisuallyHiddenAsChild', 'An anchor that is hidden itself.'),
      ex('VisuallyHiddenLabel', 'A hidden heading that names a region.'),
      ex('VisuallyHiddenStatus', 'A unit read after a visible number.'),
    ],
    whenToUse: ['Add words for a screen reader that the face says with a symbol or a number.', 'Hold a skip link that shows only on keyboard focus.'],
    whenNotToUse: [['Words everyone needs to read', 'Text'], ['Help on point or focus', 'Tooltip']],
    anatomy: [['Hidden words', 'One pixel box from width.hairline, clipped, out of the flow.'], ['Revealed key', 'surface.raised, elevation.part, corner.media, control.md tall, focus ring.']],
    states: [['Hidden', 'One pixel, read aloud in place.'], ['Focused', 'A raised key at the top start corner, with the focus ring.']],
    content: ['Say it as you would aloud.', 'Do not repeat the visible word.', 'Keep it to a phrase.'],
    dodont: [
      { do: 'Add what the face leaves out, such as the destination.', dont: 'Repeat the visible word or name the role.' },
      { do: 'Put a link inside a focusable wrapper.', dont: 'Make plain words focusable and expect a key.' },
    ],
    a11y: ['The words stay in the accessibility tree and are read in place.', 'A focusable key is 44px tall with the system focus ring.', 'It appears and goes at once, with no motion.', 'In forced colours the revealed key takes a real border in the text colour.'],
    keyboard: [['Tab', 'Moves to the focusable content inside, which shows the key', 'VisuallyHidden: the words stay for assistive tech and a focused skip link shows']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/text', 'Text', 'Words everyone should read.'], ['/components/tooltip', 'Tooltip', 'Help on point or focus.']],
  },
  {
    name: 'Fieldset',
    slug: 'fieldset',
    status: 'beta',
    limitations: ['It has one look, a box on all four sides; there is no open or bracket form.', 'It does not scroll or collapse.', 'The name is required, and the hint is one line of text.'],
    youMust: ['Give every Fieldset a legend, because it is the name of the group.', 'Put two or more controls in it.', 'Give each control inside its own label as well.'],
    usage: '<Fieldset legend="Night mode" hint="Starts at 23:00.">\n  <Switch label="Lower the heater" />\n  <Switch label="Dim the lamps" />\n</Fieldset>',
    backdrops: 'In light the box is a hairline in the grey ring ink on warm white plastic, in dark a light hairline on charcoal. The line holds at least 3:1 against the body in both, and nothing is orange.',
    purpose: 'Boxes related controls under one printed name and switches them all off together.',
    importLine: "import { Fieldset } from 'dial-react';",
    overview: (
      <>
        <p><code>Fieldset</code> is a native fieldset drawn as a printed box. The <code>legend</code> is set into the top line, <code>hint</code> prints small at the foot, and <code>disabled</code> switches off every control inside. It has no fill and no shadow, so it reads as printing on the case.</p>
      </>
    ),
    hero: ex('FieldsetBasic', 'Two switches in a box named Night mode.'),
    ladder: [
      ex('FieldsetHint', 'Small print at the foot of a box of checkboxes.'),
      ex('FieldsetDisabled', 'A disabled box fades and switches off its fields.'),
      ex('FieldsetFields', 'Two fields under one group name.'),
      ex('FieldsetInUnit', 'Two boxes in a unit, then the orange key.'),
    ],
    whenToUse: ['Group two or more controls that set one thing.', 'Switch a set of controls off together.'],
    whenNotToUse: [['Grouping only radio options', 'Radio'], ['Setting a section apart', 'Divider']],
    anatomy: [['Box', 'width.hairline in line.ring, corner.media, no fill.'], ['Name', 'type.label in text.secondary, set into the top line.'], ['Small print', 'type.caption in text.secondary.']],
    states: [['Default', 'A hairline box with the name on the line.'], ['Disabled', 'The line, name and hint fade; the controls inside are off.']],
    content: ['Name the box with a noun.', 'Do not end the name with a colon.', 'Keep the hint to one sentence.'],
    dodont: [
      { do: 'Name the group with a noun.', dont: 'Write a sentence with a colon.' },
      { do: 'Disable the box and say why in the hint.', dont: 'Disable each control one by one.' },
    ],
    a11y: ['A native fieldset with a legend, so the group is announced with its name.', 'The hint is the group’s description through aria-describedby.', 'A disabled fieldset disables every control inside it in the browser.', 'In forced colours the box keeps a real border in the text colour.'],
    keyboard: [['Tab', 'Moves through the controls inside; the box takes no focus', 'Fieldset: the box is a named group with its legend as the first child and a described hint']],
    inherits: 'FieldsetHTMLAttributes<HTMLFieldSetElement>',
    related: [['/components/radio', 'Radio', 'One-of-many keys, which bring their own box.'], ['/components/divider', 'Divider', 'Setting a section apart.']],
  },
  {
    name: 'HelperText',
    slug: 'helper-text',
    status: 'beta',
    limitations: ['It is not announced when it appears; move focus to the part to have it read.', 'It prints a hint or an error only; there is no warning or success tone.', 'It does not link itself to a part, so you pass the id and set aria-describedby.'],
    youMust: ['Give it an id and set the part’s aria-describedby to that id.', 'Set aria-invalid on the part when the tone is error.', 'Name the problem and the fix in an error.'],
    usage: '<Input label="Temperature" aria-invalid aria-describedby="t-help" />\n<HelperText id="t-help" tone="error">Enter a value under 30.</HelperText>',
    backdrops: 'In light the hint is dark grey and the error a deep red on warm white plastic, in dark a light grey and a soft red on charcoal. Both hold 4.5:1, and nothing is orange.',
    purpose: 'Prints a hint or an error under a part, linked to it by id, with a glyph and words for an error.',
    importLine: "import { HelperText } from 'dial-react';",
    overview: (
      <>
        <p><code>HelperText</code> is a paragraph in the caption size. <code>tone</code> is <code>neutral</code> (a hint in secondary ink) or <code>error</code> (critical red, medium weight, with a dot-matrix glyph read out as Error). Pass <code>id</code> and point the part’s <code>aria-describedby</code> at it.</p>
      </>
    ),
    hero: ex('HelperTextBasic', 'A hint under a field, linked to it by id.'),
    ladder: [
      ex('HelperTextError', 'An error with the glyph and words, and aria-invalid on the field.'),
      ex('HelperTextTones', 'The two tones, one above the other.'),
      ex('HelperTextSwap', 'The line turns from hint to error as the value stops fitting.'),
      ex('HelperTextLong', 'A long message wraps beside its glyph.'),
    ],
    whenToUse: ['Tell the person what a part expects before they use it.', 'Name the problem under a part that failed a check.'],
    whenNotToUse: [['A message about the whole unit', 'Banner'], ['Grouping parts under one legend', 'Fieldset']],
    anatomy: [['Glyph', 'Icon critical, control.icon-sm, only in the error tone.'], ['Words', 'type.caption, leading.body; medium weight in the error tone.']],
    states: [['Neutral', 'Secondary ink, regular weight, no glyph.'], ['Error', 'status.critical-mark, medium weight, glyph first.']],
    content: ['Say what to do in one short sentence.', 'In an error, name the problem and the fix.', 'Do not write “Error:” first; the glyph is read as Error.'],
    dodont: [
      { do: 'Write “Enter a value under 30.”', dont: 'Write “Invalid input.”' },
      { do: 'Tell an error by a glyph, weight and words.', dont: 'Tell an error by red alone.' },
    ],
    a11y: ['The part points to the line with aria-describedby, so it is read after the part’s name.', 'The error glyph has the accessible name Error.', 'An error differs from a hint by a glyph and weight, not only colour.', 'In forced colours the line uses the system text colour.'],
    keyboard: [['Tab', 'Takes no focus; the part it describes does', 'HelperText: the error carries a glyph and words and is linked by id']],
    inherits: 'HTMLAttributes<HTMLParagraphElement>',
    related: [['/components/input', 'Input', 'A field that prints its own hint and error.'], ['/components/banner', 'Banner', 'A message about the whole unit.']],
  },
  {
    name: 'Label',
    slug: 'label',
    status: 'beta',
    limitations: ['It prints one line of help; longer guidance belongs in a Text under the part.', 'It only prints the mark; the control still needs its own required attribute.', 'The help id is not read back; pass helpId if the part must point to it.'],
    youMust: ['Tie the label to its part with htmlFor and the same id.', 'Set required on the control as well as on the label.', 'List helpId in the part’s aria-describedby when you set help.'],
    usage: '<Label htmlFor="room" required help="Shown on the room card.">Room name</Label>\n<input id="room" required />',
    backdrops: 'In light the name is dark brown ink on warm white plastic, in dark light cream on charcoal. The mark and help are one step lighter, and the contrast stays above 6.7:1 in both. Nothing is orange.',
    purpose: 'Prints the name of a part in medium ink, with a required or optional word and one line of help.',
    importLine: "import { Label } from 'dial-react';",
    overview: (
      <>
        <p><code>Label</code> is a real label element on the inset line above a part. The name is in medium ink, <code>required</code> or <code>optional</code> prints as a word at the far end, and <code>help</code> adds one line under the name. Input, Textarea and Select print their own labels in this same look.</p>
      </>
    ),
    hero: ex('LabelBasic', 'A required name tied to a field.'),
    ladder: [
      ex('LabelOptional', 'The optional word marks the exception.'),
      ex('LabelGlyph', 'A star after the name, with the word kept for screen readers.'),
      ex('LabelHelp', 'One line of help the field points to with aria-describedby.'),
      ex('LabelThai', 'Thai text with its own words for the mark.'),
    ],
    whenToUse: ['Name a part you built yourself.', 'Mark a part required or optional in words.'],
    whenNotToUse: [['A text field with a name', 'Input'], ['A running message after an action', 'Text']],
    anatomy: [['Name', 'type.label in type.weight-medium, text.primary.'], ['Mark', 'type.caption in text.secondary, at the far end of the line.'], ['Help', 'type.caption in text.secondary under the name.']],
    states: [['Required', 'The word required, or a star after the name.'], ['Optional', 'The word optional.'], ['Plain', 'The name alone.']],
    content: ['Name the part with a noun.', 'Do not end with a colon.', 'Keep help to one short line.'],
    dodont: [
      { do: 'Name the part with a noun and let the mark say if it is needed.', dont: 'Write “Please enter the room name:”.' },
      { do: 'Tell required with a word or a star.', dont: 'Tell required with a red tint.' },
    ],
    a11y: ['A native label tied by htmlFor, so pressing it focuses the part.', 'The mark is inside the label, so it is part of the accessible name.', 'The star is hidden from screen readers and the word is read instead.', 'In forced colours the text uses the system colours.'],
    keyboard: [['Tab', 'Moves to the part the label names; the label itself takes no focus', 'Label: the label names its part and the mark is in words']],
    inherits: 'LabelHTMLAttributes<HTMLLabelElement>',
    related: [['/components/input', 'Input', 'A text field that prints this label itself.'], ['/components/textarea', 'Textarea', 'Several lines, same label.']],
  },
  {
    name: 'InputGroup',
    slug: 'input-group',
    status: 'beta',
    limitations: ['Each end takes one add-on; there is no stack of several words at one end.', 'It is a single-line field; use Textarea for several lines.', 'A key inside the group is not disabled by the group; disable it yourself.'],
    youMust: ['Give every InputGroup a label, because it is the name of the field.', 'Put only fixed words or one plain IconButton in start and end.', 'Give a key in an add-on a name with the label prop of IconButton.'],
    usage: '<InputGroup label="Monthly price" start="THB" end="/ month" defaultValue="1,250" />',
    backdrops: 'In light the well is a light grey recess in warm white plastic with a grey ring edge and rules. In dark it is a near-black recess in charcoal with a light ring edge. The words are secondary ink in both and nothing is orange.',
    purpose: 'Takes text with a fixed word or key at one or both ends, ruled off inside one recessed well.',
    importLine: "import { InputGroup } from 'dial-react';",
    overview: (
      <>
        <p><code>InputGroup</code> is an Input with something fixed at its ends. <code>start</code> and <code>end</code> take a word such as THB or .local, or an IconButton such as Search. A hairline rule separates each add-on from the text you type. The group is one 44px window with one focus ring, and the label is printed above it. <code>size</code> is <code>md</code> or <code>lg</code> (52px).</p>
      </>
    ),
    hero: ex('InputGroupBasic', 'THB before the value and / month after it, ruled off inside one well.'),
    ladder: [
      ex('InputGroupAddress', 'A web address: the scheme before, the domain after, only the middle typed.'),
      ex('InputGroupKey', 'A key at the end of the well, with its own name and the same focus ring.'),
      ex('InputGroupSizes', 'md is a 44px well and lg is a 52px well with a 52px key.'),
      ex('InputGroupError', 'The well turns red and the problem is printed under it with a glyph.'),
    ],
    whenToUse: ['Enter the middle of a value that always has the same start or end.', 'Put one key beside a field when the key acts on that field alone.'],
    whenNotToUse: [['A short unit after a number and nothing else', 'Input'], ['Several lines of text', 'Textarea'], ['The key that saves the whole form', 'Button']],
    anatomy: [['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md tall.'], ['Add-on', 'type.label in type.weight-medium, text.secondary, a hairline rule in line.ring.'], ['Text', 'type.body in text.primary.'], ['Focus ring', 'width.ring in focus.ring around the whole well.']],
    states: [['Focus', 'One ring around the whole well.'], ['Invalid', 'Critical red edge and a message with a glyph.'], ['Disabled', 'No shadow and the print fades to half.']],
    content: ['Name the thing the field holds.', 'Keep each add-on to one short word.', 'Put the format in hint.'],
    dodont: [
      { do: 'Print the fixed THB in the well.', dont: 'Ask the person to type THB.' },
      { do: 'Keep a plain key in the add-on.', dont: 'Put the orange key inside a field.' },
    ],
    a11y: ['The label is the accessible name of the field.', 'A plain word in an add-on is part of the field’s description.', 'A key in an add-on is announced by its own name.', 'The rules are real borders, so they stay in forced colours.'],
    keyboard: [['Tab', 'Moves to the field, then to a key at the end', 'InputGroup: one focus ring surrounds the whole well when the text or a key inside it holds focus']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/input', 'Input', 'A field with at most a unit.'], ['/components/textarea', 'Textarea', 'Several lines of text.']],
  },
  {
    name: 'Kbd',
    slug: 'kbd',
    status: 'beta',
    limitations: ['It is not interactive; a cap takes no click, hover or focus.', 'One cap holds one key; a chord is a KbdCombo.', 'It prints the key name you give it and does not read the person’s keyboard layout.'],
    youMust: ['Write the key as it is printed on a keyboard.', 'Pass a label when a cap shows an icon or a symbol.', 'Use KbdCombo for keys pressed together and not a loose plus.'],
    usage: '<p>Press <Kbd>Esc</Kbd> to close, or <KbdCombo keys={[\'Ctrl\', \'K\']} /> to search.</p>',
    backdrops: 'In light the cap is warm white plastic with a ring-ink edge, in dark a charcoal cap with a lighter top edge. The ink is primary in both and nothing is orange.',
    purpose: 'Prints a key name as a small keycap, in a sentence or at the end of a shortcuts row.',
    importLine: "import { Kbd, KbdCombo } from 'dial-react';",
    overview: (
      <>
        <p><code>Kbd</code> prints one key name, such as Esc or Enter, as a keycap at least 24px square. The cap is flat, with a lit top edge and a lower edge twice as thick, so it reads as a key and casts no blur. <code>KbdCombo</code> holds several caps for a chord and joins them with a printed plus, which a screen reader reads as the word plus.</p>
      </>
    ),
    hero: ex('KbdBasic', 'Two key names inside a sentence.'),
    ladder: [
      ex('KbdChord', 'A chord of two or three keys, kept in one group.'),
      ex('KbdShortcuts', 'A shortcuts list with the keys on the end side of each row.'),
      ex('KbdSymbols', 'Caps that print an icon carry a spoken label.'),
      ex('KbdWithKey', 'A hint under the orange key; the cap stays plastic and ink.'),
    ],
    whenToUse: ['Name a key in a sentence of instructions.', 'List the shortcuts of a screen.'],
    whenNotToUse: [['A key the person presses on screen', 'Button'], ['A short status word or a count', 'Badge']],
    anatomy: [['Cap', 'surface.knob, width.hairline in line.ring with a width.ring lower edge, corner.mark, control.check minimum square.'], ['Name', 'type.label in type.weight-medium, primary ink.'], ['Chord', 'A kbd that groups caps with gap.xs between them.'], ['Plus', 'A printed + in secondary ink, hidden from assistive tech.']],
    states: [['Default', 'The only state; a Kbd has no hover, active or focus look.']],
    content: ['Write the key as printed: Esc, Enter, Ctrl.', 'One key in each cap.', 'Use KbdCombo for a chord.'],
    dodont: [
      { do: 'Put one key in one cap and group a chord with KbdCombo.', dont: 'Write two keys in one cap.' },
      { do: 'Give an icon cap a label.', dont: 'Leave a symbol cap silent.' },
    ],
    a11y: ['A kbd element, so the name is read as text.', 'A cap with an icon is read by its label and the printed cap is hidden.', 'The plus of a chord is read as the word plus.', 'The cap edge holds 3:1 against the body and the page in both themes.', 'In forced colours the cap keeps a real border in the text colour.'],
    keyboard: [['Tab', 'Does not stop on a Kbd', 'Kbd: a chord is a group of caps with the plus hidden from assistive tech']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/button', 'Button', 'A key the person presses on screen.'], ['/components/badge', 'Badge', 'A printed word or count that is not a key.']],
  },
  {
    name: 'Image',
    slug: 'image',
    status: 'beta',
    limitations: ['It is not interactive; to make a picture pressable, wrap it in a link or button.', 'The ratio comes from a closed list of four (1/1, 4/3, 16/9, 3/2).', 'Text cannot be laid over the picture; the caption always sits below the window.'],
    youMust: ['Write alt for every picture, or pass an empty alt on purpose for decoration.', 'Pick the ratio the picture was made in, or use contain.', 'Keep words about the picture in caption, below the window.'],
    usage: '<Image src="/hall.jpg" alt="The hall, seen from the front door" ratio="4/3" caption="Hall, 08:10" />',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The ring and the dashes are ink in both, and nothing is orange.',
    purpose: 'Shows a picture in a recessed window held at a fixed proportion, with a caption below.',
    importLine: "import { Image } from 'dial-react';",
    overview: (
      <>
        <p><code>Image</code> is a figure: a window cut into the body, and an optional caption under it. The window is as wide as its column and takes its height from <code>ratio</code>, which is <code>1/1</code>, <code>4/3</code>, <code>16/9</code> (the default) or <code>3/2</code>. <code>fit</code> is <code>cover</code> (crop to fill) or <code>contain</code> (show it all). While the picture loads the window prints one dash, and if it fails, two. <code>alt</code> is required.</p>
      </>
    ),
    hero: ex('ImageBasic', 'A picture at four to three with its caption printed below.'),
    ladder: [
      ex('ImageDecorative', 'An empty alt marks a picture as decoration.'),
      ex('ImageLoading', 'loading lazy holds the window at its ratio until the picture arrives.'),
      ex('ImageRatios', 'The four ratios. Each window is as wide as its cell and the height follows.'),
      ex('ImageFit', 'Cover crops a tall plan to fill the window; contain shows all of it.'),
      ex('ImageStates', 'A picture that fails and a window with no address print two dashes and keep their size.'),
      ex('ImageInCard', 'A picture heads a card; the title and text stand on the body below.'),
    ],
    whenToUse: ['Show a photo, a camera frame or a plan inside a card or a page.', 'Hold the space of a picture that loads late.'],
    whenNotToUse: [['A person or an owner', 'Avatar'], ['A glyph for a device or a room', 'Icon'], ['Content that needs a fixed shape but is not a picture', 'AspectRatio']],
    anatomy: [['Window', 'AspectRatio with surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Picture', 'Fills the window and is clipped by its ring.'], ['Dash', 'One dash in text.secondary while loading, two when failed.'], ['Caption', 'type.caption in text.secondary, on the body below the window.']],
    states: [['Loading', 'One dash in the window; the height is held.'], ['Loaded', 'The picture fills the window.'], ['Failed', 'Two dashes; no broken-image icon.']],
    content: ['Describe what the picture shows in one sentence.', 'Use caption for a place and a time.', 'Never use a file name as alt.'],
    dodont: [
      { do: 'Describe the picture in alt.', dont: 'Write “image” or a file name.' },
      { do: 'Put words about the picture in the caption.', dont: 'Lay text over the photo.' },
    ],
    a11y: ['The picture is an img with its alt text.', 'A failed picture leaves the window as an image named by alt, so nothing is lost.', 'An empty alt hides the window from assistive tech.', 'It takes no focus.', 'In forced colours the ring and the dashes use the text colour and the inset shadow is dropped.'],
    keyboard: [['Tab', 'Does not stop on an Image', 'Image: a failed window is an image named by alt and takes no focus']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/aspect-ratio', 'AspectRatio', 'The frame Image uses for its proportion.'], ['/components/avatar', 'Avatar', 'A person or owner as a picture or letters.'], ['/components/card', 'Card', 'The body an Image usually heads.']],
  },
  {
    name: 'FormField',
    slug: 'form-field',
    status: 'beta',
    limitations: ['It does not draw the control; a bare control is unstyled unless you bring a dial well.', 'Controls that print their own label, such as Input, do not need it.', 'It wires one control; use Fieldset for a group.'],
    youMust: ['Give the control the id, or let the child element receive it.', 'Pass the problem as error and leave it undefined when the value is fine.', 'Keep the label a noun that names the control.'],
    usage: '<FormField label="Room name" hint="Shown on the home screen.">\n  <input />\n</FormField>',
    backdrops: 'It paints nothing, so it follows the body. Label ink is primary and the hint is secondary in both themes; an error is critical red with a glyph. Nothing is orange.',
    purpose: 'Joins a printed name, a control and its small print on one inset line, and wires them for screen readers.',
    importLine: "import { FormField } from 'dial-react';",
    overview: (
      <>
        <p><code>FormField</code> places a <code>Label</code>, one control and a <code>HelperText</code> in a column. It sets the control’s <code>id</code>, points the label at it and lists the hint and error in <code>aria-describedby</code>. An error also sets <code>aria-invalid</code>. Pass one element, or a function to place the props yourself.</p>
      </>
    ),
    hero: ex('FormFieldBasic', 'A label above a bare control with a hint under it.'),
    ladder: [
      ex('FormFieldHint', 'required prints the word Required beside the name.'),
      ex('FormFieldError', 'An error marks the control invalid and prints a glyph and words.'),
      ex('FormFieldInline', 'The inline layout puts the label at the start.'),
      ex('FormFieldRender', 'A render-prop child places the wired props on a Switch.'),
      ex('FormFieldMarks', 'Required, optional and glyph marks.'),
    ],
    whenToUse: ['Label a bare or custom control that has no label of its own.', 'Show a hint and an error the same way across a form.'],
    whenNotToUse: [['Naming a group of controls', 'Fieldset'], ['A text field', 'Input']],
    anatomy: [['Label', 'The Label component, type.label in type.weight-medium.'], ['Control', 'Your element, given id, aria-describedby, aria-invalid and required.'], ['Messages', 'HelperText under the control, in a polite live region.']],
    states: [['Invalid', 'aria-invalid on the control and an error line with a glyph.'], ['Inline', 'The label in a 128px column at the start.']],
    content: ['Name the control with a noun.', 'Write the hint as the format, not an instruction.', 'Say what is wrong and how to fix it in the error.'],
    dodont: [
      { do: 'Let the field wire the label and the hint.', dont: 'Set htmlFor and aria-describedby by hand.' },
      { do: 'Tell an error by words and a glyph.', dont: 'Tell an error by colour alone.' },
    ],
    a11y: ['The label’s htmlFor matches the control’s id, so the label is the name.', 'The hint and error are in aria-describedby.', 'The messages sit in an aria-live polite region that is always present.', 'In forced colours Label and HelperText use the system text colours.'],
    keyboard: [['Tab', 'Moves to the control; the field takes no focus itself', 'FormField: the label names the control and the messages are linked to it']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/label', 'Label', 'The printed name on its own.'], ['/components/helper-text', 'HelperText', 'The line under a part.'], ['/components/fieldset', 'Fieldset', 'A named group of controls.']],
  },
  {
    name: 'FAB',
    slug: 'fab',
    status: 'beta',
    limitations: ['It is one key; there is no speed-dial that opens more keys.', 'It does not hide or move on scroll.', 'Use it once per unit. A second FAB means a second orange key.'],
    youMust: ['Give the nearest parent position: relative, or set position to viewport.', 'Pad the end of the content so the last line is not lost under the seat.', 'Keep a primary Button out of the same unit.'],
    usage: '<div style={{ position: \'relative\' }}>\n  <FAB label="Add room" />\n</div>',
    backdrops: 'In light the seat is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The key is the same orange in both, and its rim keeps 3:1 against the seat.',
    purpose: 'The unit’s one orange key, fixed in the lower corner in an opaque seat.',
    importLine: "import { FAB } from 'dial-react';",
    overview: (
      <>
        <p><code>FAB</code> is the main action of a unit. The orange key sits in a round seat cut into the body, one step in from the inline-end and block-end corner, and clear of the device’s safe area. The seat is opaque, so text beneath it is hidden. <code>extended</code> prints the label beside the glyph, <code>icon</code> picks the glyph and <code>position</code> chooses the container or the window.</p>
      </>
    ),
    hero: ex('FABBasic', 'The orange key in its seat, in the corner of a unit.'),
    ladder: [
      ex('FABExtended', 'With room, the key prints its word and becomes a capsule.'),
      ex('FABIcons', 'The glyph follows the action: edit for changing a scene.'),
      ex('FABPositions', 'position viewport fixes the key to the window.'),
      ex('FABOverText', 'Text runs under the seat and the seat hides it.'),
      ex('FABThai', 'A Thai word keeps its marks inside the key.'),
    ],
    whenToUse: ['Use it for the one action a screen exists for.', 'Use it when the action must stay reachable as the content changes.'],
    whenNotToUse: [['An action that belongs to one card or row', 'Button'], ['A round key for a secondary action', 'IconButton'], ['A choice between several actions', 'ActionSheet']],
    anatomy: [['Seat', 'surface.sunken, elevation.well, width.hairline in line.ring, gap.md padding, corner.round.'], ['Key', 'action.accent with action.accent-rim, control.lg square, elevation.part.'], ['Glyph', 'Icon at control.icon-md in text.on-accent.'], ['Word', 'type.label in type.weight-medium, on an extended key only.']],
    states: [['Hover', 'The orange moves to action.accent-hover.'], ['Active', 'The key drops by motion.press-travel and the shadow collapses.'], ['Focus', 'A ring outside the key in focus.ring.'], ['Disabled', 'Half-faded and flat.']],
    content: ['Name the action with a verb and a noun.', 'Keep the label to two or three words.', 'Pick a glyph that matches the label.'],
    dodont: [
      { do: 'Keep one orange key in the unit.', dont: 'Put a primary Button beside the FAB.' },
      { do: 'Pad the end of the content.', dont: 'Let the last line slide under the seat.' },
    ],
    a11y: ['It is a native button named by label; the glyph is hidden.', 'The key is 52px, above the 44px target.', 'Focus shows a ring that does not depend on orange.', 'The rim holds 3:1 against the seat in both themes.', 'In forced colours the key and the seat keep real borders.', 'Under reduce motion the key changes at once, with no travel.'],
    keyboard: [['Tab', 'Moves focus to the key', 'FAB: the key is a named button fixed to the corner of its container'], ['Enter or Space', 'Presses the key', 'FAB: the key is a named button fixed to the corner of its container']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/button', 'Button', 'An action that belongs to one card or row.'], ['/components/icon-button', 'IconButton', 'A round key for a secondary action.'], ['/components/bottom-nav', 'BottomNav', 'The strip the FAB must clear.']],
  },
  {
    name: 'Table',
    slug: 'table',
    status: 'beta',
    limitations: ['It does not sort, filter or page your data; you order the rows and pass them in.', 'Rows cannot be selected, expanded or pressed.', 'There are no sticky headers or columns, and no virtual scrolling for very long tables.'],
    youMust: ['Give every column a header cell with a clear name.', 'Set numeric on the header and on every cell of a number column.', 'Reorder the rows yourself when onSort fires and set sort on the one sorted column.'],
    usage: '<Table caption="Energy by room">\n  <TableHead>\n    <TableRow><TableHeaderCell>Room</TableHeaderCell></TableRow>\n  </TableHead>\n  <TableBody>\n    <TableRow><TableCell>Kitchen</TableCell></TableRow>\n  </TableBody>\n</Table>',
    backdrops: 'In light the text is dark ink on warm white plastic, in dark light ink on charcoal. The seam between rows is a divider line over a lit edge in both, and nothing is orange.',
    purpose: 'Prints rows and columns of readings in flat ink with a seam between rows.',
    importLine: "import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from 'dial-react';",
    overview: (
      <>
        <p><code>Table</code> is a native table with a caption. <code>TableHeaderCell</code> carries <code>scope</code> and, with <code>onSort</code>, becomes a key that sorts; <code>sort</code> is announced with aria-sort and shown as a chevron. <code>numeric</code> aligns a cell to the end edge in tabular figures. When the columns are wider than the unit the table scrolls sideways and that region takes a Tab stop.</p>
      </>
    ),
    hero: ex('TableBasic', 'Three rooms with a device and a state, a seam between rows.'),
    ladder: [
      ex('TableNumeric', 'Two number columns aligned to the end edge.'),
      ex('TableSortable', 'Press a header to order the rows; the chevron shows the direction.'),
      ex('TableNarrow', 'Six columns in a narrow unit scroll sideways and take a Tab stop.'),
      ex('TableRowHeaders', 'A row header names each room, with a Thai name that wraps safely.'),
    ],
    whenToUse: ['Compare the same facts across several rows.', 'List readings the person reads across a row and down a column.'],
    whenNotToUse: [['A short list of items', 'List'], ['One number with a trend', 'Stat']],
    anatomy: [['Caption', 'type.caption in text.secondary above the header.'], ['Header cell', 'type.weight-medium in text.secondary, with a divider seam below.'], ['Cell', 'type.body, a divider seam below and a lit edge above, gap.md padding.'], ['Sort key', 'control.md tall, with a control.icon-sm chevron slot.']],
    states: [['Sortable', 'The label is a key; aria-sort is none.'], ['Sorted', 'Primary ink, an up or down chevron and aria-sort.'], ['Overflowing', 'The region scrolls sideways and takes a Tab stop.']],
    content: ['Name columns with nouns.', 'Put the unit in the header, not in every cell.', 'Give the table a caption.'],
    dodont: [
      { do: 'Put the unit in the header and keep bare numbers in the cells.', dont: 'Repeat “kilowatt hours” in every row.' },
      { do: 'Set numeric on the whole column.', dont: 'Leave some number cells aligned to the start edge.' },
    ],
    a11y: ['A native table with a caption, column headers and scope.', 'A sorted column carries aria-sort and a chevron, so direction is a shape and not a colour.', 'A region that scrolls sideways is focusable and named by the caption.', 'In forced colours the seams draw as one system-colour line and the focus ring stays visible.'],
    keyboard: [['Tab', 'Moves to each sort key and to a scroll region that overflows', 'Table: sort keys press with Enter or Space and the headers carry aria-sort'], ['Enter, Space', 'Presses the focused sort key', 'Table: sort keys press with Enter or Space and the headers carry aria-sort']],
    inherits: 'HTMLAttributes<HTMLTableElement>',
    related: [['/components/list', 'List', 'A short list of items.'], ['/components/pagination', 'Pagination', 'Moving between pages of rows.'], ['/components/stat', 'Stat', 'One number with a trend.']],
  },
  {
    name: 'Rating',
    slug: 'rating',
    status: 'beta',
    limitations: ['The scale starts at 1; a picked value cannot be cleared by pressing it again.', 'Halves are for display mode only; pick mode holds whole numbers.', 'The marks are round dot lattices; there is no star or custom icon.'],
    youMust: ['Give every Rating a label that is the question it answers.', 'Use readOnly for a value the person cannot change.', 'Pair a picked Rating with a key that sends it; the Rating does not submit by itself.'],
    usage: '<Rating label="Comfort" defaultValue={3} onValueChange={setScore} />\n<Rating label="Average" readOnly value={3.5} />',
    backdrops: 'In light the marks are dark grey dots on warm white plastic, in dark they are pale dots on charcoal. A lit mark and an empty mark differ by shape in both, and nothing is orange.',
    purpose: 'Picks or shows a score from 1 to 5 as dot lattices: a solid disc is lit, a hollow ring is empty.',
    importLine: "import { Rating } from 'dial-react';",
    overview: (
      <>
        <p><code>Rating</code> is a row of marks. A lit mark is a solid disc of round dots and an empty mark is a hollow ring, so the value reads without colour. In pick mode it is a radio group named by <code>label</code>; the arrow keys walk the marks and Home and End reach the ends. With <code>readOnly</code> it only shows a value, and halves such as 3.5 are allowed.</p>
      </>
    ),
    hero: ex('RatingBasic', 'Five marks with three lit. The value is printed beside them.'),
    ladder: [
      ex('RatingControlled', 'Controlled with value and onValueChange.'),
      ex('RatingReadOnly', 'Display mode with a half mark, a full row and the value hidden.'),
      ex('RatingStates', 'Nothing chosen, a value chosen and disabled.'),
      ex('RatingMax', 'A shorter scale with max.'),
    ],
    whenToUse: ['Ask for a score from 1 to 5.', 'Show an average score in a card or a list.'],
    whenNotToUse: [['Choosing one of several named options', 'Radio'], ['Picking a number on a long range', 'Slider'], ['How far a task has got', 'Progress']],
    anatomy: [['Mark', 'A control.check lattice of round dots in a control.md target.'], ['Lit mark', 'Core dots lit, text.primary.'], ['Empty mark', 'Ring dots only, text.secondary.'], ['Value', 'type.body in tabular figures, after the marks.']],
    states: [['Lit', 'A solid disc of dots in primary ink.'], ['Empty', 'A hollow ring of dots in secondary ink.'], ['Half', 'A disc on the start side. Display mode only.'], ['Focus', 'The focus ring around the 44px target.'], ['Disabled', 'Half-strength ink and no press.']],
    content: ['Name the Rating with the question it answers.', 'Do not write “out of 5” in the label.', 'Keep the scale to five marks or fewer.'],
    dodont: [
      { do: 'Ask a question as the label.', dont: 'Write “Rate from 1 to 5 stars”.' },
      { do: 'Use readOnly for an average.', dont: 'Leave an average pressable.' },
    ],
    a11y: ['Pick mode is a radiogroup named by its label; each mark is a radio named “n of max”.', 'Display mode is one image named with the label and the value.', 'Lit and empty differ by shape, not only by ink.', 'Each mark is a 44px target.', 'In forced colours the dots draw in the text colour.'],
    keyboard: [['Arrow keys', 'Walk to the next or previous mark and choose it', 'Rating: arrow keys walk the marks and Home and End reach the ends'], ['Home, End', 'Choose the first or the last mark', 'Rating: arrow keys walk the marks and Home and End reach the ends'], ['Tab', 'Moves into the group at the chosen mark', 'Rating: the marks are a labelled radio group with one chosen']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/radio', 'Radio', 'Choosing one named option.'], ['/components/slider', 'Slider', 'Picking a number on a range.']],
  },
  {
    name: 'Drawer',
    slug: 'drawer',
    status: 'beta',
    limitations: ['It is modal; the page behind is inert while it is open, so it cannot sit beside the page. Use modal false to show it in place.', 'It holds one list; it has no tabs and no second level.', 'It is at most as wide as layout.sidebar and it never takes the full width of a phone.'],
    youMust: ['Name the drawer for what its list holds, as in "Rooms".', 'Keep at most one Button kind="primary" in actions.', 'Pass your own closeLabel when the product is not in English.'],
    usage: '<Drawer trigger={<Button>Rooms</Button>} title="Rooms">\n  <List label="Rooms">…</List>\n</Drawer>',
    backdrops: 'In light the drawer is warm-white plastic over a dimmed room, in dark it is charcoal plastic. Title and rows are primary ink, hairlines are divider grey, and nothing is orange except one optional key.',
    purpose: 'Slides a full-height plastic panel in from the inline end to list rooms, programs or filters.',
    importLine: "import { Drawer } from 'dial-react';",
    overview: (
      <>
        <p><code>Drawer</code> is a side panel on the browser’s modal dialog. It stands inset from the window, with a title and a round close key on top, a list that scrolls in the middle and optional keys at the bottom. It slides in from the inline end, and it stays on screen while it slides back out. Focus moves in, Tab stays inside, and Escape or a click on the scrim closes it.</p>
      </>
    ),
    hero: ex('DrawerBasic', 'A key opens a list of rooms from the inline end, with one key at the bottom.'),
    ladder: [
      ex('DrawerStart', 'side start slides the drawer in from the inline start.'),
      ex('DrawerControlled', 'The page opens and closes the drawer through open and onOpenChange.'),
      ex('DrawerInPlace', 'modal false shows the drawer in place, with no scrim.'),
      ex('DrawerLongList', 'A long list scrolls inside while the title and the key stay put.'),
    ],
    whenToUse: ['List rooms, programs or devices to pick from.', 'Hold the filters of a long list behind one key.'],
    whenNotToUse: [['Every control of one device', 'Sheet'], ['One question before an action', 'Dialog'], ['A short list of actions next to a key', 'Menu']],
    anatomy: [['Body', 'surface.solid, elevation.float, corner.panel, gap.inset on all sides, at most layout.sidebar wide.'], ['Title', 'type.emphasis in type.weight-medium.'], ['Close key', 'A round 44px key at the end of the header.'], ['List', 'The rows, scrolling inside the body.'], ['Keys', 'Optional keys at the bottom under a hairline.']],
    states: [['Closed', 'Nothing is drawn, aria-expanded="false" on the opener.'], ['Open', 'The drawer slides in over motion.release and the scrim fades in.'], ['Closing', 'The drawer slides out over motion.exit and no key reaches it.'], ['Reduced motion', 'The drawer fades and does not travel.']],
    content: ['Name the drawer for what the list holds.', 'Name rows with what the person called them.', 'Write the key as a verb and a noun.'],
    dodont: [
      { do: 'Title it "Rooms" and end it with "Add room".', dont: 'Title it "Menu" and end it with "OK".' },
      { do: 'Keep one orange key, the one that applies.', dont: 'Make two keys orange.' },
    ],
    a11y: ['A modal dialog named by its title through aria-labelledby.', 'The opener carries aria-haspopup="dialog" and aria-expanded.', 'Focus goes to the drawer on open and back to the opener once it has left.', 'The close key is 44px and has an accessible name.', 'In forced colours the drawer keeps a real border and the hairlines use the text colour.', 'Under Reduce motion the drawer fades and does not travel.'],
    keyboard: [['Enter / Space', 'Opens the drawer on its opener and moves focus into it', 'Drawer: Enter on the opener opens a modal drawer named by its title'], ['Tab / Shift+Tab', 'Moves through the close key, the rows and the keys, and stays inside', 'Drawer: Tab and Shift+Tab stay inside the drawer'], ['Escape', 'Closes the drawer and returns focus to the opener', 'Drawer: Escape and a click on the scrim close the drawer and focus returns to the opener']],
    inherits: 'HTMLAttributes<HTMLDialogElement>',
    related: [['/components/sheet', 'Sheet', 'Every control of one device.'], ['/components/dialog', 'Dialog', 'One question before an action.']],
  },
  {
    name: 'Listbox',
    slug: 'listbox',
    status: 'beta',
    limitations: ['It is always open; for a long list that should fold away, use Select.', 'Rows are plain words with an optional mark; a row cannot hold a form control.', 'Shift with arrows toggles rows one by one; it does not select a range with Home and End.'],
    youMust: ['Give every Listbox a label, because it is the name of the list.', 'Give each option a value that is unique inside the list.', 'Pass a label to every option, even when it also has an icon.'],
    usage: '<Listbox label="Heating mode" defaultValue="eco" options={[\n  { value: "comfort", label: "Comfort" },\n  { value: "eco", label: "Eco" },\n]} />',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The rows and the tick are ink in both, and nothing is orange.',
    purpose: 'Prints every option at once in one recessed window, with the chosen rows marked by a tick and weight.',
    importLine: "import { Listbox } from 'dial-react';",
    overview: (
      <>
        <p><code>Listbox</code> is an always-open list of options. It has one tab stop. The arrow keys, Home, End and the Page keys walk the rows, a letter jumps to the next row that starts with it, and Space or Enter chooses. With <code>multiple</code> Space toggles each row and the value is an array. An option takes <code>value</code>, <code>label</code>, an optional <code>leading</code> mark and <code>disabled</code>.</p>
      </>
    ),
    hero: ex('ListboxBasic', 'Five programmes in one window, one chosen.'),
    ladder: [
      ex('ListboxMultiple', 'Any number of rows, with the value held in state.'),
      ex('ListboxLeading', 'A dot-matrix icon before the words.'),
      ex('ListboxSizes', 'Rows at 44px and 52px.'),
      ex('ListboxStates', 'A disabled row, a disabled list and an empty list.'),
    ],
    whenToUse: ['Choose from three to ten options that fit on the screen.', 'Choose several rooms or devices at once.'],
    whenNotToUse: [['A long list that should fold away', 'Select'], ['Two to four modes as keys', 'SegmentedControl']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the window.'], ['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Row', 'control.md tall, type.body, corner.media.'], ['Tick', 'The check glyph in control.icon-sm, empty on rows that are not chosen.']],
    states: [['Chosen', 'A tick and medium weight in primary ink, with aria-selected.'], ['Reached', 'A plate of surface.solid with a line.ring hairline.'], ['Disabled row', 'Half-faded and skipped by the arrows.'], ['Disabled list', 'No shadow, half-faded, no tab stop.']],
    content: ['Name the list with a noun.', 'Write each option as a short noun or phrase.', 'Keep it to ten rows or fewer.'],
    dodont: [
      { do: 'Name the list with a noun and each row with a noun.', dont: 'Write “Please select one of the following” and number the rows.' },
      { do: 'Use multiple for choices that can run together.', dont: 'Use multiple for modes that exclude each other.' },
    ],
    a11y: ['The list has role listbox, named by its label.', 'Focus stays on the list and aria-activedescendant names the reached row.', 'With multiple the list carries aria-multiselectable.', 'A chosen row is told by a tick and weight as well as aria-selected.', 'In forced colours the window keeps a real border and the reached row uses the system highlight.'],
    keyboard: [['Tab', 'Moves focus to the list as one stop', 'Listbox: one tab stop, focus lands on the first chosen row'], ['ArrowDown / ArrowUp', 'Moves the reached row, skipping disabled rows', 'Listbox: the reached row follows the arrows'], ['Space', 'Chooses the reached row, or toggles it in multiple', 'Listbox: Space chooses the reached row']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/select', 'Select', 'The same rows in a panel that opens.'], ['/components/segmented-control', 'SegmentedControl', 'Two to four modes as keys.']],
  },
  {
    name: 'TagInput',
    slug: 'tag-input',
    status: 'beta',
    limitations: ['It holds short text tags only; a tag cannot carry an icon or a value apart from its text.', 'Tags are kept in the order they were added and cannot be dragged.', 'There is no suggestion list; use a Combobox when the words come from a known set.'],
    youMust: ['Give it a label that names the list, such as Rooms.', 'Say the keys and any limit in the hint.', 'Pass your own words for the remove keys and refusals on a page that is not in English.'],
    usage: '<TagInput label="Rooms" max={3} defaultValue={["Kitchen"]} />',
    backdrops: 'In light the well is a light grey recess in warm white plastic with raised grey chips, in dark a near-black recess with charcoal chips. A refusal is critical red with a glyph, and nothing is orange.',
    purpose: 'Keeps typed words as removable chips inside a recessed well.',
    importLine: "import { TagInput } from 'dial-react';",
    overview: (
      <>
        <p><code>TagInput</code> is an Input well that wraps onto more rows. Enter or a comma turns the text into a Chip, and Backspace on an empty field takes the last chip back. Each chip has a named remove key with a 44px target. Duplicates and a limit set with <code>max</code> are refused with a printed line that is also read out.</p>
      </>
    ),
    hero: ex('TagInputBasic', 'Two rooms stand as chips and the caret follows them.'),
    ladder: [
      ex('TagInputMax', 'At three tags the next one is refused with a printed line.'),
      ex('TagInputDuplicates', 'Repeats are refused unless allowDuplicates is set.'),
      ex('TagInputMessages', 'Every built-in word is a prop, here in Thai.'),
      ex('TagInputControlled', 'The list is held by the page, with its own error.'),
    ],
    whenToUse: ['Collect a free list of short words such as rooms or labels.', 'Let a person see and remove each word without leaving the field.'],
    whenNotToUse: [['Choosing from a fixed set', 'MultiSelect'], ['Entering one value', 'Input']],
    anatomy: [['Label', 'type.label in type.weight-medium, above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md tall at least.'], ['Chip', 'The removable Chip, control.md tall, with its own remove key.'], ['Text field', 'type.body, control.md tall, in the rest of the row.'], ['Hint and error', 'type.caption; the error in status.critical with a glyph.']],
    states: [['Focus', 'width.ring in focus.ring around the well.'], ['Refused', 'status.critical edge and a printed line with a glyph.'], ['Disabled', 'No recess shadow, flat chips, opacity.disabled on the text.']],
    content: ['Label the field with a plural noun.', 'Keep each tag to one or two words.', 'Put the keys and the limit in the hint.'],
    dodont: [
      { do: 'Label the field with a plural noun and put the keys in the hint.', dont: 'Write the instruction as the label.' },
      { do: 'Print the limit before the person reaches it.', dont: 'Refuse a tag with no word.' },
    ],
    a11y: ['The tags are a list named by the label.', 'Each remove key is named Remove and the tag, and reaches 44px.', 'Adding, removing and refusing are read out through a polite status.', 'An invalid field sets aria-invalid and its message carries a glyph and words.', 'Enter is ignored while an input method is composing, so Thai and other IME text is not cut.', 'In forced colours the well keeps a real border and the focus ring uses the system highlight colour.'],
    keyboard: [['Enter, comma', 'Turns the text into a tag', 'TagInput: Enter and a comma turn typed text into chips and empty the field'], ['Backspace', 'On an empty field, removes the last tag', 'TagInput: Backspace on an empty field removes the last chip, and only then'], ['Tab', 'Reaches each remove key, then the field', 'TagInput: every chip and the text field are at least the touch target tall and each remove key is named']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/input', 'Input', 'One value, one string.'], ['/components/chip', 'Chip', 'The removable key used for each tag.']],
  },
  {
    name: 'RadioCards',
    slug: 'radio-cards',
    status: 'beta',
    limitations: ['A group is a single column; there is no horizontal or grid layout.', 'The plates need a RadioCards group; a RadioCard outside one is a plain native radio with no shared state.', 'Home and End do not move the choice, because native radio groups do not map them.'],
    youMust: ['Give the group a printed name through the label prop.', 'Give each plate a unique value and a title that is a noun.', 'Put a text line on every plate, or use Radio instead.'],
    usage: '<RadioCards label="Heating mode" defaultValue="eco">\n  <RadioCard value="eco" title="Eco" description="Lowers the heat when nobody is home." />\n  <RadioCard value="comfort" title="Comfort" description="Holds 21 degrees all day." />\n</RadioCards>',
    backdrops: 'In light the plates are warm white plastic with a ring edge and a short shadow, in dark charcoal plastic. The bar and the weight are ink in both, and nothing is orange.',
    purpose: 'Chooses one of a few options that each need a sentence, on key plates where the chosen one sits down.',
    importLine: "import { RadioCards, RadioCard } from 'dial-react';",
    overview: (
      <>
        <p><code>RadioCards</code> is a native radio group drawn as a column of wide key plates. Each <code>RadioCard</code> prints its <code>title</code>, an optional <code>description</code> and an optional <code>leading</code> node, such as an icon. The chosen plate sits down with no shadow, shows a bar of ink at its start and turns its title medium.</p>
      </>
    ),
    hero: ex('RadioCardsBasic', 'Three plates with a name and a line each; Comfort is chosen.'),
    ladder: [
      ex('RadioCardsLeading', 'A dot-matrix icon leads each plate.'),
      ex('RadioCardsControlled', 'The value is held by the page and printed under the group.'),
      ex('RadioCardsStates', 'One plate disabled, and a whole group disabled.'),
      ex('RadioCardsInUnit', 'Plates in a unit, before the one orange key.'),
    ],
    whenToUse: ['Pick one of two to five options that each need a line of explanation.', 'Compare modes or plans where the name alone does not say what changes.'],
    whenNotToUse: [['Options that a word each can explain', 'Radio'], ['A choice told by words alone', 'Legend'], ['Picking from a long list', 'Select']],
    anatomy: [['Plate', 'surface.raised, elevation.part, width.hairline in line.ring, corner.inner, at least control.md tall.'], ['Index bar', 'width.bar in text.primary, at the start of the chosen plate.'], ['Title', 'type.body, type.weight-medium when chosen.'], ['Description', 'type.label in text.secondary.'], ['Leading', 'An optional node before the words.']],
    states: [['Chosen', 'The plate sits down with no shadow, the bar shows and the title is medium.'], ['Hover', 'The ring edge darkens one step.'], ['Pressed', 'The plate drops by motion.press-travel.'], ['Disabled', 'No height, half strength.']],
    content: ['Write the title as a noun.', 'Write the description as one short sentence about what changes.', 'Keep it to five plates.'],
    dodont: [
      { do: 'Name the mode and say what it does.', dont: 'Write an instruction as the title.' },
      { do: 'Tell chosen by a bar, a weight and a lowered face.', dont: 'Tell chosen by a coloured border.' },
    ],
    a11y: ['A fieldset with a legend, so the group is announced with its name.', 'Native radio inputs share one name, so the browser handles arrow keys and the tab stop.', 'Each radio is named by its title and described by its text.', 'The whole plate is a label of at least 44px.', 'In forced colours the plate keeps a real border and the bar uses the text colour.'],
    keyboard: [['Tab', 'Moves into the group, to the chosen plate', 'RadioCards: the group is a named radio group and exactly one plate is chosen'], ['Arrow keys', 'Move to the next or previous plate and choose it', 'RadioCards: an arrow key moves the choice to the next plate and keeps one chosen'], ['Space', 'Chooses the focused plate', 'RadioCards: pressing a plate chooses it and the plate is at least the touch target']],
    inherits: 'FieldsetHTMLAttributes<HTMLFieldSetElement>',
    related: [['/components/radio', 'Radio', 'Round keys with one word each.'], ['/components/legend', 'Legend', 'A choice told by printed words alone.']],
  },
  {
    name: 'ContextMenu',
    slug: 'context-menu',
    status: 'beta',
    limitations: ['It never replaces a visible key: the right-click and the long press are hidden gestures.', 'It opens at one point and does not follow a page that scrolls; scrolling closes it.', 'It holds actions only; no checkboxes, radios or sub-menus.'],
    youMust: ['Put every action on a visible key too, usually a Menu beside the object.', 'Give the object tabIndex={0}, or put a focusable part inside it, so the Context Menu key can reach it.', 'Name the panel for its object with label.'],
    usage: '<ContextMenu items={actions} label="Actions for Kitchen lamp" onAction={run} tabIndex={0}>\n  Kitchen lamp\n</ContextMenu>',
    backdrops: 'In light the panel is warm white plastic with a short soft shadow and the open object a light grey recess, in dark charcoal plastic and a near-black recess. Rows are ink in both and nothing is orange.',
    purpose: 'Opens Menu’s panel of actions at the point you right-click, press and hold, or reach with the Context Menu key.',
    importLine: "import { ContextMenu } from 'dial-react';",
    overview: (
      <>
        <p><code>ContextMenu</code> wraps one object and opens the same panel as <code>Menu</code> at the spot you pressed. A right-click opens it, a half-second press with a finger opens it, and so do the Context Menu key and Shift+F10. While it is open the object sinks into a well, so it is clear what the actions are for.</p>
        <p>It is a shortcut and never the only way to an action. Repeat every action on a visible key.</p>
      </>
    ),
    hero: ex('ContextMenuBasic', 'Right-click the card, or press and hold, and the panel opens at the point.'),
    ladder: [
      ex('ContextMenuWithKey', 'The same actions sit on a visible Menu key in the card.'),
      ex('ContextMenuIcons', 'A glyph before each word and the destructive action last.'),
      ex('ContextMenuStates', 'An action that cannot run fades; a disabled area leaves the browser menu alone.'),
      ex('ContextMenuThai', 'Thai words keep their line height and the panel grows to the longest one.'),
    ],
    whenToUse: ['Give a device card, a row or a tile quick actions at the pointer.', 'Repeat the actions of a visible Menu as a shortcut for mouse users.'],
    whenNotToUse: [['The only place an action can be reached', 'Menu'], ['A short list of choices on a phone sheet', 'ActionSheet']],
    anatomy: [['Object', 'The wrapped area. While open: surface.sunken and elevation.well.'], ['Panel', 'Menu’s panel: surface.solid, elevation.float, corner.inner, layer.overlay.'], ['Row', 'control.md tall, type.body, the reached row a recess.']],
    states: [['Closed', 'The object as it is.'], ['Open', 'The object sinks into a well and the panel stands at the point.'], ['Disabled', 'No menu, and the browser menu shows as usual.']],
    content: ['Start each action with a verb.', 'Name the panel for its object.', 'Put the action that removes something last.'],
    dodont: [
      { do: 'Repeat every action on a visible Menu key.', dont: 'Make the right-click the only way to rename.' },
      { do: 'Name the panel “Actions for Kitchen lamp”.', dont: 'Leave it as “Menu”.' },
    ],
    a11y: ['The panel is a menu named by label, with menuitem rows.', 'The Context Menu key and Shift+F10 open it on the first action; Escape and Tab close it and return focus.', 'A pointer opens it with no row chosen, so Enter does nothing until an arrow key moves.', 'The open object keeps a real outline in forced colours.', 'Under Reduce motion the panel only fades.'],
    keyboard: [
      ['Context Menu key, Shift+F10', 'Opens the panel on the first action', 'ContextMenu: the Context Menu key and Shift+F10 open it on the first action'],
      ['Arrow Up and Down, Home, End', 'Moves between actions', 'ContextMenu: arrows and Home/End move between actions'],
      ['Escape', 'Closes and returns focus to the object', 'ContextMenu: the Context Menu key and Shift+F10 open it on the first action'],
    ],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/menu', 'Menu', 'The visible key with the same panel.'], ['/components/action-sheet', 'ActionSheet', 'A sheet of choices on a phone.']],
  },
  {
    name: 'MultiSelect',
    slug: 'multi-select',
    status: 'beta',
    limitations: ['It cannot take typed text; to search a long list, use Combobox.', 'In chips mode the well grows by rows as values are chosen, so the layout under it moves.', 'Rows are plain words; a row cannot hold a form control.'],
    youMust: ['Give every MultiSelect a label, because it is the name of the field.', 'Give each option a value that is unique inside the list.', 'Pass an array to value and defaultValue, never a single string.'],
    usage: '<MultiSelect label="Rooms" defaultValue={["kitchen"]} options={[\n  { value: "kitchen", label: "Kitchen" },\n  { value: "hall", label: "Hall" },\n]} />',
    backdrops: 'In light the well is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The count, the ticks and the chips are ink and plastic in both, and nothing is orange.',
    purpose: 'Picks any number of options from a panel that stays open, and says the result in the well as a count or as removable chips.',
    importLine: "import { MultiSelect } from 'dial-react';",
    overview: (
      <>
        <p><code>MultiSelect</code> is Select’s recessed well with a panel of tick rows under it. The panel stays open while you choose. Space or Enter toggles the reached row, Ctrl+A toggles every row that can be chosen, and Escape closes it. <code>display</code> is <code>count</code> (the default, as in 3 chosen) or <code>chips</code>, which stands each chosen value in the well as a removable Chip. <code>value</code> is an array in list order.</p>
      </>
    ),
    hero: ex('MultiSelectBasic', 'Five rooms, two chosen, and the well says 2 chosen.'),
    ladder: [
      ex('MultiSelectChips', 'Each chosen room stands in the well as a chip with its own remove key.'),
      ex('MultiSelectSizes', 'A 44px well and a 52px well.'),
      ex('MultiSelectControlled', 'The values held in state and repeated below the field.'),
      ex('MultiSelectStates', 'A locked row, an empty field with its prompt, and a disabled field.'),
      ex('MultiSelectForm', 'One hidden value per chosen row, sent with the form.'),
    ],
    whenToUse: ['Choose any number of rooms, days or devices from a list.', 'Fold a long list of choices into one row of a sheet.'],
    whenNotToUse: [['Exactly one option', 'Select'], ['A short list that fits on the screen', 'Listbox']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Value', 'The count in type.body, or the placeholder in text.secondary.'], ['Chips', 'Chip keys, size sm, standing in the well in chips mode.'], ['Chevron', 'The chevron-down glyph in control.icon-sm, turned over while open.'], ['Panel', 'surface.solid, elevation.float, corner.inner on layer.overlay.'], ['Row', 'control.md tall with a tick before the words.']],
    states: [['Chosen row', 'A tick and medium weight in primary ink, with aria-selected.'], ['Reached row', 'A small recess, set by data-active.'], ['Disabled row', 'Half-faded and skipped by the arrows.'], ['Disabled field', 'No shadow, half-faded, no tab stop.']],
    content: ['Label the field with a plural noun.', 'Write each option as a short noun.', 'Start the placeholder with a verb.'],
    dodont: [
      { do: 'Label it with a plural noun such as Rooms.', dont: 'Write “Please tick all the rooms you want”.' },
      { do: 'Use chips for a few short values.', dont: 'Use chips when every option may be chosen.' },
    ],
    a11y: ['The well is a combobox with aria-expanded and aria-controls, named by its label and its count.', 'The panel is a listbox with aria-multiselectable.', 'Focus stays on the well and aria-activedescendant names the reached row.', 'A chosen row is told by a tick and weight as well as aria-selected.', 'In forced colours the well and the panel keep real borders and the reached row uses the system highlight.'],
    keyboard: [['ArrowDown / ArrowUp / Enter / Space', 'Opens the list on the first chosen row', 'MultiSelect: Down opens a multiselectable list on the first chosen row'], ['Space / Enter', 'Toggles the reached row and keeps the list open', 'MultiSelect: Space toggles the reached row'], ['Ctrl+A', 'Toggles every row that can be chosen', 'MultiSelect: arrow keys and Ctrl+A walk and toggle the rows'], ['Escape', 'Closes the list and keeps focus on the well', 'MultiSelect: Escape closes it with focus kept']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/select', 'Select', 'Exactly one option.'], ['/components/listbox', 'Listbox', 'The same rows, always open.'], ['/components/chip', 'Chip', 'The key that stands in the well.']],
  },
  {
    name: 'Autocomplete',
    slug: 'autocomplete',
    status: 'beta',
    limitations: ['It never forces a match; text that is not on the list is kept.', 'It takes one value as text; it does not return several choices like a multi-select.', 'It shows at most eight suggestions by default; raise limit or let the source narrow the list.'],
    youMust: ['Name the field with a noun, as in "Room".', 'Pass filter={false} and set loading when the suggestions come from a request.', 'Say in a hint when any text is accepted.'],
    usage: '<Autocomplete\n  label="Room"\n  options={[{ value: "kitchen", label: "Kitchen" }]}\n/>',
    backdrops: 'In light the well is a light grey recess and the panel warm-white plastic with a short soft shadow, in dark a near-black recess and charcoal plastic. The typed part of a suggestion is medium weight, and nothing is orange.',
    purpose: 'Offers suggestions in a plastic panel under a text well while the typed words stay valid.',
    importLine: "import { Autocomplete } from 'dial-react';",
    overview: (
      <>
        <p><code>Autocomplete</code> is Input’s recessed well with a short plastic panel under it. As you type, the panel lists the options that contain your text and prints the matching part in medium weight. The arrows reach a suggestion, Enter takes it, and Enter with none reached keeps what you typed. Focus never leaves the well.</p>
        <p>For an async source set <code>loading</code> and <code>filter={'{false}'}</code>: the panel shows a Spinner row, and when nothing comes back it says so and says the text stays as typed.</p>
      </>
    ),
    hero: ex('AutocompleteBasic', 'Type in the room field: suggestions rise under the well and any other name stays valid.'),
    ladder: [
      ex('AutocompleteHint', 'hint prints a short line under the field.'),
      ex('AutocompleteAsync', 'A request to the hub: the Spinner and the word Searching stand in the panel until the answer arrives.'),
      ex('AutocompleteLarge', 'The large size: a 52px well and rows with larger text.'),
      ex('AutocompleteChosen', 'onChoose tells a taken suggestion apart from typed text.'),
      ex('AutocompleteInForm', 'In a form with an error under the well, a typed value that is not on the list, and the orange key last.'),
    ],
    whenToUse: ['Fill a field with a name the product may already know, and still accept a new one.', 'Search a list that is too long to show at once.'],
    whenNotToUse: [['An answer that must be one of a short, fixed set', 'Select'], ['A list that always stays open', 'Listbox'], ['A plain value with nothing to suggest', 'Input']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the well.'], ['Well', 'Input: surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Panel', 'surface.solid, elevation.float, corner.inner, layer.overlay.'], ['Suggestion', 'control.md row, type.body in text.secondary; the match in type.weight-medium.'], ['Busy row', 'A Spinner grille and the word Searching.'], ['Empty line', 'One plain line in text.secondary.']],
    states: [['Closed', 'The well alone, aria-expanded="false".'], ['Open', 'The panel rises under the well, aria-expanded="true".'], ['Reached', 'The row sinks into a well with a hairline, aria-selected="true".'], ['Busy', 'A Spinner row and aria-busy on the field.'], ['Empty', 'A line says nothing matched and the text stays as typed.'], ['Disabled', 'The well fades to half and takes no text.']],
    content: ['Name the field with a noun.', 'Write suggestions as the words a person would type.', 'Say in a hint when any text is accepted.'],
    dodont: [
      { do: 'Name the field "Room" and accept any text.', dont: 'Name it "Type to search" and wipe text that is not on the list.' },
      { do: 'Set loading while a request runs.', dont: 'Show an empty panel while the request runs.' },
    ],
    a11y: ['The field is a combobox with aria-autocomplete="list", aria-expanded and aria-controls.', 'The reached row is named by aria-activedescendant; focus stays in the field.', 'A polite status line reads the count, the wait and the empty line.', 'Every row is at least 44px tall.', 'In forced colours the panel keeps a real border and the reached row a highlight border.', 'Under Reduce motion the panel only fades.'],
    keyboard: [['Type', 'Opens the panel and narrows the suggestions', 'Autocomplete: typing opens a panel of suggestions that the combobox owns and announces'], ['Down / Up', 'Walks the suggestions; focus stays in the field', 'Autocomplete: the arrows walk the suggestions while focus stays in the field, Enter takes one and Escape closes'], ['Enter', 'Takes the reached suggestion, or keeps the typed text', 'Autocomplete: text that matches nothing stays valid and says so'], ['Escape', 'Closes the panel and keeps the text', 'Autocomplete: the arrows walk the suggestions while focus stays in the field, Enter takes one and Escape closes']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/select', 'Select', 'A closed list with no typing.'], ['/components/listbox', 'Listbox', 'A list that stays open.'], ['/components/input', 'Input', 'The well Autocomplete is built on.']],
  },
  {
    name: 'Combobox',
    slug: 'combobox',
    status: 'beta',
    limitations: ['It takes one value; there is no multiple mode.', 'Free text is never kept: text that matches no option is dropped when the person leaves.', 'The list opens below the field and does not flip above it near the bottom of the screen.'],
    youMust: ['Give every Combobox a label, because it is the name of the field.', 'Give each option a value that is unique inside the list.', 'Pass a label to every option, even when it also has an avatar or an icon.'],
    usage: '<Combobox label="Room" placeholder="Type a room" defaultValue="kitchen" options={[\n  { value: "kitchen", label: "Kitchen" },\n  { value: "kids", label: "Kids room" },\n]} />',
    backdrops: 'In light the well is a light grey recess in warm white plastic and the list is a plate of that plastic above the page. In dark the well is near-black in charcoal. Rows and ticks are ink in both, and nothing is orange.',
    purpose: 'A recessed text field whose list of options opens under it and narrows as you type, accepting only a listed option.',
    importLine: "import { Combobox } from 'dial-react';",
    overview: (
      <>
        <p><code>Combobox</code> is a text field with a list. Focus stays in the field. Typing narrows the list to options whose label contains the text and sets the matched letters in medium weight. The arrow keys reach rows, Enter chooses, and Escape closes the list and puts back the chosen words. Leaving the field drops text that is not an option. An option takes <code>value</code>, <code>label</code>, an optional <code>leading</code> mark and <code>disabled</code>. <code>size</code> is <code>md</code> or <code>lg</code>.</p>
      </>
    ),
    hero: ex('ComboboxBasic', 'Eight rooms; type a few letters to narrow them.'),
    ladder: [
      ex('ComboboxHint', 'hint prints a short line under the field.'),
      ex('ComboboxLeading', 'An avatar before each name, shown in the well after a choice.'),
      ex('ComboboxSizes', 'A well and rows at 44px and 52px.'),
      ex('ComboboxStates', 'A disabled option, an error with its words, and a disabled field.'),
      ex('ComboboxControlled', 'The value held in state and cleared when the text is emptied.'),
    ],
    whenToUse: ['Choose one option from a list of more than about eight.', 'Pick a person, room or programme by typing the first letters.'],
    whenNotToUse: [['Three to seven options', 'Select'], ['Options that should all stay in view', 'Listbox'], ['Free text with no list', 'Input']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Toggle', 'A control.md key with a chevron in control.icon-sm, not a tab stop.'], ['List', 'surface.solid, elevation.float, corner.inner on layer.overlay.'], ['Row', 'control.md tall, type.body, with a tick and an optional mark.']],
    states: [['Open', 'The list floats under the well and the chevron turns over.'], ['Reached', 'A recessed plate behind the row, named by aria-activedescendant.'], ['Chosen', 'A tick and medium weight in primary ink, with aria-selected.'], ['No match', 'One line in the list that says so; the list stays open.'], ['Invalid', 'A critical red edge and a message with a glyph.'], ['Disabled', 'No shadow, half-faded, no typing.']],
    content: ['Name the field with a noun.', 'Write each option as a short noun or a name.', 'Say what to do in the error, such as Choose a room from the list.'],
    dodont: [
      { do: 'Name the field with a noun and each row with a noun.', dont: 'Write “Type to search” as the label and number the rows.' },
      { do: 'Use it for a long list people can name.', dont: 'Use it for three options, where a Select is quicker.' },
    ],
    a11y: ['The field has role combobox with aria-autocomplete="list", aria-expanded and aria-controls.', 'Focus stays in the field and aria-activedescendant names the reached row.', 'The number of matches, or No match, is announced through a polite status.', 'The chosen row is told by a tick and weight as well as aria-selected, and matched letters by weight as well as colour.', 'In forced colours the well and the list keep a real border and the reached row uses the system highlight.'],
    keyboard: [['Arrow Down / Arrow Up', 'Opens the list, then moves the reached row and skips disabled rows', 'Combobox: the arrows reach rows and Enter chooses'], ['Enter', 'Chooses the reached row and closes the list', 'Combobox: the arrows reach rows and Enter chooses'], ['Escape', 'Closes the list and puts back the chosen words', 'Combobox: Escape and leaving drop text that is not an option']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/select', 'Select', 'The same list without typing.'], ['/components/listbox', 'Listbox', 'The rows always open.'], ['/components/input', 'Input', 'Free text.']],
  },
  {
    name: 'Sidebar',
    slug: 'sidebar',
    status: 'beta',
    limitations: ['It does not turn into a Drawer on a narrow screen; the app decides when to show it.', 'There are no nested groups; a group holds a flat list of pages.', 'It does not work out the current page from the address; you mark it with current.'],
    youMust: ['Give every item an icon if you offer the toggle.', 'Mark the page you are on with current, once.', 'Give the landmark a name when the page has more than one navigation.'],
    usage: '<Sidebar label="Main">\n  <SidebarGroup title="Rooms">\n    <SidebarItem href="/kitchen" icon="heat" current>Kitchen</SidebarItem>\n  </SidebarGroup>\n  <SidebarToggle />\n</Sidebar>',
    backdrops: 'In light the column is warm white plastic with grey ink, in dark charcoal with light ink. The index mark is primary ink in both, and nothing is orange.',
    purpose: 'Lists the pages of an app in grouped rows down the side, with one ink bar on the page you are on.',
    importLine: "import { Sidebar, SidebarGroup, SidebarItem, SidebarToggle } from 'dial-react';",
    overview: (
      <>
        <p><code>Sidebar</code> is a navigation landmark. Each <code>SidebarGroup</code> prints a lowercase heading over a list of <code>SidebarItem</code> links. The page you are on has <code>current</code>: it gets medium weight, aria-current="page" and a short ink bar at the start of its row. <code>SidebarToggle</code> shrinks the column to icons and back.</p>
      </>
    ),
    hero: ex('SidebarBasic', 'Two groups of pages with the kitchen marked as current.'),
    ladder: [
      ex('SidebarCollapsed', 'Icons only. The index mark stays on the current page.'),
      ex('SidebarToggle', 'A key at the foot collapses and expands the column.'),
      ex('SidebarControlled', 'The width lives in your state.'),
      ex('SidebarRouterLinks', 'asChild hands the row styles to a router link.'),
    ],
    whenToUse: ['Move between the pages of an app.', 'Keep the pages in view while the person works in one of them.'],
    whenNotToUse: [['Switching between views of one page', 'Tabs'], ['Showing the path to a page', 'Breadcrumb'], ['Stepping through result pages', 'Pagination']],
    anatomy: [['Body', 'surface.solid, elevation.unit, corner.panel, width layout.sidebar open.'], ['Group heading', 'type.label in text.secondary.'], ['Link', 'control.md tall, corner.inner, gap.xl between icon and name.'], ['Index mark', 'width.bar wide, control.icon-md tall, text.primary.'], ['Toggle', 'control.md tall, icon chevron.']],
    states: [['Current', 'Primary ink, medium weight and the index mark.'], ['Hover', 'The name steps to primary ink.'], ['Collapsed', 'Icons only in 44px cells; names kept for assistive tech.'], ['Focus', 'The system focus ring around the row.']],
    content: ['Name each page with a noun.', 'Keep group headings to one lowercase word.', 'Pick icons that tell pages apart without words.'],
    dodont: [
      { do: 'Name the page with a noun and give it an icon.', dont: 'Write “Go to the kitchen page” with no icon.' },
      { do: 'Tell the current page by weight and the bar.', dont: 'Tell it by a tinted fill alone.' },
    ],
    a11y: ['A nav landmark with its own name.', 'Each group is a list named by its heading.', 'The current page carries aria-current="page".', 'Collapsed links keep their names; the toggle reports aria-expanded.', 'In forced colours the index mark draws in the text colour.'],
    keyboard: [['Tab', 'Moves through the links and the toggle', 'Sidebar: the landmark lists its groups and the current page'], ['Enter', 'Follows the focused link', 'Sidebar: native link'], ['Space or Enter', 'Collapses or expands from the toggle', 'Sidebar: aria-expanded changes']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/drawer', 'Drawer', 'Holds the sidebar on a narrow screen.'], ['/components/breadcrumb', 'Breadcrumb', 'The path inside an area.']],
  },
  {
    name: 'Anchor',
    slug: 'anchor',
    status: 'beta',
    limitations: ['It links to headings on the same page only; it does not route between pages.', 'The link is a plain anchor, so a client-side router must handle the hash itself.', 'The mark is placed by scrolling; a press on a short last section may not move it until the page reaches the end.'],
    youMust: ['Give every item the id of a real heading on the page.', 'Pass offset when a header is fixed to the top, and set scroll-margin-block-start on the headings to match.', 'Pass root when the headings scroll inside a box instead of the page.'],
    usage: '<Anchor items={[\n  { id: "wiring", label: "Wiring" },\n  { id: "schedules", label: "Schedules" },\n]} />',
    backdrops: 'In light the words are warm grey ink on the plastic body, in dark pale ink on charcoal. The mark is primary ink in both, and nothing is orange.',
    purpose: 'Lists the headings of a long page as links and marks the section in view.',
    importLine: "import { Anchor } from 'dial-react';",
    overview: (
      <>
        <p><code>Anchor</code> is a nav landmark with a list of links, one for each heading. The section in view carries one short ink mark in a fixed gutter and is announced with <code>aria-current="location"</code>. It follows the page with an IntersectionObserver. <code>items</code> may hold sub-headings, which print one module in. <code>value</code> and <code>onValueChange</code> let you set the current section yourself.</p>
      </>
    ),
    hero: ex('AnchorBasic', 'Four headings beside a scrolling page: the mark follows the section in view.'),
    ladder: [
      ex('AnchorNested', 'Sub-headings step in by one module.'),
      ex('AnchorControlled', 'value and onValueChange set and read the current section.'),
      ex('AnchorOffset', 'offset clears a fixed header.'),
      ex('AnchorLabelled', 'label names the landmark in your own language.'),
    ],
    whenToUse: ['Jump around a page with four or more headings.', 'Show which section of a long page is in view.'],
    whenNotToUse: [['Switching between views', 'Tabs'], ['The path to this page', 'Breadcrumb']],
    anatomy: [['Link', 'control.md tall, type.label in text.secondary, text.primary and type.weight-medium when current.'], ['Index mark', 'A bar of control.thumb in text.primary, width.bar thick, in a fixed gutter.'], ['Sub-list', 'Steps in by gap.xl for each level.']],
    states: [['Current', 'Primary ink, medium weight, the index mark and aria-current="location".'], ['Hover', 'The word darkens one ink step.'], ['Focus', 'The dark ring around the row.']],
    content: ['Use the heading’s own words.', 'Keep each to a noun or two.', 'Keep sub-headings to two levels.'],
    dodont: [
      { do: 'Use the heading’s noun.', dont: 'Write a sentence in the row.' },
      { do: 'Tell the current section by a mark.', dont: 'Tell it by colour alone.' },
    ],
    a11y: ['A nav landmark with a name, so it is listed among the regions.', 'The current link carries aria-current="location".', 'Every row is 44px tall.', 'In forced colours the links use the link colour and the mark the text colour.'],
    keyboard: [['Tab', 'Moves to the next link', 'Anchor: the links are a named list and one is current'], ['Enter', 'Goes to the heading', 'Anchor: pressing a link marks it current']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/breadcrumb', 'Breadcrumb', 'The path to this page.'], ['/components/tabs', 'Tabs', 'Switching between views.']],
  },
  {
    name: 'DescriptionList',
    slug: 'description-list',
    status: 'beta',
    limitations: ['It is not interactive; a value cannot be pressed unless you put a Link or a Button inside it.', 'It lists facts about one thing; rows that share columns belong in a Table.', 'Seams are cut between pairs only; there is no option to draw them off or around every row.'],
    youMust: ['Put each DescriptionTerm before its DescriptionDetail, as direct children of DescriptionList.', 'Write terms as nouns with no colon.', 'Use one orientation in a unit.'],
    usage: '<DescriptionList>\n  <DescriptionTerm>Model</DescriptionTerm>\n  <DescriptionDetail>ht 4 heater</DescriptionDetail>\n  <DescriptionTerm>Power draw</DescriptionTerm>\n  <DescriptionDetail numeric>1 840 W</DescriptionDetail>\n</DescriptionList>',
    backdrops: 'In light the terms are warm grey ink on warm white plastic, in dark light grey ink on charcoal. Values are the primary ink in both. The seam is a divider-tone line over a lit edge and nothing is orange.',
    purpose: 'Prints facts about one thing as terms and values on the inset line, stacked or side by side, with a seam between pairs.',
    importLine: "import { DescriptionList, DescriptionTerm, DescriptionDetail } from 'dial-react';",
    overview: (
      <>
        <p><code>DescriptionList</code> is a <code>dl</code>. Each <code>DescriptionTerm</code> is printed at label size in secondary ink and each <code>DescriptionDetail</code> at body size in primary ink with tabular numerals. <code>orientation</code> is <code>stacked</code> (default) or <code>inline</code>. A seam separates one fact from the next. A term may have several values.</p>
      </>
    ),
    hero: ex('DescriptionListBasic', 'Four facts about a heater, stacked, with a seam between pairs.'),
    ladder: [
      ex('DescriptionListInline', 'Terms in one column, values beside them, figures on the end edge.'),
      ex('DescriptionListMultiple', 'One term with two values, and a long value that wraps.'),
      ex('DescriptionListInUnit', 'Under a Heading, with the orange key apart from the printing.'),
      ex('DescriptionListRtl', 'In right-to-left text the terms start on the reading edge.'),
    ],
    whenToUse: ['List the facts about one device, room or record.', 'Summarise settings before a person confirms them.'],
    whenNotToUse: [['Rows that share columns', 'Table'], ['One figure with its unit', 'Stat']],
    anatomy: [['Term', 'type.label in type.weight-regular, text.secondary.'], ['Detail', 'type.body in text.primary, tabular numerals.'], ['Seam', 'width.hairline in line.divider above, material.lit below.']],
    states: [['Stacked', 'Each term over its values.'], ['Inline', 'A term column with the values beside it.'], ['Numeric', 'A figure lines up on the end edge in the inline layout.']],
    content: ['Write terms as nouns with no colon.', 'Put the unit in the value.', 'Mark figures numeric.'],
    dodont: [
      { do: 'Keep terms quiet and values plain.', dont: 'Bold both sides.' },
      { do: 'Use a Table for rows with the same columns.', dont: 'Repeat the same terms for every device.' },
    ],
    a11y: ['A native description list, so each term is announced before its value.', 'It takes no focus.', 'Terms and values hold at least 4.5:1 in both themes.', 'The seam is decoration; the pairs are separated by space and by type as well.', 'In forced colours the seam keeps one line in GrayText.'],
    keyboard: [['Tab', 'Does not stop on a DescriptionList', 'DescriptionList: a native dl that takes no focus']],
    inherits: 'HTMLAttributes<HTMLDListElement>',
    related: [['/components/table', 'Table', 'Rows of readings that share columns.'], ['/components/stat', 'Stat', 'One figure in a recessed window.']],
  },
  {
    name: 'NavigationMenu',
    slug: 'navigation-menu',
    status: 'beta',
    limitations: ['It opens on a press only, never on hover, so there is no hover-intent delay to tune.', 'The panel is one level deep; a link cannot open another panel.', 'It does not collapse to a drawer on a narrow screen; the names wrap to a second row.', 'It does not track the route. You mark the current page with current.'],
    youMust: ['Give every link an address or hand the link to your router with asChild.', 'Mark at most one link current.', 'Name the landmark in your own language when the page has more than one navigation.', 'Keep a name to one or two words so the row fits a phone.'],
    usage: '<NavigationMenu label="Main">\n  <NavigationMenuLink href="/" current>Home</NavigationMenuLink>\n  <NavigationMenuItem label="Rooms">\n    <NavigationMenuGroup title="Upstairs">…</NavigationMenuGroup>\n  </NavigationMenuItem>\n</NavigationMenu>',
    backdrops: 'In light the names are grey ink on warm white plastic and the panel is the same plastic one step raised. In dark they are light ink on charcoal. The open name sinks into a well and nothing is orange.',
    purpose: 'Prints the sections of a site along a row, and drops a plastic panel of grouped links from the names that hold more than one page.',
    importLine: "import { NavigationMenu, NavigationMenuItem, NavigationMenuGroup, NavigationMenuLink } from 'dial-react';",
    overview: (
      <>
        <p><code>NavigationMenu</code> is a navigation landmark with a row of names. A <code>NavigationMenuLink</code> in the row goes to a page. A <code>NavigationMenuItem</code> is a key: press it and a panel drops from it, holding one or more <code>NavigationMenuGroup</code>, each with a printed title and its links.</p>
        <p>This is the disclosure navigation pattern: each key carries <code>aria-expanded</code>, and the panel follows it in the reading order. Mark the page you are on with <code>current</code>; it gets an ink bar and <code>aria-current="page"</code>. Pass <code>value</code> and <code>onValueChange</code> to hold the open panel yourself.</p>
      </>
    ),
    hero: ex('NavigationMenuBasic', 'Home is current, Rooms and Devices open panels, Help is a plain link.'),
    ladder: [
      ex('NavigationMenuDescriptions', 'A short line under each link and a current page inside a panel.'),
      ex('NavigationMenuControlled', 'The open panel is held in state and closed from a key outside.'),
      ex('NavigationMenuRouter', 'asChild hands the styles to the links of a router.'),
      ex('NavigationMenuThai', 'Thai names keep their line height and the panel grows to fit.'),
    ],
    whenToUse: ['Give a site or an app two to six sections along the top.', 'Several pages sit under one name and are worth grouping.'],
    whenNotToUse: [['Actions on one object', 'Menu'], ['Switching views of the same page', 'Tabs'], ['The path to this page', 'Breadcrumb']],
    anatomy: [['Name', 'type.label in text.secondary, control.md tall, layout.touch wide at least, corner.mark.'], ['Open key', 'surface.sunken and elevation.well, with the chevron pointing up.'], ['Index mark', 'width.bar in text.primary under the current name.'], ['Panel', 'surface.solid, elevation.float, corner.inner on layer.overlay.'], ['Group title', 'type.label in text.secondary.'], ['Link', 'type.body, control.md tall, corner.media.']],
    states: [['Current', 'Primary ink, medium weight, an ink bar and aria-current="page".'], ['Open', 'The key sinks into a well and its chevron points up.'], ['Reached link', 'The row sinks into a well; the keyboard also draws the focus ring.']],
    content: ['Name a key with a noun such as Rooms.', 'Title a group with one word.', 'Do not repeat the key name in its links.'],
    dodont: [
      { do: 'Open the panel with a press and close it with Escape.', dont: 'Open the panel on hover only.' },
      { do: 'Tell the current page by the bar and aria-current.', dont: 'Tell it by colour alone.' },
    ],
    a11y: ['A nav landmark with a name.', 'Each key is a button with aria-expanded and aria-controls.', 'The panel follows its key in the reading order, so Tab walks into it.', 'Each group is a list named by its title.', 'In forced colours the panel keeps a real border and the current bar draws in the text colour.'],
    keyboard: [['Left and Right', 'Move between the names (reversed in right-to-left)', 'NavigationMenu: Left, Right, Home and End walk the top names and only one panel is open at a time'], ['Down', 'Opens the panel on its first link, then moves down the links', 'NavigationMenu: Down opens a panel on its first link and Escape closes it with focus back on the name'], ['Escape', 'Closes the panel and returns focus to its key', 'NavigationMenu: Down opens a panel on its first link and Escape closes it with focus back on the name']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/menu', 'Menu', 'Actions on one object.'], ['/components/tabs', 'Tabs', 'Switching views of the same page.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to this page.']],
  },
  {
    name: 'Navbar',
    slug: 'navbar',
    status: 'beta',
    limitations: ['It is a bar of links; it does not switch views on one page.', 'It never wraps: the links fold behind the Menu key or, with collapse never, overflow the bar.', 'The actions slot is not folded, so keep it to two short keys on a narrow screen.'],
    youMust: ['Mark the page you are on with current on one NavbarLink.', 'Put at most one primary Button in the actions slot.', 'Pass your own label and menuLabel when the product is not in English.'],
    usage: '<Navbar brand="dial" actions={<Button>Sign in</Button>}>\n  <NavbarLink href="/rooms" current>Rooms</NavbarLink>\n  <NavbarLink href="/devices">Devices</NavbarLink>\n</Navbar>',
    backdrops: 'In light the bar is warm-white plastic with a short soft shadow, in dark it is charcoal plastic. Words are primary or secondary ink, the current dot is primary ink, and nothing is orange except your own primary Button.',
    purpose: 'Prints the model name, the places of a product and its main keys along the top edge.',
    importLine: "import { Navbar, NavbarLink } from 'dial-react';",
    overview: (
      <>
        <p><code>Navbar</code> is a header with three parts: a model name at the inline start, a navigation of <code>NavbarLink</code> words, and an actions slot at the inline end. Every link has an empty ink dot before it, and the current page fills it and turns medium, so choosing a page moves nothing. When the links do not fit, a Menu key takes their place and opens them in a panel, or calls <code>onMenuPress</code> so you can open your own Drawer.</p>
      </>
    ),
    hero: ex('NavbarBasic', 'A model name, four places with the current one marked, and a sign-in key.'),
    ladder: [
      ex('NavbarPrimary', 'The model name is a link and one orange key stands in the actions slot.'),
      ex('NavbarFolded', 'The links fold behind a Menu key that opens them in a panel.'),
      ex('NavbarSticky', 'A sticky bar holds the top edge of a scrolling box and keeps its shadow.'),
      ex('NavbarDrawer', 'The Menu key opens your own Drawer through onMenuPress.'),
    ],
    whenToUse: ['Move between the top-level places of a product.', 'Keep the model name and the main keys on every screen.'],
    whenNotToUse: [['Switching between views of one page', 'Tabs'], ['Showing where a page sits in a path', 'Breadcrumb']],
    anatomy: [['Bar', 'surface.solid, elevation.unit, corner.panel, padding gap.sm.'], ['Model name', 'type.emphasis in type.weight-medium.'], ['Link', 'control.md tall, layout.touch wide, type.body.'], ['Ink dot', 'gap.sm round, text.primary when current.'], ['Keys', 'Your actions and the Menu key, gap.sm apart.']],
    states: [['Current', 'Primary ink, medium weight, filled dot, aria-current="page".'], ['Hover', 'Ink steps to primary.'], ['Folded', 'Links leave the row and the Menu key appears.'], ['Sticky', 'Holds the top edge on layer.sticky.']],
    content: ['Name each place with one noun.', 'Print the model name in lowercase.', 'Keep it to five places.'],
    dodont: [
      { do: 'Name a place with a noun such as Rooms.', dont: 'Write a sentence such as Go to your rooms.' },
      { do: 'Tell the current page by the dot and weight.', dont: 'Tell it by colour alone.' },
    ],
    a11y: ['The links stand in a navigation landmark named Main.', 'The current page carries aria-current="page".', 'The Menu key carries aria-haspopup="dialog" and aria-expanded.', 'Every link and key is at least 44px tall.', 'In forced colours the bar keeps an outline and the dot draws in the text colour.'],
    keyboard: [['Tab', 'Moves through the model name, the links and the keys', 'Navbar: the links stand in a list and the current one is announced'], ['Enter / Space', 'Presses the Menu key', 'Navbar: the Menu key opens the links in a panel and reports it'], ['Escape', 'Closes the Menu panel and returns focus to the key', 'Navbar: the Menu key opens the links in a panel and reports it']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views of one page.'], ['/components/breadcrumb', 'Breadcrumb', 'Where a page sits in a path.']],
  },
  {
    name: 'NumberInput',
    slug: 'number-input',
    status: 'beta',
    limitations: ['It sets one number; there is no range with two ends.', 'Typed text is clamped to the limits but not snapped to the step.', 'The value changes on blur, Enter and key presses, not on every keystroke.', 'Digits are read as 0 to 9 only; Thai and Arabic-Indic digits are not parsed.'],
    youMust: ['Give it a label that names the quantity, and put the unit in the unit prop.', 'Set min and max when the number has limits.', 'Pass your own decreaseLabel and increaseLabel in another language.'],
    usage: '<NumberInput\n  label="Target temperature"\n  unit="°C"\n  min={5}\n  max={30}\n  step={0.5}\n  defaultValue={21.5}\n/>',
    backdrops: 'In light the window is a light grey recess and the keys are warm-white discs; in dark the window is near-black and the keys are charcoal. The ink is primary in both and nothing is orange.',
    purpose: 'Sets one number in a recessed window, with a minus key and a plus key either side.',
    importLine: "import { NumberInput } from 'dial-react';",
    overview: (
      <>
        <p><code>NumberInput</code> shows a number in tabular figures inside a recessed window, with an optional <code>unit</code> after it. A round key stands either side: minus lowers the value by <code>step</code> and plus raises it. You can also type, or use the arrow keys. It is the precise way to set a number; use a Slider for a rough setting along a range.</p>
        <p>It is controlled with <code>value</code> and <code>onValueChange</code>, or uncontrolled with <code>defaultValue</code>. The value is a number, or <code>null</code> when the field is empty.</p>
      </>
    ),
    hero: ex('NumberInputBasic', 'A temperature in half-degree steps and a delay in five-minute steps.'),
    ladder: [
      ex('NumberInputSizes', 'The two sizes, md and lg.'),
      ex('NumberInputRange', 'Limits, a step and a page step; typed text clamps on blur.'),
      ex('NumberInputStates', 'Empty, at the limit, invalid, read-only and disabled.'),
      ex('NumberInputControlled', 'Controlled by your own state, with the key names in another language.'),
    ],
    whenToUse: ['Set a number with a known step and limits.', 'Set a quantity or a duration that people also want to type.'],
    whenNotToUse: [['A level set by position along a range', 'Slider'], ['The one main setting of a unit', 'Rotary'], ['An ID or a code that only looks like a number', 'Input']],
    anatomy: [['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Value', 'type.body with tabular figures, aligned to the end of the window.'], ['Unit', 'type.label in type.weight-medium, text.secondary.'], ['Keys', 'IconButton at control.key (control.lg at size lg) with the minus and plus glyphs.'], ['Label', 'type.label in type.weight-medium, printed above the row.']],
    states: [['At the limit', 'The key that would pass it is flat and faded.'], ['Invalid', 'The window edge turns critical red and a glyph and words print under the row.'], ['Read-only', 'Recess and ink stay; the keys are flat.'], ['Disabled', 'The recess shadow goes and the figure fades.']],
    content: ['Name the quantity with a noun.', 'Put the unit in the unit prop, not in the label.', 'Keep the unit short.'],
    dodont: [
      { do: 'Print the unit in the window.', dont: 'Write the unit into the label and leave the figure bare.' },
      { do: 'Set min and max for a number with limits.', dont: 'Leave both open for a setting that has a real range.' },
    ],
    a11y: ['The window is a spin button with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext.', 'Both keys have names (Decrease and Increase) and are 44px or larger.', 'A key at the limit is disabled, and is flat as well as faded.', 'Invalid is told by a glyph and words, not by colour alone.', 'In forced colours the window keeps a real border and the focus ring uses the system highlight colour.'],
    keyboard: [['ArrowUp, ArrowDown', 'Raise or lower the value by one step', 'NumberInput: ArrowUp raises the value by one step and the window announces it'], ['PageUp, PageDown', 'Move the value by the page step', 'NumberInput: PageUp moves the value by the page step'], ['Home, End', 'Jump to the minimum or the maximum', 'NumberInput: End jumps to the maximum'], ['Enter, Tab', 'Commit typed text and clamp it into range', 'NumberInput: typed text above the maximum is clamped on blur']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/slider', 'Slider', 'A level set by position along a range.'], ['/components/rotary', 'Rotary', 'The one main setting of a unit.'], ['/components/input', 'Input', 'Text, an ID or a code.']],
  },
  {
    name: 'PasswordInput',
    slug: 'password-input',
    status: 'beta',
    limitations: ['It does not judge a password; the strength word is the verdict you pass in.', 'It does not hide the characters again on blur or after a delay.', 'It has no confirm field; pair two of them and keep them in step with shown and onShownChange.', 'The state words are plain text and are not translated unless you pass shownWord and hiddenWord.'],
    youMust: ['Set autoComplete to new-password on a sign-up or change form, and leave current-password on a sign-in form.', 'Give it a label that names the secret with a noun.', 'Pass your own toggleLabel, shownWord and hiddenWord in another language.'],
    usage: '<PasswordInput\n  label="New password"\n  autoComplete="new-password"\n  hint="Use 12 characters or more."\n  strength="fair"\n/>',
    backdrops: 'In light the well is a light grey recess and the key is a warm-white disc that turns frosted grey glass while latched; in dark the well is near-black and the key is charcoal. The ink is primary in both and nothing is orange.',
    purpose: 'Takes a secret in a recessed well, with a latching key that shows or hides the characters and a printed word for the state.',
    importLine: "import { PasswordInput } from 'dial-react';",
    overview: (
      <>
        <p><code>PasswordInput</code> is Input&apos;s well for a secret. The characters are dots until someone presses the round key beside the well; then they show, the lock glyph opens, the key latches down and the well prints <em>Shown</em>. The state is always told by a glyph and a word, never by colour.</p>
        <p>It is controlled for the visible state with <code>shown</code> and <code>onShownChange</code>, or uncontrolled with <code>defaultShown</code>. The value works as on any input, with <code>value</code> and <code>onChange</code> or <code>defaultValue</code>. It can print a strength word under the row, which you compute.</p>
      </>
    ),
    hero: ex('PasswordInputBasic', 'A sign-in password: dots, a closed lock and the word Hidden until the key is pressed.'),
    ladder: [
      ex('PasswordInputSizes', 'The two sizes, md and lg, with the key shown latched at lg.'),
      ex('PasswordInputSignUp', 'A new password with a hint and a strength word that follows the typing.'),
      ex('PasswordInputStrength', 'The three strength words: weak, fair and strong.'),
      ex('PasswordInputStates', 'Hidden, shown, invalid, read-only and disabled.'),
      ex('PasswordInputControlled', 'Controlled by your own state, with the words in Thai.'),
      ex('PasswordInputInUnit', 'A Wi-Fi password in a settings card, shown on purpose, with the orange key last.'),
    ],
    whenToUse: ['Ask for a password, a passphrase or a Wi-Fi key.', 'Let people check what they typed before they submit it.'],
    whenNotToUse: [['Text that is not a secret', 'Input'], ['A number with a step and limits', 'NumberInput'], ['A one-time code of fixed length', 'Input']],
    anatomy: [['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Characters', 'type.body in text.primary; dots while hidden, text while shown.'], ['State word', 'type.label in type.weight-medium, text.secondary.'], ['Key', 'IconButton at control.key (control.lg at size lg) with the lock glyph; latched glass while shown.'], ['Label', 'type.label in type.weight-medium, printed above the row.'], ['Strength', 'HelperText in a polite live region under the row.']],
    states: [['Shown', 'The lock glyph opens, the key latches and the well prints Shown.'], ['Invalid', 'The window edge turns critical red and a glyph and words print under the row.'], ['Read-only', 'Recess and ink stay; the key still works so the secret can be read.'], ['Disabled', 'The recess shadow goes, the characters fade and the key goes flat.']],
    content: ['Name the secret with a noun.', 'Put the rules in the hint, not in the placeholder.', 'Name the problem and the way out in the error.'],
    dodont: [
      { do: 'Set autoComplete to match the form.', dont: 'Leave the default on a sign-up form.' },
      { do: 'Print the rules in the hint before they can be broken.', dont: 'Put the rules in a placeholder that vanishes while typing.' },
    ],
    a11y: ['The key is a button with one name and aria-pressed for the state, and it is 44px or larger.', 'Shown is told by a glyph and a word as well as the latched key, not by colour.', 'The strength word sits in a polite live region, so a change is read out.', 'Invalid is told by a glyph and words, not by colour alone.', 'In forced colours the well keeps a real border and the focus ring uses the system highlight colour.'],
    keyboard: [['Tab', 'Move from the characters to the key', 'PasswordInput: Tab moves from the characters to the key'], ['Space, Enter', 'Latch or release the key', 'PasswordInput: Space on the key shows the characters and sets aria-pressed'], ['Pointer press', 'Flip the state and keep the caret in the field', 'PasswordInput: pressing the key by pointer keeps the caret in the field']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/input', 'Input', 'Text that is not a secret.'], ['/components/number-input', 'NumberInput', 'A number with a step and limits.'], ['/components/helper-text', 'HelperText', 'The line under a part.']],
  },
  {
    name: 'Editable',
    slug: 'editable',
    status: 'beta',
    limitations: ['It edits one line of text; for several lines use Textarea.', 'It is a text value only; there is no number, date or choice variant.', 'It does not check the value itself; set `error` from your own check in `onValueChange`.'],
    youMust: ['Give it a label that names the value with a noun.', 'Set `error` yourself when the kept value is not acceptable.', 'Pass `editLabel`, `saveLabel`, `cancelLabel` and `placeholder` in the language of the page.'],
    usage: '<Editable label="Room name" defaultValue="Kitchen heating" onValueChange={save} />',
    backdrops: 'In light the value is dark grey printing on warm white plastic and the well is a light grey recess. In dark the printing is light on charcoal and the well is near-black. The keys are the plain body-coloured ones in both, and nothing is orange.',
    purpose: 'Prints a value on the case and swaps in an Input well when it is pressed.',
    importLine: "import { Editable } from 'dial-react';",
    overview: (
      <>
        <p><code>Editable</code> prints a short value with a 44px round key beside it. Press the value or the key and an Input well takes its place with the text selected. Enter, the save key or leaving the field keeps the change, and Escape or the cancel key puts the old words back. Both outcomes are announced. The row keeps its height in both states, so nothing around it moves.</p>
      </>
    ),
    hero: ex('EditableBasic', 'A name as printing with its edit key.'),
    ladder: [
      ex('EditableEmpty', 'An empty value prints a placeholder word.'),
      ex('EditableControlled', 'The value is yours; it is called once per kept change.'),
      ex('EditableStates', 'Empty, read-only, disabled and error.'),
      ex('EditableInUnit', 'Two settings in one unit with a single orange key.'),
      ex('EditableLongText', 'Long and Thai text wraps in the printed line.'),
    ],
    whenToUse: ['Rename something in place.', 'Show a setting as a reading that can be corrected.'],
    whenNotToUse: [['A field that is always open', 'Input'], ['Several lines of text', 'Textarea'], ['A number stepped up and down', 'NumberInput']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the row.'], ['Reading', 'type.body, flat printing, 44px tall, secondary ink when empty.'], ['Edit key', 'An IconButton at control.key with the pencil glyph.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Save and cancel keys', 'IconButton at control.key with a check and a cross.']],
    states: [['Reading', 'Printing with an edit key.'], ['Editing', 'The well, a cancel key and a save key.'], ['Empty', 'The placeholder in secondary ink.'], ['Invalid', 'Critical red edge, a glyph and the message.'], ['Read-only', 'Full ink, no key.'], ['Disabled', 'Half ink, no key.']],
    content: ['Name the value with a noun.', 'Keep the placeholder to a few words.', 'Say the limit in the hint.'],
    dodont: [
      { do: 'Label it with a noun such as Room name.', dont: 'Write “Click to edit” as the label.' },
      { do: 'Say what is wrong in the error.', dont: 'Tell invalid by the red edge alone.' },
    ],
    a11y: ['The reading is a button named by the label and the value.', 'The field is named by the label and is described by the hint and the error.', 'A kept or cancelled edit is announced in a polite status.', 'The keys are named from the label, for example Edit Room name.', 'Enter and Escape do not end an edit while a Thai or other composition is open.', 'In forced colours the well keeps a real border and the focus rings use the highlight colour.'],
    keyboard: [
      ['Enter or Space', 'On the reading, opens the field with the text selected', 'Editable: Enter keeps the change and Escape puts the old value back'],
      ['Enter', 'In the field, keeps the change and returns focus to the reading', 'Editable: Enter keeps the change and Escape puts the old value back'],
      ['Escape', 'In the field, puts the old value back and returns focus to the reading', 'Editable: Enter keeps the change and Escape puts the old value back'],
      ['Tab', 'Moves from the field to the cancel and save keys; leaving the row keeps the change', 'Editable: leaving the field keeps the change'],
    ],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/input', 'Input', 'A field that is always open.'], ['/components/textarea', 'Textarea', 'Several lines of text.'], ['/components/number-input', 'NumberInput', 'A number stepped up and down.']],
  },
  {
    name: 'Dropzone',
    slug: 'dropzone',
    status: 'beta',
    limitations: ['It hands over files and nothing more; it does not upload them or show progress.', 'accept is matched by name and type in the browser, so check files again on the server.', 'It takes files only, not folders, links or dragged text.', 'With multiple off, only the first file is taken and the rest go to onFilesReject.'],
    youMust: ['Say what is taken in the title and the limit in the hint.', 'Listen to onFilesDrop; it carries the files from a drop and from the picker.', 'Tell the person about rejected files with onFilesReject, and pass your own words in another language.'],
    usage: '<Dropzone\n  accept="image/*"\n  multiple\n  onFilesDrop={(files) => upload(files)}\n/>',
    backdrops: 'In light the tray is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The key is a body-coloured key in both, and nothing is orange.',
    purpose: 'Takes dragged files in a recessed tray, with a real key inside it that opens the file picker.',
    importLine: "import { Dropzone } from 'dial-react';",
    overview: (
      <>
        <p><code>Dropzone</code> is a recessed tray with a glyph, a title, a hint and a key. Drop files on it, or press the key to open the picker. Both ways hand the files to <code>onFilesDrop</code>. While a file is held over the tray its edge goes heavier, the glyph changes and the title reads <em>Release to add</em>, and the tray does not resize.</p>
        <p><code>accept</code> limits the kinds of file and <code>multiple</code> allows more than one. Files that fail either go to <code>onFilesReject</code>. A polite status line tells assistive tech how many files were added.</p>
      </>
    ),
    hero: ex('DropzoneBasic', 'A tray that lists the names of the files it takes.'),
    ladder: [
      ex('DropzoneImages', 'accept narrows the tray to images and rejected files are counted.'),
      ex('DropzoneInForm', 'A PDF field under a name, with the orange key last.'),
      ex('DropzoneDisabled', 'Switched off, with the reason in the hint.'),
      ex('DropzoneThai', 'Every word passed as a prop, in Thai.'),
    ],
    whenToUse: ['Take one or more files a person already has on their device.', 'Offer drag and drop together with a visible way to choose.'],
    whenNotToUse: [['A single typed value', 'Input'], ['Picking from a known list', 'Select']],
    anatomy: [['Tray', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, three control.key tall.'], ['Glyph', 'Icon at control.icon-md, text.secondary, text.primary while held over.'], ['Title', 'type.emphasis in type.weight-medium.'], ['Hint', 'type.body in text.secondary.'], ['Key', 'Button at control.md, kind key.']],
    states: [['Held over', 'width.ring edge in text.primary, glyph and title change.'], ['Disabled', 'The recess shadow goes and the tray fades to half.'], ['Taken', 'The tray returns to rest and a status line says how many files were added.']],
    content: ['Say what is taken in the title.', 'Put the limit in the hint.', 'Name the key after the same thing.'],
    dodont: [
      { do: 'Name the file kind in the title, the hint and the key.', dont: 'Write a long instruction about clicking or dragging.' },
      { do: 'Set accept and say the limit in the hint.', dont: 'Say files and then turn pictures away.' },
    ],
    a11y: ['A group named by its title and described by its hint.', 'The key is a real button in the tab order, 44px or larger, and Enter and Space open the picker.', 'Held over is told by the edge, the glyph and the title, not by colour.', 'Files taken and rejected are announced in a polite status.', 'In forced colours the tray keeps a real border and the held-over edge uses Highlight.'],
    keyboard: [['Tab', 'Moves focus to the Choose key', 'Dropzone: the Choose key is reachable by Tab, is at least 44px, and Enter and Space open the file picker'], ['Enter, Space', 'Open the file picker from the key', 'Dropzone: the Choose key is reachable by Tab, is at least 44px, and Enter and Space open the file picker']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/input', 'Input', 'A short typed value.'], ['/components/button', 'Button', 'The key inside the tray.'], ['/components/progress', 'Progress', 'How far an upload has got.']],
  },
  {
    name: 'FileUpload',
    slug: 'file-upload',
    status: 'beta',
    limitations: ['It sends nothing. It reports the chosen files through onFilesChange and your code does the upload.', 'There is no drag and drop onto the component; the key opens the system picker.', 'It does not read file contents, so a file with the right extension but the wrong content passes accept.', 'Progress is yours to track: pass a function that returns how far each file has got.'],
    youMust: ['Give it a label that names what the files are for.', 'Say the limits in the hint, because the picker does not enforce them; maxSize and accept refuse files after the choice.', 'Send the files yourself and feed the numbers back through progress.', 'Show a failed send with the error prop, not by removing the file.'],
    usage: '<FileUpload multiple label="Floor plans" accept=".pdf" maxSize={2000000} onFilesChange={setFiles} />',
    backdrops: 'In light each file stands in a light grey recess on warm white plastic, in dark in a near-black recess on charcoal. The keys are the usual raised keys, and the error lines are critical red with a glyph. Nothing is orange.',
    purpose: 'A key that opens the file picker, with each chosen file read out in a window with its size and a remove key.',
    importLine: "import { FileUpload } from 'dial-react';",
    overview: (
      <>
        <p><code>FileUpload</code> keeps a native file input out of sight behind a key. The files you choose stand under the key, each in its own window with the name on the left, the size on the right and a 44px remove key beside it. <code>accept</code>, <code>maxSize</code> and <code>maxFiles</code> refuse what does not fit, and each refusal is an error line under the list. Add <code>progress</code> and a groove shows in the window of every file that has a number.</p>
        <p>The list is controlled with <code>files</code> and <code>onFilesChange</code>, or left alone with <code>defaultFiles</code>. The ref points to the native input.</p>
      </>
    ),
    hero: ex('FileUploadMultiple', 'Two plans chosen. Pick a file that is not a PDF or is over 2 MB and a line says why.'),
    ladder: [
      ex('FileUploadBasic', 'One file: a new choice replaces it.'),
      ex('FileUploadProgress', 'progress returns a number per file; files without one show no groove.'),
      ex('FileUploadControlled', 'The list lives in your state and you send it.'),
      ex('FileUploadStates', 'An error from outside, and the disabled form.'),
    ],
    whenToUse: ['Attach one or more files to a form.', 'Let a person send a firmware file, a photo or a backup to the hub.'],
    whenNotToUse: [['Choosing from a short list of options', 'Select'], ['Showing how far a task has got', 'Progress']],
    anatomy: [['Key', 'The Button key that opens the picker.'], ['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md tall.'], ['Name', 'type.body, wraps instead of being cut.'], ['Size', 'type.caption in text.secondary, tabular figures.'], ['Remove key', 'An IconButton, 44px, named Remove and the file name.'], ['Progress', 'An optional Progress groove under the name.'], ['Error lines', 'HelperText in the error tone, in a polite live region.']],
    states: [['Default', 'The key and any chosen files.'], ['Refused', 'An error line per refused file, and the list is unchanged.'], ['Sending', 'A groove in the window of each file that has a progress number.'], ['Disabled', 'The keys are off and the windows lose their shadow.']],
    content: ['Label the group with what the files are for, such as Floor plans.', 'Put the limits in the hint: the type, the size and the count.', 'Keep error lines to one fact: the name and what is wrong.'],
    dodont: [
      { do: 'Say “PDF, up to 2 MB each” in the hint.', dont: 'Leave the limits to be found out by a refusal.' },
      { do: 'Show a failed send with the error prop and keep the file.', dont: 'Remove the file silently when the send fails.' },
    ],
    a11y: ['The label names the group and the key is a real button.', 'The remove key is named “Remove” and the file name.', 'Error lines are in a polite live region and linked to the key with aria-describedby.', 'A removal is announced and focus moves to the next remove key, or back to the key.', 'In forced colours each window keeps a real border in the text colour.'],
    keyboard: [['Tab', 'Moves to the key, then to each remove key', 'FileUpload: the remove key takes a file out and moves focus on'], ['Space or Enter', 'Opens the picker on the key; removes the file on a remove key', 'FileUpload: the key opens the picker and a refused file is named']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/progress', 'Progress', 'How far a task has got.'], ['/components/button', 'Button', 'The key it is built on.'], ['/components/helper-text', 'HelperText', 'The lines under the list.']],
  },
  {
    name: 'PinInput',
    slug: 'pin-input',
    status: 'beta',
    limitations: ['It takes digits only; letters are ignored, so a code with letters needs Input.', 'It is not a one-time-code flow: sending the code again and the countdown are yours to build.', 'The value has no gaps; deleting a middle digit pulls the later digits one cell left.', 'Thai and Arabic-Indic digits are not accepted.'],
    youMust: ['Give it a label that names the code, and put where it came from in the hint.', 'Set length to the number of digits you send.', 'Pass your own cellLabel in another language.', 'Set error only after the code has been checked.'],
    usage: '<PinInput\n  label="Verification code"\n  hint="We sent six digits to your phone."\n  onComplete={(code) => check(code)}\n/>',
    backdrops: 'In light each cell is a light grey recess in warm white plastic; in dark each is a near-black recess in charcoal. The digits are primary ink in both and nothing is orange.',
    purpose: 'Takes a short code, one digit in each of a row of recessed windows.',
    importLine: "import { PinInput } from 'dial-react';",
    overview: (
      <>
        <p><code>PinInput</code> is a row of recessed windows, one for each digit of a short code. Each window is a real input in the same cut-in well as Input. A digit moves the cursor to the next window, Backspace goes back, and a paste or a phone's code suggestion fills every window at once. Digits are shown as dots with <code>mask</code>.</p>
        <p>It is controlled with <code>value</code> and <code>onValueChange</code>, or uncontrolled with <code>defaultValue</code>. The value is a string of digits. <code>onComplete</code> runs once when the last window is filled, and <code>name</code> sends the whole code with a form.</p>
      </>
    ),
    hero: ex('PinInputBasic', 'A six-digit code with a hint under the row.'),
    ladder: [
      ex('PinInputSizes', 'The two sizes, md and lg.'),
      ex('PinInputMasked', 'A four-digit PIN with each digit shown as a dot.'),
      ex('PinInputInvalid', 'A wrong code: red edges, a glyph and a message.'),
      ex('PinInputReadOnly', 'A code to read and copy, and a disabled row.'),
      ex('PinInputControlled', 'Controlled by your own state, with onComplete on the last digit.'),
      ex('PinInputTranslated', 'The cell names passed in German.'),
      ex('PinInputForm', 'A sign-in step: the code travels under its name and the orange key comes last.'),
    ],
    whenToUse: ['Enter a one-time code from a text message or an authenticator.', 'Enter a short numeric PIN of four to eight digits.'],
    whenNotToUse: [['An ID or any code with letters', 'Input'], ['A quantity set with steps and limits', 'NumberInput'], ['A secret of any length', 'PasswordInput']],
    anatomy: [['Cell', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring; control.md square (control.lg at size lg).'], ['Digit', 'type.emphasis in type.weight-medium with tabular figures.'], ['Label', 'type.label in type.weight-medium, printed above the row.'], ['Hint', 'type.caption in text.secondary under the row.'], ['Error', 'type.caption in status.critical-mark with a glyph.']],
    states: [['Filled', 'The digit, and the cell edge in text.secondary.'], ['Invalid', 'Every edge turns critical red and a glyph and words print under the row.'], ['Read-only', 'Recess and ink stay; there is no text cursor.'], ['Disabled', 'The recess shadow goes and the cells fade.']],
    content: ['Name the code with a noun.', 'Say where it came from in the hint.', 'Do not repeat the number of digits; the windows show it.'],
    dodont: [
      { do: 'Print where the code came from in the hint.', dont: 'Write “Enter the 6-digit code” in the label.' },
      { do: 'Check the code when onComplete runs.', dont: 'Mark every digit right or wrong as it is typed.' },
    ],
    a11y: ['The cells are a group named by the label, and each cell is named Digit n of N.', 'Every cell is 44px or larger and takes inputMode numeric and autocomplete one-time-code.', 'Invalid is told by a glyph and words, and every cell is aria-invalid.', 'Filled and empty differ by the digit and by the cell edge, not by colour alone.', 'In forced colours each cell keeps a real border and the focus ring uses the system highlight colour.'],
    keyboard: [['0 to 9', 'Fill the cell and move to the next one', 'PinInput: a digit fills its cell and focus moves to the next one; a letter is ignored'], ['Backspace', 'Clear the cell, or go back and clear the one before', 'PinInput: Backspace in an empty cell goes back and clears the cell before it'], ['Arrow keys, Home, End', 'Walk the cells', 'PinInput: ArrowLeft, Home and End walk the cells that hold a digit and the first empty one'], ['Ctrl+V', 'Fill every cell from the pasted digits', 'PinInput: a paste fills every cell and a whole code from autofill spreads over the cells']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/input', 'Input', 'Text, an ID or a code with letters.'], ['/components/number-input', 'NumberInput', 'A quantity set with steps and limits.'], ['/components/password-input', 'PasswordInput', 'A secret of any length.']],
  },
  {
    name: 'SearchInput',
    slug: 'search-input',
    status: 'beta',
    limitations: ['It has no suggestion list; use a Combobox or Autocomplete when the words come from a source.', 'It searches when Enter is pressed. Searching as the person types is up to your onChange.', 'The Clear key is a word; there is no icon-only version.'],
    youMust: ['Give it a label that names what is searched, such as Search rooms.', 'Handle the search yourself in onSearch or onChange; the field only reports the text.', 'Pass your own words for the Clear key and the count on a page that is not in English.'],
    usage: '<SearchInput label="Search rooms" onSearch={(value) => find(value)} />',
    backdrops: 'In light the well is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The search mark and Clear word are grey ink in both, and nothing is orange.',
    purpose: 'Takes a query in a recessed well with a search mark, a Clear key, Enter to search and Escape to clear.',
    importLine: "import { SearchInput } from 'dial-react';",
    overview: (
      <>
        <p><code>SearchInput</code> is an Input well with a dot-matrix search mark at its start. Once there is text, a Clear key fades in at the end: a printed word on a strip as tall as the well, so the target is 44px. Enter calls <code>onSearch</code> with the text, and Escape clears it. Set <code>resultsCount</code> and the number of matches is read out politely.</p>
      </>
    ),
    hero: ex('SearchInputBasic', 'The Clear key shows with text; Enter reports the query.'),
    ladder: [
      ex('SearchInputLarge', 'The 52px well for the main field of a phone sheet.'),
      ex('SearchInputFilter', 'A controlled field filters a list and announces the count.'),
      ex('SearchInputLandmark', 'The search landmark with a hint and an error.'),
      ex('SearchInputMessages', 'The Clear word and the count in Thai.'),
    ],
    whenToUse: ['Find one item in a list that is too long to scan.', 'Filter a page of rooms, devices or schedules as the person types.'],
    whenNotToUse: [['A value that is not a query', 'Input'], ['Choosing from suggestions while typing', 'Combobox']],
    anatomy: [['Label', 'type.label in type.weight-medium, above the well.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md tall at least.'], ['Search mark', 'The dot-matrix search glyph, control.icon-md, in text.secondary.'], ['Text field', 'type.body, control.md tall, in the rest of the row.'], ['Clear key', 'A word in type.label, control.md tall, divided by a width.hairline line.ring edge.'], ['Hint and error', 'type.caption; the error in status.critical with a glyph.']],
    states: [['Focus', 'width.ring in focus.ring around the well; the Clear key has its own ring.'], ['With text', 'The Clear key fades in over motion.release.'], ['Invalid', 'status.critical edge and a printed line with a glyph.'], ['Disabled', 'No recess shadow, opacity.disabled on the text, no Clear key.']],
    content: ['Label the field with what is searched.', 'Put the kinds of thing it finds in the hint.', 'Keep the Clear word to one or two words.'],
    dodont: [
      { do: 'Name what is searched in the label and put the scope in the hint.', dont: 'Use the placeholder as the name.' },
      { do: 'Use the landmark option once per page.', dont: 'Give two search fields the same landmark name.' },
    ],
    a11y: ['The field is type search and named by its label.', 'The Clear key is named by its printed word and reaches 44px.', 'Escape clears only when there is text, so a Dialog around the field still closes on the second press.', 'Enter is ignored while an input method is composing, so Thai and other IME text is not cut.', 'resultsCount is read out through a polite status without moving focus.', 'In forced colours the well keeps a real border and the focus ring uses the system highlight colour.'],
    keyboard: [['Enter', 'Calls onSearch with the text', 'SearchInput: Enter calls onSearch with the text and Escape clears it'], ['Escape', 'Clears the text and keeps focus in the field', 'SearchInput: Enter calls onSearch with the text and Escape clears it'], ['Tab', 'Reaches the field, then the Clear key', 'SearchInput: the Clear key shows with text, clears it on press and puts focus back in the field']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/input', 'Input', 'A value that is not a query.'], ['/components/combobox', 'Combobox', 'Choosing from suggestions while typing.']],
  },
  {
    name: 'VirtualList',
    slug: 'virtual-list',
    status: 'beta',
    limitations: ['Every row has one fixed height; a name that is too long is cut, not wrapped.', 'A row cannot hold a control, because it is an option; its end part is printing only.', 'There is no grouping, no sticky headers and no variable row height.', 'It windows rows on the vertical axis only; there is no horizontal or grid form.', 'Native scrolling is used, so very fast flings can show a blank row for a frame in slow browsers.'],
    youMust: ['Pass count and a cheap getItem that gives the same row for the same index.', 'Give the list a label, because it is a listbox.', 'Use scrollToIndex on the ref to jump; do not set scrollTop yourself.', 'Keep names on one line.'],
    usage: '<VirtualList label="All devices" count={5000} getItem={(i) => ({ index: i + 1, label: names[i] })} />',
    backdrops: 'In light the rows are grey ink on warm white plastic with an ink mark on the chosen one. In dark they are light ink on charcoal. The ring is dark ink in both and nothing is orange.',
    purpose: 'Holds thousands of List rows in one short plastic body and puts only the rows in view in the page.',
    importLine: "import { VirtualList } from 'dial-react';",
    overview: (
      <>
        <p><code>VirtualList</code> is a listbox in a scrolling window on a List body. You pass <code>count</code> and <code>getItem</code>; it puts the rows in view, plus <code>overscan</code> rows each side, into the page and moves them as you scroll. Each row keeps its place, so the scroll length is true.</p>
        <p>The window takes focus. Arrow Up and Arrow Down, Page Up and Page Down, Home and End move the active row, and Enter or Space chooses it. Call <code>scrollToIndex</code> on the ref to jump to a row.</p>
      </>
    ),
    hero: ex('VirtualListBasic', 'Five thousand devices in a window of six rows.'),
    ladder: [
      ex('VirtualListChosen', 'Controlled: the chosen row is named under the list.'),
      ex('VirtualListScrollTo', 'A key outside the list jumps to a row with scrollToIndex.'),
      ex('VirtualListStatus', 'A Badge at the end of each row, with a shorter window.'),
      ex('VirtualListDisabled', 'Every third row cannot be chosen and the keys step over it.'),
    ],
    whenToUse: ['Show hundreds or thousands of rows that all look alike.', 'Let people jump to a place in a long list by key or from code.'],
    whenNotToUse: [['A short list with a state in words under each name', 'List'], ['Rows with columns', 'Table'], ['Choosing one value from a menu', 'Select']],
    anatomy: [['Body', 'surface.solid, elevation.unit, corner.panel, gap.md inset.'], ['Window', 'The scrolling listbox, corner.inner, height of visibleRows steps.'], ['Row', 'A List row, control.lg tall, an even gap.xs apart.'], ['Index mark', 'width.ring in text.primary at the start of the chosen row.']],
    states: [['Chosen', 'An ink mark and medium weight, with aria-selected.'], ['Active', 'A dark ring on the row the keys point to.'], ['Pressed', 'The row sinks into a small recess.'], ['Disabled', 'opacity.disabled and aria-disabled.']],
    content: ['Name each row with a short noun phrase on one line.', 'Print a number only when it means something, such as a track.', 'Put the state at the end as a Badge.'],
    dodont: [
      { do: 'Use it for hundreds of like rows.', dont: 'Use it for five rows.' },
      { do: 'Tell the chosen row by the mark and weight.', dont: 'Tell it by colour alone.' },
    ],
    a11y: ['A listbox with a name; each row is an option with aria-posinset and aria-setsize, so its place is read out even though most rows are not in the page.', 'Focus stays on the window and aria-activedescendant names the active row.', 'Rows are at least control.lg tall.', 'In forced colours the body keeps a real border and the ring and mark use the highlight colour.'],
    keyboard: [['Arrow Up, Arrow Down', 'Moves the active row and scrolls it into view', 'VirtualList: the arrow keys, Page and Home and End move the active row through a long list'], ['Enter or Space', 'Chooses the active row', 'VirtualList: Enter chooses the active row and reports its index']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/list', 'List', 'A short list whose rows may grow.'], ['/components/table', 'Table', 'Rows with columns.']],
  },
  {
    name: 'Carousel',
    slug: 'carousel',
    status: 'beta',
    limitations: ['It never advances by itself; there is no autoplay and no pause key.', 'Every slide is one window wide; there is no peek of the next slide and no several-at-once view.', 'The track does not loop: the previous key is flat at the first slide and the next key at the last.', 'The holes show the position but cannot be pressed to jump to a slide.', 'The window takes the height of the tallest slide, so keep slides about the same height.'],
    youMust: ['Give the Carousel a label that names the set, such as Rooms.', 'Keep the slides about the same height.', 'Do not put a second orange key inside a slide.'],
    usage: '<Carousel label="Rooms">\n  <Text>Living room</Text>\n  <Text>Kitchen</Text>\n</Carousel>',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The lit hole is full ink in both and the waiting holes are ring ink; nothing is orange.',
    purpose: 'Pages through a few slides in a recessed window, with a previous and a next key and a row of holes for the position.',
    importLine: "import { Carousel, CarouselSlide } from 'dial-react';",
    overview: (
      <>
        <p><code>Carousel</code> is a region named a carousel. Each child becomes one slide, a group named “n of N”, one window wide on a native scroll-snap track. A round key each side steps back and forward, and the arrow keys do the same when the window has focus. A row of holes under the window shows the slide on show, and the same position is read out as text.</p>
        <p>Nothing advances by itself. Under reduce motion the track jumps to the slide instead of gliding. <code>index</code> and <code>onIndexChange</code> control it, or <code>defaultIndex</code> sets where it starts.</p>
      </>
    ),
    hero: ex('CarouselBasic', 'Five room slides, a dotted position and a key each side.'),
    ladder: [
      ex('CarouselControlled', 'index and onIndexChange hold the slide, and a key outside can move it.'),
      ex('CarouselStartsLater', 'defaultIndex starts on the third slide.'),
      ex('CarouselOtherLanguage', 'Every built-in word is a prop; here the words are Thai.'),
      ex('CarouselRightToLeft', 'The track runs from the right and the chevrons mirror.'),
      ex('CarouselWithSlides', 'CarouselSlide passes a slide its own attributes.'),
    ],
    whenToUse: ['Show three to eight slides of the same shape, one at a time.', 'Let a person page through a gallery or a short manual by swipe or by key.'],
    whenNotToUse: [['Switching between views of the page', 'Tabs'], ['Turning the pages of a long list', 'Pagination'], ['Numbering the sections of a form', 'Stepper']],
    anatomy: [['Window', 'surface.sunken, elevation.well, corner.media; clips the track.'], ['Slide', 'A group one window wide, padding gap.xl, snapping at its start edge.'], ['Keys', 'IconButton, control.key (44px), a dotted chevron.'], ['Holes', 'control.dot in line.ring with elevation.well; the lit one is control.mark in text.primary, with no recess.']],
    states: [['First slide', 'The previous key is flat.'], ['Last slide', 'The next key is flat.'], ['On show', 'The hole is larger and solid.'], ['Focus', 'The window takes the dark ring.']],
    content: ['Label the set with a plural noun.', 'Keep slides about the same height.', 'Do not number the slides in their own text.'],
    dodont: [
      { do: 'Name the set, as in Rooms.', dont: 'Leave the default name Carousel.' },
      { do: 'Let the person move it with a key or a swipe.', dont: 'Advance the slides on a timer.' },
    ],
    a11y: ['The region has aria-roledescription="carousel" and a name.', 'Each slide is a group with aria-roledescription="slide", named “n of N”.', 'The position is read in a polite status when it changes.', 'The keys are 44px and a flat key hands focus to the other one.', 'Under reduce motion the track jumps; in forced colours the window has a border and the holes draw in the text colour.'],
    keyboard: [['Left and Right arrow', 'Step one slide with the window focused; reversed in right-to-left', 'Carousel: the arrow keys step the slide and the end keys go flat'], ['Home and End', 'First and last slide', 'Carousel: the arrow keys step the slide and the end keys go flat']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/pagination', 'Pagination', 'Turning the pages of a long list.']],
  },
  {
    name: 'ColorPicker',
    slug: 'color-picker',
    status: 'beta',
    limitations: ['It has no saturation and lightness plane; the hue fader holds both fixed.', 'The colours are hex strings only; names such as red and rgb() values are not read.', 'It does not open a popup; it stands in the column like any field.'],
    youMust: ['Give every swatch a plain name, because the name is the key’s accessible name.', 'Keep the list to eight swatches or fewer.', 'Pass swatch colours as data; the picker never reads a token for them.'],
    usage: '<ColorPicker\n  label="Lamp colour"\n  swatches={[{ value: \'ffd9a0\', name: \'Warm white\' }, { value: \'ffb347\', name: \'Amber\' }]}\n  defaultValue="ffb347"\n/>',
    backdrops: 'In light the keys sit on warm white plastic with a grey hairline edge, in dark on charcoal with a lighter one. The ink ring and the tick are primary ink in both, and the only colour is the data on the keys.',
    purpose: 'Chooses a lamp colour from named round keys, with an optional hue fader and hex well.',
    importLine: "import { ColorPicker } from 'dial-react';",
    overview: (
      <>
        <p><code>ColorPicker</code> is a radio group of round lens keys. Each key’s face is the colour it sets, passed in as <code>swatches</code>. The chosen key sits down, wears an ink ring and shows a tick, and a line under the keys prints its name. <code>value</code> is a hex string. Add <code>hue</code> for a fader and <code>hex</code> for a well.</p>
      </>
    ),
    hero: ex('ColorPickerBasic', 'Eight named lamp colours, one chosen.'),
    ladder: [
      ex('ColorPickerHue', 'The hue fader reaches colours that no key holds.'),
      ex('ColorPickerHex', 'The hex well takes three or six digits.'),
      ex('ColorPickerControlled', 'Controlled, with the hex string shown beside it.'),
      ex('ColorPickerInForm', 'name submits the colour with the rest of the form.'),
      ex('ColorPickerDisabled', 'Disabled keys lose their height but keep the ring and tick.'),
    ],
    whenToUse: ['Choose a lamp or light colour from a short list of named colours.', 'Let a person fine-tune the colour with a fader or a hex value.'],
    whenNotToUse: [['One option that is a word, not a colour', 'RadioCards'], ['A single number such as brightness', 'Slider']],
    anatomy: [['Legend', 'type.label in text.secondary, the name of the group.'], ['Lens key', 'control.md round, line.ring edge, elevation.part; down when chosen.'], ['Tick plate', 'surface.raised, line.ring edge, control.icon-md, ink check.'], ['Readout', 'type.body in text.primary, a polite live region.']],
    states: [['Chosen', 'Down, an ink ring and a tick.'], ['Focus', 'A dark ring outside the choice ring.'], ['Disabled', 'No height, faded to half.']],
    content: ['Name each colour as a person would say it.', 'Never use a hex value as the name.', 'Keep to eight swatches or fewer.'],
    dodont: [
      { do: 'Name the key Warm white or Amber.', dont: 'Name the key with its hex digits.' },
      { do: 'Tell the choice by a ring and a tick.', dont: 'Tell it by a thicker coloured border.' },
    ],
    a11y: ['A radio group named by its legend, each key a radio named by the colour.', 'The arrow keys move to the next key and choose it.', 'The readout is a polite live region.', 'The chosen key has a ring and a tick that do not depend on its colour.', 'In forced colours the keys keep their colour and the ring and tick use the text colour.'],
    keyboard: [['Tab', 'Enters the group on the chosen key, or the first', 'ColorPicker: the keys are a named radio group and one is chosen'], ['Arrow keys', 'Move to the next or previous key and choose it', 'ColorPicker: an arrow key moves the choice']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/radio-cards', 'RadioCards', 'One option that is a word.'], ['/components/slider', 'Slider', 'A single number such as brightness.']],
  },
  {
    name: 'TransferList',
    slug: 'transfer-list',
    status: 'beta',
    limitations: ['Rows keep the order of the options; they cannot be reordered inside a window.', 'Each window scrolls past six rows and has no search; filter the options before you pass them.', 'Marks are not kept across a move; the rows that arrive in the other window are not marked.'],
    youMust: ['Give the control a label, because it is the name of the group.', 'Give each option a value that is unique across both windows.', 'Name the two windows by what they hold, not by left and right.'],
    usage: '<TransferList label="Rooms on the night schedule" defaultValue={["kitchen"]} options={[\n  { value: "kitchen", label: "Kitchen" },\n  { value: "bedroom", label: "Bedroom" },\n]} />',
    backdrops: 'In light the windows are light grey recesses in warm white plastic, in dark near-black recesses in charcoal. The keys are body-coloured and nothing is orange.',
    purpose: 'Moves rows between an available window and a chosen window with named keys, with no dragging.',
    importLine: "import { TransferList } from 'dial-react';",
    overview: (
      <>
        <p><code>TransferList</code> is two Listbox windows with a column of round keys between them. Mark rows with Space in either window, then press the key that points toward the other window, or press Alt with the arrow that points that way. <code>value</code> holds the chosen values and <code>onValueChange</code> reports them. A polite status reads out each move and the new totals.</p>
      </>
    ),
    hero: ex('TransferListBasic', 'Five rooms in two windows, two of them chosen.'),
    ladder: [
      ex('TransferListControlled', 'The chosen values held in state, with a count and the orange key that saves.'),
      ex('TransferListMoveAll', 'Two more keys that move every row at once.'),
      ex('TransferListSizes', 'Rows at 44px and 52px.'),
      ex('TransferListStates', 'A disabled row, a disabled control and an empty chosen window.'),
      ex('TransferListInForm', 'The chosen values submitted with a form, and the orange key last.'),
    ],
    whenToUse: ['Build a subset from a list that is too long to tick one row at a time.', 'Choose the rooms or devices that belong to a schedule.'],
    whenNotToUse: [['A short list where a few rows are marked', 'Listbox'], ['Several choices from a list that folds away', 'MultiSelect']],
    anatomy: [['Window', 'A Listbox: surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Key', 'IconButton at control.key, one dot-matrix arrow, named in words.'], ['Count', 'type.caption in text.secondary, tabular figures, under each window.'], ['Status', 'A visually hidden polite live region.']],
    states: [['Marked', 'A tick and medium weight in primary ink, with aria-selected.'], ['Key with nothing to carry', 'Half-faded and disabled.'], ['Row disabled', 'Half-faded, skipped by the arrows, never moved.'], ['Stacked', 'Under about 550px the windows stack and the keys lie in a row between them.']],
    content: ['Name the control with a noun for what is being built.', 'Name the windows by what they hold.', 'Write each option as a short noun or phrase.'],
    dodont: [
      { do: 'Name the windows Rooms and On the schedule.', dont: 'Name them Left and Right.' },
      { do: 'Use a Listbox with multiple for a short list.', dont: 'Use a TransferList for three rows.' },
    ],
    a11y: ['The control is a group named by its label; each window is a listbox named by its printed label.', 'The keys are buttons named in words, such as Add marked rows.', 'A polite status reads each move and the totals.', 'Moving rows never needs a drag, so it works by keyboard, switch and voice.', 'In forced colours the keys keep a real border in the text colour.'],
    keyboard: [['Tab', 'Moves between the available window, the keys and the chosen window', 'TransferList: Tab reaches both windows and the keys'], ['Space', 'Marks the reached row in a window', 'TransferList: Space marks a row and a key carries it across'], ['Alt + arrow toward the other window', 'Carries the marked rows across without leaving the list', 'TransferList: Alt with the arrow carries the marked rows across']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/listbox', 'Listbox', 'One always-open list; each window is one.'], ['/components/multi-select', 'MultiSelect', 'Several choices from a list that folds away.']],
  },
  {
    name: 'Calendar',
    slug: 'calendar',
    status: 'beta',
    limitations: ['It chooses one day only; there is no range and no multi-select.', 'The grid always prints six weeks and shows no days of the neighbouring months.', 'Days are yyyy-mm-dd strings in the Gregorian calendar; month and weekday words follow the locale, but a Buddhist or Hijri year count is shown only where Intl uses it for the locale.', 'The default week start is Monday and is not read from the locale.'],
    youMust: ['Pass days as yyyy-mm-dd strings and never as Date objects.', 'Pass previousLabel and nextLabel in the same language as locale.', 'Pair a chosen day with a key that saves it; the Calendar does not submit by itself.'],
    usage: '<Calendar defaultValue="2026-11-12" min="2026-11-04" onValueChange={setDay} />\n<Calendar value={day} onValueChange={setDay} month={month} onMonthChange={setMonth} />',
    backdrops: 'In light the days are dark grey numbers on warm white plastic and the chosen day sits in a light grey recess, in dark the numbers are pale on charcoal and the recess is near-black. Today and the chosen day differ by shape and weight in both, and nothing is orange.',
    purpose: 'A month grid for choosing one day: printed numbers, an index bar under today, the chosen day cut into a recessed window.',
    importLine: "import { Calendar } from 'dial-react';",
    overview: (
      <>
        <p><code>Calendar</code> is a grid of days with a roving tab stop. Arrow keys move one day or one week, Home and End reach the ends of the week, Page Up and Page Down turn the month, and Enter or Space chooses. <code>min</code>, <code>max</code> and <code>isDateDisabled</code> block days, <code>weekStart</code> sets the first column and <code>locale</code> sets the words through Intl. It works with <code>value</code> and <code>onValueChange</code> or on its own, and <code>month</code> can be controlled the same way. There is no date library; days go in and out as <code>yyyy-mm-dd</code> strings, and the date helpers are exported for a DatePicker built on top.</p>
      </>
    ),
    hero: ex('CalendarBasic', 'November 2026 with the 12th chosen and the 4th marked as today.'),
    ladder: [
      ex('CalendarControlled', 'Controlled day and month, with the values printed under the grid.'),
      ex('CalendarLimits', 'Days before min and after max are dimmed, and weekends are blocked with isDateDisabled.'),
      ex('CalendarLocale', 'Thai with the week starting on Sunday, and German.'),
      ex('CalendarWeekStart', 'The same month starting on Monday and on Sunday.'),
      ex('CalendarStates', 'readOnly keeps the keyboard, disabled turns the month off.'),
    ],
    whenToUse: ['Choose one day from a month, such as a start date.', 'Show a booked day with readOnly.'],
    whenNotToUse: [['Choosing a time of day', 'TimePicker'], ['Turning through pages', 'Pagination'], ['Picking a number on a range', 'Slider']],
    anatomy: [['Month keys', 'control.key discs, elevation.part, chevron icons.'], ['Month name', 'type.emphasis in type.weight-medium, a polite live region.'], ['Weekday names', 'type.caption in text.secondary.'], ['Day', 'control.md square, type.body in tabular figures, text.secondary.'], ['Chosen day', 'surface.sunken, elevation.well, width.hairline in line.ring, type.weight-medium.'], ['Today bar', 'width.bar in text.primary, control.thumb wide.']],
    states: [['Default', 'The number in secondary ink.'], ['Hover', 'The ink one step darker.'], ['Today', 'A short bar under the number.'], ['Chosen', 'A recessed window and medium weight.'], ['Focus', 'The focus ring around the 44px cell.'], ['Unavailable', 'Half-strength ink and a not-allowed cursor.'], ['Read-only', 'A default cursor and no press recess.']],
    content: ['Pass days as yyyy-mm-dd.', 'Name the month keys in the same language as locale.', 'Block days with isDateDisabled and do not hide them.'],
    dodont: [
      { do: 'Pass the key names in the language of the locale.', dont: 'Show a Thai month with English key names.' },
      { do: 'Leave blocked days in their columns.', dont: 'Remove days so the weeks shift.' },
    ],
    a11y: ['A grid named by the month and year; the name is a polite live region, so turning the month is read out.', 'Each day is a button with its full date as its name, inside a gridcell that carries aria-selected.', 'Today carries aria-current="date" and a bar; the chosen day carries a recess and weight.', 'One day is in the tab order and the arrow keys walk the rest.', 'Each day and key is a 44px target.', 'In forced colours the chosen day takes the Highlight pair and unavailable days use GrayText.'],
    keyboard: [['Arrow keys', 'Move the focus one day or one week', 'Calendar: arrows, Home, End and Page keys move the focus over days and months'], ['Home, End', 'Go to the first or the last day of the week', 'Calendar: arrows, Home, End and Page keys move the focus over days and months'], ['Page Up, Page Down', 'Turn the month; with Shift, the year', 'Calendar: arrows, Home, End and Page keys move the focus over days and months'], ['Enter, Space', 'Choose the focused day', 'Calendar: Enter chooses the focused day and an unavailable day cannot be chosen'], ['Tab', 'Moves into the grid at one day', 'Calendar: a labelled grid of six weeks with one day in the tab order, today announced and the chosen day selected']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/time-picker', 'TimePicker', 'Choosing a time of day.'], ['/components/pagination', 'Pagination', 'Turning through pages.']],
  },
  {
    name: 'TreeView',
    slug: 'tree-view',
    status: 'beta',
    limitations: ['Children of a closed branch are not mounted, so page search does not find them and they hold no state.', 'There is one choice at a time; multiple selection and checkboxes are left out.', 'There is no drag to reorder and no lazy loading; mount the children when you have them.', 'Keep it to four levels. Each level steps in by 22px and a narrow column runs out of width.'],
    youMust: ['Give the tree a name with aria-label or aria-labelledby.', 'Give every TreeItem a value that is unique inside the tree.', 'Name each item with a noun and let the chevron say it opens.', 'Keep the unit’s one orange key outside the tree.'],
    usage: '<TreeView aria-label="Rooms" defaultExpanded={[\'rooms\']}>\n  <TreeItem value="rooms" label="Rooms">\n    <TreeItem value="kitchen" label="Kitchen" />\n    <TreeItem value="hall" label="Hall" />\n  </TreeItem>\n</TreeView>',
    backdrops: 'In light the labels are warm grey ink on warm-white plastic with hairlines in ring ink, in dark light ink on charcoal. The chosen box is the label’s own ink in both, and nothing is orange.',
    purpose: 'Shows nested items that open and close, drawn as a schematic with hairlines and nodes.',
    importLine: "import { TreeView, TreeItem } from 'dial-react';",
    overview: (
      <>
        <p><code>TreeView</code> prints a hierarchy as a schematic. A branch has a chevron and opens to show its children, each joined to its parent by a hairline with one right-angle bend. A leaf ends its line in a small ring node. One item is chosen at a time and prints in medium weight inside a hairline box.</p>
        <p>It is a WAI-ARIA tree. Every item carries its level, its position and its size, and the arrow keys walk it. Pass <code>value</code> and <code>expanded</code> to control it, or <code>defaultValue</code> and <code>defaultExpanded</code> to let it keep its own state.</p>
      </>
    ),
    hero: ex('TreeViewBasic', 'Rooms and devices, with Kitchen chosen.'),
    ladder: [
      ex('TreeViewControlled', 'The choice and the open branches held in your own state.'),
      ex('TreeViewLeading', 'A dot-matrix Icon before each name.'),
      ex('TreeViewDisabled', 'Disabled items fade and the arrow keys skip them.'),
      ex('TreeViewExpandAll', 'Two Buttons open and close every branch, and a long name wraps.'),
    ],
    whenToUse: ['Browse a hierarchy of three or four levels, such as rooms and the devices in them.', 'Pick one item out of nested groups.'],
    whenNotToUse: [['Folding sections of text', 'Accordion'], ['Showing the path to the current page', 'Breadcrumb'], ['A flat list of items', 'List']],
    anatomy: [['Toggle cell', 'A control.md square with a 16px chevron on a branch or a control.dot ring node on a leaf.'], ['Label', 'type.body; the chosen one in type.weight-medium inside a width.hairline box in text.primary, radius corner.media.'], ['Join line', 'width.hairline in line.ring, down the parent’s chevron centre with a stub into each child.'], ['Leading node', 'An optional dot-matrix Icon before the name.'], ['Row', 'At least control.md tall, the full width of the item.']],
    states: [['Closed', 'Right chevron, secondary ink, aria-expanded="false".'], ['Open', 'Down chevron, the children drawn under it.'], ['Chosen', 'Primary ink, medium weight, a hairline box; a leaf’s node fills.'], ['Hover', 'The ink darkens a step.'], ['Disabled', 'Faded, skipped by the arrow keys.']],
    content: ['Name each item with a noun.', 'Do not write “Open” or “Folder” in the name.', 'Keep it to four levels.'],
    dodont: [
      { do: 'Name the item with a noun.', dont: 'Write “Click here for the kitchen”.' },
      { do: 'Keep the orange key outside the tree.', dont: 'Tint the chosen item orange.' },
    ],
    a11y: ['The list is role tree and each item is a treeitem with aria-level, aria-setsize, aria-posinset and, on a branch, aria-expanded.', 'Children stand in a role group.', 'Each item is named by its label text, so the leading glyph is hidden.', 'Choosing is told by a box and weight as well as ink, and the open state by the chevron.', 'Only one item is in the tab order.', 'Under Reduce motion a branch keeps its height and only fades.', 'In forced colours the lines and the box stay borders in the text colour.'],
    keyboard: [['Up / Down', 'Move to the previous or next visible item', 'TreeView: Up, Down, Right, Left, Home and End walk the visible items and skip a disabled one'], ['Right / Left', 'Open a branch, then enter it; close it, then go to the parent', 'TreeView: Up, Down, Right, Left, Home and End walk the visible items and skip a disabled one'], ['Home / End', 'Move to the first or last visible item', 'TreeView: Up, Down, Right, Left, Home and End walk the visible items and skip a disabled one'], ['Enter / Space', 'Choose the focused item', 'TreeView: Enter and Space choose the focused item and typing a letter jumps to a matching label'], ['A letter', 'Jump to the next item whose name starts with it', 'TreeView: Enter and Space choose the focused item and typing a letter jumps to a matching label']],
    inherits: 'HTMLAttributes<HTMLUListElement>',
    related: [['/components/accordion', 'Accordion', 'Folding sections.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to here.']],
  },
  {
    name: 'Wizard',
    slug: 'wizard',
    status: 'beta',
    limitations: ['canAdvance is synchronous; it cannot wait for a server answer.', 'Steps cannot be pressed to jump; only Back and Next move, or your own state through current.', 'The rail runs down only; there is no horizontal Wizard.', 'The fields of closed steps stay mounted but hidden, so a very large step costs memory.'],
    youMust: ['Name each step with a noun and leave the number to the window.', 'Hold the values of every step in your own state or in the fields, and submit them in onFinish.', 'Pass your own words for the keys and the heading when the product is not in English.'],
    usage: '<Wizard canAdvance={(i) => i !== 0 || name !== \'\'} onFinish={save}>\n  <WizardStep title="General">…</WizardStep>\n  <WizardStep title="Review">…</WizardStep>\n</Wizard>',
    backdrops: 'In light the number windows are light grey recesses in warm white plastic, in dark near-black recesses in charcoal. The keys are body-coloured and only Finish on the last step is orange.',
    purpose: 'Walks a setup one step at a time on the Stepper rail, with Back, Next and Finish keys and a check before each step is left.',
    importLine: "import { Wizard, WizardStep } from 'dial-react';",
    overview: (
      <>
        <p><code>Wizard</code> shows the Stepper rail and opens one <code>WizardStep</code> at a time. The steps before it are <code>done</code> and show a check, the open one is <code>current</code>, and the rest are <code>upcoming</code>. Back and Next sit under the rail, and Next becomes the orange Finish on the last step.</p>
        <p><code>canAdvance(index)</code> can refuse to leave a step. The step then stays open and a status line prints the reason. When the step changes, focus moves to its title.</p>
      </>
    ),
    hero: ex('WizardBasic', 'Three steps: only the open one shows its fields.'),
    ladder: [
      ex('WizardValidated', 'canAdvance holds the person on a step until its field is filled.'),
      ex('WizardControlled', 'The open step held in your own state.'),
      ex('WizardFinish', 'Finish on the last step calls onFinish.'),
      ex('WizardLabels', 'Your own words on the keys, in Thai, with a level-3 heading.'),
    ],
    whenToUse: ['Split a setup into two to five ordered steps.', 'Check one step before the person goes on to the next.'],
    whenNotToUse: [['A form that fits one screen', 'Stepper'], ['Views with no order', 'Tabs'], ['Events in order', 'Timeline']],
    anatomy: [['Number window', 'The Stepper window: surface.sunken, elevation.well, control.md square.'], ['Step title', 'The open step name, a heading that takes focus on a change.'], ['Status line', 'type.label with a warning glyph, role status.'], ['Key row', 'Back and Next or Finish, control.md tall, gap.lg apart.']],
    states: [['Current', 'The open step: primary ink and aria-current="step".'], ['Done', 'A check in the window.'], ['Blocked', 'A warning glyph and the blocked words in medium weight.'], ['Last step', 'Finish in the accent key replaces Next.']],
    content: ['Name each step with a noun.', 'Do not write the number in the title.', 'Keep Back, Next and Finish to one word each.'],
    dodont: [
      { do: 'Say what is missing when a step cannot be left.', dont: 'Disable Next with no word.' },
      { do: 'Name the step with a noun and let the window count.', dont: 'Write “Step 1:” in the title.' },
    ],
    a11y: ['Focus moves to the open step title, a heading, when the step changes.', 'The title is read with “Step 2 of 3”.', 'The status line is a polite live region.', 'Next stays focusable when blocked, so the reason can be heard.', 'In forced colours the title ring uses the system highlight colour.'],
    keyboard: [['Tab', 'Moves through the fields of the open step, then Back and Next', 'Wizard: Next moves focus to the new step title'], ['Enter or Space', 'Presses the focused key', 'Wizard: Next moves focus to the new step title']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stepper', 'Stepper', 'Numbered sections shown all at once.'], ['/components/tabs', 'Tabs', 'Views with no order.']],
  },
  {
    name: 'OTPFlow',
    slug: 'otp-flow',
    status: 'beta',
    limitations: ['It does no network work: you send the code, check it and set status.', 'It has no verify key; the code is passed to onVerify when the last digit is filled.', 'The countdown restarts from resendIn; it cannot keep a limit across a page reload.', 'It takes digits only, as PinInput does.'],
    youMust: ['Send the code yourself in onResend and check it in onVerify.', 'Set status to verifying, then to success or error, when your check returns.', 'Set status back to idle when the person edits a rejected code.', 'Pass every word in labels when you translate.'],
    usage: '<OTPFlow\n  destination="+66 81 234 5678"\n  resendIn={30}\n  status={status}\n  onVerify={(code) => check(code)}\n  onResend={() => sendCode()}\n/>',
    backdrops: 'In light the window and the digit cells are light grey recesses in warm white plastic, in dark near-black recesses in charcoal. All ink is grey and nothing is orange.',
    purpose: 'Runs the whole code step of a sign-in: where the code went, the digits, a countdown and a send-again key.',
    importLine: "import { OTPFlow } from 'dial-react';",
    overview: (
      <>
        <p><code>OTPFlow</code> is a heading, a recessed window, a <code>PinInput</code> and a key in one column. The window prints where the code went on one side and the time to the next code on the other. The key is flat until the countdown ends, then it asks for a new code and clears the digits.</p>
        <p>The flow calls <code>onVerify</code> with the full code when the last digit is filled. You check it and set <code>status</code> to <code>verifying</code>, <code>success</code> or <code>error</code>. A polite status line speaks each verdict and the end of the countdown, but not each second.</p>
      </>
    ),
    hero: ex('OTPFlowBasic', 'A six-digit step with a thirty-second countdown.'),
    ladder: [
      ex('OTPFlowChecked', 'The host checks the code and sets status; try 123456 and any other code.'),
      ex('OTPFlowResend', 'A ten-second countdown and a count of the codes sent.'),
      ex('OTPFlowControlled', 'Four digits controlled by your own state, with a smaller heading.'),
      ex('OTPFlowTranslated', 'Every built-in word passed in German.'),
    ],
    whenToUse: ['A sign-in or sign-up step that asks for a code sent by text message or email.', 'A step that confirms a phone number or address before a change is saved.'],
    whenNotToUse: [['A code field inside a form that has other fields', 'PinInput'], ['A secret the person chose', 'PasswordInput']],
    anatomy: [['Title', 'Heading, level 3 by default.'], ['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Destination', 'type.emphasis in type.weight-medium with tabular figures.'], ['Countdown', 'type.title in tabular figures, text.secondary until it ends.'], ['Digit row', 'PinInput with its own label and 44px cells.'], ['Message', 'HelperText, one line of height kept at all times.'], ['Send-again key', 'Button, kind key.']],
    states: [['Waiting', 'The countdown in secondary ink and the key flat.'], ['Ready', 'The countdown in primary ink and the key at full height.'], ['Verifying', 'The digits are read-only and a line says the code is being checked.'], ['Error', 'Red edges on every digit and the message under the row.'], ['Success', 'A check and the word Verified under the row.']],
    content: ['Give the title a verb and a noun.', 'Write the destination as the person knows it.', 'Say what is wrong and what to do in the error.'],
    dodont: [
      { do: 'Check the code in onVerify and set status.', dont: 'Add a second primary key to send the code.' },
      { do: 'Name the problem and the way out in the error.', dont: 'Write “Error” and nothing else.' },
    ],
    a11y: ['The step is a group named by its title.', 'A polite status line speaks the verdicts, a new code and the end of the countdown; the ticking seconds are hidden from assistive tech.', 'The disabled key is described by the seconds left.', 'Success and error are told by a glyph and words, not by colour alone.', 'In forced colours the window keeps a real border and the text uses the system colour.'],
    keyboard: [['0 to 9', 'Fill the digits; the last one sends the code to onVerify', 'OTPFlow: a full code calls onVerify once with every digit'], ['Tab, Enter or Space', 'Reach the send-again key once it is ready and press it', 'OTPFlow: the send-again key waits for the countdown, then clears the digits and returns focus to the first one']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/pin-input', 'PinInput', 'The digit row on its own.'], ['/components/dialog', 'Dialog', 'A sheet to hold the step.'], ['/components/banner', 'Banner', 'A problem that is not about the code.']],
  },
  {
    name: 'DataGrid',
    slug: 'data-grid',
    status: 'beta',
    limitations: ['It renders every row, so it suits a few hundred rows; there is no virtual scrolling (VirtualList is a listbox of one column and cannot hold cells).', 'It has no filtering, paging, column resizing, reordering, pinned columns, cell editing or row expansion.', 'Sorting is by one column at a time, and a cell cannot hold a control that needs its own Tab stop.'],
    youMust: ['Give every column a unique key and a clear header.', 'Give rows a stable id, or pass getRowKey, when rows can be marked or reordered.', 'Set numeric on every column of numbers.', 'Pass the name of the grid with caption or label.'],
    usage: '<DataGrid\n  caption="Energy by room"\n  columns={[{ key: \'room\', header: \'Room\', accessor: (r) => r.room, sortable: true }]}\n  rows={rooms}\n  selectionMode="multiple"\n/>',
    backdrops: 'In light the text is dark ink on warm white plastic, in dark light ink on charcoal. The focus ring and the seams are ink in both, the header fills with the unit ground, and nothing is orange.',
    purpose: 'A Table you walk by cell, with sorting by column, a header that stays in view and optional row selection.',
    importLine: "import { DataGrid } from 'dial-react';",
    overview: (
      <>
        <p><code>DataGrid</code> is a WAI-ARIA grid. Columns come from a <code>columns</code> array with an <code>accessor</code> or a <code>render</code>. The grid has one Tab stop and the arrow keys, Home, End and the Page keys move between cells. A sortable header carries aria-sort. <code>selectionMode</code> adds a checkbox column. It reuses Table’s flat printing.</p>
      </>
    ),
    hero: ex('DataGridBasic', 'Four rooms; press Room or kWh to sort, or walk the cells with the arrow keys.'),
    ladder: [
      ex('DataGridMultiple', 'Checkboxes mark rows and the header key marks all of them.'),
      ex('DataGridSingle', 'Marking a row clears the one marked before.'),
      ex('DataGridScroll', 'Twenty-four rows in a window of five; the header stays in view.'),
      ex('DataGridControlled', 'Sort and selection controlled, with your own ordering and a Thai row that wraps.'),
    ],
    whenToUse: ['Sort, scan and mark rows of the same facts.', 'Show a few hundred rows that a person reads across and down.'],
    whenNotToUse: [['Rows that are only read', 'Table'], ['Thousands of items in one column', 'VirtualList'], ['A short list of items to choose from', 'List']],
    anatomy: [['Header cell', 'type.weight-medium in text.secondary, sticky on unit-bg, with a divider seam below.'], ['Cell', 'type.body, at least control.md tall, a divider seam below.'], ['Select key', 'A Checkbox in a control.md wide column.'], ['Focus ring', 'width.ring in focus.ring, drawn inside the cell edge.']],
    states: [['Focused cell', 'An ink ring inside the cell edge.'], ['Sorted', 'Primary ink, a chevron and aria-sort.'], ['Marked row', 'A tick in the checkbox, a stronger seam and aria-selected.'], ['Empty', 'One line of secondary ink across the grid.']],
    content: ['Name columns with nouns.', 'Put the unit in the header, not in every cell.', 'Give the grid a caption.'],
    dodont: [
      { do: 'Give rows a stable id so a marked row stays marked after a sort.', dont: 'Key rows by position when the order can change.' },
      { do: 'Act on the marked rows from one key below the grid.', dont: 'Put a button in every cell; it cannot be reached by keyboard.' },
    ],
    a11y: ['A role grid with a name from the caption, and aria-multiselectable when several rows can be marked.', 'One Tab stop; the arrow keys, Home, End and the Page keys move between cells, and left and right swap in right-to-left.', 'A sorted column carries aria-sort and a chevron, so direction is a shape and not a colour.', 'A marked row has aria-selected, a tick and a stronger seam; the number of marked rows is announced.', 'In forced colours the focused cell keeps a Highlight outline.'],
    keyboard: [['Tab', 'Enters the grid on one cell and leaves on the next Tab', 'DataGrid: the grid has a single Tab stop'], ['Arrow keys, Home, End, Page Up, Page Down', 'Move between cells', 'DataGrid: arrows, Home, End and Page keys move the focused cell'], ['Enter, Space', 'Sorts a sortable header, marks the row of a cell', 'DataGrid: Enter sorts a header and Space marks a row']],
    inherits: 'HTMLAttributes<HTMLTableElement>',
    related: [['/components/table', 'Table', 'Rows that are only read.'], ['/components/virtual-list', 'VirtualList', 'Very long lists of one column.'], ['/components/pagination', 'Pagination', 'Moving between pages of rows.']],
  },
  {
    name: 'DatePicker',
    slug: 'date-picker',
    status: 'beta',
    limitations: ['It chooses one day only; a start and an end need two pickers, or a RangePicker.', 'Dates are yyyy-mm-dd strings in the Gregorian calendar, and a typed date is read as Gregorian with Latin digits, so a Buddhist year such as 2569 is refused.', 'A typed year must have four digits; two-digit years are refused, not guessed.', 'The Calendar panel is as wide as the month and does not become a bottom sheet on a phone.'],
    youMust: ['Give the picker a label that names the day, such as "Start date".', 'Pass chooseLabel and formatWords in the same language as locale.', 'Pass days as yyyy-mm-dd strings and never as Date objects.', 'Say in the hint why a day is blocked when you pass min, max or isDateDisabled.'],
    usage: '<DatePicker label="Start date" value={day} onValueChange={setDay} />\n<DatePicker label="Delivery day" min="2026-11-04" isDateDisabled={isWeekend} />',
    backdrops: 'In light the window is a light grey recess in warm white plastic and the key is a raised round part, in dark the window is near-black and the key is charcoal. The panel holds the Calendar and nothing is orange.',
    purpose: 'Asks for one day in a recessed window that takes a typed date, with a round key that opens the Calendar.',
    importLine: "import { DatePicker } from 'dial-react';",
    overview: (
      <>
        <p><code>DatePicker</code> is an <code>Input</code>-style window with a round key beside it. Type a date as <code>yyyy-mm-dd</code> or in the order of the locale, and press Enter or leave the field to commit it. Press the key, or Alt and Down arrow, to open the <code>Calendar</code> on a small panel and pick the day instead. <code>value</code> and <code>onValueChange</code> pass the day as a <code>yyyy-mm-dd</code> string, or null when the field is cleared, and the picker works on its own with <code>defaultValue</code>. Text that is not a real day, or a day blocked by <code>min</code>, <code>max</code> or <code>isDateDisabled</code>, prints a message and keeps what was typed.</p>
      </>
    ),
    hero: ex('DatePickerBasic', 'A date window with 12 November typed in and the calendar key beside it.'),
    ladder: [
      ex('DatePickerControlled', 'Controlled day, with the committed value printed under the field.'),
      ex('DatePickerLimits', 'min, max and weekends blocked; a typed date on a blocked day is refused.'),
      ex('DatePickerLocale', 'Thai and German: the typed order, the panel words and the format words follow the locale.'),
      ex('DatePickerStates', 'An error from the page, a read-only date and a disabled picker.'),
      ex('DatePickerInForm', 'Inside a form, where name carries the day as yyyy-mm-dd.'),
    ],
    whenToUse: ['Ask for one day in a form, such as a start or a delivery.', 'Let people type a date they know or pick one they do not.'],
    whenNotToUse: [['Showing a month with no field', 'Calendar'], ['Choosing a time of day', 'TimePicker'], ['A short list of fixed dates', 'Select']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the window.'], ['Date window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md tall.'], ['Calendar key', 'A round IconButton, control.key, with the schedule glyph.'], ['Panel', 'Popover: surface.solid, elevation.float, holding a Calendar.'], ['Hint', 'type.caption in text.secondary.'], ['Error', 'type.caption in status.critical-mark with a printed glyph.']],
    states: [['Default', 'A recessed window and a raised key.'], ['Focus', 'The dark ring around the window.'], ['Open', 'The key reports aria-expanded and the Calendar stands on the panel.'], ['Invalid', 'A red edge, a mark and a message.'], ['Read-only', 'The recess stays and the key is off.'], ['Disabled', 'No recess shadow, text at half strength and the key off.']],
    content: ['Name the day by its job, such as "Delivery day".', 'Let the hint print the format.', 'Say why a day is blocked.'],
    dodont: [
      { do: 'Label it "Delivery day" and let the hint print the format.', dont: 'Write the format in the label.' },
      { do: 'Print the reason in the hint when days are blocked.', dont: 'Block days with no word about it.' },
    ],
    a11y: ['The text field is named by its visible label.', 'The key is named "Choose date" and reports aria-expanded; the panel is a dialog.', 'An invalid date sets aria-invalid and its message is linked with aria-describedby.', 'The message carries a printed mark as well as the red edge.', 'In forced colours the window keeps a real border and the focus ring uses the system highlight colour.'],
    keyboard: [['Enter / Tab', 'Commits a typed date', 'DatePicker: a typed date in ISO or locale order commits on Tab and Enter and is shown in the locale order'], ['Alt + Down arrow', 'Opens the Calendar from the field', 'DatePicker: Alt and Down arrow opens the Calendar from the field, and the month sits inside the panel without scrolling sideways'], ['Enter / Space on the key', 'Opens the Calendar with focus on the chosen day', 'DatePicker: the key opens the Calendar with focus on the chosen day, choosing a day fills the field and Escape returns to the key'], ['Escape', 'Closes the panel and returns focus to the key', 'DatePicker: the key opens the Calendar with focus on the chosen day, choosing a day fills the field and Escape returns to the key']],
    inherits: 'InputHTMLAttributes<HTMLInputElement>',
    related: [['/components/calendar', 'Calendar', 'The month on its own, with no field.'], ['/components/input', 'Input', 'A plain text field.'], ['/components/popover', 'Popover', 'The panel that holds the Calendar.']],
  },
  {
    name: 'Form',
    slug: 'form',
    status: 'beta',
    limitations: ['It reads native controls. A control that keeps its value in a hidden input, such as Select, is sent but not checked by the browser.', 'It checks on submit and then on change. It does not check on blur or on every key from the start.', 'It has no field arrays, no nested objects and no schema; the values are the flat FormData of the form.', 'The summary lists one problem per name, the first one the browser finds.'],
    youMust: ['Give every control a name; a control with no name is not sent and not checked.', 'Use one FormSubmit per form, as the unit’s one orange key.', 'Do the work of a successful send in onSubmit and move focus yourself afterwards.', 'Wrap a control that prints its own label in a FormItem with no label, and a bare control in a FormItem with one.'],
    usage: '<Form onSubmit={save}>\n  <FormItem name="room">\n    <Input label="Room name" required />\n  </FormItem>\n  <FormSubmit>Save room</FormSubmit>\n</Form>',
    backdrops: 'The summary is a recessed window in primary and secondary ink on the sunken plastic, 8.4:1 and 6.0:1 in light and 12.8:1 and 10.2:1 in dark. Its rim is ring ink, above 3:1 in both. Nothing in the form but the submit key is orange.',
    purpose: 'Collects named fields, words the problems in one window that links to each field, and holds the submit key while a send runs.',
    importLine: "import { Form, FormItem, FormSubmit } from 'dial-react';",
    overview: (
      <>
        <p><code>Form</code> is a native form with the browser’s bubbles switched off. On submit it checks every named control, words each failed constraint, and either calls <code>onSubmit</code> with the values or shows a summary window above the fields. The window holds a count and one link per problem, and it takes focus. After the first submit a field is checked again as it changes.</p>
        <p><code>FormItem</code> carries the problem for one name down to its control. <code>FormSubmit</code> is the orange key that goes flat and says Sending while a promise from <code>onSubmit</code> is pending.</p>
      </>
    ),
    hero: ex('FormBasic', 'Press Save with the name empty: the window counts the problem and links to the field.'),
    ladder: [
      ex('FormConstraints', 'Required, type, pattern, length and range, each worded by the form.'),
      ex('FormAsync', 'The key goes flat and says Sending until the promise settles.'),
      ex('FormValidate', 'A rule across two fields, and a problem handed back by the server.'),
      ex('FormMessages', 'Your own words, here in Thai, for the sentences and the heading.'),
      ex('FormLabelled', 'A label on FormItem wraps a bare control in a FormField.'),
    ],
    whenToUse: ['Collect several named fields and send them together.', 'Tell every problem of a failed send in one place.', 'Hold the submit key while a send runs.'],
    whenNotToUse: [['One field that saves as you leave it', 'Editable'], ['Naming a group of controls', 'Fieldset'], ['Numbered sections of a long form', 'Stepper']],
    anatomy: [['Form', 'A native form, noValidate, a grid with gap.xl.'], ['Summary window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Count', 'type.title in tabular figures.'], ['Link', 'A 44px row, ink, one rule under the words.'], ['Message', 'type.caption in secondary ink.'], ['Submit key', 'Button of kind primary, the unit’s one orange part.']],
    states: [['Failed send', 'The summary window appears and takes focus.'], ['Sending', 'The key is aria-disabled, flat, and says Sending; the form is aria-busy.'], ['Fixed', 'A row leaves the window as its field becomes right.']],
    content: ['Write each message as what to do.', 'Keep labels to a noun, because the summary repeats them.', 'Send the values only when every field is right.'],
    dodont: [
      { do: 'Let the form word the browser’s constraints.', dont: 'Check each field by hand in onChange.' },
      { do: 'Tell a problem by words and a glyph.', dont: 'Tell a problem by red alone.' },
    ],
    a11y: ['The summary is a group named by its heading, and the heading starts with the count.', 'Focus moves to the summary after a failed send, and a link moves it to the field.', 'Each field is aria-invalid with its message in aria-describedby through FormField or Input.', 'Sending is announced by a polite status and aria-busy; the key keeps focus because it is aria-disabled, not disabled.', 'In forced colours the summary keeps a real border and its links use the system link colour.'],
    keyboard: [['Enter', 'In a field, sends the form; on a summary link, puts focus in its field', 'Form: a failed send puts focus on the summary and its links reach each field'], ['Tab', 'Moves from the summary through its links to the fields', 'Form: a failed send puts focus on the summary and its links reach each field']],
    inherits: 'FormHTMLAttributes<HTMLFormElement>',
    related: [['/components/form-field', 'FormField', 'A label, a control and its messages.'], ['/components/fieldset', 'Fieldset', 'A named group of controls.'], ['/components/stepper', 'Stepper', 'Numbered sections of a long form.']],
  },
  {
    name: 'RangePicker',
    slug: 'range-picker',
    status: 'beta',
    limitations: ['The Calendar shows one month at a time; a long range is chosen by turning the month between the two presses.', 'Dates are typed as yyyy-mm-dd in every locale; only the Calendar words follow locale.', 'A range may run across a day that isDateDisabled blocks; check that in your own code.', 'It chooses days only, with no time of day.'],
    youMust: ['Pass days as yyyy-mm-dd strings and never as Date objects.', 'Pass startLabel, endLabel, openLabel, closeLabel, previousLabel, nextLabel and the two messages in the same language as locale.', 'Treat a range with end null as unfinished and ask for the last day before you save.'],
    usage: '<RangePicker label="Stay" defaultValue={{ start: "2026-11-09", end: "2026-11-17" }} onValueChange={setStay} />\n<RangePicker label="Stay" value={stay} onValueChange={setStay} min="2026-11-04" startName="from" endName="to" />',
    backdrops: 'In light the wells are light grey recesses in warm white plastic and the ruled strip is a ring-ink hairline, in dark the wells are near-black recesses and the strip is the lighter ring ink. The span differs from the other days by line and window in both, and nothing is orange.',
    purpose: 'Two recessed wells and a calendar key for choosing a start day and an end day, with the span ruled in the Calendar by shape.',
    importLine: "import { RangePicker } from 'dial-react';",
    overview: (
      <>
        <p><code>RangePicker</code> is a group of two typed wells and a round key. Type <code>yyyy-mm-dd</code> into either well, or press the key to open the Calendar. The first day you press becomes the start and the end well empties. Hover or arrow to preview the span, then press the last day: both wells fill, the panel closes and focus returns to the key. The ends always arrive in order, and typing a start after the end swaps the pair.</p>
        <p>In the Calendar the two end days are windows and the days between are ruled above and below. While you are still choosing the end, that rule is dotted. <code>min</code>, <code>max</code> and <code>isDateDisabled</code> apply to both the Calendar and the wells. The Calendar gained <code>range</code> and <code>onDayHover</code> props for this, and they work on their own.</p>
      </>
    ),
    hero: ex('RangePickerBasic', 'A stay from the 9th to the 17th of November, with the key closed.'),
    ladder: [
      ex('RangePickerControlled', 'Controlled value, with the number of nights printed under the wells.'),
      ex('RangePickerLimits', 'Days before min and after max, and weekends, are blocked, with a hint.'),
      ex('RangePickerLocale', 'Thai words for the Calendar and every built-in word passed in Thai.'),
      ex('RangePickerForm', 'In a form with hidden fields, an error for a missing end, and the orange key last.'),
      ex('RangePickerStates', 'readOnly shows a booked range, disabled switches the pair off.'),
    ],
    whenToUse: ['Choose the first and the last day of a stay or a booking.', 'Filter a list to a span of days.'],
    whenNotToUse: [['Choosing one day', 'Calendar'], ['Choosing a time of day', 'TimePicker'], ['Choosing two numbers on a scale', 'RangeSlider']],
    anatomy: [['Group name', 'type.label in type.weight-medium.'], ['Wells', 'Input: surface.sunken, elevation.well, corner.media, width.hairline in line.ring, control.md high.'], ['Ink bar', 'width.bar in text.primary, control.thumb wide.'], ['Calendar key', 'IconButton with the schedule glyph, control.md round.'], ['End days', 'Calendar window: surface.sunken, elevation.well, line.ring.'], ['Days between', 'width.hairline above and below in line.ring; dotted while previewing.'], ['Status line', 'type.caption in text.secondary, a polite live region.']],
    states: [['Default', 'Two wells, the bar and the key.'], ['Open', 'The Calendar in a panel under the key.'], ['Choosing the end', 'The start is a window and the preview strip is dotted.'], ['Chosen', 'Windows at both ends and a solid strip.'], ['Invalid text', 'A message with a glyph under the row.'], ['Read-only', 'Readable dates; the key does not open.'], ['Disabled', 'Wells, bar and key at the disabled step.']],
    content: ['Name the group for what the span is, such as Stay.', 'Keep the well names short: Start and End, or Arrive and Leave.', 'Say the longest or shortest span in a hint.'],
    dodont: [
      { do: 'Name the group for what the span is.', dont: 'Name it Select a date range.' },
      { do: 'Finish the pair before you save.', dont: 'Save a range whose end is null.' },
    ],
    a11y: ['A group named by its label, with two named fields and a key that opens a dialog.', 'The key reports aria-expanded; focus moves to one day on open and returns to the key on close.', 'Days inside the range are aria-selected and their names end in in range, start of range or end of range.', 'A bad typed date marks its well aria-invalid and points to a message with a glyph.', 'The span is told by windows and a ruled strip, never by colour alone.', 'In forced colours the strip and the ink bar draw in the text colour and the end days take the Highlight pair.'],
    keyboard: [['Enter, Space on the key', 'Open the Calendar with focus on one day', 'RangePicker: the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key'], ['Arrow keys, Home, End, Page keys', 'Walk the days; the span previews as you move', 'RangePicker: the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key'], ['Enter, Space on a day', 'First press sets the start, second sets the end and closes', 'RangePicker: the first press sets the start, a hover previews the end with a dotted strip, and the second press sets the end and closes'], ['Escape', 'Close the Calendar and return focus to the key', 'RangePicker: the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key'], ['Type, then Tab or Enter', 'Accept a yyyy-mm-dd date', 'RangePicker: a typed date is accepted on blur, a bad one is reported, and a start after the end swaps the pair']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/calendar', 'Calendar', 'Choosing one day.'], ['/components/time-picker', 'TimePicker', 'Choosing a time of day.'], ['/components/range-slider', 'RangeSlider', 'Two numbers on a scale.']],
  },
  {
    name: 'AppShell',
    slug: 'app-shell',
    status: 'beta',
    limitations: ['It folds only the side column; the header folds itself through Navbar.', 'Focus is moved only when focusKey changes; it does not read the address itself.', 'The column is a slot, so a Sidebar collapsed to icons loses its collapsed state when the shell folds and unfolds.'],
    youMust: ['Use one AppShell per page.', 'Pass the router pathname as focusKey if your router does not move focus.', 'Give the Navbar and the Sidebar different label values so the two navigation landmarks are told apart.'],
    usage: '<AppShell header={<Navbar brand="dial" />} sidebar={<Sidebar>…</Sidebar>} focusKey={pathname}>\n  <Heading level={2}>Kitchen</Heading>\n</AppShell>',
    backdrops: 'The shell is the page ground: warm grey in light, near-black in dark. The units on it keep their own plastic, and nothing in the shell is orange.',
    purpose: 'Frames a screen with a header, a side column, main and a footer, folds the column into a Drawer when narrow, and moves focus to main.',
    importLine: "import { AppShell } from 'dial-react';",
    overview: (
      <>
        <p><code>AppShell</code> places <code>header</code>, <code>sidebar</code>, the page (its children) and <code>footer</code> as separate units with an inset gap. The page sits in a <code>main</code> landmark; a <code>Navbar</code> is the banner, a <code>Sidebar</code> is a navigation landmark and the footer is the footer landmark. A skip link is the first stop for the keyboard.</p>
        <p>The shell measures its own width. Under <code>breakpoint</code> the sidebar leaves the page and opens in a <code>Drawer</code>. Pass a function as <code>header</code> to wire the Navbar&rsquo;s Menu key to it, and a <code>focusKey</code> to move focus to main on a route change.</p>
      </>
    ),
    hero: ex('AppShellBasic', 'Header, Sidebar, main and footer on the page ground.'),
    ladder: [
      ex('AppShellCompact', 'Narrow: the Navbar Menu key opens the Sidebar in a Drawer.'),
      ex('AppShellOwnMenu', 'Narrow with no header: the shell prints its own Menu key.'),
      ex('AppShellSticky', 'The header holds the top edge while main scrolls.'),
      ex('AppShellBreakpoint', 'A later breakpoint folds the column in a wider frame.'),
      ex('AppShellFocusKey', 'Choosing a page moves focus to main.'),
    ],
    whenToUse: ['Frame every page of an app in the same header, column and footer.', 'Get the landmarks and a skip link without wiring them each time.'],
    whenNotToUse: [['Centring content at a reading width', 'Container'], ['A side column on its own', 'Sidebar'], ['A panel over the page', 'Drawer']],
    anatomy: [['Shell', 'surface.page, gap.inset between units and on all four sides.'], ['Header', 'A full-width slot; a Navbar fills it.'], ['Side column', 'A slot as wide as its Sidebar, at the inline start.'], ['Main', 'The page, in a main landmark with tabindex -1.'], ['Footer', 'An optional full-width slot in a footer landmark.'], ['Skip link', 'A VisuallyHidden focusable link, first in the tab order.']],
    states: [['Split', 'The column stands beside main.'], ['Folded', 'The column lives in a Drawer opened from Menu.'], ['Main focused', 'The system focus ring when the keyboard put focus there.']],
    content: ['Keep the skip link to a short imperative.', 'Name the Drawer and the Menu key with the same word.', 'Give each navigation landmark its own name.'],
    dodont: [
      { do: 'Use one shell per page and pass the pathname as focusKey.', dont: 'Nest shells, which doubles the skip links and main landmarks.' },
      { do: 'Let the shell measure its own width.', dont: 'Hide the column with a window media query of your own.' },
    ],
    a11y: ['The first stop is a skip link that shows as a key while focused.', 'Main is a landmark with tabindex -1 so it can take focus from code.', 'A route change moves focus to main and closes the Drawer.', 'The Drawer is a modal dialog: Tab stays inside, Escape closes, focus returns to Menu.', 'In forced colours the focus ring on main uses the system highlight colour.'],
    keyboard: [['Tab', 'Moves from the skip link through the header, column, main and footer', 'AppShell: the skip link is the first stop'], ['Enter', 'On the skip link, moves focus to main', 'AppShell: the skip link sends focus to main'], ['Escape', 'Closes the Drawer and returns focus to Menu', 'AppShell: the Menu key opens the Drawer that Escape closes']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/navbar', 'Navbar', 'The header unit.'], ['/components/sidebar', 'Sidebar', 'The side column.'], ['/components/drawer', 'Drawer', 'Holds the column when narrow.']],
  },
  {
    name: 'CommandPalette',
    slug: 'command-palette',
    status: 'beta',
    limitations: ['It filters by plain text: every typed word must appear in the label, section or keywords. There is no fuzzy match or ranking.', 'The shortcuts printed on the rows are hints. The palette does not listen for them; only its own chord opens it.', 'It has no nested pages and no recent-commands list; pass the commands you want shown.', 'The list is not virtualised, so keep it to a few hundred commands.'],
    youMust: ['Mount one palette near the root of the app, with one chord.', 'Start each command with a verb and give it a section.', 'Pass your own label, placeholder, emptyText and resultsText when the product is not in English.'],
    usage: '<CommandPalette\n  commands={[\n    { id: \'lamps-off\', label: \'Turn off all lamps\', section: \'Rooms\', onRun: () => lamps.off() },\n  ]}\n/>',
    backdrops: 'In light the sheet is warm-white plastic over a dark scrim with a recessed grey query window, in dark it is charcoal plastic. The lit row has a hairline plate and an ink dot, and nothing is orange.',
    purpose: 'Finds and runs a command by typing, from a sheet with a recessed query window and a printed list of commands.',
    importLine: "import { CommandPalette } from 'dial-react';",
    overview: (
      <>
        <p><code>CommandPalette</code> is a modal sheet on the native <code>dialog</code>. A recessed window takes the text, and the commands are printed under it in sections. Typing filters them, the arrow keys light one while focus stays in the field, and Enter runs it. The shortcut of each command is printed on keycaps at the end of its row.</p>
        <p>It opens with Ctrl or Cmd plus K (<code>hotkey</code>), from a <code>trigger</code> key, or from your own state with <code>open</code>. Escape closes it and focus returns to where it was.</p>
      </>
    ),
    hero: ex('CommandPaletteBasic', 'An open palette with five commands in two sections, shown in place.'),
    ladder: [
      ex('CommandPaletteTrigger', 'A key opens the sheet and gets focus back; the page also hears Ctrl or Cmd plus J.'),
      ex('CommandPaletteControlled', 'The page owns the open state and the text, and opens the palette with a query typed.'),
      ex('CommandPaletteStates', 'A row that cannot run, a command with no section, and a text that matches nothing.'),
      ex('CommandPaletteWords', 'Every built-in word passed in Thai, so the placeholder, the empty line and the announcement change.'),
    ],
    whenToUse: ['Give an app with many actions one place to find any of them by name.', 'Teach shortcuts by printing them beside the commands.'],
    whenNotToUse: [['Choosing one value for a field', 'Combobox'], ['A short list of actions on one element', 'Menu'], ['Asking one question about a device', 'Dialog']],
    anatomy: [['Sheet', 'A native dialog on elevation.float over surface.scrim, corner.panel.'], ['Query window', 'surface.sunken, elevation.well, corner.media, control.md tall.'], ['Section name', 'type.label in text.secondary.'], ['Command row', 'control.md tall, an ink dot, the name and a KbdCombo.']],
    states: [['Lit', 'A hairline plate, medium weight and the ink dot; aria-selected.'], ['Waiting', 'Secondary ink.'], ['Cannot run', 'Half opacity and skipped by the arrows; aria-disabled.'], ['No match', 'One line, also announced.']],
    content: ['Start with a verb and name the thing.', 'Print the section as a noun.', 'Add keywords for the words people might type instead.'],
    dodont: [
      { do: 'Write “Turn off all lamps” and add the keyword “light”.', dont: 'Write “Lamps” alone.' },
      { do: 'Keep one palette and one chord per page.', dont: 'Mount two palettes on Ctrl or Cmd plus K.' },
    ],
    a11y: ['The sheet is a native modal dialog: focus moves to the field, Tab stays there and the page behind is inert.', 'The field is a combobox that points at the list; the lit row is named by aria-activedescendant.', 'The number of matches is announced politely as the text changes.', 'Every row is at least 44px tall; the lit row is told by a plate, weight and a dot, not by colour.', 'In forced colours the sheet, window and lit row keep real borders.'],
    keyboard: [['Ctrl or Cmd + K', 'Opens and closes the palette', 'CommandPalette: opens from the chord and returns focus on close'], ['Arrow Down, Arrow Up', 'Lights the next or previous command and skips rows that cannot run', 'CommandPalette: the arrows move the lit row and skip rows that cannot run'], ['Enter', 'Runs the lit command and closes', 'CommandPalette: Enter runs the lit command and closes'], ['Escape', 'Closes the palette', 'CommandPalette: Escape closes and focus returns']],
    inherits: 'HTMLAttributes<HTMLDialogElement>',
    related: [['/components/dialog', 'Dialog', 'Asking one question about a device.'], ['/components/menu', 'Menu', 'A short list of actions on one element.'], ['/components/kbd', 'Kbd', 'The keycaps for the shortcuts.']],
  },
  {
    name: 'AuthForms',
    slug: 'auth-forms',
    status: 'beta',
    limitations: ['The forms do no network work: you sign in, create the account and send the mail yourself.', 'There are no social-login buttons and no one-time-code step; OTPFlow covers the code.', 'Fields are uncontrolled; read them in onSubmit.', 'ResetPasswordForm does not know a link has expired; show that with a Banner.'],
    youMust: ['Do the sign-in, the account creation or the mail in onSubmit, and return a promise so the key shows Sending.', 'Return { name: message } from onSubmit when your server says no.', 'Set sent on ResetPasswordForm once the link is out.', 'Pass every word in labels, messages, summaryTitle and sendingLabel when you translate.'],
    usage: '<SignInForm\n  remember\n  forgotHref="/reset"\n  alternateHref="/sign-up"\n  onSubmit={({ email, password }) => signIn(email, password)}\n/>',
    backdrops: 'In light the wells are light grey recesses in warm white plastic, in dark near-black recesses in charcoal. Text and links are ink in both, and the submit key is the one orange part.',
    purpose: 'Gives you the sign-in, sign-up and reset-password screens, with the right autocomplete words and one primary key.',
    importLine: "import { SignInForm, SignUpForm, ResetPasswordForm } from 'dial-react';",
    overview: (
      <>
        <p><code>SignInForm</code>, <code>SignUpForm</code> and <code>ResetPasswordForm</code> are built on Form, Input, PasswordInput, Button and Link. Each prints a heading, a line, the fields, and one foot row with a plain link at the start and the primary key at the end.</p>
        <p>Each calls <code>onSubmit(values)</code> once every field is right. A failed send shows Form’s summary window. The email and password fields carry the autocomplete words a password manager needs, and there are no social-login buttons.</p>
      </>
    ),
    hero: ex('AuthFormsSignIn', 'The sign-in form in a card, with remember-me and both links.'),
    ladder: [
      ex('AuthFormsSignUp', 'A name, an email and a new password typed twice.'),
      ex('AuthFormsReset', 'Ask for the email, then set sent when the link has gone out.'),
      ex('AuthFormsResetChoose', 'The page the reset link opens, with a ten character minimum.'),
      ex('AuthFormsServerError', 'Your check says no; the problem joins the summary. Only mika2026 passes.'),
      ex('AuthFormsTranslated', 'Every built-in word passed in German.'),
    ],
    whenToUse: ['A page or sheet where a person signs in, creates an account or asks for a new password.', 'A start screen where a password manager should fill the right fields.'],
    whenNotToUse: [['Your own set of fields', 'Form'], ['The code step after sign-in', 'OTPFlow']],
    anatomy: [['Title', 'Heading, level 3 by default.'], ['Description', 'type.caption in text.secondary.'], ['Fields', 'Input and PasswordInput wells, surface.sunken with elevation.well.'], ['Foot row', 'A standalone Link at the start and FormSubmit at the end.'], ['Alternate link', 'type.caption words and a standalone Link, 44px tall.'], ['Confirmation', 'A check glyph and a sentence that takes focus.']],
    states: [['Default', 'Empty fields and the key at full height.'], ['Problems', 'The summary window counts them and links to each field.'], ['Sending', 'The key says Sending and goes flat.'], ['Sent', 'A check and a sentence replace the reset fields.']],
    content: ['Name the screen with a verb and a noun.', 'Use the same verb on the key.', 'Keep the description to one sentence.'],
    dodont: [
      { do: 'Use one verb on the title and the key.', dont: 'Title it “Welcome!” and label the key “Go”.' },
      { do: 'Return the server’s problem from onSubmit.', dont: 'Show it in a toast that disappears.' },
    ],
    a11y: ['Each form is labelled by its title.', 'Fields keep their printed labels; no placeholder stands in for one.', 'A failed send moves focus to the summary and each name links to its field.', 'The confirmation takes focus so it is read out.', 'In forced colours text and the confirmation use the system colour.'],
    keyboard: [['Enter', 'Sends the form from any field', 'AuthForms: pressing Enter in a field sends the form to onSubmit'], ['Tab', 'Fields, then the link, then the key', 'AuthForms: autocomplete words are set on every field']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/form', 'Form', 'Your own fields with the same summary.'], ['/components/otp-flow', 'OTPFlow', 'The code step after sign-in.'], ['/components/password-input', 'PasswordInput', 'The password field alone.']],
  },
  {
    name: 'RichTextEditor',
    slug: 'rich-text-editor',
    status: 'beta',
    limitations: [
      'It has six formats only: bold, italic, link, bulleted list, numbered list and one heading level. There are no quotes, code, images, tables, colours or alignment.',
      'Bold and italic need a selection. A bare caret toggles nothing, so there is no typing-mode bold. Turning a format off removes the whole bold or italic run the selection touches.',
      'A list changes as a whole, nested lists are flattened into their item, and the heading key skips lists.',
      'Changes made with the keys are not on the browser undo stack, so Ctrl+Z cannot take back a bold or a list and may undo typing in an odd order.',
      'Empty paragraphs are dropped from the output, so blank lines do not survive. Several pasted paragraphs land after the current one, and dragging content in is refused.',
      'The sanitiser runs in the browser. Sanitise again on the server before you store or print the HTML.',
      'It was exercised in Chromium only. Thai or other IME composition, screen-reader output and Safari and Firefox selection behaviour were not tested.',
    ],
    youMust: [
      'Give it a label that names the note with a noun.',
      'Sanitise the HTML again on your server; the browser copy is not a security boundary.',
      'Pass `words` and `placeholder` in the language of the page.',
      'Set `error` yourself when the note is not acceptable.',
    ],
    usage: '<RichTextEditor label="Handover note" defaultValue="<p>Keep the <strong>hall</strong> at 18.</p>" onChange={save} />',
    backdrops: 'In light the well is a light grey recess in warm white plastic and the keys are body-coloured discs. In dark the well is near-black on charcoal. A latched key is frosted glass in the neutral range in both, and nothing is orange.',
    purpose: 'Writes a short formatted note in a recessed well, with round keys above it, and reports clean HTML.',
    importLine: "import { RichTextEditor } from 'dial-react';",
    overview: (
      <>
        <p><code>RichTextEditor</code> is a label, a row of six 44px round keys, and a writing well. The keys are bold, italic, link, bulleted list, numbered list and heading. The row is a toolbar with one Tab stop, and Ctrl or Command with B, I and K work inside the text. A key whose format is on at the caret drops and turns to glass.</p>
        <p><code>onChange</code> receives a string of HTML cleaned by a built-in whitelist: <code>p</code>, <code>h2</code>, <code>strong</code>, <code>em</code>, <code>a</code> with a safe address, <code>ul</code>, <code>ol</code>, <code>li</code> and <code>br</code>. Pasted text goes through the same list. Formatting is done with the Selection and Range APIs, with no editing library.</p>
      </>
    ),
    hero: ex('RichTextEditorBasic', 'A note with a heading, a bold word, an italic word and a list.'),
    ladder: [
      ex('RichTextEditorEmpty', 'An empty editor keeps its height.'),
      ex('RichTextEditorControlled', 'The value is yours; onChange gets the clean HTML string.'),
      ex('RichTextEditorStates', 'Empty, invalid, read-only and disabled.'),
      ex('RichTextEditorInForm', 'Inside a native form, with the one orange key.'),
      ex('RichTextEditorThai', 'Thai text and Thai words for the keys.'),
    ],
    whenToUse: ['Write a note or description that needs bold, links or a short list.', 'Store the result as a small HTML string.'],
    whenNotToUse: [['Plain text of several lines', 'Textarea'], ['One short value corrected in place', 'Editable'], ['Separate short tags', 'TagInput']],
    anatomy: [['Label', 'type.label in type.weight-medium, printed above the keys.'], ['Toolbar', 'Six IconButtons at control.key, one Tab stop.'], ['Latched key', 'IconButton with aria-pressed, in the neutral glass range.'], ['Well', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Link field', 'An Input and three Buttons under the keys, shown while a link is set.']],
    states: [['Empty', 'The prompt in secondary ink.'], ['Latched key', 'A key whose format is on at the caret.'], ['Invalid', 'Critical red edge, a glyph and the message.'], ['Read-only', 'Full ink, no keys.'], ['Disabled', 'Half ink, keys off.']],
    content: ['Name the note with a noun.', 'Use the hint for what to write.', 'Keep the key words short; the marks are one or two letters.'],
    dodont: [
      { do: 'Label it with a noun such as Handover note.', dont: 'Label it “Type here”.' },
      { do: 'Sanitise the HTML on the server too.', dont: 'Print the stored string without checking it.' },
    ],
    a11y: ['The writing area is a multi-line textbox named by the label and described by the hint and the error.', 'The toolbar is named, has one Tab stop, and each key is named in words, not by its mark.', 'A key that is on is announced as pressed and drawn as a latched glass key, so colour is not the only cue.', 'The keys announce their shortcuts with aria-keyshortcuts.', 'In forced colours the well keeps a real border, links keep an underline and the focus rings use the highlight colour.'],
    keyboard: [
      ['Tab', 'Reaches the toolbar as one stop, then the writing area', 'RichTextEditor: the toolbar is one tab stop and the arrow keys, Home and End move along its keys'],
      ['Arrow keys, Home, End', 'Move along the keys; the arrows follow the reading direction', 'RichTextEditor: the toolbar is one tab stop and the arrow keys, Home and End move along its keys'],
      ['Ctrl or Command + B, I', 'Bold or italic on the selected text', 'RichTextEditor: Ctrl+B and the bold key wrap and unwrap the selection in strong'],
      ['Ctrl or Command + K', 'Opens the address field; Enter applies, Escape returns to the text', 'RichTextEditor: Ctrl+K opens the address field, a bad address is refused and Escape returns to the text'],
    ],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/textarea', 'Textarea', 'Plain text of several lines.'], ['/components/editable', 'Editable', 'One short value corrected in place.'], ['/components/tag-input', 'TagInput', 'Separate short tags.']],
  },
  {
    name: 'LineChart',
    slug: 'line-chart',
    status: 'beta',
    limitations: ['Points are evenly spaced names, not a time scale; a gap in time shows as an even step.', 'Every series needs a value for every point; missing points are not drawn.', 'One to three lines. A fourth is ignored, because patterns and marks run out before the reader does.', 'No zoom, no brush and no animation of the lines.'],
    youMust: ['Pass the same number of values in every series as there are categories.', 'Name the chart and every line with a short noun.', 'Pass the unit in unit and not in the names.', 'Keep it away from the orange key.'],
    usage: '<LineChart\n  label="Temperature this week"\n  unit="°C"\n  categories={["Mon", "Tue", "Wed"]}\n  series={[\n    { label: "Indoor", values: [20.5, 21, 21.5] },\n    { label: "Outdoor", values: [8, 6, 9] },\n  ]}\n/>',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. The lines, marks and numerals are ink in both, the grid is the ring line, and nothing is orange.',
    purpose: 'Draws one to three lines in a recessed window with round ticks, a keyboard cursor with a readout, and a data table for assistive tech.',
    importLine: "import { LineChart } from 'dial-react';",
    overview: (
      <>
        <p><code>LineChart</code> draws each series as a two pixel ink line with a hollow mark on every point. Series are told apart by stroke (solid, dashed, dotted) and by mark (circle, square, diamond), and a legend prints both. The value axis uses round numbers. The window is one Tab stop: the arrow keys walk a cursor from point to point and the line under the window says what it is on. A data table with the same numbers sits after it for screen readers. Size, <code>zero</code>, <code>min</code>, <code>max</code> and <code>index</code> are props.</p>
      </>
    ),
    hero: ex('LineChartBasic', 'Indoor temperature over a week.'),
    ladder: [
      ex('LineChartSeries', 'Three lines told apart by stroke and mark.'),
      ex('LineChartSizes', 'The window at small, medium and large.'),
      ex('LineChartAxis', 'The axis fitted, started at zero and fixed to a range.'),
      ex('LineChartControlled', 'The cursor held by your state and printed beside the chart.'),
      ex('LineChartInUnit', 'A small chart under a Stat, with the orange key apart.'),
    ],
    whenToUse: ['Show how a reading changed across evenly spaced points.', 'Compare two or three readings in the same unit.', 'Let a person find the value at one point with the keyboard.'],
    whenNotToUse: [['A trend inside a row or a sentence', 'Sparkline'], ['One figure and its change', 'Stat'], ['A level in a range with regions', 'Meter']],
    anatomy: [['Name', 'type.caption in type.weight-regular, with the print seat.'], ['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Grid and ticks', 'line.ring hairlines and type.caption numerals in text.secondary, tabular.'], ['Line and marks', 'width.ring in text.primary; a hollow mark per point.'], ['Cursor', 'A width.hairline rule in text.primary and marks drawn larger.'], ['Readout', 'type.caption, tabular, polite status.'], ['Legend', 'A drawn sample and a name per line.']],
    states: [['Idle', 'No cursor and the key hint in text.secondary.'], ['Cursor on a point', 'A rule through the point, larger marks and the readout of every value.'], ['Focus', 'A width.ring ring around the window.']],
    content: ['Name the chart with a noun and a period.', 'Give every point a short name.', 'Name each line with one word.'],
    dodont: [
      { do: 'Tell lines apart by stroke and mark.', dont: 'Tell them apart by hue.' },
      { do: 'Start the axis at zero when the distance from nothing matters.', dont: 'Fit the axis to a rise from six to twelve and call it a climb.' },
    ],
    a11y: ['The window is a group with a role description, a name and a summary of every line.', 'It is one Tab stop; Left and Right arrows, Home, End and Escape move the cursor.', 'The readout is a polite status that speaks only when the keys moved the cursor.', 'The drawing is hidden from assistive tech and a real table carries the numbers.', 'Series differ by stroke and mark, so the chart works in greyscale.', 'In forced colours the window, lines and numerals take the text colour.'],
    keyboard: [['Tab', 'Moves focus onto the window; the cursor goes to the last point', 'LineChart: a group named by the chart, with its summary and the key hint'], ['Arrow Left, Arrow Right', 'Moves the cursor to the previous or next point', 'LineChart: the readout speaks the point and every value'], ['Home, End', 'Moves the cursor to the first or last point', 'LineChart: the readout speaks the point and every value'], ['Escape', 'Lets go of the cursor', 'LineChart: the readout returns to the key hint']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/sparkline', 'Sparkline', 'A tiny trend without axes.'], ['/components/stat', 'Stat', 'One figure with its change.'], ['/components/meter', 'Meter', 'A level on a printed scale.']],
  },
  {
    name: 'Sparkline',
    slug: 'sparkline',
    status: 'beta',
    limitations: ['It has no axes, no ticks and no way to read a single point; use LineChart for that.', 'It draws one line. Two readings are two Sparklines.', 'Readings are evenly spaced; a gap in time shows as an even step.', 'The dot marks the last reading only; there is no min or max marker.'],
    youMust: ['Pass the readings oldest first.', 'Write a label that names the reading and the period.', 'Pass the same min and max to every Sparkline in a column you want to compare.', 'Keep it away from the orange key.'],
    usage: '<Sparkline label="Power, last 7 days" unit="kW" values={[0.4, 0.5, 2.2, 2, 0.9, 1.2, 1.8]} />\n<Sparkline showValue size="lg" label="Solar, last 7 days" unit="kWh" values={[6.5, 6, 4.1, 3.2, 2, 0.6, 0.2]} />',
    backdrops: 'The line and the dot are ink on the plastic in both themes, with no fill under the line, and nothing is orange.',
    purpose: 'Draws a trend small enough for a line of text: one ink line with a solid dot on the last reading.',
    importLine: "import { Sparkline } from 'dial-react';",
    overview: (
      <>
        <p><code>Sparkline</code> draws its <code>values</code>, oldest first, as a two pixel ink line scaled to its block, with a solid dot on the last one. It is an image with a text name: the label, then the number of readings, whether the run rose or fell, the first and last values, and the low and high. <code>showValue</code> prints the last value after the line. With no values it prints a flat rule in the same block. It is not a control.</p>
      </>
    ),
    hero: ex('SparklineBasic', 'A week of power use.'),
    ladder: [
      ex('SparklineSizes', 'The line at small, medium and large.'),
      ex('SparklineValue', 'The last value printed after the line.'),
      ex('SparklineScale', 'Three rows on one scale, from 0 to 100.'),
      ex('SparklineEmpty', 'A sensor with no readings keeps its block.'),
      ex('SparklineInText', 'A small line in a sentence, beside a Stat.'),
    ],
    whenToUse: ['Show the shape of a reading inside a row, a list or a cell.', 'Put a trend next to a figure in a Stat.', 'Compare the shape of several readings on one scale.'],
    whenNotToUse: [['A trend that needs axes or single points', 'LineChart'], ['One figure and its change', 'Stat'], ['A level in a range with regions', 'Meter']],
    anatomy: [['Line', 'width.ring in text.primary, round joins, no fill.'], ['Dot', 'size.mark, solid text.primary, placed on the last reading.'], ['Value', 'type.label in type.weight-medium, tabular numerals.']],
    states: [['Readings', 'A line and a solid dot on the last reading.'], ['No readings', 'A flat rule in line.ring, announced as No readings.'], ['With value', 'The last value after the line.']],
    content: ['Name the reading and the period.', 'Do not write trend or chart in the label.', 'Pass the unit in its own prop.'],
    dodont: [
      { do: 'Tell rising and falling in the label text and by where the line ends.', dont: 'Tell them with a green line and a red line.' },
      { do: 'Pass one min and max to a column of rows.', dont: 'Let each row fill its own block and compare their heights.' },
    ],
    a11y: ['The root is an image whose name is the label and a sentence built from the readings.', 'It takes no focus and has no tooltip.', 'The printed value is hidden from assistive tech because the name already carries it.', 'The dot is a shape, so the end of the line shows in greyscale.', 'In forced colours the line and the dot take the text colour.'],
    keyboard: [['Tab', 'Does not stop on a Sparkline', 'Sparkline: an image named by its label and the readings, with no focusable part']],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/line-chart', 'LineChart', 'A trend with axes and a cursor.'], ['/components/stat', 'Stat', 'One figure with its change.'], ['/components/meter', 'Meter', 'A level on a printed scale.']],
  },
  {
    name: 'BarChart',
    slug: 'bar-chart',
    status: 'beta',
    limitations: ['It draws bars from zero; negative values draw as zero.', 'It has no stacked bars, no lines and no zoom.', 'Values that do not fit the width of a bar are left to the readout and the table.', 'The axis ticks are round numbers up to the largest value, and cannot be set one by one.'],
    youMust: ['Pass one value for each category in every series, in the same order.', 'Name the chart in label, because the label is its accessible name.', 'Keep the chart in a column wide enough to print its values, about 300px.'],
    usage: '<BarChart\n  label="Energy by day"\n  categories={[\'Mon\', \'Tue\']}\n  series={[{ name: \'Heating\', values: [12, 18] }]}\n/>',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. Bars, scale and numbers are ink in both, and nothing is orange.',
    purpose: 'Compares values across named categories as patterned bars on a ruled scale, with every value printed and a table behind it.',
    importLine: "import { BarChart } from 'dial-react';",
    overview: (
      <>
        <p><code>BarChart</code> draws bars in a recessed window with a ruled scale. Each series has its own pattern, so the series are told apart without colour, and each bar prints its number when it fits. <code>orientation</code> is <code>vertical</code> or <code>horizontal</code>. A line under the window reads out the bar the arrow keys are on, and a hidden table lists every value.</p>
      </>
    ),
    hero: ex('BarChartBasic', 'Two series over four days, each in its own pattern.'),
    ladder: [
      ex('BarChartHorizontal', 'Rows with long names and the value at the end of each bar.'),
      ex('BarChartSingle', 'One series over a week, so there is no legend.'),
      ex('BarChartInUnit', 'A chart on a unit body with the orange key apart from it.'),
      ex('BarChartMonths', 'Twelve categories in a narrow column, where the numbers move to the readout.'),
    ],
    whenToUse: ['Compare a number across two to twelve named categories.', 'Compare two or three series over the same categories.'],
    whenNotToUse: [['One level in a range', 'Meter'], ['The parts of one whole', 'PieChart']],
    anatomy: [['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Scale', 'type.caption in text.secondary, with dashed gridlines in line.ring.'], ['Bar', 'A rectangle outlined in text.primary and filled with an ink pattern.'], ['Value', 'type.caption in type.weight-medium, tabular numerals.'], ['Legend', 'A pattern swatch and the series name, type.caption.'], ['Readout', 'type.caption, a polite live region.']],
    states: [['Idle', 'The key hint in text.secondary.'], ['Active bar', 'A width.ring outline, and a focus ring round the bar when the keyboard is on it.'], ['Zero value', 'No bar height; the value prints as 0.']],
    content: ['Name the chart for what it measures and the span.', 'Keep category names to one short word.', 'Pass the unit in formatValue.'],
    dodont: [
      { do: 'Tell the series apart by pattern and a legend.', dont: 'Tell them apart by colour alone.' },
      { do: 'Print the value on the bar.', dont: 'Make the reader find it on the scale.' },
    ],
    a11y: ['The chart is one tab stop, named by its title, with a role description of Bar chart.', 'The arrow keys move between bars, and Home and End go to the first and last category.', 'The readout is a polite live region that says the category, the series and the value.', 'A visually hidden table holds every value for screen readers.', 'In forced colours the window, bars and patterns use system colours.'],
    keyboard: [
      ['Tab', 'Enters the chart as one stop', 'BarChart: the chart is one tab stop and the first bar becomes active'],
      ['Arrow keys', 'Move between bars', 'BarChart: the arrow keys move the active bar and the readout names it'],
      ['Home, End', 'First and last category', 'BarChart: Home and End reach the first and the last category'],
    ],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/pie-chart', 'PieChart', 'The parts of one whole.'], ['/components/meter', 'Meter', 'One level on a printed scale.']],
  },
  {
    name: 'PieChart',
    slug: 'pie-chart',
    status: 'beta',
    limitations: ['It shows one whole; two wholes are two charts.', 'Six patterns exist, so a chart of more than six parts repeats them.', 'Parts of zero or less get no slice, but keep a legend row and a table row.', 'It does not group small parts into Other; do that before you pass the data.', 'In a window narrower than about 440px the labels beside the ring shrink to the share, and the legend carries the names.'],
    youMust: ['Pass the parts in the order they should run clockwise from the top, largest first.', 'Name the chart in label, because the label is its accessible name.', 'Keep the chart in a column wide enough for the names on both sides, about 300px.'],
    usage: '<PieChart\n  label="Heating by room"\n  slices={[{ name: \'Living room\', value: 380 }, { name: \'Bedrooms\', value: 240 }]}\n/>',
    backdrops: 'In light the window is a light grey recess in warm white plastic, in dark a near-black recess in charcoal. Slices, lines and words are ink in both, and nothing is orange.',
    purpose: 'Shows how one whole divides into parts as patterned slices of a ring or a disc, each with its name and share printed, a legend of names and a table behind it.',
    importLine: "import { PieChart } from 'dial-react';",
    overview: (
      <>
        <p><code>PieChart</code> draws the parts clockwise from the top in a recessed window. <code>variant</code> is <code>donut</code>, which prints the total in the hole, or <code>pie</code>. Each part has its own pattern, a name and share on a leader line, and a 44px row in the legend. A line under the window reads out the slice the arrow keys are on, and a hidden table lists every value and share.</p>
      </>
    ),
    hero: ex('PieChartBasic', 'Five rooms in a donut, each on its own pattern.'),
    ladder: [
      ex('PieChartWhole', 'A whole disc of three parts, with no hole.'),
      ex('PieChartTwoParts', 'A share, with the figure and caption in the hole set by hand.'),
      ex('PieChartInUnit', 'A donut on a unit body with the orange key apart from it.'),
      ex('PieChartWords', 'The built-in words and the share format replaced, in German.'),
    ],
    whenToUse: ['Show how one whole splits into two to six named parts.', 'Show a share, such as how much of a battery is charged.'],
    whenNotToUse: [['Values across categories', 'BarChart'], ['One level in a range', 'Meter']],
    anatomy: [['Window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring.'], ['Slice', 'A ring segment outlined in text.primary and filled with an ink pattern.'], ['Leader', 'A hairline in text.secondary with one bend.'], ['Name', 'type.caption in type.weight-regular, tabular numerals.'], ['Total', 'type.label in type.weight-medium, with a type.micro caption.'], ['Legend', 'A pattern swatch, the name, and the value and share; each row control.md tall.'], ['Readout', 'type.caption, a polite live region.']],
    states: [['Idle', 'The key hint in text.secondary.'], ['Active slice', 'A width.ring outline, a ring round it with the keyboard, and its legend row in medium weight.'], ['Zero part', 'No slice and no label; the legend and table rows stay.']],
    content: ['Name the chart for the whole and the split.', 'Name each part with a short noun.', 'Pass the unit in formatValue.'],
    dodont: [
      { do: 'Keep to six parts and order them largest first.', dont: 'Pour twelve months into one ring.' },
      { do: 'Tell the parts apart by pattern and a printed name.', dont: 'Tell them apart by colour alone.' },
    ],
    a11y: ['The chart is one tab stop, named by its title, with a role description of Pie chart.', 'The arrow keys move between slices, and Home and End go to the first and last.', 'The readout is a polite live region that says the name, the value and the share.', 'A visually hidden table holds every value and share for screen readers.', 'In forced colours the window, slices and patterns use system colours.'],
    keyboard: [
      ['Tab', 'Enters the chart as one stop', 'PieChart: the chart is one tab stop and the first slice becomes active'],
      ['Arrow keys', 'Move between slices', 'PieChart: the arrow keys move the active slice and the readout names it'],
      ['Home, End', 'First and last slice', 'PieChart: Home and End reach the first and the last slice'],
    ],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/bar-chart', 'BarChart', 'Values across categories.'], ['/components/meter', 'Meter', 'One level on a printed scale.']],
  },
  {
    name: 'SettingsLayout',
    slug: 'settings-layout',
    status: 'beta',
    limitations: ['It lays out rows and does not save them; keep the values and the Save key in your own code.', 'A row holds one name and one part; there is no row with two parts.', 'The part drops under its name by width alone, so there is no prop to force a stacked row.'],
    youMust: ['Give every part its row name through aria-labelledby, using the ids the row passes to a function child.', 'Disable the part yourself when you set disabled on a row.', 'Set titleLevel to 2 when the page already has an h1.'],
    usage: '<SettingsLayout title="Fan">\n  <SettingsSection heading="Speed">\n    <SettingsRow label="Oscillate" description="Turns side to side.">\n      {({ labelId }) => <Switch aria-labelledby={labelId} />}\n    </SettingsRow>\n  </SettingsSection>\n</SettingsLayout>',
    backdrops: 'In light the boxes are hairlines in ring ink on warm white plastic, in dark the same hairlines on charcoal. There is no fill and nothing is orange.',
    purpose: 'Frames a settings page as a titled column of sections, each a printed box of rows with a name and its part.',
    importLine: "import { SettingsLayout, SettingsSection, SettingsRow } from 'dial-react';",
    overview: (
      <>
        <p><code>SettingsLayout</code> prints the page title and holds the sections. Each <code>SettingsSection</code> is a region named by its heading, with a hairline box of rows under it. Each <code>SettingsRow</code> prints a name and small print on the start side and the part that sets the value on the end side. A seam parts one row from the next.</p>
        <p>A row wraps. On a narrow unit the part drops under its name and keeps its size. A function child receives <code>labelId</code> and <code>descriptionId</code>, so the part can name itself from the row.</p>
      </>
    ),
    hero: ex('SettingsLayoutBasic', 'Two sections of rows, a select and switches on the end side.'),
    ladder: [
      ex('SettingsLayoutNarrow', 'In a narrow unit the select drops under its name.'),
      ex('SettingsLayoutFields', 'A text field named by its row and tied to its small print.'),
      ex('SettingsLayoutDisabled', 'A disabled row fades its name while its switch is switched off.'),
      ex('SettingsLayoutIntro', 'Small print under the title and the section heading, and the orange key last.'),
    ],
    whenToUse: ['Lay out a page of settings that each have a name and one part.', 'Keep a long list of settings in named sections.', 'Pair a switch or a select with a line of small print.'],
    whenNotToUse: [['A few related controls in one form', 'Fieldset'], ['Facts that cannot be changed', 'DescriptionList'], ['Numbered sections of a form', 'Stepper']],
    anatomy: [['Title', 'Heading at titleLevel, type.title or larger in primary ink.'], ['Section heading', 'Heading one level below the title, above the box.'], ['Box', 'width.hairline in line.ring, corner.media, no fill, no shadow.'], ['Row', 'A wrapping flex row at least layout.touch tall.'], ['Seam', 'A decorative Divider above every row after the first.'], ['Name and small print', 'type.body and type.caption in secondary ink.']],
    states: [['Default', 'A name, small print and a part.'], ['Disabled', 'The name and small print fade; disable the part yourself.'], ['Narrow', 'The part drops under its name.']],
    content: ['Name a section with a noun.', 'Name a row with the thing it sets.', 'Keep small print to one sentence.'],
    dodont: [
      { do: 'Name the row Night mode and put the rule in the small print.', dont: 'Name the row Click to turn night mode on.' },
      { do: 'Tie the part to its row with aria-labelledby.', dont: 'Leave a switch with no name beside a visible label.' },
    ],
    a11y: ['The layout and each section are regions named by their headings.', 'Rows are list items, so the count is read out.', 'A row hands label and description ids to the part for aria-labelledby and aria-describedby.', 'In forced colours each box keeps a real border in the text colour.'],
    keyboard: [['Tab', 'Moves through the parts in the rows', 'SettingsLayout: the layout takes no focus and each part keeps its own keys']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/fieldset', 'Fieldset', 'A printed box round a few controls.'], ['/components/divider', 'Divider', 'The seam between two rows.'], ['/components/switch', 'Switch', 'The usual part at the end of a row.']],
  },
  {
    name: 'Feed',
    slug: 'feed',
    status: 'beta',
    limitations: ['Posts hold text and inline content only; there is no built-in media, reactions or comment thread.', 'FeedItem elements must be direct children of Feed, not wrapped in a fragment or another component, or they get no position.', 'Ctrl+Home and Ctrl+End from the APG pattern are not added; Tab leaves the feed.', 'The end watcher needs IntersectionObserver; where it is missing, only the load more key and Page Down load more.', 'Posts are not windowed, so a feed of thousands of posts should drop old ones or use VirtualList.', 'The notice covers the top post while it shows, because it must not push the list down.'],
    youMust: ['Give the Feed a label, because it is a landmark of articles.', 'Set busy while a page loads, and keep hasMore true until the last page is in.', 'Add new posts to the list only in onShowNew, so the reader’s place does not move.', 'Pass total when you know the size of the set, so the position is read as 3 of 40.'],
    usage: '<Feed label="Activity" hasMore={more} busy={busy} onNearEnd={loadNext}>\n  <FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem>\n</Feed>',
    backdrops: 'In light the posts are grey ink on warm white plastic with a seam between them and the avatars in light grey recesses. In dark they are light ink on charcoal. The ring is dark ink in both and nothing is orange.',
    purpose: 'Prints a growing run of posts that loads more at the end, follows the WAI-ARIA feed pattern and never moves what is being read.',
    importLine: "import { Feed, FeedItem } from 'dial-react';",
    overview: (
      <>
        <p><code>Feed</code> is a list of articles. Each <code>FeedItem</code> prints an avatar window, the author’s <code>name</code> and <code>time</code> on one line, and its text under them. Feed gives each post its <code>aria-posinset</code> and <code>aria-setsize</code> from the order of its children.</p>
        <p>Page Down and Page Up move focus from post to post. <code>onNearEnd</code> fires when the end of the list scrolls into view, and the load more key does the same job for people who do not scroll. While <code>busy</code> is true the feed is <code>aria-busy</code>. <code>newCount</code> hangs a notice from the top edge without moving any post.</p>
      </>
    ),
    hero: ex('FeedBasic', 'Three posts, then the printed end line.'),
    ladder: [
      ex('FeedLoadMore', 'The load more key adds a page; the footer shows the loading mark while it waits.'),
      ex('FeedNewPosts', 'Two posts wait above; the notice puts them in front of the list when pressed.'),
      ex('FeedBusy', 'busy marks the feed aria-busy and swaps the key for a loading mark.'),
      ex('FeedNearEnd', 'Inside a short scrolling box, reaching the end asks for the next page.'),
    ],
    whenToUse: ['Show a log or stream of posts that grows at the end.', 'Let keyboard users move through a long run post by post.'],
    whenNotToUse: [['A fixed list of rows to choose from', 'List'], ['Thousands of equal rows', 'VirtualList'], ['Events along a rail', 'Timeline']],
    anatomy: [['Avatar window', 'Avatar md, control.md square, surface.sunken, elevation.well.'], ['Name', 'type.label in type.weight-medium, text.primary.'], ['Time', 'type.caption in text.secondary with tabular figures.'], ['Text', 'type.body with type.leading-body.'], ['Seam', 'A Divider, line.divider over the lit edge.'], ['Footer', 'control.md tall, holds the key, the Spinner or the end line.'], ['Notice', 'A Button key on a zero-height sticky line, layer.sticky.']],
    states: [['Focused post', 'A ring outline, width.ring in focus.ring.'], ['Busy', 'aria-busy on the feed and a Spinner in the footer.'], ['Has more', 'The load more key in the footer.'], ['New posts', 'The notice key, announced politely.'], ['End', 'A printed end line.']],
    content: ['Put the author in name and the time in time, not in the text.', 'Write each post so it reads alone.', 'Keep the notice words short, such as 3 new posts.'],
    dodont: [
      { do: 'Add new posts when the person presses the notice.', dont: 'Insert posts above the reader as they arrive.' },
      { do: 'Offer the load more key beside the scroll trigger.', dont: 'Load only on scroll.' },
    ],
    a11y: ['The list has role feed and a label, and is aria-busy while loading.', 'Each post is an article with aria-posinset and aria-setsize, named by its author and time and described by its text.', 'Page Down and Page Up move between posts; Tab reaches each post and the keys.', 'The notice is a polite live region, and the load more key and notice key are 44px.', 'Under Reduce motion the notice appears and leaves at once; in forced colours the focus outline uses the system highlight.'],
    keyboard: [['Page Down', 'Moves focus to the next post, or loads more from the last', 'Feed: Page Down and Page Up move between posts'], ['Page Up', 'Moves focus to the previous post', 'Feed: Page Down and Page Up move between posts'], ['Tab', 'Reaches each post, then the load more key', 'Feed: every post is a labelled article with its position']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/list', 'List', 'A fixed list of rows to choose from.'], ['/components/virtual-list', 'VirtualList', 'Thousands of equal rows in a window.'], ['/components/timeline', 'Timeline', 'Events along a rail.']],
  },
  {
    name: 'Onboarding',
    slug: 'onboarding',
    status: 'beta',
    limitations: ['It never scrolls the page; a part that is off screen leaves the panel at the nearest screen edge.', 'It points at one part per step, by id, element or ref; it cannot mark a group of parts.', 'A step whose part is not on the page is passed over, but it still counts in the "n of N" count.', 'It does not remember that a tour was seen; save that in onDone.'],
    youMust: ['Start the tour only when the parts it points at are on the page.', 'Save the answer in onDone so the tour is not offered on every visit.', 'Pass your own words (backLabel, nextLabel, doneLabel, skipLabel, formatCount) when the product is not in English.', 'Keep a tour to three to six steps.'],
    usage: '<Onboarding\n  open={open}\n  onOpenChange={setOpen}\n  onDone={({ reason }) => save(reason)}\n  steps={[\n    { target: "heat", title: "Heating", text: "Turns the radiator on or off." },\n    { target: "lamp", title: "Lamp", text: "Dims the lamp." },\n  ]}\n/>',
    backdrops: 'In light the callout is warm-white plastic with a short soft shadow, in dark it is charcoal plastic. The ring is full ink in both and the page is not dimmed. Nothing is orange.',
    purpose: 'Walks a person through the parts of a screen with a ring round each part and a small callout beside it.',
    importLine: "import { Onboarding, CoachMark } from 'dial-react';",
    overview: (
      <>
        <p><code>Onboarding</code> runs a tour. For each step it draws a full-ink ring round one part and opens a plastic callout beside it with the step count, a title, a line of text and Skip, Back and Next keys. <code>CoachMark</code> is a single ring and callout, for a hint that is not part of a tour.</p>
        <p>The page is not dimmed or scrolled. Focus moves to each callout, Escape ends the tour, and focus goes back to the part that was marked. <code>onDone</code> tells your code how it ended.</p>
      </>
    ),
    hero: ex('OnboardingBasic', 'A three-step tour of a row of keys, started by a key.'),
    ladder: [
      ex('OnboardingDone', 'onDone saves how the tour ended and the page prints it.'),
      ex('OnboardingControlled', 'The page opens the tour on one part through stepIndex.'),
      ex('OnboardingCoachMark', 'A single CoachMark above a key, outside a tour.'),
      ex('OnboardingThai', 'Thai text and your own words for the keys and the count.'),
    ],
    whenToUse: ['Show a first-time visitor what three to six parts of a screen do.', 'Announce one new part with a single CoachMark.'],
    whenNotToUse: [['One note on a reading the person asked about', 'Popover'], ['Steps the person must finish to reach a result', 'Wizard'], ['A short label on hover or focus', 'Tooltip']],
    anatomy: [['Ring', 'A full-ink stroke, width.ring, round the part. It takes no press.'], ['Panel', 'surface.solid, elevation.float, corner.inner, layer.overlay, at most layout.frame-sm wide.'], ['Count', 'type.caption in tabular figures, as in 2 of 5.'], ['Title and text', 'type.emphasis in type.weight-medium, then type.body in secondary ink.'], ['Keys', 'Skip at the start, Back and Next at the end, each 44px.']],
    states: [['Closed', 'Nothing is drawn.'], ['Open', 'The ring and panel fade in and the panel rises off the part.'], ['First step', 'Back is drawn and disabled.'], ['Last step', 'Next reads Done and Skip is left out.'], ['Closing', 'The ring and panel fade, the panel sinks back, hidden from assistive tech.']],
    content: ['Title each step with the name of the part.', 'Write one or two short sentences.', 'Leave the count to the panel.'],
    dodont: [
      { do: 'Title the step "Heating" and say what the key does.', dont: 'Title it "Click here".' },
      { do: 'Save the answer in onDone and offer the tour once.', dont: 'Start the tour on every visit.' },
    ],
    a11y: ['The callout is a dialog named by its title and described by the count and the text.', 'Focus moves to the callout when a step opens and returns to the marked part when the tour ends.', 'Escape ends the tour.', 'The ring is hidden from assistive tech; the count is read from the callout.', 'In forced colours the panel keeps a real border and the ring uses the text colour.', 'Under Reduce motion only a fade remains.'],
    keyboard: [['Tab', 'Moves through Skip, Back and Next; past either end it hands focus to the marked part', 'Onboarding: Tab past either end of the panel hands focus to the part, and every key is at least the touch target'], ['Enter / Space', 'Presses the focused key', 'Onboarding: Next walks the steps, the last step reads Done, and Done hands focus back to the part without scrolling'], ['Escape', 'Ends the tour and returns focus to the marked part', 'Onboarding: Escape ends the tour and returns focus to the marked part']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/popover', 'Popover', 'One note on a reading the person asked about.'], ['/components/wizard', 'Wizard', 'Steps the person must finish.'], ['/components/tooltip', 'Tooltip', 'A short label on hover or focus.']],
  },
  {
    name: 'NotificationCenter',
    slug: 'notification-center',
    status: 'beta',
    limitations: ['It is the list only; it has no button that opens it. Open it in a Popover or a Drawer and put the count badge on your own key.', 'It groups by the day you give each line and does not sort; pass the lines newest first.', 'Mark as read and dismiss are keys; there is no swipe.', 'A wrapper component around NotificationItem hides its day from the center, so write the items directly.'],
    youMust: ['Give every NotificationItem a stable id and a plain-text title.', 'Pass the lines newest first, with the same day on lines that belong together.', 'Pass onReadChange or onDismiss only when you keep that state yourself.', 'Translate the built-in words with the words prop.'],
    usage: '<NotificationCenter>\n  <NotificationItem id="washer" day="Today" title="Washer finished" time="22:40" unread>Laundry room</NotificationItem>\n  <NotificationItem id="door" day="Yesterday" title="Front door locked" time="23:10">Hall</NotificationItem>\n</NotificationCenter>',
    backdrops: 'In light the unread lines are dark ink with a filled lamp and the read lines are grey ink with a ring, on warm white plastic. In dark the same shapes are light ink on charcoal. Nothing is orange.',
    purpose: 'Lists notifications by day with a lamp for unread, mark-as-read and dismiss keys, Mark all read and a polite announcement of new lines.',
    importLine: "import { NotificationCenter, NotificationItem } from 'dial-react';",
    overview: (
      <>
        <p><code>NotificationCenter</code> is a log of what the home has said. Each <code>NotificationItem</code> prints a title, a line of detail and a time under a day heading. An unread line has a filled lamp and a medium title. A read line has an empty ring and a regular title. Colour is a third cue and never the only one.</p>
        <p>Each line has a mark-as-read key and a dismiss key, both 44px. The header holds a count of unread lines and a Mark all read key. When nothing is left the center shows an <code>EmptyState</code>. A hidden region announces a new line when it arrives. The center is built from List, Badge, IconButton, Button and EmptyState.</p>
      </>
    ),
    hero: ex('NotificationCenterBasic', 'Four lines in two days, three unread, each with a mark-as-read key and a dismiss key.'),
    ladder: [
      ex('NotificationCenterControlled', 'onReadChange and onDismiss make read state and removal yours.'),
      ex('NotificationCenterArrivals', 'A new line at the top is announced once and counted in the header.'),
      ex('NotificationCenterEmpty', 'With no lines the center shows an EmptyState.'),
      ex('NotificationCenterTranslated', 'words rewrites every built-in phrase and headingLevel sets the heading level.'),
    ],
    whenToUse: ['List what a home or an account has reported, with the unread ones easy to find.', 'Offer a place to clear a run of messages with the keyboard.'],
    whenNotToUse: [['A short message that disappears by itself', 'Toast'], ['A notice that stays at the top of a screen', 'Banner'], ['A log with no actions on it', 'Timeline']],
    anatomy: [['Title', 'type.emphasis in type.weight-medium; takes focus when the last line is gone.'], ['Count', 'A Badge with the number of unread lines.'], ['Mark all read', 'A Button, control.md; dimmed with aria-disabled when nothing is unread.'], ['Day heading', 'type.label in text.secondary.'], ['Lamp', 'control.mark, a ring in text.primary; filled while unread.'], ['Line', 'A List row: title, detail and a tabular time.'], ['Keys', 'Two IconButtons at control.key, 44px.']],
    states: [['Unread', 'A filled lamp, a medium title and primary ink.'], ['Read', 'An empty ring, a regular title and secondary ink; the mark-as-read key is latched.'], ['Leaving', 'The line fades on motion.exit, then is removed.'], ['Empty', 'An EmptyState; Mark all read is dimmed.']],
    content: ['Write a title as what happened, in the past tense: Washer finished.', 'Put the place or the cause in the detail line and keep it to one line.', 'Name the day in words, as in Today and Yesterday.'],
    dodont: [
      { do: 'Tell unread by shape and weight, and add colour only as a third cue.', dont: 'Tell unread by a coloured dot alone.' },
      { do: 'Keep each title different so each key has its own name.', dont: 'Give ten lines the title Update.' },
    ],
    a11y: ['The center is a labelled section with a heading; each day is a heading above its own list.', 'An unread line is read out with the word Unread before its title; the lamp itself is hidden.', 'The mark-as-read key is a toggle with aria-pressed and a name that includes the title.', 'A hidden status region (polite) announces new lines once; the list itself is not a live region.', 'On dismiss, focus moves to the next line dismiss key, or to the heading when nothing is left.', 'In forced colours the lamp is drawn in the text colour, filled or empty.'],
    keyboard: [['Tab', 'Moves through Mark all read and then the two keys of each line', 'NotificationCenter: every line has a mark-as-read key and a dismiss key that are real buttons'], ['Space or Enter', 'Presses the focused key', 'NotificationCenter: dismiss moves focus to the next line']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/list', 'List', 'The rows the center is built from.'], ['/components/toast', 'Toast', 'A short message that goes away by itself.'], ['/components/timeline', 'Timeline', 'A log with no actions on it.']],
  },
  {
    name: 'KanbanBoard',
    slug: 'kanban-board',
    status: 'beta',
    limitations: ['Cards keep the order you give them; there is no sorting or filtering.', 'A drag does not scroll the board; on a wide board use the Move key or Alt with the arrow keys to reach a far column.', 'A limit warns and never blocks a move.', 'Cards hold a title and a detail line; there are no labels, avatars or editing inside the card.'],
    youMust: ['Give the board a label, because it is the name of the group.', 'Give each column and each card an id that is unique among its kind.', 'Write card titles as short phrases, because the title is read in the Move key and in the status.', 'Keep the Move key: do not hide it, because a drag cannot be reached from a keyboard.'],
    usage: '<KanbanBoard label="Chores for the week" defaultValue={{ todo: ["kettle"] }}\n  columns={[{ id: "todo", title: "To do" }, { id: "doing", title: "Doing", limit: 2 }]}\n  cards={[{ id: "kettle", title: "Descale the kettle" }]} />',
    backdrops: 'In light the cards are raised warm white plastic with a lit lip and the count windows are light grey recesses; in dark the cards are charcoal and the windows near-black. A seam of divider ink splits the columns and nothing is orange.',
    purpose: 'Holds named columns of cards that move between columns by a Move key, by Alt with the arrow keys or by dragging a grip.',
    importLine: "import { KanbanBoard } from 'dial-react';",
    overview: (
      <>
        <p><code>KanbanBoard</code> is a row of columns, each a named list of cards. A small recessed window beside each title counts its cards and shows the limit when there is one. <code>value</code> maps each column id to its card ids and <code>onValueChange</code> reports the new arrangement; <code>defaultValue</code> starts an uncontrolled board.</p>
        <p>A card moves three ways. Its Move key opens a choice of the other columns. A focused card takes Alt with the arrow keys: left and right change column, up and down change position. A pointer can also drag its grip, and <code>drag</code> switches that off. A polite status reads out every move.</p>
      </>
    ),
    hero: ex('KanbanBoardBasic', 'Chores in three columns, with a Move key and a grip on every card.'),
    ladder: [
      ex('KanbanBoardLimits', 'A limit on Doing: the window reads 3/2 with a warning mark.'),
      ex('KanbanBoardControlled', 'The arrangement held in state, a line that reports the last move and the orange key that saves.'),
      ex('KanbanBoardKeysOnly', 'Dragging switched off, with level 4 column headings.'),
      ex('KanbanBoardStates', 'A card that stays put, an empty column, and German and Thai titles.'),
    ],
    whenToUse: ['Follow tasks through two to five stages that each hold a few cards.', 'Limit how much work is open at once with a count and a limit per column.'],
    whenNotToUse: [['Choosing rows to put in or leave out of a set', 'TransferList'], ['A plain list of rows with no stages', 'List']],
    anatomy: [['Column', 'A section with a heading, a seam on its inline start (line.divider) and a fixed width of layout.frame-xs.'], ['Count window', 'surface.sunken, elevation.well, corner.media, width.hairline in line.ring, tabular figures.'], ['Card', 'A Card at small padding with a title, a detail line, a grip and a Move key.'], ['Grip and Move key', 'Two 44px squares at the inline end of the card header; the grip is a dot-matrix drag glyph, the key a Menu.'], ['Status', 'A visually hidden polite live region.']],
    states: [['Focus', 'A dark ring around the card that holds the keyboard focus.'], ['Carried', 'The card follows the pointer with the lift shadow and a line marks where it will land.'], ['Over the limit', 'The figures in medium weight with a warning mark, and the words “over the limit” for assistive tech.'], ['Card disabled', 'Half-faded, no grip, no Move key.'], ['Empty column', 'A recessed slot with a line of words.']],
    content: ['Name each column with a noun for the stage.', 'Start each card title with a verb.', 'Keep the detail line to one short fact.'],
    dodont: [
      { do: 'Name the stage with a noun such as Doing.', dont: 'Write a sentence as a column title.' },
      { do: 'Put a limit on the one stage that should stay small.', dont: 'Put a limit on every column.' },
    ],
    a11y: ['The board is a group named by its label; each column is a section named by its heading.', 'Each card is a list item named by its title and described by a hint that names the keys.', 'Every move has a keyboard route and a menu route, so a drag is never needed (WCAG 2.5.7).', 'A polite status reads the card, the column and the position after each move.', 'A column past its limit is told by figures, a warning mark and words, not by colour.', 'In forced colours the cards keep a real border in the text colour and the drop line uses the system highlight.'],
    keyboard: [['Tab', 'Reaches each card, then its Move key', 'KanbanBoard: the board is a group of named columns, and every card has a name, a hint and a Move key'], ['Alt + left or right arrow', 'Moves the focused card to the next or previous column', 'KanbanBoard: Alt with the arrow keys moves a focused card, announces it politely and keeps the focus on it'], ['Alt + up or down arrow', 'Moves the card one place in its column; the plain arrows walk the cards', 'KanbanBoard: Alt with up or down changes position, the plain arrows walk the cards, and the end of the column is announced'], ['Enter on the Move key', 'Opens the columns; a choice moves the card to the end of that column', 'KanbanBoard: the Move key opens a choice of the other columns and moves the card to the end of the one chosen']],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/transfer-list', 'TransferList', 'Choosing rows to put in or leave out of a set.'], ['/components/card', 'Card', 'The body each task is drawn on.'], ['/components/menu', 'Menu', 'The choice of columns the Move key opens.']],
  },
];
