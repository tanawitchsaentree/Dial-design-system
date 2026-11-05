// @example Five room slides in a recessed window, a dotted position and a key each side
import { Carousel, Text } from 'dial-react';

const rooms = [
  ['Living room', '21 degrees, lamp on'],
  ['Kitchen', '19 degrees, washer running'],
  ['Bedroom', '17 degrees, door closed'],
  ['Hall', '18 degrees, front door locked'],
  ['Garden', '9 degrees, lamp off'],
];

export default function CarouselBasic() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Carousel label="Rooms">
        {rooms.map(([name, note]) => (
          <div key={name}>
            <Text weight="medium">{name}</Text>
            <Text tone="secondary" size="caption">{note}</Text>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
