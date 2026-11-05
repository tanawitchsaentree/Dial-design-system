// Usage tab for CommandPalette (component-depth.md U1–U14). CommandPalette finds and runs a command by typing.
import { CommandPalette } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const commands = [
  { id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms', shortcut: ['L'] },
  { id: 'heat-down', label: 'Lower heating to 18', section: 'Rooms', shortcut: ['H'] },
  { id: 'settings', label: 'Open settings', section: 'App', shortcut: ['Ctrl', ','] },
];
const place = (props: Partial<React.ComponentProps<typeof CommandPalette>> = {}) => (
  <CommandPalette modal={false} defaultOpen hotkey={false} commands={commands} {...props} />
);

export const COMMAND_PALETTE: Depth = {
  overview: (
    <>
      <p>CommandPalette is a sheet for finding a command by typing. It has one recessed window to type in and a printed list of every command under it, grouped by section. The command you can run with Enter has a small ink dot and a plate, and its shortcut is printed on a keycap at the end of the row.</p>
      <p>It opens with Ctrl or Cmd plus K, from a key, or from your own state. Escape closes it and focus goes back to where it was.</p>
    </>
  ),
  whenToUse: ['To give an app with many actions one place to find any of them by name.', 'To teach shortcuts by printing them next to the commands.'],
  whenNot: [
    { situation: 'Choosing one value for a field', to: '/components/combobox', label: 'Combobox' },
    { situation: 'A short list of actions on one element', to: '/components/menu', label: 'Menu' },
    { situation: 'Asking one question about a device', to: '/components/dialog', label: 'Dialog' },
  ],
  variants: { na: 'CommandPalette has one look. Whether it is modal, and how it opens, are props covered under Modifiers.' },
  anatomy: {
    render: <Unit>{place()}</Unit>,
    parts: [
      { part: 'Sheet', selector: '[data-component="CommandPalette"]', what: 'A native dialog on the float elevation, over a scrim.' },
      { part: 'Query window', selector: '[data-component="CommandPalette"] input', what: 'A recessed 44px field with the search mark.' },
      { part: 'Section name', selector: '[data-component="CommandPalette"] [role="group"] > div:first-child', what: 'A small secondary-ink label above its commands.' },
      { part: 'Command row', selector: '[data-component="CommandPalette"] [role="option"]', what: 'A 44px row with an index dot, the name and the shortcut.' },
    ],
  },
  sizes: { na: 'CommandPalette has one size. Rows are 44px and the sheet is at most 420px wide.' },
  emphasis: { na: 'The lit row is told by a plate, weight and an ink dot. Nothing in a CommandPalette is orange.' },
  placement: {
    rows: [['Anywhere in an app', 'Mount one palette near the root of the app, so the shortcut works on every screen.'], ['One per page', 'Two palettes with the same hotkey open together.']],
    examples: [{ title: 'Shown in place for a preview', render: <Unit>{place()}</Unit> }],
  },
  combinations: {
    good: [['CommandPalette + Button', 'A key beside the search field opens it for people who do not know the shortcut.'], ['CommandPalette + Kbd', 'The shortcuts on the rows are Kbd caps, so they look like the keys they name.']],
    avoid: [{ title: 'a CommandPalette with two commands', why: 'Two commands fit in a Menu. A palette earns its place at about ten commands.', render: <Unit>{place({ commands: commands.slice(0, 2) })}</Unit> }],
  },
  content: {
    formula: <p>Start each command with a verb and name the thing, as in <em>Turn off all lamps</em>. Put the section in a noun, as in <em>Rooms</em>. Add <code>keywords</code> for the words people might type instead.</p>,
    pair: {
      do: place({ commands: [{ id: 'a', label: 'Turn off all lamps', section: 'Rooms', keywords: ['light'] }] }), doNote: 'A verb, a thing, and a keyword for “light”.',
      dont: place({ commands: [{ id: 'a', label: 'Lamps', section: 'Commands' }] }), dontNote: 'A noun alone does not say what happens.',
    },
    overflow: { text: 'A long name wraps inside the row and the shortcut stays at the end. The rows grow; the sheet keeps its height and the list scrolls.', render: place({ commands: [{ id: 'a', label: 'Turn off every lamp in the living room, hall and kitchen at once', section: 'Rooms', shortcut: ['L'] }] }) },
    rtl: { text: 'In right-to-left languages the index dot and the name move to the right and the shortcut to the left.', render: <div dir="rtl">{place({ commands: [{ id: 'a', label: 'أطفئ كل المصابيح', section: 'الغرف', shortcut: ['L'] }], label: 'لوحة الأوامر', placeholder: 'اكتب أمرا', emptyText: 'لا يوجد أمر' })}</div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the shortcut does not move.', render: place({ commands: [{ id: 'a', label: 'Alle Lampen im Wohnzimmer ausschalten', section: 'Räume', shortcut: ['L'] }] }) },
  },
  behaviours: {
    states: [
      ['Lit row', 'A plate, medium weight and an ink dot.', 'aria-selected on the option and aria-activedescendant on the field.'],
      ['Waiting row', 'Secondary ink.', 'Read with its section name.'],
      ['Cannot run', 'Half opacity; the arrows skip it.', 'aria-disabled.'],
      ['No match', 'One line says so.', 'Announced politely.'],
    ],
    interactions: [
      ['Keyboard', 'Ctrl or Cmd + K', 'Opens and closes the palette from anywhere.', 'hotkey'],
      ['Keyboard', 'Type', 'Filters the commands. The first one you can run is lit.', 'native'],
      ['Keyboard', 'Arrow Down, Arrow Up', 'Lights the next or previous command, wrapping at the ends. Focus stays in the field.', 'aria-activedescendant'],
      ['Keyboard', 'Page Down, Page Up', 'Jumps five commands.', 'native'],
      ['Keyboard', 'Enter', 'Runs the lit command and closes the palette.', 'native'],
      ['Keyboard', 'Escape', 'Closes the palette. Focus returns to where it was.', 'native dialog'],
      ['Pointer', 'Click a row', 'Runs it. The scrim closes the palette.', 'native'],
    ],
    loading: <p>CommandPalette has no loading state. Filter on your side with <code>query</code> and <code>onQueryChange</code> if commands come from a server, and pass the matches in <code>commands</code>.</p>,
    focus: <p>On open, focus moves to the field. Tab stays on the field because it is the only stop, and the page behind is inert. On close, focus returns to the element that had it before.</p>,
  },
  deepDive: { na: 'CommandPalette has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'hotkey',
      rules: <p>The default is <code>mod+k</code>. Change it to another chord or pass <code>false</code> when the page has its own. Use one palette per page.</p>,
      pair: { do: place({ hotkey: false }), doNote: 'One palette answers the chord.', dont: place({ commands: commands.slice(0, 1) }), dontNote: 'A second palette left on the same chord would open together with the first.' },
    },
    {
      name: 'closeOnRun',
      rules: <p>The palette closes after a command runs. Pass <code>closeOnRun={'{false}'}</code> for commands that chain, such as stepping a value up.</p>,
      pair: { do: place({ closeOnRun: true }), doNote: 'Closes after the command.', dont: place({ closeOnRun: false }), dontNote: 'Stays open: only for chained commands.' },
    },
  ],
  related: [['/components/dialog', 'Dialog', 'Asking one question about a device.'], ['/components/menu', 'Menu', 'A short list of actions on one element.'], ['/components/kbd', 'Kbd', 'The keycaps for the shortcuts.'], ['/components/combobox', 'Combobox', 'Choosing one value for a field.']],
  references: [
    { title: 'WAI-ARIA APG · Combobox with listbox popup', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/', why: 'The field and list pattern the palette follows.' },
    { title: 'WAI-ARIA APG · Dialog (modal)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'Focus moves in, Escape closes, focus returns.' },
    { title: 'WCAG 2.2 · 2.1.4 Character Key Shortcuts', url: 'https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html', why: 'Why the chord needs a modifier.' },
  ],
};
