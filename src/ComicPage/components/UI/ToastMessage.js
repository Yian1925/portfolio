import React from 'react';

export const ToastMessage = ({ message }) => {
  return (
    <div className={`submit-message ${message.includes('成功') || message.includes('保存') || message.includes('添加') || message.includes('重置') ? 'success' : 'error'}`}>
      {message}
    </div>
  );
};
