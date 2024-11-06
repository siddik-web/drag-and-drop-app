import React from 'react';
import { DraggableElement } from './DraggableElement';

export const Toolbar: React.FC = () => {
  const tools = [
    { id: 'title-tool', type: 'title' as const, content: 'Certificate Title' },
    { id: 'text-tool', type: 'text' as const, content: 'Add Text' },
    { id: 'signature-tool', type: 'signature' as const, content: 'Add Signature' },
    { id: 'date-tool', type: 'date' as const, content: 'Add Date' },
  ];

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded">
      {tools.map(tool => (
        <DraggableElement
          key={tool.id}
          id={tool.id}
          type={tool.type}
          content={tool.content}
        />
      ))}
    </div>
  );
};