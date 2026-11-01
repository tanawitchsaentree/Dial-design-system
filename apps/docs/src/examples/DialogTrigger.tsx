// @example Uncontrolled, so the trigger opens the sheet and takes focus back when it closes
import { Button, Dialog } from 'dial-react';

export default function DialogTrigger() {
  return (
    <Dialog
      trigger={<Button>Stop the wash</Button>}
      title="Stop the wash?"
      description="38 min left. The drum drains before the door unlocks."
      actions={<><Button>Keep washing</Button><Button kind="primary">Stop</Button></>}
    />
  );
}
