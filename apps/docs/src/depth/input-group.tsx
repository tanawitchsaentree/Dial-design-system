// Usage tab for InputGroup (component-depth.md U1–U14). InputGroup is an Input with something fixed at its ends.
import { Button, Icon, IconButton, Input, InputGroup, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const price = <InputGroup label="Monthly price" start="THB" end="/ month" defaultValue="1,250" />;

export const INPUT_GROUP: Depth = {
  overview: (
    <>
      <p>InputGroup is an Input with something fixed at one or both ends: a word such as THB or https://, a unit, or a small key such as Search. The fixed part is printed inside the same recess, with a hairline rule between it and the text you type.</p>
      <p>The group is one window with one focus ring. The label stays printed above it, on the same line as the other printing on the unit.</p>
    </>
  ),
  whenToUse: ['To enter the middle of a value that always has the same start or end, such as a price or an address.', 'To put one key beside a field, such as Search or Copy, when the key belongs to that field alone.'],
  whenNot: [
    { situation: 'A short unit after a number and nothing else', to: '/components/input', label: 'Input' },
    { situation: 'Several lines of text', to: '/components/textarea', label: 'Textarea' },
    { situation: 'The key that saves the whole form', to: '/components/button', label: 'Button' },
  ],
  variants: { na: 'InputGroup has one look: ruled cells inside one recessed well. What goes in the cells is covered under Modifiers.' },
  anatomy: {
    render: <InputGroup label="Address of the hub" start="https://" end=".local" defaultValue="kitchen" hint="Letters and numbers, no spaces." />,
    parts: [
      { part: 'Label', selector: '[data-component="InputGroup"] > label', what: 'The printed name, above the start of the well.' },
      { part: 'Well', selector: '[data-component="InputGroup"] > div', what: 'One recess with a hairline edge and shade on its top-left inner edge. It holds every part below.' },
      { part: 'Add-on', selector: '[data-component="InputGroup"] > div > span', what: 'A fixed word or key, in secondary ink, with a hairline rule between it and the text.' },
      { part: 'Text', selector: '[data-component="InputGroup"] input', what: 'The typed value in primary ink, on a line box tall enough for Thai marks.' },
      { part: 'Hint', selector: '[data-component="InputGroup"] > p', what: 'A short line under the well in secondary ink.' },
    ],
  },
  sizes: {
    md: { use: '44px well. Fields in a unit and in settings sheets.', pairs: 'Other 44px controls, such as Button, Input and Select.' },
    lg: { use: '52px well with larger text. The main field of a sheet on a phone.', pairs: 'A large IconButton as the key, and a large Button below.' },
  },
  emphasis: { na: 'A field is never the loud part of a unit. The group has no orange of its own; keep any key inside it a plain key.' },
  placement: {
    rows: [['One field per row, full width', 'The usual place, in a settings sheet or under a unit’s display.'], ['A key beside the field', 'Only a key that acts on this field, such as Search, Copy or Clear.']],
    examples: [{ title: 'In a settings sheet', render: <Unit><Stack gap="md">{price}<Button kind="primary">Save</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['InputGroup + Button', 'The group takes the value and the orange key saves the sheet.'], ['InputGroup + IconButton', 'A plain key at the end acts on the field, for example Clear.']],
    avoid: [{ title: 'the orange key inside the group', why: 'The orange key is the unit’s one loud control and belongs to the action, not to a field.', render: <Unit><InputGroup label="Find a device" end={<IconButton label="Search" kind="primary"><Icon name="search" /></IconButton>} /></Unit> }],
  },
  content: {
    formula: <p>Name the thing the field holds, as in <em>Monthly price</em>. Put in the add-ons only what never changes, such as <em>THB</em> or <em>.local</em>, and keep each to one short word.</p>,
    pair: {
      do: <InputGroup label="Monthly price" start="THB" defaultValue="1,250" />, doNote: 'The label names the setting and the currency is printed in the well.',
      dont: <InputGroup label="Please type the monthly price in THB here" defaultValue="1,250" />, dontNote: 'An instruction as the label, with the currency buried in it.',
    },
    overflow: { text: 'A long value scrolls inside the well. The add-ons keep their size and the well keeps its width.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><InputGroup label="Address of the hub in the upstairs hall" start="https://" end=".local" defaultValue="upstairs-hall-heating-controller-with-a-long-name" /></div> },
    rtl: { text: 'In right-to-left languages the start add-on sits on the right and the rule follows it.', render: <div dir="rtl"><InputGroup label="السعر الشهري" start="ر.س" end="/ شهر" defaultValue="1250" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label wraps and the well does not change.', render: <InputGroup label="Monatlicher Preis für das Wohnzimmer" start="EUR" end="/ Monat" defaultValue="12" /> },
  },
  behaviours: {
    states: [
      ['Rest', 'A recess with a hairline edge, and a hairline rule beside each add-on.', 'The label is printed above it.'],
      ['Focus', 'The same dark 2px ring as every part, around the whole well, when the text or a key holds focus.', 'The well does not grow or move.'],
      ['Typing', 'Text runs between the rules and scrolls when it is long.', 'The add-ons stay where they are, and Thai marks are not cut.'],
      ['Invalid', 'The edge turns red and the message is printed below with a glyph.', 'Never orange, and never colour alone.'],
      ['Read-only', 'The well stays recessed and the text can be selected and copied.', 'It stays in the tab order.'],
      ['Disabled', 'The well loses its shadow and the text and add-ons fade to half.', 'The field leaves the tab order. Disable a key in an add-on yourself.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the field, then to a key at the end if there is one. Shift+Tab goes back.', 'native input, native button'],
      ['Keyboard', 'Typing', 'Enters text. The arrow keys move the caret.', 'native input'],
      ['Pointer', 'Press the well', 'Places the caret where you pressed. A key in an add-on acts as a key.', 'native input'],
      ['Screen reader', 'Read', 'Announced with its label, its value, a plain word in an add-on, its hint and, when invalid, the error. A key is announced by its own name.', 'aria-describedby, aria-invalid'],
    ],
    loading: <p>InputGroup has no loading state. If a key starts a search, say so on the unit’s display and keep the typed text in place.</p>,
    focus: <p>A group is not focused on page load. After a key such as Clear runs, return focus to the text field yourself.</p>,
  },
  deepDive: { na: 'InputGroup has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'start and end',
      rules: <p>Fix a word or a key before the value with <code>start</code>, after it with <code>end</code>, or both. A plain word is part of the field’s description, so a screen reader says it too. A key is an <code>IconButton</code> with its own name.</p>,
      pair: { do: <InputGroup label="Address of the hub" start="https://" end=".local" defaultValue="kitchen" />, doNote: 'The fixed words are printed in the well.', dont: <Input label="Address of the hub" defaultValue="https://kitchen.local" />, dontNote: 'The person has to type, and keep, parts that never change.' },
    },
    {
      name: 'hint',
      rules: <p>A short line under the well that says what to enter, such as a range or a format. One sentence at most.</p>,
      pair: { do: <InputGroup label="Night setback" end="°C" hint="Between 5 and 20." defaultValue="17" />, doNote: 'The range, in a few words.', dont: <InputGroup label="Night setback" end="°C" hint="This is the temperature that the heater will hold during the night hours, which you can set in the schedule." defaultValue="17" />, dontNote: 'A paragraph where one line would do.' },
    },
    {
      name: 'error',
      rules: <p>Marks the group invalid and prints the problem under the well with a glyph. Say what to do, as in <em>Enter digits only.</em> Show it after the person leaves the field or submits.</p>,
      pair: { do: <InputGroup label="Monthly price" start="THB" defaultValue="12x" error="Enter digits only, for example 1250." />, doNote: 'The fix, in words, with a glyph.', dont: <InputGroup label="Monthly price" start="THB" defaultValue="12x" error="Invalid." />, dontNote: 'It says something is wrong but not what to do.' },
    },
  ],
  related: [['/components/input', 'Input', 'A field with at most a unit.'], ['/components/textarea', 'Textarea', 'Several lines of text.'], ['/components/icon-button', 'IconButton', 'The key used inside an add-on.']],
  references: [
    { title: 'WCAG 2.2 · 3.3.2 Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html', why: 'Why the label is printed and stays while typing.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the error has a glyph and words as well as a red edge.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why a key inside the well keeps its 44px disc.' },
  ],
};
