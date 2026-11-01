// @example In a unit, the display says the state and the groove how far it has run
import { Button, Display, Progress, Stack } from 'dial-react';

export default function ProgressInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display label="Washer" value="0:38" digits={4} />
        <Progress label="Cotton 40°" value={55} valueText="38 min left" />
        <Button kind="primary">Pause</Button>
      </Stack>
    </div>
  );
}
