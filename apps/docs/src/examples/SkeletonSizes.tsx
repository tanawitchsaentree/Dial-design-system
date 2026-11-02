// @example size follows the part it stands for, such as caption, body or title text and 24, 40 or 56px digits
import { Skeleton, Stack } from 'dial-react';

export default function SkeletonSizes() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Stack gap="lg">
        <Skeleton size="sm" extent={200} />
        <Skeleton size="md" extent={200} />
        <Skeleton size="lg" extent={200} />
        <Stack direction="row" gap="md" align="end">
          <Skeleton kind="display" size="sm" digits={4} />
          <Skeleton kind="display" size="md" digits={4} />
          <Skeleton kind="display" size="lg" digits={4} />
        </Stack>
      </Stack>
    </div>
  );
}
