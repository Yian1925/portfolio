import React from 'react';

export const ConfirmDialog = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('确认对话框：用户点击确定');
    onConfirm();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('确认对话框：用户点击取消');
    onCancel();
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3 className="confirm-message">{message}</h3>
        <div className="confirm-buttons">
          <button className="modal-btn" onClick={handleConfirm}>
            确定
          </button>
          <button className="modal-btn" onClick={handleCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
