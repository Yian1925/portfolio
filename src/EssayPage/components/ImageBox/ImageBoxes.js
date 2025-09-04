import React from 'react';

export const ImageBoxes = ({
  imageBoxes,
  onMouseDown,
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
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            cursor: 'grab',
            userSelect: 'none',
            zIndex: 300
          }}
          onMouseDown={(e) => onMouseDown(e, 'imageBox', box.id)}
        >
          {!box.image ? (
            <div className="image-upload" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              boxSizing: 'border-box'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) onImageUpload(box.id, file);
                }}
                style={{ display: 'none' }}
                id={`image-upload-${box.id}`}
              />
              <label
                htmlFor={`image-upload-${box.id}`}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666',
                  textAlign: 'center'
                }}
              >
                点击上传图片，支持 jpeg, png, gif 
              </label>
              <button
                className="remove-card-btn"
                onClick={() => onRemoveImageBox(box.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={box.image}
                alt="uploaded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
              <button
                className="remove-image-btn"
                onClick={() => onRemoveImage(box.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};