import { WidgetData } from '../types/types';
import StyleEditor from './StyleEditor';
import { ListEditor } from './ListEditor';
import { Check } from 'lucide-react';

interface WidgetProps {
  widget: WidgetData;
  isPreview?: boolean;
  onUpdate: (id: string, updates: Partial<WidgetData>) => void;
}

export const Widget = ({ widget, isPreview = false, onUpdate }: WidgetProps) => {
  const baseClassName = `
    ${widget.style?.textColor || ''}
    ${widget.style?.backgroundColor || ''}
    ${widget.style?.fontSize || ''}
    ${widget.style?.padding || ''}
    text-${widget.style?.textAlign || 'left'}
  `;

  if (widget.isEditing && !isPreview) {
    return (
      <div className="space-y-4">
        {widget.type === 'list' ? (
          <ListEditor
            content={widget.content as string[]}
            onChange={(content) => onUpdate(widget.id, { content })}
          />
        ) : (
          <input
            type="text"
            value={widget.content as string}
            onChange={(e) => onUpdate(widget.id, { content: e.target.value })}
            className="w-full p-2 border rounded"
          />
        )}
        
        <StyleEditor
          style={widget.style || {}}
          onChange={(style) => onUpdate(widget.id, { style })}
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onUpdate(widget.id, { isEditing: false })}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  switch (widget.type) {
    case 'heading':
      return <h2 className={baseClassName}>{widget.content}</h2>;
    case 'paragraph':
      return <p className={baseClassName}>{widget.content}</p>;
    case 'image':
      return <img src={widget.content as string} alt="Widget Image" className="w-full h-auto" />;
    case 'button':
      return <button className={baseClassName}>{widget.content}</button>;
    case 'divider':
      return <div className="w-full h-1 bg-gray-200 my-4"></div>;
    case 'list':
      return <ul className={baseClassName}>{(widget.content as string[]).map((item, index) => <li key={index}>{item}</li>)}</ul>;
    case 'card':
      return <div className={baseClassName}>{widget.content}</div>;
    case 'columns':
      return <div className={baseClassName}>{widget.content}</div>;
    case 'textField':
      return <input type="text" placeholder={widget.options?.textField?.placeholder || "Enter text"} className={baseClassName} />;
    case 'checkbox':
      return <input type="checkbox" className={baseClassName} />;
    case 'radio':
      return <input type="radio" className={baseClassName} />;
    case 'dropdown':
      return <select className={baseClassName}>{widget.content}</select>;
    case 'datePicker':
      return <input type="date" className={baseClassName} />;
    case 'submit':
      return <button type="submit" className={baseClassName}>{widget.content}</button>;
    default:
      return null;
  }
};