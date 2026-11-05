// @example label, previousLabel, nextLabel, slideLabel and statusLabel carry another language, here Thai
import { Carousel, Text } from 'dial-react';

export default function CarouselOtherLanguage() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Carousel
        label="ห้องในบ้าน"
        previousLabel="ภาพก่อนหน้า"
        nextLabel="ภาพถัดไป"
        slideLabel={(n, total) => `${n} จาก ${total}`}
        statusLabel={(n, total) => `ภาพที่ ${n} จาก ${total}`}
      >
        <Text>ห้องนั่งเล่น อุณหภูมิ 21 องศา</Text>
        <Text>ห้องครัว เครื่องซักผ้ากำลังทำงาน</Text>
        <Text>ห้องนอน ประตูปิดอยู่</Text>
      </Carousel>
    </div>
  );
}
