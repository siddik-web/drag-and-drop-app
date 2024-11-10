import { useState } from 'react'
import { 
  X, 
  Type, 
  Sliders,
  AlignRight,
  AlignLeft,
  AlignCenter,
  PlusSquare,
} from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { WidgetStyle } from '@/types/types';

const fontSizeOptions = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl'
]

const paddingOptions = [
  'p-0',
  'p-2',
  'p-4',
  'p-6',
  'p-8'
]

const borderRadiusOptions = [
  'rounded-none',
  'rounded-sm',
  'rounded',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-full'
]

const shadowOptions = [
  { value: 'shadow-none', label: 'None' },
  { value: 'shadow-sm', label: 'Small' },
  { value: 'shadow', label: 'Default' },
  { value: 'shadow-md', label: 'Medium' },
  { value: 'shadow-lg', label: 'Large' }
]

const opacityOptions = [
  { value: 'opacity-100', label: '100%' },
  { value: 'opacity-75', label: '75%' },
  { value: 'opacity-50', label: '50%' }
]

const borderOptions = [
  { value: 'border-0', label: 'None' },
  { value: 'border', label: 'Default' },
  { value: 'border-2', label: 'Medium' },
  { value: 'border-4', label: 'Thick' }
]

const colorOptions = [
  { value: 'text-black', label: 'Black', bg: 'bg-black' },
  { value: 'text-gray-600', label: 'Gray', bg: 'bg-gray-600' },
  { value: 'text-red-500', label: 'Red', bg: 'bg-red-500' },
  { value: 'text-blue-500', label: 'Blue', bg: 'bg-blue-500' },
  { value: 'text-green-500', label: 'Green', bg: 'bg-green-500' },
  { value: 'text-yellow-500', label: 'Yellow', bg: 'bg-yellow-500' },
  { value: 'text-purple-500', label: 'Purple', bg: 'bg-purple-500' },
  { value: 'text-pink-500', label: 'Pink', bg: 'bg-pink-500' }
]

const borderColorOptions = [
  { value: 'border-gray-200', label: 'Gray', bg: 'bg-gray-200' },
  { value: 'border-red-500', label: 'Red', bg: 'bg-red-500' },
  { value: 'border-blue-500', label: 'Blue', bg: 'bg-blue-500' },
  { value: 'border-green-500', label: 'Green', bg: 'bg-green-500' },
  { value: 'border-yellow-500', label: 'Yellow', bg: 'bg-yellow-500' }
]

// New options
const fontWeightOptions = [
  { value: 'font-normal', label: 'Normal' },
  { value: 'font-medium', label: 'Medium' },
  { value: 'font-semibold', label: 'Semibold' },
  { value: 'font-bold', label: 'Bold' }
]

const textTransformOptions = [
  { value: 'normal-case', label: 'Normal' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'capitalize', label: 'Capitalize' }
]

const letterSpacingOptions = [
  { value: 'tracking-tighter', label: 'Tighter' },
  { value: 'tracking-tight', label: 'Tight' },
  { value: 'tracking-normal', label: 'Normal' },
  { value: 'tracking-wide', label: 'Wide' },
  { value: 'tracking-wider', label: 'Wider' },
  { value: 'tracking-widest', label: 'Widest' }
]



const StyleEditor = ({ 
  style = {}, 
  onChange 
}: { 
  style: WidgetStyle
  onChange: (style: WidgetStyle) => void
}) => {
  const [activeTab, setActiveTab] = useState('typography')

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
                ${style.textColor === color.value ? 'ring-2 ring-primary' : 'hover:bg-secondary'}
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
                ${style.textAlign === align.value ? 'bg-primary text-primary-foreground' : 'border'}
              `}
            >
              {align.icon}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Font Size</label>
        <select
          value={style.fontSize || 'text-base'}
          onChange={(e) => onChange({ ...style, fontSize: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {fontSizeOptions.map(size => (
            <option key={size} value={size}>
              {size.replace('text-', '')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Font Weight</label>
        <select
          value={style.fontWeight || 'font-normal'}
          onChange={(e) => onChange({ ...style, fontWeight: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {fontWeightOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Text Transform</label>
        <select
          value={style.textTransform || 'normal-case'}
          onChange={(e) => onChange({ ...style, textTransform: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {textTransformOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Letter Spacing</label>
        <select
          value={style.letterSpacing || 'tracking-normal'}
          onChange={(e) => onChange({ ...style, letterSpacing: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {letterSpacingOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Line Height</label>
        <Slider
          value={[style.lineHeight || 1.5]}
          onValueChange={(value) => onChange({ ...style, lineHeight: value[0] })}
          min={1}
          max={2}
          step={0.1}
          className="mt-2"
        />
        <span className="text-xs text-muted-foreground">{style.lineHeight || 1.5}</span>
      </div>
    </div>
  )

  const renderLayoutTab = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Padding</label>
        <select
          value={style.padding || 'p-4'}
          onChange={(e) => onChange({ ...style, padding: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {paddingOptions.map(padding => (
            <option key={padding} value={padding}>
              {padding.replace('p-', '').replace('p-0', 'None')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Border</label>
        <select
          value={style.border || 'border-0'}
          onChange={(e) => onChange({ ...style, border: e.target.value })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {borderOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {style.border && style.border !== 'border-0' && (
        <div>
          <label className="text-sm font-medium">Border Color</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {borderColorOptions.map(color => (
              <button
                key={color.value}
                onClick={() => onChange({ ...style, borderColor: color.value })}
                className={`
                  flex items-center gap-2 p-2 rounded
                  ${style.borderColor === color.value ? 'ring-2 ring-primary' : 'hover:bg-secondary'}
                `}
              >
                <div className={`w-4 h-4 rounded-full ${color.bg}`} />
                <span className="text-xs">{color.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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
  )

  const renderEffectsTab = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Shadow</label>
        <select
          value={style.shadow || 'shadow-none'}
          onChange={(e) => onChange({ ...style, shadow: e.target.value as WidgetStyle['shadow'] })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {shadowOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Opacity</label>
        <select
          value={style.opacity || 'opacity-100'}
          onChange={(e) => onChange({ ...style, opacity: e.target.value as WidgetStyle['opacity'] })}
          className="w-full mt-1 text-sm border rounded p-2"
        >
          {opacityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Background Color</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              onClick={() => onChange({ 
                ...style, 
                backgroundColor: color.value.replace('text-', 'bg-')
              })}
              className={`
                flex items-center gap-2 p-2 rounded
                ${style.backgroundColor === color.value.replace('text-', 'bg-') 
                  ? 'ring-2 ring-primary' 
                  : 'hover:bg-secondary'}
              `}
            >
              <div className={`w-4 h-4 rounded-full ${color.bg}`} />
              <span className="text-xs">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Backdrop Filter</label>
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            checked={style.backdropFilter === 'backdrop-blur-sm'}
            onCheckedChange={(checked) => 
              onChange({ ...style, backdropFilter: checked ? 'backdrop-blur-sm' : undefined })
            }
          />
          <Label>Blur Background</Label>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Transform</label>
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            checked={style.transform === 'rotate-45'}
            onCheckedChange={(checked) => 
              onChange({ ...style, transform: checked ? 'rotate-45' : undefined })
            }
          />
          <Label>Rotate 45 degrees</Label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-lg border bg-background p-4 rounded-lg shadow-md overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Style Editor</h3>
        <button onClick={() => onChange({})} className="p-1 hover:bg-secondary rounded">
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
              ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}
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
  )
}


export default StyleEditor;