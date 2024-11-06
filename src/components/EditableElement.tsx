import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useResizable } from '../hooks/useResizable';
import { CertificateElement } from '../types/types';

interface Props {
  element: CertificateElement;
  onUpdate: (updates: Partial<CertificateElement>) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const EditableElement: React.FC<Props> = ({ element, onUpdate, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: element.id });
  const { dimensions, handleResize } = useResizable(element.dimensions);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const style = {
    ...element.style,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    width: dimensions.width,
    height: dimensions.height,
    position: 'absolute' as const,
    left: element.position.x,
    top: element.position.y,
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onBlur={handleBlur}
          className="w-full h-full p-2 border rounded resize-none"
          style={element.style}
        />
      ) : (
        <div
          {...listeners}
          {...attributes}
          onDoubleClick={handleDoubleClick}
          className="cursor-move p-2"
        >
          {element.content}
        </div>
      )}
      
      {isSelected && (
        <>
          <div
            className="absolute w-2 h-2 bg-blue-500 right-0 top-1/2 transform -translate-y-1/2 cursor-e-resize"
            onMouseDown={(e) => handleResize(e.nativeEvent, 'right')}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 bottom-0 left-1/2 transform -translate-x-1/2 cursor-s-resize"
            onMouseDown={(e) => handleResize(e.nativeEvent, 'bottom')}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 bottom-0 right-0 cursor-se-resize"
            onMouseDown={(e) => handleResize(e.nativeEvent, 'corner')}
          />
        </>
      )}
    </div>
  );
};