import { Type, Image, Square, Grip, List, Columns } from 'lucide-react';
import { ToolbarItem } from './ToolbarItem';

export const Toolbar = () => (
  <div className="w-64 p-4 border-r bg-gray-50">
    <h2 className="text-lg font-medium mb-4">Widgets</h2>
    <div className="space-y-2">
      <ToolbarItem type="heading" icon={<Type />} />
      <ToolbarItem type="paragraph" icon={<Type />} />
      <ToolbarItem type="image" icon={<Image />} />
      <ToolbarItem type="button" icon={<Square />} />
      <ToolbarItem type="divider" icon={<Grip />} />
      <ToolbarItem type="list" icon={<List />} />
      <ToolbarItem type="card" icon={<Square />} />
      <ToolbarItem type="columns" icon={<Columns />} />
      <ToolbarItem type="textField" icon={<Square />} />
      <ToolbarItem type="checkbox" icon={<Square />} />
      <ToolbarItem type="radio" icon={<Square />} />
      <ToolbarItem type="dropdown" icon={<Square />} />
      <ToolbarItem type="datePicker" icon={<Square />} />
      <ToolbarItem type="submit" icon={<Square />} />
    </div>
  </div>
);