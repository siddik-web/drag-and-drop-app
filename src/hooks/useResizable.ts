import { useState, useCallback } from 'react';

export const useResizable = (initialDimensions: { width: number; height: number }) => {
  const [dimensions, setDimensions] = useState(initialDimensions);

  const handleResize = useCallback((event: MouseEvent, direction: string) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      switch (direction) {
        case 'right':
          setDimensions({ ...dimensions, width: startWidth + deltaX });
          break;
        case 'bottom':
          setDimensions({ ...dimensions, height: startHeight + deltaY });
          break;
        case 'corner':
          setDimensions({
            width: startWidth + deltaX,
            height: startHeight + deltaY,
          });
          break;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [dimensions]);

  return { dimensions, handleResize };
};