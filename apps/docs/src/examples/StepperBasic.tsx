// @example A numbered list of sections, each digit in a recessed window joined by a dotted rail
import { Step, Stepper } from 'dial-react';

export default function StepperBasic() {
  return (
    <Stepper>
      <Step title="General" status="done">Owner, name and description.</Step>
      <Step title="Configuration" status="current">Visibility and defaults.</Step>
      <Step title="Review">Check the summary and create.</Step>
    </Stepper>
  );
}
