// @example Three parts along one line with a medium gap
import { Flex } from 'dial-react';

export default function FlexBasic() {
  return (
    <div className="demo-box demo-card">
      <Flex gap="md" align="center">
        <span className="demo-chip">Heating</span>
        <span className="demo-chip">Lighting</span>
        <span className="demo-chip">Blinds</span>
      </Flex>
    </div>
  );
}
