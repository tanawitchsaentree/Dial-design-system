// Usage tab for Spinner (component-depth.md U1–U14). Spinner says "busy" when there is no figure to show yet.
import { Display, Progress, Skeleton, Spinner, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const SPINNER: Depth = {
  overview: (
    <>
      <p>Spinner tells the person that the unit is busy and that there is no figure to show yet, such as the hub answering or a schedule being saved. It is nine recessed holes, the same holes as a Grille. A short lit trail walks the edge of the field while the work runs.</p>
      <p>It exists only while the work runs. Mount it when the wait starts and remove it when the answer lands. Its name is real text inside a status region, so the wait is announced in words. Under reduced motion the trail stops and three holes stay lit.</p>
    </>
  ),
  whenToUse: [
    'For a wait of unknown length, such as asking the hub or saving a setting.',
    'Beside a key or a field that is waiting on an answer.',
    'In the place a reading will stand, when the shape of the reading is not known.',
  ],
  whenNot: [
    { situation: 'A task with a known end, such as a wash cycle or an update', to: '/components/progress', label: 'Progress' },
    { situation: 'A card or list whose shape is known and is still loading', to: '/components/skeleton', label: 'Skeleton' },
    { situation: 'A reading the device sent earlier, even if it is old', to: '/components/display', label: 'Display' },
  ],
  variants: { na: 'Spinner has one look, a ring of holes with a lit trail. The label, size and shown label are covered under Sizes and Modifiers.' },
  anatomy: {
    render: <Unit><Spinner size="md" label="Asking the hub" showLabel /></Unit>,
    parts: [
      { part: 'Hole', selector: '[data-component="Spinner"] > span:first-child > span', what: 'A recessed hole in the lower ink step. Eight sit on the edge and take the trail in turn; the ninth, in the middle, never lights.' },
      { part: 'Lit trail', selector: '[data-component="Spinner"] > span:first-child', what: 'Three holes in full ink that walk the edge one hole every 120ms, clockwise in left-to-right layouts.' },
      { part: 'Label', selector: '[data-component="Spinner"] > span:last-child', what: 'The name of the wait. It is always in the page for assistive tech and is drawn beside the holes when showLabel is set.' },
    ],
  },
  sizes: {
    sm: { use: 'Holes of 8px on a field of 32px, the size of a Grille in a list row.', pairs: 'Beside a line of text, in a row, or next to a small key.' },
    md: { use: 'Holes of 12px on a field of 44px, as tall as the row of controls.', pairs: 'Alone in a card or sheet, or in the place of a Display.' },
  },
  emphasis: {
    text: <p>A Spinner is never orange. One Spinner for each wait: two in one unit make the person ask which one is theirs.</p>,
    pair: {
      do: <Unit><Spinner label="Asking the hub" showLabel /></Unit>,
      doNote: 'One Spinner for the one wait.',
      dont: <Unit><Stack gap="sm"><Spinner label="Asking the hub" showLabel /><Spinner label="Saving" showLabel /></Stack></Unit>,
      dontNote: 'Two at once; the person cannot tell what each is for.',
    },
  },
  placement: {
    rows: [['Beside a label', 'Spinner stands at the start of the line, with the label printed beside it.'], ['In the place of a reading', 'Medium size, in the window where the Display will stand.'], ['Beside a key', 'Small size, with a label naming the work.']],
    examples: [{ title: 'Where a reading will stand', render: <Unit><Stack gap="md"><Text>Living room heating</Text><Spinner size="md" label="Asking the heating" showLabel /></Stack></Unit> }],
  },
  combinations: {
    good: [['Spinner + Text', 'The label beside the holes names the work, and the text above names the unit.'], ['Spinner + Display', 'The Display takes the place of the Spinner when the reading arrives.']],
    avoid: [{ title: 'Spinner next to a Progress for the same task', why: 'The person reads two answers to one question. Use Progress when the end is known and Spinner when it is not.', render: <Unit><Stack gap="sm"><Spinner label="Updating" showLabel /><Progress label="Updating" value={40} /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the work with a verb ending in <em>ing</em>, as in <em>Saving</em> or <em>Asking the hub</em>. Say what is waiting, not that something is loading.</p>,
    pair: {
      do: <Spinner label="Saving the schedule" showLabel />, doNote: 'The verb names the work.',
      dont: <Spinner label="Please wait" showLabel />, dontNote: 'It says nothing about what is waiting.',
    },
    overflow: { text: 'A long label wraps beside the field. The holes keep their size and stay level with the first line.', render: <div style={{ maxInlineSize: 'var(--ds-layout-frame-sm)' }}><Spinner label="Asking the hub for the heating schedule of every room upstairs" showLabel /></div> },
    rtl: { text: 'In right-to-left languages the holes sit on the right and the trail walks the other way round.', render: <div dir="rtl"><Spinner label="جارٍ الحفظ" showLabel /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap and the holes do not move.', render: <Spinner label="Heizungsplan wird gespeichert" showLabel /> },
  },
  behaviours: {
    states: [
      ['Running', 'A trail of three lit holes walks the edge, one hole every 120ms.', 'The label is read as a status.'],
      ['Reduced motion', 'The trail stops. Three holes in a ring stay lit.', 'Unchanged. Turn on showLabel so the wait is also drawn in words.'],
      ['Forced colours', 'Each hole has a border and a lit hole fills with the text colour.', 'Unchanged.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'A Spinner takes no focus. It is not a control.', 'none'],
      ['Screen reader', 'Read', 'The label is read as a status when it appears. If the Spinner is already on the page when it is announced, put it inside a polite live region.', 'role="status"'],
      ['Pointer', 'Hover or press', 'Nothing happens. A Spinner is not a key.', 'none'],
    ],
    loading: <p>Spinner is the loading state. Mount it when the work starts and unmount it when the work ends. It has no state of its own for done or failed, so show the result in its place.</p>,
    focus: <p>Spinner never takes focus and never moves it. Keep focus on the key that started the work, and give that key a disabled state while the work runs.</p>,
  },
  deepDive: { na: 'Spinner has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'showLabel',
      rules: <p>Off by default, the label is read out but not drawn. Turn it on when the wait can run longer than a few seconds, and always when the person may have asked for reduced motion, since then the holes stand still.</p>,
      pair: { do: <Spinner label="Asking the hub" showLabel />, doNote: 'The wait is drawn and told.', dont: <Spinner label="Asking the hub" />, dontNote: 'On a long wait with reduced motion, only a still ring of holes says busy.' },
    },
    {
      name: 'label',
      rules: <p>The name of the wait, in the person’s language. The default is <em>Loading</em>. Always replace it with the work that is running.</p>,
      pair: { do: <Spinner label="Saving" showLabel />, doNote: 'The label names the work.', dont: <Spinner showLabel />, dontNote: 'The default word says only that something loads.' },
    },
  ],
  related: [['/components/progress', 'Progress', 'A task with a known end.'], ['/components/skeleton', 'Skeleton', 'The shape of a part that is still loading.'], ['/components/grille', 'Grille', 'The field of holes a Spinner is made from.'], ['/components/display', 'Display', 'The reading that replaces a Spinner.']],
  references: [
    { title: 'WAI-ARIA · status role', url: 'https://www.w3.org/TR/wai-aria-1.2/#status', why: 'How the wait is announced.' },
    { title: 'WCAG 2.2 · 2.3.3 Animation from Interactions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html', why: 'Why the trail stops under reduced motion.' },
    { title: 'Nielsen Norman Group · Response times', url: 'https://www.nngroup.com/articles/response-times-3-important-limits/', why: 'When a wait needs an indicator and when it needs a measure.' },
  ],
};
