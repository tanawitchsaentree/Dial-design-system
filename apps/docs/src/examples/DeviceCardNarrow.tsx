// @example On a narrow body every part takes its own row, so nothing draws below a 44px target
import { DeviceCard } from 'dial-react';

export default function DeviceCardNarrow() {
  return (
    <div style={{ inlineSize: 260 }}>
      <DeviceCard
        model="tuner 1"
        display={{ label: 'Radio', value: '88.6', unit: 'MHz', digits: 4 }}
        knob={{ label: 'Tuning', defaultValue: 2 }}
        keysLabel="Band"
        keys={[{ label: 'FM', pressed: true }, { label: 'AM', pressed: false }]}
        meter={{ label: 'Volume', value: 4, cols: 10, rows: 4 }}
        fader={{ label: 'Volume', defaultValue: 4, step: 1 }}
      />
    </div>
  );
}
