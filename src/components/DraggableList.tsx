import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

const DraggableList: React.FC = () => {
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <DraggableItem key={item} id={item}>
            {item}
          </DraggableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DraggableList;
