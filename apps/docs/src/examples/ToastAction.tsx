// @example One plastic action key, Try again, after a failure
import { Toast } from 'dial-react';

export default function ToastAction() {
  return (
    <Toast tone="critical" action={{ label: 'Try again', onAction: () => {} }} onClose={() => {}}>
      Washer didn’t answer
    </Toast>
  );
}
