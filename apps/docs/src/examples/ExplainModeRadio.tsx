// @example A tuner that names its window, its two knobs and its band keys when How this works is pressed
import { useState } from 'react';
import { Card, Display, Explain, ExplainMode, Rotary, SegmentedControl, Stack } from 'dial-react';

export default function ExplainModeRadio() {
  const [step, setStep] = useState(2);
  const [volume, setVolume] = useState(4);
  const [band, setBand] = useState('fm');
  return (
    <ExplainMode>
      <Card padding="unit" wordmark="dial" model="tuner 1">
        <Explain name="Window" does="Shows the station you are on.">
          <Display label="Radio" value={(87.6 + step * 0.5).toFixed(1)} unit="MHz" digits={4} />
        </Explain>
        <Stack direction="row" gap="xl">
          <Explain name="Station" does="Turns through the stations on the band.">
            <Rotary label="Tuning" min={0} max={40} value={step} onValueChange={setStep} formatValue={(v) => `Step ${v}`} />
          </Explain>
          <Explain name="Volume" does="Sets how loud the speaker plays.">
            <Rotary kind="key" label="Volume" min={0} max={10} value={volume} onValueChange={setVolume} />
          </Explain>
        </Stack>
        <Explain name="Band" does="Picks FM or AM.">
          <SegmentedControl label="Band" value={band} onValueChange={setBand} options={[{ value: 'fm', label: 'FM' }, { value: 'am', label: 'AM' }]} />
        </Explain>
      </Card>
    </ExplainMode>
  );
}
