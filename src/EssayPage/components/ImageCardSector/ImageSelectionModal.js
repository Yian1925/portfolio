import React, { useState, useEffect } from 'react';

const ImageSelectionModal = ({
  gallery,
  rollingGalleryImages,
  rollingGalleryTitle,
  customGalleries,
  onBack,
  onDelete,
  onClose,
  setSubmitMessage
}) => {
  const [selectedImages, setSelectedImages] = useState([]);

  // 获取当前画册的图片
  const getGalleryImages = () => {
    if (gallery === 'main') {
      return rollingGalleryImages;
    } else {
      const customGallery = customGalleries.find(g => g.id === gallery.id);
      return customGallery ? customGallery.images : [];
    }
  };

  const galleryImages = getGalleryImages();
  const galleryTitle = gallery === 'main' ? rollingGalleryTitle : gallery.title;

  // 当图片变化时，清空选择状态（防止选择不存在的图片）
  useEffect(() => {
    if (selectedImages.some(index => index >= galleryImages.length)) {
      setSelectedImages([]);
    }
  }, [selectedImages, galleryImages.length]);

  const handleImageSelect = (imageIndex) => {
    setSelectedImages(prev => {
      if (prev.includes(imageIndex)) {
        return prev.filter(idx => idx !== imageIndex);
      } else {
        return [...prev, imageIndex];
      }
    });
  };

  const handleDelete = () => {
    if (selectedImages.length === 0) {
      setSubmitMessage(' 请选择要删除的图片～ ');
      return;
    }

    // 计算删除后剩余的图片数量
    const remainingCount = galleryImages.length - selectedImages.length;

    const galleryId = gallery === 'main' ? 'main' : gallery.id;
    onDelete(galleryId, selectedImages);

    if (remainingCount === 0) {
      // 如果删除了所有图片，返回上一级弹窗
      setSubmitMessage(' 图片删除成功～ ');
      onBack();
    } else {
      // 如果还有图片，清空选择状态，保持弹窗显示
      setSubmitMessage(' 图片删除成功～ ');
      setSelectedImages([]);
    }
  };

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <div className="modal-header">
          <button className="back-btn" onClick={onBack}>返回</button>
          <h3>选择要删除的图片</h3>
        </div>

        <div className="image-selection-grid">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`image-item ${selectedImages.includes(index) ? 'selected' : ''}`}
              onClick={() => handleImageSelect(index)}
            >
              <img src={image} alt={`图片 ${index + 1}`} />
              <div className="image-overlay">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(index)}
                  readOnly
                />
              </div>
            </div>
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
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectionModal;