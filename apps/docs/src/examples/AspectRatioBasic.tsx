// @example A camera view held at sixteen to nine
import { AspectRatio, Display } from 'dial-react';

export default function AspectRatioBasic() {
  return (
    <div className="demo-box demo-card">
      <AspectRatio ratio="16/9">
        <Display kind="oled" label="Doorbell camera" value="Front door" detail="Live" />
      </AspectRatio>
    </div>
  );
}
