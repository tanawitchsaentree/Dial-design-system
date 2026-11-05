// @example Not started, part way and done, with the reading printed and announced
import { Progress, Stack } from 'dial-react';

export default function ProgressLevels() {
  return (
    <Stack gap="lg" style={{ maxInlineSize: 'var(--ds-layout-frame-md)' }}>
      <Progress label="Dishwasher" value={0} valueText="Not started" />
      <Progress label="Dishwasher" value={40} max={100} valueText="1 h 10 min left" />
      <Progress label="Dishwasher" value={100} valueText="Done" />
    </Stack>
  );
}
