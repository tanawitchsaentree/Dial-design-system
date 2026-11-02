// @example One deck, two rooms. Enter picks a card up, an arrow walks to a slot, Enter puts it in and Escape puts it back
import { Card, SceneCard, Slot, Stack } from 'dial-react';

export default function SceneCardRooms() {
  return (
    <Stack gap="xl">
      <Stack direction="row" gap="md">
        <SceneCard value="morning" name="Morning" steps={['Blinds up', 'Kettle on']} />
        <SceneCard value="reading" name="Reading" steps={['Desk lamp 80%', 'Speaker off']} />
      </Stack>
      <Stack direction="row" gap="lg">
        <Card padding="unit" wordmark="dial" model="scene 1"><Slot label="Kitchen" /></Card>
        <Card padding="unit" wordmark="dial" model="scene 1"><Slot label="Study" /></Card>
      </Stack>
    </Stack>
  );
}
