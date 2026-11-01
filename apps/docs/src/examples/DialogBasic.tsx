// @example A sheet that asks one question, with Cancel and the one orange key
import { useState } from 'react';
import { Button, Dialog } from 'dial-react';

export default function DialogBasic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Turn off all lamps</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Turn off all lamps?"
        description="Six lamps in four rooms go dark. The schedule stays as it is."
        actions={<><Button>Cancel</Button><Button kind="primary">Turn off</Button></>}
      />
    </>
  );
}
