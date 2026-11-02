// @example A signal reading in decibels, where the range starts below zero
import { Meter } from 'dial-react';

export default function MeterSignal() {
  return <Meter label="Wi-Fi signal" value={-61} min={-90} max={-30} low={-75} high={-50} optimum={-40} regionLabels={{ low: 'Weak', mid: 'Usable', high: 'Strong' }} formatValue={(v) => `${v} dBm`} />;
}
