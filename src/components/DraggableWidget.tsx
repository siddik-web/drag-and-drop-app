import React, { ReactNode } from "react";
import { Grip } from "lucide-react";

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  onDragStart?: (e: React.DragEvent) => void;
  draggedOver?: "top" | "bottom" | null;
  onDrop?: (e: React.DragEvent) => void;
  className?: string;
}

export const DraggableWidget = ({
  id,
  children,
  onDragStart,
  draggedOver,
  onDrop,
  className = "",
}: DraggableWidgetProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id);
        onDragStart?.(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={onDrop}
      className={`
        relative group cursor-move bg-white rounded-lg shadow-sm border 
        border-gray-200 p-4 mb-2 transition-all
        ${draggedOver === "top" ? "border-t-4 border-t-blue-500" : ""}
        ${draggedOver === "bottom" ? "border-b-4 border-b-blue-500" : ""}
        ${className}
      `}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Grip className="w-4 h-4 text-gray-400" />
      </div>
      {children}
    </div>
  );
};
