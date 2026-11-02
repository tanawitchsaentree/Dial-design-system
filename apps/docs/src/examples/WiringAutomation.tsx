// @example An automation view where the hall sensor turns on two lights after sunset
import { Card, Display, Switch, Wiring } from 'dial-react';

export default function WiringAutomation() {
  return (
    <Wiring
      label="Hall automation"
      links={[
        { from: 'sensor', to: 'hall', label: 'after sunset', text: 'The hall sensor turns on the hall light after sunset', active: true },
        { from: 'sensor', to: 'stairs', label: 'at 10 %', text: 'The hall sensor turns on the stair light at 10 percent after sunset', active: true },
      ]}
    >
      <Wiring.Node id="sensor">
        <Card padding="unit" wordmark="dial" model="sensor 1">
          <Display label="Hall sensor" value="Motion" detail="Seen 19:42" kind="oled" />
        </Card>
      </Wiring.Node>
      <Wiring.Group label="lights">
        <Wiring.Node id="hall"><Card padding="unit" wordmark="dial" model="lamp 1"><Switch label="Hall light" defaultChecked /></Card></Wiring.Node>
        <Wiring.Node id="stairs"><Card padding="unit" wordmark="dial" model="lamp 3"><Switch label="Stair light" defaultChecked /></Card></Wiring.Node>
      </Wiring.Group>
    </Wiring>
  );
}
