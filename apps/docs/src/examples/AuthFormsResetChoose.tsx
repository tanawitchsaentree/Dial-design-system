// @example The page the reset link opens: choose a new password and repeat it
import { Card, ResetPasswordForm } from 'dial-react';

export default function AuthFormsResetChoose() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card padding="lg">
        <ResetPasswordForm mode="choose" minLength={10} onSubmit={(values) => console.log(values)} />
      </Card>
    </div>
  );
}
