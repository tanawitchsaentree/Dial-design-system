// @example The two sizes, md with a 44px key and lg with a 52px key and larger text
import { PasswordInput, Stack } from 'dial-react';

export default function PasswordInputSizes() {
  return (
    <Stack gap="lg">
      <PasswordInput label="Password" size="md" defaultValue="correct horse" />
      <PasswordInput label="Password" size="lg" defaultValue="correct horse" defaultShown />
    </Stack>
  );
}
