import React, { useState, useCallback } from 'react';
import { 
  Grip, X, Edit2, Check, Undo2, Redo2, 
  Save, Upload, List, Columns, Square, Type, Image,
  Eye, Edit3, Smartphone, Tablet, Monitor, Sliders,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Underline, Link, PlusSquare
} from 'lucide-react';

// Enhanced Types
interface WidgetStyle {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  borderRadius?: string;
  fontWeight?: 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold';
  fontStyle?: 'italic' | 'normal';
  textDecoration?: 'underline' | 'line-through' | 'none';
  letterSpacing?: 'tracking-tight' | 'tracking-normal' | 'tracking-wide';
  lineHeight?: 'leading-none' | 'leading-tight' | 'leading-normal' | 'leading-relaxed';
  opacity?: 'opacity-100' | 'opacity-75' | 'opacity-50';
  shadow?: 'shadow-none' | 'shadow-sm' | 'shadow' | 'shadow-md' | 'shadow-lg';
  border?: string;
  borderColor?: string;
  transform?: string;
  transition?: string;
}

// Missing constants
const fontSizeOptions = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl'
];

const paddingOptions = [
  'p-0',
  'p-2',
  'p-4',
  'p-6',
  'p-8'
];

const borderRadiusOptions = [
  'rounded-none',
  'rounded-sm',
  'rounded',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-full'
];

// Enhanced StyleEditor Component
const StyleEditor = ({ 
  style, 
  onChange,
  onClose 
}: { 
  style: WidgetStyle; 
  onChange: (style: WidgetStyle) => void;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('typography');

  const renderTypographyTab = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Text Color</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              onClick={() => onChange({ ...style, textColor: color.value })}
              className={`
                flex items-center gap-2 p-2 rounded
                ${style.textColor === color.value ? 'ring-2 ring-blue-500' : 'hover:bg-gray-100'}
              `}
            >
              <div className={`w-4 h-4 rounded-full ${color.bg}`} />
              <span className="text-xs">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Text Alignment</label>
        <div className="flex gap-2 mt-2">
          {[
            { icon: <AlignLeft className="w-4 h-4" />, value: 'left' },
            { icon: <AlignCenter className="w-4 h-4" />, value: 'center' },
            { icon: <AlignRight className="w-4 h-4" />, value: 'right' }
          ].map(align => (
            <button
              key={align.value}
              onClick={() => onChange({ ...style, textAlign: align.value as WidgetStyle['textAlign'] })}
              className={`
                p-2 rounded
                ${style.textAlign === align.value ? 'bg-blue-500 text-white' : 'border'}
              `}
            >
              {align.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Rest of typography controls remain the same */}
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-4">
      {/* Previous layout controls remain the same */}
      
      <div>
        <label className="text-sm font-medium">Border Radius</label>
        <select
          value={style.borderRadius || 'rounded'}
          onChange={(e) => onChange({ ...style, borderRadius: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {borderRadiusOptions.map(radius => (
            <option key={radius} value={radius}>
              {radius.replace('rounded-', '').replace('rounded', 'default')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderEffectsTab = () => (
    <div className="space-y-4">
      {/* Effects controls remain the same */}
    </div>
  );

  return (
    <div className="w-80 border-l bg-white p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Style Editor</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2 mb-4 border-b">
        {[
          { id: 'typography', icon: <Type className="w-4 h-4" />, label: 'Typography' },
          { id: 'layout', icon: <Sliders className="w-4 h-4" />, label: 'Layout' },
          { id: 'effects', icon: <PlusSquare className="w-4 h-4" />, label: 'Effects' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-3 py-2 text-sm
              ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'typography' && renderTypographyTab()}
      {activeTab === 'layout' && renderLayoutTab()}
      {activeTab === 'effects' && renderEffectsTab()}
    </div>
  );
};

// Export the component
export default StyleEditor;