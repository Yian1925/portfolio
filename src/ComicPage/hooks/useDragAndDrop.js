import { useEffect } from 'react';

export const useDragAndDrop = (
  draggedElement,
  dragOffset,
  setHasUnsavedChanges,
  handlers
) => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggedElement) return;
      handlers.handleMouseMove(e);
    };

    const handleMouseUp = () => {
      if (draggedElement) {
        handlers.handleMouseUp();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
   
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedElement, dragOffset, handlers]);
};