// @example A device row with a round key at the end that opens its actions
import { useState } from 'react';
import { List, Menu, Stack, Text } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const lamp = <svg {...g}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" /></svg>;
const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ListWithMenu() {
  const [last, setLast] = useState('');
  return (
    <Stack gap="md" style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <List label="Living room">
        <List.Item leading={lamp} label="Floor lamp" description="On · 70%" trailing={<Menu label="More for Floor lamp" items={ACTIONS} onAction={setLast} />} />
        <List.Item leading={lamp} label="Reading lamp" description="Off" trailing={<Menu label="More for Reading lamp" items={ACTIONS} onAction={setLast} />} />
      </List>
      <Text tone="secondary" aria-live="polite">{last ? `Chose ${last}` : 'No action yet'}</Text>
    </Stack>
  );
}
