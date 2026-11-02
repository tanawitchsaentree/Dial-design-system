// @example In one column the parts stack and each line runs straight down between neighbours
import { Card, Display, Switch, Wiring } from 'dial-react';

export default function WiringStacked() {
  return (
    <div style={{ inlineSize: 'min(100%, 340px)' }}>
      <Wiring
        label="Morning relations"
        links={[
          { from: 'alarm', to: 'blinds', label: 'at 07:00', text: 'The alarm opens the blinds at 07:00', active: true },
          { from: 'blinds', to: 'kettle', label: 'then', text: 'Opening the blinds turns on the kettle' },
        ]}
      >
          <Wiring.Node id="alarm" style={{ inlineSize: '100%' }}><Card padding="unit" wordmark="dial" model="clock 1"><Display label="Alarm" value="07:00" digits={4} /></Card></Wiring.Node>
          <Wiring.Node id="blinds" style={{ inlineSize: '100%' }}><Card padding="unit" wordmark="dial" model="blind 2"><Switch label="Blinds open" defaultChecked /></Card></Wiring.Node>
          <Wiring.Node id="kettle" style={{ inlineSize: '100%' }}><Card padding="unit" wordmark="dial" model="kettle 1"><Switch label="Kettle" /></Card></Wiring.Node>
      </Wiring>
    </div>
  );
}
