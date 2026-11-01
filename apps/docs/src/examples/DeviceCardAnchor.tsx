// @example Anchor A: a radio with its LCD across the top, the orange tuning knob, band keys, a volume grille and a ruler fader
import { useState } from 'react';
import { DeviceCard } from 'dial-react';

const station = (step: number) => (87.6 + step * 0.5).toFixed(1);

export default function DeviceCardAnchor() {
  const [step, setStep] = useState(2);
  const [band, setBand] = useState<'FM' | 'AM'>('FM');
  const [volume, setVolume] = useState(4);
  return (
    <DeviceCard
      data-anchor="a"
      model="tuner 1"
      display={{ label: 'Radio', value: station(step), unit: 'MHz', digits: 4 }}
      knob={{ label: 'Tuning', value: step, onValueChange: setStep, formatValue: (v) => `Step ${v}` }}
      keysLabel="Band"
      keys={[
        { label: 'FM', pressed: band === 'FM', onPress: () => setBand('FM') },
        { label: 'AM', pressed: band === 'AM', onPress: () => setBand('AM') },
      ]}
      meter={{ label: 'Volume', value: volume, cols: 10, rows: 4 }}
      fader={{ label: 'Volume', value: volume, onValueChange: setVolume, step: 1 }}
    />
  );
}
