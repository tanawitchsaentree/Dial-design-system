// @example A living room unit with its slot and its own orange key. The inserted card stands half out and the lamp says Running
import { useState } from 'react';
import { Card, IconButton, SceneCard, Slot, Stack, Text } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function SlotBasic() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack gap="xl">
      <Stack direction="row" gap="md">
        <SceneCard value="movie" name="Movie night" steps={['Lamps 20%', 'Blinds down', 'TV on']} />
        <SceneCard value="night" name="Good night" steps={['All lamps off']} />
      </Stack>
      <div style={{ inlineSize: 340, maxInlineSize: '100%' }}>
        <Card padding="unit" wordmark="dial" model="scene 1">
          <Stack direction="row" gap="lg" align="center" style={{ justifyContent: 'space-between' }}>
            <Slot label="Living room" onInsert={(s) => setLast(`ran ${s.name}`)} onRemove={(s) => setLast(`stopped ${s.name}`)} />
            <IconButton label="Living room lamps off" kind="primary" size="lg"><svg {...icon}><path d="M12 3v9M6.3 7.3a8 8 0 1 0 11.4 0" /></svg></IconButton>
          </Stack>
        </Card>
      </div>
      <Text tone="secondary">Last: {last}</Text>
    </Stack>
  );
}
