import React from 'react';

const DeleteImageSelectorModal = ({
  showDeleteImageSelector,
  setShowDeleteImageSelector,
  rollingGalleryTitle,
  rollingGalleryImages,
  customGalleries,
  setSubmitMessage
}) => {
  if (!showDeleteImageSelector) return null;

  const handleGallerySelect = (gallery) => {
    if (gallery.images.length === 0) {
      setSubmitMessage(`${gallery.title}没有图片可删除！`);
      return;
    }
    setShowDeleteImageSelector(false);
    setSubmitMessage(' 请选择要删除的图片噢～ ');
    // 这里可以添加打开图片选择界面的逻辑
  };

  const handleMainGallerySelect = () => {
    if (rollingGalleryImages.length === 0) {
      setSubmitMessage(' 主画册没有图片可删除～ ');
      return;
    }
    setShowDeleteImageSelector(false);
    setSubmitMessage(' 请选择要删除的图片～ ');
    // 这里可以添加打开图片选择界面的逻辑
  };

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <h3>选择要删除图片的画册</h3>
        <div className="gallery-options">
          <button 
            className="gallery-option"
            onClick={handleMainGallerySelect}
          >
            <span className="gallery-name">主画册：{rollingGalleryTitle}</span>
            <span className="gallery-count">({rollingGalleryImages.length}张图片)</span>
          </button>
          {customGalleries.map(gallery => (
            <button 
              key={gallery.id}
              className="gallery-option"
              onClick={() => handleGallerySelect(gallery)}
            >
              <span className="gallery-name">{gallery.title}</span>
              <span className="gallery-count">({gallery.images.length}张图片)</span>
            </button>
          ))}
        </div>
        <button 
          className="cancel-btn"
          onClick={() => setShowDeleteImageSelector(false)}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default DeleteImageSelectorModal;