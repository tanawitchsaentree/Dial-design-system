// @example Thai names and long names wrap onto more lines; the switch at the end keeps its place
import { List, Switch } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const lamp = <svg {...g}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" /></svg>;

export default function ListLongNames() {
  return (
    <div data-overflow-demo="" style={{ inlineSize: 300 }}>
      <List label="ห้องนั่งเล่น">
        <List.Item leading={lamp} label="โคมไฟห้องนั่งเล่นชั้นบนข้างหน้าต่างบานใหญ่" description="เปิด · ความสว่าง 40%" trailing={<Switch aria-label="โคมไฟห้องนั่งเล่นชั้นบน" defaultChecked />} />
        <List.Item leading={lamp} label="Reading lamp beside the long sofa under the stairs" description="Off · turns on at 18:30" trailing={<Switch aria-label="Reading lamp beside the long sofa" />} />
      </List>
    </div>
  );
}
