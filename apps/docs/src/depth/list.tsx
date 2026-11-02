// Usage tab for List (component-depth.md U1–U14). List prints rows of devices or tracks on one plastic body.
import { Badge, Button, IconButton, List, Switch } from 'dial-react';
import type { Depth } from './types';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const lamp = <svg {...g}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" /></svg>;
const heat = <svg {...g}><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>;
const play = <svg {...g}><path d="M8 5l11 7-11 7z" /></svg>;
const W = { inlineSize: 360, maxInlineSize: '100%' };

export const LIST: Depth = {
  overview: (
    <>
      <p>List sets rows of things on one plastic body, such as the devices in a room, the tracks in a queue or the programmes a washer remembers. Each row starts with a glyph or a printed number, then the name, then the state in words under it, such as On · 40% or Ulm Quartet · 3:42. At the end of a row there is room for one part, a Switch, a round key, a Menu or a Badge.</p>
      <p>Rows are kept apart by an even gap. There are no rules between them, because a seam inside one unit splits it into pieces. The body paints itself, so a list dropped straight on the page is still a unit with its own light and shadow.</p>
      <p>A row can do one thing at most. It is a link to a page (with a printed chevron at the end), a button that does something in place, or a plain row whose one part at the end does the work. In a queue the whole list becomes one listbox. The arrow keys walk the rows and Enter chooses one, and the chosen row gets an ink mark at its start and a heavier name.</p>
      <p>Write the rows as <code>List.Item</code> inside <code>List</code>. A compound API was chosen over an array of items because rows hold real parts and real nodes, such as a Switch with its own name or a Thai name with a tone mark, and they read best where they are used.</p>
    </>
  ),
  whenToUse: ['To show the devices in a room, each with its state and one switch.', 'To show a queue or a playlist where one track is playing.', 'To list places to go next, such as the devices of a home, each opening its own page.', 'When every row has the same parts in the same order.'],
  whenNot: [
    { situation: 'One device with a display, a knob and several keys', to: '/components/device-card', label: 'DeviceCard' },
    { situation: 'A few cards that each hold their own content', to: '/components/card', label: 'Card' },
    { situation: 'Picking one value for a setting from a list', to: '/components/select', label: 'Select' },
    { situation: 'Actions for one device, shown only when asked', to: '/components/menu', label: 'Menu' },
  ],
  variants: { na: 'List has one look, rows printed on one body. Links, buttons, plain rows and queues are covered under Modifiers.' },
  anatomy: {
    render: (
      <List label="Kitchen" style={W}>
        <List.Item leading={lamp} label="Ceiling lamp" description="On · 40%" trailing={<Switch aria-label="Ceiling lamp" defaultChecked />} />
        <List.Item href="#heater" leading={heat} label="Floor heater" description="Heating to 21 °C" />
      </List>
    ),
    parts: [
      { part: 'Body', selector: '[data-component="List"]', what: 'One plastic body with the unit shadow and a capped corner.' },
      { part: 'Leading glyph', selector: '[data-component="List"] li:first-child [aria-hidden="true"]', what: 'A glyph or a printed number in a fixed column, in secondary ink.' },
      { part: 'Name', selector: '[data-component="List"] li:first-child span > span:first-child', what: 'The device or track in primary ink. It wraps instead of being cut.' },
      { part: 'State', selector: '[data-component="List"] li:first-child span > span + span', what: 'The state in words, one size down, in secondary ink.' },
      { part: 'End part', selector: '[data-component="List"] li:first-child [data-component="Switch"]', what: 'At most one part, here a Switch named after the row.' },
      { part: 'Chevron', selector: '[data-component="List"] a svg:last-child', what: 'Printed at the end of a row that opens another page.' },
    ],
  },
  sizes: { na: 'List has one size. Each row is at least 52px tall and grows with its words.' },
  emphasis: { na: 'A list is never the loud part of a unit. No row is orange; the orange key of the screen sits outside the list.' },
  placement: {
    rows: [['Straight on the page', 'The list paints its own body, so it stands as a unit on a phone screen.'], ['In a column of a room page', 'One list per room, under the room name as a heading.'], ['Beside a player', 'A queue next to the player that shows the playing track on its display.']],
    examples: [{ title: 'A room on a phone', render: <List label="Bedroom" style={W}><List.Item leading={lamp} label="Bedside lamp" description="Off" trailing={<Switch aria-label="Bedside lamp" />} /><List.Item leading={heat} label="Heater" description="On · 19 °C" trailing={<Switch aria-label="Heater" defaultChecked />} /></List> }],
  },
  combinations: {
    good: [['List + Switch', 'One switch per row turns the device on or off, named after the row.'], ['List + Badge', 'A badge at the end tells a problem with a lamp shape and a word.'], ['List + Menu', 'A round key at the end opens the rarer actions of the device.']],
    avoid: [{ title: 'two actions in one row', why: 'A row that opens a page and also holds a key gives a finger two targets in one line. Make the row a plain row with one Menu instead.', render: <List label="Avoid" style={W}><List.Item leading={lamp} label="Floor lamp" description="On" trailing={<><Button>Edit</Button><IconButton label="Play">{play}</IconButton></>} /></List> }],
  },
  content: {
    formula: <><p>Name the row after the thing, the way people say it at home, such as Kitchen lamp or Hall speaker. Put the state in words on the second line, value first, with a middle dot between facts, such as On · 40% or Cotton 40° · 38 min left. Never leave the state to a colour or to the switch alone.</p><p>Keep names short, but let long ones wrap. A cut name hides the one word that tells two lamps apart. Use the same order of facts in every row, so the eye can run down the column.</p></>,
    pair: {
      do: <List label="Do" style={W}><List.Item leading={lamp} label="Kitchen lamp" description="On · 40%" /></List>, doNote: 'The name a person says, then the state in words.',
      dont: <List label="Don't" style={W}><List.Item leading={lamp} label="Device 0x3F lamp (kitchen)" description="Status is currently set to on" /></List>, dontNote: 'An address as the name and a sentence where two facts would do.',
    },
    overflow: { text: 'A long name wraps onto a second line inside the row. The row grows and the part at the end keeps its place, so nothing is cut.', render: <div data-overflow-demo="" style={{ inlineSize: 280 }}><List label="Living room"><List.Item leading={lamp} label="โคมไฟห้องนั่งเล่นชั้นบนข้างหน้าต่างบานใหญ่" description="เปิด · 40%" trailing={<Switch aria-label="โคมไฟห้องนั่งเล่น" defaultChecked />} /></List></div> },
    rtl: { text: 'In right to left languages the glyph starts on the right, the part at the end moves to the left, and the chevron turns to point left.', render: <div dir="rtl"><List label="الغرف" style={W}><List.Item leading={lamp} label="مصباح المطبخ" description="مضاء · 40%" trailing={<Switch aria-label="مصباح المطبخ" defaultChecked />} /></List></div> },
    expansion: { text: 'German names can run 30% longer. The name column takes the free width and wraps, so the switch stays in its column.', render: <List label="Küche" style={W}><List.Item leading={lamp} label="Deckenleuchte über der Arbeitsplatte" description="Ein · 40 %" trailing={<Switch aria-label="Deckenleuchte" defaultChecked />} /></List> },
  },
  behaviours: {
    states: [
      ['Rest', 'Rows printed on the body, kept apart by a gap.', 'No rules and no fills.'],
      ['Hover', 'The chevron of a link row darkens one step.', 'The row does not rise or change colour.'],
      ['Pressed', 'A link or button row sinks into a small recess at once.', 'It comes back when it is released.'],
      ['Focus', 'The same dark 2px ring as every part, inside the row.', 'In a queue it sits on the row the arrows point to.'],
      ['Chosen', 'An ink mark at the start of the row and a medium name.', 'Only in a selectable list. Never orange.'],
      ['Disabled', 'The row fades to half and cannot be pressed or chosen.', 'Its words stay readable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to each link row, button row and end part in reading order. A queue is one stop.', 'native order'],
      ['Keyboard', 'Enter', 'Follows a link row or presses a button row.', 'a, button'],
      ['Keyboard', 'Up, Down, Home, End', 'In a queue, move the active row.', 'aria-activedescendant'],
      ['Keyboard', 'Enter or Space', 'In a queue, choose the active row.', 'aria-selected'],
      ['Pointer', 'Press a row', 'Follows it, presses it or chooses it. The whole row is the target.', 'link, button, option'],
      ['Screen reader', 'Read', 'A list with its count; in a queue, a listbox with the chosen row announced.', 'role list, role listbox'],
    ],
    loading: <p>List has no loading state of its own. While devices are found, show the rows you already know and say on the screen that more may come. A device that does not answer keeps its row, with the state in words, such as Not reachable since 09:12, and a critical badge.</p>,
    focus: <p>A list is never focused on page load. A queue takes focus as one stop and starts on the chosen row, or on the first row when none is chosen.</p>,
  },
  deepDive: { na: 'List has a single variant, so one look covers every use.' },
  modifiers: [
    {
      name: 'href',
      rules: <p>The whole row becomes a link with a printed chevron at the end. Use it when the row opens the page of the device. The end of the row may then hold printing only, such as a Badge, never a second control.</p>,
      pair: { do: <List label="Do" style={W}><List.Item href="#speaker" leading={lamp} label="Hall speaker" description="Not reachable" trailing={<Badge tone="critical">Offline</Badge>} /></List>, doNote: 'One link, and a badge that is printing.', dont: <List label="Don't" style={W}><List.Item leading={lamp} label="Hall speaker" description="Not reachable" trailing={<Button>Open</Button>} /></List>, dontNote: 'A small key to open the page, so the finger has to aim.' },
    },
    {
      name: 'selectable',
      rules: <p>The list becomes one listbox where one row is chosen, such as the playing track. Every row needs a value. Rows in a queue hold no controls of their own.</p>,
      pair: { do: <List label="Queue" selectable defaultValue="b" style={W}><List.Item value="a" index={1} label="Kiln song" description="3:42" /><List.Item value="b" index={2} label="Slow return" description="2:58" /></List>, doNote: 'The playing track has the ink mark and a heavier name.', dont: <List label="Queue" style={W}><List.Item index={1} label="Kiln song" description="3:42" /><List.Item index={2} label="Slow return · playing" description="2:58" /></List>, dontNote: 'The choice written into the name, with nothing to choose with.' },
    },
  ],
  related: [['/components/card', 'Card', 'A unit with its own content.'], ['/components/menu', 'Menu', 'The actions at the end of a row.'], ['/components/switch', 'Switch', 'The part at the end of a device row.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Listbox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/', why: 'The roles and keys a queue follows.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the whole row is the target.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
