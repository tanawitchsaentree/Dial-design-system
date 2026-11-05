// Usage tab for ContextMenu (component-depth.md U1–U14). ContextMenu opens Menu's actions at the pointer.
import { ContextMenu, Menu, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];
const area = (text: string, label = 'Actions for Kitchen lamp', props: Record<string, unknown> = {}) => (
  <ContextMenu items={ACTIONS} label={label} tabIndex={0} className="demo-box demo-card" {...props}><Text>{text}</Text></ContextMenu>
);

export const CONTEXT_MENU: Depth = {
  overview: (
    <>
      <p>ContextMenu wraps one object, such as a device card or a row, and opens Menu’s panel at the spot you pressed. A right-click does it with a mouse, a press and hold of half a second does it with a finger, and the Context Menu key or Shift+F10 does it from the keyboard.</p>
      <p>It is a shortcut, never the only way to an action. A right-click and a long press are hidden gestures, so every action in the panel must also be on a visible key, usually a Menu beside the object. While the panel is open the object sinks into a well, so it is clear what the actions are for.</p>
    </>
  ),
  whenToUse: ['To give a device card, a row or a tile quick actions at the pointer.', 'To repeat the actions of a visible Menu as a shortcut for people who use a mouse.'],
  whenNot: [
    { situation: 'The only place an action can be reached', to: '/components/menu', label: 'Menu' },
    { situation: 'A short list of actions on a phone sheet', to: '/components/action-sheet', label: 'ActionSheet' },
    { situation: 'Choosing one value from a list', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'ContextMenu has one look, Menu’s panel at a point. Which object is open is told by a recess, so there is no variant.' },
  anatomy: {
    render: area('Kitchen lamp. Right-click, or press and hold.'),
    parts: [
      { part: 'Object', selector: '[data-component="ContextMenu"]', what: 'The wrapped area. It sinks into a well while the panel is open.' },
    ],
  },
  sizes: { na: 'ContextMenu has no size. The object is whatever size you wrap, and every row in the panel is at least 44px tall.' },
  emphasis: { na: 'The panel is plastic and ink. Nothing in a ContextMenu is orange, and a destructive action is a square lamp beside its word.' },
  placement: {
    rows: [['Around a device card or a list row', 'Wrap the whole card, and keep a visible Menu key inside it with the same actions.'], ['Around a large area', 'Wrap the area; the panel opens where the pointer is, so it need not reach a corner.']],
    examples: [{
      title: 'Around a card with its own Menu',
      render: (
        <ContextMenu items={ACTIONS} label="Actions for Hall speaker" tabIndex={0} className="demo-box demo-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Text>Hall speaker</Text><Menu label="More for Hall speaker" items={ACTIONS} /></div>
        </ContextMenu>
      ),
    }],
  },
  combinations: {
    good: [['ContextMenu + Menu', 'The same items on both: the Menu key for everyone, the right-click for speed.'], ['ContextMenu + Card', 'Wrap the card so the whole surface answers.']],
    avoid: [{ title: 'a ContextMenu with no visible key', why: 'Nobody on a keyboard-less phone or a screen reader finds a hidden gesture. Add a Menu key with the same actions.', render: area('Kitchen lamp. No other way to rename it.') }],
  },
  content: {
    formula: <p>Start each action with a verb, as in <em>Rename</em> or <em>Move to room</em>. Name the panel for its object, as in <em>Actions for Kitchen lamp</em>. Put the action that removes something last.</p>,
    pair: {
      do: <Stack gap="sm">{area('Kitchen lamp')}</Stack>, doNote: 'Verbs, the destructive one last.',
      dont: <ContextMenu items={[{ value: 'a', label: 'Lamp options' }, { value: 'b', label: 'Remove', destructive: true }, { value: 'c', label: 'Rename' }]} label="Menu" tabIndex={0} className="demo-box demo-card"><Text>Kitchen lamp</Text></ContextMenu>, dontNote: 'A noun for an action, and the destructive one in the middle.',
    },
    overflow: { text: 'The panel grows to its longest action, and stays on the screen. When the screen is shorter than the panel, the panel scrolls.', render: area('A long name for the device that is being acted on', 'Actions for a long name', { items: [{ value: 'a', label: 'Move to the living room on the upper floor' }, { value: 'b', label: 'Remove', destructive: true }] }) },
    rtl: { text: 'In right-to-left languages the panel’s far corner sits at the point and the panel grows toward the start of the line.', render: <div dir="rtl"><ContextMenu items={[{ value: 'a', label: 'إعادة التسمية' }, { value: 'b', label: 'حذف', destructive: true }]} label="الإجراءات" tabIndex={0} className="demo-box demo-card"><Text>مصباح المطبخ</Text></ContextMenu></div> },
    expansion: { text: 'German and Finnish actions can run 30% longer. The panel grows and no word is cut.', render: area('Küchenlampe', 'Aktionen', { items: [{ value: 'a', label: 'In einen anderen Raum verschieben' }, { value: 'b', label: 'Entfernen', destructive: true }] }) },
  },
  behaviours: {
    states: [
      ['Closed', 'The object as it is.', 'Nothing is announced.'],
      ['Open', 'The object sinks into a well and the panel stands at the point.', 'A menu named by label opens, focus moves into it.'],
      ['Disabled', 'The object is unchanged and the browser’s own menu is left alone.', 'No menu is offered.'],
    ],
    interactions: [
      ['Mouse', 'Right-click', 'Opens the panel at the pointer with no row chosen.', 'contextmenu'],
      ['Touch', 'Press and hold 500ms', 'Opens the panel under the finger. A finger that moves further than 10px is scrolling and cancels it.', 'pointer events'],
      ['Keyboard', 'Context Menu key or Shift+F10', 'Opens the panel in the middle of the focused element with focus on the first action.', 'keydown'],
      ['Keyboard', 'Arrow Up and Down, Home, End, letters', 'Moves between actions and jumps by the first letters typed.', 'role="menu"'],
      ['Keyboard', 'Enter or Space', 'Runs the action and returns focus to where it was.', 'role="menuitem"'],
      ['Keyboard', 'Escape or Tab', 'Closes the panel and returns focus.', 'native'],
      ['Screen reader', 'Read', 'Read as a menu named by label with its items; a disabled action is dimmed.', 'role="menu", aria-disabled'],
    ],
    loading: <p>ContextMenu has no loading state. If an action takes time, show that on the object after the panel has closed.</p>,
    focus: <p>Opened from the keyboard, focus lands on the first action. Opened by the pointer, focus lands on the panel with no row chosen, so Enter does nothing until an arrow key moves. Closing returns focus to the element that had it before.</p>,
  },
  deepDive: { na: 'ContextMenu has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'disabled',
      rules: <p>The area stays but the menu is off and the browser’s own menu shows as usual. Use it while the object cannot be acted on.</p>,
      pair: { do: area('Dryer', 'Actions for Dryer', { disabled: true, tabIndex: undefined }), doNote: 'Off while the dryer is updating.', dont: area('Dryer. Hidden gesture only.', 'Actions for Dryer'), dontNote: 'An enabled menu on an object nobody can act on.' },
    },
    {
      name: 'label',
      rules: <p>Names the panel for assistive tech. Say whose actions they are: <em>Actions for Kitchen lamp</em>. It defaults to “Actions”.</p>,
      pair: { do: area('Kitchen lamp', 'Actions for Kitchen lamp'), doNote: 'The object is named.', dont: area('Kitchen lamp', 'Menu'), dontNote: 'A noun that names nothing.' },
    },
  ],
  related: [['/components/menu', 'Menu', 'The visible key with the same panel. Use it for every action.'], ['/components/action-sheet', 'ActionSheet', 'A sheet of choices from the bottom of a phone.'], ['/components/popover', 'Popover', 'Free content next to a part, not a list of actions.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Menu', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu/', why: 'Keys and roles of the panel.' },
    { title: 'WCAG 2.2 · 2.5.1 Pointer Gestures', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html', why: 'Why a hidden gesture can never be the only way.' },
    { title: 'MDN · contextmenu event', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event', why: 'When the browser raises the right-click and keyboard event.' },
  ],
};
