// Usage tab for Wiring (component-depth.md U1–U14). Relations printed between parts, after P8.
import { Card, Display, Rotary, Switch, Wiring } from 'dial-react';
import type { Depth } from './types';

const Pair2 = ({ active = true, label = 'sets', text = 'The thermostat sets the heater' }: { active?: boolean; label?: string; text?: string }) => (
  <Wiring label="Heating relations" links={[{ from: 'a', to: 'b', label, text, active }]}>
    <Wiring.Node id="a"><Rotary kind="key" label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} /></Wiring.Node>
    <Wiring.Node id="b"><Card padding="unit" wordmark="dial" model="heater 2"><Display label="Heater" value="21" unit="°C" digits={2} /></Card></Wiring.Node>
  </Wiring>
);

export const WIRING: Depth = {
  overview: (
    <>
      <p>Wiring shows that one part changes what another does. It prints the relation on the face, the way a schematic face joins a knob to the circuit it shapes. A person sees that the thermostat sets the heater, or that night mode lowers it after 23:00, before they touch anything.</p>
      <p>Each relation is a hairline of ink between two parts, with right angles and one bend at most, and a small dot where it meets each part. It can carry one short lowercase word, such as <em>after 23:00</em>. Related parts can sit inside one printed box with a lowercase name above it.</p>
      <p>A relation that acts right now prints at full ink with filled dots, and its word turns medium. One that waits prints in secondary ink with hollow dots. Lines never move. When a relation turns active its ink steps over a short fade, the length of a display segment.</p>
      <p>Every relation is also a sentence. The sentences sit in a list that only assistive technology reads, and each control at either end is described by the sentences that touch it. Focusing the thermostat says that it sets the heater.</p>
    </>
  ),
  whenToUse: [
    'When one setting changes what another does and the person should see it, as with a thermostat and a heater.',
    'On an automation view, to show which sensor drives which lights and when.',
    'On a room screen, to show that a schedule acts on a device at a set time.',
  ],
  whenNot: [
    { situation: 'Parts that only sit together with no effect on each other', to: '/components/card', label: 'Card' },
    { situation: 'A list of rules a person writes and edits', to: '/components/list', label: 'List' },
    { situation: 'Naming what each part does', to: '/components/explain-mode', label: 'ExplainMode' },
  ],
  variants: { na: 'Wiring has one form, the schematic face. A relation is active or waiting, and parts may sit in a group box, both covered under Modifiers.' },
  anatomy: {
    render: (
      <Wiring label="Heating relations" links={[{ from: 'a', to: 'b', label: 'sets', text: 'The thermostat sets the heater', active: true }, { from: 'c', to: 'b', label: 'after 23:00', text: 'Night mode lowers the heater to 18' }]}>
        <Wiring.Group label="heating">
          <Wiring.Node id="a"><Rotary kind="key" label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} /></Wiring.Node>
          <Wiring.Node id="b"><Card padding="unit" wordmark="dial" model="heater 2"><Display label="Heater" value="21" unit="°C" digits={2} /></Card></Wiring.Node>
        </Wiring.Group>
        <Wiring.Node id="c"><Card padding="unit" wordmark="dial" model="scene 1"><Switch label="Night mode" /></Card></Wiring.Node>
      </Wiring>
    ),
    parts: [
      { part: 'Line', selector: '[data-component="Wiring"] svg path', what: 'A hairline of ink between two parts, one straight run or one bend.' },
      { part: 'Dot', selector: '[data-component="Wiring"] svg circle', what: 'A small dot where the line meets a part, filled when the relation acts.' },
      { part: 'Word', selector: '[data-component="Wiring"] > span', what: 'One short lowercase word beside the line.' },
      { part: 'Box', selector: '[data-component="Wiring"] [data-wiring-group] > div', what: 'A printed box around related parts.' },
      { part: 'Box name', selector: '[data-component="Wiring"] [data-wiring-group] > span', what: 'The group name in lowercase, printed above the box.' },
      { part: 'Node', selector: '[data-component="Wiring"] [data-wiring-node]', what: 'A part a line can join. Its controls are described by the relations that touch it.' },
    ],
  },
  sizes: { na: 'Wiring has no size of its own. The lines take their length from the space between the parts it joins.' },
  emphasis: {
    text: <p>Print only the relations a person needs to understand the screen, and at most one or two active at once. When every line is at full ink, none of them says what acts right now.</p>,
    pair: {
      do: <Pair2 />,
      doNote: 'One active relation at full ink.',
      dont: (
        <Wiring label="Relations" links={[{ from: 'a', to: 'b', text: 'The knob sets the heater', active: true }, { from: 'b', to: 'c', text: 'The heater warms the room', active: true }, { from: 'a', to: 'c', text: 'The knob sets the room', active: true }]}>
          <Wiring.Node id="a"><Rotary kind="key" label="Knob" defaultValue={3} /></Wiring.Node>
          <Wiring.Node id="b"><Card padding="unit"><Display label="Heater" value="21" digits={2} /></Card></Wiring.Node>
          <Wiring.Node id="c"><Card padding="unit"><Display label="Room" value="20" digits={2} /></Card></Wiring.Node>
        </Wiring>
      ),
      dontNote: 'Three active lines that say the same thing twice.',
    },
  },
  placement: {
    rows: [['A room screen', 'The thermostat, the heater and the night schedule, wired where they sit.'], ['An automation view', 'Sensors on one side, the devices they drive on the other, each line with its condition.']],
    examples: [{ title: 'A switch and the heater it lowers', render: <Wiring label="Night mode" links={[{ from: 's', to: 'h', label: 'lowers to 18', text: 'Night mode lowers the heater to 18' }]}><Wiring.Node id="s"><Card padding="unit"><Switch label="Night mode" /></Card></Wiring.Node><Wiring.Node id="h"><Card padding="unit"><Display label="Heater" value="21" unit="°C" digits={2} /></Card></Wiring.Node></Wiring> }],
  },
  combinations: {
    good: [['Wiring + DeviceCard', 'The device a relation acts on keeps its own window and keys.'], ['Wiring + TimePicker', 'A schedule wired to the device it changes, with the time on the line.'], ['Wiring + ExplainMode', 'The lines say what is joined, and the printed names say what each part does.']],
    avoid: [
      { title: 'a line for decoration', why: 'A line between parts that do not affect each other tells the person something false.', render: <Card padding="unit"><Display label="Clock" value="10:42" digits={4} /></Card> },
      { title: 'colour for the state', why: 'An active relation is full ink with filled dots and a medium word. A coloured line would say the state with colour alone.', render: <Pair2 active={false} /> },
    ],
  },
  content: {
    formula: <p>The word on a line names the condition or the effect in lowercase, two or three words at most, as in <em>after 23:00</em> or <em>lowers to 18</em>. The sentence says the whole relation with both ends named, as in <em>Night mode lowers the heater to 18</em>. Wiring adds <em>on now</em> or <em>waiting</em> to it.</p>,
    pair: {
      do: <Pair2 label="after 23:00" text="Night mode lowers the heater to 18" />, doNote: 'A short condition on the line and a full sentence.',
      dont: <Pair2 label="When the night mode schedule starts the heater goes down" text="Link 1" />, dontNote: 'A sentence on the line and a number for the sentence.',
    },
    overflow: { text: 'A long word on a line stays on one line and moves along its run until it clears every part.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}><Pair2 label="after sunset on weekdays" /></div> },
    rtl: { text: 'In right to left languages the parts mirror and the lines are routed again from where the parts now stand.', render: <div dir="rtl"><Wiring label="علاقات التدفئة" activeWord="يعمل الآن" waitingWord="ينتظر" links={[{ from: 'a', to: 'b', label: 'بعد 23:00', text: 'الوضع الليلي يخفض المدفأة إلى 18', active: true }]}><Wiring.Node id="a"><Rotary kind="key" label="الحرارة" min={16} max={26} defaultValue={21} /></Wiring.Node><Wiring.Node id="b"><Card padding="unit"><Display label="المدفأة" value="18" unit="°C" digits={2} /></Card></Wiring.Node></Wiring></div> },
    expansion: { text: 'German words run about 30% longer. The word on the line finds a place along the run, and the sentence is never cut.', render: <Pair2 label="nach 23:00 Uhr" text="Der Nachtmodus senkt die Heizung auf 18" /> },
  },
  behaviours: {
    states: [
      ['Waiting', 'Secondary ink, hollow dots, regular word.', 'The sentence ends in waiting.'],
      ['Active', 'Full ink, filled dots, medium word.', 'The ink steps over motion.segment; at once under reduced motion. The sentence ends in on now.'],
      ['Layout change', 'The lines are routed again from the parts’ new places.', 'Nothing animates; the lines are simply drawn where the parts now are.'],
    ],
    interactions: [
      ['Keyboard', 'Tab to a part', 'The control at one end takes focus as it always does. Wiring adds no stop of its own.', 'aria-describedby'],
      ['Pointer', 'None', 'Lines and words never take a pointer, so a part under a line still works.', 'pointer-events none'],
      ['Screen reader', 'Read', 'The relations are a list of sentences named by label. A control at either end is described by its sentences.', 'ul, aria-describedby'],
    ],
    loading: <p>Wiring draws a line only when both of its parts are on the screen. While a part is still loading its line is not drawn, and its sentence is still in the list.</p>,
    focus: <p>Wiring never takes focus. Focus moves through the parts in reading order, and each control at an end of a relation is described by that relation.</p>,
  },
  deepDive: { na: 'Wiring has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'active',
      rules: <p>Set <code>active</code> on a link while the relation acts right now, such as night mode after 23:00. Leave it off while it waits.</p>,
      pair: { do: <Pair2 />, doNote: 'The relation that acts now is at full ink.', dont: <Pair2 active={false} label="sets" />, dontNote: 'An acting relation left in secondary ink.' },
    },
    {
      name: 'Wiring.Group',
      rules: <p>Wrap related parts in <code>Wiring.Group</code> with a lowercase <code>label</code>. The box nests the cards inside it at an even inset.</p>,
      pair: {
        do: <Wiring label="Tone" links={[]}><Wiring.Group label="tone"><Wiring.Node id="b"><Rotary kind="key" label="Bass" defaultValue={2} /></Wiring.Node><Wiring.Node id="t"><Rotary kind="key" label="Treble" defaultValue={1} /></Wiring.Node></Wiring.Group></Wiring>,
        doNote: 'Two tone knobs in one box.',
        dont: <Wiring label="Tone" links={[]}><Wiring.Group label="tone"><Wiring.Node id="b"><Rotary kind="key" label="Bass" defaultValue={2} /></Wiring.Node></Wiring.Group><Wiring.Group label="tone"><Wiring.Node id="t"><Rotary kind="key" label="Treble" defaultValue={1} /></Wiring.Node></Wiring.Group></Wiring>,
        dontNote: 'One box per knob says nothing about the group.',
      },
    },
    {
      name: 'label',
      rules: <p>A link’s <code>label</code> is printed beside its line. Leave it out when the two ends already say the relation.</p>,
      pair: { do: <Pair2 label="after 23:00" />, doNote: 'The condition on the line.', dont: <Pair2 label="relation" />, dontNote: 'A word that tells nothing.' },
    },
  ],
  related: [['/components/explain-mode', 'ExplainMode', 'Names what each part does.'], ['/components/device-card', 'DeviceCard', 'The device a relation acts on.'], ['/components/time-picker', 'TimePicker', 'The schedule on one end.']],
  references: [
    { title: 'WAI-ARIA 1.2 · aria-describedby', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-describedby', why: 'How each end of a relation is described.' },
    { title: 'WCAG 2.2 · 1.3.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html', why: 'Why a relation drawn on the screen is also a sentence.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why active is full ink and a filled dot, never a colour.' },
  ],
};
