// Usage tab for Progress (component-depth.md U1–U14). Progress is a recessed groove that fills with a resin rod.
import { Button, Display, Progress, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const W = { maxInlineSize: 'var(--ds-layout-frame-md)' };

export const PROGRESS: Depth = {
  overview: (
    <>
      <p>Progress shows how far a device task has run, such as a wash cycle, a firmware update or a descaling program. It is a groove sunk into the body that fills with a grey resin rod from the start of the line. The name of the task and the reading, such as 38 min left, are printed on the line above.</p>
      <p>The fill is a resin rod lit along its upper edge, never orange. When the device cannot say how far it is, the groove shows a still row of ticks and the word Working. Nothing moves while the task runs. The groove only changes when the device reports a new value.</p>
    </>
  ),
  whenToUse: ['For a task with a known end, such as a wash cycle, a download or an update.', 'Under the display, when the display shows the time and the groove shows the share done.', 'In a list of devices, one small groove per row.'],
  whenNot: [
    { situation: 'A level that goes up and down, such as volume', to: '/components/grille', label: 'Grille' },
    { situation: 'The person sets the amount', to: '/components/slider', label: 'Slider' },
    { situation: 'Only the time left matters', to: '/components/display', label: 'Display' },
  ],
  variants: { na: 'Progress has one look. With no value it shows the indeterminate form, covered under Modifiers.' },
  anatomy: {
    render: <Progress label="Washer" value={55} valueText="38 min left" style={W} />,
    parts: [
      { part: 'Label line', selector: '[data-component="Progress"] > span:nth-of-type(1)', what: 'The task name at the start, the reading at the end, in caption size.' },
      { part: 'Groove', selector: '[data-component="Progress"] > span:nth-of-type(2)', what: 'A recess 8px tall with the shade on its top-left inner edge.' },
      { part: 'Fill', selector: '[data-component="Progress"] > span:nth-of-type(2) > span', what: 'A resin rod in line.ring, lit along its upper edge, from the start of the line to the value.' },
    ],
    perVariant: 'The indeterminate form has twelve short ticks spread along the groove instead of the fill.',
  },
  sizes: {
    md: { use: 'An 8px groove. The main reading of a unit.', pairs: 'A Display above it and a Button below it.' },
    sm: { use: 'A 4px groove. Rows in a list of devices.', pairs: 'A device name and a Badge on the same row.' },
  },
  emphasis: {
    text: <p>One groove per unit, for the task the unit is running. The display above it says the state. The groove only adds how far it has run.</p>,
    pair: {
      do: <Unit><Stack gap="md"><Display label="Washer" value="0:38" digits={4} /><Progress label="Cotton 40°" value={55} valueText="38 min left" /></Stack></Unit>,
      doNote: 'The window and one groove for the same task.',
      dont: <Unit><Stack gap="md"><Progress label="Wash" value={55} /><Progress label="Rinse" value={0} /><Progress label="Spin" value={0} /></Stack></Unit>,
      dontNote: 'A groove for each step. Show one groove for the whole cycle.',
    },
  },
  placement: {
    rows: [['Under the display', 'The window says the time, the groove the share done.'], ['At the end of a list row', 'A small groove for each device running a task.']],
    examples: [{ title: 'In a list of devices', render: <Stack gap="md" style={W}><Progress label="Dishwasher" value={70} valueText="20 min left" size="sm" /><Progress label="Oven" value={30} valueText="Preheating" size="sm" /></Stack> }],
  },
  combinations: {
    good: [['Progress + Display', 'The time in the window, the share in the groove.'], ['Progress + a Pause key', 'The person can stop the task the groove shows.']],
    avoid: [{ title: 'a groove for a level that goes up and down', why: 'Progress only moves toward the end of a task. A level such as volume belongs in a Grille.', render: <Progress label="Volume" value={60} valueText="6 of 10" style={W} /> }],
  },
  content: {
    formula: <p>The label names the task, as in <em>Washer</em> or <em>Firmware update</em>. valueText says the reading people care about, as in <em>38 min left</em> or <em>12 of 48 MB</em>. Without valueText the reading is the percent.</p>,
    pair: {
      do: <Progress label="Washer" value={55} valueText="38 min left" style={W} />, doNote: 'Time left is what people wait for.',
      dont: <Progress label="Progress" value={55} style={W} />, dontNote: 'The label names the component. Name the task that is running.',
    },
    overflow: { text: 'A long label wraps on the line above the groove, and the reading stays on one line at the end.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><Progress label="Firmware update for the hall speaker" value={64} valueText="64%" /></div> },
    rtl: { text: 'In right-to-left languages the fill starts from the right, because it follows the reading direction.', render: <div dir="rtl" style={W}><Progress label="الغسالة" value={55} valueText="٣٨ دقيقة" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label line wraps first. The groove keeps its height.', render: <Progress label="Firmware-Aktualisierung" value={64} valueText="64 %" style={W} /> },
  },
  behaviours: {
    states: [
      ['Running', 'Ink fills the groove from the start of the line to the value.', 'The share is value ÷ max.'],
      ['New value', 'The fill grows to the new value in 120ms.', 'Nothing moves between reports.'],
      ['Indeterminate', 'Twelve still ink ticks along the groove, and Working on the label line.', 'Nothing loops or sweeps, in any motion setting.'],
      ['Done', 'The groove is full and the reading says so.', 'Replace it with the unit’s next state when the person has seen it.'],
      ['Reduce motion', 'The fill jumps to the new value at once.', 'The reading is the same.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Skips the groove. It shows a value and is not a control.', 'no tabindex'],
      ['Screen reader', 'Read', 'Announced as a progress bar with its label and the reading in words.', 'role progressbar'],
    ],
    loading: <p>Progress is itself the loading state. Before the device reports a share, use the indeterminate form with a reading such as Starting.</p>,
    focus: <p>Progress never takes focus. Focus goes to the control that pauses or stops the task.</p>,
  },
  deepDive: { na: 'Progress has one kind, covered above.' },
  modifiers: [
    {
      name: 'value (left out)',
      rules: <p>Leave value out when the device cannot say how far it is. The groove shows still ink ticks and the reading says Working, or your valueText. It does not move, because dial does not move while idle. Switch to a value as soon as the device reports one.</p>,
      pair: { do: <Progress label="Descaling" valueText="Working, about 20 min" style={W} />, doNote: 'Still ticks and a reading in words.', dont: <Progress label="Descaling" value={0} style={W} />, dontNote: 'An empty groove at 0% looks like the task never started.' },
    },
    {
      name: 'max',
      rules: <p>Sets the end of the task in its own unit, such as 48 for 48 MB. The fill is value ÷ max. Default 100.</p>,
      pair: { do: <Progress label="Firmware update" value={12} max={48} valueText="12 of 48 MB" style={W} />, doNote: 'The reading uses the same unit as max.', dont: <Progress label="Firmware update" value={12} max={48} style={W} />, dontNote: 'The reading says 25% while the device reports megabytes.' },
    },
  ],
  related: [['/components/grille', 'Grille', 'A level that goes up and down.'], ['/components/display', 'Display', 'The time left as a number.'], ['/components/button', 'Button', 'Pause or stop the task.']],
  references: [
    { title: 'WAI-ARIA 1.2 · progressbar role', url: 'https://www.w3.org/TR/wai-aria-1.2/#progressbar', why: 'Value, range and the indeterminate form with no aria-valuenow.' },
    { title: 'WCAG 2.2 · 2.2.2 Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html', why: 'Why the indeterminate form does not loop.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'The ink fill must stand apart from the groove at 3:1.' },
  ],
};
