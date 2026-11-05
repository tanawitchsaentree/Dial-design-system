// Usage tab for NotificationCenter (component-depth.md U1–U14). A log of notifications grouped by day, with read and dismiss keys.
import { NotificationCenter, NotificationItem } from 'dial-react';
import type { Depth } from './types';

const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}>{children}</div>;
const center = () => (
  <Frame>
    <NotificationCenter>
      <NotificationItem id="washer" day="Today" title="Washer finished" time="22:40" unread>Laundry room</NotificationItem>
      <NotificationItem id="night" day="Today" title="Night mode started" time="22:30">Heating set to 18</NotificationItem>
      <NotificationItem id="door" day="Yesterday" title="Front door locked" time="23:10">Hall</NotificationItem>
    </NotificationCenter>
  </Frame>
);

export const NOTIFICATION_CENTER: Depth = {
  overview: (
    <>
      <p>NotificationCenter lists what a home or an account has reported, such as a washer that finished or a door that was locked. Lines sit under a day heading. A line that is still unread has a filled lamp and a medium title, and a line that has been read has an empty ring and a regular title.</p>
      <p>Each line has a key to mark it read and a key to dismiss it. The header counts the unread lines and holds Mark all read. The center does not open itself: put it in a Popover or a Drawer and put the count on your own key.</p>
    </>
  ),
  whenToUse: ['To list notifications where the person can clear them.', 'To show which messages are still unread without relying on colour.'],
  whenNot: [
    { situation: 'A short message that goes away by itself', to: '/components/toast', label: 'Toast' },
    { situation: 'A notice that stays at the top of a screen', to: '/components/banner', label: 'Banner' },
    { situation: 'A log of past events with no actions', to: '/components/timeline', label: 'Timeline' },
  ],
  variants: { na: 'NotificationCenter has one look, a body of lines under day headings. Read and unread are a prop on each line, covered under Modifiers.' },
  anatomy: {
    render: center(),
    parts: [
      { part: 'Header', selector: '[data-component="NotificationCenter"] > div:first-child', what: 'The title, the unread count and the Mark all read key.' },
      { part: 'Day heading', selector: '[data-component="NotificationCenter"] [data-part="group"] > :first-child', what: 'A small label above the lines of one day.' },
      { part: 'Line', selector: '[data-component="NotificationItem"]', what: 'A lamp, the title, a line of detail with the time, and two 44px keys.' },
      { part: 'Keys', selector: '[data-component="NotificationItem"] [data-part="dismiss"]', what: 'Dismiss, next to the mark-as-read key.' },
    ],
  },
  sizes: { na: 'NotificationCenter has one size and fills the width its container gives it. The keys are 44px.' },
  emphasis: { na: 'Unread is told by a filled lamp and a medium title. Nothing in a NotificationCenter is orange.' },
  placement: {
    rows: [['In a Popover or Drawer', 'Give it the width of the panel. It does not set a width of its own.'], ['On a page of its own', 'Put a width on the container, such as the phone frame.']],
    examples: [{ title: 'In a container', render: center() }],
  },
  combinations: {
    good: [['NotificationCenter + Popover', 'The Popover opens from a key with the unread count on it.'], ['NotificationCenter + Drawer', 'A Drawer holds the center on a phone.']],
    avoid: [{ title: 'a center of one line with no day', why: 'A single line does not need a day heading or a count. Use a Toast or a Banner.', render: <Frame><NotificationCenter><NotificationItem id="one" title="Washer finished" time="22:40" unread /></NotificationCenter></Frame> }],
  },
  content: {
    formula: <p>Write the title as what happened, in the past tense, as in <em>Washer finished</em>. Put the place in the detail line. Name the day in words, as in <em>Today</em> and <em>Yesterday</em>.</p>,
    pair: {
      do: <Frame><NotificationCenter><NotificationItem id="a" day="Today" title="Washer finished" time="22:40" unread>Laundry room</NotificationItem></NotificationCenter></Frame>, doNote: 'What happened, with the place in the detail.',
      dont: <Frame><NotificationCenter><NotificationItem id="b" day="Today" title="Update" time="22:40" unread>Update</NotificationItem></NotificationCenter></Frame>, dontNote: 'The key names repeat and say nothing.',
    },
    overflow: { text: 'A long title wraps beside the lamp. The two keys keep their 44px size and the line grows taller.', render: <Frame><NotificationCenter><NotificationItem id="long" day="Today" title="The upstairs heating schedule for the week was changed and needs a check" time="22:40" unread>Heating</NotificationItem></NotificationCenter></Frame> },
    rtl: { text: 'In right-to-left languages the lamp sits on the right and the keys on the left.', render: <div dir="rtl"><Frame><NotificationCenter words={{ title: 'الإشعارات', markAll: 'تحديد الكل كمقروء' }}><NotificationItem id="ar" day="اليوم" title="انتهت الغسالة" time="22:40" unread /></NotificationCenter></Frame></div> },
    expansion: { text: 'German and Finnish titles can run 30% longer. They wrap and the keys do not move.', render: <Frame><NotificationCenter words={{ title: 'Mitteilungen', markAll: 'Alle gelesen' }}><NotificationItem id="de" day="Heute" title="Waschmaschine fertig" time="22:40" unread /></NotificationCenter></Frame> },
  },
  behaviours: {
    states: [
      ['Unread', 'A filled lamp, a medium title and primary ink.', 'Read with the word Unread before the title.'],
      ['Read', 'An empty ring, a regular title and secondary ink; the mark-as-read key is latched.', 'The key is pressed (aria-pressed).'],
      ['Leaving', 'The line fades on motion.exit and is removed.', 'Focus has already moved to the next line.'],
      ['Empty', 'An EmptyState; Mark all read is dimmed.', 'The heading takes focus after the last line goes.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through Mark all read, then the mark-as-read and dismiss keys of each line.', 'native'],
      ['Keyboard', 'Space or Enter', 'Presses the focused key. After a dismiss, focus moves to the next line dismiss key.', 'button'],
      ['Screen reader', 'New line', 'A hidden polite region says New notification with the title. The list is not announced again.', 'role="status"'],
    ],
    loading: <p>NotificationCenter has no loading state. Show a Skeleton in its place until the lines arrive.</p>,
    focus: <p>After a dismiss, focus moves to the dismiss key of the next line, or the previous one. When none is left, the heading takes focus so the person is not dropped back to the page.</p>,
  },
  deepDive: { na: 'NotificationCenter has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'unread',
      rules: <p>Set <code>unread</code> on a line that has not been read. It fills the lamp, sets the title in medium weight and adds the word Unread for assistive tech.</p>,
      pair: { do: center(), doNote: 'Unread and read lines, told by shape and weight.', dont: <Frame><NotificationCenter><NotificationItem id="x" day="Today" title="Washer finished" time="22:40" unread /><NotificationItem id="y" day="Today" title="Door locked" time="22:30" unread /><NotificationItem id="z" day="Today" title="Lamp off" time="22:20" unread /></NotificationCenter></Frame>, dontNote: 'Every line unread: the lamp no longer tells anything apart.' },
    },
    {
      name: 'onReadChange',
      rules: <p>Pass <code>onReadChange</code> when you keep read state yourself. The center then only reports the press, and you change each line <code>unread</code>. Leave it out and the center remembers read state for you.</p>,
      pair: { do: center(), doNote: 'Uncontrolled: nothing to wire.', dont: <Frame><NotificationCenter onReadChange={() => {}}><NotificationItem id="q" day="Today" title="Washer finished" time="22:40" unread /></NotificationCenter></Frame>, dontNote: 'A handler that does nothing: the key presses but the line never changes.' },
    },
    {
      name: 'headingLevel',
      rules: <p><code>headingLevel</code> sets the level of the title, from 2 to 4. The day headings sit one level below.</p>,
      pair: { do: <Frame><NotificationCenter headingLevel={3}><NotificationItem id="h" day="Today" title="Washer finished" time="22:40" /></NotificationCenter></Frame>, doNote: 'Level 3 under a drawer heading at level 2.', dont: <Frame><NotificationCenter headingLevel={2}><NotificationItem id="h2" day="Today" title="Washer finished" time="22:40" /></NotificationCenter></Frame>, dontNote: 'Level 2 under another level 2 heading: the outline repeats a level.' },
    },
  ],
  related: [['/components/list', 'List', 'The rows the center is built from.'], ['/components/toast', 'Toast', 'A short message that goes away by itself.'], ['/components/timeline', 'Timeline', 'A log with no actions.']],
  references: [
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a new line is announced by a polite region.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why unread is a shape and a weight, not only a colour.' },
    { title: 'GOV.UK Design System · Notification banner', url: 'https://design-system.service.gov.uk/components/notification-banner/', why: 'The difference between a banner and a list of messages.' },
  ],
};
