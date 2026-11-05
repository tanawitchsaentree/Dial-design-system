// Usage tab for DatePicker (component-depth.md U1–U14). DatePicker types or picks one day.
import { Button, DatePicker, Input, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ inlineSize: 'var(--ds-size-frame-md)', maxInlineSize: '100%' }}>{children}</div>
);
const basic = (extra: Partial<React.ComponentProps<typeof DatePicker>> = {}) => (
  <Frame><DatePicker label="Start date" defaultValue="2026-11-12" today="2026-11-04" {...extra} /></Frame>
);

export const DATE_PICKER: Depth = {
  overview: (
    <>
      <p>DatePicker asks for one day. It is a recessed window the person can type into, with a round key beside it that opens the Calendar on a small plastic panel. Typing and pressing give the same answer: a day, written <code>yyyy-mm-dd</code> in your code.</p>
      <p>A typed date is read in ISO form or in the order of the locale, and it is committed when the person presses Enter or leaves the field. Text that is not a real day, or a day the page blocks, prints a message under the row and keeps what was typed.</p>
    </>
  ),
  whenToUse: ['To ask for one day, such as a start, a delivery or a birthday.', 'When people often know the date and can type it faster than they can turn months.'],
  whenNot: [
    { situation: 'Showing a month, or choosing a day with no field', to: '/components/calendar', label: 'Calendar' },
    { situation: 'Choosing a time of day', to: '/components/time-picker', label: 'TimePicker' },
    { situation: 'Choosing from a short list of fixed dates', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'DatePicker has one look, a window and a key. Its states are props, covered under Modifiers.' },
  anatomy: {
    render: basic(),
    parts: [
      { part: 'Label', selector: '[data-component="DatePicker"] > label', what: 'The printed name above the window; it names the text field.' },
      { part: 'Date window', selector: '[data-component="DatePicker"] > div > div', what: 'A 44px recess that takes the typed date in tabular figures.' },
      { part: 'Calendar key', selector: '[data-component="DatePicker"] > div > span', what: 'A round 44px key with the calendar glyph that opens the panel.' },
      { part: 'Hint', selector: '[data-component="DatePicker"] > p', what: 'The accepted formats, in secondary ink under the row.' },
    ],
  },
  sizes: { na: 'DatePicker has one size. The window and the key are both 44px and stand on the same edges.' },
  emphasis: { na: 'Nothing in a DatePicker is orange. The orange key in a form is the one that saves it.' },
  placement: {
    rows: [['A form column', 'The picker takes the full width of its column, and the key stands at its end.'], ['A phone sheet', 'The panel is as wide as the month and shifts to stay on the screen.']],
    examples: [{ title: 'In a booking form', render: <Unit><Stack gap="lg"><Input label="Room" defaultValue="Kitchen" /><DatePicker label="Service date" today="2026-11-04" /><Button kind="primary">Book</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['DatePicker + DatePicker', 'Two pickers in a column for a start and an end; use min on the second.'], ['DatePicker + Button', 'The orange key that saves comes after the last field.']],
    avoid: [{ title: 'a DatePicker for a day decades away', why: 'A birth date is forty years of month turns on the Calendar. People type it, so ask for it in three plain fields or a field with a hint that says to type.', render: <Unit><Frame><DatePicker label="Birth date" hint="Type the date; the key opens this year." today="2026-11-04" /></Frame></Unit> }],
  },
  content: {
    formula: <p>Name the day by its job, as in <em>Start date</em> or <em>Delivery day</em>. Leave the format to the hint, which the picker writes for you.</p>,
    pair: {
      do: basic({ label: 'Delivery day', defaultValue: null }), doNote: 'A noun for the job; the hint prints the format.',
      dont: basic({ label: 'Enter the date as mm/dd/yyyy', defaultValue: null, hint: false }), dontNote: 'The label carries the format and the hint is gone.',
    },
    overflow: { text: 'A long label wraps above the window. The window and the key keep 44px and the row does not grow.', render: basic({ label: 'The day the engineer may come to service the heating and the water filter' }) },
    rtl: { text: 'In right-to-left languages the window starts on the right and the key follows it on the left.', render: <div dir="rtl"><Frame><DatePicker label="تاريخ البدء" locale="ar" defaultValue="2026-11-12" today="2026-11-04" chooseLabel="اختر التاريخ" /></Frame></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap above the window and nothing else moves.', render: <Frame><DatePicker label="Gewünschter Liefertermin" locale="de" defaultValue="2026-11-12" today="2026-11-04" chooseLabel="Datum wählen" formatWords={{ day: 'TT', month: 'MM', year: 'JJJJ' }} /></Frame> },
  },
  behaviours: {
    states: [
      ['Default', 'A recessed window and a raised key.', 'The field is named by its label; the key by Choose date.'],
      ['Focus', 'The dark ring around the window, or around the key.', 'Focus is announced on the field or the key.'],
      ['Open', 'The Calendar stands on a panel under the key.', 'The key reports aria-expanded; the panel is a dialog.'],
      ['Invalid', 'A red edge, a mark and a message.', 'aria-invalid and the message read after the field.'],
      ['Read-only', 'The recess stays, the cursor is the default and the key is off.', 'Read as read-only.'],
      ['Disabled', 'No recess shadow, the text at half strength and the key off.', 'Read as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Type, then Enter or Tab', 'Commits the date. Text that is not a real day keeps what was typed and prints a message.', 'native input'],
      ['Keyboard', 'Alt + Down arrow', 'Opens the Calendar from the field.', 'Popover'],
      ['Keyboard', 'Enter / Space on the key', 'Opens the Calendar with focus on the chosen day, or on today.', 'Popover'],
      ['Keyboard', 'Arrows, Home, End, Page Up, Page Down', 'Walk the Calendar; Enter or Space chooses and closes the panel.', 'Calendar'],
      ['Keyboard', 'Escape', 'Closes the panel and returns focus to the key.', 'Popover'],
      ['Pointer', 'Press the key, then a day', 'Opens the panel and chooses the day; a press outside closes it.', 'Popover'],
    ],
    loading: <p>DatePicker has no loading state.</p>,
    focus: <p>Focus starts in the field. The key opens the panel with focus on the chosen day, and closing returns it to the key.</p>,
  },
  deepDive: { na: 'DatePicker has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'min, max and isDateDisabled',
      rules: <p>Block the days that cannot be chosen. They dim on the Calendar, and a typed date that falls on one is refused with a message. Say why in the <code>hint</code>.</p>,
      pair: { do: basic({ min: '2026-11-04', max: '2026-11-30', hint: 'Between 4 and 30 November.' }), doNote: 'The limits are told in the hint.', dont: basic({ min: '2026-11-04', max: '2026-11-30', hint: false }), dontNote: 'The limits are silent, so a refused date is a surprise.' },
    },
    {
      name: 'locale',
      rules: <p><code>locale</code> sets the order a typed date is read in and the words on the Calendar. Pass <code>chooseLabel</code> and <code>formatWords</code> in the same language.</p>,
      pair: { do: <Frame><DatePicker label="Beginn" locale="de" defaultValue="2026-11-12" today="2026-11-04" chooseLabel="Datum wählen" formatWords={{ day: 'TT', month: 'MM', year: 'JJJJ' }} /></Frame>, doNote: 'German order and German words.', dont: <Frame><DatePicker label="Beginn" locale="de" defaultValue="2026-11-12" today="2026-11-04" /></Frame>, dontNote: 'German dates with an English key name and format hint.' },
    },
    {
      name: 'error',
      rules: <p>Pass <code>error</code> for a rule only your page knows, such as a return before a check-in. The picker prints its own message for text that is not a date.</p>,
      pair: { do: basic({ error: 'Return must be after check-in.' }), doNote: 'The message says what to change.', dont: basic({ error: 'Invalid.' }), dontNote: 'The message names nothing.' },
    },
  ],
  related: [['/components/calendar', 'Calendar', 'The month on its own, with no field.'], ['/components/input', 'Input', 'A plain text field.'], ['/components/popover', 'Popover', 'The panel that holds the Calendar.']],
  references: [
    { title: 'WAI-ARIA APG · Date Picker Combobox example', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/', why: 'A text field with a button that opens a dialog holding the grid.' },
    { title: 'GOV.UK Design System · Date input', url: 'https://design-system.service.gov.uk/components/date-input/', why: 'Why a known date is better typed than picked.' },
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'Why a refused date is named in words.' },
  ],
};
