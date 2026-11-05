// @example A list that takes any number of rows, with the chosen values held in state and counted beside it
import { useState } from 'react';
import { Listbox, Text } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'bathroom', label: 'Bathroom' },
];

export default function ListboxMultiple() {
  const [rooms, setRooms] = useState<string[]>(['kitchen']);
  return (
    <>
      <Listbox multiple label="Rooms on the night schedule" options={ROOMS} value={rooms} onValueChange={setRooms} />
      <Text tone="secondary">{rooms.length} of {ROOMS.length} rooms chosen</Text>
    </>
  );
}
