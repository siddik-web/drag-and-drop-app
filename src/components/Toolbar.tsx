import React from 'react';
import { DraggableElement } from './DraggableElement';

const TOOL_TYPES = {
  TITLE: 'title',
  TEXT: 'text',
  SIGNATURE: 'signature',
  DATE: 'date',
};

export const Toolbar: React.FC = () => {
  const tools = [
    { id: 'title-tool', type: TOOL_TYPES.TITLE, content: 'Certificate Title' },
    { id: 'text-tool', type: TOOL_TYPES.TEXT, content: 'Add Text' },
    { id: 'signature-tool', type: TOOL_TYPES.SIGNATURE, content: 'Add Signature' },
    { id: 'date-tool', type: TOOL_TYPES.DATE, content: 'Add Date' },
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