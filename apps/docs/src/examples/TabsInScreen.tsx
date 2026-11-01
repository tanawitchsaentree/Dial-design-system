// @example Tabs choose the section of a screen; a SegmentedControl inside it sets a mode
import { Heading, SegmentedControl, Stack, Tabs } from 'dial-react';

const MODES = [
  { value: 'heat', label: 'Heat' },
  { value: 'eco', label: 'Eco' },
  { value: 'frost', label: 'Frost' },
];

const heater = (room: string, mode: string) => (
  <div className="demo-box demo-card">
    <Stack gap="md" align="start">
      <p className="flush">{room} heater</p>
      <SegmentedControl label="Mode" options={MODES} defaultValue={mode} />
    </Stack>
  </div>
);

const ROOMS = [
  { value: 'living', label: 'Living room', content: heater('Living room', 'heat') },
  { value: 'bedroom', label: 'Bedroom', content: heater('Bedroom', 'eco') },
];

export default function TabsInScreen() {
  return (
    <Stack gap="md">
      <Heading level={3}>Heating</Heading>
      <Tabs label="Rooms" items={ROOMS} />
    </Stack>
  );
}
