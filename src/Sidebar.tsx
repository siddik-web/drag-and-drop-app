import React from "react";
import DraggableComponent from "./DraggableComponent";

const Sidebar: React.FC = () => {
  const components = [
    { id: "text", label: "Text" },
    { id: "image", label: "Image" },
    { id: "button", label: "Button" },
  ];

  return (
    <div
      style={{ width: "200px", padding: "16px", backgroundColor: "#f0f0f0", borderRight: "1px solid #ddd" }}
    >
      {components.map((component) => (
        <DraggableComponent
          key={component.id}
          id={component.id}
          label={component.label}
        />
      ))}
    </div>
  );
};

export default Sidebar;
