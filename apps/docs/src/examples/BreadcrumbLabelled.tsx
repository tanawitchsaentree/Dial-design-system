// @example A path in another language: the landmark name and the folded key's name are passed in
import { Breadcrumb, Crumb } from 'dial-react';

export default function BreadcrumbLabelled() {
  return (
    <div dir="rtl">
      <Breadcrumb label="مسار الصفحة" moreLabel="إظهار المسار كاملا" fold="always">
        <Crumb href="#home">الرئيسية</Crumb>
        <Crumb href="#living-room">غرفة المعيشة</Crumb>
        <Crumb href="#lamps">المصابيح</Crumb>
        <Crumb>مصباح المطبخ</Crumb>
      </Breadcrumb>
    </div>
  );
}
