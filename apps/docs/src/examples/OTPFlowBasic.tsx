// @example The whole code step: a window with the destination and a countdown, six digits, and a send-again key
import { OTPFlow } from 'dial-react';

export default function OTPFlowBasic() {
  return <OTPFlow destination="+66 81 234 5678" onVerify={(code) => console.log(code)} />;
}
