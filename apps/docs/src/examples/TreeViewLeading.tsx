// @example leading puts a dot-matrix Icon before the name; the glyph is decoration and the name carries the meaning
import { Icon, TreeItem, TreeView } from 'dial-react';

export default function TreeViewLeading() {
  return (
    <TreeView aria-label="Devices" defaultExpanded={['living']} defaultValue="lamp">
      <TreeItem value="living" label="Living room" leading={<Icon name="room" size="sm" />}>
        <TreeItem value="lamp" label="Lamp" leading={<Icon name="lamp" size="sm" />} />
        <TreeItem value="speaker" label="Speaker" leading={<Icon name="speaker" size="sm" />} />
        <TreeItem value="heater" label="Heater" leading={<Icon name="heat" size="sm" />} />
      </TreeItem>
      <TreeItem value="entrance" label="Entrance" leading={<Icon name="door" size="sm" />}>
        <TreeItem value="lock" label="Lock" leading={<Icon name="lock" size="sm" />} />
      </TreeItem>
    </TreeView>
  );
}
