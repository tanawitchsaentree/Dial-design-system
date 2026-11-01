// @example layout="compact": a speaker with an OLED window, transport keys and the volume knob right of the display
import { useState } from 'react';
import { DeviceCard } from 'dial-react';

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

export default function DeviceCardSpeaker() {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(5);
  return (
    <DeviceCard
      layout="compact"
      model="speaker 1"
      display={{ kind: 'oled', label: 'Speaker', value: 'So What', detail: `${playing ? 'Playing' : 'Paused'} · Kind of Blue` }}
      knob={{ label: 'Volume', value: volume, onValueChange: setVolume }}
      keysLabel="Playback"
      keys={[
        { label: 'Previous track', icon: <Icon d="M18 6l-8 6 8 6zM6 6v12" /> },
        { label: 'Play', icon: <Icon d="M8 5l11 7-11 7z" />, pressed: playing, onPress: () => setPlaying(!playing) },
        { label: 'Next track', icon: <Icon d="M6 6l8 6-8 6zM18 6v12" /> },
      ]}
    />
  );
}
