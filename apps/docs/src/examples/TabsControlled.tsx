// @example value and onValueChange keep the chosen room in your state
import { useState } from 'react';
import { Stack, Tabs } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room', content: <p className="flush">Two devices: heater and lamp.</p> },
  { value: 'kitchen', label: 'Kitchen', content: <p className="flush">Three devices: oven, hood and radio.</p> },
  { value: 'bedroom', label: 'Bedroom', content: <p className="flush">Two devices: heater and lamp.</p> },
];

export default function TabsControlled() {
  const [room, setRoom] = useState('kitchen');
  return (
    <Stack gap="sm">
      <p className="flush">Last opened: {ROOMS.find((r) => r.value === room)?.label}</p>
      <Tabs label="Rooms" items={ROOMS} value={room} onValueChange={setRoom} />
    </Stack>
  );
}
