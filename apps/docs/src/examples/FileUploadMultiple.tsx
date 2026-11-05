// @example multiple keeps a list; accept, maxSize and maxFiles refuse what does not fit and say why
import { FileUpload } from 'dial-react';

export default function FileUploadMultiple() {
  const plans = [
    new File([new ArrayBuffer(1200000)], 'ground-floor.pdf', { type: 'application/pdf' }),
    new File([new ArrayBuffer(340000)], 'upstairs.pdf', { type: 'application/pdf' }),
  ];
  return <FileUpload multiple label="Floor plans" hint="PDF, up to 2 MB each, at most 4 files." accept=".pdf" maxSize={2000000} maxFiles={4} defaultFiles={plans} />;
}
