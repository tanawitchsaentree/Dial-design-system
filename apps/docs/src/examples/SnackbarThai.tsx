// @example A Thai message and status word, with status replacing the default word
import { Snackbar } from 'dial-react';

export default function SnackbarThai() {
  return (
    <div lang="th" style={{ inlineSize: 'min(100%, 375px)' }}>
      <Snackbar status="ลบแล้ว" action={{ label: 'เลิกทำ', onAction: () => {} }}>ลบโคมไฟในครัวแล้ว</Snackbar>
    </div>
  );
}
