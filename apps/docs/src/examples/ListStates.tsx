// @example A row that cannot be opened fades to half; a row that plays a track is one button
import { List } from 'dial-react';

export default function ListStates() {
  return (
    <List label="Recently played" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <List.Item index={1} label="Kiln song" description="Ulm Quartet · 3:42" onPress={() => {}} />
      <List.Item index={2} label="Weniger, aber besser" description="Not available in your region" onPress={() => {}} disabled />
      <List.Item index={3} label="Slow return" description="The Faders · 2:58" onPress={() => {}} />
    </List>
  );
}
