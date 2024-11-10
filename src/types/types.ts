export interface WidgetStyle {
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

export interface WidgetData {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'list' | 'card' | 'columns' | 'textField' | 'checkbox' | 'radio' | 'dropdown' | 'datePicker' | 'submit';
  content: string | string[];
  isEditing?: boolean;
  style?: WidgetStyle;
  columns?: WidgetData[][];
  options?: {
    textField?: {
      placeholder?: string;
    }
  },
  label?: string;
  groupName?: string;
}

export interface HistoryState {
  past: WidgetData[][];
  present: WidgetData[];
  future: WidgetData[][];
}

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
