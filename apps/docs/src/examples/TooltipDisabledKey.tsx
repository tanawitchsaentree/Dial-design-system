// @example A key that cannot be pressed is wrapped in a span, so the tag can still say why
import { Button, Tooltip } from 'dial-react';

export default function TooltipDisabledKey() {
  return (
    <Tooltip content="Turn the heating on first">
      <span tabIndex={0} style={{ display: 'inline-flex' }}>
        <Button disabled>Set schedule</Button>
      </span>
    </Tooltip>
  );
}
