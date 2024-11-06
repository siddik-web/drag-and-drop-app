import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CertificateElement } from '../types/types';

interface Props {
  id: string;
  content: string;
  type: CertificateElement['type'];
}

export const DraggableElement: React.FC<Props> = React.memo(({ id, content, type }) => {
  // Use the draggable hook from dnd-kit
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, content },
  });

  // Style transformations for drag behavior
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'move',
    padding: '8px',
    backgroundColor: isDragging ? '#f0f0f0' : '#fff', // Change background when dragging
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)', // Box shadow feedback
    textAlign: 'center',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    opacity: isDragging ? 0.7 : 1, // Fade when dragging
    transition: 'all 0.2s ease', // Smooth transition for dragging effect
  };

  // Ensure the necessary props are provided
  if (!id || !type) {
    console.error('DraggableElement requires a valid id and type.');
    return null; // Return nothing if invalid props
  }

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      {...listeners}
      {...attributes}
      className="draggable-element"
      aria-label={`Drag ${content}`}
    >
      {content || 'Draggable Item'}
    </div>
  );
});

DraggableElement.displayName = 'DraggableElement';
