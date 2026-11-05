// @example The three strength words under the row, weak, fair and strong, each told by a word and not by colour
import { PasswordInput, Stack } from 'dial-react';

export default function PasswordInputStrength() {
  return (
    <Stack gap="lg">
      <PasswordInput label="Weak" autoComplete="new-password" defaultValue="abc123" strength="weak" />
      <PasswordInput label="Fair" autoComplete="new-password" defaultValue="abc123xyz" strength="fair" />
      <PasswordInput label="Strong" autoComplete="new-password" defaultValue="abc123xyz-garden" strength="strong" />
    </Stack>
  );
}
