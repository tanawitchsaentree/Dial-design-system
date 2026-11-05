// @example The last step swaps Next for Finish, the one orange key, and onFinish receives the choice
import { useState } from 'react';
import { Stack, Switch, Text, Wizard, WizardStep } from 'dial-react';

export default function WizardFinish() {
  const [saved, setSaved] = useState(false);
  const [night, setNight] = useState(true);
  return (
    <Stack gap="lg">
      <Wizard onFinish={() => setSaved(true)}>
        <WizardStep title="Schedule">
          <Switch label="Lower the heat at night" checked={night} onCheckedChange={setNight} />
        </WizardStep>
        <WizardStep title="Review">{night ? 'Night mode is on.' : 'Night mode is off.'}</WizardStep>
      </Wizard>
      <Text>{saved ? 'Saved.' : 'Not saved yet.'}</Text>
    </Stack>
  );
}
