// @example Driven by the device: each report moves the fill in one step
import { useState } from 'react';
import { Button, Progress, Stack } from 'dial-react';

export default function ProgressControlled() {
  const [mb, setMb] = useState(12);
  return (
    <Stack gap="md" style={{ maxInlineSize: 320 }}>
      <Progress label="Firmware update" value={mb} max={48} valueText={`${mb} of 48 MB`} />
      <Stack direction="row" gap="sm">
        <Button onClick={() => setMb((x) => Math.min(48, x + 6))}>Next report</Button>
        <Button onClick={() => setMb(0)}>Restart</Button>
      </Stack>
    </Stack>
  );
}
