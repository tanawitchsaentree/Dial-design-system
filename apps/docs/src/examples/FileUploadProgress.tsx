// @example progress returns how far each file has been sent, and a Progress groove shows in its window
import { FileUpload } from 'dial-react';

export default function FileUploadProgress() {
  const files = [
    new File([new ArrayBuffer(5200000)], 'firmware.bin'),
    new File([new ArrayBuffer(910000)], 'schedule.json'),
    new File([new ArrayBuffer(120000)], 'notes.txt'),
  ];
  const sent: Record<string, number | undefined> = { 'firmware.bin': 62, 'schedule.json': 100 };
  return <FileUpload multiple label="Backup" defaultFiles={files} progress={(f) => sent[f.name]} />;
}
