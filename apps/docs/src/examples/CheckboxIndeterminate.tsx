// @example Mixed: a dash on the parent key when only some lamps are on
import { useState } from 'react';
import { Checkbox, Stack } from 'dial-react';

const ROOMS = ['Kitchen', 'Hall', 'Bedroom'];

export default function CheckboxIndeterminate() {
  const [on, setOn] = useState<Record<string, boolean>>({ Kitchen: true, Hall: false, Bedroom: false });
  const count = ROOMS.filter((r) => on[r]).length;
  const setAll = (v: boolean) => setOn(Object.fromEntries(ROOMS.map((r) => [r, v])));
  return (
    <Stack gap="xs">
      <Checkbox label="All lamps" checked={count === ROOMS.length} indeterminate={count > 0 && count < ROOMS.length} onChange={(e) => setAll(e.target.checked)} />
      {ROOMS.map((r) => (
        <Checkbox key={r} label={`${r} lamp`} checked={on[r]} onChange={(e) => setOn({ ...on, [r]: e.target.checked })} />
      ))}
    </Stack>
  );
}
