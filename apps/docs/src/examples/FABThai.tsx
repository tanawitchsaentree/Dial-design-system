// @example An extended key with a Thai word keeps its height and the marks above the line
import { FAB, Stack } from 'dial-react';

export default function FABThai() {
  return (
    <div className="demo-box demo-card" style={{ position: 'relative', minBlockSize: 'calc(var(--ds-control-lg) * 4)' }}>
      <Stack gap="sm">
        <p className="flush">ห้องนั่งเล่น · 21.5 องศา</p>
        <p className="flush">ห้องครัว · 19 องศา</p>
      </Stack>
      <FAB label="เพิ่มห้อง" extended />
    </div>
  );
}
