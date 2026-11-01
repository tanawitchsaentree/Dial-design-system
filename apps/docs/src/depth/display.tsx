// Usage tab for Display (component-depth.md U1–U14). Display is the window that says the device's state.
import { Button, Display, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const DISPLAY: Depth = {
  overview: (
    <>
      <p>Display is the one window of a unit that says what the device is doing now. It shows a number or a few words, such as 21.5 °C or 38 min, and nothing else in the unit repeats it.</p>
      <p>The window is set into the body, so its shadow falls on the inside edge. It comes in two families. LCD draws dark segments on grey-green, like a clock radio. OLED sets white text on near-black, like a music player. A screen reader hears the full reading whenever it changes.</p>
    </>
  ),
  whenToUse: ['To show the current state of a device: a temperature, a time left, a station.', 'At the top of a unit, as the first thing anyone reads.', 'For a reading that changes while the person watches.'],
  whenNot: [
    { situation: 'A level shown as a row of lit holes', to: '/components/grille', label: 'Grille' },
    { situation: 'A number inside a sentence or a list', to: '/components/text', label: 'Text' },
    { situation: 'Something the person sets', to: '/components/button', label: 'Button' },
  ],
  variants: {
    lcd: { purpose: 'Numbers that change: a temperature, a timer, a frequency. Dark segments on grey-green.', pairing: 'The usual window on a light unit, with keys or a knob below it.' },
    oled: { purpose: 'Words and numbers together: a track name, a programme name. White text on near-black.', pairing: 'Media and status units where the detail line carries words.' },
  },
  anatomy: {
    render: <Display label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />,
    parts: [
      { part: 'Window', selector: '[data-component="Display"]', what: 'A recess in the body with its shade on the top-left inner edge.' },
      { part: 'Detail line', selector: '[data-component="Display"] [aria-hidden] > span:first-child', what: 'One short line of words at caption size.' },
      { part: 'Value', selector: '[data-component="Display"] svg', what: 'Segment cells on a fixed pitch, right-aligned.' },
      { part: 'Unit', selector: '[data-component="Display"] svg + span', what: 'The unit printed in the grotesk beside the value.' },
    ],
    perVariant: 'On OLED the value is grotesk text, start-aligned, and the detail line sits under it.',
  },
  sizes: {
    sm: { use: '24px digits. A reading in a list row or a small unit.', pairs: 'Text at body size and 44px keys.' },
    md: { use: '40px digits. The window of a normal unit.', pairs: 'A row of keys or a knob under it.' },
    lg: { use: '56px digits. The one reading a whole sheet is about.', pairs: 'Large keys at the bottom of the sheet.' },
  },
  emphasis: {
    text: <p>One window per unit. If a unit needs two readings, put the second one in the detail line, or split the unit in two.</p>,
    pair: {
      do: <Unit><Display label="Oven" value="180" unit="°C" detail="Preheating" digits={3} /></Unit>,
      doNote: 'One window, with the second fact in the detail line.',
      dont: <Unit><Stack gap="sm"><Display label="Oven" value="180" unit="°C" digits={3} /><Display label="Timer" value="25" unit="min" digits={3} /></Stack></Unit>,
      dontNote: 'Two windows in one unit compete for the first look.',
    },
  },
  placement: {
    rows: [['Top of a unit, on the inner inset', 'The reading comes first; the controls sit below or to the right.'], ['Top of a sheet', 'A large window for the one value the sheet changes.']],
    examples: [{ title: 'Above the keys that change it', render: <Unit><Stack gap="md"><Display label="Thermostat" value="21.5" unit="°C" detail="Target" digits={3} /><Stack direction="row" gap="sm"><Button>Cooler</Button><Button>Warmer</Button></Stack></Stack></Unit> }],
  },
  combinations: {
    good: [['Display + keys', 'The keys change what the window says.'], ['Display + Grille', 'The window gives the number and the grille shows the level.']],
    avoid: [{ title: 'a display with a coloured arrow for the change', why: 'The window says the state now. A green or red delta tells change by colour alone.', render: <Unit><Display kind="oled" label="Energy" value="4.2" unit="kWh" detail="Today" /></Unit> }],
  },
  content: {
    formula: <p>The value, then the unit, then one short detail: <em>21.5 °C · Heating to 22.0</em>. Use the unit people read on the device. Keep the detail to three or four words.</p>,
    pair: {
      do: <Display label="Washer" value="38" unit="min" detail="Rinse" digits={3} />, doNote: 'A number, its unit and the step.',
      dont: <Display kind="oled" label="Washer" value="Your wash will be ready soon" />, dontNote: 'A sentence in the value line hides the number.',
    },
    overflow: { text: 'A long detail line wraps under the value. The value line itself never wraps; set digits so the window keeps one width.', render: <div style={{ inlineSize: 220 }}><Display label="Tuner" value="98.5" unit="MHz" detail="FM · Radio Swiss Classic, stereo" digits={4} /></div> },
    rtl: { text: 'In right-to-left languages the window keeps the digits in the same order, and the detail line follows the reading direction.', render: <div dir="rtl"><Display kind="oled" label="المؤقت" value="38" unit="دقيقة" detail="شطف" /></div> },
    expansion: { text: 'German and Finnish detail lines can run 30% longer. The detail wraps and the value stays put.', render: <Display label="Waschmaschine" value="38" unit="min" detail="Spülen, danach Schleudern" digits={3} /> },
  },
  behaviours: {
    states: [
      ['Reading', 'The value, the unit and the detail line in the window.', 'Lit segments in ink, unlit segments as a faint ghost.'],
      ['Changing', 'The new value is there at once. Only each segment fades on or off, in 80ms.', 'Nothing counts up or slides.'],
      ['Reduce motion', 'Segments switch at once with no fade.', 'The reading is the same.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Skips the window. It is never a control.', 'no tabindex'],
      ['Screen reader', 'Read', 'Announced by its label with the full reading as text.', 'role status'],
      ['Screen reader', 'Reading changes', 'The new reading is announced politely, after current speech.', 'aria-live polite'],
    ],
    loading: <p>While a device has not answered yet, show dashes as the value, such as <code>value="--.-"</code>, and say so in the detail line.</p>,
    focus: <p>Display never takes focus. Focus goes to the first control under it.</p>,
  },
  deepDive: {
    lcd: {
      purpose: <p>LCD is for numbers that change. The segments do not glow; they are dark ink on a grey-green window, so the reading holds up in daylight.</p>,
      context: <Unit><Display label="Tuner" value="98.5" unit="MHz" detail="FM" digits={4} /></Unit>,
      practices: ['Set digits to the longest reading, so the window keeps one width.', 'Keep words in the detail line; segments only draw a few letters.'],
      pair: { do: <Display label="Timer" value="25" unit="min" digits={3} />, doNote: 'Numbers in segments.', dont: <Display label="Timer" value="Rinse" digits={5} />, dontNote: 'Words drawn in segments are hard to read.' },
    },
    oled: {
      purpose: <p>OLED is for readings that need words: a track, a programme, a room. White text on near-black, in the system grotesk.</p>,
      context: <Unit><Display kind="oled" label="Player" value="2:41" unit="left" detail="Track 4 · Kind of Blue" /></Unit>,
      practices: ['Keep the value line short: a number and a unit, or two words.', 'Put names in the detail line.'],
      pair: { do: <Display kind="oled" label="Player" value="2:41" unit="left" detail="Track 4" />, doNote: 'The time first, the track under it.', dont: <Display kind="oled" label="Player" value="Track 4 · Kind of Blue" detail="2:41 left" />, dontNote: 'The name in the value line pushes the state down.' },
    },
  },
  modifiers: [
    {
      name: 'digits',
      rules: <p>Sets the number of segment cells on LCD. Short readings get unlit cells on the left, so the window never changes width.</p>,
      pair: { do: <Stack gap="sm"><Display label="Timer" value="8" unit="min" digits={3} /><Display label="Timer" value="38" unit="min" digits={3} /></Stack>, doNote: 'Both windows are the same width.', dont: <Stack gap="sm"><Display label="Timer" value="8" unit="min" /><Display label="Timer" value="38" unit="min" /></Stack>, dontNote: 'Without digits the window narrows when the number gets shorter.' },
    },
    {
      name: 'detail',
      rules: <p>One short line that says the mode or the target. Leave it out when the value says enough.</p>,
      pair: { do: <Display label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />, doNote: 'The target in a few words.', dont: <Display label="Thermostat" value="21.5" unit="°C" detail="The heating is on and will reach 22.0 °C at about 18:40" digits={3} />, dontNote: 'A sentence in the detail line.' },
    },
  ],
  related: [['/components/grille', 'Grille', 'A level shown as lit holes.'], ['/components/text', 'Text', 'A number inside running text.']],
  references: [
    { title: 'WAI-ARIA 1.2 · status role', url: 'https://www.w3.org/TR/wai-aria-1.2/#status', why: 'A polite live region for advisory information.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a changed reading is announced without moving focus.' },
    { title: 'Vitsœ · Dieter Rams: ten principles for good design', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
