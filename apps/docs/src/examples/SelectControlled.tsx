// @example Controlled with value and onValueChange: the unit's display says the choice
import { useState } from 'react';
import { Select, Stack } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bath', label: 'Bathroom' },
];

export default function SelectControlled() {
  const [room, setRoom] = useState('kitchen');
  const name = ROOMS.find((r) => r.value === room)?.label;
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush" role="status">Lamp · {name}</p>
        <Select label="Room" options={ROOMS} value={room} onValueChange={setRoom} />
      </Stack>
    </div>
  );
}
