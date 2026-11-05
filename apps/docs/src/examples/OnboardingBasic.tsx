// @example A three-step tour of a panel: a full-ink ring marks each key in turn and the callout says what it does
import { useState } from 'react';
import { Button, Onboarding, Stack } from 'dial-react';

export default function OnboardingBasic() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center">
        <Button id="ob-basic-heat">Heating</Button>
        <Button id="ob-basic-lamp">Lamp</Button>
        <Button id="ob-basic-fan">Fan</Button>
      </Stack>
      <div>
        <Button onClick={() => setOpen(true)}>Take the tour</Button>
      </div>
      <Onboarding
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: 'ob-basic-heat', title: 'Heating', text: 'Turns the radiator on or off for this room.' },
          { target: 'ob-basic-lamp', title: 'Lamp', text: 'Dims the lamp. Hold the key to set a level.' },
          { target: 'ob-basic-fan', title: 'Fan', text: 'Runs the fan at the speed you picked last.' },
        ]}
      />
    </Stack>
  );
}
