// @example A fan's settings printed round its knob, each word at its own detent, so the knob's index line points at the lit word
import { Legend } from 'dial-react';

export default function LegendArc() {
  return <Legend layout="arc" label="Fan" options={['off', 'low', 'mid', 'high', 'auto']} defaultValue="low" />;
}
