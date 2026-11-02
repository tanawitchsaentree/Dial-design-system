// @example A toggle key with aria-pressed latches down as frosted grey glass; press it again to release it
import { useState } from 'react';
import { Button, Stack } from 'dial-react';

export default function ButtonLatched() {
  const [night, setNight] = useState(true);
  const [away, setAway] = useState(false);
  return (
    <Stack direction="row" gap="sm">
      <Button aria-pressed={night} onClick={() => setNight((v) => !v)}>Night mode</Button>
      <Button aria-pressed={away} onClick={() => setAway((v) => !v)}>Away</Button>
    </Stack>
  );
}
