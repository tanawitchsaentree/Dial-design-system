// @example A longer reach with two numbers each side of the current page and two at each end, in Thai names
import { Pagination } from 'dial-react';

export default function PaginationWide() {
  return (
    <Pagination
      count={40}
      defaultPage={20}
      siblings={2}
      boundary={2}
      label="เลขหน้า"
      previousLabel="หน้าก่อนหน้า"
      nextLabel="หน้าถัดไป"
      pageLabel={(n) => `หน้า ${n}`}
    />
  );
}
