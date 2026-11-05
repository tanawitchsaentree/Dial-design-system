// @example Centred from top to bottom only: the part keeps the start edge and sits at mid height
import { Center, Text } from 'dial-react';

export default function CenterBlock() {
  return (
    <div className="demo-box demo-full" style={{ blockSize: 'var(--ds-space-24)' }}>
      <Center axis="block">
        <Text>Night schedule</Text>
      </Center>
    </div>
  );
}
