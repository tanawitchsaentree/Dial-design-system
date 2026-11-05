// @example Pages as real links with getHref, so each page has its own address and opens in a new tab
import { Pagination } from 'dial-react';

export default function PaginationLinks() {
  return <Pagination count={9} defaultPage={4} getHref={(page) => `#events-page-${page}`} />;
}
