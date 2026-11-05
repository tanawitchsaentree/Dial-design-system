// @example asChild hands the link styles to your own child, such as the link of a router
import type { ReactNode } from 'react';
import { NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink } from 'dial-react';

// stands in for a router link: any element that takes className, ref and the usual link props
const RouterLink = ({ to, children, ...rest }: { to: string; children?: ReactNode; className?: string }) => (
  <a href={`#${to}`} {...rest}>{children}</a>
);

export default function NavigationMenuRouter() {
  return (
    <div style={{ minBlockSize: 'var(--ds-space-24)' }}>
      <NavigationMenu label="Main">
        <NavigationMenuLink asChild current><RouterLink to="/">Home</RouterLink></NavigationMenuLink>
        <NavigationMenuItem label="Rooms">
          <NavigationMenuGroup title="Upstairs">
            <NavigationMenuLink asChild><RouterLink to="/bedroom">Bedroom</RouterLink></NavigationMenuLink>
            <NavigationMenuLink asChild><RouterLink to="/bathroom">Bathroom</RouterLink></NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
        <NavigationMenuLink asChild><RouterLink to="/help">Help</RouterLink></NavigationMenuLink>
      </NavigationMenu>
    </div>
  );
}
