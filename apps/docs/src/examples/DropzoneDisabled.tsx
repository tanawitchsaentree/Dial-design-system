// @example disabled switches the tray off: no drop is taken and the key is disabled too
import { Dropzone } from 'dial-react';

export default function DropzoneDisabled() {
  return <Dropzone disabled hint="Uploads are paused while the sync runs" />;
}
