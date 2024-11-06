import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Toolbar } from './components/Toolbar';
import { DroppableCanvas } from './components/DroppableCanvas';
import { CertificateElement } from './types/types';
import { CertificateProvider, useCertificate } from './context/context';

const CertificateBuilder: React.FC = () => {
  const { addElement } = useCertificate();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'certificate-canvas') {
      const { type, content } = active.data.current as { type: CertificateElement['type']; content: string };
      
      addElement({
        id: `${type}-${Date.now()}`,
        type,
        content,
        position: {
          x: event.delta.x,
          y: event.delta.y,
        },
        dimensions: {
          width: 200,
          height: 100,
        },
        style: {
          color: '#000000',
        },
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Certificate Builder</h1>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-8">
          <Toolbar />
          <DroppableCanvas />
        </div>
      </DndContext>
    </div>
  );
};

export const App: React.FC = () => (
  <CertificateProvider>
    <CertificateBuilder />
  </CertificateProvider>
);

export default App;