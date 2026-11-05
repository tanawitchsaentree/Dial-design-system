// Usage tab for Editable (component-depth.md U1–U14). Editable is a value printed on the case that becomes an Input well when pressed.
import { Button, Editable, Input, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const EDITABLE: Depth = {
  overview: (
    <>
      <p>Editable is for a short value that people change now and then, such as a room name, a device name or a schedule title. At rest it is printing with a round key beside it. Press either one and an Input well takes its place with the text selected.</p>
      <p>Enter, the save key or leaving the field keeps the change. Escape or the cancel key puts the old words back. Each of these is announced, so a screen reader hears what happened.</p>
    </>
  ),
  whenToUse: ['To rename something in place, where a full form would be too much.', 'To show a setting as a reading and let the person correct it.'],
  whenNot: [
    { situation: 'A field that is always open and is part of a form to submit', to: '/components/input', label: 'Input' },
    { situation: 'Several lines of text', to: '/components/textarea', label: 'Textarea' },
    { situation: 'A number that is stepped up and down', to: '/components/number-input', label: 'NumberInput' },
  ],
  variants: { na: 'Editable has one look: printing at rest, a well while editing. The states are props, covered under Modifiers.' },
  anatomy: {
    render: <Editable label="Room name" defaultValue="Kitchen heating" hint="Enter keeps the change." />,
    parts: [
      { part: 'Label', selector: '[data-component="Editable"] > span:first-child', what: 'The printed name above the value. It names the field in both states.' },
      { part: 'Reading', selector: '[data-component="Editable"] button[aria-labelledby]', what: 'The value as flat printing. The whole line is a 44px press area and the keyboard stop.' },
      { part: 'Edit key', selector: '[data-component="Editable"] [data-component="IconButton"]', what: 'A 44px round key with a pencil, so the way in is visible without hover.' },
      { part: 'Hint', selector: '[data-component="Editable"] > p', what: 'A short line under the row that says what to enter.' },
    ],
  },
  sizes: { na: 'Editable has one size. The reading, the well and the keys are all 44px tall so the row never changes height.' },
  emphasis: { na: 'Nothing in an Editable is orange. Its keys are the plain ones, so the unit’s one loud key stays free.' },
  placement: {
    rows: [['A settings sheet', 'Stand Editables in one column, one per setting, with the orange key under the last.'], ['A card header', 'Let the title be an Editable when the owner may rename the thing.']],
    examples: [{ title: 'In a settings sheet', render: <Unit><Stack gap="lg"><Editable label="Device name" defaultValue="Bedroom lamp" /><Editable label="Room" defaultValue="Upstairs" /><Button kind="primary">Save settings</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Editable + Button', 'The orange key that saves the whole sheet comes after the last Editable.'], ['Editable + hint', 'Say the limit in the hint, such as how long the name may be.']],
    avoid: [{ title: 'an Editable for a long form', why: 'Ten open readings with ten keys is a form with extra steps. Use Inputs and one save key.', render: <Unit><Stack gap="sm"><Editable label="Name" defaultValue="Kitchen" /><Editable label="Room" defaultValue="Ground floor" /><Editable label="Owner" defaultValue="Sam" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the value with a noun, as in <em>Room name</em>. The keys are named from it, so “Edit Room name” reads well aloud.</p>,
    pair: {
      do: <Editable label="Room name" defaultValue="Kitchen" />, doNote: 'A noun, and the keys follow it.',
      dont: <Editable label="Click here to change the name of the room" defaultValue="Kitchen" />, dontNote: 'An instruction as a label makes every key name long.',
    },
    overflow: { text: 'A long value wraps in the printed line, even a long word. The row grows in height and the keys stay 44px.', render: <Editable label="Schedule name" defaultValue="Weekday mornings, heating up before everyone wakes and down again once the house is empty" /> },
    rtl: { text: 'In right-to-left languages the value starts on the right and the key sits on the left.', render: <div dir="rtl"><Editable label="اسم الغرفة" defaultValue="المطبخ" editLabel="تعديل اسم الغرفة" /></div> },
    expansion: { text: 'German and Finnish values can run 30% longer. They wrap and the key does not move.', render: <Editable label="Raumname" defaultValue="Wohnzimmer im Erdgeschoss mit großem Fenster" editLabel="Raumname bearbeiten" /> },
  },
  behaviours: {
    states: [
      ['Reading', 'Flat printing in primary ink with a key beside it.', 'A button named by the label and the value.'],
      ['Empty', 'The placeholder in secondary ink.', 'The placeholder words are read as the value.'],
      ['Editing', 'A recessed well with the text selected, and a cancel and a save key.', 'A text field named by the label.'],
      ['Invalid', 'The well edge in critical red and the message with a glyph.', 'The field is marked invalid and described by the message.'],
      ['Read-only', 'Full ink with no key.', 'Read as text.'],
      ['Disabled', 'The value at half ink with no key.', 'The button is announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Enter or Space on the reading', 'Opens the field with the text selected.', 'native button'],
      ['Keyboard', 'Enter in the field', 'Keeps the change and returns focus to the reading.', 'keydown'],
      ['Keyboard', 'Escape in the field', 'Puts the old value back and returns focus to the reading.', 'keydown'],
      ['Pointer', 'Press the value or the edit key', 'Opens the field.', 'click'],
      ['Pointer', 'Press elsewhere while editing', 'Keeps the change.', 'blur'],
      ['Touch', 'Save and cancel keys', 'Finish the edit without a keyboard Enter or Escape.', 'buttons'],
      ['Screen reader', 'Change kept or cancelled', 'Announced in a polite status.', 'role="status"'],
    ],
    loading: <p>Editable has no loading state. If saving takes time, keep the new value in your state and show the result in the hint.</p>,
    focus: <p>Pressing the reading moves focus into the field. Enter and Escape move it back to the reading. Leaving by Tab or a press elsewhere leaves focus where the person sent it.</p>,
  },
  deepDive: { na: 'Editable has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'error',
      rules: <p>Set <code>error</code> to the problem in words. The well edge turns red, a glyph and the message print under the row, and the field is marked invalid. Check the value in <code>onValueChange</code> and set it again.</p>,
      pair: { do: <Editable label="Room name" defaultValue="Kitchen" error="A room with this name already exists." />, doNote: 'The problem is said in words and with a glyph.', dont: <Editable label="Room name" defaultValue="Kitchen" hint="Error" />, dontNote: 'A hint that only says Error tells nobody what to fix.' },
    },
    {
      name: 'readOnly',
      rules: <p>Use <code>readOnly</code> when the person may see the value but not change it. It keeps full ink and drops the key. Use <code>disabled</code> when the setting is not available right now.</p>,
      pair: { do: <Editable label="Sensor" defaultValue="Hall sensor 2" readOnly />, doNote: 'Full ink, no key.', dont: <Editable label="Sensor" defaultValue="Hall sensor 2" disabled />, dontNote: 'A disabled value reads as broken when it is only fixed.' },
    },
    {
      name: 'placeholder',
      rules: <p>An empty value prints <code>placeholder</code> (default “Not set”) in secondary ink, so the row is still a line to press. Say what is missing, not how to fill it in.</p>,
      pair: { do: <Editable label="Room name" defaultValue="" placeholder="Not named yet" />, doNote: 'A short reading.', dont: <Editable label="Room name" defaultValue="" placeholder="Click the pencil to type a name for your room" />, dontNote: 'An instruction as a value.' },
    },
    {
      name: 'name',
      rules: <p>Set <code>name</code> to write the committed value to a hidden input, so an Editable can sit in a native form. The text being typed is not submitted until it is kept.</p>,
      pair: { do: <Input label="Owner" defaultValue="Sam" />, doNote: 'For a field that is always open, use Input.', dont: <Editable label="Owner" defaultValue="Sam" />, dontNote: 'An Editable on a form people must fill in hides the field behind a press.' },
    },
  ],
  related: [['/components/input', 'Input', 'A field that is always open.'], ['/components/textarea', 'Textarea', 'Several lines of text.'], ['/components/number-input', 'NumberInput', 'A number stepped up and down.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'How the reading behaves as a button.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the keys are 44px.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a kept or cancelled edit is announced.' },
  ],
};
