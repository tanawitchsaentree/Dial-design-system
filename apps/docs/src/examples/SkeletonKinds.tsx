// @example kind is text, display, grille, disc or block, each the unlit form of the part it stands for
import { Skeleton, Stack } from 'dial-react';

export default function SkeletonKinds() {
  return (
    <div role="group" aria-busy="true" aria-label="Loading">
      <Stack gap="lg">
        <Skeleton kind="text" lines={2} extent={240} />
        <Skeleton kind="display" digits={4} />
        <Skeleton kind="grille" cols={8} rows={2} />
        <Stack direction="row" gap="md" align="center">
          <Skeleton kind="disc" size="sm" />
          <Skeleton kind="disc" size="md" />
        </Stack>
        <Skeleton kind="block" size="sm" />
      </Stack>
    </div>
  );
}
