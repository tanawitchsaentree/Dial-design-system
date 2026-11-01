// @example A controlled bank, where the unit's display says which mode is latched
import { useState } from 'react';
import { SegmentedControl, Stack } from 'dial-react';

const MODES = [
  { value: 'heat', label: 'Heat' },
  { value: 'eco', label: 'Eco' },
  { value: 'frost', label: 'Frost' },
];

export default function SegmentedControlControlled() {
  const [mode, setMode] = useState('eco');
  return (
    <Stack gap="sm" align="start">
      <p className="flush" aria-live="polite">Heater mode · {MODES.find((m) => m.value === mode)?.label}</p>
      <SegmentedControl label="Mode" options={MODES} value={mode} onValueChange={setMode} />
    </Stack>
  );
}
