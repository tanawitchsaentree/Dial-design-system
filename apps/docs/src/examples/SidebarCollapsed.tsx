// @example Collapsed from the start: icons only, with the index mark still on the current page
import { Sidebar, SidebarGroup, SidebarItem } from 'dial-react';

export default function SidebarCollapsed() {
  return (
    <Sidebar label="Main" defaultCollapsed>
      <SidebarGroup title="Rooms">
        <SidebarItem href="#living" icon="lamp">Living room</SidebarItem>
        <SidebarItem href="#kitchen" icon="heat" current>Kitchen</SidebarItem>
        <SidebarItem href="#bedroom" icon="room">Bedroom</SidebarItem>
      </SidebarGroup>
      <SidebarGroup title="House">
        <SidebarItem href="#schedules" icon="schedule">Schedules</SidebarItem>
        <SidebarItem href="#settings" icon="settings">Settings</SidebarItem>
      </SidebarGroup>
    </Sidebar>
  );
}
