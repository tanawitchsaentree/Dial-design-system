// @example Three rooms, three slots. With a card held, the arrows walk from slot to slot
import { SceneCard, Slot, Stack, Card } from 'dial-react';

export default function SlotRooms() {
  return (
    <Stack gap="xl">
      <Stack direction="row" gap="md">
        <SceneCard value="away" name="Away" steps={['Lamps off', 'Heating 16°']} />
      </Stack>
      <Card padding="unit" wordmark="dial" model="home 3">
        <Stack direction="row" gap="lg">
          <Slot label="Kitchen" />
          <Slot label="Bedroom" />
          <Slot label="Hall" />
        </Stack>
      </Card>
    </Stack>
  );
}
