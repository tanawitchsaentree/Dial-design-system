// @example In a unit: option chips under the display, the one orange key after them
import { useState } from 'react';
import { Button, Chip, Display, Stack } from 'dial-react';

const OPTIONS = ['Pre-wash', 'Extra rinse', 'Quiet'];

export default function ChipInUnit() {
  const [on, setOn] = useState<string[]>(['Quiet']);
  const flip = (k: string, sel: boolean) => setOn((xs) => (sel ? [...xs, k] : xs.filter((x) => x !== k)));
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display label="Washer" value={on.includes('Pre-wash') ? '1:52' : '1:34'} digits={4} />
        <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
          {OPTIONS.map((k) => (
            <Chip key={k} size="sm" selected={on.includes(k)} onSelectedChange={(s) => flip(k, s)}>{k}</Chip>
          ))}
        </Stack>
        <Button kind="primary">Start wash</Button>
      </Stack>
    </div>
  );
}
