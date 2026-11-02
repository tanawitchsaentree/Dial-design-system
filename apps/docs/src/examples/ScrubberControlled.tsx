// @example Controlled by a player. The play key is the unit's one orange part and the scrubber stays plastic
import { useEffect, useState } from 'react';
import { Button, Scrubber, Stack } from 'dial-react';

const LENGTH = 225;

export default function ScrubberControlled() {
  const [time, setTime] = useState(83);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => (t >= LENGTH ? LENGTH : t + 1)), 1000);
    return () => clearInterval(id);
  }, [playing]);
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Scrubber label="Ruhe, side A" duration={LENGTH} value={time} onValueChange={setTime} buffered={160} />
        <Button kind="primary" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</Button>
      </Stack>
    </div>
  );
}
