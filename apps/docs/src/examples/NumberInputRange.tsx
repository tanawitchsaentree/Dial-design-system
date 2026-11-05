// @example A range with a step and a page step: arrows move one step, Page keys ten, Home and End reach the limits, and typed text clamps on blur
import { NumberInput } from 'dial-react';

export default function NumberInputRange() {
  return (
    <NumberInput
      label="Washer spin speed"
      unit="rpm"
      min={400}
      max={1600}
      step={100}
      pageStep={400}
      defaultValue={1000}
      hint="400 to 1600. Type a number and leave the field to snap it into range."
    />
  );
}
