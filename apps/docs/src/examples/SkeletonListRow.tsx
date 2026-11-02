// @example A list of devices that has not answered yet, with one flat key and two text lines per row
import { Skeleton, Stack } from 'dial-react';

export default function SkeletonListRow() {
  return (
    <div className="demo-box demo-card" aria-busy="true" aria-label="Devices, loading">
      <Stack gap="lg">
        {[0, 1, 2].map((i) => (
          <Stack key={i} direction="row" gap="md" align="center">
            <Skeleton kind="disc" size="sm" />
            <div style={{ flex: 1 }}>
              <Skeleton lines={2} lastLine={0.5} />
            </div>
          </Stack>
        ))}
      </Stack>
    </div>
  );
}
