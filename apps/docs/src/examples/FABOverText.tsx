// @example Text runs under the seat and is hidden by it, so the key never sits on printing
import { FAB, Stack } from 'dial-react';

export default function FABOverText() {
  return (
    <div className="demo-box demo-card" style={{ position: 'relative', overflow: 'hidden', maxBlockSize: 'calc(var(--ds-control-lg) * 3)' }}>
      <Stack gap="sm">
        <p className="flush">Heating on until 22:40, then the night mode lowers it to 18 degrees in every room that has a sensor.</p>
        <p className="flush">Washer finished at 21:05. The door is unlocked and the drum is cooling down for the night.</p>
        <p className="flush">Hall lamp off. Front door locked at 22:10. Garden light on a timer until midnight.</p>
      </Stack>
      <FAB label="Add room" />
    </div>
  );
}
