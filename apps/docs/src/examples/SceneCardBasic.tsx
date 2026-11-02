// @example Three scenes on cards and the living room's slot. Press a card, then the slot; or drag a card by its handle
import { Card, SceneCard, Slot, Stack } from 'dial-react';

export default function SceneCardBasic() {
  return (
    <Stack gap="xl">
      <Stack direction="row" gap="md">
        <SceneCard value="movie" name="Movie night" steps={['Lamps 20%', 'Blinds down', 'TV on']} />
        <SceneCard value="away" name="Away" steps={['Lamps off', 'Heating 16°']} />
        <SceneCard value="night" name="Good night" steps={['All lamps off', 'Doors locked']} />
      </Stack>
      <div style={{ inlineSize: 300, maxInlineSize: '100%' }}>
        <Card padding="unit" wordmark="dial" model="scene 1">
          <Slot label="Living room" />
        </Card>
      </div>
    </Stack>
  );
}
