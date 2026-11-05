// @example A new password on a sign-up form with new-password for the password manager, a hint, and a strength line you compute yourself
import { useState } from 'react';
import { PasswordInput } from 'dial-react';

// a stand-in rule for the demo: length only. Use a real estimator in your product.
const rate = (v: string): 'weak' | 'fair' | 'strong' | null => (v === '' ? null : v.length < 8 ? 'weak' : v.length < 12 ? 'fair' : 'strong');

export default function PasswordInputSignUp() {
  const [value, setValue] = useState('');
  return (
    <PasswordInput
      label="New password"
      autoComplete="new-password"
      hint="Use 12 characters or more."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      strength={rate(value)}
    />
  );
}
