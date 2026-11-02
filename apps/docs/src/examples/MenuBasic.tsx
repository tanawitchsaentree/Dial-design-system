// @example A round key that opens the actions for one device, the destructive one last with its lamp
import { useState } from 'react';
import { Menu, Stack, Text } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function MenuBasic() {
  const [last, setLast] = useState('');
  return (
    <Stack direction="row" align="center" gap="lg">
      <Menu label="More for Kitchen lamp" items={ACTIONS} onAction={setLast} />
      <Text tone="secondary" aria-live="polite">{last ? `Chose ${last}` : 'No action yet'}</Text>
    </Stack>
  );
}
