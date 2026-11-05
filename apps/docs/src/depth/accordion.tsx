// Usage tab for Accordion (component-depth.md U1–U14). Accordion folds the sections of a unit.
import { Accordion, AccordionItem } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const three = (open: string[] = ['schedule'], multiple = false) => (
  <Accordion defaultValue={open} multiple={multiple}>
    <AccordionItem value="schedule" title="Schedule">Heating starts at 06:30 on weekdays and drops to 18 at 23:00.</AccordionItem>
    <AccordionItem value="away" title="Away mode">Keeps the rooms at 16 while nobody is home.</AccordionItem>
    <AccordionItem value="firmware" title="Firmware">Version 2.4.1. Updates install at night.</AccordionItem>
  </Accordion>
);

export const ACCORDION: Depth = {
  overview: (
    <>
      <p>Accordion folds the sections of a unit, such as the Schedule, Away mode and Firmware parts of a heater’s settings. Every title stays printed, like the legend on an appliance case, and the open one is lit with a short ink bar, a minus and medium weight.</p>
      <p>Use it when a unit holds more than a screen of detail and most people need only one part at a time. Opening a section moves the ones below it, so keep it for content people read, not for controls that must stay in reach.</p>
    </>
  ),
  whenToUse: ['To fold three to eight sections of settings or help, so every title stays in sight.', 'To keep a long unit short when people read one section at a time.'],
  whenNot: [
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Numbering the sections of a form the person walks through', to: '/components/stepper', label: 'Stepper' },
    { situation: 'A single hint beside one field', to: '/components/text', label: 'Text' },
  ],
  variants: { na: 'Accordion has one look, a legend of titles on seams. Whether one or several sections may stay open is the multiple prop, covered under Modifiers.' },
  anatomy: {
    render: three(),
    parts: [
      { part: 'Index bar', selector: '[data-component="Accordion"] button > span:first-child', what: 'A 4px ink bar beside the open title; empty when the section is closed.' },
      { part: 'Title', selector: '[data-component="Accordion"] button > span:nth-child(2)', what: 'The section’s name, in medium weight and primary ink while open.' },
      { part: 'Plus or minus', selector: '[data-component="Accordion"] button > span:last-child', what: 'A dot-matrix plus while closed and minus while open.' },
      { part: 'Content', selector: '[data-component="Accordion"] [role="region"]', what: 'The section’s content, under the title on the title’s edge.' },
    ],
  },
  sizes: { na: 'Accordion has one size. Every header is a 44px target.' },
  emphasis: { na: 'Nothing in an Accordion is orange. The open section is told by the bar, the minus and the weight.' },
  placement: {
    rows: [['Inside a unit or card', 'Fills the width of the column; the seams run edge to edge of the unit’s inset.'], ['In a sheet or dialog body', 'Use it for help or advanced settings that most people skip.']],
    examples: [{ title: 'In a settings unit', render: <Unit>{three(['schedule'])}</Unit> }],
  },
  combinations: {
    good: [['Accordion + Text', 'Short paragraphs under each title.'], ['Accordion + Switch', 'A few related switches under one title.']],
    avoid: [{ title: 'an Accordion around the one primary control', why: 'The orange key must stay in reach. Folding it away hides the unit’s main action.', render: <Unit><Accordion><AccordionItem value="go" title="Start the wash">Press the orange key.</AccordionItem></Accordion></Unit> }],
  },
  content: {
    formula: <p>Name each section with a noun, as in <em>Schedule</em> or <em>Firmware</em>. Do not add “Show” or “Hide”; the minus and plus say it.</p>,
    pair: {
      do: <Accordion><AccordionItem value="a" title="Schedule" /></Accordion>, doNote: 'A noun, and the glyph says open or closed.',
      dont: <Accordion><AccordionItem value="a" title="Click to show the schedule" /></Accordion>, dontNote: 'An instruction repeats what the glyph and the screen reader already say.',
    },
    overflow: { text: 'A long title wraps beside the glyph. The header grows in height and the glyph stays centred.', render: <Accordion><AccordionItem value="a" title="Heating schedule for the whole of the upstairs rooms, weekdays and weekends" /></Accordion> },
    rtl: { text: 'In right-to-left languages the bar sits on the right and the glyph on the left.', render: <div dir="rtl"><Accordion defaultValue={['a']}><AccordionItem value="a" title="الجدول">يبدأ التدفئة في السادسة والنصف.</AccordionItem><AccordionItem value="b" title="البرنامج الثابت" /></Accordion></div> },
    expansion: { text: 'German and Finnish titles can run 30% longer. They wrap and the glyph does not move.', render: <Accordion defaultValue={['a']}><AccordionItem value="a" title="Benachrichtigungseinstellungen">Fenster offen.</AccordionItem><AccordionItem value="b" title="Konfiguration" /></Accordion> },
  },
  behaviours: {
    states: [
      ['Closed', 'Secondary ink, regular weight, a plus, no bar.', 'aria-expanded="false".'],
      ['Open', 'Primary ink, medium weight, a minus and the ink bar.', 'aria-expanded="true"; the content is a region named by its title.'],
      ['Hover', 'The closed title darkens one step.', 'Nothing rises.'],
      ['Focus', 'A dark 2px ring around the header row.', 'Each header is a tab stop.'],
      ['Disabled', 'The header fades and shows the not-allowed cursor.', 'It leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves between headers and into the open content.', 'native button'],
      ['Keyboard', 'Enter / Space', 'Opens or closes the focused section.', 'native button'],
      ['Keyboard', 'Up / Down', 'Move focus to the previous or next header. The ends wrap.', 'aria-expanded'],
      ['Keyboard', 'Home / End', 'Move focus to the first or last header.', 'aria-expanded'],
      ['Pointer', 'Press a header', 'Opens or closes it.', 'native button'],
      ['Screen reader', 'Read', 'Each title is a heading containing a button that says expanded or collapsed.', 'aria-expanded'],
    ],
    loading: <p>Accordion has no loading state. Content that loads shows its own progress inside the open section.</p>,
    focus: <p>Nothing is focused on page load. Tab lands on the first header. Opening a section does not move focus, so the person keeps their place.</p>,
  },
  deepDive: { na: 'Accordion has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'multiple',
      rules: <p>By default opening a section closes the others, so the unit stays short. Set <code>multiple</code> when people compare sections, such as two schedules.</p>,
      pair: { do: three(['schedule', 'away'], true), doNote: 'Two open at once because people compare them.', dont: three(['schedule', 'away'], false), dontNote: 'Without multiple, the second open section is closed again at the first press.' },
    },
    {
      name: 'headingLevel',
      rules: <p>Each title is a heading so screen reader users can jump between sections. Pass the level under the heading that holds the Accordion; the default is 3.</p>,
      pair: { do: <Accordion headingLevel={4}><AccordionItem value="a" title="Schedule" /></Accordion>, doNote: 'A level one step under the page’s own heading.', dont: <Accordion headingLevel={2}><AccordionItem value="a" title="Schedule" /></Accordion>, dontNote: 'A level that skips or repeats the page outline.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching between views.'], ['/components/stepper', 'Stepper', 'Numbering the sections of a form.'], ['/components/legend', 'Legend', 'The printed choices beside a control.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Accordion', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/', why: 'The keyboard map and the roles.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why open is told by a bar and a glyph, not ink alone.' },
    { title: 'WCAG 2.2 · 2.3.3 Animation from Interactions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html', why: 'Why the panel stops travelling under Reduce motion.' },
  ],
};
