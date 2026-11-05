// @example Five pages fit the row, so every number shows and no gap is printed; the previous key is flat on page one
import { Pagination } from 'dial-react';

export default function PaginationShort() {
  return <Pagination count={5} defaultPage={1} />;
}
