import React, { useState, useEffect, useRef } from 'react';

export const ButtonGroup = ({
  onResetLayout,
  onSaveLayout,
  onChangeBackground,
  onAddImageBox,
  onGalleryImageUpload,
  onAddCustomGallery,
  onDeleteGallery,
  onDeleteGalleryImages,
  onAddNoteBox,
  onDeleteNoteBox,
  onThemeChange,
  currentTheme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleButtonClick = (callback) => {
    callback();
    // 不立即关闭菜单，让用户可以看到操作反馈
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef}>
      {/* 汉堡菜单按钮 - 只在移动端显示 */}
      <button 
        className="hamburger-menu-btn"
        onClick={toggleMenu}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* 按钮容器 */}
      <div className={`button-container ${isMenuOpen ? 'menu-open' : ''}`}>
        {/* 切换主题按钮 - 只在移动端汉堡菜单中显示 */}
        <button 
          className="theme-switch-mobile-btn"
          onClick={() => handleButtonClick(() => {
            const themes = ['default', 'pink', 'purple', 'yellow', 'green'];
            const currentIndex = themes.findIndex(t => t === currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            onThemeChange(nextTheme);
          })}
        >
          切换主题
        </button>

        {/* 更换背景按钮 */}
        <button 
          className="change-background-btn"
          onClick={() => handleButtonClick(onChangeBackground)}
        >
          更换背景
        </button>

        {/* 重置按钮 */}
        <button 
          className="reset-button"
          onClick={() => handleButtonClick(onResetLayout)}
        >
          重置布局
        </button>

        {/* 保存布局按钮 */}
        <button 
          className="essay-save-layout-button"
          onClick={() => handleButtonClick(onSaveLayout)}
        >
          保存布局
        </button>

        {/* 添加图片框按钮 */}
        <button 
          className="add-image-box-btn"
          onClick={() => handleButtonClick(onAddImageBox)}
        >
          添加图框
        </button>

        {/* 添加自定义画册按钮 */}
        <button 
          className="add-custom-gallery-btn"
          onClick={() => handleButtonClick(onAddCustomGallery)}
        >
          添加画册
        </button>

        {/* 删除画册按钮 */}
        <button 
          className="delete-gallery-btn"
          onClick={() => handleButtonClick(onDeleteGallery)}
        >
          删除画册
        </button>

        {/* 上传轮播图片按钮 */}
        <button 
          className="rolling-gallery-upload-btn"
          onClick={() => handleButtonClick(onGalleryImageUpload)}
        >
          上传图集
        </button>

        {/* 删除画册图集按钮 */}
        <button 
          className="delete-gallery-images-btn"
          onClick={() => handleButtonClick(onDeleteGalleryImages)}
        >
          删除图集
        </button>

        {/* 添加note-box按钮 */}
        <button 
          className="add-note-box-btn"
          onClick={() => handleButtonClick(onAddNoteBox)}
        >
          添加便签
        </button>

        {/* 删除note-box按钮 */}
        <button 
          className="delete-note-box-btn"
          onClick={() => handleButtonClick(onDeleteNoteBox)}
        >
          删除便签
        </button>
      </div>
    </div>
  );
};