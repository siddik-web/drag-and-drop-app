import React from 'react';

import { CertificateTemplate } from '../types/types';
import { certificateTemplates } from '../config/templates';

interface Props {
  onSelect: (template: CertificateTemplate) => void;
}

export const TemplateSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {certificateTemplates.map(template => (
        <div
          key={template.id}
          className="p-4 border rounded cursor-pointer hover:border-blue-500"
          onClick={() => onSelect(template)}
        >
          <h3 className="font-bold mb-2">{template.name}</h3>
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            {/* Add template preview */}
            <img src={template.previewImage} alt={`${template.name} preview`} className="w-full h-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};
