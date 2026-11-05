// @example Two printed groups on one unit: each word sits on its seam and the fields stand under it
import { Divider, Input, Stack, Switch } from 'dial-react';

export default function DividerGroups() {
  return (
    <Stack gap="lg">
      <Divider label="room" />
      <Input label="Room name" defaultValue="Living room" />
      <Divider label="night" />
      <Switch label="Lower the heater after 23:00" />
    </Stack>
  );
}
