// @example What the window shows with a broken picture, no name at all, custom letters and a Thai name
import { Avatar, Stack } from 'dial-react';

export default function AvatarStates() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Avatar src="/missing.png" name="Maren Solberg" label="Maren Solberg, picture missing" />
      <Avatar label="Unknown person" />
      <Avatar initials="FG" label="Front gate" />
      <Avatar name="เอกชัย ใจดี" label="เอกชัย ใจดี" />
    </Stack>
  );
}
