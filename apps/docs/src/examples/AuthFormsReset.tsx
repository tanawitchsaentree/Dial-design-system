// @example Ask for the email, then set sent once the link has gone out; the fields give way to a confirmation
import { useState } from 'react';
import { Card, ResetPasswordForm } from 'dial-react';

export default function AuthFormsReset() {
  const [sent, setSent] = useState(false);
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card padding="lg">
        <ResetPasswordForm backHref="#sign-in" sent={sent} onSubmit={() => setSent(true)} />
      </Card>
    </div>
  );
}
