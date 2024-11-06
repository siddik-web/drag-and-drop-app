import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useCertificate } from '../context/context';

export const DroppableCanvas: React.FC = () => {
  const { elements } = useCertificate();
  const { setNodeRef } = useDroppable({
    id: 'certificate-canvas'
  });

  return (
    <div
      ref={setNodeRef}
      className="relative w-full h-[600px] bg-white border-2 border-gray-300 rounded"
    >
      {elements.map(element => (
        <div
          key={element.id}
          style={{
            position: 'absolute',
            left: element.position.x,
            top: element.position.y,
          }}
          className="p-2"
        >
          {element.content}
        </div>
      ))}
    </div>
  );
};
