import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CertificateElement } from '../types/types';

interface Props {
  id: string;
  content: string;
  type: CertificateElement['type'];
}

export const DraggableElement: React.FC<Props> = ({ id, content, type }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type, content }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 bg-white border rounded shadow cursor-move"
    >
      {content}
    </div>
  );
};