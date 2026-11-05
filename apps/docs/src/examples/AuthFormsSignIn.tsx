// @example The sign-in form in a card, with remember-me and the two links; the values go to onSubmit
import { Card, SignInForm } from 'dial-react';

export default function AuthFormsSignIn() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card padding="lg">
        <SignInForm
          remember
          forgotHref="#reset"
          alternateHref="#sign-up"
          onSubmit={(values) => console.log(values)}
        />
      </Card>
    </div>
  );
}
