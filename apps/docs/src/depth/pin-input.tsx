// Usage tab for PinInput (component-depth.md U1–U14). PinInput enters a short code, one digit a cell.
import { Button, PinInput, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const PIN_INPUT: Depth = {
  overview: (
    <>
      <p>PinInput takes a short code, such as the six digits sent by text message or a four-digit door PIN. Each digit sits in its own recessed window, the same cut-in well as Input, and the cursor moves on by itself as digits arrive.</p>
      <p>It is one field for the person: Backspace goes back a cell, a paste fills every cell, and a phone offers the code it just received. For the form it is one value, the digits joined. The flow around the code, such as sending it again or counting down, is not part of PinInput.</p>
    </>
  ),
  whenToUse: ['To enter a one-time code from a text message or an authenticator.', 'To enter a short numeric PIN of four to eight digits.'],
  whenNot: [
    { situation: 'An ID, a serial number or any code with letters', to: '/components/input', label: 'Input' },
    { situation: 'A quantity that is set with steps and limits', to: '/components/number-input', label: 'NumberInput' },
    { situation: 'A secret of any length', to: '/components/password-input', label: 'PasswordInput' },
  ],
  variants: { na: 'PinInput has one look, a row of recessed windows. The size, the mask and the state are props, covered under Sizes and Modifiers.' },
  anatomy: {
    render: <PinInput label="Verification code" defaultValue="48" hint="We sent six digits to your phone." />,
    parts: [
      { part: 'Label', selector: '[data-component="PinInput"] > span:first-child', what: 'The printed name above the row. It also names the group.' },
      { part: 'Cells', selector: '[data-component="PinInput"] [role="group"] > input', what: 'One 44px recessed window for each digit, with the digit in tabular figures.' },
      { part: 'Hint', selector: '[data-component="PinInput"] > p', what: 'A line under the row that says where the code came from.' },
    ],
  },
  sizes: {
    md: { use: 'The default: six 44px windows, which fit in a 340px column.', pairs: 'Sits level with Input, Select and Button at md.' },
    lg: { use: 'Six 52px windows with larger figures, for the main code of a phone sheet.', pairs: 'Pairs with a lg Input or a lg Button.' },
  },
  emphasis: { na: 'PinInput is never the loud part of a unit. The windows and digits are ink, so the orange stays on the unit’s primary control.' },
  placement: {
    rows: [['Under a sentence that says where the code came from', 'The label names the code and the hint says how it was sent.'], ['Above the unit’s primary key', 'The orange key that confirms comes after the row.']],
    examples: [{ title: 'In a sign-in sheet', render: <Unit><Stack gap="lg"><PinInput label="Verification code" hint="We sent six digits to your phone." /><Button kind="primary">Confirm</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['PinInput + Button', 'The orange key that confirms comes after the row.'], ['PinInput + hint', 'The hint says where the code came from and how long it lasts.']],
    avoid: [{ title: 'two PinInputs in one view', why: 'Two rows of windows look alike and the person cannot tell which one takes the next digit.', render: <Unit><Stack gap="lg"><PinInput label="Code from the text" /><PinInput label="Code from the app" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the code with a noun, as in <em>Verification code</em> or <em>Door PIN</em>. Use the hint for where it came from and how long it lasts, not for the number of digits, because the windows count them.</p>,
    pair: {
      do: <PinInput label="Verification code" hint="We sent it to your phone." />, doNote: 'A noun, and a hint about the source.',
      dont: <PinInput label="Enter the 6-digit code you received" />, dontNote: 'An instruction in the label, and the windows already show six.',
    },
    overflow: { text: 'A long code wraps to a second line. The windows stay 44px and never shrink.', render: <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}><PinInput label="Long code" length={10} /></div> },
    rtl: { text: 'In right-to-left languages the first window sits on the right, and the arrow keys follow the reading direction.', render: <div dir="rtl"><PinInput label="رمز التحقق" defaultValue="48" /></div> },
    expansion: { text: 'German and Finnish labels and hints can run 30% longer. They wrap above and below the row and the windows do not move.', render: <PinInput label="Bestätigungscode aus der Nachricht" hint="Sechs Ziffern, gültig für zehn Minuten." cellLabel={(n, total) => `Ziffer ${n} von ${total}`} /> },
  },
  behaviours: {
    states: [
      ['Empty', 'An empty recessed window.', 'Named “Digit 3 of 6”.'],
      ['Filled', 'The digit, and the edge a step darker.', 'The digit is read with the cell name.'],
      ['Focus', 'The dark ring on the cell, with its digit selected.', 'The cell name is read.'],
      ['Invalid', 'Red edges, a glyph and the message under the row.', 'Every cell is aria-invalid and the message describes the group.'],
      ['Read-only', 'The recess and digits stay; there is no text cursor.', 'Read with the digit; cannot be changed.'],
      ['Disabled', 'The recess shadow goes and the cells fade.', 'Skipped by Tab.'],
    ],
    interactions: [
      ['Keyboard', '0 to 9', 'Fills the cell and moves to the next one.', 'native'],
      ['Keyboard', 'Backspace', 'Clears the cell; in an empty cell it goes back and clears the one before.', 'native'],
      ['Keyboard', 'Arrow keys, Home, End', 'Walk the cells that hold a digit and the first empty one.', 'native'],
      ['Paste or autofill', 'Ctrl+V, the phone’s code suggestion', 'Fills every cell from the one that has focus.', 'native'],
      ['Screen reader', 'Read', 'A labelled group of cells, each named Digit n of N.', 'role="group", aria-label'],
    ],
    loading: <p>PinInput has no loading state. While a code is being checked, disable the row or show the wait in the primary key.</p>,
    focus: <p>Focus starts on the first cell with <code>autoFocus</code>, or on the first empty cell when the person clicks the label. A cell past the first empty one cannot take focus, so the code always grows from the left.</p>,
  },
  deepDive: { na: 'PinInput has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'length',
      rules: <p><code>length</code> sets the number of cells, six by default. Match it to the code you send: four for a PIN, six for most one-time codes, and no more than eight.</p>,
      pair: { do: <PinInput label="Door PIN" length={4} />, doNote: 'Four cells for a four-digit PIN.', dont: <PinInput label="Door PIN" length={12} />, dontNote: 'Twelve cells for four digits leave eight windows nobody fills.' },
    },
    {
      name: 'mask',
      rules: <p><code>mask</code> shows each digit as a dot. Use it for a PIN that someone may watch over a shoulder, not for a text-message code, which the person needs to compare with the message.</p>,
      pair: { do: <PinInput label="Door PIN" length={4} mask defaultValue="73" />, doNote: 'A PIN, masked.', dont: <PinInput label="Verification code" mask defaultValue="482" />, dontNote: 'A text-message code, masked: the person cannot check it.' },
    },
    {
      name: 'error',
      rules: <p>Use <code>error</code> after the code has been checked and was wrong. The message says what happened and what to do. Do not set it while the person is still typing.</p>,
      pair: { do: <PinInput label="Verification code" defaultValue="482915" error="That code is not right. Check the message and try again." />, doNote: 'The problem and the way out.', dont: <PinInput label="Verification code" defaultValue="482915" error="Invalid." />, dontNote: 'No reason and no next step.' },
    },
    {
      name: 'onComplete',
      rules: <p><code>onComplete</code> runs once when the last cell is filled. Use it to check the code at once, and keep the confirm key for people who want to check it themselves.</p>,
      pair: { do: <PinInput label="Verification code" defaultValue="482915" onComplete={() => undefined} />, doNote: 'The code is checked when the sixth digit lands.', dont: <PinInput label="Verification code" defaultValue="4829" onComplete={() => undefined} />, dontNote: 'Four of six digits: nothing is checked until the last cell is filled.' },
    },
    {
      name: 'readOnly and disabled',
      rules: <p><code>readOnly</code> keeps the digits readable and copyable while they cannot change, such as a code the device shows you to read out. <code>disabled</code> takes the field out of the form and fades it.</p>,
      pair: { do: <PinInput label="Pairing code" defaultValue="604217" readOnly />, doNote: 'The digits stay readable.', dont: <PinInput label="Pairing code" defaultValue="604217" disabled />, dontNote: 'Disabled fades the digits the person wants to read.' },
    },
  ],
  related: [['/components/input', 'Input', 'Text, an ID or a code with letters.'], ['/components/number-input', 'NumberInput', 'A quantity set with steps and limits.'], ['/components/password-input', 'PasswordInput', 'A secret of any length.']],
  references: [
    { title: 'HTML · autocomplete="one-time-code"', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#one-time-code', why: 'How a phone offers the code it just received.' },
    { title: 'WCAG 2.2 · 3.3.8 Accessible Authentication', url: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html', why: 'Why paste and autofill must work in a code field.' },
    { title: 'WAI-ARIA Authoring Practices · Group role', url: 'https://www.w3.org/WAI/ARIA/apg/', why: 'A labelled group of inputs read as one field.' },
  ],
};
