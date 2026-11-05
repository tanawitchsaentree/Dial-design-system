// @example The page owns the step through stepIndex and onStepChange and prints it beside the keys
import { useState } from 'react';
import { Button, Onboarding, Stack, Text } from 'dial-react';

export default function OnboardingControlled() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <Stack gap="md">
      <Stack direction="row" gap="md" align="center">
        <Button id="ob-ctl-a">Wash</Button>
        <Button id="ob-ctl-b">Rinse</Button>
        <Button id="ob-ctl-c">Spin</Button>
      </Stack>
      <Stack direction="row" gap="md" align="center">
        <Button onClick={() => { setIndex(1); setOpen(true); }}>Explain Rinse</Button>
        <Text tone="secondary" aria-live="polite">{open ? `On step ${index + 1}` : 'Tour closed'}</Text>
      </Stack>
      <Onboarding
        open={open}
        onOpenChange={setOpen}
        stepIndex={index}
        onStepChange={setIndex}
        steps={[
          { target: 'ob-ctl-a', title: 'Wash', text: 'Starts the main wash.' },
          { target: 'ob-ctl-b', title: 'Rinse', text: 'Adds a second rinse for sensitive skin.' },
          { target: 'ob-ctl-c', title: 'Spin', text: 'Sets the spin speed from 400 to 1400.' },
        ]}
      />
    </Stack>
  );
}
