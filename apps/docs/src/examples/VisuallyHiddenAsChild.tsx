// @example asChild hands the hiding styles to your own anchor, so the link is the element that appears on focus
import { VisuallyHidden } from 'dial-react';

export default function VisuallyHiddenAsChild() {
  return (
    <VisuallyHidden asChild focusable>
      <a href="#main">Skip to the settings</a>
    </VisuallyHidden>
  );
}
