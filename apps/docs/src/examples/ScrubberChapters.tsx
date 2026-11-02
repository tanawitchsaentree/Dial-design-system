// @example chapters print ink marks above the groove, and the chapter title is read with the position
import { Scrubber } from 'dial-react';

const CHAPTERS = [
  { time: 0, label: 'Intro' },
  { time: 41, label: 'Verse' },
  { time: 106, label: 'Chorus' },
  { time: 180, label: 'Outro' },
];

export default function ScrubberChapters() {
  return <Scrubber label="Ruhe, side A" duration={225} defaultValue={120} chapters={CHAPTERS} />;
}
