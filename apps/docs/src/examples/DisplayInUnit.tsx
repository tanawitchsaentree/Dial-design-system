// @example The window at the top of a unit; the keys below change the reading at once
import { useState } from 'react';
import { Button, Display, Stack } from 'dial-react';

export default function DisplayInUnit() {
  const [t, setT] = useState(21.5);
  const step = (d: number) => setT((x) => Math.min(30, Math.max(5, Math.round((x + d) * 2) / 2)));
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display label="Thermostat" value={t.toFixed(1)} unit="°C" detail="Target" digits={3} />
        <Stack direction="row" gap="sm">
          <Button onClick={() => step(-0.5)}>Cooler</Button>
          <Button onClick={() => step(0.5)}>Warmer</Button>
        </Stack>
      </Stack>
    </div>
  );
}
