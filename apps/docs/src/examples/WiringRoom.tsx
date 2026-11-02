// @example A room screen where the thermostat is wired to the heater and the night schedule lowers it after 23:00
import { useState } from 'react';
import { Card, DeviceCard, Display, Rotary, TimePicker, Wiring } from 'dial-react';

export default function WiringRoom() {
  const [target, setTarget] = useState(21);
  const [mode, setMode] = useState('comfort');
  return (
    <Wiring
      label="Heating relations"
      links={[
        { from: 'thermostat', to: 'heater', label: 'sets', text: `The thermostat sets the heater to ${target}`, active: true },
        { from: 'night', to: 'heater', label: 'after 23:00', text: 'Night mode lowers the heater to 18' },
      ]}
    >
      <Wiring.Group label="heating">
        <Wiring.Node id="thermostat">
          <Card padding="unit" wordmark="dial" model="thermostat 1">
            <Display label="Lounge" value="20.5" unit="°C" detail={`Heating to ${target}`} digits={3} />
            <Rotary label="Temperature" min={16} max={26} value={target} onValueChange={setTarget} formatValue={(v) => `${v} °C`} />
          </Card>
        </Wiring.Node>
        <Wiring.Node id="heater">
          <DeviceCard
            model="heater 2"
            display={{ label: 'Heater', value: String(target), unit: '°C', detail: mode === 'eco' ? 'Eco' : 'Comfort', digits: 2 }}
            keysLabel="Mode"
            keys={[{ label: 'Eco', pressed: mode === 'eco', onPress: () => setMode('eco') }, { label: 'Comfort', pressed: mode === 'comfort', onPress: () => setMode('comfort') }]}
          />
        </Wiring.Node>
      </Wiring.Group>
      <Wiring.Node id="night">
        <Card padding="unit" wordmark="dial" model="schedule 1">
          <TimePicker label="Night mode starts" defaultValue="23:00" />
        </Card>
      </Wiring.Node>
    </Wiring>
  );
}
