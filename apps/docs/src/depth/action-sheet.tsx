// Usage tab for ActionSheet (component-depth.md U1–U14). ActionSheet offers a few actions for one object.
import { ActionSheet } from 'dial-react';
import type { Depth } from './types';

type It = { value: string; label: string; destructive?: boolean; disabled?: boolean };
const LAMP: It[] = [{ value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move to room' }, { value: 'remove', label: 'Remove', destructive: true }];
const Lid = ({ title = 'Kitchen lamp', detail = 'lamp 02 · Kitchen', items = LAMP, cancelLabel }: { title?: string; detail?: string; items?: It[]; cancelLabel?: string }) => (
  <div style={{ inlineSize: 'min(100%, 375px)' }}><ActionSheet modal={false} open title={title} detail={detail} items={items} cancelLabel={cancelLabel} /></div>
);

export const ACTION_SHEET: Depth = {
  overview: (
    <>
      <p>ActionSheet offers a short list of actions for one object, such as Rename, Move to room and Remove for the Kitchen lamp. On a phone it rises from the bottom edge over a scrim, with the object’s name at the top, the actions printed one under another, and Cancel as a separate plastic key at the bottom where the thumb rests.</p>
      <p>It is built on the browser’s own modal dialog, like Sheet and Dialog. Focus moves to the first action and stays inside, arrow keys move between the actions and Cancel, Escape closes it, and focus goes back to the key that opened it. The chosen action runs only after the sheet has closed and focus is back, so an action that opens a Dialog, such as Rename, starts from a calm page.</p>
      <p>On a screen wider than it is tall the same dialog stands by its trigger, the way Menu’s panel does. It opens under the key, or above it when there is more room there, and shifts along it so the screen edge never cuts it. There is no scrim and no Cancel key in that form, because the pointer is already there. Escape or a click anywhere else closes it.</p>
      <p>A destructive action, such as Remove, is printed last after a small gap, with the square critical lamp beside its word. The warning is told by shape, place and word together, never by red text alone, and nothing in the sheet is orange.</p>
    </>
  ),
  whenToUse: ['To offer three to six actions for one object on a phone, opened from its key.', 'To keep rare actions, such as Remove, off the card and one step away.', 'To ask which of a few things to do next after a long press.'],
  whenNot: [
    { situation: 'Changing a device’s settings, which act at once', to: '/components/sheet', label: 'Sheet' },
    { situation: 'Asking before an action that is hard to undo', to: '/components/dialog', label: 'Dialog' },
    { situation: 'A few actions on a wide screen only', to: '/components/menu', label: 'Menu' },
  ],
  variants: { na: 'ActionSheet has no variant prop. Placement says only whether it docks to the bottom or stands by its key.' },
  anatomy: {
    render: <Lid />,
    parts: [
      { part: 'Lid', selector: '[data-component="ActionSheet"]', what: 'A plastic body with the capped panel radius on top and square corners where it meets the bottom edge.' },
      { part: 'Name', selector: '[data-component="ActionSheet"] h3', what: 'The object the actions are for. It names the dialog for screen readers.' },
      { part: 'Detail', selector: '[data-component="ActionSheet"] [data-part="head"] p', what: 'One quiet line under the name, such as the model and the room.' },
      { part: 'Action', selector: '[data-component="ActionSheet"] [data-part="item"]', what: 'A full-width row at least 44px tall, a glyph and a verb.' },
      { part: 'Destructive action', selector: '[data-component="ActionSheet"] [data-destructive]', what: 'Printed last after a gap, with the square critical lamp beside its word.' },
      { part: 'Cancel', selector: '[data-component="ActionSheet"] [data-part="cancel"] button', what: 'A full-width 52px plastic key that closes the sheet and runs nothing.' },
    ],
  },
  sizes: { na: 'ActionSheet has one size. Docked it takes the full width of a phone up to the reading measure; by its key it is as wide as its longest action.' },
  emphasis: {
    text: <p>An action sheet holds no orange part. The actions are printing on the lid and Cancel is a plain plastic key, so the sheet never competes with the main control of the unit it came from. A destructive action is set apart by place and its lamp, never by a louder key.</p>,
    pair: {
      do: <Lid />, doNote: 'Remove last, with its lamp and its word.',
      dont: <Lid items={[{ value: 'remove', label: 'Remove', destructive: true }, { value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move to room' }]} />, dontNote: 'Remove first, right where the thumb lands.',
    },
  },
  placement: {
    rows: [
      ['Docked to the bottom edge on a phone', 'The lid rises over a scrim, takes the full width and ends with Cancel above the home indicator.'],
      ['By its key on a wide screen', 'placement auto stands it under or above the key, shifted to stay whole, with no scrim.'],
      ['In place on a page', 'modal false shows the docked lid in the flow, for a preview.'],
    ],
    examples: [{ title: 'Docked, shown in place', render: <Lid title="Hall speaker" detail="sound 01 · Hall" /> }],
  },
  combinations: {
    good: [['ActionSheet + Snackbar', 'After Remove, a snackbar says Lamp removed and offers Undo.'], ['ActionSheet + Dialog', 'Rename opens a Dialog with a field once the sheet has closed.'], ['DeviceCard + ActionSheet', 'The card’s round key opens the sheet for that device.']],
    avoid: [{ title: 'a sheet of one action', why: 'One action needs no list. Put the key on the card, or ask with a Dialog if it is hard to undo.', render: <Lid items={[{ value: 'remove', label: 'Remove', destructive: true }]} /> }],
  },
  content: {
    formula: <><p>The title is the object’s name as the person called it, such as <em>Kitchen lamp</em>. The detail line says which one it is, such as the model and the room. Each action starts with a verb, such as Rename, Move to room and Remove.</p><p>Order the actions by how often people need them and put destructive ones last. Keep Cancel as Cancel; it is the same word on every sheet.</p></>,
    pair: {
      do: <Lid />, doNote: 'Verbs first, the object named once in the title.',
      dont: <Lid title="Options" detail="" items={[{ value: 'a', label: 'Lamp name' }, { value: 'b', label: 'Room' }, { value: 'c', label: 'Delete lamp from home', destructive: true }]} />, dontNote: 'The title says nothing, and the rows are nouns.',
    },
    overflow: { text: 'A long action wraps onto a second line inside its row; a long name wraps in the header. A sheet taller than the screen scrolls inside itself.', render: <div data-overflow-demo=""><Lid title="Reading lamp by the window in the upstairs guest room" items={[{ value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move this lamp to a different room in the house' }, { value: 'remove', label: 'Remove', destructive: true }]} /></div> },
    rtl: { text: 'In right-to-left languages the glyph and the lamp move to the right of each word.', render: <div dir="rtl"><Lid title="مصباح المطبخ" detail="lamp 02" items={[{ value: 'rename', label: 'إعادة التسمية' }, { value: 'move', label: 'نقل إلى غرفة' }, { value: 'remove', label: 'إزالة', destructive: true }]} cancelLabel="إلغاء" /></div> },
    expansion: { text: 'German runs about 30% longer. Rows wrap before the lid grows wider than the reading measure.', render: <Lid title="Küchenlampe" items={[{ value: 'rename', label: 'Umbenennen' }, { value: 'move', label: 'In einen anderen Raum verschieben' }, { value: 'remove', label: 'Entfernen', destructive: true }]} cancelLabel="Abbrechen" /> },
  },
  behaviours: {
    states: [
      ['Closed', 'Nothing is drawn. The opener is a key on the card.', 'The dialog element is in the page but hidden.'],
      ['Open, docked', 'The lid slides up from the bottom over 245ms and the scrim fades in with it.', 'The page behind is inert.'],
      ['Open, by its key', 'The panel rises 8px into place and fades in, with no scrim.', 'The page behind is inert; a click away closes it.'],
      ['Focused action', 'The row sinks into the lid as a recess, like a Menu row.', 'The focus ring shows for the keyboard.'],
      ['Disabled action', 'The row keeps its place and fades to half.', 'aria-disabled, so it can still be found.'],
      ['Closing', 'The lid leaves over 120ms, about half the time it took to arrive.', 'Focus returns to the opener, then the action runs.'],
    ],
    interactions: [
      ['Keyboard', 'Arrow Down / Up', 'Moves between the actions and Cancel, wrapping at the ends.', 'roving focus'],
      ['Keyboard', 'Home / End', 'Goes to the first action or to Cancel.', 'roving focus'],
      ['Keyboard', 'Enter / Space', 'Runs the focused action, or Cancel.', 'native button'],
      ['Keyboard', 'Escape', 'Closes the sheet and runs nothing.', 'cancel event'],
      ['Pointer', 'Click the scrim or away', 'Closes the sheet and runs nothing.', 'light dismiss'],
      ['Screen reader', 'Open', 'Announced as a dialog named by the object.', 'aria-labelledby'],
    ],
    loading: <p>An action sheet never waits. If an action needs the device to answer, close the sheet first and show the result in a Snackbar or a Toast.</p>,
    focus: <p>On open, focus goes to the first action that can run. Tab and the arrow keys stay inside. On close focus goes back to the opener, and only then does the chosen action run.</p>,
  },
  deepDive: { na: 'ActionSheet has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'placement',
      rules: <p>Leave it on auto. Use bottom for a phone-only app whose keys sit low on the screen, and anchored for a wide tool where the sheet should behave like a menu.</p>,
      pair: { do: <Lid />, doNote: 'Docked on a phone, Cancel under the thumb.', dont: <Lid items={[...LAMP, { value: 'share', label: 'Share' }, { value: 'pin', label: 'Pin' }, { value: 'copy', label: 'Copy' }, { value: 'hide', label: 'Hide' }]} />, dontNote: 'Seven actions turn the lid into a page; move rare ones elsewhere.' },
    },
    {
      name: 'cancelLabel',
      rules: <p>Keep the default word, Cancel, in English. Pass the word in the product’s language, such as ยกเลิก in Thai.</p>,
      pair: { do: <Lid cancelLabel="Cancel" />, doNote: 'The same word on every sheet.', dont: <Lid cancelLabel="Never mind" />, dontNote: 'A new word for the same key every time.' },
    },
  ],
  related: [['/components/sheet', 'Sheet', 'Show a device’s controls instead of actions.'], ['/components/menu', 'Menu', 'The panel it becomes on a wide screen.'], ['/components/snackbar', 'Snackbar', 'Offer Undo after a destructive action.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Dialog (Modal) pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'Focus on open, the focus trap, Escape and focus return.' },
    { title: 'HTML Standard · The dialog element', url: 'https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element', why: 'showModal, the inert page and the cancel event.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};

