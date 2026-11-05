// Usage tab for FormField (component-depth.md U1–U14). FormField joins a Label, a control and its small print.
import { FormField, Stack, Switch } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const FORM_FIELD: Depth = {
  overview: (
    <>
      <p>FormField is for a control that has no label of its own: a bare input, a Switch, a part you built. It prints the name above the control, the hint and the error under it, and links all three for screen readers.</p>
      <p>It draws no box and no colour. The Label and the HelperText bring their own ink, so a field in a settings list looks like the printing on the case.</p>
    </>
  ),
  whenToUse: ['To name a control that has no label of its own.', 'To print a hint and an error the same way across a form.'],
  whenNot: [
    { situation: 'Naming a group of related controls', to: '/components/fieldset', label: 'Fieldset' },
    { situation: 'A text field, which prints its own label', to: '/components/input', label: 'Input' },
  ],
  variants: { na: 'FormField has one look. The layout, stacked or inline, is a prop covered under Modifiers.' },
  anatomy: {
    render: (
      <FormField label="Room name" hint="Shown on the home screen." error="Use a name that is not taken.">
        <input defaultValue="Living room" />
      </FormField>
    ),
    parts: [
      { part: 'Label', selector: '[data-component="FormField"] [data-component="Label"]', what: 'The printed name, with a required or optional mark.' },
      { part: 'Control', selector: '[data-component="FormField"] input', what: 'Your control, given the id and the aria props.' },
      { part: 'Messages', selector: '[data-component="FormField"] [data-component="HelperText"]', what: 'The error with its glyph, then the hint.' },
    ],
  },
  sizes: { na: 'FormField has one size. The control sets its own height; the field only adds the label and the lines.' },
  emphasis: { na: 'FormField is never loud. An error is critical red with a glyph, and nothing in it is orange.' },
  placement: {
    rows: [['A settings list', 'Fields stand in one column, each with its label above.'], ['A wide sheet with short controls', 'Use the inline layout so labels line up at the start.']],
    examples: [{ title: 'Stacked fields', render: <Unit><Stack gap="lg"><FormField label="Owner" required><input defaultValue="Mira" /></FormField><FormField label="Nickname" optional><input /></FormField></Stack></Unit> }],
  },
  combinations: {
    good: [['FormField + Switch', 'The render-prop puts the id and the description on the switch.'], ['FormField + Button', 'The orange key that saves comes after the last field.']],
    avoid: [{ title: 'FormField around Input', why: 'Input prints its own label, so the name appears twice. Use Input alone.', render: <Unit><FormField label="Name"><input aria-label="Name" /></FormField></Unit> }],
  },
  content: {
    formula: <p>Label with a noun, as in <em>Room name</em>. Write the hint as the format. Write the error as what is wrong and how to fix it.</p>,
    pair: {
      do: <FormField label="Room name" error="Use a name that is not taken."><input defaultValue="Living room" /></FormField>, doNote: 'The error says what to do.',
      dont: <FormField label="Room name" error="Invalid input."><input defaultValue="Living room" /></FormField>, dontNote: 'The error does not say what is wrong.',
    },
    overflow: { text: 'A long label wraps in its column. The control keeps its width.', render: <FormField label="Target temperature for the upstairs rooms while nobody is at home" optional><input /></FormField> },
    rtl: { text: 'In right-to-left languages the label and the marks sit on the right.', render: <div dir="rtl"><FormField label="اسم الغرفة" hint="يظهر على الشاشة الرئيسية."><input /></FormField></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap and the control does not move.', render: <FormField label="Zieltemperatur für das Wohnzimmer" hint="Zwischen 5 und 30 Grad."><input /></FormField> },
  },
  behaviours: {
    states: [
      ['Default', 'Label, control and hint.', 'The label is the control’s name; the hint is its description.'],
      ['Invalid', 'An error line with a glyph under the control.', 'aria-invalid on the control; the error is read first, then the hint.'],
      ['Required', 'The mark printed by the Label.', 'required on the control.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the control. The field takes no focus itself.', 'native'],
      ['Pointer', 'Press the label', 'Moves focus to the control.', 'label htmlFor'],
      ['Screen reader', 'Read', 'Name from the label, description from the hint and error.', 'aria-describedby'],
    ],
    loading: <p>FormField has no loading state.</p>,
    focus: <p>Focus stays on the control. When an error appears, the message is announced because it prints in a polite live region.</p>,
  },
  deepDive: { na: 'FormField has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'layout',
      rules: <p><code>stacked</code> is the default. Use <code>inline</code> for short controls in a settings list; it wraps under the label when the column is narrow.</p>,
      pair: {
        do: <FormField layout="inline" label="Heating"><input /></FormField>, doNote: 'A short control beside its label.',
        dont: <FormField layout="inline" label="Notes"><textarea rows={4} /></FormField>, dontNote: 'A tall control looks lost beside a one-line label.',
      },
    },
    {
      name: 'children',
      rules: <p>Pass one element and it receives the props. Pass a function when the control is nested or needs the id on a different part.</p>,
      pair: {
        do: <FormField label="Night mode">{(c) => <Switch id={c.id} aria-describedby={c['aria-describedby']} />}</FormField>, doNote: 'The function puts the id on the switch.',
        dont: <FormField label="Night mode"><div><Switch /></div></FormField>, dontNote: 'The id lands on the wrapper, not the switch.',
      },
    },
  ],
  related: [['/components/label', 'Label', 'The printed name on its own.'], ['/components/helper-text', 'HelperText', 'The line under a part.'], ['/components/fieldset', 'Fieldset', 'A named group of controls.']],
  references: [
    { title: 'WAI-ARIA · aria-describedby', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-describedby', why: 'How the hint and error are linked to the control.' },
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'Why the error is text and not colour alone.' },
    { title: 'GOV.UK Design System · Error message', url: 'https://design-system.service.gov.uk/components/error-message/', why: 'Writing an error that says what to do.' },
  ],
};
