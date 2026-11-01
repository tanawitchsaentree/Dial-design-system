// @example A grille beside the keys that change it; its name is printed under it
import { useState } from 'react';
import { Button, Grille, Stack } from 'dial-react';

export default function GrilleInUnit() {
  const [v, setV] = useState(4);
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Stack gap="xs">
          <Grille label="Volume" value={v} max={10} cols={12} rows={4} valueText={`Volume ${v} of 10`} />
          <span aria-hidden="true">Volume</span>
        </Stack>
        <Stack direction="row" gap="sm">
          <Button onClick={() => setV((x) => Math.max(0, x - 1))}>Quieter</Button>
          <Button onClick={() => setV((x) => Math.min(10, x + 1))}>Louder</Button>
        </Stack>
      </Stack>
    </div>
  );
}
