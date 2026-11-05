// @example Another glyph for another main action, here edit for a scene
import { FAB, Stack } from 'dial-react';

export default function FABIcons() {
  return (
    <div className="demo-box demo-card" style={{ position: 'relative', minBlockSize: 'calc(var(--ds-control-lg) * 4)' }}>
      <Stack gap="sm">
        <p className="flush">Scene · Evening</p>
        <p className="flush">Lamp 40%, heating 21 degrees</p>
      </Stack>
      <FAB label="Edit scene" icon="edit" />
    </div>
  );
}
