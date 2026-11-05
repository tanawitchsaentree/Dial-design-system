// @example A controlled Pagination that reports which events of the log are on show
import { useState } from 'react';
import { Pagination, Stack, Text } from 'dial-react';

const PER_PAGE = 10;
const TOTAL = 84;

export default function PaginationControlled() {
  const [page, setPage] = useState(3);
  const first = (page - 1) * PER_PAGE + 1;
  const last = Math.min(TOTAL, page * PER_PAGE);
  return (
    <Stack gap="md">
      <Text>{`Events ${first} to ${last} of ${TOTAL}`}</Text>
      <Pagination count={Math.ceil(TOTAL / PER_PAGE)} page={page} onPageChange={setPage} />
    </Stack>
  );
}
