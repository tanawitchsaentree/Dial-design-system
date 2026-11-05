// @example A Wi-Fi password in a settings card, shown while the person types it, with the unit's one orange key last
import { Button, Card, PasswordInput, Stack } from 'dial-react';

export default function PasswordInputInUnit() {
  return (
    <Card>
      <Stack gap="lg">
        <PasswordInput label="Wi-Fi password" autoComplete="new-password" defaultShown defaultValue="fernweh-2024" hint="Spaces are kept." />
        <Button kind="primary">Join network</Button>
      </Stack>
    </Card>
  );
}
