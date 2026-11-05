// @example Every built-in word is a prop, here in Thai, so the Clear key and the count speak the page's language
import { SearchInput } from 'dial-react';

export default function SearchInputMessages() {
  return (
    <SearchInput
      label="ค้นหาห้อง"
      defaultValue="ห้องครัว"
      clearLabel="ล้าง"
      resultsCount={3}
      resultsText={(n) => (n === 0 ? 'ไม่พบผลลัพธ์' : `พบ ${n} รายการ`)}
    />
  );
}
