// @example error marks the field invalid and prints the problem under the well with a glyph
import { useState } from 'react';
import { Input } from 'dial-react';

export default function InputError() {
  const [code, setCode] = useState('1234');
  const error = code.length < 8 ? 'Use at least 8 characters.' : undefined;
  return (
    <Input
      label="Wi-Fi password"
      type="password"
      hint="The password of your home network."
      error={error}
      value={code}
      onChange={(e) => setCode(e.target.value)}
    />
  );
}
