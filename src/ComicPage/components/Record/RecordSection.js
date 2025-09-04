import React from 'react';

export const RecordSection = ({
  recordSection,
  recordText,
  isSubmitting,
  onMouseDown,
  onTextChange,
  onSubmit
}) => {
  return (
    <div
      className="record-section"
      style={{
        position: 'absolute',
        left: recordSection.x,
        top: recordSection.y,
        cursor: 'grab',
        zIndex: 300
      }}
      onMouseDown={(e) => {
        // 如果点击的是表单元素，不进行拖拽
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'FORM') {
          return;
        }
        onMouseDown(e, 'record', 'record');
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