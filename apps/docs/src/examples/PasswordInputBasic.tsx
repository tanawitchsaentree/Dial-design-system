// @example A sign-in password in a recessed well with a round key that latches down to show the characters, and the word for the state printed in the well
import { PasswordInput } from 'dial-react';

export default function PasswordInputBasic() {
  return <PasswordInput label="Password" autoComplete="current-password" placeholder="At least 12 characters" />;
}
