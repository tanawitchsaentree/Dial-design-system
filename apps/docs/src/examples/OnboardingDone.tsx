// @example onDone saves that the tour was seen, with the reason it ended printed beside the key
import { useState } from 'react';
import { Button, Onboarding, Stack, Text } from 'dial-react';

export default function OnboardingDone() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);
  return (
    <Stack gap="md">
      <Stack direction="row" gap="md" align="center">
        <Button id="ob-done-timer">Timer</Button>
        <Button id="ob-done-mode">Mode</Button>
      </Stack>
      <Stack direction="row" gap="md" align="center">
        <Button onClick={() => setOpen(true)}>Take the tour</Button>
        <Text tone="secondary" aria-live="polite">{seen ? `Saved: the tour ${seen}.` : 'Not seen yet.'}</Text>
      </Stack>
      <Onboarding
        open={open}
        onOpenChange={setOpen}
        onDone={({ reason }) => setSeen(reason === 'finish' ? 'was finished' : reason === 'skip' ? 'was skipped' : 'was closed with Escape')}
        steps={[
          { target: 'ob-done-timer', title: 'Timer', text: 'Sets how long the program runs.' },
          { target: 'ob-done-mode', title: 'Mode', text: 'Picks eco, normal or fast.' },
        ]}
      />
    </Stack>
  );
}
