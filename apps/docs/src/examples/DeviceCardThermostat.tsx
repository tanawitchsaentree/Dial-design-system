// @example layout="tall": a thermostat in one column, with a heat meter and the knob centred under the display
import { useState } from 'react';
import { DeviceCard } from 'dial-react';

export default function DeviceCardThermostat() {
  const [target, setTarget] = useState(22);
  const [mode, setMode] = useState<'Eco' | 'Away' | null>(null);
  return (
    <DeviceCard
      layout="tall"
      model="thermostat 1"
      display={{ label: 'Thermostat', value: '21.5', unit: '°C', detail: `Heating to ${target}`, digits: 3 }}
      knob={{ label: 'Temperature', min: 16, max: 26, value: target, onValueChange: setTarget, formatValue: (v) => `${v} °C` }}
      keysLabel="Mode"
      keys={[
        { label: 'Eco', pressed: mode === 'Eco', onPress: () => setMode(mode === 'Eco' ? null : 'Eco') },
        { label: 'Away', pressed: mode === 'Away', onPress: () => setMode(mode === 'Away' ? null : 'Away') },
      ]}
      meter={{ label: 'Heat output', value: 6, cols: 16, rows: 2, valueText: '60 percent' }}
    />
  );
}
