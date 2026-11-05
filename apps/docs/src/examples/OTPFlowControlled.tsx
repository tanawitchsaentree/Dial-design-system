// @example Four digits, controlled by your own state, with a smaller heading
import { useState } from 'react';
import { OTPFlow, Text } from 'dial-react';

export default function OTPFlowControlled() {
  const [code, setCode] = useState('');
  return (
    <>
      <OTPFlow title="Confirm your phone" level={4} length={4} destination="+66 81 234 5678" value={code} onValueChange={setCode} />
      <Text>Typed so far: {code || 'nothing'}</Text>
    </>
  );
}
