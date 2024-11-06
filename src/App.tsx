import React, { useRef } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { CertificateProvider, useCertificate } from './context/context';
import { Toolbar } from './components/Toolbar';
import { DroppableCanvas } from './components/DroppableCanvas';
import { StylePanel } from './components/StylePanel';
import { exportAsPDF } from './utils/export';
import { CertificateElement } from './types/types';

const CertificateBuilder: React.FC = () => {
  const {
    elements,
    addElement,
    updateElement,
    removeElement,
    selectedElement,
    setSelectedElement
  } = useCertificate();
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'certificate-canvas') {
      const { type, content } = active.data.current as { type: CertificateElement['type']; content: string };
      
      addElement({
        id: `${type}-${Date.now()}`,
        type,
        content,
        position: { x: event.delta.x, y: event.delta.y },
        dimensions: { width: 200, height: 100 },
        style: {
          fontSize: 16,
          fontFamily: 'Arial',
          color: 'black',
          textAlign: 'left',
        }
      });
    }
  };

  const handleExport = async () => {
    await exportAsPDF(canvasRef);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Certificate Builder</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export as PDF
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8">
          <div className="w-3/4">
            <Toolbar />
            <div ref={canvasRef}>
              <DroppableCanvas />
            </div>
          </div>
          
          <div className="w-1/4">
            {selectedElement && (
              <StylePanel
                element={elements.find(el => el.id === selectedElement)!}
                onUpdate={(updates) => updateElement(selectedElement, updates)}
              />
            )}
          </div>
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