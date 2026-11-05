// @example A round info key that opens a small plastic panel with a title and a few lines
import { Popover, Text } from 'dial-react';

export default function PopoverBasic() {
  return (
    <Popover label="About the water filter" title="Water filter">
      <Text tone="secondary">Change it every three months. The lamp turns on when 10 days are left.</Text>
    </Popover>
  );
}
