// @example A long list scrolls inside the panel; type the first letters of a city to jump to it
import { Select } from 'dial-react';

const ZONES = ['Amsterdam', 'Athens', 'Bangkok', 'Berlin', 'Chiang Mai', 'Copenhagen', 'Dublin', 'Helsinki', 'Lisbon', 'London', 'Madrid', 'Oslo', 'Paris', 'Tokyo', 'Vienna'].map((c) => ({ value: c.toLowerCase().replace(/\s/g, '-'), label: c }));

export default function SelectLong() {
  return <Select label="Time zone" options={ZONES} defaultValue="bangkok" />;
}
