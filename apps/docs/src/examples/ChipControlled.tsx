// @example Controlled filters, where the screen keeps the set and says what it shows
import { useState } from 'react';
import { Chip, Stack } from 'dial-react';

const KINDS = ['Lamps', 'Heating', 'Speakers', 'Washer'];

export default function ChipControlled() {
  const [on, setOn] = useState<string[]>(['Lamps']);
  const flip = (k: string, sel: boolean) => setOn((xs) => (sel ? [...xs, k] : xs.filter((x) => x !== k)));
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
        {KINDS.map((k) => (
          <Chip key={k} size="sm" selected={on.includes(k)} onSelectedChange={(s) => flip(k, s)}>{k}</Chip>
        ))}
      </Stack>
      <p className="flush" aria-live="polite">{on.length ? `Showing ${on.join(', ')}.` : 'Showing all devices.'}</p>
    </Stack>
  );
}
