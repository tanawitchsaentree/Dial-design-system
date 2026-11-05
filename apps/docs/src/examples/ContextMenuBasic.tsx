// @example An object that opens a panel of actions at the point you right-click, press and hold, or reach with the Context Menu key
import { useState } from 'react';
import { ContextMenu, Stack, Text } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ContextMenuBasic() {
  const [last, setLast] = useState('');
  return (
    <Stack gap="md">
      <ContextMenu items={ACTIONS} label="Actions for Kitchen lamp" onAction={setLast} tabIndex={0} className="demo-box demo-card">
        <Text>Kitchen lamp. Right-click, or press and hold.</Text>
      </ContextMenu>
      <Text tone="secondary" aria-live="polite">{last ? `Chose ${last}` : 'No action yet'}</Text>
    </Stack>
  );
}
