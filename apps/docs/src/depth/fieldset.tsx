// Usage tab for Fieldset (component-depth.md U1–U14). Fieldset boxes related controls under one printed name.
import { Button, Checkbox, Fieldset, Input, Stack, Switch } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const night = (disabled = false) => (
  <Fieldset legend="Night mode" hint="Starts at 23:00." disabled={disabled}>
    <Stack gap="sm">
      <Switch label="Lower the heater" defaultChecked />
      <Switch label="Dim the lamps" />
    </Stack>
  </Fieldset>
);

export const FIELDSET: Depth = {
  overview: (
    <>
      <p>Fieldset draws a hairline box round controls that belong together, such as the switches of a night mode. The group’s name is printed on the top line of the box, and a line of small print can stand at the foot.</p>
      <p>It is printing, not a part: the box has no fill and no shadow. Disabling it switches off every control inside.</p>
    </>
  ),
  whenToUse: ['To group two or more controls that set one thing.', 'To switch off a set of controls together.', 'To give a group of checkboxes or switches a name.'],
  whenNot: [
    { situation: 'Grouping only radio options', to: '/components/radio', label: 'Radio' },
    { situation: 'Setting a section apart on the page', to: '/components/divider', label: 'Divider' },
    { situation: 'Putting a whole unit in a surface', to: '/components/card', label: 'Card' },
  ],
  variants: { na: 'Fieldset has one look, a printed box. Its state is the disabled prop, covered under Modifiers.' },
  anatomy: {
    render: night(),
    parts: [
      { part: 'Box', selector: '[data-component="Fieldset"]', what: 'A hairline box in the ring ink with no fill.' },
      { part: 'Name', selector: '[data-component="Fieldset"] > legend', what: 'The group’s name, set into the top line.' },
      { part: 'Small print', selector: '[data-component="Fieldset"] > p', what: 'An optional line at the foot, read out as the description.' },
    ],
  },
  sizes: { na: 'Fieldset has one size. It takes the width of its column and the height of what it holds.' },
  emphasis: { na: 'A Fieldset is printing and is never loud. Nothing in it is orange except a primary key you place inside.' },
  placement: {
    rows: [['Inside a unit', 'Boxes stand in one column, one per setting, with the orange key under the last.'], ['Around fields', 'Give each field its own printed label as well as the group name.']],
    examples: [{ title: 'Two boxes before the orange key', render: <Unit><Stack gap="lg">{night()}<Fieldset legend="Rooms"><Stack gap="sm"><Checkbox label="Kitchen" defaultChecked /><Checkbox label="Bedroom" /></Stack></Fieldset><Button kind="primary">Apply</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Fieldset + Switch', 'A box of switches that belong to one mode.'], ['Fieldset + Checkbox', 'A box of keys with the name above all of them.'], ['Fieldset + Input', 'Fields that share one setting, each with its own label.']],
    avoid: [{ title: 'a Fieldset round one control', why: 'A box round a single control repeats its label. Print the label and drop the box.', render: <Unit><Fieldset legend="Lamp"><Switch label="Lamp" /></Fieldset></Unit> }],
  },
  content: {
    formula: <p>Name the box with a noun, as in <em>Night mode</em> or <em>Schedule</em>. Do not end the name with a colon. Keep the small print to one sentence.</p>,
    pair: {
      do: <Fieldset legend="Schedule"><Input label="Starts" defaultValue="23:00" /></Fieldset>, doNote: 'A noun that names the group.',
      dont: <Fieldset legend="Please choose your schedule:"><Input label="Starts" defaultValue="23:00" /></Fieldset>, dontNote: 'A sentence with a colon.',
    },
    overflow: { text: 'A long name wraps on the top line and the box grows with its content.', render: <Fieldset legend="Heating schedule for all the upstairs rooms in the house"><Switch label="On" /></Fieldset> },
    rtl: { text: 'In right-to-left languages the name sits at the right of the top line.', render: <div dir="rtl"><Fieldset legend="وضع الليل"><Switch label="خفض التدفئة" /></Fieldset></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the box does not move.', render: <Fieldset legend="Einstellungen für den Nachtmodus"><Switch label="Heizung senken" /></Fieldset> },
  },
  behaviours: {
    states: [
      ['Default', 'A hairline box with the name on the top line.', 'Announced as a group with its name.'],
      ['Disabled', 'The line, name and small print fade.', 'Every control inside is unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the controls inside. The box itself takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Read as a group with its name, then the small print as its description.', 'fieldset, legend, aria-describedby'],
    ],
    loading: <p>Fieldset has no loading state.</p>,
    focus: <p>Fieldset never takes focus. Focus lands on the first enabled control inside.</p>,
  },
  deepDive: { na: 'Fieldset has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'disabled',
      rules: <p>Switches off every control inside with one prop, and the box fades. Say why in the small print.</p>,
      pair: { do: night(true), doNote: 'Disabled, with the reason in the small print.', dont: <Fieldset legend="Night mode"><Switch label="Lower the heater" disabled /><Switch label="Dim the lamps" disabled /></Fieldset>, dontNote: 'Each control disabled one by one; the box still looks live.' },
    },
    {
      name: 'hint',
      rules: <p>One sentence of small print at the foot, read out as the group’s description. Use it for a rule that covers the whole group.</p>,
      pair: { do: night(), doNote: 'A rule for the whole group.', dont: <Fieldset legend="Night mode" hint="Switch on to lower the heater. Switch on to dim the lamps."><Switch label="Lower the heater" /></Fieldset>, dontNote: 'Repeats the labels of the controls.' },
    },
  ],
  related: [['/components/radio', 'Radio', 'A group of one-of-many keys, which brings its own box.'], ['/components/divider', 'Divider', 'Setting a section apart with a seam.'], ['/components/card', 'Card', 'Holding a whole unit.']],
  references: [
    { title: 'MDN · The fieldset element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset', why: 'How the browser names and disables a group.' },
    { title: 'WCAG 2.2 · 1.3.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html', why: 'Why related controls are grouped in markup.' },
    { title: 'W3C WAI · Grouping controls', url: 'https://www.w3.org/WAI/tutorials/forms/grouping/', why: 'When to use fieldset and legend.' },
  ],
};
