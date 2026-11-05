// @example A living room unit with its slot and its own orange key. The inserted card stands half out and the lamp says Running
import { useState } from 'react';
import { Card, Icon, IconButton, SceneCard, Slot, Stack, Text } from 'dial-react';


export default function SlotBasic() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack gap="xl">
      <Stack direction="row" gap="md">
        <SceneCard value="movie" name="Movie night" steps={['Lamps 20%', 'Blinds down', 'TV on']} />
        <SceneCard value="night" name="Good night" steps={['All lamps off']} />
      </Stack>
      <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', maxInlineSize: '100%' }}>
        <Card padding="unit" wordmark="dial" model="scene 1">
          <Stack direction="row" gap="lg" align="center" style={{ justifyContent: 'space-between' }}>
            <Slot label="Living room" onInsert={(s) => setLast(`ran ${s.name}`)} onRemove={(s) => setLast(`stopped ${s.name}`)} />
            <IconButton label="Living room lamps off" kind="primary" size="lg"><Icon name="power" /></IconButton>
          </Stack>
        </Card>
      </div>
      <Text tone="secondary">Last: {last}</Text>
    </Stack>
  );
}
