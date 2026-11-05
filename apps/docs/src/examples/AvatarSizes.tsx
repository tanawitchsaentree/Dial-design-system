// @example Initials at each size, from a list row to a sheet header
import { Avatar, Stack } from 'dial-react';

export default function AvatarSizes() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Avatar size="sm" name="Maren Solberg" label="Maren Solberg" />
      <Avatar size="md" name="Maren Solberg" label="Maren Solberg" />
      <Avatar size="lg" name="Maren Solberg" label="Maren Solberg" />
    </Stack>
  );
}
