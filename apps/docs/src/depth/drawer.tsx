// Usage tab for Drawer (component-depth.md U1–U14). Drawer lists what a device or a home keeps, in a side panel.
import { Button, Drawer, Icon, List, Slider, Switch } from 'dial-react';
import type { Depth } from './types';

type P = { title: string; side?: 'end' | 'start'; actions?: React.ReactNode; children?: React.ReactNode };
const Panel = (p: P) => (
  <div style={{ inlineSize: 'min(100%, var(--ds-layout-sidebar))' }}><Drawer modal={false} open {...p} /></div>
);
const rooms = (
  <List label="Rooms">
    <List.Item href="#living" leading={<Icon name="lamp" />} label="Living room" description="3 devices" />
    <List.Item href="#kitchen" leading={<Icon name="fan" />} label="Kitchen" description="5 devices" />
    <List.Item href="#bedroom" leading={<Icon name="heat" />} label="Bedroom" description="2 devices" />
  </List>
);

export const DRAWER: Depth = {
  overview: (
    <>
      <p>Drawer is a side panel that lists what the home keeps, such as its rooms, a washer’s programs or the filters for a device list. A key on the screen opens it from the inline end, the list scrolls inside it, and one key at the bottom adds or applies. It is a unit of its own, inset from the window on every side, the way a flap on an appliance opens without becoming part of the wall.</p>
      <p>It is built on the browser’s own modal dialog, like Dialog and Sheet. Focus moves into the drawer and stays there, the page behind goes still, Escape and a click on the scrim close it, and focus goes back to the key that opened it. The drawer stays on screen while it slides out, so closing moves as well as opening.</p>
      <p>Drawer differs from Sheet in what it holds. Sheet holds the controls of one device and acts at once. Drawer holds a list to pick from, so it takes the full height, scrolls the list between a fixed title and fixed keys, and leaves the choice to a row or to its one key.</p>
    </>
  ),
  whenToUse: ['To list rooms, programs or devices to pick from, opened from a key on the screen.', 'To hold filters for a long list, with one key at the bottom that applies them.', 'To keep a navigation list out of the way on a narrow screen.'],
  whenNot: [
    { situation: 'Every control of one device, acting at once', to: '/components/sheet', label: 'Sheet' },
    { situation: 'Asking before an action that is hard to undo', to: '/components/dialog', label: 'Dialog' },
    { situation: 'A short list of actions next to a key', to: '/components/menu', label: 'Menu' },
  ],
  variants: { na: 'Drawer has no variant prop. Every drawer is the same plastic body; side only says which edge it comes from.' },
  anatomy: {
    render: <Panel title="Rooms" actions={<Button>Add room</Button>}>{rooms}</Panel>,
    parts: [
      { part: 'Body', selector: '[data-component="Drawer"]', what: 'A plastic body with the capped panel radius, inset from the window on all four sides.' },
      { part: 'Title', selector: '[data-component="Drawer"] h3', what: 'What the drawer lists. It names the drawer for screen readers.' },
      { part: 'Close key', selector: '[data-component="Drawer"] [data-part="head"] button', what: 'A 44px round key that closes the drawer. It is the touch way out besides the scrim.' },
      { part: 'List', selector: '[data-component="Drawer"] [data-part="content"]', what: 'The rows to pick from. They take the height left and scroll inside the drawer.' },
      { part: 'Keys', selector: '[data-component="Drawer"] [data-part="actions"]', what: 'Optional keys at the bottom, under a hairline.' },
    ],
  },
  sizes: { na: 'Drawer has one size. It is as wide as the sidebar token, and it fills the window height less the inset.' },
  emphasis: {
    text: <p>A drawer is one unit, so it holds at most one orange part. A list of rooms usually needs none. A filter drawer has one main key, the one that applies, and that key is the orange one.</p>,
    pair: {
      do: <Panel title="Filter" actions={<Button kind="primary">Show 4 devices</Button>}><List label="Filter"><List.Item label="Lamps" trailing={<Switch aria-label="Lamps" defaultChecked />} /></List></Panel>,
      doNote: 'One orange key, the one that applies the filter.',
      dont: <Panel title="Filter" actions={<><Button kind="primary">Reset</Button><Button kind="primary">Show 4 devices</Button></>}><List label="Filter"><List.Item label="Lamps" trailing={<Switch aria-label="Lamps" defaultChecked />} /></List></Panel>,
      dontNote: 'Two orange keys, so neither one reads as the main key.',
    },
  },
  placement: {
    rows: [
      ['At the inline end', 'The default. The drawer slides in from the right in left-to-right text, where the thumb of a held phone rests.'],
      ['At the inline start', 'side start. Use it when the key that opens the drawer sits at the start, such as a menu key in the top corner.'],
      ['In place on a page', 'modal false shows the drawer in the flow of a settings page, with no scrim.'],
    ],
    examples: [{ title: 'At the inline end, shown in place', render: <Panel title="Rooms" actions={<Button>Add room</Button>}>{rooms}</Panel> }, { title: 'At the inline start, shown in place', render: <Panel title="Rooms" side="start">{rooms}</Panel> }],
  },
  combinations: {
    good: [['Drawer + List', 'Rows that open a room, a program or a device page.'], ['Drawer + Switch', 'A filter with on or off rows and one key that applies it.'], ['Button + Drawer', 'The key that opens the drawer and takes focus back when it closes.']],
    avoid: [{ title: 'a drawer full of sliders', why: 'Faders that act at once belong in a Sheet, next to the display that shows their result. A drawer hides the room they change behind a scrim.', render: <Panel title="Desk lamp"><Slider label="Brightness" max={100} step={10} defaultValue={40} /></Panel> }],
  },
  content: {
    formula: <><p>The title is a noun for what the list holds, such as <em>Rooms</em> or <em>Filter</em>. Rows are names the person gave, with a short count or state in the description. The key at the bottom is a verb and a noun, such as <em>Add room</em>.</p></>,
    pair: {
      do: <Panel title="Rooms" actions={<Button>Add room</Button>}>{rooms}</Panel>, doNote: 'A noun for the title, a verb and a noun for the key.',
      dont: <Panel title="Menu" actions={<Button>OK</Button>}>{rooms}</Panel>, dontNote: 'Neither the title nor the key says what the drawer is for.',
    },
    overflow: { text: 'A long room name wraps onto more lines beside the close key. A long list scrolls inside the drawer and the title and keys stay put.', render: <div data-overflow-demo=""><Panel title="Rooms in the house by the lake, upstairs and downstairs"><List label="Rooms"><List.Item href="#guest" label="Guest room in the upstairs corner by the window" description="2 devices" /></List></Panel></div> },
    rtl: { text: 'In right-to-left languages the drawer slides in from the left and the close key moves to the left of the title.', render: <div dir="rtl"><Panel title="الغرف"><List label="الغرف"><List.Item href="#living" label="غرفة المعيشة" description="3 أجهزة" /></List></Panel></div> },
    expansion: { text: 'German runs about 30% longer. The title wraps before the close key shrinks.', render: <Panel title="Wohnräume" actions={<Button>Raum hinzufügen</Button>}><List label="Wohnräume"><List.Item href="#wohnzimmer" label="Wohnzimmer" description="3 Geräte" /></List></Panel> },
  },
  behaviours: {
    states: [
      ['Closed', 'Nothing is drawn. The opener is a normal key on the page.', 'The dialog is not in the page.'],
      ['Open', 'The drawer slides in from its edge over 245ms on a curve that slows as it lands, and the scrim fades in with it.', 'The page behind is inert.'],
      ['Closing', 'The drawer slides out over 120ms on a curve that speeds up, about half the time it took to arrive.', 'It stays in the page until it has left, and no key reaches it.'],
      ['Reduced motion', 'The drawer fades in and out and does not travel.', 'The fade runs on the short hover duration.'],
    ],
    interactions: [
      ['Keyboard', 'Tab / Shift+Tab', 'Moves between the close key, the rows and the keys inside the drawer only.', 'native dialog, showModal'],
      ['Keyboard', 'Escape', 'Closes the drawer.', 'cancel event'],
      ['Pointer', 'Click the scrim', 'Closes the drawer.', 'light dismiss'],
      ['Pointer', 'Press the close key', 'Closes the drawer.', 'IconButton'],
      ['Screen reader', 'Open', 'Announced as a dialog named by the title.', 'aria-labelledby'],
    ],
    loading: <p>When the list has not arrived yet, open the drawer at once and show the title with a Skeleton in place of the rows. Swap the rows in when they arrive. The drawer keeps its height, so nothing moves.</p>,
    focus: <p>On open, focus goes to the drawer itself, so its name is read first and an arrow key never lands on a row by accident. Tab then reaches the close key, each row and each key in order. On close, once the drawer has left, focus goes back to the opener.</p>,
  },
  deepDive: { na: 'Drawer has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'side',
      rules: <p>Leave it on end. Use start only when the key that opens the drawer sits at the start of the screen, so the drawer comes out of the side the hand just touched.</p>,
      pair: { do: <Panel title="Rooms" side="end">{rooms}</Panel>, doNote: 'The default, where the thumb rests.', dont: <Panel title="Rooms" side="start">{rooms}</Panel>, dontNote: 'At the start when its key is at the end, the drawer leaves the thumb a long reach.' },
    },
    {
      name: 'actions',
      rules: <p>Keep keys at the bottom for what the list needs, such as Add room or Show 4 devices. Leave it out when picking a row is the whole job.</p>,
      pair: { do: <Panel title="Rooms" actions={<Button>Add room</Button>}>{rooms}</Panel>, doNote: 'One key that adds to the list.', dont: <Panel title="Rooms" actions={<><Button>Cancel</Button><Button>Done</Button></>}>{rooms}</Panel>, dontNote: 'Cancel and Done suggest a pick is pending, but a row acts when pressed.' },
    },
  ],
  related: [['/components/sheet', 'Sheet', 'Show every control of one device instead of a list.'], ['/components/dialog', 'Dialog', 'Ask one question before an action.'], ['/components/list', 'List', 'The rows inside the drawer.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Dialog (Modal) pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'Focus on open, the focus trap, Escape and focus return.' },
    { title: 'HTML Standard · The dialog element', url: 'https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element', why: 'showModal, the inert page and the cancel event the component relies on.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
