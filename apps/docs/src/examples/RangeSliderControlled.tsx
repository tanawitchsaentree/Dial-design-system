// @example A controlled range, with the unit's display saying the band the caps set
import { useState } from 'react';
import { Display, RangeSlider, Stack } from 'dial-react';
import type { RangeValue } from 'dial-react';

export default function RangeSliderControlled() {
  const [band, setBand] = useState<RangeValue>([2700, 4000]);
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display kind="oled" label="Lamp" value={`${band[0]} to ${band[1]} K`} detail="Warm in the evening, cool by day" />
        <RangeSlider label="Colour range" min={2200} max={6500} step={100} value={band} onValueChange={setBand} lowLabel="Warmest" highLabel="Coolest" formatValue={(v) => `${v} K`} />
      </Stack>
    </div>
  );
}
