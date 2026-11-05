// @example The chosen values held in state, with a line that counts them and the orange key that saves
import { useState } from 'react';
import { Button, Stack, Text, TransferList } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'bathroom', label: 'Bathroom' },
];

export default function TransferListControlled() {
  const [rooms, setRooms] = useState<string[]>(['hallway']);
  return (
    <Stack gap="lg">
      <TransferList label="Rooms on the night schedule" options={ROOMS} value={rooms} onValueChange={setRooms} />
      <Text tone="secondary">{rooms.length} of {ROOMS.length} rooms on the schedule</Text>
      <Button kind="primary">Save schedule</Button>
    </Stack>
  );
}
