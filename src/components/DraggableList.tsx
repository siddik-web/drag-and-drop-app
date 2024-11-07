import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import UserProfile from './UserProfile'; // Import UserProfile component
import './DraggableList.css';
import DraggableItem from './DraggableItem';

const DraggableList: React.FC = () => {
  const [items, setItems] = useState<string[]>([
    'Alice Smith',
    'Bob Johnson',
    'Charlie Brown',
    'Diana Prince',
    'Ethan Hunt',
    'Fiona Gallagher',
    'George Costanza',
    'Hannah Montana',
    'Isaac Newton',
  ]);
  const [newItem, setNewItem] = useState<string>('');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      if (active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      addItem(newItem);
      setNewItem('');
    }
  };

  const handleRemoveItem = (item: string) => {
    removeItem(item);
  };

  const handleResetItems = () => {
    resetItems();
  };

  const addItem = (newItem: string) => {
    setItems((items) => [...items, newItem]);
  };

  const removeItem = (itemToRemove: string) => {
    setItems((items) => items.filter(item => item !== itemToRemove));
  };

  const resetItems = () => {
    setItems(['John Doe', 'Jane Doe', 'Jim Doe']);
  };

  return (
    <div className="draggable-list-container">
      <input 
        type="text" 
        value={newItem} 
        onChange={(e) => setNewItem(e.target.value)} 
        placeholder="Add a new user" 
        className="item-input"
      />
      <div className="button-container">
        <button onClick={handleAddItem} className="add-button">Add User</button>
        <button onClick={handleResetItems} className="reset-button">Reset Users</button>
      </div>
      <div className="draggable-list">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => (
              <div key={item} className="draggable-item-container">
                <DraggableItem id={item}>
                  {item}
                </DraggableItem>
                <UserProfile
                  name={item}
                  email={`${item.toLowerCase().replace(' ', '.')}@example.com`}
                  bio="I am a software engineer"
                  avatarUrl="https://placehold.co/150"
                  variant={index + 1} // Use index for variant
                />
                <button onClick={() => handleRemoveItem(item)} className="remove-button" style={{ marginLeft: '10px' }}>Remove {item}</button>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DraggableList;
