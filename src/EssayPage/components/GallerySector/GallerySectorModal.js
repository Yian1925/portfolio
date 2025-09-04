import React from 'react';

const GallerySelectorModal = ({ 
  showGallerySelector, 
  setShowGallerySelector, 
  rollingGalleryTitle, 
  rollingGalleryImages, 
  customGalleries, 
  handleImageUploadToGallery 
}) => {
  if (!showGallerySelector) return null;

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <h3>选择要上传图片的画册</h3>
        <div className="gallery-options">
          <button 
            className="gallery-option"
            onClick={() => handleImageUploadToGallery('main', customGalleries)}
          >
            <span className="gallery-name">主画册：{rollingGalleryTitle}</span>
            <span className="gallery-count">({rollingGalleryImages.length}/10)</span>
          </button>
          {customGalleries.map(gallery => (
            <button 
              key={gallery.id}
              className="gallery-option"
              onClick={() => handleImageUploadToGallery(gallery.id, customGalleries)}
            >
              <span className="gallery-name">{gallery.title}</span>
              <span className="gallery-count">({gallery.images.length}/10)</span>
            </button>
          ))}
        </div>
        <button 
          className="cancel-btn"
          onClick={() => setShowGallerySelector(false)}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default GallerySelectorModal;