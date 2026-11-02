// @example In a unit, the legend sits beside the one orange knob under the display, and the options carry their own values
import { useState } from 'react';
import { Legend, Stack } from 'dial-react';

const PROGRAMMES = [
  { value: 'eco', label: 'eco 40', minutes: 178 },
  { value: 'cotton', label: 'cotton 60', minutes: 135 },
  { value: 'mixed', label: 'mixed', minutes: 95 },
  { value: 'quick', label: 'quick 30', minutes: 30 },
  { value: 'wool', label: 'wool', minutes: 55 },
];

export default function LegendInUnit() {
  const [p, setP] = useState('cotton');
  const left = PROGRAMMES.find((x) => x.value === p)?.minutes ?? 0;
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush" role="status">{`${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} left`}</p>
        <Legend label="Washer" options={PROGRAMMES.map(({ value, label }) => ({ value, label }))} value={p} onValueChange={setP} />
      </Stack>
    </div>
  );
}
