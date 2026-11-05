// @example Opened by a key or by a chord, here Ctrl or Cmd plus J; focus returns to the key when it closes
import { useState } from 'react';
import { Button, CommandPalette, Text } from 'dial-react';

const commands = [
  { id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms', keywords: ['light'] },
  { id: 'heat-down', label: 'Lower heating to 18', section: 'Rooms', keywords: ['temperature'] },
  { id: 'settings', label: 'Open settings', section: 'App' },
];

export default function CommandPaletteTrigger() {
  const [last, setLast] = useState('Nothing run yet');
  return (
    <>
      <CommandPalette hotkey="mod+j" trigger={<Button>Find a command</Button>} commands={commands} onRun={(c) => setLast(c.label)} />
      <Text tone="secondary">{last}</Text>
    </>
  );
}
