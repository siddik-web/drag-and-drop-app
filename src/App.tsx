import React, { useRef, useState, useEffect } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useCertificate } from "./hooks/useCertificate";
import { Toolbar } from "./components/Toolbar";
import { DroppableCanvas } from "./components/DroppableCanvas";
import { exportCertificate } from './utils/export';
import { StylePanel } from "./components/StylePanel";
import { CertificateElement, CertificateTemplate } from "./types/types";
import { exportFormats } from "./utils/export";
import { TemplateSelector } from "./components/TemplateSelector";
import { ThemeSelector } from "./components/ThemeSelector";

const CertificateBuilder: React.FC = () => {
  const {
    elements,
    setElements,
    currentTheme,
    setCurrentTheme,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedElement,
  } = useCertificate();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleTemplateSelect = (template: CertificateTemplate) => {
    if (setElements && setCurrentTheme) {
      setElements(template.elements);
      setCurrentTheme(template.theme);
      setShowTemplates(false);
    } else {
      console.error("Failed to set template. Ensure setElements and setCurrentTheme are defined.");
    }
  };

  const handleExport = async (format: keyof typeof exportFormats) => {
    if (!canvasRef.current) {
      console.error("Canvas reference is missing.");
      return;
    }
    try {
      await exportCertificate(canvasRef, format, { elements, theme: currentTheme });
    } catch (error) {
      console.error("Failed to export certificate:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === "z" && canUndo) {
        e.preventDefault();
        undo();
      } else if (e.key === "y" && canRedo) {
        e.preventDefault();
        redo();
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === 'certificate-canvas' && active?.data.current) {
      const { type, content } = active.data.current as { type: CertificateElement['type']; content: string };

      // Calculate accurate drop position
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      const dropPositionX = event.delta.x - (canvasRect?.left || 0);
      const dropPositionY = event.delta.y - (canvasRect?.top || 0);

      if (setElements) {
        setElements((prevElements) => [
          ...prevElements,
          {
            id: `${type}-${Date.now()}`,
            type,
            content,
            position: { x: dropPositionX, y: dropPositionY },
            dimensions: { width: 200, height: 100 },
            style: {
              fontSize: 16,
              fontFamily: 'Arial',
              color: 'black',
              textAlign: 'left',
            },
          },
        ]);
      } else {
        console.error("setElements function is not defined.");
      }
    }
  };

  const handleElementUpdate = (updatedElement: CertificateElement) => {
    if (setElements) {
      setElements((prevElements) =>
        prevElements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
      );
    } else {
      console.error("Failed to update element. Ensure setElements is defined.");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canUndo, canRedo]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Certificate Builder</h1>
          <button
            onClick={() => setShowTemplates(prev => !prev)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {showTemplates ? 'Close Templates' : 'Templates'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 disabled:opacity-50"
            title="Undo (Ctrl/⌘+Z)"
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 disabled:opacity-50"
            title="Redo (Ctrl/⌘+Y)"
          >
            ↪
          </button>
          <div className="relative group">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Export
          </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block">
              {Object.keys(exportFormats).map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format as keyof typeof exportFormats)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as {format}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showTemplates ? (
        <TemplateSelector onSelect={handleTemplateSelect} />
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-8">
            <div className="w-3/4">
              <Toolbar />
              <div
                ref={canvasRef}
                style={{
                  backgroundColor: currentTheme?.backgroundColor || 'white',
                  borderColor: currentTheme?.borderColor || 'black',
                }}
                className="border p-4"
              >
                <DroppableCanvas />
              </div>
            </div>
            <div className="w-1/4 space-y-8">
              <ThemeSelector
                currentTheme={currentTheme}
                onSelect={setCurrentTheme}
              />
              {selectedElement && (
                <StylePanel
                  element={selectedElement}
                  onUpdate={(updates: Partial<CertificateElement>) => {
                    const updatedElement = { ...selectedElement, ...updates };
                    handleElementUpdate(updatedElement);
                  }}
                />
              )}
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default CertificateBuilder;