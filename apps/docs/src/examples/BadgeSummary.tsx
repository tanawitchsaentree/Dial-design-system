// @example A summary line with counts of each state, every one a glyph and a word
import { Badge, Stack } from 'dial-react';

export default function BadgeSummary() {
  return (
    <Stack direction="row" gap="lg" style={{ flexWrap: 'wrap' }}>
      <Badge tone="positive" count={9}>online</Badge>
      <Badge tone="warning" count={1}>needs a filter</Badge>
      <Badge tone="critical" count={3}>offline</Badge>
    </Stack>
  );
}
