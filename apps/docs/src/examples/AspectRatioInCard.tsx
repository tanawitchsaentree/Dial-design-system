// @example A square tile above its name, in a column of rooms
import { AspectRatio, Display, Stack } from 'dial-react';

export default function AspectRatioInCard() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="sm">
        <AspectRatio ratio="1/1" rounded><Display kind="oled" label="Living room" value="22.5" unit="°C" /></AspectRatio>
        <p className="flush">Living room</p>
      </Stack>
    </div>
  );
}
