import React, { useEffect, useState } from 'react';

export const NoteBoxes = ({ notes, onPointerDown }) => {
  const [responsiveScale, setResponsiveScale] = useState(1);
  
  // 监听屏幕尺寸变化，动态调整缩放
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let scale = 1;
      
      if (width <= 360) {
        scale = 0.55;
      } else if (width <= 480) {
        scale = 0.65;
      } else if (width <= 768) {
        scale = 0.75;
      } else if (width <= 1024) {
        scale = 0.85;
      } else if (width <= 1200) {
        scale = 0.9;
      } else if (width <= 1400) {
        scale = 0.95;
      }
      
      setResponsiveScale(scale);
      
      // 更新CSS变量
      document.documentElement.style.setProperty('--note-scale', scale);
    };
    
    // 初始设置
    handleResize();
    
    // 监听窗口变化
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
      {notes.map(note => (
        <div
          key={note.id}
          className="note-box"
          style={{
            position: 'absolute',
            left: note.x,
            top: note.y,
            cursor: 'grab',
            userSelect: 'none',
            zIndex: 300,
            // 动态应用缩放（作为备用）
            transform: `scale(${responsiveScale})`,
            transformOrigin: 'center'
          }}
          onMouseDown={(e) => onPointerDown(e, 'note', note.id)}
          onTouchStart={(e) => onPointerDown(e, 'note', note.id)}
        >
          <div 
            className="note-content"
            style={{
              fontSize: `${14 * responsiveScale}px`,
              lineHeight: responsiveScale > 0.7 ? '1.6' : '1.2'
            }}
          >
            {note.content}
          </div>
        </div>
      ))}
    </>
  );
};