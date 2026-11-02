// Usage tab for ExplainMode (component-depth.md U1–U14). The SK 4 manual printed on the real screen.
import { Card, Display, Explain, ExplainMode, Rotary, Stack, Switch } from 'dial-react';
import type { Depth } from './types';

const Lamp = ({ name = 'Brightness', does = 'Sets how bright the lamp is.', open = true }: { name?: string; does?: string; open?: boolean }) => (
  <ExplainMode defaultOpen={open}>
    <Card padding="unit" wordmark="dial" model="lamp 1">
      <Stack direction="row" gap="xl">
        <Explain name={name} does={does}><Rotary kind="key" label="Brightness" min={0} max={10} defaultValue={7} /></Explain>
      </Stack>
    </Card>
  </ExplainMode>
);

export const EXPLAIN_MODE: Depth = {
  overview: (
    <>
      <p>ExplainMode answers how this works on the real screen. One plastic key, or the question mark key, prints each part’s name and one line of what it does in the free space next to it, like the names printed under the knobs in an old radio manual. A thin leader joins each name to its part.</p>
      <p>The printing sits in a layer that never takes a pointer, so every knob, key and switch keeps working while the names are up. A person can turn the volume while reading what it does. Escape, the same key or the question mark key again takes the printing away.</p>
      <p>Each part is marked with <code>Explain</code>, or with a <code>data-explain</code> attribute that holds the name and the line split by a bar. While the mode is up, the control inside each part is described by its printed words, so a screen reader hears the same thing a sighted person reads.</p>
    </>
  ),
  whenToUse: [
    'On a unit with parts a newcomer may not know, such as a tuner or a thermostat with an away switch.',
    'As a help key on a screen people use rarely, such as a washer’s programmes.',
    'When the words should sit next to the parts on the real screen, with nothing to click through.',
  ],
  whenNot: [
    { situation: 'Showing that one part changes another', to: '/components/wiring', label: 'Wiring' },
    { situation: 'A message about what just happened', to: '/components/snackbar', label: 'Snackbar' },
    { situation: 'A notice that stays on the screen', to: '/components/banner', label: 'Banner' },
  ],
  variants: { na: 'ExplainMode has one form, names printed beside their parts. Where each name goes is decided by the free space, covered under Behaviours.' },
  anatomy: {
    render: (
      <ExplainMode defaultOpen>
        <Card padding="unit" wordmark="dial" model="thermostat 1">
          <Explain name="Window" does="Shows the room now and the heat it aims for."><Display label="Lounge" value="20.5" unit="°C" detail="Heating to 22" digits={3} /></Explain>
          <Stack direction="row" gap="xl">
            <Explain name="Temperature" does="Sets the heat the room aims for."><Rotary label="Temperature" min={16} max={26} defaultValue={22} /></Explain>
          </Stack>
        </Card>
      </ExplainMode>
    ),
    parts: [
      { part: 'Part', selector: '[data-component="ExplainMode"] [data-explain]', what: 'A control or a window marked with its name and its line.' },
      { part: 'Name', selector: '[data-component="ExplainMode"] [data-explain-layer] > div > span:first-child', what: 'The part’s name at label size in the medium weight.' },
      { part: 'Line', selector: '[data-component="ExplainMode"] [data-explain-layer] > div > span:last-child', what: 'One line of what the part does, in secondary ink.' },
      { part: 'Leader', selector: '[data-component="ExplainMode"] [data-explain-layer] path', what: 'A hairline from the part’s edge to its name.' },
      { part: 'Key', selector: '[data-component="ExplainMode"] button[aria-pressed]', what: 'The plastic How this works key that turns the mode on and off.' },
    ],
  },
  sizes: { na: 'ExplainMode has no size of its own. The names are set at label and caption size and stay narrower than a menu.' },
  emphasis: {
    text: <p>The key is a plastic key, never orange, because the unit’s loud control stays the loud one. Explain the parts a newcomer would ask about, and leave out the ones that say themselves, such as a key with the word Start on it.</p>,
    pair: {
      do: <Lamp />,
      doNote: 'One part, one name, one line.',
      dont: <Lamp name="Brightness knob for the lamp" does="This rotary control sets the brightness of the lamp, which is currently at seven out of ten." />,
      dontNote: 'A long name and a line that reads out the value.',
    },
  },
  placement: {
    rows: [['Inside a unit', 'Wrap one Card or DeviceCard so the names sit beside its parts.'], ['Around a screen', 'Wrap a whole room screen so every unit names its parts at once.']],
    examples: [{ title: 'A switch named on its unit', render: <ExplainMode defaultOpen><Card padding="unit"><Stack direction="row" gap="xl"><Explain name="Away" does="Holds the room at 16 while nobody is home."><Switch label="Away" /></Explain></Stack></Card></ExplainMode> }],
  },
  combinations: {
    good: [['ExplainMode + Wiring', 'The names say what each part does, and the lines say what is joined.'], ['ExplainMode + DeviceCard', 'A device whose parts a newcomer may not know.']],
    avoid: [
      { title: 'a tour with Next keys', why: 'A step by step tour blocks the controls and shows one part at a time. ExplainMode prints every name at once and blocks nothing.', render: <Lamp open={false} /> },
      { title: 'the value in the line', why: 'The window already says the state. The line says what the part does, so it never goes stale.', render: <Lamp does="Now at 7." /> },
    ],
  },
  content: {
    formula: <p>The name is what the part is called on the unit, one or two words, as in <em>Volume</em> or <em>Station</em>. The line says what it does in one short sentence that starts with a verb, as in <em>Sets how loud the speaker plays.</em> Never put the current value in it.</p>,
    pair: {
      do: <Lamp name="Brightness" does="Sets how bright the lamp is." />, doNote: 'A name and a verb.',
      dont: <Lamp name="Rotary 1" does="Rotary control." />, dontNote: 'A part number and a line that says nothing.',
    },
    overflow: { text: 'A long line wraps under its name and the note stays narrower than a menu, so it never runs over another part.', render: <div data-overflow-demo="" style={{ inlineSize: 320 }}><Lamp does="Sets how bright the lamp is, from a night glow to full reading light in the evening." /></div> },
    rtl: { text: 'In right to left languages the unit mirrors and each note is placed again from where its part now stands.', render: <div dir="rtl"><ExplainMode defaultOpen toggleLabel="كيف يعمل"><Card padding="unit"><Stack direction="row" gap="xl"><Explain name="السطوع" does="يضبط سطوع المصباح."><Rotary kind="key" label="السطوع" min={0} max={10} defaultValue={7} /></Explain></Stack></Card></ExplainMode></div> },
    expansion: { text: 'German words run about 30% longer. The line wraps inside the note and the leader still meets the name.', render: <Lamp name="Helligkeit" does="Stellt ein, wie hell die Lampe leuchtet." /> },
  },
  behaviours: {
    states: [
      ['Off', 'Only the How this works key shows.', 'The parts carry no extra description.'],
      ['On', 'Every marked part prints its name, its line and a leader. The key is latched.', 'A polite status says the mode is on and that Escape closes it.'],
      ['Placement', 'Each note goes under its part, else above, after or before it, wherever it clears every part, every word and every other note. Where no space is free, a numeral stands beside the part and the note goes in a key under the unit.','The printing appears and leaves at once; text does not animate.'],
    ],
    interactions: [
      ['Keyboard', 'Enter, Space, ?, Escape', 'The key toggles the mode. The question mark key toggles it while focus is inside, outside a text field. Escape closes it from anywhere.', 'aria-pressed, aria-keyshortcuts'],
      ['Pointer', 'Press the key', 'The key toggles the mode. The printing never takes a pointer, so every control under it still works.', 'pointer-events none'],
      ['Screen reader', 'Read', 'While the mode is on, each part’s control is described by its name and its line.', 'aria-describedby, role status'],
    ],
    loading: <p>ExplainMode prints names only for parts on the screen. A part that arrives later gets its note the next time the mode opens.</p>,
    focus: <p>Opening the mode leaves focus where it was, so the person can go on turning the knob they were on. The key sits last in the unit’s tab order.</p>,
  },
  deepDive: { na: 'ExplainMode has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'toggle',
      rules: <p>Set <code>toggle</code> to false and pass <code>open</code> and <code>onOpenChange</code> when the screen has its own help key, such as an entry in a menu.</p>,
      pair: { do: <Lamp open={false} />, doNote: 'The built in key at the end of the unit.', dont: <Card padding="unit"><Display label="Lamp" value="70" unit="%" digits={3} /></Card>, dontNote: 'No key and no other way to open it.' },
    },
    {
      name: 'shortcut',
      rules: <p>The question mark key by default. Pick another key only when the screen already uses it, and say so on the key.</p>,
      pair: { do: <Lamp open={false} />, doNote: 'The key opens it, and so does the question mark key.', dont: <Lamp open={false} name="Brightness" does="Press F1 to learn more." />, dontNote: 'A key nobody can find from the line.' },
    },
  ],
  related: [['/components/wiring', 'Wiring', 'Shows which part changes which.'], ['/components/device-card', 'DeviceCard', 'A unit whose parts it names.'], ['/components/button', 'Button', 'The plastic key that opens it.']],
  references: [
    { title: 'WCAG 2.2 · 1.4.13 Content on Hover or Focus', url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html', why: 'Why the printing can be dismissed with Escape and hides nothing it explains.' },
    { title: 'WAI-ARIA 1.2 · aria-describedby', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-describedby', why: 'How each part’s control hears its printed words.' },
    { title: 'WAI-ARIA 1.2 · aria-keyshortcuts', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts', why: 'How the question mark key is announced on the key.' },
  ],
};
