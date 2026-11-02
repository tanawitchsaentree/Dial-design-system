// @example The reading lands in the space the ghost window held, so nothing around it moves
import { useState } from 'react';
import { Button, Display, Skeleton, Stack } from 'dial-react';

export default function SkeletonSwap() {
  const [ready, setReady] = useState(false);
  return (
    <Stack gap="md" align="start">
      <div aria-busy={!ready} aria-live="polite">
        {ready ? <Display label="Kettle" value="96" unit="°C" digits={3} /> : <Skeleton kind="display" digits={3} unit="°C" />}
      </div>
      <Button onClick={() => setReady((r) => !r)}>{ready ? 'Show loading' : 'Show reading'}</Button>
    </Stack>
  );
}
