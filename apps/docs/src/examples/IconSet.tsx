// @example The whole set, each glyph with its name, drawn from the ICON_NAMES list
import { Icon, ICON_NAMES } from 'dial-react';

export default function IconSet() {
  return (
    <ul className="icon-grid flush" style={{ inlineSize: '100%' }}>
      {ICON_NAMES.map((name) => (
        <li key={name}>
          <Icon name={name} size="lg" />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  );
}
