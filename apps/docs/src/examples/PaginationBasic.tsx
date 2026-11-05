// @example Twelve pages starting on the sixth: numbers fold into gaps at both ends, the current one carries an ink mark
import { Pagination } from 'dial-react';

export default function PaginationBasic() {
  return <Pagination count={12} defaultPage={6} />;
}
