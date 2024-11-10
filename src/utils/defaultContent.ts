import { WidgetData } from '../types/types';

export const getDefaultContent = (type: WidgetData['type']): string | string[] => {
    switch (type) {
        case 'heading':
            return 'New Heading';
        case 'paragraph':
            return 'New paragraph text';
        case 'image':
            return '/api/placeholder/300/200';
        case 'button':
            return 'Click me';
        case 'divider':
            return '';
        case 'list':
            return ['Item 1', 'Item 2', 'Item 3'];
        case 'card':
            return 'Card content';
        case 'columns':
            return '';
        default:
            return '';
    }
};
