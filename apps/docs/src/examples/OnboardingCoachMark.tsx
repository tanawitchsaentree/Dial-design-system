// @example One CoachMark on its own, placed above the key with placement="top", for a hint that is not part of a tour
import { useState } from 'react';
import { Button, CoachMark, Stack } from 'dial-react';

export default function OnboardingCoachMark() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="lg" align="start">
      <Button id="ob-single-save" onClick={() => setOpen(true)}>Save as preset</Button>
      <CoachMark
        target="ob-single-save"
        title="New: presets"
        open={open}
        placement="top"
        onNext={() => setOpen(false)}
        doneLabel="Got it"
        last
      >
        Keep this setting and call it back with one press.
      </CoachMark>
    </Stack>
  );
}
