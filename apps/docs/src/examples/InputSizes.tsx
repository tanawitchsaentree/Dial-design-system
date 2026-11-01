// @example size is md (a 44px well, the default) or lg (a 52px well with larger text)
import { Input, Stack } from 'dial-react';

export default function InputSizes() {
  return (
    <Stack gap="lg">
      <Input label="Room name" defaultValue="Kitchen" />
      <Input label="Room name" size="lg" defaultValue="Kitchen" />
    </Stack>
  );
}
