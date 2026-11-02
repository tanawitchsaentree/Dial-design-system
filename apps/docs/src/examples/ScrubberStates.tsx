// @example Before anything is loaded the scrubber is disabled, and the cap loses its height
import { Scrubber } from 'dial-react';

export default function ScrubberStates() {
  return <Scrubber label="Nothing playing" duration={0} disabled />;
}
