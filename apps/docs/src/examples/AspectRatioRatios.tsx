// @example The four ratios side by side
import { AspectRatio, Display, Stack } from 'dial-react';

export default function AspectRatioRatios() {
  return (
    <div className="demo-box demo-card">
      <Stack direction="row" gap="md" align="start">
        {(['1/1', '4/3', '16/9', '3/2'] as const).map((r) => (
          <div key={r}>
            <AspectRatio ratio={r}><Display kind="oled" label={`Ratio ${r}`} value={r} /></AspectRatio>
          </div>
        ))}
      </Stack>
    </div>
  );
}
