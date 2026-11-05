// @example An action that cannot run now stays in place and fades; a disabled area leaves the browser menu alone
import { ContextMenu, Stack, Text } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'update', label: 'Update now', disabled: true },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ContextMenuStates() {
  return (
    <Stack gap="md">
      <ContextMenu items={ACTIONS} label="Actions for Washer" tabIndex={0} className="demo-box demo-card">
        <Text>Washer. One action cannot run.</Text>
      </ContextMenu>
      <ContextMenu items={ACTIONS} label="Actions for Dryer" disabled className="demo-box demo-card">
        <Text tone="secondary">Dryer. Menu switched off.</Text>
      </ContextMenu>
    </Stack>
  );
}
