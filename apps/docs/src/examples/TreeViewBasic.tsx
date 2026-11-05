// @example Rooms of a home as a tree: hairlines join each child to its parent and the chosen label sits in a box
import { TreeItem, TreeView } from 'dial-react';

export default function TreeViewBasic() {
  return (
    <TreeView aria-label="Rooms" defaultExpanded={['rooms', 'upstairs']} defaultValue="kitchen">
      <TreeItem value="rooms" label="Rooms">
        <TreeItem value="kitchen" label="Kitchen" />
        <TreeItem value="hall" label="Hall" />
        <TreeItem value="upstairs" label="Upstairs">
          <TreeItem value="bedroom" label="Bedroom" />
          <TreeItem value="bath" label="Bathroom" />
        </TreeItem>
      </TreeItem>
      <TreeItem value="devices" label="Devices">
        <TreeItem value="heater" label="Heater" />
        <TreeItem value="lamp" label="Lamp" />
      </TreeItem>
    </TreeView>
  );
}
