// @example A controlled fader: the unit's display says the value, the fader sets it
import { useState } from 'react';
import { Slider, Stack } from 'dial-react';

export default function SliderControlled() {
  const [level, setLevel] = useState(3);
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush" role="status">Lamp · level {level} of 5</p>
        <Slider label="Level" min={0} max={5} step={1} value={level} onValueChange={setLevel} scale />
      </Stack>
    </div>
  );
}
