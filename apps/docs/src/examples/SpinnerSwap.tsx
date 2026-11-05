// @example Mounted only while busy: the key starts the work, the Spinner stands in, then the reading replaces it
import { useEffect, useState } from 'react';
import { Button, Display, Spinner, Stack } from 'dial-react';

export default function SpinnerSwap() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => { setBusy(false); setDone(true); }, 2400);
    return () => clearTimeout(t);
  }, [busy]);
  return (
    <Stack gap="md">
      <div aria-live="polite">
        {busy ? <Spinner label="Asking the heating" showLabel /> : done ? <Display label="Heating" value="21.5" unit="°C" digits={4} /> : null}
      </div>
      <Button kind="primary" disabled={busy} onClick={() => { setDone(false); setBusy(true); }}>Read heating</Button>
    </Stack>
  );
}
