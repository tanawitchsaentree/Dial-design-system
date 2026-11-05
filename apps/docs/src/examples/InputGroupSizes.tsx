// @example size is md (a 44px well, the default) or lg (a 52px well with larger text and a 52px key)
import { Icon, IconButton, InputGroup, Stack } from 'dial-react';

export default function InputGroupSizes() {
  return (
    <Stack gap="lg">
      <InputGroup label="Target" end="°C" defaultValue="21.5" />
      <InputGroup
        label="Target"
        size="lg"
        defaultValue="21.5"
        end={
          <IconButton label="Clear" size="lg">
            <Icon name="close" />
          </IconButton>
        }
      />
    </Stack>
  );
}
