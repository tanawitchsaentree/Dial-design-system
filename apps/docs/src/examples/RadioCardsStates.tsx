// @example One plate disabled, and a whole group disabled beside it
import { RadioCard, RadioCards, Stack } from 'dial-react';

export default function RadioCardsStates() {
  return (
    <Stack gap="lg">
      <RadioCards label="Dryer cycle" defaultValue="timed">
        <RadioCard value="timed" title="Timed" description="Runs for a set time." />
        <RadioCard value="sensor" title="Sensor" description="Stops when the load is dry." disabled />
      </RadioCards>
      <RadioCards label="Locked group" defaultValue="a" disabled>
        <RadioCard value="a" title="Option one" description="Chosen, but locked." />
        <RadioCard value="b" title="Option two" description="Waiting, and locked." />
      </RadioCards>
    </Stack>
  );
}
