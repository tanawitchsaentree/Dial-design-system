// @example Parts marked with a data-explain attribute holding the name and the line, split by a bar
import { Button, Card, Display, ExplainMode, Progress, Stack } from 'dial-react';

export default function ExplainModeAttribute() {
  return (
    <ExplainMode>
      <Card padding="unit" wordmark="dial" model="wash 1">
        <Stack gap="xl">
        <div data-explain="Window|Shows the minutes left and the programme.">
          <Display label="Washer" value="38" unit="min" detail="Cotton" digits={3} />
        </div>
        <div data-explain="Progress|Fills as the wash goes from soak to spin.">
          <Progress label="Wash progress" value={60} max={100} valueText="60 percent, rinsing next" />
        </div>
        <div data-explain="Start|Starts the wash, or pauses it.">
          <Button>Pause</Button>
        </div>
        </Stack>
      </Card>
    </ExplainMode>
  );
}
