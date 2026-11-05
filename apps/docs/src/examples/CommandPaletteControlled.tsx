// @example Controlled open and query, so the page can open the palette with a text already typed
import { useState } from 'react';
import { Button, CommandPalette } from 'dial-react';

const commands = [
  { id: 'lamps-off', label: 'Turn off all lamps', section: 'Rooms' },
  { id: 'lamps-dim', label: 'Dim the lamps to 30%', section: 'Rooms' },
  { id: 'heat-down', label: 'Lower heating to 18', section: 'Rooms' },
  { id: 'settings', label: 'Open settings', section: 'App' },
];

export default function CommandPaletteControlled() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  return (
    <>
      <Button onClick={() => { setQuery('lamps'); setOpen(true); }}>Find lamp commands</Button>
      <CommandPalette open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} hotkey={false} commands={commands} />
    </>
  );
}
