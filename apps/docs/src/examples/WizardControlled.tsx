// @example The open step held in your own state, so a link outside the Wizard can jump to a step
import { useState } from 'react';
import { Button, Stack, Wizard, WizardStep } from 'dial-react';

export default function WizardControlled() {
  const [current, setCurrent] = useState(0);
  return (
    <Stack gap="xl">
      <Wizard current={current} onCurrentChange={setCurrent}>
        <WizardStep title="Network">Pick the wifi the heater joins.</WizardStep>
        <WizardStep title="Schedule">Set the weekday hours.</WizardStep>
        <WizardStep title="Done">Everything is set.</WizardStep>
      </Wizard>
      <Button onClick={() => setCurrent(2)}>Skip to the last step</Button>
    </Stack>
  );
}
