// Usage tab for Sheet (component-depth.md U1–U14). Sheet holds every control of one device.
import { Button, Display, Sheet, Slider, Switch } from 'dial-react';
import type { Depth } from './types';

type P = { title: string; model?: string; placement?: 'auto' | 'bottom' | 'end'; actions?: React.ReactNode; children?: React.ReactNode };
const Panel = ({ placement = 'bottom', ...p }: P) => (
  <div style={{ inlineSize: 'min(100%, 420px)' }}><Sheet modal={false} open placement={placement} {...p} /></div>
);
const lamp = (
  <>
    <Display value="60" unit="%" detail="Warm white" label="Living room lamp" />
    <Slider label="Brightness" max={100} step={10} defaultValue={60} />
    <Slider label="Warmth" min={0} max={10} defaultValue={3} />
    <Switch label="On at sunset" defaultChecked />
  </>
);

export const SHEET: Depth = {
  overview: (
    <>
      <p>Sheet holds every control of one device at once. A card on the home screen shows the lamp’s brightness and one key; the sheet opens over the room and shows the rest, such as warmth, the schedule and the timer. Changes act at once, the way a knob on a real lamp does, so there is no Save key.</p>
      <p>It is built on the browser’s own modal dialog, like Dialog. Focus moves into the sheet and stays there, the page behind goes still, Escape closes it and focus goes back to the key that opened it. Sheet differs from Dialog in what it holds. Dialog asks one question and waits for the answer. Sheet holds controls, so a click on the scrim closes it, it has a close key in its header, and on a phone it can be dragged down by its printed bar.</p>
      <p>Where it appears depends on the screen. On a screen taller than it is wide, such as a phone held upright, it rises from the bottom edge and takes the full width, so faders keep their length under the thumb. On a wide screen it stands as a unit of its own at the lower end, inset from the edges, so the room stays in view beside it.</p>
    </>
  ),
  whenToUse: ['To show every control of one device, opened from its card.', 'To change several settings of one device in a row, each taking effect at once.', 'To show a device’s schedule and timers next to its live reading.'],
  whenNot: [
    { situation: 'Asking before an action that is hard to undo', to: '/components/dialog', label: 'Dialog' },
    { situation: 'Saying that an action worked', to: '/components/toast', label: 'Toast' },
    { situation: 'The one or two controls a device needs most, always in view', to: '/components/device-card', label: 'DeviceCard' },
  ],
  variants: { na: 'Sheet has no variant prop. Every sheet is the same plastic body; placement only says which edge it comes from.' },
  anatomy: {
    render: <Panel title="Living room lamp" model="lamp 02">{lamp}</Panel>,
    parts: [
      { part: 'Body', selector: '[data-component="Sheet"]', what: 'A plastic body with the capped panel radius and square corners where it meets the bottom edge.' },
      { part: 'Bar', selector: '[data-component="Sheet"] [data-part="handle"]', what: 'A short ink bar with square ends, printed on a strip a thumb can hold. It shows only when the sheet is docked.' },
      { part: 'Name', selector: '[data-component="Sheet"] h3', what: 'The device name. It names the sheet for screen readers.' },
      { part: 'Close key', selector: '[data-component="Sheet"] [data-part="head"] button', what: 'A 44px round key that closes the sheet. It is the keyboard’s way out besides Escape.' },
      { part: 'Controls', selector: '[data-component="Sheet"] [data-part="content"]', what: 'The device’s display first, then its faders, switches and rows.' },
    ],
  },
  sizes: { na: 'Sheet has one size. It is as wide as the reading measure on a wide screen and the full width of a phone.' },
  emphasis: {
    text: <p>A sheet is one unit, so it holds at most one orange part. On a lamp that is usually nothing at all, because the faders and switches are plastic. When the device has one main control, such as Start on a washer, that control is the one orange key.</p>,
    pair: {
      do: <Panel title="Washer" model="wash 01" actions={<Button kind="primary">Start</Button>}><Display value="38" unit="min" detail="Cotton" label="Washer" /></Panel>,
      doNote: 'One orange key for the main control.',
      dont: <Panel title="Washer" model="wash 01" actions={<><Button kind="primary">Pause</Button><Button kind="primary">Start</Button></>}><Display value="38" unit="min" detail="Cotton" label="Washer" /></Panel>,
      dontNote: 'Two orange keys, so neither one reads as the main control.',
    },
  },
  placement: {
    rows: [
      ['Docked to the bottom edge on a phone', 'The sheet rises from the bottom, takes the full width and leaves the top of the room showing above the scrim.'],
      ['Standing at the lower end on a wide screen', 'The sheet is a unit of its own, inset from the edges, so the room stays in view beside it.'],
      ['In place on a page', 'modal false shows the sheet in the flow of a settings page, with no scrim.'],
    ],
    examples: [{ title: 'Docked, shown in place', render: <Panel title="Bedroom heater" model="heat 04"><Display value="21.5" unit="°C" detail="Heating to 22.0" label="Bedroom heater" /><Slider label="Target" min={16} max={26} step={0.5} defaultValue={22} /></Panel> }],
  },
  combinations: {
    good: [['Sheet + Display + Slider', 'The live reading at the top, then the faders that change it.'], ['Sheet + Switch', 'A setting that is on or off, such as On at sunset, acting at once.'], ['DeviceCard + Sheet', 'The card shows the main control, and a key on it opens the sheet with the rest.']],
    avoid: [{ title: 'a sheet with a Save key', why: 'Controls in a sheet act at once, like the knobs on the device. A Save key makes people wonder whether the faders they moved count yet.', render: <Panel title="Desk lamp" actions={<><Button>Cancel</Button><Button kind="primary">Save</Button></>}><Slider label="Brightness" max={100} step={10} defaultValue={40} /></Panel> }],
  },
  content: {
    formula: <><p>The title is the name of the device as the person called it, such as <em>Living room lamp</em>. The model name, in lowercase beside it, says which product it is, such as <em>lamp 02</em>. Labels on the controls are nouns, such as Brightness and Warmth.</p><p>Put the display first, so the sheet opens on what the device is doing now. Order the controls by how often people reach for them, and keep rare actions, such as Remove device, in the keys at the bottom.</p></>,
    pair: {
      do: <Panel title="Living room lamp" model="lamp 02"><Slider label="Brightness" max={100} step={10} defaultValue={60} /></Panel>, doNote: 'The device by the name the person gave it.',
      dont: <Panel title="Device settings"><Slider label="Value" defaultValue={60} /></Panel>, dontNote: 'Neither the title nor the label says what it controls.',
    },
    overflow: { text: 'A long device name wraps onto more lines beside the close key. A sheet with many controls scrolls inside itself once it reaches the screen edge.', render: <div data-overflow-demo=""><Panel title="Reading lamp by the window in the upstairs guest room" model="lamp 11"><Slider label="Brightness" max={100} step={10} defaultValue={50} /></Panel></div> },
    rtl: { text: 'In right-to-left languages the close key moves to the left, and on a wide screen the sheet stands at the lower left.', render: <div dir="rtl"><Panel title="مصباح غرفة المعيشة" model="lamp 02"><Slider label="السطوع" max={100} step={10} defaultValue={60} /></Panel></div> },
    expansion: { text: 'German runs about 30% longer. The name wraps before the close key shrinks.', render: <Panel title="Wohnzimmerlampe" model="lamp 02"><Slider label="Helligkeit" max={100} step={10} defaultValue={60} /><Switch label="Bei Sonnenuntergang an" defaultChecked /></Panel> },
  },
  behaviours: {
    states: [
      ['Closed', 'Nothing is drawn. The opener is a normal key or card on the page.', 'The dialog element is in the page but hidden.'],
      ['Open', 'The sheet slides in from its edge over 245ms on a curve that slows as it lands, and the scrim fades in with it.', 'The page behind is inert.'],
      ['Dragging', 'On a docked sheet, the body follows the finger down with no easing.', 'Let go past a quarter of its height and it closes; before that it slides back.'],
      ['Closing', 'The sheet slides out over 120ms on a curve that speeds up, about half the time it took to arrive.', 'Focus returns to the opener.'],
      ['Reduced motion', 'The sheet appears and goes at once. A drag still follows the finger.', 'No slide and no fade.'],
    ],
    interactions: [
      ['Keyboard', 'Tab / Shift+Tab', 'Moves between the close key and the controls inside the sheet only.', 'native dialog, showModal'],
      ['Keyboard', 'Escape', 'Closes the sheet.', 'cancel event'],
      ['Pointer', 'Click the scrim', 'Closes the sheet. The controls have already acted.', 'light dismiss'],
      ['Touch', 'Drag the bar down', 'Closes the sheet past a quarter of its height.', 'pointer capture on the bar'],
      ['Screen reader', 'Open', 'Announced as a dialog named by the device.', 'aria-labelledby'],
    ],
    loading: <p>When the device has not reported its state yet, open the sheet at once and show the display with two dashes. Disable the controls until the reading arrives, then let the display change to the value.</p>,
    focus: <p>On open, focus goes to the sheet itself, so its name is read first and an arrow key never moves a fader by accident. Tab then reaches the close key and each control in order. On close focus goes back to the opener.</p>,
  },
  deepDive: { na: 'Sheet has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'placement',
      rules: <p>Leave it on auto. Use bottom when the sheet always opens from a bar at the bottom of the screen, and end in a wide tool where the room must stay in view.</p>,
      pair: { do: <Panel title="Desk lamp" placement="bottom"><Slider label="Brightness" max={100} step={10} defaultValue={40} /></Panel>, doNote: 'Docked where the thumb is.', dont: <Panel title="Desk lamp" placement="end"><Slider label="Brightness" max={100} step={10} defaultValue={40} /></Panel>, dontNote: 'Forced to the end on a phone, it leaves the thumb a long reach.' },
    },
    {
      name: 'actions',
      rules: <p>Keep keys at the bottom for actions that are not controls, such as Rename or Remove device. Leave it out for a sheet of controls alone.</p>,
      pair: { do: <Panel title="Hall light" actions={<Button>Remove device</Button>}><Slider label="Brightness" max={100} step={10} defaultValue={80} /></Panel>, doNote: 'A rare action, set apart at the bottom.', dont: <Panel title="Hall light" actions={<><Button>Apply</Button><Button>Done</Button></>}><Slider label="Brightness" max={100} step={10} defaultValue={80} /></Panel>, dontNote: 'Apply and Done suggest the fader has not acted yet.' },
    },
  ],
  related: [['/components/dialog', 'Dialog', 'Ask one question before an action instead of showing controls.'], ['/components/device-card', 'DeviceCard', 'The card that opens the sheet.'], ['/components/slider', 'Slider', 'The faders inside the sheet.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Dialog (Modal) pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'Focus on open, the focus trap, Escape and focus return.' },
    { title: 'HTML Standard · The dialog element', url: 'https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element', why: 'showModal, the inert page and the cancel event the component relies on.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
