import React, { useState, useEffect } from 'react';
import './ComicPage.css';
import RollingGallery from '../components/RollingGallery/RollingGallery';
import GallerySelectorModal from './components/GallerySector/GallerySectorModal.js';
import DeleteGallerySelectorModal from './components/GallerySector/DeleteGallerySectorModal.js';
import DeleteImageSelectorModal from './components/ImageCardSector/DeleteImageSelectorModal.js';


function ComicPage() {
  // 状态管理
  const [notes, setNotes] = useState([
    { id: 1, content: '请你永远永远，不要再光临我的夏季', x: window.innerWidth / 2 - 100, y: 200 },
    { id: 2, content: '截停一场未定的秋天', x: window.innerWidth / 2 - 50, y: 250 },
    { id: 3, content: '与我在世界的角落渺小又清晰地共振', x: window.innerWidth / 2 - 60, y: 280 },
    { id: 4, content: '无所事事的平静很珍贵', x: window.innerWidth / 2 - 40, y: 230 },
    { id: 5, content: '我特别特别喜欢散步', x: window.innerWidth / 2 - 70, y: 210 },
    { id: 6, content: '那些细小幽微的感受也同样值得被描摹', x: window.innerWidth / 2 - 80, y: 220 }
  ]);
  
  const [recordText, setRecordText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // 自定义确认对话框状态
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);
  
  // 布局保存状态
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 背景图片状态
  const [backgroundImage, setBackgroundImage] = useState('/assets/images/2.jpeg');
  
  const [recordSection, setRecordSection] = useState({ x: window.innerWidth / 2 - 200, y: 200 });
  
  // 拖拽状态
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // 图片卡片状态
  const [imageBoxes, setImageBoxes] = useState([]);
  
  // RollingGallery相关状态
  const [rollingGalleryImages, setRollingGalleryImages] = useState([]);
  const [rollingGalleryTitle, setRollingGalleryTitle] = useState('泰国旅行记录');
  const [customGalleries, setCustomGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState('main'); // 当前选中的画廊
  const [showGallerySelector, setShowGallerySelector] = useState(false); // 显示画廊选择器
  const [showDeleteGallerySelector, setShowDeleteGallerySelector] = useState(false); // 显示删除画廊选择器
  const [showDeleteImageSelector, setShowDeleteImageSelector] = useState(false); // 显示删除图片选择器
  
  // 加载保存的位置
  useEffect(() => {
    const loadPositions = () => {
      const saved = localStorage.getItem('comicPagePositions');
      if (saved) {
        try {
          const positions = JSON.parse(saved);
          setNotes(positions.notes || notes);
          setRecordSection(positions.recordSection || recordSection);
          setImageBoxes(positions.imageBoxes || []);
          setRollingGalleryImages(positions.rollingGalleryImages || []);
          setRollingGalleryTitle(positions.rollingGalleryTitle || '泰国旅行记录');
          setCustomGalleries(positions.customGalleries || []);
          setSelectedGallery(positions.selectedGallery || 'main');
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('加载位置失败:', error);
          setHasUnsavedChanges(false);
        }
      } else {
        setHasUnsavedChanges(false);
      }
    };
    loadPositions();
  }, []);

  // 自动隐藏toast
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
      }, 2000); // 2秒后自动消失

      return () => clearTimeout(timer);
    }
  }, [submitMessage]);
  
  // 保存位置到localStorage
  const savePositions = () => {
    const positions = {
      notes,
      recordSection,
      imageBoxes,
      rollingGalleryImages,
      rollingGalleryTitle,
      customGalleries,
      selectedGallery
    };
    localStorage.setItem('comicPagePositions', JSON.stringify(positions));
    setHasUnsavedChanges(false);
  };
  
  // 保存布局
  const handleSaveLayout = () => {
    if (!hasUnsavedChanges) {
      setSubmitMessage('当前布局无改动，去创造自己的世界吧！');
      return;
    }
    savePositions();
    setSubmitMessage('布局已保存！');
  };
  
  // 重置到默认布局
  const handleResetLayout = () => {
    setShowConfirmDialog(true);
    setConfirmMessage('确定要重置到默认布局吗？');
    setConfirmCallback(() => {
      const defaultNotes = [
        { id: 1, content: '请你永远永远，不要再光临我的夏季', x: window.innerWidth / 2 - 100, y: 200 },
        { id: 2, content: '截停一场未定的秋天', x: window.innerWidth / 2 - 50, y: 250 },
        { id: 3, content: '与我在世界的角落渺小又清晰地共振', x: window.innerWidth / 2 - 60, y: 280 }
      ];
      setNotes(defaultNotes);
      setRecordSection({ x: window.innerWidth / 2 - 200, y: 200 });
      setImageBoxes([]);
      setRollingGalleryImages([]);
      setRollingGalleryTitle('泰国旅行记录');
      setCustomGalleries([]);
      setSelectedGallery('main');
      localStorage.removeItem('comicPagePositions');
      setHasUnsavedChanges(false);
      setSubmitMessage('布局已重置！');
    });
  };
  
  // 提交记录
  const handleSubmitRecord = async (text) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://getform.io/f/bwnyyqna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        setSubmitMessage('记录提交成功！');
      } else {
        setSubmitMessage('记录提交失败，请重试！');
      }
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitMessage('记录提交失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 显示确认对话框
  const showConfirm = (message, callback) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setShowConfirmDialog(true);
  };
  
  // 确认对话框处理
  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
    setShowConfirmDialog(false);
  };
  
  const handleCancel = () => {
    setShowConfirmDialog(false);
  };
  
  // 拖拽相关函数
  const handleMouseDown = (e, elementType, elementId) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedElement({ type: elementType, id: elementId });
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseMove = (e) => {
    if (!draggedElement) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // 边界检查
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    if (draggedElement.type === 'note') {
      setNotes(prev => prev.map(note => 
        note.id === draggedElement.id ? { ...note, x: clampedX, y: clampedY } : note
      ));
    } else if (draggedElement.type === 'record') {
      setRecordSection({ x: clampedX, y: clampedY });
    } else if (draggedElement.type === 'imageBox') {
      setImageBoxes(prev => prev.map(box => 
        box.id === draggedElement.id ? { ...box, x: clampedX, y: clampedY } : box
      ));
    }
    
    setHasUnsavedChanges(true);
  };
  
  const handleMouseUp = () => {
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
  };
  
  // 全局鼠标事件监听
  useEffect(() => {
    if (draggedElement) {
      const handleGlobalMouseMove = (e) => {
        handleMouseMove(e);
      };
      
      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggedElement, dragOffset]);
  
  // 添加图片卡片
  const handleAddImageBox = () => {
    const newBox = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200),
      image: null,
      isFixed: false
    };
    setImageBoxes(prev => [...prev, newBox]);
    setHasUnsavedChanges(true);
  };
  
  // 删除图片卡片
  const handleRemoveImageBox = (boxId) => {
    setImageBoxes(prev => prev.filter(box => box.id !== boxId));
    setHasUnsavedChanges(true);
  };
  
  // 处理图片上传
  const handleImageUpload = (boxId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBoxes(prev => prev.map(box => 
        box.id === boxId ? { ...box, image: e.target.result } : box
      ));
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };
  
  // 删除图片
  const handleRemoveImage = (boxId) => {
    setImageBoxes(prev => prev.map(box => 
      box.id === boxId ? { ...box, image: null } : box
    ));
    setHasUnsavedChanges(true);
  };
  
  // 更换背景
  const handleChangeBackground = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBackgroundImage(e.target.result);
          setHasUnsavedChanges(true);
          setSubmitMessage('背景图片已更换！');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  
  // 添加自定义画廊
  const addCustomGallery = () => {
    const galleryName = prompt('请输入画廊名称：');
    if (galleryName && galleryName.trim()) {
      const newGallery = {
        id: Date.now(),
        title: galleryName.trim(),
        images: []
      };
      setCustomGalleries(prev => [...prev, newGallery]);
      setHasUnsavedChanges(true);
      setSubmitMessage('自定义画廊已添加！');
    } else if (galleryName !== null) {
      setSubmitMessage('画廊名称不能为空！');
    }
  };
  
  // 删除画廊
  const handleDeleteGallery = () => {
    setShowDeleteGallerySelector(true);
  };
  
  // 实际删除画廊
  const deleteSelectedGalleries = (galleryIds) => {
    setCustomGalleries(prev => prev.filter(gallery => !galleryIds.includes(gallery.id)));
    setHasUnsavedChanges(true);
    setSubmitMessage('选中的画廊已删除！');
    setShowDeleteGallerySelector(false);
  };
  
  // 删除画廊中的图片
  const handleDeleteGalleryImages = () => {
    setShowDeleteImageSelector(true);
  };
  
  // 实际删除画廊中的图片
  const deleteSelectedGalleryImages = (galleryId, imageIndexes) => {
    if (galleryId === 'main') {
      setRollingGalleryImages(prev => prev.filter((_, index) => !imageIndexes.includes(index)));
    } else {
      setCustomGalleries(prev => prev.map(gallery => 
        gallery.id === galleryId 
          ? { ...gallery, images: gallery.images.filter((_, index) => !imageIndexes.includes(index)) }
          : gallery
      ));
    }
    setHasUnsavedChanges(true);
    setSubmitMessage('选中的图片已删除！');
    setShowDeleteImageSelector(false);
  };
  
  // 处理画廊图片上传
  const handleGalleryImageUpload = () => {
    setShowGallerySelector(true);
  };
  
  // 处理图片上传到画廊
  const handleImageUploadToGallery = (galleryId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target.result;
          
          if (galleryId === 'main') {
            if (rollingGalleryImages.length < 10) {
              setRollingGalleryImages(prev => [...prev, imageData]);
            } else {
              alert('主画廊最多只能上传10张图片！');
            }
          } else {
            const gallery = customGalleries.find(g => g.id === galleryId);
            if (gallery && gallery.images.length < 10) {
              setCustomGalleries(prev => prev.map(g => 
                g.id === galleryId 
                  ? { ...g, images: [...g.images, imageData] }
                  : g
              ));
            } else {
              alert('画廊最多只能上传10张图片！');
            }
          }
        };
        reader.readAsDataURL(file);
      });
    };
    
    input.click();
    setShowGallerySelector(false);
  };

  return (
    <div className="comic-page" style={{ minHeight: '1500px' }}>
      {/* 背景层 */}
      <div 
        className="background-layer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${process.env.PUBLIC_URL}${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      />

      {/* 按钮区域 */}
      <div>
        {/* 重置按钮 */}
        <button 
          className="reset-button"
          onClick={handleResetLayout}
        >
          重置布局
        </button>

        {/* 保存布局按钮 */}
        <button 
          className="comic-save-layout-button"
          onClick={handleSaveLayout}
        >
          保存布局
        </button>

        {/* 更换背景按钮 */}
        <button 
          className="change-background-btn"
          onClick={handleChangeBackground}
        >
          更换背景
        </button>

        {/* 添加图片框按钮 */}
        <button 
          className="add-image-box-btn"
          onClick={handleAddImageBox}
        >
          添加图片框
        </button>

        {/* 上传轮播图片按钮 */}
        <button 
          className="rolling-gallery-upload-btn"
          onClick={handleGalleryImageUpload}
        >
          上传轮播图片
        </button>

        {/* 添加自定义画廊按钮 */}
        <button 
          className="add-custom-gallery-btn"
          onClick={addCustomGallery}
        >
          添加自定义画廊
        </button>

        {/* 删除画廊按钮 */}
        <button 
          className="delete-gallery-btn"
          onClick={handleDeleteGallery}
        >
          删除画廊
        </button>

        {/* 删除画廊图片按钮 */}
        <button 
          className="delete-gallery-images-btn"
          onClick={handleDeleteGalleryImages}
        >
          删除画廊图片
        </button>
      </div>

      {/* 随笔文字框 */}
      {notes.map(note => (
        <div
          key={note.id}
          className="note-box"
          style={{
            position: 'absolute',
            left: note.x,
            top: note.y,
            cursor: 'grab',
            userSelect: 'none',
            zIndex: 300
          }}
          onMouseDown={(e) => handleMouseDown(e, 'note', note.id)}
        >
          <div className="note-content">
            {note.content}
          </div>
        </div>
      ))}

      {/* 记录输入区域 */}
      <div
        className="record-section"
        style={{
          position: 'absolute',
          left: recordSection.x,
          top: recordSection.y,
          cursor: 'grab',
          zIndex: 300
        }}
        onMouseDown={(e) => {
          // 如果点击的是表单元素，不进行拖拽
          if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'FORM') {
            return;
          }
          handleMouseDown(e, 'record', 'record');
        }}
      >
        <div className="record-container">
          <h3>记录你的想法</h3>
          
          <textarea
            value={recordText}
            onChange={(e) => {
              setRecordText(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="在这里记录你的想法..."
            style={{ pointerEvents: 'auto' }}
          />
          
          <button
            onClick={() => handleSubmitRecord(recordText)}
            disabled={isSubmitting || !recordText.trim()}
            style={{ pointerEvents: 'auto' }}
          >
            {isSubmitting ? '提交中...' : '保存记录'}
          </button>
        </div>
      </div>

      {/* 图片卡片 */}
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
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'grab',
            userSelect: 'none',
            zIndex: 300
          }}
          onMouseDown={(e) => handleMouseDown(e, 'imageBox', box.id)}
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
                  if (file) handleImageUpload(box.id, file);
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
                点击上传图片
              </label>
              <button
                className="remove-card-btn"
                onClick={() => handleRemoveImageBox(box.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="image-display" style={{
              width: '100%',
              height: '100%',
              position: 'relative'
            }}>
              <img
                src={box.image}
                alt="上传的图片"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
              <button
                className="remove-image-btn"
                onClick={() => handleRemoveImage(box.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      ))}

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
          background: 'rgba(255, 255, 255, 0.95)',
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

      {/* 自定义画廊 */}
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
            background: 'rgba(255, 255, 255, 0.95)',
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

      {/* 画廊选择器 */}
      <GallerySelectorModal
        showGallerySelector={showGallerySelector}
        setShowGallerySelector={setShowGallerySelector}
        rollingGalleryTitle={rollingGalleryTitle}
        rollingGalleryImages={rollingGalleryImages}
        customGalleries={customGalleries}
        handleImageUploadToGallery={handleImageUploadToGallery}
      />

      {/* 删除画廊选择器 */}
      <DeleteGallerySelectorModal
        showDeleteGallerySelector={showDeleteGallerySelector}
        setShowDeleteGallerySelector={setShowDeleteGallerySelector}
        customGalleries={customGalleries}
        deleteSelectedGalleries={deleteSelectedGalleries}
        setSubmitMessage={setSubmitMessage}
      />

      {/* 删除图片选择器 */}
      <DeleteImageSelectorModal
      showDeleteImageSelector={showDeleteImageSelector}
      setShowDeleteImageSelector={setShowDeleteImageSelector}
      rollingGalleryTitle={rollingGalleryTitle}
      rollingGalleryImages={rollingGalleryImages}
      customGalleries={customGalleries}
      setSubmitMessage={setSubmitMessage}
      />

      {/* Toast 提示 */}
      {submitMessage && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000000,
          background: '#fff3cd',
          color: '#856404',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          fontSize: '16px',
          fontWeight: '500',
          textAlign: 'center',
          minWidth: '200px',
          maxWidth: '400px',
          wordWrap: 'break-word'
        }}>
          {submitMessage}
        </div>
      )}

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000
        }}>
          <div style={{
            background: '#fff3cd',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <p style={{
              margin: '0 0 25px 0',
              fontSize: '18px',
              color: '#856404',
              fontWeight: '500',
              lineHeight: '1.5'
            }}>
              {confirmMessage}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleConfirm}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#c82333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#dc3545';
                }}
              >
                确认
              </button>
              
              <button
                onClick={handleCancel}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#5a6268';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#6c757d';
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComicPage;