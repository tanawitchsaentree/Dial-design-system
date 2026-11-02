// @example The owner holds the state and prints its own key, so the mode can open from a menu or a help link
import { useState } from 'react';
import { Button, Card, Display, Explain, ExplainMode, Stack, Switch } from 'dial-react';

export default function ExplainModeControlled() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="xl" align="start">
      <Button aria-pressed={open} onClick={() => setOpen(!open)}>{open ? 'Hide the names' : 'Name the parts'}</Button>
      <ExplainMode open={open} onOpenChange={setOpen} toggle={false}>
        <Card padding="unit" wordmark="dial" model="lamp 1">
          <Explain name="Window" does="Shows how bright the lamp is.">
            <Display label="Lamp" value="70" unit="%" detail="Warm white" digits={3} />
          </Explain>
          <Stack direction="row" gap="xl">
            <Explain name="Power" does="Turns the lamp on and off.">
              <Switch label="Lamp" defaultChecked />
            </Explain>
          </Stack>
        </Card>
      </ExplainMode>
    </Stack>
  );
}
