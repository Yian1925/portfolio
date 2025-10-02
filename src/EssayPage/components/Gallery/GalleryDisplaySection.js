import React, { useEffect, useState } from 'react';
import RollingGallery from '../../../components/RollingGallery/RollingGallery'; 

export const GalleryDisplaySection = ({
  rollingGalleryTitle,
  rollingGalleryImages,
  customGalleries,
  handleImageUploadToGallery,
  onSaveGallery,
  setSubmitMessage
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

  // 计算画册布局位置 - 根据屏幕尺寸设置不同间距
  const getGalleryPosition = (index) => {
    if (isColumnLayout) {
      // 垂直布局：根据屏幕宽度设置不同间距
      let baseTop, spacing;
      
      if (screenSize.width <= 480) {
        // 手机端间距设置
        baseTop = 1100 * responsiveScale;
        spacing = 310 * responsiveScale;
      } else if (screenSize.width <= 768) {
        // 平板端间距设置
        baseTop = 1150 * responsiveScale;
        spacing = 340 * responsiveScale;
      } else {
        // 桌面端垂直布局
        baseTop = 1200 * responsiveScale;
        spacing = 380 * responsiveScale;
      }
      
      return {
        top: baseTop + index * spacing,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${700 * responsiveScale}px`
      };
    } else {
      // 水平布局：桌面端使用
      const baseTop = 1300 * responsiveScale; 
      const spacing = 420 * responsiveScale; 
      const isLeft = index % 2 === 0; // 偶数索引在左边，奇数索引在右边
      
      return {
        top: baseTop + index * spacing,
        left: isLeft ? '7%' : `calc(93% - ${700 * responsiveScale}px)`,
        width: `${700 * responsiveScale}px`,
        transform: 'none'
      };
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: `${(750 + 50) * responsiveScale}px`, 
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400,
        width: `${700 * responsiveScale}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* 默认画册标题 */}
        <div className="gallery-title-container" style={{
          padding: `${15 * responsiveScale}px ${20 * responsiveScale}px`,
          borderRadius: `${12 * responsiveScale}px`,
          maxWidth: `${600 * responsiveScale}px`,
          minWidth: `${200 * responsiveScale}px`
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
        
        {/* 默认画册内容 - 使用CSS margin控制与标题的间距 */}
        <div className="gallery-content-container">
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
      </div>

      {/* 自定义图册 - 保持样式不变，只修改布局位置 */}
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
            {/* 自定义画册标题 - 使用CSS类控制样式和间距 */}
            <div className="gallery-title-container" style={{
              padding: `${15 * responsiveScale}px ${20 * responsiveScale}px`,
              borderRadius: `${12 * responsiveScale}px`,
              maxWidth: `${600 * responsiveScale}px`,
              minWidth: `${200 * responsiveScale}px`
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
            {/* 自定义画册内容 - 使用CSS类控制与标题的间距 */}
            <div className="gallery-content-container" style={{
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