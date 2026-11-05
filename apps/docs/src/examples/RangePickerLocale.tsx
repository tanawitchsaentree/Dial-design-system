// @example locale sets the Calendar words, and every built-in word can be passed in the same language
import { RangePicker } from 'dial-react';

export default function RangePickerLocale() {
  return (
    <RangePicker
      label="ช่วงพัก"
      locale="th"
      weekStart={0}
      startLabel="เริ่ม"
      endLabel="สิ้นสุด"
      openLabel="เลือกวันที่"
      closeLabel="ปิด"
      previousLabel="เดือนก่อน"
      nextLabel="เดือนถัดไป"
      pickStartMessage="เลือกวันแรก"
      pickEndMessage="เลือกวันสุดท้าย"
      rangeLabels={{ start: 'วันเริ่ม', end: 'วันสิ้นสุด', inside: 'อยู่ในช่วง' }}
      defaultValue={{ start: '2026-11-09', end: '2026-11-17' }}
      today="2026-11-04"
    />
  );
}
