// Usage tab for Onboarding (component-depth.md U1–U14). Onboarding walks a person through the parts of a screen.
import { useState } from 'react';
import { Button, Onboarding, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

/** A row of three keys and a start key; each demo gets its own ids so two tours on one page never collide. */
function Tour({ pre, words, titles, texts }: { pre: string; words?: Partial<React.ComponentProps<typeof Onboarding>>; titles?: string[]; texts?: string[] }) {
  const [open, setOpen] = useState(false);
  const t = titles ?? ['Heating', 'Lamp', 'Fan'];
  const x = texts ?? ['Turns the radiator on or off.', 'Dims the lamp.', 'Runs the fan.'];
  return (
    <Stack gap="md" align="start">
      <Stack direction="row" gap="md" align="center">
        {t.map((w, i) => <Button key={w} id={`${pre}-${i}`}>{w}</Button>)}
      </Stack>
      <Button onClick={() => setOpen(true)}>Take the tour</Button>
      <Onboarding open={open} onOpenChange={setOpen} {...words} steps={t.map((w, i) => ({ target: `${pre}-${i}`, title: w, text: x[i] }))} />
    </Stack>
  );
}

export const ONBOARDING: Depth = {
  overview: (
    <>
      <p>Onboarding shows a person around a screen the first time they meet it. For each step it draws a full-ink ring round one part and opens a small plastic panel beside it. The panel prints the step count, a title and a line of text, and has Skip, Back and Next keys.</p>
      <p>It does not dim the page and it does not scroll it. Focus moves to each panel as it opens. When the tour ends, by the last key, Skip or Escape, focus goes back to the part that was marked and <code>onDone</code> tells your code which way it ended, so you can save that the tour was seen.</p>
    </>
  ),
  whenToUse: ['To show a first-time visitor what three to six parts of a screen do.', 'To announce one new part with a single CoachMark.', 'To bring a person back to a part that changed.'],
  whenNot: [
    { situation: 'Explaining one reading the person asked about', to: '/components/popover', label: 'Popover' },
    { situation: 'Steps the person must finish to reach a result', to: '/components/wizard', label: 'Wizard' },
    { situation: 'A label that shows on hover or focus', to: '/components/tooltip', label: 'Tooltip' },
  ],
  variants: { na: 'Onboarding has one look, a ring and a plastic panel. Which side the panel stands on is covered under Modifiers.' },
  anatomy: {
    render: <Tour pre="ob-anat" />,
    parts: [
      { part: 'Ring', selector: '[data-component="CoachMark"][data-part="ring"]', what: 'A full-ink stroke round the marked part. It never takes a press.' },
      { part: 'Panel', selector: '[data-component="CoachMark"][role="dialog"]', what: 'Plastic body on the overlay layer, at most 300px wide.' },
      { part: 'Count', selector: '[data-component="CoachMark"][role="dialog"] > p:first-child', what: 'The position, such as 2 of 5, in tabular figures.' },
      { part: 'Keys', selector: '[data-component="CoachMark"][role="dialog"] button', what: 'Skip at the start, Back and Next at the end, each 44px tall.' },
    ],
  },
  sizes: { na: 'Onboarding has one size. The panel grows to its text, up to 300px, and the keys are 44px.' },
  emphasis: { na: 'Nothing in Onboarding is orange. The ring is full ink, and the unit’s one orange key stays where it is.' },
  placement: {
    rows: [['Under the part', 'The panel stands below the ring and flips above it when there is more room there.'], ['Near a screen edge', 'The panel shifts along the part so the edge never cuts it.'], ['A part scrolled out of view', 'The page is not scrolled. The panel waits at the nearest screen edge.']],
    examples: [{ title: 'Under a row of keys', render: <Unit><Tour pre="ob-place" /></Unit> }],
  },
  combinations: {
    good: [['Onboarding + Button', 'Each step points at a key; a Take the tour key starts it again.'], ['Onboarding + Popover', 'Popover answers a question later; the tour says what is there on the first visit.']],
    avoid: [{ title: 'a tour of ten steps', why: 'Past six steps people stop reading. Split it, or keep the first tour to the parts needed to start.', render: <Unit><Tour pre="ob-avoid" /></Unit> }],
  },
  content: {
    formula: <p>Title each step with the name of the part, as in <em>Heating</em>. Write one or two short sentences about what it does. Leave the count to the panel.</p>,
    pair: {
      do: <Tour pre="ob-do" titles={['Heating']} texts={['Turns the radiator on or off.']} />, doNote: 'The title names the part; the text says what it does.',
      dont: <Tour pre="ob-dont" titles={['Click here']} texts={['This is the heating key, which is a key that you can use to control the heating of the room that you are in.']} />, dontNote: 'A vague title and a long sentence.',
    },
    overflow: { text: 'Long text wraps inside the 300px panel. A tall panel scrolls and never runs off the screen.', render: <Tour pre="ob-over" titles={['Heating schedule for the whole of the upstairs rooms']} texts={['Heating runs from 06:30 to 22:00 on weekdays and from 08:00 to 23:00 at the weekend.']} /> },
    rtl: { text: 'In right-to-left languages the panel lines up with the part’s other edge and Skip sits on the right.', render: <div dir="rtl"><Tour pre="ob-rtl" titles={['التدفئة']} texts={['تشغّل المدفأة أو توقفها.']} words={{ formatCount: (n, total) => `${n} من ${total}`, nextLabel: 'التالي', doneLabel: 'تم', backLabel: 'السابق', skipLabel: 'تخطّي' }} /></div> },
    expansion: { text: 'German and Finnish text can run 30% longer. It wraps and the panel keeps its width.', render: <Tour pre="ob-exp" titles={['Heizung']} texts={['Schaltet den Heizkörper in diesem Raum ein oder aus und merkt sich die letzte Temperatur.']} words={{ nextLabel: 'Weiter', doneLabel: 'Fertig', backLabel: 'Zurück', skipLabel: 'Überspringen', formatCount: (n, total) => `${n} von ${total}` }} /> },
  },
  behaviours: {
    states: [
      ['Closed', 'Nothing is drawn.', 'Nothing is announced.'],
      ['Open', 'The ring and the panel fade in and the panel rises off the part.', 'The panel is a dialog named by its title and described by the count and the text.'],
      ['First step', 'Back is drawn and disabled.', 'Back is announced as dimmed.'],
      ['Last step', 'Next reads Done and Skip is left out.', 'Done ends the tour.'],
      ['Ending', 'The ring and the panel fade; the panel sinks back.', 'Hidden from assistive tech while it leaves.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through Skip, Back and Next. Tab past either end hands focus to the marked part.', 'onKeyDown'],
      ['Keyboard', 'Enter or Space', 'Presses the focused key.', 'native button'],
      ['Keyboard', 'Escape', 'Ends the tour and puts focus back on the marked part.', 'onKeyDown'],
      ['Pointer', 'Press a key', 'Moves to the next or previous step, or ends the tour.', 'onClick'],
      ['Screen reader', 'Read', 'Each step is announced with its position, title and text as focus lands on the panel.', 'aria-labelledby, aria-describedby'],
    ],
    loading: <p>Onboarding has no loading state. Start the tour once the parts it points at are on the page; a step whose part cannot be found is passed over.</p>,
    focus: <p>Focus moves to the panel each time a step opens. When the tour ends, it returns to the part the last step pointed at. If that part is not a key or a field, it is given a temporary tabindex so it can take focus.</p>,
  },
  deepDive: { na: 'Onboarding has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'onDone',
      rules: <p>Called once when the tour ends, with the reason (<code>finish</code>, <code>skip</code> or <code>escape</code>) and the step it ended on. Save that the tour was seen so it is not offered again.</p>,
      pair: { do: <Tour pre="ob-m1" />, doNote: 'The page saves the answer and does not start the tour again.', dont: <Tour pre="ob-m2" titles={['Heating']} texts={['The tour starts on every visit.']} />, dontNote: 'A tour that starts on every visit.' },
    },
    {
      name: 'placement',
      rules: <p><code>auto</code> (default) stands the panel under the part and flips it above when there is more room there. <code>top</code> and <code>bottom</code> fix the side.</p>,
      pair: { do: <Tour pre="ob-m3" />, doNote: 'Let the panel choose the side.', dont: <Tour pre="ob-m3b" words={{ placement: 'top' }} />, dontNote: 'Forcing a side with no room presses the panel against the screen edge.' },
    },
    {
      name: 'stepIndex',
      rules: <p>Pass <code>stepIndex</code> and <code>onStepChange</code> to control the step from the page, such as to open the tour on the part the person asked about. Leave both out and the tour keeps its own step.</p>,
      pair: { do: <Tour pre="ob-m4" />, doNote: 'Start at the first step unless the person asked about one part.', dont: <Tour pre="ob-m5" titles={['Heating']} texts={['A tour of one step.']} />, dontNote: 'A tour of one step has nothing to count. Use a single CoachMark.' },
    },
  ],
  related: [['/components/popover', 'Popover', 'One note on a reading the person asked about.'], ['/components/wizard', 'Wizard', 'Steps the person must finish.'], ['/components/tooltip', 'Tooltip', 'A short label on hover or focus.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Dialog (modal)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'How focus moves into a panel and back to where it came from.' },
    { title: 'WCAG 2.2 · 2.4.3 Focus Order', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html', why: 'Why focus follows each step and returns to the part.' },
    { title: 'WCAG 2.2 · 2.3.3 Animation from Interactions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html', why: 'Why the page is never scrolled and motion drops to a fade.' },
  ],
};
