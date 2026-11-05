// @example A device row with a round key at the end that opens its actions
import { useState } from 'react';
import { Icon, List, Menu, Stack, Text } from 'dial-react';

const lamp = <Icon name="lamp" />;
const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ListWithMenu() {
  const [last, setLast] = useState('');
  return (
    <Stack gap="md" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <List label="Living room">
        <List.Item leading={lamp} label="Floor lamp" description="On · 70%" trailing={<Menu label="More for Floor lamp" items={ACTIONS} onAction={setLast} />} />
        <List.Item leading={lamp} label="Reading lamp" description="Off" trailing={<Menu label="More for Reading lamp" items={ACTIONS} onAction={setLast} />} />
      </List>
      <Text tone="secondary" aria-live="polite">{last ? `Chose ${last}` : 'No action yet'}</Text>
    </Stack>
  );
}
