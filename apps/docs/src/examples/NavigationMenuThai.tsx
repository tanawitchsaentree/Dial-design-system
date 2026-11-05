// @example Thai names and links keep their line height, and the panel grows to the longest link
import { NavigationMenu, NavigationMenuGroup, NavigationMenuItem, NavigationMenuLink } from 'dial-react';

export default function NavigationMenuThai() {
  return (
    <div style={{ minBlockSize: 'var(--ds-space-24)' }}>
      <NavigationMenu label="เมนูหลัก">
        <NavigationMenuLink href="#home" current>หน้าแรก</NavigationMenuLink>
        <NavigationMenuItem label="ห้อง">
          <NavigationMenuGroup title="ชั้นบน">
            <NavigationMenuLink href="#bedroom">ห้องนอนใหญ่</NavigationMenuLink>
            <NavigationMenuLink href="#bathroom">ห้องน้ำ</NavigationMenuLink>
          </NavigationMenuGroup>
          <NavigationMenuGroup title="ชั้นล่าง">
            <NavigationMenuLink href="#kitchen">ห้องครัว</NavigationMenuLink>
            <NavigationMenuLink href="#living">ห้องนั่งเล่น</NavigationMenuLink>
          </NavigationMenuGroup>
        </NavigationMenuItem>
        <NavigationMenuLink href="#help">ช่วยเหลือ</NavigationMenuLink>
      </NavigationMenu>
    </div>
  );
}
