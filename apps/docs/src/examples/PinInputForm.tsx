// @example A code step in a sign-in form: the code travels under its name and the orange key comes last
import { Button, PinInput, Stack } from 'dial-react';

export default function PinInputForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="xl">
        <PinInput name="code" label="Verification code" hint="The code is valid for ten minutes." required />
        <Button kind="primary" type="submit">Confirm</Button>
      </Stack>
    </form>
  );
}
