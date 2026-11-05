// @example The media corner turned on, beside the same frame square
import { AspectRatio, Display, Stack } from 'dial-react';

export default function AspectRatioRounded() {
  return (
    <div className="demo-box demo-card">
      <Stack direction="row" gap="md" align="start">
        <div><AspectRatio ratio="3/2"><Display kind="oled" label="Square corners" value="Plain" /></AspectRatio></div>
        <div><AspectRatio ratio="3/2" rounded><Display kind="oled" label="Media corner" value="Rounded" /></AspectRatio></div>
      </Stack>
    </div>
  );
}
