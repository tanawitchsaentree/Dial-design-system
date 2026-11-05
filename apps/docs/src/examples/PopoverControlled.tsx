// @example A panel the page opens and closes itself, with the state printed beside the key
import { useState } from 'react';
import { Button, Popover, Stack, Text } from 'dial-react';

export default function PopoverControlled() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="row" align="center" gap="lg">
      <Popover label="About the schedule" title="Schedule" open={open} onOpenChange={setOpen}>
        <Text tone="secondary">Heating runs from 06:30 to 22:00 on weekdays.</Text>
      </Popover>
      <Button onClick={() => setOpen(true)}>Show schedule</Button>
      <Text tone="secondary" aria-live="polite">{open ? 'Panel open' : 'Panel closed'}</Text>
    </Stack>
  );
}
