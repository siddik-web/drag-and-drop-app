import React, { useState } from 'react';
import { 
  X, Edit2, Check, Undo2, Redo2, 
  Save, Upload, Eye, Edit3, Smartphone, Tablet, Monitor
} from 'lucide-react';
import { ListEditor } from './components/ListEditor';
import StyleEditor from './components/StyleEditor';
import { DraggableWidget } from './components/DraggableWidget';
import { WidgetData, WidgetStyle, PreviewDevice } from './types/types';
import { DevicePreview } from './components/DevicePreview';
import { Toolbar } from './components/Toolbar';
import { useHistory } from './hooks/useHistory';
import { getDefaultContent } from './utils/defaultContent';
import { getDefaultStyle } from './utils/defaultStyle';

const LayoutBuilder = () => {
  const { history, canUndo, canRedo, handleUndo, handleRedo, saveToHistory } = useHistory();
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropTarget, setDropTarget] = useState<{ id: string; position: 'top' | 'bottom' } | null>(null);

  // Save/Load
  const handleSave = () => {
    const layout = {
      widgets: history.present,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(layout)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const layout = JSON.parse(e.target?.result as string);
        if (layout.widgets) {
          saveToHistory(layout.widgets);
        }
      } catch (err) {
        console.error('Error loading layout:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDropTarget(null);
    
    const id = e.dataTransfer.getData('text/plain');
    
    if (id.startsWith('toolbar-')) {
      const type = id.replace('toolbar-', '') as WidgetData['type'];
      const newWidget: WidgetData = {
        id: `widget-${Date.now()}`,
        type,
        content: getDefaultContent(type),
        style: getDefaultStyle(type),
        columns: type === 'columns' ? [[], []] : undefined
      };
      
      const newWidgets = [...history.present, newWidget];
      saveToHistory(newWidgets);
    }
  };

  const handleWidgetDrop = (e: React.DragEvent, targetId: string, position: 'top' | 'bottom') => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);

    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId.startsWith('toolbar-')) {
      const type = draggedId.replace('toolbar-', '') as WidgetData['type'];
      const newWidget: WidgetData = {
        id: `widget-${Date.now()}`,
        type,
        content: getDefaultContent(type),
        style: getDefaultStyle(type),
        columns: type === 'columns' ? [[], []] : undefined
      };
      
      const targetIndex = history.present.findIndex(w => w.id === targetId);
      const newWidgets = [...history.present];
      newWidgets.splice(position === 'top' ? targetIndex : targetIndex + 1, 0, newWidget);
      saveToHistory(newWidgets);
    } else {
      const draggedWidget = history.present.find(w => w.id === draggedId);
      if (!draggedWidget) return;

      const newWidgets = history.present.filter(w => w.id !== draggedId);
      const targetIndex = newWidgets.findIndex(w => w.id === targetId);
      
      newWidgets.splice(position === 'top' ? targetIndex : targetIndex + 1, 0, draggedWidget);
      saveToHistory(newWidgets);
    }
  };

  const updateWidget = (id: string, updates: Partial<WidgetData>) => {
    const newWidgets = history.present.map(widget =>
      widget.id === id ? { ...widget, ...updates } : widget
    );
    saveToHistory(newWidgets);
  };

  const removeWidget = (id: string) => {
    saveToHistory(history.present.filter(w => w.id !== id));
  };

  const renderWidget = (widget: WidgetData, isPreview: boolean = false) => {
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
              onChange={(content) => updateWidget(widget.id, { content })}
            />
          ) : (
            <input
              type="text"
              value={widget.content as string}
              onChange={(e) => updateWidget(widget.id, { content: e.target.value })}
              className="w-full p-2 border rounded"
            />
          )}
          
          <StyleEditor
            style={widget.style || {}}
            onChange={(style) => updateWidget(widget.id, { style })}
          />
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => updateWidget(widget.id, { isEditing: false })}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }
  
    // Render widget types, including form elements
    switch (widget.type) {
      case 'heading':
        return <h2 className={baseClassName}>{widget.content}</h2>;
  
      case 'paragraph':
        return <p className={baseClassName}>{widget.content}</p>;
  
      case 'image':
        return (
          <img 
            src={widget.content as string} 
            alt="Widget content" 
            className={`w-full ${baseClassName}`}
          />
        );
  
      case 'button':
        return (
          <button className={`${baseClassName} px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600`}>
            {widget.content}
          </button>
        );
  
      case 'divider':
        return <hr className="my-4 border-gray-200" />;
  
      case 'list':
        return (
          <ul className={`${baseClassName} list-disc list-inside`}>
            {(widget.content as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
  
      case 'card':
        return (
          <div className={`${baseClassName} border rounded-lg shadow-sm`}>
            {widget.content}
          </div>
        );
  
      case 'columns':
        return (
          <div className="grid grid-cols-2 gap-4">
            {widget.columns?.map((column, index) => (
              <div key={index} className="space-y-2">
                {column.map(widget => renderWidget(widget))}
              </div>
            ))}
          </div>
        );
  
      // Form-specific widget types
      case 'textField':
        return (
          <input 
            type="text" 
            placeholder={widget.options?.textField?.placeholder || "Enter text"} 
            className={`${baseClassName} border p-2 rounded w-full`}
          />
        );
  
      case 'checkbox':
        return (
          <label className={`${baseClassName} flex items-center`}>
            <input type="checkbox" className="mr-2" />
            {widget.label}
          </label>
        );
  
      case 'radio':
        return (
          <label className={`${baseClassName} flex items-center`}>
            <input type="radio" name={widget.groupName} className="mr-2" />
            {widget.label}
          </label>
        );
  
      case 'dropdown':
        return (
          <select className={`${baseClassName} border p-2 rounded w-full`}>
            {(widget.options as string[]).map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
  
      case 'datePicker':
        return (
          <input type="date" className={`${baseClassName} border p-2 rounded w-full`} />
        );
  
      case 'submit':
        return (
          <button type="submit" className={`${baseClassName} px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600`}>
            {widget.content || "Submit"}
          </button>
        );
  
      default:
        return null;
    }
  };
  

  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');

  const renderContent = () => {
    if (isPreviewMode) {
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  previewDevice === 'desktop' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="text-sm">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  previewDevice === 'tablet' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span className="text-sm">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  previewDevice === 'mobile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-sm">Mobile</span>
              </button>
            </div>
            
            <DevicePreview device={previewDevice}>
              <div className="space-y-4 p-4">
                {history.present.map((widget) => (
                  <div key={widget.id}>
                    {renderWidget(widget, true)}
                  </div>
                ))}
                {history.present.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No content to preview
                  </div>
                )}
              </div>
            </DevicePreview>
          </div>
        );
      }

    return (
      <div
        className={`min-h-[200px] p-4 border-2 border-dashed rounded-lg ${
          isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
      >
        {history.present.map((widget) => (
          <DraggableWidget
            key={widget.id}
            id={widget.id}
            draggedOver={dropTarget?.id === widget.id ? dropTarget.position : null}
            onDrop={(e) => {
              if (dropTarget?.id === widget.id) {
                handleWidgetDrop(e, widget.id, dropTarget.position);
              }
            }}
          >
            <div className="relative">
              {renderWidget(widget)}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => updateWidget(widget.id, { isEditing: true })}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DraggableWidget>
        ))}
        {history.present.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            Drag and drop widgets here
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Toolbar */}
      {!isPreviewMode && (
        <Toolbar />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Toolbar */}
        <div className="mb-4 flex items-center gap-2">
        <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
          >
            {isPreviewMode ? (
              <>
                <Edit3 className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
          {!isPreviewMode && (
            <>
              <button
                onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded ${
              canUndo ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded ${
              canRedo ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={handleSave}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Save className="w-4 h-4" />
          </button>
          <label className="p-2 rounded hover:bg-gray-100 cursor-pointer">
            <input
              type="file"
              onChange={handleLoad}
              accept=".json"
              className="hidden"
            />
            <Upload className="w-4 h-4" />
              </label>
            </>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default LayoutBuilder;