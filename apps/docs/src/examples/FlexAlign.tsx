// @example Cross-axis alignment of parts of different heights
import { Flex } from 'dial-react';

export default function FlexAlign() {
  return (
    <div className="demo-box demo-card">
      {(['start', 'center', 'end', 'baseline'] as const).map((a) => (
        <Flex key={a} align={a} gap="md">
          <code>{a}</code>
          <span className="gap-box" />
          <span className="demo-chip">Label</span>
        </Flex>
      ))}
    </div>
  );
}
