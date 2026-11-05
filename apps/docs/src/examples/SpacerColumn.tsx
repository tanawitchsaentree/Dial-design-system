// @example A flexible spacer in a tall column keeps the orange key at the foot of the unit
import { Button, Spacer, Text } from 'dial-react';

export default function SpacerColumn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', blockSize: 'var(--ds-space-32)' }}>
      <Text>Heating</Text>
      <Spacer flexible />
      <Button kind="primary">Save</Button>
    </div>
  );
}
