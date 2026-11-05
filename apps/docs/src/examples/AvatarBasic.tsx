// @example The three sizes, each as initials and as a picture, in recessed windows
import { Avatar, Stack } from 'dial-react';

const photo = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="tan"/><circle cx="5" cy="4" r="2" fill="saddlebrown"/><path d="M1 10c0-3 2-4 4-4s4 1 4 4z" fill="saddlebrown"/></svg>');

export default function AvatarBasic() {
  return (
    <Stack direction="row" gap="md" align="end">
      <Avatar name="Maren Solberg" size="sm" label="Maren Solberg" />
      <Avatar name="Maren Solberg" size="md" label="Maren Solberg" />
      <Avatar name="Maren Solberg" size="lg" label="Maren Solberg" />
      <Avatar src={photo} name="Maren Solberg" size="sm" label="Maren Solberg" />
      <Avatar src={photo} name="Maren Solberg" size="md" label="Maren Solberg" />
      <Avatar src={photo} name="Maren Solberg" size="lg" label="Maren Solberg" />
    </Stack>
  );
}
