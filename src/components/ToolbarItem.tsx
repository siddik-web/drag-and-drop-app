import { ReactNode } from 'react';
import { DraggableWidget } from './DraggableWidget';
import { WidgetData } from '../types/types';

interface ToolbarItemProps {
  type: WidgetData['type'];
  icon: ReactNode;
}

export const ToolbarItem = ({ type, icon }: ToolbarItemProps) => (
  <DraggableWidget id={`toolbar-${type}`} className="p-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium capitalize">{type}</span>
    </div>
  </DraggableWidget>
);