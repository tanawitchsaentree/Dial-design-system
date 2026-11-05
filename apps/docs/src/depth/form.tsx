// Usage tab for Form (component-depth.md U1–U14). Form gathers named fields, words the problems and sends the values.
import { Form, FormItem, FormSubmit, Input, Stack, Textarea } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const room = (props: Record<string, unknown> = {}) => (
  <Form onSubmit={() => undefined} {...props}>
    <Stack gap="lg">
      <FormItem name="room"><Input label="Room name" required /></FormItem>
      <FormItem name="note"><Textarea label="Note" rows={2} /></FormItem>
      <div><FormSubmit>Save room</FormSubmit></div>
    </Stack>
  </Form>
);

export const FORM: Depth = {
  overview: (
    <>
      <p>Form is the case around the fields of a sheet, such as a room with a name, a note and a target. It is a native form, so the browser keeps the values and checks each field, and Form words the problems and sends the result to <code>onSubmit</code>.</p>
      <p>Press Send with a field wrong and one window at the top counts the problems and names each one. Its rows are links, and pressing one puts focus in that field. The window takes focus itself, so a screen reader reads it first. After that, a field is checked again as it changes and its row leaves the window once it is right.</p>
    </>
  ),
  whenToUse: ['To collect several named fields and send them together.', 'To tell every problem of a failed send in one place, linked to its field.', 'To hold the submit key while a send runs.'],
  whenNot: [
    { situation: 'A single field that saves as you leave it', to: '/components/editable', label: 'Editable' },
    { situation: 'Naming a group of controls inside a form', to: '/components/fieldset', label: 'Fieldset' },
    { situation: 'Splitting a long form into numbered sections', to: '/components/stepper', label: 'Stepper' },
  ],
  variants: { na: 'Form has one look. The summary window and the submit key are the same in every form.' },
  anatomy: {
    render: room(),
    parts: [
      { part: 'Form', selector: '[data-component="Form"]', what: 'A native form with no browser bubbles. It holds the fields and the submit key in one column.' },
      { part: 'Submit key', selector: '[data-component="Form"] button[type="submit"]', what: 'The unit’s one orange key. While a send runs it is flat and says Sending.' },
      { part: 'Summary window', selector: '[data-component="FormSummary"]', what: 'Appears after a failed send, above the fields. It holds the count, one link per problem and its message.' },
    ],
  },
  sizes: { na: 'Form has no size. The fields and the key inside it keep their own.' },
  emphasis: { na: 'The submit key is the unit’s one orange part. The summary window is ink and recess, never orange.' },
  placement: {
    rows: [['A sheet or a screen', 'Fields in one column, the orange key last, and the summary window above the first field.'], ['One orange key', 'Use one FormSubmit per form. Other keys inside stay as key buttons.']],
    examples: [{ title: 'A room sheet', render: <Unit>{room()}</Unit> }],
  },
  combinations: {
    good: [['Form + Input', 'Input prints its own label and takes the error, so wrap it in a FormItem with no label.'], ['Form + FormField', 'Give FormItem a label and it wraps a bare control in a FormField for you.'], ['Form + Fieldset', 'A Fieldset groups related fields inside the form; the form still reads each name.']],
    avoid: [{ title: 'a form with two orange keys', why: 'Only one key sends. Make the second a key button.', render: <Unit><Form><Stack gap="lg"><FormItem name="room"><Input label="Room name" /></FormItem><div><FormSubmit>Save</FormSubmit> <FormSubmit>Save and add another</FormSubmit></div></Stack></Form></Unit> }],
  },
  content: {
    formula: <p>Word each message as what to do, as in <em>Enter a room name.</em> Keep the field’s printed label a noun, because the summary link repeats it.</p>,
    pair: {
      do: room(), doNote: 'A noun for the label; the message says what to enter.',
      dont: <Form><FormItem name="room"><Input label="Please fill in the name of the room here" /></FormItem></Form>, dontNote: 'The summary would repeat a sentence as a link.',
    },
    overflow: { text: 'A long label wraps inside its link and the row grows. The count and the key do not move.', render: room() },
    rtl: { text: 'In right-to-left languages the count and links sit on the right and the rows read from the right.', render: <div dir="rtl"><Form onSubmit={() => undefined}><Stack gap="lg"><FormItem name="room"><Input label="اسم الغرفة" required /></FormItem><div><FormSubmit>حفظ</FormSubmit></div></Stack></Form></div> },
    expansion: { text: 'Messages in German or Finnish run about 30% longer. They wrap under the link and the window grows downward.', render: room() },
  },
  behaviours: {
    states: [
      ['Idle', 'No summary window. Fields show no error.', 'No live announcement.'],
      ['Failed send', 'The summary window appears at the top and takes focus. Each wrong field shows its message and glyph.', 'Focus lands on the window; its heading names the count.'],
      ['Sending', 'The key goes flat and says Sending.', 'A polite status reads Sending and the form is aria-busy.'],
    ],
    interactions: [
      ['Keyboard', 'Enter', 'In a field, sends the form. On a summary link, puts focus in that field.', 'native'],
      ['Keyboard', 'Tab', 'After a failed send, moves from the window through its links and on to the fields.', 'native'],
      ['Pointer', 'Press a link', 'Puts focus in the field it names.', 'focus'],
      ['Screen reader', 'Read', 'The window is a group named by its heading, which starts with the count.', 'aria-labelledby'],
    ],
    loading: <p>While <code>onSubmit</code> returns a promise, the form is in its sending state: the key is aria-disabled, says Sending, and a second press or Enter does nothing. The state ends when the promise settles.</p>,
    focus: <p>After a failed send focus moves to the summary window. Pressing a link moves it to the field. Form never moves focus on a successful send; do that in <code>onSubmit</code>.</p>,
  },
  deepDive: { na: 'Form has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'validate',
      rules: <p>Use <code>validate</code> for rules a browser constraint cannot say, such as two fields that must match. Return an object of messages by field name. Use constraints (<code>required</code>, <code>pattern</code>, <code>min</code>) for everything else.</p>,
      pair: {
        do: <Form validate={(v) => (v.a !== v.b ? { b: 'The two do not match.' } : undefined)} onSubmit={() => undefined}><Stack gap="lg"><FormItem name="a"><Input label="Door code" defaultValue="1" /></FormItem><FormItem name="b"><Input label="Repeat the code" defaultValue="2" /></FormItem><div><FormSubmit>Set</FormSubmit></div></Stack></Form>,
        doNote: 'A rule across two fields.',
        dont: <Form onSubmit={() => undefined}><FormItem name="a"><Input label="Door code" required /></FormItem></Form>, dontNote: 'A plain required field needs no validate.',
      },
    },
    {
      name: 'messages',
      rules: <p>Pass <code>messages</code> to replace the built-in sentences, one per constraint. Each is a string or a function of the field’s label. Set <code>summaryTitle</code> and <code>sendingLabel</code> too, so the whole form speaks your language.</p>,
      pair: {
        do: <Form messages={{ valueMissing: (label) => `${label}: please enter a value.` }} onSubmit={() => undefined}><FormItem name="a"><Input label="Room name" required /></FormItem><FormSubmit>Save</FormSubmit></Form>,
        doNote: 'The sentence names the field.',
        dont: <Form messages={{ valueMissing: () => 'Required' }} onSubmit={() => undefined}><FormItem name="a"><Input label="Room name" required /></FormItem><FormSubmit>Save</FormSubmit></Form>,
        dontNote: 'Every row of the window would say the same word.',
      },
    },
  ],
  related: [['/components/form-field', 'FormField', 'A label, a control and its messages wired together.'], ['/components/fieldset', 'Fieldset', 'A named group of controls.'], ['/components/button', 'Button', 'The key that Form’s submit builds on.']],
  references: [
    { title: 'GOV.UK Design System · Error summary', url: 'https://design-system.service.gov.uk/components/error-summary/', why: 'A titled list at the top that takes focus and links to each field.' },
    { title: 'MDN · Constraint validation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation', why: 'The validity states Form reads and words.' },
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'Why each problem is named in words.' },
  ],
};
