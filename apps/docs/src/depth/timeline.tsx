// Usage tab for Timeline (component-depth.md U1–U14). Timeline prints a log of past events.
import { Card, Heading, Timeline, TimelineItem } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const log = () => (
  <Timeline>
    <TimelineItem time="22:40" title="Night mode started" latest>Heater set to 18.</TimelineItem>
    <TimelineItem time="21:05" title="Washer finished" />
    <TimelineItem time="18:30" title="Kitchen lamp dimmed">From 80 to 30 by the evening schedule.</TimelineItem>
  </Timeline>
);

export const TIMELINE: Depth = {
  overview: (
    <>
      <p>Timeline lists what a device has already done, such as a washer that finished or a lamp that was dimmed. Each event has a time in a column at the left, a name, and an optional line of detail. A hairline runs down the case and each event has a small node on it.</p>
      <p>It is a log, so it only reports. Nothing in it can be pressed. For steps still to come, use a Stepper.</p>
    </>
  ),
  whenToUse: ['To show the last events of a device or a room, newest first.', 'To show a short history of one thing, such as a door or a cycle.'],
  whenNot: [
    { situation: 'Numbering the sections of a form that are still to be filled in', to: '/components/stepper', label: 'Stepper' },
    { situation: 'Showing how far a task has got', to: '/components/progress', label: 'Progress' },
  ],
  variants: { na: 'Timeline has one look, a column of times beside a hairline rail. Which event is lit is a prop, covered under Modifiers.' },
  anatomy: {
    render: log(),
    parts: [
      { part: 'Time', selector: '[data-component="Timeline"] > li > time', what: 'The time of the event in tabular figures, right-aligned to the rail.' },
      { part: 'Rail and node', selector: '[data-component="Timeline"] > li > span', what: 'A hairline with a ring node level with the title. The lit event has a filled node.' },
      { part: 'Title and detail', selector: '[data-component="Timeline"] > li > div', what: 'The event’s name and, under it, an optional line of detail.' },
    ],
  },
  sizes: { na: 'Timeline has one size. The text follows the body size and the node follows the title.' },
  emphasis: { na: 'The lit event is told by a filled node and a medium title. Nothing in a Timeline is orange.' },
  placement: {
    rows: [['Inside a unit, under its title', 'The log stands in the unit’s body as its own block.'], ['Beside a Display', 'The Display says the state now; the Timeline says how it got there.']],
    examples: [{ title: 'In a unit', render: <Unit><Card header={<Heading level={3}>Washer</Heading>} wordmark="dial" model="wash 2"><Timeline><TimelineItem time="21:05" title="Cycle finished" latest /><TimelineItem time="19:13" title="Cycle started" /></Timeline></Card></Unit> }],
  },
  combinations: {
    good: [['Timeline + Heading', 'A heading names the device, and the log below it names what it did.'], ['Timeline + Button', 'A key under the log, such as Clear history, comes after the last event.']],
    avoid: [{ title: 'a Timeline of one event', why: 'A line needs two points. Print the event as a Text line instead.', render: <Unit><Timeline><TimelineItem time="21:05" title="Washer finished" latest /></Timeline></Unit> }],
  },
  content: {
    formula: <p>Name each event with what happened, in the past tense, as in <em>Washer finished</em>. Keep the time short, as in <em>22:40</em> or <em>Mon 18:30</em>.</p>,
    pair: {
      do: <Timeline><TimelineItem time="21:05" title="Washer finished" /><TimelineItem time="19:13" title="Washer started" /></Timeline>, doNote: 'What happened, in the past tense.',
      dont: <Timeline><TimelineItem time="21:05" title="Washer finishing soon" /><TimelineItem time="19:13" title="Event 1" /></Timeline>, dontNote: 'A future event and a name that says nothing.',
    },
    overflow: { text: 'A long title wraps in its column. The time column keeps its width and the rail follows the content.', render: <Timeline><TimelineItem time="22:40" title="Night mode started and the heater in the upstairs rooms was set to eighteen degrees" /><TimelineItem time="21:05" title="Washer finished" /></Timeline> },
    rtl: { text: 'In right-to-left languages the times sit on the right and the rail follows them.', render: <div dir="rtl"><Timeline><TimelineItem time="22:40" title="بدأ وضع الليل" /><TimelineItem time="21:05" title="انتهت الغسالة" /></Timeline></div> },
    expansion: { text: 'German and Finnish titles can run 30% longer. They wrap and the nodes do not move.', render: <Timeline><TimelineItem time="22:40" title="Nachtmodus gestartet" /><TimelineItem time="21:05" title="Waschmaschine fertig" /></Timeline> },
  },
  behaviours: {
    states: [
      ['Event', 'A ring node on the rail, the title in regular weight.', 'Read as one item of a list.'],
      ['Latest', 'A filled node and the title in medium weight.', 'The node is announced as Latest.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to anything focusable inside an event. The Timeline itself takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Read as an ordered list; each time is a time element and the lit node says Latest.', 'ol, time'],
    ],
    loading: <p>Timeline has no loading state. Show a Skeleton until the events arrive.</p>,
    focus: <p>Focus is never moved by the Timeline. When a new event is added, nothing is announced unless you put the list in a live region.</p>,
  },
  deepDive: { na: 'Timeline has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'latest',
      rules: <p>Set <code>latest</code> on the newest event only. It fills the node, sets the title in medium weight and gives the node the name Latest.</p>,
      pair: { do: log(), doNote: 'One lit event, the newest.', dont: <Timeline><TimelineItem time="22:40" title="Night mode started" latest /><TimelineItem time="21:05" title="Washer finished" latest /></Timeline>, dontNote: 'Two lit events: nothing is the latest.' },
    },
  ],
  related: [['/components/stepper', 'Stepper', 'Numbered sections still to come.'], ['/components/progress', 'Progress', 'How far a task has got.'], ['/components/breadcrumb', 'Breadcrumb', 'The path to the current page.']],
  references: [
    { title: 'MDN · The time element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time', why: 'How each time is marked up with a machine value.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the lit event is a shape and a word, not only a colour.' },
    { title: 'Carbon Design System · Structured list', url: 'https://carbondesignsystem.com/components/structured-list/usage/', why: 'Rows of aligned columns in a long list.' },
  ],
};
