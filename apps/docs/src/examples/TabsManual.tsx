// @example activation="manual": arrows move focus only, Enter or Space opens the room
import { Tabs } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room', content: <p className="flush">Camera feed · Living room</p> },
  { value: 'hall', label: 'Hall', content: <p className="flush">Camera feed · Hall</p> },
  { value: 'garden', label: 'Garden', content: <p className="flush">Camera feed · Garden</p> },
];

export default function TabsManual() {
  return <Tabs label="Cameras" items={ROOMS} activation="manual" />;
}
