// @example In a unit, the badge is printed on the line under the display, beside the model name
import { Badge, Display, Stack } from 'dial-react';

export default function BadgeInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display label="Washer" value="0:38" digits={4} />
        <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>
          <Badge tone="warning">Door open</Badge>
          <span>washer 2</span>
        </Stack>
      </Stack>
    </div>
  );
}
