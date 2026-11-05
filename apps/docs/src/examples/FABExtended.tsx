// @example With room to spare, the key prints its word and stretches into a capsule
import { FAB, Stack } from 'dial-react';

export default function FABExtended() {
  return (
    <div className="demo-box demo-card" style={{ position: 'relative', minBlockSize: 'calc(var(--ds-control-lg) * 4)' }}>
      <Stack gap="sm">
        <p className="flush">Living room · 21.5 degrees</p>
        <p className="flush">Kitchen · 19 degrees</p>
      </Stack>
      <FAB label="Add room" extended />
    </div>
  );
}
