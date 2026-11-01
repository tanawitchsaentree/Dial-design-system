// Usage tab for Tabs (component-depth.md U1–U14). Section names printed on the case, one index mark under the chosen one.
import { Stack, Tabs } from 'dial-react';
import type { Depth } from './types';

const p = (t: string) => <p className="flush">{t}</p>;
const ROOMS = [
  { value: 'living', label: 'Living room', content: p('Heater 21.5 °C · Lamp 60%') },
  { value: 'kitchen', label: 'Kitchen', content: p('Oven off · Hood on 2') },
  { value: 'bedroom', label: 'Bedroom', content: p('Heater 18.0 °C · Lamp off') },
];

export const TABS: Depth = {
  overview: (
    <>
      <p>Tabs move between sections of one screen, such as the rooms of a home. The names are printed in a row, like the words on the case of an appliance. The chosen name is set in medium weight with one short ink mark under it, and the screen below shows that section.</p>
      <p>Tabs are printing on the case. They have no height, no shadow and no travel, because choosing a room does not change any device. That is the difference from SegmentedControl, whose keys latch and change a mode. The mark appears at once under the new name. It does not slide.</p>
      <p>Every panel is rendered on the page from the start, and only the chosen one is shown. Switching is instant, and what someone typed or set in a panel is still there when they come back to it. Each name is a native button with role tab, and each panel is linked to its name, so a screen reader announces which section it is in.</p>
      <p>Tabs can be controlled with value and onValueChange, or keep their own choice with defaultValue. When nothing is given, the first section is shown. Keep the chosen section in the address of the screen if people return to it often, so a reload opens the same room.</p>
    </>
  ),
  whenToUse: ['Moving between rooms, devices or areas on one screen.', 'Two to six sections of the same kind, each with its own content.', 'Content that people compare by switching back and forth.', 'Grouping the settings of one device into a few named parts, such as Program, Schedule and Sound.'],
  whenNot: [
    { situation: 'Setting a mode on a device', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Steps that must be done in order', to: '/components/button', label: 'Button' },
    { situation: 'Turning one thing on or off', to: '/components/switch', label: 'Switch' },
    { situation: 'Picking one value from a long list', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'Tabs have one look. Automatic and manual activation change only how the keyboard works, so they are described under Modifiers.' },
  anatomy: {
    render: <Tabs label="Rooms" items={ROOMS} />,
    parts: [
      { part: 'Row of names', selector: '[data-component="Tabs"] [role="tablist"]', what: 'The section names in one row, a small gap apart, with no rule across them.' },
      { part: 'Name', selector: '[data-component="Tabs"] [role="tab"]', what: 'A printed name, 44px tall as a target. Medium weight when chosen.' },
      { part: 'Index mark', selector: '[data-component="Tabs"] [role="tab"][aria-selected="true"] > span:last-child', what: 'A 24px by 4px ink mark with round ends, under the chosen name only.' },
      { part: 'Panel', selector: '[data-component="Tabs"] [role="tabpanel"]:not([hidden])', what: 'The chosen section’s content. It can take focus.' },
    ],
  },
  sizes: { na: 'Tabs have one size, with label-size names in a 44px row.' },
  emphasis: {
    text: <><p>Tabs are quiet. They print no orange and have no height, so the units in the panel stay the loud parts of the screen. Use one row of tabs per screen.</p><p>The chosen name is told apart three ways at once, by weight, by darker ink and by the mark under it. None of the three relies on colour, so it still reads in forced colours and for people who cannot tell grey steps apart.</p></>,
    pair: {
      do: <Tabs label="Rooms" items={ROOMS} />,
      doNote: 'One row of rooms, then the room.',
      dont: <Stack gap="sm"><Tabs label="Floors" items={[{ value: 'g', label: 'Ground floor', content: <Tabs label="Rooms" items={ROOMS} /> }, { value: 'u', label: 'Upstairs', content: p('Upstairs') }]} /></Stack>,
      dontNote: 'Tabs inside tabs. People lose track of where they are.',
    },
  },
  placement: {
    rows: [['At the top of a screen, under its heading', 'Sections of the whole screen, such as rooms.'], ['At the top of a sheet', 'Sections of one device’s settings, such as Program and Schedule.'], ['Aligned to the start of the column', 'Always. The first name lines up with the heading above it, and the row never stretches to fill the width.']],
    examples: [{ title: 'Rooms on the home screen', render: <Tabs label="Rooms" items={ROOMS} defaultValue="kitchen" /> }],
  },
  combinations: {
    good: [['Tabs + units in each panel', 'Each room shows its own device units.'], ['Tabs + SegmentedControl inside a panel', 'The tab picks the room; the keys set a mode on a device in it.'], ['Heading + Tabs', 'The heading names the screen and the tabs name its parts, so the two never repeat each other.']],
    avoid: [{ title: 'tabs used to set a mode', why: 'Printing that changes the device hides the change. Use SegmentedControl so the choice is a key that latches.', render: <Tabs label="Mode" items={[{ value: 'h', label: 'Heat', content: p('Heating') }, { value: 'e', label: 'Eco', content: p('Saving') }]} /> }],
  },
  content: {
    formula: <><p>Name the section with a noun, such as <em>Kitchen</em>, <em>Bedroom</em> or <em>Schedule</em>. One or two words, sentence case, no counts or icons in the name.</p><p>Use the names people already use for the place or the part. If the home calls a room Den, the tab says Den. Keep the order stable, because people find a tab by where it was last time. Put the section people open most first, since it is the one shown when the screen opens.</p></>,
    pair: {
      do: <Tabs label="Rooms" items={ROOMS} />, doNote: 'Short nouns for places.',
      dont: <Tabs label="Rooms" items={[{ value: 'a', label: 'See the living room', content: p('…') }, { value: 'b', label: 'Go to kitchen', content: p('…') }]} />, dontNote: 'Verbs make the names read as actions.',
    },
    overflow: { text: 'When the names do not fit, the row wraps onto a second line. The chosen name keeps its mark and no name shifts.', render: <div data-overflow-demo="" style={{ inlineSize: 260 }}><Tabs label="Rooms" items={['Living room', 'Kitchen', 'Bedroom', 'Bathroom', 'Study'].map((n) => ({ value: n, label: n, content: p(n) }))} /></div> },
    rtl: { text: 'In right-to-left languages the first name sits on the right, and the arrow keys follow the reading order.', render: <div dir="rtl"><Tabs label="الغرف" items={[{ value: 'l', label: 'غرفة المعيشة', content: p('٢١٫٥ °C') }, { value: 'k', label: 'المطبخ', content: p('—') }]} /></div> },
    expansion: { text: 'German names can run 30% longer. The row grows sideways and wraps when it must.', render: <Tabs label="Räume" items={[{ value: 'w', label: 'Wohnzimmer', content: p('21,5 °C') }, { value: 'k', label: 'Küche', content: p('—') }, { value: 's', label: 'Schlafzimmer', content: p('18,0 °C') }]} /> },
  },
  behaviours: {
    states: [
      ['Not chosen', 'Name in regular weight, secondary ink, no mark.', 'The name is still a 44px target.'],
      ['Chosen', 'Name in medium weight, primary ink, ink mark under it.', 'The mark appears at once; it never slides.'],
      ['Forced colours', 'The mark is drawn in the system button text colour.', 'The weight and the mark still tell the chosen name apart.'],
      ['Hover', 'The name darkens one step.', 'Nothing rises.'],
      ['Focus', 'A dark 2px ring around the name, or around the panel.', 'The row is one tab stop.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the chosen name, then into the panel.', 'roving tabindex'],
      ['Keyboard', 'Left / Right', 'Move to the next or previous name and show its section. The ends wrap.', 'role tab'],
      ['Keyboard', 'Home / End', 'Show the first or the last section.', 'role tab'],
      ['Keyboard', 'Enter / Space', 'With activation="manual", show the focused section.', 'native button'],
      ['Pointer', 'Press a name', 'Shows its section.', 'native button'],
      ['Screen reader', 'Read', 'Announced as a tab list with its label, each name as a tab, selected or not, and the panel by its tab’s name.', 'role tablist'],
    ],
    loading: <p>Tabs have no loading state. A panel that loads shows its own progress inside it, with Progress or a line on the unit’s display, and the row of names stays usable while it loads. If a panel is slow to show, use activation="manual", so moving through the names with the arrow keys does not start a load for every room on the way.</p>,
    focus: <p>Tabs are never focused on page load. Tab lands on the chosen name, and the next Tab goes into its panel.</p>,
  },
  deepDive: { na: 'Tabs have one kind, covered above.' },
  modifiers: [
    {
      name: 'activation',
      rules: <p>The default is automatic. Arrow keys show each section as they reach it, because every panel is already on the page and shows at once. Use manual when a panel is slow to show, such as a camera feed, so arrows only move focus and Enter or Space opens it.</p>,
      pair: {
        do: <Tabs label="Cameras" activation="manual" items={[{ value: 'h', label: 'Hall', content: p('Camera feed · Hall') }, { value: 'g', label: 'Garden', content: p('Camera feed · Garden') }]} />,
        doNote: 'Manual for slow camera feeds.',
        dont: <Tabs label="Rooms" activation="manual" items={ROOMS} />,
        dontNote: 'Manual for panels that show at once only adds a key press.',
      },
    },
  ],
  related: [['/components/segmented-control', 'SegmentedControl', 'Set a mode on a device.'], ['/components/heading', 'Heading', 'Name the screen above the tabs.'], ['/components/switch', 'Switch', 'One setting, on or off.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Tabs pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/', why: 'Roles, keys and the choice between automatic and manual activation.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the chosen name is told by weight and a mark.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every name is a 44px target.' },
  ],
};
