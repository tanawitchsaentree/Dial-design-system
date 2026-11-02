// @example Thai words on the lines and in the sentences, with the box named in Thai
import { Card, Display, Rotary, Wiring } from 'dial-react';

export default function WiringThai() {
  return (
    <Wiring
      label="ความสัมพันธ์ของแอร์"
      activeWord="ทำงานอยู่"
      waitingWord="รออยู่"
      links={[{ from: 'knob', to: 'air', label: 'หลัง 22:00', text: 'โหมดนอนตั้งแอร์ที่ 26 องศา', active: true }]}
    >
      <Wiring.Group label="ห้องนอน">
        <Wiring.Node id="knob"><Rotary kind="key" label="อุณหภูมิ" min={18} max={30} defaultValue={26} formatValue={(v) => `${v} °C`} /></Wiring.Node>
        <Wiring.Node id="air"><Card padding="unit" wordmark="dial" model="แอร์ 1"><Display label="แอร์" value="26" unit="°C" detail="โหมดนอน" digits={2} /></Card></Wiring.Node>
      </Wiring.Group>
    </Wiring>
  );
}
