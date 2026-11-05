// @example The four justify values, each on its own line
import { Flex } from 'dial-react';

export default function FlexJustify() {
  return (
    <div className="demo-box demo-card">
      {(['start', 'center', 'end', 'between'] as const).map((j) => (
        <Flex key={j} justify={j} gap="sm" align="center">
          <span className="gap-box" />
          <span className="gap-box" />
          <code>{j}</code>
        </Flex>
      ))}
    </div>
  );
}
