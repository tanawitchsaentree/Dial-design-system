// @example collapsed and onCollapsedChange keep the width in your state, here shown beside the column
import { useState } from 'react';
import { Sidebar, SidebarGroup, SidebarItem, SidebarToggle, Stack } from 'dial-react';

export default function SidebarControlled() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Stack gap="sm">
      <p className="flush">The column is {collapsed ? 'collapsed' : 'open'}.</p>
      <Sidebar label="Main" collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <SidebarGroup title="House">
          <SidebarItem href="#schedules" icon="schedule" current>Schedules</SidebarItem>
          <SidebarItem href="#settings" icon="settings">Settings</SidebarItem>
        </SidebarGroup>
        <SidebarToggle />
      </Sidebar>
    </Stack>
  );
}
