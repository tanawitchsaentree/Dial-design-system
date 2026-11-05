// @example The host checks the code and sets status; 123456 is the good code, any other is rejected
import { useState } from 'react';
import { OTPFlow, type OTPFlowStatus } from 'dial-react';

export default function OTPFlowChecked() {
  const [status, setStatus] = useState<OTPFlowStatus>('idle');
  return (
    <OTPFlow
      destination="mika@example.com"
      status={status}
      onValueChange={() => setStatus((s) => (s === 'error' ? 'idle' : s))}
      onVerify={(code) => {
        setStatus('verifying');
        setTimeout(() => setStatus(code === '123456' ? 'success' : 'error'), 900);
      }}
    />
  );
}
