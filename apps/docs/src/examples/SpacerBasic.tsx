// @example Empty room of a token size between two stacked parts
import { Spacer, Text } from 'dial-react';

export default function SpacerBasic() {
  return (
    <div>
      <Text>Heating</Text>
      <Spacer size="lg" />
      <Text>Lighting</Text>
    </div>
  );
}
