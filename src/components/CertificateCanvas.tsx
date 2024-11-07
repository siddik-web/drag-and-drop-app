import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import useCertificate from '../hooks/useCertificate';
import DraggableItem from './DraggableItem';

const CertificateCanvas: React.FC = () => {
  const { elements } = useCertificate();
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  return (
    <div ref={setNodeRef} className="certificate-canvas">
      {elements.map((element) => (
        <DraggableItem key={element.id} id={element.id} type={element.type} label={element.type} />
      ))}
    </div>
  );
};

export default CertificateCanvas;
