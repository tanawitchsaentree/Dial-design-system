// @example The sign-up form in a card: a name, an email and a new password typed twice
import { Card, SignUpForm } from 'dial-react';

export default function AuthFormsSignUp() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card padding="lg">
        <SignUpForm alternateHref="#sign-in" onSubmit={(values) => console.log(values)} />
      </Card>
    </div>
  );
}
