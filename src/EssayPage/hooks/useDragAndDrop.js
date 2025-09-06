import { useEffect } from 'react';

export const useDragAndDrop = (
  draggedElement,
  dragOffset,
  setHasUnsavedChanges,
  handlers
) => {
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggedElement) return;
      handlers.handlePointerMove(e);
    };

    const handlePointerUp = () => {
      if (draggedElement) {
        handlers.handlePointerUp();
      }
    };

    // 同时监听鼠标和触摸事件
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove, { passive: false });
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);
    document.addEventListener('touchcancel', handlePointerUp);
   
    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchend', handlePointerUp);
      document.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [draggedElement, dragOffset, handlers]);
};