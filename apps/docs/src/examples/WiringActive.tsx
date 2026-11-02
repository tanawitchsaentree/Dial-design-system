// @example Turning night mode on steps its line to full ink, and the sentence says it is on now
import { useState } from 'react';
import { Card, Display, Switch, Wiring } from 'dial-react';

export default function WiringActive() {
  const [night, setNight] = useState(false);
  return (
    <Wiring
      label="Night mode relations"
      links={[{ from: 'switch', to: 'heater', label: 'lowers to 18', text: 'Night mode lowers the heater to 18', active: night }]}
    >
      <Wiring.Node id="switch">
        <Card padding="unit" wordmark="dial" model="scene 1">
          <Switch label="Night mode" checked={night} onCheckedChange={setNight} />
        </Card>
      </Wiring.Node>
      <Wiring.Node id="heater">
        <Card padding="unit" wordmark="dial" model="heater 2">
          <Display label="Heater" value={night ? '18' : '21'} unit="°C" detail={night ? 'Night mode' : 'Comfort'} digits={2} />
        </Card>
      </Wiring.Node>
    </Wiring>
  );
}
