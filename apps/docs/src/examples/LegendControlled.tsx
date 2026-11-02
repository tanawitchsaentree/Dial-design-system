// @example Controlled with value and onValueChange. The fan's window says what the fan is doing, and the legend says what it is set to
import { useState } from 'react';
import { Legend, Stack } from 'dial-react';

const SPEED: Record<string, string> = { off: 'Stopped', low: '600 rpm', mid: '900 rpm', high: '1200 rpm', auto: 'Auto · 24 °C' };

export default function LegendControlled() {
  const [fan, setFan] = useState('mid');
  return (
    <Stack gap="md" align="center">
      <p className="flush" role="status">{SPEED[fan]}</p>
      <Legend layout="arc" label="Fan" options={['off', 'low', 'mid', 'high', 'auto']} value={fan} onValueChange={setFan} />
    </Stack>
  );
}
