// @example A row of names where Rooms and Devices open a plastic panel of grouped links
import { NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink } from 'dial-react';

export default function NavigationMenuBasic() {
  return (
    <div style={{ minBlockSize: 'var(--ds-space-24)' }}>
      <NavigationMenu label="Main">
        <NavigationMenuLink href="#home" current>Home</NavigationMenuLink>
        <NavigationMenuItem label="Rooms">
          <NavigationMenuGroup title="Upstairs">
            <NavigationMenuLink href="#bedroom">Bedroom</NavigationMenuLink>
            <NavigationMenuLink href="#bathroom">Bathroom</NavigationMenuLink>
          </NavigationMenuGroup>
          <NavigationMenuGroup title="Downstairs">
            <NavigationMenuLink href="#kitchen">Kitchen</NavigationMenuLink>
            <NavigationMenuLink href="#living">Living room</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
        <NavigationMenuItem label="Devices">
          <NavigationMenuGroup title="Lights">
            <NavigationMenuLink href="#lamps">Lamps</NavigationMenuLink>
            <NavigationMenuLink href="#dimmers">Dimmers</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
        <NavigationMenuLink href="#help">Help</NavigationMenuLink>
      </NavigationMenu>
    </div>
  );
}
