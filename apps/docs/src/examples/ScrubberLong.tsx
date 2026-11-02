// @example A film over an hour long prints hours, and Page Up moves thirty seconds
import { Scrubber } from 'dial-react';

export default function ScrubberLong() {
  return <Scrubber label="Metropolis" duration={8940} defaultValue={3725} buffered={4100} />;
}
