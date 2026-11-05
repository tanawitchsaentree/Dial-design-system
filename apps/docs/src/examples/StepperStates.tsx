// @example status is upcoming, current or done; done prints a check in the window
import { Step, Stepper } from 'dial-react';

export default function StepperStates() {
  return (
    <Stepper>
      <Step title="Done" status="done" />
      <Step title="Current" status="current" />
      <Step title="Upcoming" />
    </Stepper>
  );
}
