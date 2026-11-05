// Usage tab for Menu (component-depth.md U1–U14). Menu is a key that opens Select's plastic panel of actions.
import { Button, Icon, List, Menu, Stack, Switch } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const lamp = <Icon name="lamp" />;
const DEVICE = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];
const SORT = [{ value: 'room', label: 'By room' }, { value: 'name', label: 'By name' }, { value: 'recent', label: 'Recently used first' }];

export const MENU: Depth = {
  overview: (
    <>
      <p>Menu keeps the rarer actions of a device out of sight until someone asks for them. A device row shows its name, its state and its switch. Rename, Move to room and Remove are still needed, but only now and then, so they wait behind one round key with three dots at the end of the row.</p>
      <p>Pressing the key opens the same plastic panel that Select opens, with one short shadow and the same corner. Each action is a row of printed words, at least 44px tall. The row under the pointer or the keyboard becomes a small recess, so you can see where you are without a coloured bar. An action that removes something for good sits last, after a gap. It carries the critical lamp, a filled square, before its word. The danger is told by a shape and a word, never by red or orange alone.</p>
      <p>The panel is never cut. It is placed on the page body, outside any frame that clips its content. It opens under the key, or above it when there is more room above, and it slides along the key to stay on the screen. It is at least as wide as the key and the menu minimum, and it grows to its longest action, so every word shows in full.</p>
      <p>Menu follows the WAI-ARIA menu button pattern. The key is a button with aria-haspopup set to menu. When the menu opens, focus moves to the first action. The arrows, Home, End and letters move between actions, Enter and Space run one, and Escape closes the menu and puts focus back on the key.</p>
    </>
  ),
  whenToUse: ['To offer the rarer actions of one device, such as Rename, Move to room and Remove.', 'When a row or a unit has room for one small key but needs three to six actions.', 'For actions that act at once, without a value to pick.', 'For a sort or view choice that people change now and then, with a word key that names it.'],
  whenNot: [
    { situation: 'Picking a value for a setting, such as a programme', to: '/components/select', label: 'Select' },
    { situation: 'The one action a unit is for, such as Start', to: '/components/button', label: 'Button' },
    { situation: 'Two to five modes that should stay visible', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Asking to confirm a removal with more words', to: '/components/dialog', label: 'Dialog' },
    { situation: 'Turning a device on or off', to: '/components/switch', label: 'Switch' },
  ],
  variants: { na: 'Menu has one panel. The key in front of it is round or a word key, covered under Modifiers as trigger.' },
  anatomy: {
    render: <Stack direction="row" align="center" gap="lg"><p className="flush">Kitchen lamp</p><Menu label="More for Kitchen lamp" items={DEVICE} /></Stack>,
    parts: [
      { part: 'Key', selector: '[data-component="Menu"] [aria-haspopup="menu"]', what: 'A 44px round key with three printed dots, or a word key with a chevron.' },
      { part: 'Panel', selector: '[role="menu"]', what: 'The same plastic panel as Select, on the page body. Hidden until the key is pressed.' },
      { part: 'Action', selector: '[role="menu"] [role="menuitem"]', what: 'A row of printed words, at least 44px tall, as wide as the longest action.' },
      { part: 'Critical lamp', selector: '[role="menu"] [data-destructive] svg', what: 'A filled square before the word of an action that removes something.' },
    ],
  },
  sizes: { na: 'Menu has one size. The round key is 44px and every action row is at least 44px tall.' },
  emphasis: { text: <p>A menu key is a quiet key. It is never orange, because the orange key of a unit is the one thing the unit is for, and a menu holds the things it is rarely for. A unit may hold one menu key. More than one makes a person guess which key holds which action.</p>, pair: { do: <Unit><Stack direction="row" align="center" gap="lg"><Button kind="primary">Start wash</Button><Menu label="More for Washer" items={DEVICE} /></Stack></Unit>, doNote: 'One orange key for the main action, one quiet key for the rest.', dont: <Unit><Stack direction="row" align="center" gap="lg"><Menu label="Programme actions" items={DEVICE} /><Menu label="Device actions" items={DEVICE} /><Menu label="Room actions" items={DEVICE} /></Stack></Unit>, dontNote: 'Three menu keys in one unit, each hiding a guess.' } },
  placement: {
    rows: [['At the end of a device row', 'The round key sits after the switch or the state, on the row’s inset line.'], ['In the corner of a unit', 'Top right, beside the unit’s name, for the unit’s own actions.'], ['Above a list', 'A word key such as Sort, at the start of the list’s heading row.']],
    examples: [{ title: 'At the end of a device row', render: <List label="Kitchen" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}><List.Item leading={lamp} label="Ceiling lamp" description="On · 40%" trailing={<Menu label="More for Ceiling lamp" items={DEVICE} />} /></List> }],
  },
  combinations: {
    good: [['Menu + List', 'One round key at the end of each device row holds that device’s rarer actions.'], ['Menu + Dialog', 'Remove in the menu opens a dialog that names what will be lost before it is gone.'], ['Menu + Toast', 'After Move to room, a toast says where the device went and offers to undo it.']],
    avoid: [{ title: 'a menu with one action', why: 'One action behind a press hides it for nothing. Show it as a key of its own.', render: <Unit><Stack direction="row" align="center" gap="lg"><p className="flush">Hall speaker</p><Menu label="More for Hall speaker" items={[{ value: 'rename', label: 'Rename' }]} /></Stack></Unit> }],
  },
  content: {
    formula: <><p>Start each action with a verb, in sentence case, such as Rename, Move to room or Add a schedule. Two or three words are enough. Leave out the name of the device, because the key already carries it in its name, More for Kitchen lamp. Put the actions in the order people use them, and the destructive ones last.</p><p>Name a destructive action after what it does, such as Remove from home or Delete schedule. Never write a vague verb such as Clear or Reset when something is lost for good. Do not add shortcut hints, counts or help text to a row. If an action needs more words, it needs a dialog.</p><p>Name the key after the thing it belongs to. A round key is read only by its name, so More for Kitchen lamp tells a screen reader user which row it is in, where a bare More does not.</p></>,
    pair: {
      do: <Menu label="More for Kitchen lamp" items={DEVICE} />, doNote: 'Verbs first, short, and the removal last with its lamp.',
      dont: <Menu label="Options" items={[{ value: 'a', label: 'Click here to rename this device' }, { value: 'b', label: 'Device removal' }, { value: 'c', label: 'Room' }]} />, dontNote: 'A vague key name, an instruction, a noun and no mark on the removal.',
    },
    overflow: { text: 'The panel grows to its longest action, so a long action shows in full on one line. When the screen is narrower than that line, the words wrap inside the panel instead of being cut.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><Menu label="More for the reading lamp" items={[{ value: 'move', label: 'Move to the living room upstairs' }, { value: 'remove', label: 'Remove', destructive: true }]} align="start" /></div> },
    rtl: { text: 'In right to left languages the words start on the right, the lamp sits before the word on the right, and the panel lines up with the key’s end edge on the left.', render: <div dir="rtl"><Menu label="خيارات المصباح" items={[{ value: 'rename', label: 'إعادة تسمية' }, { value: 'remove', label: 'إزالة', destructive: true }]} /></div> },
    expansion: { text: 'German actions can run 30% longer. The panel grows to the longest one, so nothing is cut.', render: <Menu label="Mehr für Deckenleuchte" items={[{ value: 'rename', label: 'Umbenennen' }, { value: 'move', label: 'In einen anderen Raum verschieben' }, { value: 'remove', label: 'Entfernen', destructive: true }]} align="start" /> },
  },
  behaviours: {
    states: [
      ['Closed', 'A quiet round key with three dots, or a word key with a chevron.', 'It never shows orange.'],
      ['Focus', 'The same dark 2px ring as every part, around the key.', 'It comes back to the key when the menu closes.'],
      ['Open', 'The panel appears at once under the key, or above it, with no fade or slide.', 'Focus moves to the first action.'],
      ['Active action', 'The row under the keys or the pointer becomes a small recess.', 'With the keyboard it also shows the ring.'],
      ['Destructive', 'A filled square lamp before the word, after a gap at the end.', 'The word is ink, never red or orange.'],
      ['Disabled action', 'The row fades to half and does nothing when pressed.', 'It stays in its place, so the order does not change.'],
      ['Disabled key', 'The key loses its height and fades.', 'The menu cannot open.'],
    ],
    interactions: [
      ['Keyboard', 'Enter, Space or Down', 'Opens the menu and moves focus to the first action.', 'aria-haspopup menu, aria-expanded'],
      ['Keyboard', 'Up', 'Opens the menu on the last action.', 'aria-expanded'],
      ['Keyboard', 'Down, Up, Home, End', 'Move between actions. Down on the last action goes back to the first.', 'role menuitem'],
      ['Keyboard', 'Letters', 'Move to the next action that starts with what you typed.', 'type-ahead'],
      ['Keyboard', 'Enter or Space', 'Runs the action, closes the menu and puts focus back on the key.', 'role menuitem'],
      ['Keyboard', 'Escape or Tab', 'Closes the menu with focus back on the key; Tab then moves on.', 'aria-expanded'],
      ['Pointer', 'Press the key, press an action', 'Opens the menu, then runs the action. A press outside closes it.', 'menu, menuitem'],
      ['Screen reader', 'Read', 'The key is announced as a menu button with its name; actions are read with their position.', 'role menu'],
    ],
    loading: <p>Menu has no loading state. Actions run when they are pressed and the menu closes at once. When the device has to answer first, show the wait on the row or on the unit’s display, such as Moving to Bedroom, and let a toast say when it is done.</p>,
    focus: <p>A menu key is never focused on page load. When the menu opens, focus moves to the first action, or to the last one when it was opened with Up. When it closes, focus goes back to the key.</p>,
  },
  deepDive: { na: 'Menu has a single panel, so one look covers every use. The two keys are covered under Modifiers.' },
  modifiers: [
    {
      name: 'trigger',
      rules: <p>The round key (icon, the default) is for a row or a unit with no room for a word. Its label is read aloud only, so it must name the thing, such as More for Kitchen lamp. The word key (word) prints the label with a chevron, for a menu whose name helps people find it, such as Sort.</p>,
      pair: { do: <Menu trigger="word" label="Sort" items={SORT} />, doNote: 'A word key where the name helps people find the menu.', dont: <Menu trigger="word" label="More" items={DEVICE} />, dontNote: 'A word key that says nothing a round key would not.' },
    },
    {
      name: 'destructive',
      rules: <p>Mark every action that removes or ends something for good. It moves to the end after a gap and gets the critical lamp before its word. When the loss is large, open a Dialog from it that names what will be lost.</p>,
      pair: { do: <Menu label="More for Washer" items={DEVICE} />, doNote: 'Remove is last, after a gap, with its lamp.', dont: <Menu label="More for Dryer" items={[{ value: 'remove', label: 'Remove' }, { value: 'rename', label: 'Rename' }]} />, dontNote: 'An unmarked removal first in the list, where a slip lands.' },
    },
    {
      name: 'disabled',
      rules: <p>Disable one action when it cannot run now, and keep it in its place so the order stays the same. Disable the whole key only when none of its actions can run, and say why on the unit.</p>,
      pair: { do: <Stack gap="sm"><p className="flush">Updating, 2 min left</p><Menu label="More for Washer" items={DEVICE} disabled /></Stack>, doNote: 'The unit says why the key is locked.', dont: <Menu label="More for Dryer" items={DEVICE} disabled />, dontNote: 'A locked key with no reason anywhere.' },
    },
    {
      name: 'align',
      rules: <p>The panel lines up with the key’s end edge for a round key at the end of a row, and with its start edge for a word key. It still shifts along the key when the screen edge is near, so it is always whole.</p>,
      pair: { do: <Stack direction="row" align="center" gap="lg" style={{ justifyContent: 'space-between' }}><Switch aria-label="Lamp" defaultChecked /><Menu label="More for Lamp" items={DEVICE} /></Stack>, doNote: 'At the end of a row, the panel opens toward the row.', dont: <Stack direction="row" align="center" gap="lg" style={{ justifyContent: 'space-between' }}><Switch aria-label="Fan" /><Menu label="More for Fan" items={DEVICE} align="start" /></Stack>, dontNote: 'Lined up with the start edge, so the panel is pushed back by the screen edge.' },
    },
  ],
  related: [['/components/select', 'Select', 'Picks a value in the same panel.'], ['/components/list', 'List', 'The rows a menu key sits at the end of.'], ['/components/icon-button', 'IconButton', 'The round key the menu opens from.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Menu Button', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/', why: 'The roles, focus moves and keyboard map this menu follows.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why a destructive action is a lamp shape and a word.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
