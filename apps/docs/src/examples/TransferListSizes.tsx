// @example The two row heights: md at 44px for forms, lg at 52px for the main choice of a phone sheet
import { Stack, TransferList } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
];

export default function TransferListSizes() {
  return (
    <Stack gap="xl">
      <TransferList size="md" label="Rooms, md" options={ROOMS} defaultValue={['kitchen']} />
      <TransferList size="lg" label="Rooms, lg" options={ROOMS} defaultValue={['kitchen']} />
    </Stack>
  );
}
