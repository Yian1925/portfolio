import React, { useEffect, useState } from 'react';

export const RecordSection = ({
  recordSection,
  recordText,
  isSubmitting,
  onPointerDown,
  onTextChange,
  onSubmit
}) => {
  const [responsiveScale, setResponsiveScale] = useState(1);
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });

  // 响应式缩放和位置调整
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // 计算缩放比例
      let scale = 1;
      if (screenWidth <= 480) {
        scale = 0.6; // 小屏幕缩小到60%
      } else if (screenWidth <= 768) {
        scale = 0.75; // 平板缩小到75%
      } else if (screenWidth <= 1024) {
        scale = 0.85; // 中等屏幕缩小到85%
      }
      
      setResponsiveScale(scale);
      
      // 计算居中位置，确保不会超出视口
      const containerWidth = 560 * scale; // record-container的min-width
      const containerHeight = 300 * scale; // 估算高度
      
      // 如果是初始加载或者recordSection.y是默认值，则居中显示
      let centerX = (screenWidth - containerWidth) / 2;
      let centerY;
      
      // 判断是否为初始默认位置（240是默认Y值）
      if (recordSection.y === 240 || recordSection.y < 100) {
        // 居中显示
        centerY = (screenHeight - containerHeight) / 2;
      } else {
        // 使用保存的位置
        centerY = recordSection.y * scale;
      }
      
      // 确保在安全区域内
      centerX = Math.max(20, Math.min(centerX, screenWidth - containerWidth - 20));
      centerY = Math.max(20, Math.min(centerY, screenHeight - containerHeight - 20));
      
      setAdjustedPosition({ x: centerX, y: centerY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [recordSection.y]);

  return (
    <div
      className="record-section"
      style={{
        position: 'absolute',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        cursor: 'grab',
        zIndex: 300,
        transform: `scale(${responsiveScale})`,
        transformOrigin: 'top left'
      }}
      onMouseDown={(e) => {
        // 如果点击的是表单元素，不进行拖拽
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'FORM') {
          return;
        }
        onPointerDown(e, 'record', 'record');
      }}
      onTouchStart={(e) => {
        // 如果点击的是表单元素，不进行拖拽
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'FORM') {
          return;
        }
        onPointerDown(e, 'record', 'record');
      }}
    >
      <div className="record-container">
        <h2>此刻</h2>
        
        <textarea
          value={recordText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="记录吧～&#10;为你散落一地的时间碎片穿线&#10;看&#10;你不是无所事事&#10;相反，你尽兴轻盈"
          style={{ pointerEvents: 'auto' }}
        />
        
        <button
          onClick={() => onSubmit(recordText)}
          disabled={isSubmitting || !recordText.trim()}
          style={{ pointerEvents: 'auto' }}
        >
          {isSubmitting ? '提交中...' : ' 保存 '}
        </button>
      </div>
    </div>
  );
};