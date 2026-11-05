// @example One file: the key opens the picker, the chosen file stands in a window with its size and a remove key
import { FileUpload } from 'dial-react';

export default function FileUploadBasic() {
  const photo = new File([new ArrayBuffer(840000)], 'living-room.jpg', { type: 'image/jpeg' });
  return <FileUpload label="Room photo" hint="JPG or PNG." accept="image/*" defaultFiles={[photo]} />;
}
