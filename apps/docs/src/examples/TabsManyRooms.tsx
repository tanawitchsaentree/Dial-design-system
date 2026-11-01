// @example Five rooms wrap onto a second row in a narrow column; the names never shift when chosen
import { Tabs } from 'dial-react';

const NAMES = ['Living room', 'Kitchen', 'Bedroom', 'Bathroom', 'Study'];
const ROOMS = NAMES.map((n) => ({ value: n.toLowerCase(), label: n, content: <p className="flush">{n} · all devices idle</p> }));

export default function TabsManyRooms() {
  return (
    <div style={{ maxInlineSize: 320 }}>
      <Tabs label="Rooms" items={ROOMS} defaultValue="bathroom" />
    </div>
  );
}
