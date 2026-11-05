// @example position viewport fixes the key to the window; this frame stands in for a phone screen
import { FAB, Stack } from 'dial-react';

export default function FABPositions() {
  return (
    <div className="demo-box demo-card" style={{ position: 'relative', overflow: 'hidden', transform: 'translate(0)', minBlockSize: 'calc(var(--ds-control-lg) * 4)' }}>
      <Stack gap="sm">
        <p className="flush">Whole-screen unit</p>
        <p className="flush">The key stays at the corner of the window.</p>
      </Stack>
      <FAB label="Add device" position="viewport" />
    </div>
  );
}
