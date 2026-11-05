// @example Wrap a child in CarouselSlide to pass the slide its own class or data attributes
import { Carousel, CarouselSlide, Text } from 'dial-react';

export default function CarouselWithSlides() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Carousel label="Manuals">
        <CarouselSlide data-kind="heating"><Text weight="medium">Heating</Text><Text tone="secondary" size="caption">Set the schedule.</Text></CarouselSlide>
        <CarouselSlide data-kind="washer"><Text weight="medium">Washer</Text><Text tone="secondary" size="caption">Pick a programme.</Text></CarouselSlide>
        <CarouselSlide data-kind="lamps"><Text weight="medium">Lamps</Text><Text tone="secondary" size="caption">Dim and group.</Text></CarouselSlide>
      </Carousel>
    </div>
  );
}
