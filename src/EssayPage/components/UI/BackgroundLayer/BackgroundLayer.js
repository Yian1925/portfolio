import React from 'react';

export const BackgroundLayer = ({ backgroundImage, currentTheme }) => {
  // 检查是否有用户自定义背景图片（排除默认图片）
  const hasCustomBackground = backgroundImage &&
    backgroundImage !== '/assets/images/2.jpeg' &&
    backgroundImage.startsWith('data:'); // 只处理用户上传的图片

  // 如果没有自定义背景，背景层完全透明，不影响主题背景
  if (!hasCustomBackground) {
    return null;
    // return (
    //   <div className="background-layer" style={{ background: 'transparent' }} />
    // );
  }

  // 如果有自定义背景，显示用户图片
  return (
    <div
      className="background-layer"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    />
  );
};
