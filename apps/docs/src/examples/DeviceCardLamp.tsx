// @example A lamp has no knob, so its main key is the one orange part; the fader sets the brightness
import { useState } from 'react';
import { DeviceCard } from 'dial-react';

export default function DeviceCardLamp() {
  const [on, setOn] = useState(true);
  const [level, setLevel] = useState(70);
  const [tone, setTone] = useState<'Warm' | 'Cool'>('Warm');
  return (
    <DeviceCard
      layout="compact"
      model="lamp 1"
      display={{ label: 'Lamp', value: on ? String(level) : '0', unit: '%', detail: on ? `${tone} white` : 'Off', digits: 3 }}
      primary={{ label: on ? 'Turn off' : 'Turn on', onPress: () => setOn(!on) }}
      keysLabel="Colour"
      keys={[
        { label: 'Warm', pressed: tone === 'Warm', onPress: () => setTone('Warm') },
        { label: 'Cool', pressed: tone === 'Cool', onPress: () => setTone('Cool') },
      ]}
      fader={{ label: 'Brightness', min: 0, max: 100, step: 10, value: level, onValueChange: setLevel, formatValue: (v) => `${v} %`, disabled: !on }}
    />
  );
}
