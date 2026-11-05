// Usage tab for OTPFlow (component-depth.md U1–U14). OTPFlow is the whole one-time-code step of a sign-in.
import { Button, OTPFlow } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card"><div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div></div>;
const flow = (extra: Partial<React.ComponentProps<typeof OTPFlow>> = {}) => <OTPFlow destination="+66 81 234 5678" resendIn={20} {...extra} />;

export const OTPFLOW: Depth = {
  overview: (
    <>
      <p>OTPFlow is the whole code step of a sign-in, the screen that follows “we sent you a code”. It puts a heading, a window with the destination and a countdown, the PinInput and a send-again key in one column.</p>
      <p>The flow does no network work. You send the code and check it; the flow prints where it went, counts down to the next chance, passes you the full code and shows the verdict you set.</p>
    </>
  ),
  whenToUse: ['A sign-in or sign-up step that asks for a code sent by text message or email.', 'A step that confirms a phone number or address before a change is saved.'],
  whenNot: [
    { situation: 'A code field inside a form that has other fields', to: '/components/pin-input', label: 'PinInput' },
    { situation: 'A secret the person chose', to: '/components/password-input', label: 'PasswordInput' },
    { situation: 'A message about a finished task', to: '/components/banner', label: 'Banner' },
  ],
  variants: { na: 'OTPFlow has one look. Where the check has got to is the status prop, covered under Modifiers.' },
  anatomy: {
    render: flow(),
    parts: [
      { part: 'Title', selector: '[data-component="OTPFlow"] > h3', what: 'The step’s name, a heading of the level you choose.' },
      { part: 'Window', selector: '[data-component="OTPFlow"] > div:nth-child(2)', what: 'A recessed display: where the code went, and the time to the next one.' },
      { part: 'Digit row', selector: '[data-component="OTPFlow"] > [data-component="PinInput"]', what: 'The PinInput, with its label and one 44px cell for each digit.' },
      { part: 'Message', selector: '[data-component="OTPFlow"] > div:nth-child(4)', what: 'One line for the hint, the check and success words, or nothing.' },
      { part: 'Send-again key', selector: '[data-component="OTPFlow"] button', what: 'A plain key that is flat until the countdown ends.' },
    ],
  },
  sizes: { na: 'OTPFlow has one size. The digit cells are 44px and the key is 44px tall.' },
  emphasis: { na: 'Nothing in OTPFlow is orange. The unit that holds it keeps its one primary control.' },
  placement: {
    rows: [['A sheet or a page of its own', 'The flow fills the width of its column; give the column a width such as 360px.'], ['Inside a dialog', 'Put it under the dialog’s title and give the flow a short title of its own.']],
    examples: [{ title: 'In a unit', render: <Unit>{flow()}</Unit> }],
  },
  combinations: {
    good: [['OTPFlow + Dialog', 'A confirmation step over the page that asked for it.'], ['OTPFlow + Banner', 'A Banner above the unit for a problem that is not about the code, such as a failed send.']],
    avoid: [{ title: 'a second primary key beside OTPFlow', why: 'The code is sent when the last digit is filled, so a verify key is not needed. Two orange keys also break the one-loud-thing rule.', render: <Unit><div style={{ display: 'grid', gap: 'var(--ds-gap-lg)' }}>{flow()}<Button kind="primary">Verify</Button></div></Unit> }],
  },
  content: {
    formula: <p>Title with a verb and a noun, as in <em>Enter the code</em>. Give the destination as the person knows it, with the country code for a phone. Keep the hint to one sentence.</p>,
    pair: {
      do: <Unit>{flow({ title: 'Enter the code' })}</Unit>, doNote: 'A verb and a noun.',
      dont: <Unit>{flow({ title: 'Two-step verification' })}</Unit>, dontNote: 'It names the system and not the task.',
    },
    overflow: { text: 'A long address wraps inside the window and the countdown keeps its place.', render: <Unit>{flow({ destination: 'a.very.long.name.for.a.mailbox@subdomain.example-company.com' })}</Unit> },
    rtl: { text: 'In right-to-left languages the destination sits on the right and the countdown on the left. The digits keep their order.', render: <div dir="rtl"><Unit>{flow({ title: 'أدخل الرمز', destination: '+966 50 123 4567', labels: { label: 'رمز التحقق', sentTo: 'أُرسل إلى', resend: 'إعادة الإرسال', hint: 'اكتب الأرقام أو الصق الرمز كاملاً.' } })}</Unit></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. They wrap and the window keeps its height.', render: <Unit>{flow({ title: 'Bestätigungscode eingeben', labels: { sentTo: 'Gesendet an', resend: 'Erneut senden', hint: 'Tippe die Ziffern oder füge den ganzen Code ein.' } })}</Unit> },
  },
  behaviours: {
    states: [
      ['Waiting', 'The countdown in secondary ink; the key is flat.', 'The key is disabled and described by the seconds left.'],
      ['Ready', 'The countdown in primary ink; the key stands at full height.', 'Announced once: you can send a new code.'],
      ['Verifying', 'The digits are read-only and a line says the code is being checked.', 'Announced in the status line.'],
      ['Error', 'Red edges on every digit, a glyph and the message under the row.', 'Announced in the status line; every digit is aria-invalid.'],
      ['Success', 'A check and the word Verified under the row.', 'Announced in the status line.'],
    ],
    interactions: [
      ['Keyboard', 'Digits, Backspace, arrows, Home, End', 'The same keys as PinInput.', 'PinInput'],
      ['Keyboard', 'Tab, Enter or Space', 'Tab reaches the key once it is ready; Enter or Space asks for a new code.', 'native'],
      ['Clipboard', 'Paste', 'A pasted code fills every digit and calls onVerify.', 'PinInput'],
      ['Screen reader', 'Status', 'A polite status line speaks the verdicts, the new code and the end of the countdown. It does not speak each second.', 'role=status'],
    ],
    loading: <p>Set <code>status="verifying"</code> while your code checks the digits. The digits become read-only, so a changed digit or a second paste cannot cross the check.</p>,
    focus: <p>Focus starts on the first digit with <code>autoFocus</code>. After a new code is asked for, focus returns to the first digit and the old digits are cleared.</p>,
  },
  deepDive: { na: 'OTPFlow has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'status',
      rules: <p><code>idle</code> shows the hint. <code>verifying</code> and <code>success</code> make the digits read-only. <code>error</code> marks every digit invalid and prints the message. Set it back to <code>idle</code> when the person edits a rejected code.</p>,
      pair: { do: <Unit>{flow({ status: 'error' })}</Unit>, doNote: 'The message names the problem and the way out.', dont: <Unit>{flow({ status: 'error', error: 'Error' })}</Unit>, dontNote: 'One word that says nothing.' },
    },
    {
      name: 'resendIn',
      rules: <p>Seconds before a new code may be asked for. It counts from a clock time, so a tab that was in the background catches up. Keep it at 30 to 60 seconds; shorter invites double sends.</p>,
      pair: { do: <Unit>{flow({ resendIn: 30 })}</Unit>, doNote: 'Thirty seconds.', dont: <Unit>{flow({ resendIn: 3 })}</Unit>, dontNote: 'Three seconds is no wait at all.' },
    },
    {
      name: 'labels',
      rules: <p>Every built-in word can be replaced, one by one. Pass them all when you translate, so no English is left in the status line.</p>,
      pair: { do: <Unit>{flow({ labels: { sentTo: 'Gesendet an', resend: 'Erneut senden' } })}</Unit>, doNote: 'Words that show and words that are spoken change together.', dont: <Unit>{flow({ labels: { sentTo: 'Gesendet an' } })}</Unit>, dontNote: 'Half translated: the key and the hint stay English.' },
    },
  ],
  related: [['/components/pin-input', 'PinInput', 'The digit row on its own, inside your own form.'], ['/components/dialog', 'Dialog', 'A sheet to hold the step.'], ['/components/banner', 'Banner', 'A problem that is not about the code.']],
  references: [
    { title: 'WAI-ARIA · status role', url: 'https://www.w3.org/TR/wai-aria-1.2/#status', why: 'How the verdicts are spoken without moving focus.' },
    { title: 'WCAG 2.2 · 3.3.7 Redundant Entry', url: 'https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html', why: 'Why a pasted or autofilled code must be accepted.' },
    { title: 'web.dev · SMS OTP form best practices', url: 'https://web.dev/articles/sms-otp-form', why: 'Autocomplete one-time-code and the digits-only field.' },
  ],
};
