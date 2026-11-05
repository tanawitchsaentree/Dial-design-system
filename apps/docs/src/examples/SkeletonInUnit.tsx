// @example A washer card loading. The window and the groove hold their places, the start key waits as flat plastic
import { Skeleton, Stack } from 'dial-react';

export default function SkeletonInUnit() {
  return (
    <div className="demo-box demo-card" role="group" aria-busy="true" aria-label="Washer, loading">
      <Stack gap="md">
        <Skeleton kind="display" digits={4} detail />
        <Skeleton kind="block" extent={8} />
        <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>
          <Skeleton size="sm" extent={96} />
          <Skeleton kind="disc" size="sm" />
        </Stack>
      </Stack>
    </div>
  );
}
