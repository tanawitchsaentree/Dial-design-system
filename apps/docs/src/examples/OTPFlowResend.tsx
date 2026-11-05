// @example A short countdown of ten seconds, and a count of how many codes were asked for
import { useState } from 'react';
import { Display, OTPFlow, Stack } from 'dial-react';

export default function OTPFlowResend() {
  const [sent, setSent] = useState(1);
  return (
    <Stack gap="lg">
      <OTPFlow destination="+66 81 234 5678" resendIn={10} onResend={() => setSent((n) => n + 1)} />
      <Display label="Codes sent" value={String(sent)} />
    </Stack>
  );
}
