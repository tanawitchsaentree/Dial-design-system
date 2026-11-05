// @example A toggle key at the foot collapses the column to icons and expands it again
import { Sidebar, SidebarGroup, SidebarItem, SidebarToggle } from 'dial-react';

export default function SidebarToggleExample() {
  return (
    <Sidebar label="Main">
      <SidebarGroup title="Rooms">
        <SidebarItem href="#living" icon="lamp">Living room</SidebarItem>
        <SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem>
        <SidebarItem href="#bedroom" icon="room">Bedroom</SidebarItem>
      </SidebarGroup>
      <SidebarToggle />
    </Sidebar>
  );
}
