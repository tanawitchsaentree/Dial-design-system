// @example A picture heading a card, with the title and text on the card body and none on the photo
import { Card, Heading, Image, Stack, Text } from 'dial-react';

const hall = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect width="40" height="30" fill="tan"/><circle cx="29" cy="9" r="4" fill="wheat"/><path d="M0 30L12 12l9 11 6-7 13 14z" fill="saddlebrown"/></svg>')}`;

export default function ImageInCard() {
  return (
    <Card>
      <Stack gap="md">
        <Image src={hall} alt="The hall, seen from the front door" ratio="3/2" />
        <Heading level={3}>Hall</Heading>
        <Text>Motion light on. Last seen 08:10.</Text>
      </Stack>
    </Card>
  );
}
