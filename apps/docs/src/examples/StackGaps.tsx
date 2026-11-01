// @example The five stack gaps
import { Stack } from 'dial-react';

export default function StackGaps() {
  return (
    <div className="demo-box demo-card">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
        <Stack key={g} direction="row" gap={g} align="center"><code className="gap-label">{g}</code><span className="gap-box" /><span className="gap-box" /><span className="gap-box" /></Stack>
      ))}
    </div>
  );
}
