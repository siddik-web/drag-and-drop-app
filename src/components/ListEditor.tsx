import { useState } from 'react';
import { X } from 'lucide-react';

export const ListEditor = ({ 
  content, 
  onChange 
}: { 
  content: string[]; 
  onChange: (items: string[]) => void;
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...content, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    onChange(content.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 p-2 border rounded"
          placeholder="Add new item..."
        />
        <button
          onClick={addItem}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {content.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="flex-1">{item}</span>
            <button
              onClick={() => removeItem(index)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
