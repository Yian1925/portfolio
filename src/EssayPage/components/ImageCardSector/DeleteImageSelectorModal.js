import React, { useState } from 'react';
import ImageSelectionModal from './ImageSelectionModal.js';

const DeleteImageSelectorModal = ({
  showDeleteImageSelector,
  setShowDeleteImageSelector,
  rollingGalleryTitle,
  rollingGalleryImages,
  customGalleries,
  setSubmitMessage,
  onDeleteImages
}) => {
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showImageSelector, setShowImageSelector] = useState(false);

  if (!showDeleteImageSelector) return null;

  const handleGallerySelect = (gallery) => {
    if (gallery === 'main' && rollingGalleryImages.length === 0) {
      setSubmitMessage(`${rollingGalleryTitle}没有图片可删除～`);
      return;
    }

    const customGallery = customGalleries.find(g => g.id === gallery.id);
    if (customGallery && customGallery.images.length === 0) {
      setSubmitMessage(`${customGallery.title}没有图片可删除～`);
      return;
    }

    setSelectedGallery(gallery);
    setShowImageSelector(true);
  };

  const handleBackToGallerySelector = () => {
    setSelectedGallery(null);
    setShowImageSelector(false);
  };

  const handleClose = () => {
    setSelectedGallery(null);
    setShowImageSelector(false);
    setShowDeleteImageSelector(false);
  };

  if (showImageSelector && selectedGallery) {
    return (
      <ImageSelectionModal
        gallery={selectedGallery}
        rollingGalleryImages={rollingGalleryImages}
        rollingGalleryTitle={rollingGalleryTitle}
        customGalleries={customGalleries}
        onBack={handleBackToGallerySelector}
        onDelete={onDeleteImages}
        onClose={handleClose}
        setSubmitMessage={setSubmitMessage}
      />
    );
  }

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <h3 className="modal-title">选择要删除图片的画册</h3>
        <div className="gallery-options">
          <button
            className="gallery-option"
            onClick={() => handleGallerySelect('main')}
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
          className="modal-btn"
          onClick={() => setShowDeleteImageSelector(false)}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default DeleteImageSelectorModal;