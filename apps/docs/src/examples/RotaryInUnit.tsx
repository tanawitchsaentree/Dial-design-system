// @example In a unit, the knob takes 0.36 of the unit's short side, under the display
import { Rotary, Stack } from 'dial-react';

export default function RotaryInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md" align="center">
        <p className="flush" role="status">Heating · 21 °C</p>
        <Rotary unitSide={300} label="Set temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} />
      </Stack>
    </div>
  );
}
