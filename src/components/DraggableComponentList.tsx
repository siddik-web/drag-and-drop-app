import React from 'react';
import DraggableItem from './DraggableItem';

const DraggableComponentList: React.FC = () => {
  return (
    <div className="element-list">
      <DraggableItem id="text1" type="text" label="Text Field" />
      <DraggableItem id="image1" type="image" label="Image Placeholder" />
      <DraggableItem id="shape1" type="shape" label="Rectangle Shape" />
      <DraggableItem id="shape2" type="shape" label="Circle Shape" />
    </div>
  );
};

export default DraggableComponentList;
