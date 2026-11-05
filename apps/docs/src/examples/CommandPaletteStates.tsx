// @example A row that cannot run, a command with no section, and a text that matches nothing
import { CommandPalette } from 'dial-react';

const commands = [
  { id: 'undo', label: 'Undo last change' },
  { id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms', shortcut: ['Ctrl', 'L'] },
  { id: 'door', label: 'Unlock the front door', section: 'Rooms', disabled: true },
  { id: 'heat-down', label: 'Lower heating to 18', section: 'Rooms' },
];

export default function CommandPaletteStates() {
  return (
    <>
      <CommandPalette modal={false} defaultOpen hotkey={false} commands={commands} />
      <CommandPalette modal={false} defaultOpen hotkey={false} commands={commands} defaultQuery="piano" label="Command palette with no match" />
    </>
  );
}
