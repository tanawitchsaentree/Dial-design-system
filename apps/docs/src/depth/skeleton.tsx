// Usage tab for Skeleton (component-depth.md U1–U14). Skeleton is the unit with its power off: ghost
// segments, unlit holes and flat plastic the size of the parts that are still loading. It never moves.
import { Button, Display, Grille, Skeleton, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="demo-box demo-card" aria-busy="true" aria-label={label}>{children}</div>
);
const Busy = ({ children, label }: { children: React.ReactNode; label: string }) => <div aria-busy="true" aria-label={label}>{children}</div>;
const W = { maxInlineSize: 320 };

export const SKELETON: Depth = {
  overview: (
    <>
      <p>Skeleton holds the place of content that is still on its way, such as a device card while the house answers, a row in a list of rooms or the reading in a display. Each kind draws the part it stands for with the power off. The display window shows its unlit segments, the grille shows its holes with none lit, and keys, knobs and lines of text are flat plastic of their own size.</p>
      <p>It never moves. There is no shimmer, no pulse and no sweep, in any motion setting, because dial keeps still while idle. When the content lands it takes the exact box the skeleton held, so nothing around it shifts. Skeleton is hidden from assistive tech. The region it stands in says <code>aria-busy="true"</code> and carries the name of what is loading.</p>
    </>
  ),
  whenToUse: [
    'For the first load of a card, a list or a reading whose shape you already know.',
    'When the wait is likely to last longer than a moment, about a third of a second or more.',
    'In a list of devices, one skeleton row for each device the house reported but has not described yet.',
  ],
  whenNot: [
    { situation: 'A device task with a known end, such as a wash cycle or an update', to: '/components/progress', label: 'Progress' },
    { situation: 'A reading the device has already sent, even if it is old', to: '/components/display', label: 'Display' },
    { situation: 'A short status after an action, such as Saved', to: '/components/toast', label: 'Toast' },
  ],
  variants: {
    text: { purpose: 'Lines of text, such as a name, a room or a sentence. Each line is one line box tall with a flat bar the cap height of the type.', pairing: 'Under a disc in a list row, or below the window in a card.' },
    display: { purpose: 'A Display reading. The same window, padding and segment cells as Display, with every segment unlit.', pairing: 'At the top of a unit, where the Display will stand.' },
    grille: { purpose: 'A Grille meter. The same holes on the same pitch, none of them lit.', pairing: 'Beside the knob or under the window, in the Grille’s place.' },
    disc: { purpose: 'A key or a knob, drawn as a flat disc of 44, 72 or 108px with no shadow.', pairing: 'At the start of a list row, or where the unit’s knob will sit.' },
    block: { purpose: 'An area for a chart, a picture or a groove, flat plastic the full width of its column.', pairing: 'Under the window in a card that shows a history or a camera still.' },
  },
  anatomy: {
    render: (
      <Unit label="Thermostat, loading">
        <Stack gap="md">
          <Skeleton kind="display" digits={3} unit="°C" />
          <Stack direction="row" gap="lg" align="center"><Skeleton kind="disc" /><Skeleton kind="grille" /></Stack>
          <Skeleton size="sm" extent="40%" />
        </Stack>
      </Unit>
    ),
    parts: [
      { part: 'Ghost window', selector: '[data-component="Skeleton"][data-kind="display"]', what: 'Display’s recessed window with every segment in the ghost ink.' },
      { part: 'Flat disc', selector: '[data-component="Skeleton"][data-kind="disc"]', what: 'Flat plastic the diameter of the knob, with no part shadow.' },
      { part: 'Unlit holes', selector: '[data-component="Skeleton"][data-kind="grille"]', what: 'Grille’s holes on the module pitch, none lit.' },
      { part: 'Text line', selector: '[data-component="Skeleton"][data-kind="text"]', what: 'One line box tall, a flat bar the cap height of the type.' },
    ],
    perVariant: 'Each kind has one part. The region around them carries aria-busy and the name of what is loading.',
  },
  sizes: {
    sm: { use: 'Caption text, 24px segment cells, a 44px key, a 48px block. The parts of a list row.', pairs: 'A list of devices with one small key and two caption lines per row.' },
    md: { use: 'Body text, 40px segment cells, a 72px knob, a 96px block. The parts of a device card.', pairs: 'A card with a window at the top and a knob below it.' },
    lg: { use: 'Title text, 56px segment cells, a 108px knob, a 160px block. The main part of a sheet.', pairs: 'A full sheet for one device on a phone.' },
  },
  emphasis: {
    text: <p>Draw only the parts the content will have. A card with a window and a knob gets a ghost window and a flat disc, not a block for every corner. Keep the skeleton for the first load. Once a reading has arrived, show it, even while a newer one is on its way.</p>,
    pair: {
      do: <Unit label="Kettle, loading"><Stack gap="md"><Skeleton kind="display" digits={3} unit="°C" /><Skeleton size="sm" extent="50%" /></Stack></Unit>,
      doNote: 'The window and the one line the card will have.',
      dont: <Unit label="Kettle, loading"><Stack gap="md"><Skeleton kind="block" size="sm" /><Skeleton kind="block" size="sm" /><Skeleton kind="block" size="sm" /></Stack></Unit>,
      dontNote: 'Blocks that match nothing. The card will jump when the reading lands.',
    },
  },
  placement: {
    rows: [['In the place of a Display', 'kind display with the Display’s digits and unit.'], ['At the start of a list row', 'A small disc, then two text lines.'], ['Beside a knob', 'kind grille with the Grille’s columns and rows.']],
    examples: [
      {
        title: 'A list of rooms loading',
        render: (
          <Busy label="Rooms, loading">
            <Stack gap="lg" style={W}>
              {[0, 1].map((i) => <Stack key={i} direction="row" gap="md" align="center"><Skeleton kind="disc" size="sm" /><div style={{ flex: 1 }}><Skeleton lines={2} lastLine={0.5} size="sm" /></div></Stack>)}
            </Stack>
          </Busy>
        ),
      },
    ],
  },
  combinations: {
    good: [['Skeleton + Display', 'The ghost window gives way to the lit one in the same box.'], ['Skeleton + Grille', 'Unlit holes, then the level.'], ['Skeleton text + a disc', 'One list row while the device describes itself.']],
    avoid: [
      { title: 'a skeleton next to a Progress for the same wait', why: 'Two signs for one wait. Progress is for a task with an end, Skeleton for content that has not arrived.', render: <Busy label="Washer, loading"><Stack gap="md" style={W}><Skeleton kind="display" digits={4} /><Skeleton size="sm" extent="60%" /></Stack></Busy> },
    ],
  },
  content: {
    formula: <p>Skeleton has no words of its own. The region it stands in is named for what is loading, as in <em>Thermostat, loading</em> or <em>Devices, loading</em>. Give the text kind the number of lines the content usually has, and the last line the share it usually fills.</p>,
    pair: {
      do: <Busy label="Room name, loading"><Skeleton extent={160} /></Busy>, doNote: 'One line for a room name, about its usual width.',
      dont: <Busy label="Room name, loading"><Skeleton lines={4} /></Busy>, dontNote: 'Four full lines for a two word name. The card shrinks when it lands.',
    },
    overflow: { text: 'A text skeleton never grows past its column. In a narrow column the lines keep their height and take the width there is.', render: <div data-overflow-demo="" aria-busy="true" aria-label="Loading" style={{ inlineSize: 160 }}><Skeleton lines={3} extent={400} lastLine={0.5} /></div> },
    rtl: { text: 'In right-to-left languages the short last line starts from the right, the way the text will.', render: <div dir="rtl" aria-busy="true" aria-label="جارٍ التحميل" style={W}><Skeleton lines={2} lastLine={0.5} extent={280} /></div> },
    expansion: { text: 'Text that runs 30% longer in German or Finnish needs one more line more often. Hold the number of lines the longest language uses.', render: <Busy label="Lädt"><Stack gap="sm" style={W}><Text size="caption">Wohnzimmerbeleuchtung</Text><Skeleton lines={2} lastLine={0.7} /></Stack></Busy> },
  },
  behaviours: {
    states: [
      ['Loading', 'The unlit parts hold the content’s boxes. The region says aria-busy="true".', 'Nothing moves, in any motion setting.'],
      ['Loaded', 'The content replaces the skeleton in the same box. aria-busy goes back to false.', 'The swap is immediate, with no fade.'],
      ['Failed', 'Replace the skeleton with the error and a way to try again.', 'Never leave a skeleton up after the request has failed.'],
      ['Reduce motion', 'The same still parts.', 'There is no motion to remove.'],
      ['Forced colours', 'Every part is drawn as an outline in the grey text colour.', 'The reserved space stays visible.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Skips the skeleton. It holds a place and is not a control.', 'no tabindex'],
      ['Screen reader', 'Read', 'Hears the region’s name and that it is busy, never the placeholder parts.', 'aria-hidden on Skeleton, aria-busy on the region'],
      ['Pointer', 'Hover or press', 'Nothing happens. A flat disc never responds like a key.', 'no handlers'],
    ],
    loading: <p>Skeleton is itself the loading state. Use it for the first load only. For a refresh, keep the old content up and change it when the new one arrives.</p>,
    focus: <p>Skeleton never takes focus. If the region holds the page’s main content, keep focus where it was and move it only if the person asked for the content, for example by opening a device.</p>,
  },
  deepDive: {
    text: {
      purpose: <p>Lines of text with the height of real text. Each line is one line box of the size you pick, with a flat bar the cap height of the type inside it. So a skeleton paragraph is as tall as the paragraph will be.</p>,
      context: <Unit label="Hall lamp, loading"><Stack gap="sm"><Skeleton size="md" extent="50%" /><Skeleton size="sm" lines={2} lastLine={0.4} /></Stack></Unit>,
      practices: ['Pick the size of the text that will land.', 'Set lines to the usual count and lastLine to its usual share.'],
      pair: { do: <Busy label="Loading"><Skeleton size="lg" extent={180} /></Busy>, doNote: 'A title line for a device name.', dont: <Busy label="Loading"><Skeleton kind="block" size="sm" extent={22} /></Busy>, dontNote: 'A block for a title. Its height will not match the text.' },
    },
    display: {
      purpose: <p>The ghost of a Display reading. It has Display’s window, padding, nested radius and segment pitch, with every segment unlit, so it reads as the device with its power off. Pass the Display’s digits, unit and detail and it takes the same box.</p>,
      context: <Unit label="Tuner, loading"><Skeleton kind="display" digits={4} unit="MHz" detail /></Unit>,
      practices: ['Use the same digits as the Display that replaces it.', 'Pass unit and detail so the window keeps its width and height.'],
      pair: { do: <Busy label="Loading"><Skeleton kind="display" digits={3} unit="°C" /></Busy>, doNote: 'The window the reading will light.', dont: <Display label="Thermostat" value="0.0" unit="°C" digits={3} />, dontNote: 'A zero reading says the room is at 0 °C.' },
    },
    grille: {
      purpose: <p>The holes of a Grille, none lit. Same pitch and recess as Grille, so the level lands in the same place. It is hidden from assistive tech, so the empty holes are never read as a level of zero.</p>,
      context: <Unit label="Speaker, loading"><Stack direction="row" gap="lg" align="center"><Skeleton kind="disc" /><Skeleton kind="grille" cols={8} rows={3} /></Stack></Unit>,
      practices: ['Use the Grille’s cols and rows.', 'Keep it beside the part it measures.'],
      pair: { do: <Busy label="Loading"><Skeleton kind="grille" cols={8} rows={2} /></Busy>, doNote: 'Unlit holes, hidden from assistive tech.', dont: <Grille label="Volume" value={0} max={16} cols={8} rows={2} />, dontNote: 'A Grille at zero is announced as volume 0.' },
    },
    disc: {
      purpose: <p>A flat disc where a key or a knob will stand. It has no shadow and no height, so nobody tries to press it, and it is the size of the part, 44px for a key and 72px or 108px for a knob.</p>,
      context: <Unit label="Lamp, loading"><Stack direction="row" gap="md" align="center"><Skeleton kind="disc" size="sm" /><div style={{ flex: 1 }}><Skeleton lines={2} lastLine={0.5} /></div></Stack></Unit>,
      practices: ['Match the diameter of the key or knob.', 'Do not draw the orange. The loud control appears when it can be used.'],
      pair: { do: <Busy label="Loading"><Skeleton kind="disc" size="md" /></Busy>, doNote: 'Flat plastic the size of the knob.', dont: <Button disabled>Start</Button>, dontNote: 'A disabled key looks like a choice that is locked.' },
    },
    block: {
      purpose: <p>A flat area for content with no fixed parts, such as a chart of the last day or a camera still. It fills its column and takes the height you give it.</p>,
      context: <Unit label="Energy, loading"><Stack gap="md"><Skeleton size="sm" extent="40%" /><Skeleton kind="block" size="md" /></Stack></Unit>,
      practices: ['Set extent to the height of the chart or picture.', 'Use text, display or disc when the part has a shape of its own.'],
      pair: { do: <Busy label="Loading"><Skeleton kind="block" size="sm" /></Busy>, doNote: 'A block the height of the chart.', dont: <Busy label="Loading"><Skeleton kind="block" extent={56} /></Busy>, dontNote: 'A block in place of a window. Use kind display.' },
    },
  },
  modifiers: [
    {
      name: 'lines and lastLine',
      rules: <p>lines sets how many text lines to hold, default 1. lastLine sets the last line’s share of the others, from 0 to 1. It defaults to 0.6 when there is more than one line, and to the full width for one line.</p>,
      pair: { do: <Busy label="Loading"><Skeleton lines={3} lastLine={0.4} /></Busy>, doNote: 'A paragraph that ends short.', dont: <Busy label="Loading"><Skeleton lines={3} lastLine={1} /></Busy>, dontNote: 'Three full lines read as a block, not as text.' },
    },
    {
      name: 'extent',
      rules: <p>The inline size of a text skeleton, the diameter of a disc or the height of a block, in px or any CSS length. Leave it out to use the size step.</p>,
      pair: { do: <Busy label="Loading"><Skeleton extent={120} /></Busy>, doNote: 'About the width of a room name.', dont: <Busy label="Loading"><Skeleton /></Busy>, dontNote: 'A full width line for a two word name.' },
    },
    {
      name: 'digits, unit and detail',
      rules: <p>On kind display these mirror the Display that replaces it. digits sets the cells, unit reserves the unit’s width and detail reserves the detail line. The unit and the detail are not shown.</p>,
      pair: { do: <Busy label="Loading"><Skeleton kind="display" digits={3} unit="°C" detail /></Busy>, doNote: 'The window keeps the reading’s box.', dont: <Busy label="Loading"><Skeleton kind="display" digits={6} /></Busy>, dontNote: 'Six cells for a three digit reading. The window narrows when it lands.' },
    },
  ],
  related: [['/components/display', 'Display', 'The reading once it has arrived.'], ['/components/progress', 'Progress', 'A task with a known end.'], ['/components/grille', 'Grille', 'The level once it has arrived.']],
  references: [
    { title: 'WAI-ARIA 1.2 · aria-busy', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-busy', why: 'The region says it is being updated, so assistive tech waits.' },
    { title: 'WCAG 2.2 · 2.2.2 Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html', why: 'Why the placeholder does not shimmer or pulse.' },
    { title: 'web.dev · Cumulative Layout Shift', url: 'https://web.dev/articles/cls', why: 'Holding the exact box keeps the page from jumping when content lands.' },
  ],
};
