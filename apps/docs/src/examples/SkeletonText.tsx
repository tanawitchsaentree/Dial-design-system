// @example lines sets how many text lines to hold, lastLine how short the last one is
import { Skeleton, Stack } from 'dial-react';

export default function SkeletonText() {
  return (
    <div aria-busy="true" aria-label="Description, loading" style={{ maxInlineSize: 320 }}>
      <Stack gap="lg">
        <Skeleton size="lg" extent="60%" />
        <Skeleton lines={3} lastLine={0.4} />
      </Stack>
    </div>
  );
}
