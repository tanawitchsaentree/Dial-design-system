// @example Each room's panel holds its own units; the tabs never change a device
import { Stack, Switch, Tabs } from 'dial-react';

const unit = (title: string, lamp: string) => (
  <div className="demo-box demo-card">
    <Stack gap="sm">
      <p className="flush">{title}</p>
      <Switch label={lamp} offLabel="Off" onLabel="On" />
    </Stack>
  </div>
);

const ROOMS = [
  { value: 'living', label: 'Living room', content: unit('Living room · 21.5 °C', 'Floor lamp') },
  { value: 'kitchen', label: 'Kitchen', content: unit('Kitchen · 20.0 °C', 'Worktop light') },
  { value: 'bedroom', label: 'Bedroom', content: unit('Bedroom · 18.0 °C', 'Bedside lamp') },
];

export default function TabsWithUnits() {
  return <Tabs label="Rooms" items={ROOMS} />;
}
