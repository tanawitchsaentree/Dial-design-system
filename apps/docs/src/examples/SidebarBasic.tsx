// @example Rooms and house settings in one column, the page you are on marked with an ink bar
import { Sidebar, SidebarGroup, SidebarItem } from 'dial-react';

export default function SidebarBasic() {
  return (
    <Sidebar label="Main">
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
