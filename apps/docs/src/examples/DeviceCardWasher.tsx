// @example A washer in layout a. The programme knob is orange, so Start is a plastic key beside the keys
import { useState } from 'react';
import { DeviceCard } from 'dial-react';

const PROGRAMMES = ['Eco', 'Cotton', 'Synth', 'Wool', 'Quick', 'Rinse'];

export default function DeviceCardWasher() {
  const [p, setP] = useState(1);
  const [running, setRunning] = useState(false);
  return (
    <DeviceCard
      model="wash 1"
      display={{ label: 'Washer', value: running ? '38' : '0', unit: 'min', detail: PROGRAMMES[p], digits: 3 }}
      knob={{ label: 'Programme', min: 0, max: 5, value: p, onValueChange: setP, formatValue: (v) => PROGRAMMES[v] }}
      keysLabel="Washer"
      keys={[
        { label: running ? 'Pause' : 'Start', onPress: () => setRunning(!running) },
        { label: 'Pre-wash', pressed: false },
      ]}
      meter={{ label: 'Progress', value: running ? 3 : 0, max: 10, cols: 10, rows: 2 }}
    />
  );
}
