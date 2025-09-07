import React, { useState, useEffect } from 'react';

const DeleteGallerySelectorModal = ({ 
  showDeleteGallerySelector, 
  setShowDeleteGallerySelector, 
  customGalleries, 
  deleteSelectedGalleries, 
  setSubmitMessage
}) => {
  const [selectedGalleries, setSelectedGalleries] = useState([]);

  // 如果没有自定义画册，使用 useEffect 处理
  useEffect(() => {
    // 只有在用户主动打开删除画册弹窗时才检查并显示提示
    if (showDeleteGallerySelector && customGalleries.length === 0) {
      setShowDeleteGallerySelector(false);
      setSubmitMessage(' 当前没有自定义画册～ ');
    }
  }, [showDeleteGallerySelector, customGalleries.length, setShowDeleteGallerySelector, setSubmitMessage]);

  if (!showDeleteGallerySelector) return null;

  // 如果没有自定义画册，直接返回 null
  if (customGalleries.length === 0) {
    return null;
  }

  const handleCheckboxChange = (galleryId) => {
    setSelectedGalleries(prev => {
      if (prev.includes(galleryId)) {
        return prev.filter(id => id !== galleryId);
      } else {
        return [...prev, galleryId];
      }
    });
  };

  const handleDelete = () => {
    if (selectedGalleries.length === 0) {
      setSubmitMessage(' 请选择要删除的画册～ ');
      return;
    }

    // 计算删除后剩余的画册数量
    const remainingCount = customGalleries.length - selectedGalleries.length;


    deleteSelectedGalleries(selectedGalleries, customGalleries);

    if (remainingCount === 0) {
      // 如果删除了所有画册，关闭弹窗
      setSubmitMessage(' 删除成功～ ');
      setShowDeleteGallerySelector(false);
    } else {
      // 如果还有画册，清空选择状态，保持弹窗显示
      setSubmitMessage(' 删除成功～ ');
      setSelectedGalleries([]);
    }
  };

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <h3>选择要删除的画册（可多选）</h3>
        <div className="gallery-options">
          {customGalleries.map(gallery => (
            <label key={gallery.id} className="gallery-checkbox-option">
              <input 
                type="checkbox" 
                value={gallery.id}
                checked={selectedGalleries.includes(gallery.id)}
                onChange={() => handleCheckboxChange(gallery.id)}
                className="gallery-checkbox"
              />
              <span className="gallery-name">{gallery.title}</span>
              <span className="gallery-count">({gallery.images.length}张图片)</span>
            </label>
          ))}
        </div>
        <div className="selector-buttons">
          <button 
            className="delete-btn"
            onClick={handleDelete}
          >
            删除
          </button>
          <button 
            className="cancel-btn"
            onClick={() => {
              setSelectedGalleries([]);
              setShowDeleteGallerySelector(false);
            }}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGallerySelectorModal;