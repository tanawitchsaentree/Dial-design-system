// Usage tab for Calendar (component-depth.md U1–U14). Calendar is a month grid for choosing one day.
import { Button, Calendar, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const month = { defaultMonth: '2026-11', today: '2026-11-04' } as const;

export const CALENDAR: Depth = {
  overview: (
    <>
      <p>Calendar prints one month for choosing one day, such as the start of a heating schedule. The days stand flat on the body in seven fixed columns. Today carries a short bar under its number, and the chosen day is cut into a small recessed window.</p>
      <p>Days go in and out as plain <code>yyyy-mm-dd</code> strings, so there is no date object to parse or time zone to mind. A DatePicker or a RangePicker can sit on top of it with the same strings.</p>
    </>
  ),
  whenToUse: ['To choose one day from a month, such as a start date.', 'To show which day is chosen, with today marked beside it.'],
  whenNot: [
    { situation: 'Choosing a time of day', to: '/components/time-picker', label: 'TimePicker' },
    { situation: 'Turning through a long list of pages', to: '/components/pagination', label: 'Pagination' },
    { situation: 'Picking a number on a range', to: '/components/slider', label: 'Slider' },
  ],
  variants: { na: 'Calendar has one look, a month of printed days. Limits, locale and the first day of the week are props, covered under Modifiers.' },
  anatomy: {
    render: <Calendar {...month} defaultValue="2026-11-12" />,
    parts: [
      { part: 'Month keys', selector: '[data-component="Calendar"] > div:first-child > button', what: 'Two round 44px keys that turn the month. They are the only raised parts.' },
      { part: 'Month name', selector: '[data-component="Calendar"] > div:first-child > div', what: 'The month and year in medium weight, read out when it changes.' },
      { part: 'Weekday names', selector: '[data-component="Calendar"] th', what: 'Seven short names over the columns. The full name is read out.' },
      { part: 'Day', selector: '[data-component="Calendar"] button[data-date]', what: 'A 44px printed number. One day is in the tab order at a time.' },
      { part: 'Chosen day', selector: '[data-component="Calendar"] button[data-selected]', what: 'The day cut into a recessed window, in medium weight.' },
      { part: 'Today bar', selector: '[data-component="Calendar"] button[data-today] > span', what: 'A short ink bar under today’s number.' },
    ],
  },
  sizes: { na: 'Calendar has one size. A day is a 44px square, so the grid is seven of them wide.' },
  emphasis: { na: 'Today and the chosen day are told by shape and weight. Nothing in a Calendar is orange.' },
  placement: {
    rows: [['In a sheet or a card', 'Stand it on the body of the unit. It has no surface of its own.'], ['Beside a time field', 'Put the Calendar first and the time under it.']],
    examples: [{ title: 'Choosing a start date', render: <Unit><Stack gap="lg"><Calendar {...month} defaultValue="2026-11-12" /><Button kind="primary">Set start date</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Calendar + Button', 'The orange key that saves comes after the Calendar.'], ['Calendar + TimePicker', 'The day first, then the time of day.']],
    avoid: [{ title: 'two Calendars for one date', why: 'Two grids ask the same thing twice. Use one and, for a range, a RangePicker.', render: <Unit><Stack gap="lg"><Calendar {...month} /><Calendar {...month} /></Stack></Unit> }],
  },
  content: {
    formula: <p>Pass days as <code>yyyy-mm-dd</code>. Leave the month and weekday words to <code>locale</code>, and pass <code>previousLabel</code> and <code>nextLabel</code> in the same language.</p>,
    pair: {
      do: <Calendar {...month} locale="de" previousLabel="Voriger Monat" nextLabel="Nächster Monat" />, doNote: 'The words come from the locale and the keys are named in the same language.',
      dont: <Calendar {...month} locale="de" />, dontNote: 'The month is German but the keys are still named in English.',
    },
    overflow: { text: 'The month name is one line and the grid is seven fixed columns. A narrow frame scrolls the page, not the grid.', render: <Calendar {...month} locale="fi" /> },
    rtl: { text: 'In right-to-left languages the week runs from the right, the keys swap sides and their chevrons mirror. The arrow keys follow the picture.', render: <div dir="rtl"><Calendar {...month} locale="ar" weekStart={6} defaultValue="2026-11-12" /></div> },
    expansion: { text: 'German and Finnish month names run longer. They still fit the width of the grid.', render: <Calendar {...month} locale="de" weekStart={1} defaultMonth="2026-09" /> },
  },
  behaviours: {
    states: [
      ['Default', 'The number in secondary ink.', 'Announced with its full date.'],
      ['Hover', 'The ink goes one step darker. Nothing lifts.', '—'],
      ['Pressed', 'The recess cuts in at once.', '—'],
      ['Focus', 'The focus ring around the 44px cell.', 'The full date is read out.'],
      ['Today', 'A short bar under the number.', 'Announced with aria-current="date".'],
      ['Chosen', 'A recessed window, a ring border and medium weight.', 'The cell is aria-selected.'],
      ['Unavailable', 'Half-strength ink and a not-allowed cursor.', 'Announced as dimmed (aria-disabled).'],
    ],
    interactions: [
      ['Keyboard', 'Arrow keys', 'Move one day or one week. Past the edge of the month the month turns.', 'Calendar: arrows, Home, End and Page keys move the focus over days and months'],
      ['Keyboard', 'Home, End', 'Go to the first or the last day of the week.', 'Calendar: arrows, Home, End and Page keys move the focus over days and months'],
      ['Keyboard', 'Page Up, Page Down', 'Turn one month; with Shift, one year.', 'Calendar: arrows, Home, End and Page keys move the focus over days and months'],
      ['Keyboard', 'Enter, Space', 'Choose the focused day.', 'Calendar: Enter chooses the focused day and an unavailable day cannot be chosen'],
      ['Keyboard', 'Tab', 'Moves into the grid at one day, then out. The grid is one stop.', 'Calendar: exactly one day is in the tab order'],
      ['Pointer', 'Press', 'Chooses the day, or turns the month with a key.', 'native'],
      ['Screen reader', 'Read', 'A grid named by the month. Each day has its full date.', 'grid, gridcell, aria-selected, aria-current'],
    ],
    loading: <p>Calendar has no loading state. If days come from a server, pass them through <code>isDateDisabled</code> once they have arrived.</p>,
    focus: <p>One day is in the tab order: the focused day, else the chosen day, else today, else the first of the month. Choose a day and focus stays on it.</p>,
  },
  deepDive: { na: 'Calendar has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'min, max, isDateDisabled',
      rules: <p><code>min</code> and <code>max</code> close the ends of the range and <code>isDateDisabled</code> blocks single days. Blocked days stay in place and stay reachable by the arrow keys, but they cannot be chosen. A month key goes flat when the whole month beyond it is blocked.</p>,
      pair: { do: <Calendar {...month} min="2026-11-04" max="2026-12-18" />, doNote: 'Days outside the range are dimmed and stay in their columns.', dont: <Calendar {...month} min="2026-11-04" isDateDisabled={() => true} />, dontNote: 'Every day is blocked, so nothing can be chosen. Disable the Calendar instead.' },
    },
    {
      name: 'weekStart, locale',
      rules: <p><code>weekStart</code> is 0 for Sunday through 6 for Saturday and defaults to Monday. <code>locale</code> sets month, weekday and number words through Intl.</p>,
      pair: { do: <Calendar {...month} locale="th" weekStart={0} previousLabel="เดือนก่อน" nextLabel="เดือนถัดไป" />, doNote: 'A Thai month with the week starting on Sunday.', dont: <Calendar {...month} locale="th" />, dontNote: 'Thai words with English key names.' },
    },
    {
      name: 'readOnly, disabled',
      rules: <p><code>readOnly</code> keeps focus and the arrow keys so the month can be read. <code>disabled</code> turns every day and both keys off.</p>,
      pair: { do: <Calendar {...month} readOnly defaultValue="2026-11-12" />, doNote: 'A booked day shown for reading.', dont: <Calendar {...month} disabled defaultValue="2026-11-12" />, dontNote: 'Disabled dims the whole month, including the chosen day. Use readOnly when the value should still be read.' },
    },
  ],
  related: [['/components/time-picker', 'TimePicker', 'Choosing a time of day.'], ['/components/pagination', 'Pagination', 'Turning through pages.'], ['/components/segmented-control', 'SegmentedControl', 'Choosing between a few named options.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Date Picker Dialog', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/', why: 'The grid, roving tabindex and key map that Calendar follows.' },
    { title: 'MDN · Intl.DateTimeFormat', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat', why: 'Where the month and weekday words come from.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why today and the chosen day are shapes and not tints.' },
  ],
};
