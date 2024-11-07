import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import useCertificate from '../hooks/useCertificate';
import DraggableComponentList from './DraggableComponentList';
import CertificateCanvas from './CertificateCanvas';

const CertificateBuilder: React.FC = () => {
  const { addElement } = useCertificate();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'canvas') {
      addElement({
        id: active.id.toString(),
        type: active.data.current?.type ?? 'text',
        content: active.data.current?.label ?? 'New Item',
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="app">
        <DraggableComponentList />
        <CertificateCanvas />
      </div>
    </DndContext>
  );
};

export default CertificateBuilder;
