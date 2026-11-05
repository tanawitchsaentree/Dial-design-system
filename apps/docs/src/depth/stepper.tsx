// Usage tab for Stepper (component-depth.md U1–U14). Stepper numbers the sections of a long form.
import { Button, Input, Stack, Step, Stepper } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const three = (a: 'done' | 'current' | 'upcoming' = 'current') => (
  <Stepper>
    <Step title="General" status="done">Owner and name.</Step>
    <Step title="Configuration" status={a}>Visibility and defaults.</Step>
    <Step title="Review">Check and create.</Step>
  </Stepper>
);

export const STEPPER: Depth = {
  overview: (
    <>
      <p>Stepper numbers the sections of a long form, such as a settings sheet with a General part and a Configuration part. Each number sits in a small window cut into the body, and a rail of dots runs down to the next one.</p>
      <p>It names where you are in the form and holds each section’s content under its title. It is not a control, so nothing in it can be pressed.</p>
    </>
  ),
  whenToUse: ['To split a long form into two to five named sections.', 'To show which section of a setup the person is in.'],
  whenNot: [
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing how far a task has got', to: '/components/progress', label: 'Progress' },
  ],
  variants: { na: 'Stepper has one look, a column of numbered windows. The state of each step is a prop, covered under Modifiers.' },
  anatomy: {
    render: three(),
    parts: [
      { part: 'Number window', selector: '[data-component="Stepper"] > li > span:first-child', what: 'A 44px recess with the step’s number, or a check when it is done.' },
      { part: 'Title', selector: '[data-component="Stepper"] > li > p', what: 'The step’s name, printed level with the window.' },
      { part: 'Content', selector: '[data-component="Stepper"] > li > div', what: 'The section’s fields, under the title.' },
    ],
  },
  sizes: { na: 'Stepper has one size. The window matches the 44px row of controls beside it.' },
  emphasis: { na: 'The current step is told by ink and weight. Nothing in a Stepper is orange.' },
  placement: {
    rows: [['The whole form of a sheet', 'Steps stand in one column, with the orange key under the last one.'], ['Two to five steps', 'More than five and the form should be split in two sheets.']],
    examples: [{ title: 'In a settings sheet', render: <Unit><Stack gap="lg">{three()}<Button kind="primary">Create</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Stepper + Input', 'Fields stand under each title, each with its own printed label.'], ['Stepper + Button', 'The orange key that saves comes after the last step.']],
    avoid: [{ title: 'a Stepper of one step', why: 'A single number has nothing to count against. Print a heading instead.', render: <Unit><Stepper><Step title="General" status="current"><Input label="Name" defaultValue="Kitchen" /></Step></Stepper></Unit> }],
  },
  content: {
    formula: <p>Name each step with a noun, as in <em>General</em> or <em>Configuration</em>. Do not write the number in the title, because the window prints it.</p>,
    pair: {
      do: <Stepper><Step title="General" status="current" /></Stepper>, doNote: 'A noun, and the window counts.',
      dont: <Stepper><Step title="Step 1: fill in the general details" status="current" /></Stepper>, dontNote: 'The number is printed twice.',
    },
    overflow: { text: 'A long title wraps beside the window. The window stays 44px and the rail follows the content.', render: <Stepper><Step title="Configuration of the heating schedule for the whole of the upstairs rooms" status="current">Visibility.</Step><Step title="Review" /></Stepper> },
    rtl: { text: 'In right-to-left languages the windows sit on the right and the rail follows them.', render: <div dir="rtl"><Stepper><Step title="عام" status="current">الاسم</Step><Step title="الإعدادات" /></Stepper></div> },
    expansion: { text: 'German and Finnish titles can run 30% longer. They wrap and the windows do not move.', render: <Stepper><Step title="Allgemeine Einstellungen" status="current" /><Step title="Konfiguration" /></Stepper> },
  },
  behaviours: {
    states: [
      ['Upcoming', 'The number in secondary ink.', 'The title in secondary ink.'],
      ['Current', 'The number and title in primary ink.', 'Announced with aria-current="step".'],
      ['Done', 'A check in the window in place of the number.', 'Announced as Done.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the fields inside the steps. The Stepper itself takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Read as an ordered list; the current step is announced.', 'ol, aria-current'],
    ],
    loading: <p>Stepper has no loading state.</p>,
    focus: <p>Focus is never moved by the Stepper. When a section is finished, move focus to the first field of the next one.</p>,
  },
  deepDive: { na: 'Stepper has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'status',
      rules: <p><code>current</code> marks the section the person is in, <code>done</code> prints a check, and <code>upcoming</code> is the default. Mark one step current at most.</p>,
      pair: { do: three(), doNote: 'One done, one current, one upcoming.', dont: <Stepper><Step title="General" status="current" /><Step title="Configuration" status="current" /></Stepper>, dontNote: 'Two current steps: the person cannot tell where they are.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/progress', 'Progress', 'How far a task has got.'], ['/components/input', 'Input', 'A field to stand in a step.']],
  references: [
    { title: 'WAI-ARIA · aria-current', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-current', why: 'How the current step is announced.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why done is a check and not only a colour.' },
    { title: 'GOV.UK Design System · Task list pages', url: 'https://design-system.service.gov.uk/patterns/complete-multiple-tasks/', why: 'Numbered sections of a long form.' },
  ],
};
