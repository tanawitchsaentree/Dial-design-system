// @example A card that was already in when the page opened stands still; it does not slide in again or run again
import { Card, Slot, Stack } from 'dial-react';

export default function SlotInserted() {
  return (
    <Stack direction="row" gap="lg">
      <Card padding="unit" wordmark="dial" model="scene 1"><Slot label="Bedroom" defaultScene={{ value: 'night', name: 'Good night', steps: ['All lamps off'] }} /></Card>
      <Card padding="unit" wordmark="dial" model="scene 1"><Slot label="Nursery" defaultScene={{ value: 'nap', name: 'Nap', steps: ['Blinds down', 'Night lamp 5%'] }} /></Card>
    </Stack>
  );
}
