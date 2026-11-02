// Usage tab for TimePicker (component-depth.md U1–U14). TimePicker is the set window of a clock radio:
// hour and minute in a recessed well, each a spinbutton, with a pair of round set keys under each.
import { Button, Display, Input, Select, Stack, Switch, TimePicker } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const TIME_PICKER: Depth = {
  overview: (
    <>
      <p>TimePicker sets a time of day, such as when night mode starts, when the heating comes on or when the blinds close. It sits in the same recessed well as an Input. The hour and the minute are two fields drawn as 7-segment figures, like the window of a clock radio, and a pair of round set keys stands under each field.</p>
      <p>Each field is a spinbutton. The arrow keys step it, PageUp and PageDown take bigger steps, Home and End reach the ends, and typing digits sets it. The value is always <code>HH:MM</code> on the 24 hour clock, whatever the person sees. With <code>hourCycle="12"</code> the hour runs from 1 to 12 and AM and PM are printed in the well, the current one marked with a lamp. TimePicker is never orange, because a time is a setting and the unit’s one orange part is the control that acts.</p>
    </>
  ),
  whenToUse: [
    'For a time of day that repeats, such as the start of a night schedule or a wake-up time.',
    'In a settings sheet, under the display that says the device’s state now.',
    'In a pair, for the start and end of a period such as quiet hours.',
  ],
  whenNot: [
    { situation: 'A length of time, such as a 25 minute timer', to: '/components/input', label: 'Input' },
    { situation: 'A few fixed times, such as Sunset or 22:00', to: '/components/select', label: 'Select' },
    { situation: 'Showing the time, not setting it', to: '/components/display', label: 'Display' },
  ],
  variants: {
    segment: { purpose: 'The figures are 7-segment cells in ink, with set keys under each field. The default for a schedule in a device sheet.', pairing: 'One or two pickers under a Display, with a Switch for the schedule.' },
    text: { purpose: 'The figures are set in the grotesk at title size with tabular figures, with no keys. For dense forms and long lists of times.', pairing: 'Rows of Inputs and Selects in a settings form.' },
  },
  anatomy: {
    render: <TimePicker label="Night mode starts" hourCycle="12" defaultValue="22:30" hint="Every day" />,
    parts: [
      { part: 'Label', selector: '[data-component="TimePicker"] > span:first-child', what: 'Printed above the well. It names the group of fields.' },
      { part: 'Well', selector: '[data-component="TimePicker"] [role="group"] > span:nth-child(1)', what: 'The recess with a hairline ring, the same well as Input.' },
      { part: 'Hour field', selector: '[data-component="TimePicker"] [role="group"] > span:nth-child(1) > span:nth-child(1)', what: 'A spinbutton drawn as two segment cells, at least 44px each way.' },
      { part: 'Minute field', selector: '[data-component="TimePicker"] [role="group"] > span:nth-child(1) > span:nth-child(3)', what: 'A spinbutton after the colon, the same size as the hour.' },
      { part: 'AM and PM', selector: '[data-component="TimePicker"] [role="group"] > span:nth-child(1) > span:nth-child(4)', what: 'Both words printed; the current one in ink and medium weight with its lamp lit.' },
      { part: 'Set keys', selector: '[data-component="TimePicker"] [role="group"] > span:nth-child(2)', what: 'Two 44px round keys under each field, minus and plus.' },
    ],
    perVariant: 'kind text sets the figures in the grotesk and leaves out the set keys unless keys is set.',
  },
  sizes: { na: 'TimePicker has one size. The fields are at least 44px each way, and kind text is shorter for dense forms.' },
  emphasis: {
    text: <p>A time is a setting, so TimePicker is never orange and never the unit’s loud control. The orange key is the one that acts, such as Save. Two pickers side by side are fine for a start and an end. More than that belongs in a list of schedules.</p>,
    pair: {
      do: <Unit><Stack gap="md"><TimePicker label="Starts" defaultValue="22:30" /><Button kind="primary">Save</Button></Stack></Unit>,
      doNote: 'Ink figures, and the one orange key acts.',
      dont: <Unit><Stack gap="md"><TimePicker label="Starts" defaultValue="22:30" /><TimePicker label="Ends" defaultValue="06:30" /><TimePicker label="Lights off" defaultValue="23:00" /></Stack></Unit>,
      dontNote: 'Three pickers in one unit. Split them into schedules.',
    },
  },
  placement: {
    rows: [['Under the display', 'The window says the state, the picker sets when it changes.'], ['In a pair', 'Start and end side by side, start first in reading order.'], ['In a settings form', 'kind text, one per row with the other fields.']],
    examples: [
      { title: 'Quiet hours, start and end', render: <Stack direction="row" gap="lg"><TimePicker label="Starts" kind="text" defaultValue="22:00" /><TimePicker label="Ends" kind="text" defaultValue="07:00" /></Stack> },
    ],
  },
  combinations: {
    good: [['TimePicker + Switch', 'The switch turns the schedule on, the picker says when.'], ['TimePicker + Display', 'The window says the state now, the picker the time it changes.'], ['Two TimePickers', 'The start and the end of a period.']],
    avoid: [
      { title: 'a time typed into a plain Input', why: 'A text field takes any text, so 22.30, 10pm and 2230 all arrive. TimePicker only takes an hour and a minute.', render: <Input label="Night mode starts" defaultValue="10pm" /> },
    ],
  },
  content: {
    formula: <p>The label says what happens at that time, as in <em>Night mode starts</em> or <em>Heating comes on at</em>. Put the days or the time zone in the hint, as in <em>Every day</em>. Use the 24 hour clock unless the people using the product read the 12 hour clock.</p>,
    pair: {
      do: <TimePicker label="Heating comes on at" defaultValue="06:00" />, doNote: 'The label says what the time does.',
      dont: <TimePicker label="Time" defaultValue="06:00" />, dontNote: 'Time names the field, not what happens.',
    },
    overflow: { text: 'A long label wraps above the well and the well keeps its width. The fields never grow.', render: <div data-overflow-demo="" style={{ inlineSize: 220 }}><TimePicker label="Hall and stairs lights dim to night level at" kind="text" defaultValue="22:30" /></div> },
    rtl: { text: 'In right-to-left languages the label and hint follow the reading direction. The time keeps hour before minute, as clocks are read in those languages too.', render: <div dir="rtl"><TimePicker label="يبدأ الوضع الليلي" kind="text" defaultValue="22:30" hourLabel="الساعة" minuteLabel="الدقيقة" /></div> },
    expansion: { text: 'German and Finnish labels run about 30% longer. The label wraps; the fields and keys keep their size.', render: <TimePicker label="Nachtmodus beginnt um" defaultValue="22:30" hint="Jeden Tag" hourLabel="Stunde" minuteLabel="Minute" /> },
  },
  behaviours: {
    states: [
      ['Not set', 'Both fields show two dashes and announce Not set.', 'Typing or an arrow key sets the field.'],
      ['Set', 'The figures in ink. The value is HH:MM on the 24 hour clock.', 'Each segment fades on or off in 80ms.'],
      ['Focused field', 'A dark ring around that field’s cell on a quiet ground.', 'The other field stays as it was.'],
      ['Invalid', 'The well edge in the critical colour, the message under it with a glyph.', 'Both fields carry aria-invalid.'],
      ['Read only', 'The figures stay, the set keys go. Fields can be focused and read.', 'Arrows and digits change nothing.'],
      ['Disabled', 'The well loses its shadow and the figures fade. No set keys.', 'The fields cannot be focused.'],
      ['Reduce motion', 'Segments switch with no fade.', 'The value changes the same way.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the hour, then the minute, then AM or PM. The set keys are skipped, because the arrows do their job.', 'tab order'],
      ['Keyboard', 'Arrow up and down', 'Steps the field by one, or by minuteStep on the minute. 23 steps to 00.', 'aria-valuenow'],
      ['Keyboard', 'PageUp and PageDown', 'Three hours or ten minutes at a time.', 'aria-valuenow'],
      ['Keyboard', 'Home and End', 'The first and the last value of the field.', 'aria-valuemin, aria-valuemax'],
      ['Keyboard', 'Digits', 'Types the field. After two digits, or one that can only stand alone, focus moves to the next field.', 'aria-valuetext'],
      ['Keyboard', 'Arrow left and right', 'Moves between the fields, mirrored in right-to-left pages.', 'focus'],
      ['Keyboard', 'A and P', 'Sets AM or PM on the period field.', 'aria-valuetext'],
      ['Pointer', 'Press a set key', 'Steps that field down or up by one.', 'button'],
      ['Screen reader', 'Read', 'The group label, then each field’s name and value, such as Hour, 22.', 'role group, role spinbutton'],
    ],
    loading: <p>Until the device reports its schedule, show a Skeleton of kind text in the picker’s place, or leave the fields not set with a hint that says the time is on its way.</p>,
    focus: <p>Focus starts on the hour. When a sheet opens to change one schedule, put focus on its hour field. After a valid time is typed in full, focus stays on the last field so the person can tab on.</p>,
  },
  deepDive: {
    segment: {
      purpose: <p>The clock radio’s set window. Hour and minute are drawn as 7-segment figures in ink on the well, and a pair of round set keys stands under each field. People with a pointer press the keys; people with a keyboard use the arrows or type.</p>,
      context: <Unit><Stack gap="md"><Display label="Night mode" value="On" detail="Until 06:30" digits={3} /><TimePicker label="Night mode starts" defaultValue="22:30" /><Switch label="Every day" defaultChecked /></Stack></Unit>,
      practices: ['Use it in a device sheet, one or two per unit.', 'Keep the set keys, unless the sheet is short of room.'],
      pair: { do: <TimePicker label="Wake-up light" defaultValue="06:45" />, doNote: 'Figures in ink, keys under each field.', dont: <Display label="Wake-up light" value="06:45" digits={4} />, dontNote: 'A Display is never a control, so this time cannot be changed.' },
    },
    text: {
      purpose: <p>The same fields in the grotesk, for a settings form where many fields sit one per row. It has no set keys unless you pass keys, so it takes less height.</p>,
      context: <Stack gap="md" style={{ maxInlineSize: 320 }}><Input label="Schedule name" defaultValue="Night" /><TimePicker label="Starts" kind="text" defaultValue="22:30" /><Select label="Repeat" options={[{ value: 'day', label: 'Every day' }, { value: 'week', label: 'Weekdays' }]} defaultValue="day" /></Stack>,
      practices: ['Use it with other fields in a form.', 'Pass keys when the form is used on a touch screen.'],
      pair: { do: <TimePicker label="Ends" kind="text" defaultValue="07:00" />, doNote: 'Grotesk figures with the other fields.', dont: <TimePicker label="Ends" kind="text" defaultValue="07:00" keys hint="Keys in a dense form add height to every row." />, dontNote: 'Keys in every row of a long form.' },
    },
  },
  modifiers: [
    {
      name: 'hourCycle',
      rules: <p>24, the default, runs the hour through 00 to 23. With 12 the hour stops at 12 and a third field for AM and PM appears. The value given to onValueChange is HH:MM on the 24 hour clock either way.</p>,
      pair: { do: <TimePicker label="Night mode starts" hourCycle="12" defaultValue="22:30" />, doNote: '10:30 with PM marked.', dont: <TimePicker label="Night mode starts" defaultValue="10:30" hint="Is this morning or night?" />, dontNote: 'A 12 hour time on the 24 hour clock means the morning.' },
    },
    {
      name: 'minuteStep',
      rules: <p>Sets how far the arrows and set keys move the minute, default 1. Typed minutes stay exact. Use 5 or 15 when schedules are set in round times.</p>,
      pair: { do: <TimePicker label="Blinds close at" defaultValue="19:15" minuteStep={15} />, doNote: 'Quarter hours for blinds.', dont: <TimePicker label="Alarm" defaultValue="06:40" minuteStep={30} />, dontNote: 'Half hours for an alarm leave most times out of reach by key.' },
    },
    {
      name: 'keys',
      rules: <p>Shows the set keys. It is on for kind segment and off for kind text. The keys are left out of the tab order, because the arrows do the same.</p>,
      pair: { do: <TimePicker label="Coffee at" defaultValue="06:30" />, doNote: 'Keys for a touch screen.', dont: <TimePicker label="Coffee at" defaultValue="06:30" keys={false} hint="On a phone only typing is left." />, dontNote: 'No keys on a touch sheet.' },
    },
    {
      name: 'error',
      rules: <p>Marks the fields invalid and prints the message under the well with a glyph. Say what is wrong and what time would work.</p>,
      pair: { do: <TimePicker label="Ends" kind="text" defaultValue="21:00" error="Ends before it starts. Pick a time after 22:30." />, doNote: 'The problem and a time that works.', dont: <TimePicker label="Ends" kind="text" defaultValue="21:00" error="Invalid" />, dontNote: 'Invalid says nothing about what to change.' },
    },
  ],
  related: [['/components/input', 'Input', 'A length of time or any other number.'], ['/components/select', 'Select', 'A few fixed times.'], ['/components/display', 'Display', 'Showing the time, not setting it.']],
  references: [
    { title: 'WAI-ARIA 1.2 · spinbutton role', url: 'https://www.w3.org/TR/wai-aria-1.2/#spinbutton', why: 'Value, range, value text and the keys a spinbutton answers.' },
    { title: 'WAI-ARIA APG · Spin Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/', why: 'Arrows, PageUp, PageDown, Home and End, and typing into the field.' },
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'The error says in words what is wrong with the time.' },
  ],
};
