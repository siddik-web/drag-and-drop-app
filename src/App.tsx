import React from 'react';
import DraggableList from './components/DraggableList';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Drag and Drop Example</h1>
      <DraggableList />
    </div>
  );
};

export default App;
