// @example defaultIndex starts the Carousel on a later slide, and the first key is flat only at the first slide
import { Carousel, Text } from 'dial-react';

export default function CarouselStartsLater() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Carousel label="Lamps" defaultIndex={2}>
        <Text>Reading lamp</Text>
        <Text>Ceiling lamp</Text>
        <Text>Desk lamp</Text>
        <Text>Porch lamp</Text>
      </Carousel>
    </div>
  );
}
