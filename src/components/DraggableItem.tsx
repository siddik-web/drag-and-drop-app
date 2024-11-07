import { useDraggable } from '@dnd-kit/core';
import React from 'react';

interface DraggableItemProps {
  id: string;
  type: 'text' | 'image' | 'shape';
  label: string;
  style?: React.CSSProperties;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, type, label }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type, label },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    padding: '8px 16px',
    marginBottom: '10px',
    backgroundColor: type === 'text' ? '#fefcbf' : type === 'image' ? '#cbd5e0' : '#bee3f8',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    textAlign: 'center',
    cursor: 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {label}
    </div>
  );
};

export default DraggableItem;
