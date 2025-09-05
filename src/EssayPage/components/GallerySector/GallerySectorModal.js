import React, { useState } from 'react';

const GallerySelectorModal = ({ 
  showGallerySelector, 
  setShowGallerySelector, 
  rollingGalleryTitle, 
  rollingGalleryImages, 
  customGalleries, 
  handleImageUploadToGallery,
  onSaveGallery,  // 添加保存回调
  setSubmitMessage  // 添加消息回调
}) => {
  const [selectedGallery, setSelectedGallery] = useState(null);

  if (!showGallerySelector) return null;

  // 处理画册选择
  const handleGallerySelect = (galleryId) => {
    setSelectedGallery(galleryId);
    // 这里可以立即调用图片上传
    handleImageUploadToGallery(galleryId, customGalleries, rollingGalleryImages);
  };

  // 处理保存画册
  const handleSaveGallery = async () => {
    if (!selectedGallery) {
      setSubmitMessage('请先选择画册～');
      return;
    }

    try {
      // 获取当前画册的图片数据
      let galleryImages = [];
      if (selectedGallery === 'main') {
        galleryImages = rollingGalleryImages;
      } else {
        const gallery = customGalleries.find(g => g.id === selectedGallery);
        galleryImages = gallery ? gallery.images : [];
      }

      await onSaveGallery(selectedGallery, galleryImages);
      setSubmitMessage('画册保存成功～');
      setShowGallerySelector(false);
    } catch (error) {
      setSubmitMessage('画册保存失败～');
    }
  };

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <h3>选择要上传图片的画册</h3>
        <div className="gallery-options">
          <button 
            className="gallery-option"
            onClick={() => handleGallerySelect('main')}
          >
            <span className="gallery-name">主画册：{rollingGalleryTitle}</span>
            <span className="gallery-count">({rollingGalleryImages.length}/10)</span>
          </button>
          {customGalleries.map(gallery => (
            <button 
              key={gallery.id}
              className="gallery-option"
              onClick={() => handleGallerySelect(gallery.id)}
            >
              <span className="gallery-name">{gallery.title}</span>
              <span className="gallery-count">({gallery.images.length}/10)</span>
            </button>
          ))}
        </div>
        
        {/* 添加保存和取消按钮区域 */}
        <div className="selector-buttons">
          <button 
            className="save-btn"
            onClick={handleSaveGallery}
          >
            保存
          </button>
          <button 
            className="cancel-btn"
            onClick={() => setShowGallerySelector(false)}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default GallerySelectorModal;