// @example A word key with a printed chevron that opens a panel holding a field and a key
import { useState } from 'react';
import { Button, Input, Popover, Stack } from 'dial-react';

export default function PopoverWord() {
  const [open, setOpen] = useState(false);
  return (
    <Popover label="Rename" trigger="word" title="Rename the lamp" open={open} onOpenChange={setOpen}>
      <Stack gap="md">
        <Input label="Name" defaultValue="Kitchen lamp" />
        <Button kind="primary" onClick={() => setOpen(false)}>Save</Button>
      </Stack>
    </Popover>
  );
}
