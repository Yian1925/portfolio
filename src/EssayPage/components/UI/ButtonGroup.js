import React from 'react';

export const ButtonGroup = ({
  onResetLayout,
  onSaveLayout,
  onChangeBackground,
  onAddImageBox,
  onGalleryImageUpload,
  onAddCustomGallery,
  onDeleteGallery,
  onDeleteGalleryImages
}) => {
  return (
    <div>
      {/* 重置按钮 */}
      <button 
        className="reset-button"
        onClick={onResetLayout}
      >
        重置布局
      </button>

      {/* 保存布局按钮 */}
      <button 
        className="essay-save-layout-button"
        onClick={onSaveLayout}
      >
        保存布局
      </button>

      {/* 更换背景按钮 */}
      <button 
        className="change-background-btn"
        onClick={onChangeBackground}
      >
        更换背景
      </button>

      {/* 添加图片框按钮 */}
      <button 
        className="add-image-box-btn"
        onClick={onAddImageBox}
      >
        添加图片框
      </button>

      {/* 上传轮播图片按钮 */}
      <button 
        className="rolling-gallery-upload-btn"
        onClick={onGalleryImageUpload}
      >
        上传图集
      </button>

      {/* 添加自定义画册按钮 */}
      <button 
        className="add-custom-gallery-btn"
        onClick={onAddCustomGallery}
      >
        添加画册
      </button>

      {/* 删除画册按钮 */}
      <button 
        className="delete-gallery-btn"
        onClick={onDeleteGallery}
      >
        删除画册
      </button>

      {/* 删除画册图集按钮 */}
      <button 
        className="delete-gallery-images-btn"
        onClick={onDeleteGalleryImages}
      >
        删除画册图集
      </button>
    </div>
  );
};