// @example Thai names and long names wrap onto more lines; the switch at the end keeps its place
import { Icon, List, Switch } from 'dial-react';

const lamp = <Icon name="lamp" />;

export default function ListLongNames() {
  return (
    <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}>
      <List label="ห้องนั่งเล่น">
        <List.Item leading={lamp} label="โคมไฟห้องนั่งเล่นชั้นบนข้างหน้าต่างบานใหญ่" description="เปิด · ความสว่าง 40%" trailing={<Switch aria-label="โคมไฟห้องนั่งเล่นชั้นบน" defaultChecked />} />
        <List.Item leading={lamp} label="Reading lamp beside the long sofa under the stairs" description="Off · turns on at 18:30" trailing={<Switch aria-label="Reading lamp beside the long sofa" />} />
      </List>
    </div>
  );
}
