// @example The open panel is held in your own state, so a page can read it or close it from outside
import { useState } from 'react';
import { Button, NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink, Stack, Text } from 'dial-react';

export default function NavigationMenuControlled() {
  const [open, setOpen] = useState<string | null>('rooms');
  return (
    <Stack gap="lg">
      <NavigationMenu label="Main" value={open} onValueChange={setOpen}>
        <NavigationMenuItem label="Rooms" value="rooms">
          <NavigationMenuGroup title="Upstairs">
            <NavigationMenuLink href="#bedroom">Bedroom</NavigationMenuLink>
            <NavigationMenuLink href="#bathroom">Bathroom</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
        <NavigationMenuItem label="Devices" value="devices">
          <NavigationMenuGroup title="Lights">
            <NavigationMenuLink href="#lamps">Lamps</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
      </NavigationMenu>
      <div style={{ minBlockSize: 'var(--ds-space-16)' }}>
        <Text tone="secondary">{open ? `Open: ${open}` : 'Nothing is open'}</Text>
      </div>
      <Button onClick={() => setOpen(null)}>Close the panel</Button>
    </Stack>
  );
}
