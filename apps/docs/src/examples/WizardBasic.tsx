// @example Three steps on the Stepper rail: only the open step shows its fields, Back and Next move one place
import { Input, Select, Wizard, WizardStep } from 'dial-react';

export default function WizardBasic() {
  return (
    <Wizard>
      <WizardStep title="General">
        <Input label="Room name" defaultValue="Living room" />
      </WizardStep>
      <WizardStep title="Configuration">
        <Select label="Who can see it" options={[{ value: 'home', label: 'Everyone at home' }, { value: 'me', label: 'Only me' }]} defaultValue="home" />
      </WizardStep>
      <WizardStep title="Review">Check the summary, then finish.</WizardStep>
    </Wizard>
  );
}
