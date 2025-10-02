import React from 'react';

export const ImageBoxes = ({ 
  imageBoxes, 
  onPointerDown, 
  onImageUpload, 
  onRemoveImageBox, 
  onRemoveImage 
}) => {
  return (
    <>
      {imageBoxes.map(box => (
        <div
          key={box.id}
          className="image-box"
          style={{
            position: 'absolute',
            left: box.x,
            top: box.y,
            cursor: 'grab',
            zIndex: 300
          }}
          onMouseDown={(e) => onPointerDown(e, 'imageBox', box.id)}
          onTouchStart={(e) => {
            // 只在可以阻止默认行为时才调用preventDefault
            if (e.cancelable) {
              e.preventDefault();
            }
            onPointerDown(e, 'imageBox', box.id);
          }}
        >
          {box.image ? (
            <div className="image-display">
              <img src={box.image} alt="用户上传" />
              <button
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(box.id);
                }}
                title="移除图片"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    onImageUpload(box.id, file);
                  }
                }}
                style={{ display: 'none' }}
                id={`image-upload-${box.id}`}
              />
              <label htmlFor={`image-upload-${box.id}`}>
                <p>点击上传图片</p>
                <small>支持 JPG、PNG 格式</small>
              </label>
            </div>
          )}
          
          <button
            className="remove-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImageBox(box.id);
            }}
            title="删除图片框"
          >
            x
          </button>
        </div>
      ))}
    </>
  );
};