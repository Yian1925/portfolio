import React, { useEffect, useState } from 'react';
import RollingGallery from '../../../components/RollingGallery/RollingGallery';

export const GalleryDisplaySection = ({
  rollingGalleryTitle,
  rollingGalleryImages,
  customGalleries
}) => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isColumnLayout, setIsColumnLayout] = useState(false);
  const [responsiveScale, setResponsiveScale] = useState(1);

  // 响应式布局检测
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // 小屏幕使用垂直布局
      setIsColumnLayout(width <= 768);
      
      // 计算缩放比例
      let scale = 1;
      if (width <= 480) {
        scale = 0.7; // 小屏幕缩小到70%
      } else if (width <= 768) {
        scale = 0.8; // 平板缩小到80%
      } else if (width <= 1024) {
        scale = 0.9; // 中等屏幕缩小到90%
      }
      
      setResponsiveScale(scale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 计算画册布局位置
  const getGalleryPosition = (index) => {
    if (isColumnLayout) {
      // 垂直布局
      const baseTop = 1100 * responsiveScale;
      const spacing = 350 * responsiveScale;
      return {
        top: baseTop + index * spacing,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${700 * responsiveScale}px`
      };
    } else {
      // 水平布局
      const baseTop = 1200 * responsiveScale;
      const spacing = 420 * responsiveScale;
      const isLeft = index % 2 === 0;
      
      return {
        top: baseTop + Math.floor(index / 2) * spacing,
        left: isLeft ? '7%' : `calc(93% - ${700 * responsiveScale}px)`,
        width: `${700 * responsiveScale}px`
      };
    }
  };

  return (
    <>
      {/* RollingGallery 标题 */}
      <div style={{
        position: 'absolute',
        top: `${750 * responsiveScale}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400,
        textAlign: 'center'
      }}>
        <div style={{
          background: 'var(--theme-bg-primary)',
          padding: `${15 * responsiveScale}px ${20 * responsiveScale}px`,
          borderRadius: `${12 * responsiveScale}px`,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: `${20 * responsiveScale}px`,
          textAlign: 'center',
          width: `${300 * responsiveScale}px`,
          transform: `scale(${responsiveScale})`,
          transformOrigin: 'center'
        }}>
          <h2 style={{
            fontSize: `${36 * responsiveScale}px`,
            fontWeight: 'bold',
            color: 'var(--theme-text-primary)',
            margin: '0',
            textAlign: 'center'
          }}>
            {rollingGalleryTitle}
          </h2>
        </div>
      </div>

      {/* RollingGallery 组件 */}
      <div style={{
        position: 'absolute',
        top: `${820 * responsiveScale}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400,
        width: `${700 * responsiveScale}px`,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          transform: `scale(${responsiveScale})`,
          transformOrigin: 'center'
        }}>
          <RollingGallery 
            autoplay={true} 
            pauseOnHover={true}
            images={rollingGalleryImages}
          />
        </div>
      </div>

      {/* 自定义图册 */}
      {customGalleries.map((gallery, index) => {
        const position = getGalleryPosition(index);
        
        return (
          <div
            key={gallery.id}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 400,
              transform: position.transform || 'none'
            }}
          >
            <div style={{
              background: 'var(--theme-bg-primary)',
              padding: `${15 * responsiveScale}px ${20 * responsiveScale}px`,
              borderRadius: `${12 * responsiveScale}px`,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
              marginBottom: `${20 * responsiveScale}px`,
              textAlign: 'center',
              width: 'fit-content',
              margin: '0 auto 0px auto',
              maxWidth: `${600 * responsiveScale}px`,
              minWidth: `${200 * responsiveScale}px`,
              transform: `scale(${responsiveScale})`,
              transformOrigin: 'center'
            }}>
              <h2 style={{
                fontSize: `${36 * responsiveScale}px`,
                fontWeight: 'bold',
                color: 'var(--theme-text-primary)',
                margin: '0',
                textAlign: 'center'
              }}>
                {gallery.title}
              </h2>
            </div>
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{
                transform: `scale(${responsiveScale})`,
                transformOrigin: 'center'
              }}>
                <RollingGallery 
                  autoplay={true} 
                  pauseOnHover={true}
                  images={gallery.images}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};