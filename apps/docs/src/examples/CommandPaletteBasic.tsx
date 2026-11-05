// @example An open palette shown in place: a query window over a printed legend of commands in two sections
import { CommandPalette } from 'dial-react';

const commands = [
  { id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms', shortcut: ['L'] },
  { id: 'heat-down', label: 'Lower heating to 18', section: 'Rooms', shortcut: ['H'] },
  { id: 'wash-stop', label: 'Stop the wash', section: 'Rooms' },
  { id: 'settings', label: 'Open settings', section: 'App', shortcut: ['Ctrl', ','] },
  { id: 'help', label: 'Show keyboard help', section: 'App', shortcut: ['?'] },
];

export default function CommandPaletteBasic() {
  return <CommandPalette modal={false} defaultOpen hotkey={false} commands={commands} />;
}
