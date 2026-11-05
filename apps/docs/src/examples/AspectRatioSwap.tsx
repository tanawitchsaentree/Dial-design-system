// @example The frame keeps its height while the content inside it changes
import { useState } from 'react';
import { AspectRatio, Button, Display, Stack } from 'dial-react';

export default function AspectRatioSwap() {
  const [on, setOn] = useState(false);
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <AspectRatio ratio="4/3" rounded>
          {on ? <Display kind="oled" label="Camera" value="Garage" detail="Live" /> : <Display kind="oled" label="Camera" value="Off" />}
        </AspectRatio>
        <Button kind="key" onClick={() => setOn(!on)}>{on ? 'Turn off' : 'Turn on'}</Button>
      </Stack>
    </div>
  );
}
