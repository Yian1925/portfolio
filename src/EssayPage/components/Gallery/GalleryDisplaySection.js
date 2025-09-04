import React from 'react';
import RollingGallery from '../../../components/RollingGallery/RollingGallery';
// import { linearGradient } from 'framer-motion/m';
// import { degrees } from 'framer-motion';

export const GalleryDisplaySection = ({
  rollingGalleryTitle,
  rollingGalleryImages,
  customGalleries
}) => {
  return (
    <>
      {/* RollingGallery 标题 */}
      <div style={{
        position: 'absolute',
        top: '750px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400,
        textAlign: 'center'
      }}>
        <div style={{
          background: '#f1f2cf',
          padding: '15px 20px',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: '20px',
          textAlign: 'center',
          width: '300px', 
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#333',
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
        top: '820px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400,
        width: '800px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <RollingGallery 
          autoplay={true} 
          pauseOnHover={true}
          images={rollingGalleryImages}
        />
      </div>

      {/* 自定义图册 */}
      {customGalleries.map((gallery, index) => (
        <div
          key={gallery.id}
          style={{
            position: 'absolute',
            top: `${1200 + index * 420}px`,
            left: index % 2 === 0 ? '7%' : 'calc(93% - 800px)',
            width: '800px',
            zIndex: 400
          }}
        >
          <div style={{
            background: '#f1f2cf',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            marginBottom: '20px',
            textAlign: 'center',
            width: 'fit-content', // 自适应内容宽度
            margin: '0 auto 0px auto', 
            maxWidth: '600px', 
            minWidth: '200px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#333',
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
            <RollingGallery 
              autoplay={true} 
              pauseOnHover={true}
              images={gallery.images}
            />
          </div>
        </div>
      ))}
    </>
  );
};
