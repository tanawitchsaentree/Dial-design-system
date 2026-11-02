// @example Names and lines in Thai, with the key and the spoken words in Thai too
import { Card, Display, Explain, ExplainMode, Rotary, Stack } from 'dial-react';

export default function ExplainModeThai() {
  return (
    <ExplainMode toggleLabel="วิธีใช้" openText="เปิดวิธีใช้แล้ว กด Escape เพื่อปิด" closeText="ปิดวิธีใช้แล้ว" defaultOpen>
      <Card padding="unit" wordmark="dial" model="พัดลม 1">
        <Explain name="หน้าจอ" does="บอกระดับลมตอนนี้">
          <Display label="พัดลม" value="3" detail="ลมปกติ" digits={1} />
        </Explain>
        <Stack direction="row" gap="xl">
          <Explain name="ระดับลม" does="หมุนเพื่อเพิ่มหรือลดลม">
            <Rotary label="ระดับลม" min={0} max={5} defaultValue={3} />
          </Explain>
        </Stack>
      </Card>
    </ExplainMode>
  );
}
