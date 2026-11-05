// @example A key at the end of the well, ruled off from the text, with its own name and the same focus ring
import { Icon, IconButton, InputGroup } from 'dial-react';

export default function InputGroupKey() {
  return (
    <InputGroup
      label="Find a device"
      placeholder="Kitchen speaker"
      end={
        <IconButton label="Search">
          <Icon name="search" />
        </IconButton>
      }
    />
  );
}
