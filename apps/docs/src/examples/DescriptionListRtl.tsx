// @example Right-to-left: terms start on the right edge and the digits keep their own order
import { DescriptionDetail, DescriptionList, DescriptionTerm } from 'dial-react';

export default function DescriptionListRtl() {
  return (
    <div dir="rtl">
      <DescriptionList orientation="inline">
        <DescriptionTerm>الطراز</DescriptionTerm>
        <DescriptionDetail>سخان ht 4</DescriptionDetail>
        <DescriptionTerm>الاستهلاك</DescriptionTerm>
        <DescriptionDetail numeric>1 840 W</DescriptionDetail>
        <DescriptionTerm>الغرفة</DescriptionTerm>
        <DescriptionDetail>غرفة المعيشة</DescriptionDetail>
      </DescriptionList>
    </div>
  );
}
