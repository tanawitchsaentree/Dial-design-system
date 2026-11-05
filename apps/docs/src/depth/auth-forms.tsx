// Usage tab for AuthForms (component-depth.md U1–U14). SignInForm, SignUpForm and ResetPasswordForm are the three screens of getting in.
import { Button, Card, ResetPasswordForm, SignInForm, SignUpForm } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => (
  <div className="demo-box demo-card">
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Card padding="lg">{children}</Card>
    </div>
  </div>
);

export const AUTH_FORMS: Depth = {
  overview: (
    <>
      <p>AuthForms are three ready-made screens for getting into an app: <code>SignInForm</code>, <code>SignUpForm</code> and <code>ResetPasswordForm</code>. Each is a title, a few fields built on Form, and one foot row with a plain link at the start and the unit’s primary key at the end.</p>
      <p>They call <code>onSubmit(values)</code> and nothing else. You do the sign-in, the account creation or the mail; the form counts the problems, links each to its field, and holds the key in its Sending state while your promise runs.</p>
    </>
  ),
  whenToUse: ['A page or a sheet where a person signs in, creates an account or asks for a new password.', 'A start screen where you want the autocomplete words set right so a password manager can fill the fields.'],
  whenNot: [
    { situation: 'A form with your own fields', to: '/components/form', label: 'Form' },
    { situation: 'The code step after sign-in', to: '/components/otp-flow', label: 'OTPFlow' },
    { situation: 'A secret field inside another form', to: '/components/password-input', label: 'PasswordInput' },
  ],
  variants: { na: 'AuthForms have no kind prop. The three screens are three components, and ResetPasswordForm has a mode, covered under Modifiers.' },
  anatomy: {
    render: <SignInForm remember forgotHref="#reset" alternateHref="#sign-up" />,
    parts: [
      { part: 'Title', selector: '[data-component="SignInForm"] > h3', what: 'The name of the screen, a heading of the level you choose.' },
      { part: 'Description', selector: '[data-component="SignInForm"] > p', what: 'One line in caption size that says what the screen is for.' },
      { part: 'Fields', selector: '[data-component="SignInForm"] form > div:first-of-type', what: 'The wells in one column, each with its label above.' },
      { part: 'Foot row', selector: '[data-component="SignInForm"] form > div:last-of-type', what: 'The plain link at the start and the primary key at the end.' },
      { part: 'Alternate link', selector: '[data-component="SignInForm"] > div:last-of-type', what: 'The words and the link to the sibling screen.' },
    ],
  },
  sizes: { na: 'AuthForms have one size. The wells, the key and the links are all 44px tall.' },
  emphasis: { na: 'Each form holds exactly one orange part, its submit key. There are no social-login buttons and no second primary.' },
  placement: {
    rows: [['A page of its own', 'Put the form in a Card in the middle of the page; the form fills the width of its column.'], ['Inside a dialog', 'Give the form a level that fits under the dialog’s title and leave the dialog without its own submit key.']],
    examples: [{ title: 'In a card', render: <Unit><SignInForm forgotHref="#reset" /></Unit> }],
  },
  combinations: {
    good: [['SignInForm + Card', 'The card is the unit; the form fills it.'], ['SignInForm + Banner', 'A Banner above the card for a problem that is not about a field, such as the service being down.']],
    avoid: [{ title: 'a second primary key beside the form', why: 'The form already has its one orange key. A second one breaks the one-loud-thing rule and leaves the person with two ways to send.', render: <Unit><SignInForm /><div style={{ marginBlockStart: 'var(--ds-gap-lg)' }}><Button kind="primary">Email me a link</Button></div></Unit> }],
  },
  content: {
    formula: <p>Name the screen with a verb and a noun, <em>Create an account</em>. Write the key as the same verb as the title. Keep the description to one short sentence.</p>,
    pair: {
      do: <Unit><SignUpForm askName={false} /></Unit>, doNote: 'Title and key use the same verb.',
      dont: <Unit><SignUpForm askName={false} title="Welcome aboard!" labels={{ submit: 'Go' }} /></Unit>, dontNote: 'The title promises a party and the key says nothing.',
    },
    overflow: { text: 'A long title wraps inside the card and the foot row wraps under it. Nothing is cut.', render: <Unit><SignInForm title="Sign in to the house with the very long name on the hill" forgotHref="#reset" /></Unit> },
    rtl: { text: 'In right-to-left languages the link sits on the right and the key on the left. Email addresses keep their direction.', render: <div dir="rtl"><Unit><SignInForm forgotHref="#reset" title="تسجيل الدخول" description="استخدم البريد الذي سجلت به." labels={{ email: 'البريد', password: 'كلمة المرور', forgot: 'نسيت كلمة المرور؟', submit: 'دخول' }} /></Unit></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The foot row wraps and the key keeps its size.', render: <Unit><SignInForm forgotHref="#reset" labels={{ title: 'Anmelden', description: 'Nimm die E-Mail, mit der du dich registriert hast.', forgot: 'Passwort vergessen?', submit: 'Jetzt anmelden' }} /></Unit> },
  },
  behaviours: {
    states: [
      ['Default', 'Fields empty, the key at full height.', 'Each field has its printed label as its name.'],
      ['Problems', 'A window at the top counts the problems and names each field.', 'Focus moves to the window; each name links to its field.'],
      ['Sending', 'The key says Sending and goes flat while your promise runs.', 'The form is aria-busy and a status line speaks it.'],
      ['Sent (reset)', 'A check and a sentence replace the fields.', 'The sentence takes focus so it is read out.'],
    ],
    interactions: [
      ['Keyboard', 'Enter in a field', 'Sends the form, the same as pressing the key.', 'native'],
      ['Keyboard', 'Tab', 'Fields, then the link, then the key. The password key sits beside its well.', 'native'],
      ['Password manager', 'Autofill', 'Sign-in uses username and current-password; sign-up and choose use email or name and new-password.', 'autocomplete'],
      ['Screen reader', 'Problems', 'The summary is a group named by its count; each row is a link to the field.', 'Form'],
    ],
    loading: <p>Return a promise from <code>onSubmit</code>. The key shows Sending and ignores presses until it settles. Return <code>{'{ password: "…" }'}</code> from it when your server says no, and the problem joins the summary.</p>,
    focus: <p>Focus stays where the person left it. After a failed send it moves to the summary; after <code>sent</code> turns true it moves to the confirmation.</p>,
  },
  deepDive: { na: 'AuthForms have no variant prop, so there is no section per variant.' },
  modifiers: [
    {
      name: 'remember',
      rules: <p>Shows a remember-me option on <code>SignInForm</code>. The value arrives as <code>remember: true</code> in <code>onSubmit</code>. Leave it off when you decide the session length yourself.</p>,
      pair: { do: <Unit><SignInForm remember /></Unit>, doNote: 'One option, named by what it does.', dont: <Unit><SignInForm remember labels={{ remember: 'Yes' }} /></Unit>, dontNote: 'A bare Yes names nothing.' },
    },
    {
      name: 'mode',
      rules: <p><code>request</code> on <code>ResetPasswordForm</code> asks for the email. <code>choose</code> is for the page the link opens and asks for a new password twice. Set <code>sent</code> in <code>request</code> mode once the link is out.</p>,
      pair: { do: <Unit><ResetPasswordForm mode="choose" /></Unit>, doNote: 'The new-password page asks for the password and nothing else.', dont: <Unit><ResetPasswordForm /></Unit>, dontNote: 'The request screen cannot save a password.' },
    },
    {
      name: 'labels',
      rules: <p>Every built-in word can be replaced one by one. Pass them all when you translate, and pass <code>messages</code>, <code>summaryTitle</code> and <code>sendingLabel</code> too, so no English is left in the problem words.</p>,
      pair: { do: <Unit><SignInForm labels={{ title: 'Anmelden', submit: 'Anmelden', email: 'E-Mail', password: 'Passwort' }} description={null} /></Unit>, doNote: 'All the words that show change together.', dont: <Unit><SignInForm labels={{ title: 'Anmelden' }} description={null} /></Unit>, dontNote: 'Half translated.' },
    },
    {
      name: 'minLength',
      rules: <p>The shortest new password, printed in the rule under the field and checked by the form. Match what your server enforces.</p>,
      pair: { do: <Unit><SignUpForm askName={false} minLength={12} /></Unit>, doNote: 'The rule on screen is the rule in force.', dont: <Unit><SignUpForm askName={false} minLength={1} /></Unit>, dontNote: 'One character is not a password.' },
    },
  ],
  related: [['/components/form', 'Form', 'Your own fields with the same summary and sending key.'], ['/components/otp-flow', 'OTPFlow', 'The code step after sign-in.'], ['/components/password-input', 'PasswordInput', 'The password field with its show key.']],
  references: [
    { title: 'HTML Standard · autofill', url: 'https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill', why: 'The username, current-password and new-password words that let a password manager fill the right field.' },
    { title: 'WCAG 2.2 · 3.3.8 Accessible Authentication', url: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html', why: 'Why the fields accept pasted and autofilled values and need no puzzle.' },
    { title: 'GOV.UK Design System · error summary', url: 'https://design-system.service.gov.uk/components/error-summary/', why: 'The pattern behind the problem window at the top of every form.' },
  ],
};
