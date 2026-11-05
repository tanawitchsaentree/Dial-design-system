// @example A line that wraps when it runs out of room
import { Flex } from 'dial-react';

export default function FlexWrap() {
  return (
    <div className="demo-box demo-card">
      <Flex wrap gap="sm">
        {['Layout', 'Spacing', 'Tokens', 'Themes', 'Motion', 'Typography', 'Accessibility', 'Icons'].map((t) => <span key={t} className="demo-chip">{t}</span>)}
      </Flex>
    </div>
  );
}
