import React, { useState } from 'react';

export const InputDialog = ({ show, title, placeholder, maxLength, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState('');

  if (!show) return null;

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      setInputValue('');
    }
  };

  const handleCancel = () => {
    setInputValue('');
    onCancel();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="input-dialog-overlay">
      <div className="input-dialog">
        <h3 className="input-dialog-title">{title}</h3>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          maxLength={maxLength}
          className="input-dialog-input"
          autoFocus
        />
        <div className="input-dialog-buttons">
          <button className="input-dialog-btn input-dialog-confirm" onClick={handleConfirm}>
            确定
          </button>
          <button className="input-dialog-btn input-dialog-cancel" onClick={handleCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
};