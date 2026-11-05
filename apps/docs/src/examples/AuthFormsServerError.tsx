// @example Your check says no: return the problem from onSubmit and it joins the summary; only the password mika2026 passes
import { Card, SignInForm } from 'dial-react';

export default function AuthFormsServerError() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card padding="lg">
        <SignInForm
          defaultEmail="mika@example.com"
          onSubmit={async ({ password }) => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (password !== 'mika2026') return { password: 'That password does not match this email.' };
          }}
        />
      </Card>
    </div>
  );
}
