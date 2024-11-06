import React, { useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useCertificate } from '../hooks/useCertificate';
import { EditableElement } from './EditableElement';
import { CertificateElement } from '../types/types';

export const DroppableCanvas: React.FC = () => {
  const { elements, setElements } = useCertificate();
  const { setNodeRef } = useDroppable({
    id: 'certificate-canvas',
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<CertificateElement>) => {
      setElements((prevElements) =>
        Array.isArray(prevElements) 
          ? prevElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
          : [] // Fallback to empty array if elements is not an array
      );
    },
    [setElements]
  );

  const handleSelectElement = (id: string) => {
    setSelectedElementId(id);
  };

  return (
    <div
      ref={setNodeRef}
      id='certificate-canvas'
      className="relative w-full h-[600px] bg-white border-2 border-gray-300 rounded overflow-hidden"
      onClick={() => setSelectedElementId(null)} // Deselect when clicking outside elements
    >
      {Array.isArray(elements) && elements.map((element) => (
        <EditableElement
          key={element.id}
          element={element}
          onUpdate={(updates) => handleUpdateElement(element.id, updates)}
          isSelected={element.id === selectedElementId}
          onSelect={() => handleSelectElement(element.id)}
        />
      ))}
    </div>
  );
};
