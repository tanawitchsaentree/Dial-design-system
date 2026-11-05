// @example Avatars at the start of list rows; the name is printed beside them, so the window stays silent
import { Avatar, List } from 'dial-react';

export default function AvatarInList() {
  return (
    <List label="People at home" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <List.Item leading={<Avatar name="ธนวิชญ์ แสนตรี" />} label="ธนวิชญ์ แสนตรี" description="Owner" />
      <List.Item leading={<Avatar name="Maren Solberg" />} label="Maren Solberg" description="Guest · until Friday" />
      <List.Item leading={<Avatar name="Jens Kitchen" />} label="Jens Kitchen" description="Member" />
    </List>
  );
}
