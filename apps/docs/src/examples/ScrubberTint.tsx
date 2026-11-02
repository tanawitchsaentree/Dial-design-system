// @example tint lights the played stretch behind the glass cap; a fireplace recording takes the warm range
import { Scrubber } from 'dial-react';

export default function ScrubberTint() {
  return <Scrubber label="Fireplace, one hour" tint="warm" duration={3600} defaultValue={1260} />;
}
