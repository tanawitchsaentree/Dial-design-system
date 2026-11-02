// @example buffered draws the loaded stretch as a thin ink line along the groove floor
import { Scrubber } from 'dial-react';

export default function ScrubberBuffered() {
  return <Scrubber label="Evening news" duration={1260} defaultValue={240} buffered={610} />;
}
