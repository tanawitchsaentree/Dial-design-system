// @example Every state: hidden, shown, invalid with a message, read-only and disabled
import { PasswordInput, Stack } from 'dial-react';

export default function PasswordInputStates() {
  return (
    <Stack gap="lg">
      <PasswordInput label="Hidden" defaultValue="correct horse" />
      <PasswordInput label="Shown" defaultValue="correct horse" defaultShown />
      <PasswordInput label="Invalid" defaultValue="abc" error="Too short. Use 12 characters or more." />
      <PasswordInput label="Read-only" defaultValue="correct horse" readOnly />
      <PasswordInput label="Disabled" defaultValue="correct horse" disabled />
    </Stack>
  );
}
