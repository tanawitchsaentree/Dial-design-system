// Usage tab for Legend (component-depth.md U1–U14). Every choice printed beside or round its knob, the one in use lit.
import { Legend, Select, SegmentedControl, Stack } from 'dial-react';
import type { Depth } from './types';

const FAN = ['off', 'low', 'mid', 'high', 'auto'];
const WASH = ['cotton', 'synthetics', 'wool', 'quick 30', 'rinse', 'spin'];
const SOURCES = ['radio', 'library', 'line in'];

export const LEGEND: Depth = {
  overview: (
    <>
      <p>Legend prints every choice a control has and lights the one in use. It is the ring of words round a fan's knob, or the column of programmes beside a washer's dial. Nobody has to open a menu to learn what the device can do, because the whole range is already on the case.</p>
      <p>The lit word is full ink in medium weight with one short ink mark beside it. The other words wait one ink step lighter, and both steps hold 4.5:1 on the body. The orange stays on the knob. Turning the knob walks the lit word one step per detent, and pressing a word turns the knob straight to it.</p>
      <p>By default the legend draws its own Rotary, with one detent per word. The knob is the one tab stop, a slider whose value text is the word, so a screen reader hears "Fan, low" and the arrow keys walk the list. The words are press targets for a pointer and are kept out of the reading order, so nobody hears the list twice. The knob also names every choice once in its description.</p>
      <p>With <code>control="none"</code> the words stand alone as one radio group. Use that when the unit already spends its knob on something else, such as the brightness of a lamp whose scenes sit beside it.</p>
    </>
  ),
  whenToUse: ['A setting with a few named positions that fit on the case, up to about ten.', 'A device whose range people should see at a glance, such as a fan, an oven or a washer.', 'A knob that turns through words, since the words then become its scale.', 'A choice people make often and want to read back from across the room.'],
  whenNot: [
    { situation: 'More than about ten choices, or choices that change with the data', to: '/components/select', label: 'Select' },
    { situation: 'A number along a range, such as a temperature', to: '/components/rotary', label: 'Rotary' },
    { situation: 'Two to four modes set by keys that latch', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Moving between sections of a screen', to: '/components/tabs', label: 'Tabs' },
  ],
  variants: { na: 'Legend has one look. layout and control change where the words sit and what walks them, so they are described under Modifiers.' },
  anatomy: {
    render: <Legend label="Fan" options={FAN} defaultValue="low" />,
    parts: [
      { part: 'Knob', selector: '[data-component="Legend"] [data-component="Rotary"]', what: 'A Rotary with one detent per word and its name printed under it. Its own value line is left off, because the legend says it.' },
      { part: 'Words', selector: '[data-component="Legend"] [data-word]', what: 'Every choice, printed in type.label. Each one is a press target of at least 44 by 44px.' },
      { part: 'Lit word', selector: '[data-component="Legend"] [data-word][data-state="on"]', what: 'The choice in use, in text.primary and medium weight. Its width is reserved, so its neighbours do not move.' },
      { part: 'Index mark', selector: '[data-component="Legend"] [data-word] ~ span:last-child', what: 'One ink mark beside the lit word. A 4px bar in a column or row, a 6px dot on the arc.' },
    ],
  },
  sizes: { na: 'The words have one size, type.label on 44px targets. knobSize sets only the knob, and it is described under Modifiers.' },
  emphasis: {
    text: <><p>A legend is quiet printing beside the unit's one loud part. It spends no orange and has no height. Give a unit one legend per knob, and keep the knob it walks as the largest part.</p><p>The lit word is told apart three ways at once, by ink, by weight and by its mark. None of them is a hue, so the choice still reads in forced colours.</p></>,
    pair: {
      do: <Legend label="Fan" options={FAN} defaultValue="mid" />,
      doNote: 'One knob and its legend. The orange is the knob.',
      dont: <Stack direction="row" gap="lg"><Legend label="Fan" options={FAN} defaultValue="mid" /><Legend label="Swing" options={['off', 'on']} defaultValue="on" /></Stack>,
      dontNote: 'Two orange knobs with legends on one unit. Make the second a key knob, or a Switch.',
    },
  },
  placement: {
    rows: [['Beside the knob, at its centre line', 'The default column. The words read down like a panel and up to ten fit.'], ['Round the knob', 'layout arc, for three to seven short words such as a fan or an oven.'], ['Under the display, at the start of the column', 'A legend with no knob, for a unit whose knob sets something else.']],
    examples: [
      { title: 'Washer programmes beside the knob', render: <Legend label="Programme" options={WASH} defaultValue="wool" /> },
      { title: 'Fan settings round the knob', render: <Legend layout="arc" label="Fan" options={FAN} defaultValue="high" /> },
    ],
  },
  combinations: {
    good: [['Display + Legend', 'The display says what the device is doing, and the legend says what it is set to.'], ['Legend + key knob', 'A second dial on the unit stays plastic, so the unit keeps one orange part.'], ['Legend + Switch', 'Power on a Switch, and the legend for the mode it runs in.']],
    avoid: [
      { title: 'a dropdown for five fan speeds', why: 'The fan can only do five things, and a Select hides all five behind a click. Print them.', render: <Select label="Fan" options={FAN.map((v) => ({ value: v, label: v }))} defaultValue="low" /> },
      { title: 'a segmented pill for a knob\'s positions', why: 'Keys that latch read as modes, and a row of five crowds the case. A legend is printing round the knob.', render: <SegmentedControl label="Fan" options={FAN.map((v) => ({ value: v, label: v }))} defaultValue="low" /> },
    ],
  },
  content: {
    formula: <><p>Print each choice as one or two short lowercase words, the way an appliance does. Use the words the manual uses, such as <em>off</em>, <em>low</em>, <em>eco 40</em> or <em>line in</em>. Keep the order the knob turns, with off or the gentlest setting first.</p><p>Every word shows in full. A legend never cuts a word or wraps it onto a second line. If the words will not fit round the knob, use the column, and if they will not fit in a column of ten, use a Select.</p></>,
    pair: {
      do: <Legend label="Source" control="none" layout="row" options={SOURCES} defaultValue="radio" />, doNote: 'Short lowercase nouns from the manual.',
      dont: <Legend label="Source" control="none" layout="row" options={['Play the radio', 'Open my library', 'Use the line input']} defaultValue="Play the radio" />, dontNote: 'Sentences make printing read as buttons.',
    },
    overflow: { text: 'A long word never wraps or cuts. The column takes the width of its longest word, and the mark keeps its place.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}><Legend label="Programme" options={['cotton', 'synthetics', 'easy care with steam', 'quick 30']} defaultValue="easy care with steam" /></div> },
    rtl: { text: 'In right-to-left languages the column sits on the other side of the knob and its mark moves with it. The arc keeps clockwise order, because a knob turns the same way in every script.', render: <div dir="rtl"><Legend label="المروحة" options={['إيقاف', 'منخفض', 'متوسط', 'مرتفع']} defaultValue="منخفض" /></div> },
    expansion: { text: 'German words can run 30% longer. Each word reserves its widest width, so lighting one never shifts the rest.', render: <Legend label="Programm" options={['baumwolle', 'pflegeleicht', 'wolle', 'schleudern']} defaultValue="pflegeleicht" /> },
  },
  behaviours: {
    states: [
      ['Waiting', 'Word in text.secondary, regular weight, no mark.', 'Still a 44px target.'],
      ['Lit', 'Word in text.primary, medium weight, the ink mark beside it.', 'The weight changes at once; the mark slides on the spring.'],
      ['Hover', 'A waiting word darkens one step.', 'Nothing rises.'],
      ['Focus', 'With a knob, the ring is on the knob. Alone, a dark 2px ring round the lit word.', 'One tab stop either way.'],
      ['Disabled', 'The knob loses its height and the words fade.', 'Every word stays printed, so people can still read the range.'],
      ['Forced colours', 'The mark is painted in the system text colour.', 'Weight and mark still tell the lit word.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the knob, or the lit word when there is no knob. One stop for the whole legend.', 'role slider or radiogroup'],
      ['Keyboard', 'Arrow keys', 'Walk the lit word one step. They stop at the ends.', 'role slider or radio'],
      ['Keyboard', 'Home / End', 'Light the first or the last word.', 'role slider or radio'],
      ['Pointer', 'Turn the knob', 'Drag up or down; the lit word follows each detent.', 'Rotary'],
      ['Pointer', 'Press a word', 'Turns the knob to it and keeps focus on the knob.', 'pointerdown'],
      ['Screen reader', 'Read', 'With a knob, announced as a slider named by its label, with the word as its value and every choice in its description. Alone, as a radio group of words.', 'aria-valuetext, aria-describedby'],
    ],
    loading: <p>A legend has no loading state. Its words are the device's fixed positions, so they are known before the device answers. While a new choice is on its way to the device, keep the word lit and let the unit's display say what the device is doing.</p>,
    focus: <p>A legend never takes focus on page load. Tab lands on its knob, or on the lit word of a legend with no knob.</p>,
  },
  deepDive: { na: 'Legend has one kind, covered above.' },
  modifiers: [
    {
      name: 'layout',
      rules: <p>column is the default and holds up to ten words of any length beside the knob. arc sets each word at its own detent round the dial, so the knob's index line points at the lit word; keep it to about seven short words. row sets the words in equal cells, and suits a legend with no knob.</p>,
      pair: {
        do: <Legend layout="arc" label="Oven" options={['off', 'top', 'fan', 'grill']} defaultValue="fan" />,
        doNote: 'Four short words round the knob.',
        dont: <Legend layout="arc" knobSize="sm" label="Programme" options={WASH} defaultValue="wool" />,
        dontNote: 'Six long words round a small knob crowd the dial. Use the column.',
      },
    },
    {
      name: 'control',
      rules: <p>rotary is the default and draws the knob that walks the words. Use none when the unit's knob already sets something else; the words then form their own radio group with one tab stop.</p>,
      pair: {
        do: <Legend control="none" label="Scene" options={['reading', 'evening', 'night light']} defaultValue="evening" />,
        doNote: 'Scenes beside a lamp whose knob sets brightness.',
        dont: <Stack gap="sm"><Legend label="Scene" options={['reading', 'evening']} defaultValue="evening" /><Legend label="Scene" control="none" options={['reading', 'evening']} defaultValue="evening" /></Stack>,
        dontNote: 'A knob and a second legend for the same value. That is two tab stops for one choice.',
      },
    },
    {
      name: 'knob and knobSize',
      rules: <p>knob is primary for the unit's one orange knob and key for a second dial. knobSize is sm, md or lg, the same 44, 72 and 108px as Rotary.</p>,
      pair: {
        do: <Legend knob="key" knobSize="sm" label="Spin" options={['400', '800', '1200']} defaultValue="800" />,
        doNote: 'A small key knob for the second dial.',
        dont: <Legend knobSize="lg" label="Spin" options={['400', '800']} defaultValue="800" />,
        dontNote: 'A large orange knob for a two-way choice. A Switch says it.',
      },
    },
  ],
  related: [['/components/rotary', 'Rotary', 'The knob a legend walks, for numbers along a range.'], ['/components/select', 'Select', 'More than about ten choices.'], ['/components/segmented-control', 'SegmentedControl', 'Modes set by latching keys.'], ['/components/tabs', 'Tabs', 'Sections of a screen.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Slider pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/', why: 'Why the knob carries the word in aria-valuetext.' },
    { title: 'WAI-ARIA Authoring Practices · Radio Group pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', why: 'Keys and roles for a legend with no knob.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why each printed word is a 44px target.' },
  ],
};
