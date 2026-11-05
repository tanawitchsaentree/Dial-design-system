// @example asChild hands the row styles to your own link, such as a router link
import { Sidebar, SidebarGroup, SidebarItem } from 'dial-react';

function RouterLink({ to, children, ...rest }: { to: string; children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={to} {...rest}>{children}</a>;
}

export default function SidebarRouterLinks() {
  return (
    <Sidebar label="Main">
      <SidebarGroup title="Rooms">
        <SidebarItem asChild icon="lamp" current><RouterLink to="#living">Living room</RouterLink></SidebarItem>
        <SidebarItem asChild icon="heat"><RouterLink to="#kitchen">Kitchen</RouterLink></SidebarItem>
      </SidebarGroup>
    </Sidebar>
  );
}
