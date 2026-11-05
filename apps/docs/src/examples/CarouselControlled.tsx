// @example index and onIndexChange control the slide on show, and a key outside the Carousel can move it
import { useState } from 'react';
import { Button, Carousel, Stack, Text } from 'dial-react';

export default function CarouselControlled() {
  const [index, setIndex] = useState(0);
  return (
    <Stack gap="lg" style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Carousel label="Scenes" index={index} onIndexChange={setIndex}>
        <Text>Morning</Text>
        <Text>Day</Text>
        <Text>Evening</Text>
        <Text>Night</Text>
      </Carousel>
      <Text tone="secondary" size="caption" numeric>Slide {index + 1} of 4</Text>
      <Button onClick={() => setIndex(3)}>Go to night</Button>
    </Stack>
  );
}
