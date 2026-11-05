// @example canAdvance holds the person on a step until its field is filled, and the status line says why
import { useState } from 'react';
import { Input, Wizard, WizardStep } from 'dial-react';

export default function WizardValidated() {
  const [name, setName] = useState('');
  return (
    <Wizard canAdvance={(index) => index !== 0 || name.trim().length > 0}>
      <WizardStep title="General">
        <Input label="Room name" value={name} onChange={(e) => setName(e.target.value)} />
      </WizardStep>
      <WizardStep title="Review">{name ? `The room will be called ${name}.` : 'No name yet.'}</WizardStep>
    </Wizard>
  );
}
