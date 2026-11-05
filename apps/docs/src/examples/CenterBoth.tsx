// @example One part centred on both axes inside a box of fixed height
import { Center, Text } from 'dial-react';

export default function CenterBoth() {
  return (
    <div className="demo-box demo-full" style={{ blockSize: 'var(--ds-space-24)' }}>
      <Center>
        <Text>No rooms yet</Text>
      </Center>
    </div>
  );
}
