import React from 'react';

import { CertificateElement } from '../types/types';

interface Props {
  element: CertificateElement;
  onUpdate: (updates: Partial<CertificateElement>) => void;
}

export const StylePanel: React.FC<Props> = ({ element, onUpdate }) => {
  const fontFamilies = ['Arial', 'Times New Roman', 'Courier New', 'Georgia'];
  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
  const colors = ['black', 'blue', 'red', 'green', 'purple'];

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-4">Style Options</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Font Family</label>
          <select
            value={element.style.fontFamily}
            onChange={(e) => onUpdate({ style: { ...element.style, fontFamily: e.target.value } })}
            className="w-full p-2 border rounded"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Font Size</label>
          <select
            value={element.style.fontSize}
            onChange={(e) => onUpdate({ style: { ...element.style, fontSize: Number(e.target.value) } })}
            className="w-full p-2 border rounded"
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Color</label>
          <select
            value={element.style.color}
            onChange={(e) => onUpdate({ style: { ...element.style, color: e.target.value } })}
            className="w-full p-2 border rounded"
          >
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Text Align</label>
          <select
            value={element.style.textAlign}
            onChange={(e) => onUpdate({ style: { ...element.style, textAlign: e.target.value as any } })}
            className="w-full p-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
};
