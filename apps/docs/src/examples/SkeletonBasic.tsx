// @example A thermostat card while the house is still answering, with ghost segments, a flat disc for the knob and unlit holes
import { Skeleton, Stack } from 'dial-react';

export default function SkeletonBasic() {
  return (
    <div className="demo-box demo-card" aria-busy="true" aria-label="Thermostat, loading">
      <Stack gap="md">
        <Skeleton kind="display" digits={3} unit="°C" detail />
        <Stack direction="row" gap="lg" align="center">
          <Skeleton kind="disc" size="md" />
          <Skeleton kind="grille" cols={6} rows={3} />
        </Stack>
        <Skeleton lines={1} extent="40%" size="sm" />
      </Stack>
    </div>
  );
}
