// @example A thermostat with the mode already up, so every part shows its name and its line
import { Card, Display, Explain, ExplainMode, Rotary, Stack, Switch } from 'dial-react';

export default function ExplainModeOpen() {
  return (
    <ExplainMode defaultOpen>
      <Card padding="unit" wordmark="dial" model="thermostat 1">
        <Explain name="Window" does="Shows the room now and the heat it aims for.">
          <Display label="Lounge" value="20.5" unit="°C" detail="Heating to 22" digits={3} />
        </Explain>
        <Stack direction="row" gap="xl">
          <Explain name="Temperature" does="Sets the heat the room aims for.">
            <Rotary label="Temperature" min={16} max={26} defaultValue={22} formatValue={(v) => `${v} °C`} />
          </Explain>
          <Explain name="Away" does="Holds the room at 16 while nobody is home.">
            <Switch label="Away" />
          </Explain>
        </Stack>
      </Card>
    </ExplainMode>
  );
}
