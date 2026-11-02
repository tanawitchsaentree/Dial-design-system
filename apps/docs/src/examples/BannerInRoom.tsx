// @example At the top of the room it speaks for, above the units it affects
import { Banner, Slider, Stack, Switch } from 'dial-react';

export default function BannerInRoom() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="lg">
        <Banner tone="warning" status="Battery">The hall sensor battery is low. Motion lighting may stop next week.</Banner>
        <Switch label="Motion lighting" defaultChecked />
        <Slider label="Brightness" max={100} step={10} defaultValue={70} />
      </Stack>
    </div>
  );
}
