// @example Controlled by your own state, with the code repeated in a Display and onComplete called on the last digit
import { useState } from 'react';
import { Display, PinInput, Stack } from 'dial-react';

export default function PinInputControlled() {
  const [code, setCode] = useState('');
  const [sent, setSent] = useState('none');
  return (
    <Stack gap="lg">
      <PinInput label="Verification code" value={code} onValueChange={setCode} onComplete={(c) => setSent(c)} />
      <Display label="Sent for checking" value={sent} />
    </Stack>
  );
}
