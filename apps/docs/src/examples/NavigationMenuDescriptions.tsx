// @example Each link in the panel carries a short line under its words, and the current page is marked
import { NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink } from 'dial-react';

export default function NavigationMenuDescriptions() {
  return (
    <div style={{ minBlockSize: 'var(--ds-space-24)' }}>
      <NavigationMenu label="Settings">
        <NavigationMenuItem label="Heating">
          <NavigationMenuGroup title="Schedules">
            <NavigationMenuLink href="#week" current description="Set the week by day and hour.">Weekly plan</NavigationMenuLink>
            <NavigationMenuLink href="#away" description="Hold a low heat while you are out.">Away mode</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
        <NavigationMenuItem label="Household">
          <NavigationMenuGroup title="People">
            <NavigationMenuLink href="#members" description="Who can change the settings.">Members</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}
