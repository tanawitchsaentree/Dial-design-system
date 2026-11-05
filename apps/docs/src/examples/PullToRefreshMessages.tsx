// @example The words in another language with messages, and a 12 hour clock with formatTime
import { List, PullToRefresh } from 'dial-react';

const ask = () => new Promise((done) => setTimeout(done, 1200));
const twelve = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export default function PullToRefreshMessages() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-section)', inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <PullToRefresh
        label="Messwerte"
        onRefresh={ask}
        updated={new Date(2026, 10, 2, 10, 41)}
        messages={{ pull: 'Zum Aktualisieren ziehen', release: 'Loslassen zum Aktualisieren', working: 'Frage den Hub', updated: 'Aktualisiert', failed: 'Nicht aktualisiert', refresh: 'Aktualisieren' }}
      >
        <List label="Messwerte"><List.Item label="Küche" description="21,5 °C" /></List>
      </PullToRefresh>
      <PullToRefresh label="Readings" onRefresh={ask} updated={new Date(2026, 10, 2, 22, 41)} formatTime={twelve}>
        <List label="Readings"><List.Item label="Porch" description="8.5 °C" /></List>
      </PullToRefresh>
    </div>
  );
}
