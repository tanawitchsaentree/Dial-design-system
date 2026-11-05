// Usage tab for Wizard (component-depth.md U1–U14). Wizard walks a long setup one step at a time on the Stepper rail.
import { Input, Wizard, WizardStep } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const frame = (children: React.ReactNode) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>;
const three = (start = 0) => (
  <Wizard defaultCurrent={start}>
    <WizardStep title="General">Owner and name.</WizardStep>
    <WizardStep title="Configuration">Visibility and defaults.</WizardStep>
    <WizardStep title="Review">Check and create.</WizardStep>
  </Wizard>
);

export const WIZARD: Depth = {
  overview: (
    <>
      <p>Wizard walks a setup that is too long for one screen, such as adding a room with its network, schedule and review. The Stepper rail stays in view, and only the open step shows its fields. Two keys under the rail move one place back or on.</p>
      <p>On the last step Next becomes Finish, the unit’s one orange key. A step can refuse to be left with <code>canAdvance</code>, and the reason is printed in a status line.</p>
    </>
  ),
  whenToUse: ['To split a setup into two to five steps that must be done in order.', 'To check one step before the person goes on to the next.'],
  whenNot: [
    { situation: 'A form that fits one screen', to: '/components/stepper', label: 'Stepper' },
    { situation: 'Switching between views that have no order', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Showing past events in order', to: '/components/timeline', label: 'Timeline' },
  ],
  variants: { na: 'Wizard has one look: the Stepper rail with the open step in place and the key row under it.' },
  anatomy: {
    render: frame(three(1)),
    parts: [
      { part: 'Number window', selector: '[data-component="Wizard"] > ol > li > span:first-child', what: 'The Stepper’s 44px recess: a number, or a check once the step is done.' },
      { part: 'Step title', selector: '[data-component="Wizard"] [role="heading"]', what: 'The open step’s name. Focus moves here when the step changes.' },
      { part: 'Status line', selector: '[data-component="Wizard"] [role="status"]', what: 'Prints why Next did nothing. It keeps its line when empty.' },
      { part: 'Key row', selector: '[data-component="Wizard"] [role="group"]', what: 'Back at the start edge, Next or Finish at the end edge.' },
    ],
  },
  sizes: { na: 'Wizard has one size. The keys and windows are 44px tall, like the controls in the steps.' },
  emphasis: { na: 'The only loud part is Finish on the last step. Next and Back are plain keys.' },
  placement: {
    rows: [['A sheet or a page of its own', 'The rail and keys fill one column, and the keys stay at the foot.'], ['Two to five steps', 'More than five and the setup should be split in two.']],
    examples: [{ title: 'In a unit', render: <Unit>{frame(three())}</Unit> }],
  },
  combinations: {
    good: [['Wizard + Input', 'Each step holds the fields it needs, with their own printed labels.'], ['Wizard + Banner', 'A Banner above the Wizard can state a problem that spans steps.']],
    avoid: [{ title: 'a Wizard of one step', why: 'There is nothing to walk through. Print the form on its own.', render: <Unit><Wizard><WizardStep title="General"><Input label="Name" defaultValue="Kitchen" /></WizardStep></Wizard></Unit> }],
  },
  content: {
    formula: <p>Name each step with a noun, as in <em>Network</em> or <em>Review</em>. Leave the numbers to the windows. Keep Back, Next and Finish to one word each.</p>,
    pair: {
      do: <Wizard><WizardStep title="Network" /><WizardStep title="Review" /></Wizard>, doNote: 'Nouns, and the windows count.',
      dont: <Wizard><WizardStep title="Step 1: connect to the network" /><WizardStep title="Step 2: review" /></Wizard>, dontNote: 'The number is printed twice.',
    },
    overflow: { text: 'A long title wraps beside the window, and the keys stay on one row.', render: <Wizard><WizardStep title="Configuration of the heating schedule for the whole of the upstairs rooms">Hours.</WizardStep><WizardStep title="Review" /></Wizard> },
    rtl: { text: 'In right-to-left languages the windows sit on the right, Back moves to the right edge and Finish to the left.', render: <div dir="rtl"><Wizard backLabel="رجوع" nextLabel="التالي" finishLabel="إنهاء"><WizardStep title="عام">الاسم</WizardStep><WizardStep title="مراجعة" /></Wizard></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The keys grow and the row wraps before it overlaps.', render: <Wizard backLabel="Zurück" nextLabel="Weiter" finishLabel="Abschließen"><WizardStep title="Allgemeine Einstellungen">Name.</WizardStep><WizardStep title="Überprüfung" /></Wizard> },
  },
  behaviours: {
    states: [
      ['First step', 'Back is dimmed and disabled.', 'Back is disabled.'],
      ['Middle step', 'Back and Next are plain keys.', 'The open step carries aria-current="step".'],
      ['Last step', 'Next is replaced by the orange Finish.', 'The key is named Finish.'],
      ['Blocked', 'The status line prints a warning glyph and the words.', 'Read out politely as a status.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the fields of the open step, then Back and Next. Closed steps are hidden and skipped.', 'native'],
      ['Keyboard', 'Enter or Space', 'Presses Back, Next or Finish.', 'native button'],
      ['Screen reader', 'Step change', 'Focus moves to the step title, which is read as a heading with “Step 2 of 3”.', 'role="heading"'],
    ],
    loading: <p>Wizard has no loading state. <code>canAdvance</code> is synchronous; check your data first and pass the result.</p>,
    focus: <p>On first render focus stays where it was. When the step changes, focus moves to the open step’s title, so the person hears the new place before its fields.</p>,
  },
  deepDive: { na: 'Wizard has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'canAdvance',
      rules: <p>Return false to keep the person on the step. The status line prints <code>blockedLabel</code> and <code>onBlocked</code> is called. Next stays live, so a person who tabs can still hear the reason.</p>,
      pair: {
        do: frame(<Wizard canAdvance={() => false}><WizardStep title="Network">Pick one.</WizardStep><WizardStep title="Review" /></Wizard>), doNote: 'A step that needs a choice says so when it is left.',
        dont: <p>Disabling Next with no word.</p>, dontNote: 'A dead key gives no reason.',
      },
    },
    {
      name: 'current',
      rules: <p>Pass <code>current</code> with <code>onCurrentChange</code> to hold the step in your own state. Leave it out and use <code>defaultCurrent</code> to let the Wizard keep it.</p>,
      pair: { do: three(2), doNote: 'Starting on the last step with defaultCurrent.', dont: <p>Passing <code>current</code> with no <code>onCurrentChange</code>.</p>, dontNote: 'The keys would do nothing.' },
    },
  ],
  related: [['/components/stepper', 'Stepper', 'Numbered sections shown all at once.'], ['/components/tabs', 'Tabs', 'Views with no order.'], ['/components/timeline', 'Timeline', 'Events in order.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Multi-page forms', url: 'https://www.w3.org/WAI/tutorials/forms/multi-page/', why: 'How to move people through steps and tell them where they are.' },
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'Why a blocked step says what is missing in words.' },
    { title: 'GOV.UK Design System · Question pages', url: 'https://design-system.service.gov.uk/patterns/question-pages/', why: 'One thing at a time in a long service.' },
  ],
};
