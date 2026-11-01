// @example Rooms printed in a row: the chosen room has an ink index mark under its name
import { Tabs } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room', content: <p className="flush">Heater 21.5 °C · Lamp 60%</p> },
  { value: 'kitchen', label: 'Kitchen', content: <p className="flush">Oven off · Hood on 2</p> },
  { value: 'bedroom', label: 'Bedroom', content: <p className="flush">Heater 18.0 °C · Lamp off</p> },
];

export default function TabsBasic() {
  return <Tabs label="Rooms" items={ROOMS} />;
}
