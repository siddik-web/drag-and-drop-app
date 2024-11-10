import { WidgetData, WidgetStyle } from '../types/types';

export const getDefaultStyle = (type: WidgetData['type']): WidgetStyle => {
    const baseStyle: WidgetStyle = {
        textColor: 'text-gray-900',
        backgroundColor: 'bg-white',
        fontSize: type === 'heading' ? 'text-2xl' : 'text-base',
        textAlign: 'left',
        padding: 'p-4',
        borderRadius: 'rounded'
      };
      
      return baseStyle;
};
