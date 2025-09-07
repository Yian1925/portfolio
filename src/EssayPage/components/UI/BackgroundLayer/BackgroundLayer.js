import React from 'react';

export const BackgroundLayer = ({ backgroundImage, currentTheme }) => {
  // 检查是否有用户自定义背景图片（排除默认图片）
  const hasCustomBackground = backgroundImage &&
    backgroundImage !== '/assets/images/2.jpeg' &&
    typeof backgroundImage === 'string' &&
    (backgroundImage.startsWith('data:') || backgroundImage.startsWith('blob:')); // 支持用户上传的图片

  // 如果没有自定义背景，背景层完全透明，让主题背景显示
  if (!hasCustomBackground) {
    return null;
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
