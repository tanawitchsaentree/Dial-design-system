// Usage tab for PasswordInput (component-depth.md U1–U14). PasswordInput is Input's recessed well for a secret, with a latching key beside it.
import { Button, PasswordInput, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const field = <PasswordInput label="New password" autoComplete="new-password" hint="Use 12 characters or more." defaultValue="correct horse" strength="fair" />;

export const PASSWORD_INPUT: Depth = {
  overview: (
    <>
      <p>PasswordInput takes a secret in the same recessed well as Input. A round key stands beside the well. Press it and the characters show; press it again and they hide. The well prints the word for the state, Hidden or Shown, and the key's lock glyph opens while the characters are shown, so nobody has to read the state from a picture or a colour.</p>
      <p>Set <code>autoComplete</code> on every use: <code>new-password</code> on a sign-up or change form, <code>current-password</code> on a sign-in form. It can also print a strength line under the row. You compute the verdict and pass it in; the component only prints it.</p>
    </>
  ),
  whenToUse: ['To ask for a password, a passphrase or a Wi-Fi key.', 'To let people check what they typed before they submit it.', 'To show a strength reading on a form that sets a new password.'],
  whenNot: [
    { situation: 'Entering text that is not a secret', to: '/components/input', label: 'Input' },
    { situation: 'A one-time code or a PIN with a fixed length', to: '/components/input', label: 'Input with inputMode numeric' },
    { situation: 'Entering a number with a step and limits', to: '/components/number-input', label: 'NumberInput' },
  ],
  variants: { na: 'PasswordInput has one look, a well with a key beside it. The two sizes are covered under Sizes.' },
  anatomy: {
    render: field,
    parts: [
      { part: 'Label', selector: '[data-component="PasswordInput"] > label', what: 'The printed name above the row. It is also the accessible name.' },
      { part: 'Window', selector: '[data-component="PasswordInput"] > div > div', what: 'The recess that holds the characters and the state word.' },
      { part: 'Characters', selector: '[data-component="PasswordInput"] input', what: 'The secret, as dots while hidden and as text while shown.' },
      { part: 'State word', selector: '[data-component="PasswordInput"] > div > div > span', what: 'Hidden or Shown, printed after the characters in secondary ink.' },
      { part: 'Key', selector: '[data-component="PasswordInput"] > div > button', what: 'A 44px round key with a lock glyph. It latches down while the characters are shown.' },
      { part: 'Hint', selector: '[data-component="PasswordInput"] > p', what: 'A line under the row that says what to enter.' },
      { part: 'Strength', selector: '[data-component="PasswordInput"] > div:last-child', what: 'A polite live region that prints the strength word.' },
    ],
  },
  sizes: {
    md: { use: 'The default: a 44px well beside a 44px key, for forms and sheets.', pairs: 'Sits level with Input, Select and Button at md.' },
    lg: { use: 'A 52px well beside a 52px key with larger text, for the main field of a phone sheet.', pairs: 'Pairs with a lg Input or a lg Button.' },
  },
  emphasis: { na: 'PasswordInput is never the loud part of a unit. The key latches as neutral glass, so the orange stays on the unit’s primary control.' },
  placement: {
    rows: [['A sign-in form', 'The field stands under the account name, with the orange key last.'], ['A sign-up form', 'Use new-password, a hint with the rules and a strength line.'], ['A settings sheet', 'For a Wi-Fi key or a pairing secret, under its network name.']],
    examples: [{ title: 'In a sign-in card', render: <Unit><Stack gap="lg"><PasswordInput label="Password" autoComplete="current-password" /><Button kind="primary">Sign in</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['PasswordInput + Input', 'The account name is an Input and the secret is a PasswordInput, in one column.'], ['PasswordInput + Button', 'The orange key that submits comes after the last field.'], ['PasswordInput + hint', 'The hint names the rules before the person breaks one.']],
    avoid: [{ title: 'a PasswordInput for a name or an address', why: 'Password managers will offer to fill it and the characters hide for no reason. Use an Input.', render: <Unit><PasswordInput label="Street" autoComplete="off" /></Unit> }],
  },
  content: {
    formula: <p>Name the secret with a noun, as in <em>Password</em> or <em>Wi-Fi password</em>. Put the rules in <code>hint</code> and name the problem in <code>error</code>.</p>,
    pair: {
      do: <PasswordInput label="New password" autoComplete="new-password" hint="Use 12 characters or more." />, doNote: 'A noun, and the rule printed before it can be broken.',
      dont: <PasswordInput label="Enter a strong password" autoComplete="new-password" placeholder="12+ characters" />, dontNote: 'The rule lives in a placeholder that vanishes while typing.',
    },
    overflow: { text: 'A long label wraps above the row. The well shrinks to leave the key its 44px and never grows past its column.', render: <Unit><PasswordInput label="Password for the home network that the washer and the speaker share" autoComplete="new-password" /></Unit> },
    rtl: { text: 'In right-to-left languages the key sits on the left, the state word follows the characters and the characters stay left-to-right when they are Latin.', render: <div dir="rtl"><PasswordInput label="كلمة المرور" toggleLabel="إظهار كلمة المرور" shownWord="ظاهرة" hiddenWord="مخفية" defaultValue="abc12345" /></div> },
    expansion: { text: 'German labels can run 30% longer. They wrap above the row and the key does not move.', render: <PasswordInput label="Neues Kennwort für das Heimnetz" autoComplete="new-password" toggleLabel="Kennwort anzeigen" shownWord="Sichtbar" hiddenWord="Verborgen" /> },
  },
  behaviours: {
    states: [
      ['Hidden', 'The characters are dots, the lock is closed and the well prints Hidden.', 'The key is announced as a toggle button, not pressed.'],
      ['Shown', 'The characters are text, the lock is open, the key is latched down and the well prints Shown.', 'The key is announced as pressed.'],
      ['Hover', 'The key’s symbol darkens one step.', 'No change.'],
      ['Pressed', 'The key drops by its height and returns on the spring.', 'The state flips.'],
      ['Focus', 'A dark ring around the well, or around the key.', 'The label and the value, or the key name, are read.'],
      ['Invalid', 'The well edge turns critical red and a glyph and words print under the row.', 'aria-invalid and the message is read with the field.'],
      ['Read-only', 'The recess and ink stay; the key still works, so the secret can be read.', 'Announced as read-only.'],
      ['Disabled', 'The recess shadow goes, the characters fade and the key goes flat.', 'Announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves from the characters to the key, then on.', 'native'],
      ['Keyboard', 'Space, Enter', 'Latches or releases the key. Focus stays on the key.', 'button, aria-pressed'],
      ['Pointer', 'Press the key', 'Flips the state and keeps the caret in the field.', 'IconButton'],
      ['Touch', 'Tap the key', 'Flips the state without closing the on-screen keyboard.', 'IconButton'],
      ['Screen reader', 'Strength changes', 'The strength word is read when it changes.', 'aria-live polite'],
    ],
    loading: <p>PasswordInput has no loading state. While a check runs, leave the strength line as it is and disable the submit key.</p>,
    focus: <p>Focus lands on the characters first, then on the key. Pressing the key by pointer leaves the caret in the field; pressing it by keyboard keeps focus on the key so it can be pressed again.</p>,
  },
  deepDive: { na: 'PasswordInput has no variants, so there is no section per variant.' },
  modifiers: [
    {
      name: 'autoComplete',
      rules: <p>Always set it. <code>new-password</code> asks a password manager to offer a fresh password; <code>current-password</code> (the default) asks it to fill the saved one. The wrong value fills the wrong thing or fills nothing.</p>,
      pair: { do: <PasswordInput label="New password" autoComplete="new-password" />, doNote: 'A sign-up form says it wants a new one.', dont: <PasswordInput label="New password" />, dontNote: 'The default current-password makes the manager fill the old secret into a new-password box.' },
    },
    {
      name: 'strength',
      rules: <p>Pass <code>weak</code>, <code>fair</code> or <code>strong</code> from your own estimator. The component prints the word and announces it politely. Pass <code>null</code> to keep the empty line before the first reading, and <code>strengthText</code> to replace the words.</p>,
      pair: { do: <PasswordInput label="New password" autoComplete="new-password" defaultValue="abc123xyz" strength="fair" />, doNote: 'A word under the row.', dont: <PasswordInput label="New password" autoComplete="new-password" defaultValue="abc123xyz" />, dontNote: 'The person types blind and learns the rule only on submit.' },
    },
    {
      name: 'shown and defaultShown',
      rules: <p>Leave the characters hidden unless you have a reason. Use <code>defaultShown</code> for a Wi-Fi key the person reads aloud to someone else. Use <code>shown</code> with <code>onShownChange</code> to keep two fields in step, such as a password and its repeat.</p>,
      pair: { do: <PasswordInput label="Wi-Fi password" defaultValue="fernweh-2024" defaultShown />, doNote: 'Shown on purpose for a key that is read aloud.', dont: <PasswordInput label="Account password" defaultValue="fernweh-2024" defaultShown />, dontNote: 'An account secret on show at first sight.' },
    },
    {
      name: 'error',
      rules: <p>Use <code>error</code> for a rule the field can name, such as length or a reused password. Say what is wrong and what to do.</p>,
      pair: { do: <PasswordInput label="New password" autoComplete="new-password" defaultValue="abc" error="Too short. Use 12 characters or more." />, doNote: 'The problem and the way out.', dont: <PasswordInput label="New password" autoComplete="new-password" defaultValue="abc" error="Invalid password." />, dontNote: 'It names no problem and no way out.' },
    },
  ],
  related: [
    ['/components/input', 'Input', 'Text that is not a secret.'],
    ['/components/number-input', 'NumberInput', 'A number with a step and limits.'],
    ['/components/helper-text', 'HelperText', 'The line under a part. PasswordInput uses it for the hint, the error and the strength.'],
  ],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern (toggle button)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Why the key keeps one name and carries its state in aria-pressed.' },
    { title: 'HTML Living Standard · autocomplete attribute, new-password and current-password', url: 'https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete', why: 'What the two tokens tell a password manager.' },
    { title: 'WCAG 2.2 · 3.3.8 Accessible Authentication (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html', why: 'Why the field allows paste and password managers.' },
  ],
};
