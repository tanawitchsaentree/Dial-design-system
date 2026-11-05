// @example In a right-to-left page the track runs from the right and the chevrons mirror
import { Carousel, Text } from 'dial-react';

export default function CarouselRightToLeft() {
  return (
    <div dir="rtl" style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Carousel label="الغرف" previousLabel="السابق" nextLabel="التالي">
        <Text>غرفة المعيشة</Text>
        <Text>المطبخ</Text>
        <Text>غرفة النوم</Text>
      </Carousel>
    </div>
  );
}
