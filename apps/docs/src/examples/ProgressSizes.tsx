// @example size is md (8px groove, the default) or sm (4px, for rows in a list)
import { Progress, Stack } from 'dial-react';

export default function ProgressSizes() {
  return (
    <Stack gap="lg" style={{ maxInlineSize: 'var(--ds-layout-frame-md)' }}>
      <Progress label="Firmware update" value={64} size="md" />
      <Progress label="Firmware update" value={64} size="sm" />
    </Stack>
  );
}
