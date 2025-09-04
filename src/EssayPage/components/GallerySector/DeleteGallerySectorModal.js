import React from 'react';

const DeleteGallerySelectorModal = ({ 
  showDeleteGallerySelector, 
  setShowDeleteGallerySelector, 
  customGalleries, 
  deleteSelectedGalleries, 
  setSubmitMessage 
}) => {
  if (!showDeleteGallerySelector) return null;

  const handleDelete = () => {
    const checkboxes = document.querySelectorAll('.gallery-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    if (selectedIds.length > 0) {
      deleteSelectedGalleries(selectedIds);
    } else {
      setSubmitMessage(' 请选择要删除的图册～ ');
    }
  };

  return (
    <div className="gallery-selector-overlay">
      <div className="gallery-selector">
        <h3>选择要删除的图册（可多选）</h3>
        <div className="gallery-options">
          {customGalleries.map(gallery => (
            <label key={gallery.id} className="gallery-checkbox-option">
              <input 
                type="checkbox" 
                value={gallery.id}
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
            onClick={() => setShowDeleteGallerySelector(false)}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGallerySelectorModal;