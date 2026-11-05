// Usage tab for RangePicker (component-depth.md U1–U14). RangePicker chooses a start day and an end day.
import { Button, RangePicker, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>;
const stay = { start: '2026-11-09', end: '2026-11-17' };
const base = { today: '2026-11-04' } as const;

export const RANGE_PICKER: Depth = {
  overview: (
    <>
      <p>RangePicker chooses a start day and an end day, such as the dates of a stay or a heating holiday. Two recessed wells print the dates, a short ink bar joins them, and a round key opens the Calendar in a panel.</p>
      <p>In the Calendar the two end days are cut into windows and the days between are ruled above and below in a strip. The span is told by shape, so it still shows on a grey screen. Dates are typed and passed as <code>yyyy-mm-dd</code> strings.</p>
    </>
  ),
  whenToUse: ['To choose the first and the last day of a stay, a booking or a holiday.', 'To filter a list to a span of days.'],
  whenNot: [
    { situation: 'Choosing one day', to: '/components/calendar', label: 'Calendar' },
    { situation: 'Choosing a time of day', to: '/components/time-picker', label: 'TimePicker' },
    { situation: 'Choosing two numbers on a scale', to: '/components/range-slider', label: 'RangeSlider' },
  ],
  variants: { na: 'RangePicker has one look, two wells and a key. Limits, locale and the states are props, covered under Modifiers.' },
  anatomy: {
    render: <Frame><RangePicker label="Stay" defaultValue={stay} {...base} /></Frame>,
    parts: [
      { part: 'Group name', selector: '[data-component="RangePicker"] > span', what: 'The printed name above the row. It names the group for assistive tech.' },
      { part: 'Start and end wells', selector: '[data-component="RangePicker"] [data-component="Input"]', what: 'Two Input wells, 44px high, each with its own printed name.' },
      { part: 'Ink bar', selector: '[data-component="RangePicker"] > div > span[aria-hidden]', what: 'The short bar between the wells, the same index mark the Calendar prints under today.' },
      { part: 'Calendar key', selector: '[data-component="RangePicker"] button[aria-haspopup]', what: 'A round 44px key that opens the Calendar in a panel.' },
    ],
  },
  sizes: { na: 'RangePicker has one size. The wells and the key are 44px, like every control in a row.' },
  emphasis: { na: 'The span is told by shape: windows at the ends and a ruled strip between. Nothing in a RangePicker is orange.' },
  placement: {
    rows: [['In a booking form', 'Stand it above the guests and the orange key. It fills the column, so give it a column wide enough for two dates.'], ['Beside a filter', 'Put it on its own row; two wells and a key need about 340px.']],
    examples: [{ title: 'Booking a stay', render: <Unit><Frame><Stack gap="lg"><RangePicker label="Stay" defaultValue={stay} {...base} /><Button kind="primary">Book</Button></Stack></Frame></Unit> }],
  },
  combinations: {
    good: [['RangePicker + Button', 'The orange key that books comes after the dates.'], ['RangePicker + TimePicker', 'The days first, then the time of arrival.']],
    avoid: [{ title: 'two Calendars for one span', why: 'Two grids ask the same thing twice and neither shows the span between them. Use one RangePicker.', render: <Unit><Frame><Stack gap="lg"><RangePicker label="From" {...base} /><RangePicker label="To" {...base} /></Stack></Frame></Unit> }],
  },
  content: {
    formula: <p>Name the group for what the span is, as in <em>Stay</em> or <em>Holiday</em>. Keep the well names short, <em>Start</em> and <em>End</em>, or the words people use, such as <em>Arrive</em> and <em>Leave</em>.</p>,
    pair: {
      do: <Frame><RangePicker label="Stay" startLabel="Arrive" endLabel="Leave" defaultValue={stay} {...base} /></Frame>, doNote: 'The group names the span and the wells name the two ends.',
      dont: <Frame><RangePicker label="Select a date range" defaultValue={stay} {...base} /></Frame>, dontNote: 'The group repeats the control. Say what the span is for.',
    },
    overflow: { text: 'Each well takes half of the row after the key. At about 340px an ISO date still fits at body size; below that the row scrolls the page, not the wells.', render: <Frame><RangePicker label="Stay" defaultValue={stay} {...base} /></Frame> },
    rtl: { text: 'In right-to-left languages the start well sits on the right, the key on the left, and the Calendar opens beside it. The dates themselves stay left-to-right digits.', render: <div dir="rtl"><Frame><RangePicker label="الإقامة" startLabel="البداية" endLabel="النهاية" openLabel="اختيار التواريخ" defaultValue={stay} {...base} /></Frame></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap above the wells and the row keeps its height.', render: <Frame><RangePicker label="Aufenthalt" startLabel="Anreise" endLabel="Abreise" openLabel="Daten wählen" locale="de" defaultValue={stay} {...base} /></Frame> },
  },
  behaviours: {
    states: [
      ['Default', 'Two empty or filled wells, the bar and the key.', 'A group named by its label.'],
      ['Open', 'The Calendar stands in a panel under the key.', 'The key reports aria-expanded.'],
      ['Choosing the end', 'The first day is a window; the days under the pointer are ruled with a dotted line.', 'A line under the Calendar says Now choose the last day.'],
      ['Chosen', 'Windows at both ends and a solid ruled strip between.', 'Each day inside the range is announced as in range and aria-selected.'],
      ['Invalid text', 'A message with a glyph under the row.', 'The well is aria-invalid and points to the message.'],
      ['Read-only', 'The dates stay readable; the key does not open.', 'Wells are read-only.'],
      ['Disabled', 'Wells, bar and key at the disabled step.', 'All controls are disabled.'],
    ],
    interactions: [
      ['Keyboard', 'Enter, Space on the key', 'Open the Calendar with focus on one day.', 'RangePicker: the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key'],
      ['Keyboard', 'Arrow keys, Home, End, Page keys', 'Walk the days as in Calendar. The pair previews as you move.', 'RangePicker: the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key'],
      ['Keyboard', 'Enter, Space on a day', 'The first press sets the start; the second sets the end, closes the panel and returns focus to the key.', 'RangePicker: the first press sets the start, a hover previews the end with a dotted strip, and the second press sets the end and closes'],
      ['Keyboard', 'Escape', 'Closes the panel and returns focus to the key.', 'RangePicker: the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key'],
      ['Keyboard', 'Type in a well, Tab or Enter', 'Accepts a yyyy-mm-dd date. An end before the start swaps the pair.', 'RangePicker: a typed date is accepted on blur, a bad one is reported, and a start after the end swaps the pair'],
      ['Pointer', 'Press, hover', 'Press a day to set the start, hover to preview, press again to set the end.', 'native'],
      ['Screen reader', 'Read', 'A group with two named fields and a key that opens a dialog.', 'group, dialog, aria-selected'],
    ],
    loading: <p>RangePicker has no loading state. If booked days come from a server, pass them through <code>isDateDisabled</code> once they have arrived.</p>,
    focus: <p>Tab moves start well, end well, key. Opening the Calendar puts focus on one day; closing it, by Escape or by the second press, puts focus back on the key.</p>,
  },
  deepDive: { na: 'RangePicker has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'min, max, isDateDisabled',
      rules: <p><code>min</code> and <code>max</code> close the ends and <code>isDateDisabled</code> blocks single days, both in the Calendar and in the wells. A range may still run across a blocked day; check that in your own code.</p>,
      pair: { do: <Frame><RangePicker label="Stay" min="2026-11-04" max="2026-12-18" hint="Up to 14 nights." {...base} /></Frame>, doNote: 'The limits and the longest stay are said under the row.', dont: <Frame><RangePicker label="Stay" isDateDisabled={() => true} {...base} /></Frame>, dontNote: 'Every day blocked: nothing can be chosen.' },
    },
    {
      name: 'value, defaultValue, onValueChange',
      rules: <p>The value is <code>{'{ start, end }'}</code>, each a <code>yyyy-mm-dd</code> string or null. The first day chosen calls <code>onValueChange</code> with <code>end: null</code>; the second completes the pair. The ends always arrive in order.</p>,
      pair: { do: <Frame><RangePicker label="Stay" defaultValue={stay} {...base} /></Frame>, doNote: 'Both ends set, in order.', dont: <Frame><RangePicker label="Stay" defaultValue={{ start: '2026-11-09', end: null }} {...base} /></Frame>, dontNote: 'Only the start is set: finish the pair before you save.' },
    },
    {
      name: 'readOnly, disabled',
      rules: <p><code>readOnly</code> keeps the dates readable and does not open the Calendar. <code>disabled</code> switches the wells and the key off.</p>,
      pair: { do: <Frame><RangePicker label="Booked" readOnly defaultValue={stay} {...base} /></Frame>, doNote: 'A booked stay shown for reading.', dont: <Frame><RangePicker label="Booked" disabled defaultValue={stay} {...base} /></Frame>, dontNote: 'Disabled dims the whole pair; use it only when the field is unavailable.' },
    },
  ],
  related: [['/components/calendar', 'Calendar', 'Choosing one day.'], ['/components/time-picker', 'TimePicker', 'Choosing a time of day.'], ['/components/input', 'Input', 'The well the dates are typed into.'], ['/components/popover', 'Popover', 'The panel the Calendar opens in.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Date Picker Dialog', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/', why: 'The grid and key map the Calendar inside follows.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the span is a ruled strip and not a tinted band.' },
    { title: 'GOV.UK Design System · Date input', url: 'https://design-system.service.gov.uk/components/date-input/', why: 'Why dates are typed in named parts as well as picked.' },
  ],
};
