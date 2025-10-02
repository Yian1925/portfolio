import { useState, useEffect } from 'react';

export const useEssayState = () => {
  const getDefaultNotes = () => {
    // 使用相对位置，避免在初始化时依赖window.innerWidth
    // 这些位置会在NoteBoxes组件中根据实际屏幕尺寸调整
    const baseWidth = 1200; // 基准屏幕宽度
    return [
      { id: 1, content: '请你永远永远，不要再光临我的夏季', x: baseWidth / 2 - 400, y: 60 },
      { id: 2, content: '截停一场未定的秋天', x: baseWidth / 2 + 240, y: 30 },
      { id: 3, content: '与我在世界的角落渺小又清晰地共振', x: baseWidth / 2 - 700, y: 160 },
      { id: 4, content: '无所事事的平静很珍贵', x: baseWidth / 2 - 640, y: 500 },
      { id: 5, content: '我特别特别喜欢散步', x: baseWidth / 2 - 560, y: 330 },
      { id: 6, content: '那些细小幽微的感受也同样值得被描摹', x: baseWidth / 2 - 100, y: 110 },
      { id: 7, content: '世界温和，大道光明', x: baseWidth / 2 - 650, y: 40 },
      { id: 8, content: '梧桐大道', x: baseWidth / 2 + 400, y: 120 }
    ];
  };

  const [notes, setNotes] = useState(getDefaultNotes());
  const [recordText, setRecordText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/assets/images/2.jpeg');
  const [recordSection, setRecordSection] = useState(() => {
    // 延迟计算初始位置，确保在组件挂载后计算
    return { x: 0, y: 240 }; // x会在RecordSection组件中重新计算
  });
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [imageBoxes, setImageBoxes] = useState([]);
  const [rollingGalleryImages, setRollingGalleryImages] = useState([]);
  const [rollingGalleryTitle, setRollingGalleryTitle] = useState('✨ 日常注脚 ✨');
  const [customGalleries, setCustomGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState('main');
  const [showGallerySelector, setShowGallerySelector] = useState(false);
  const [showDeleteGallerySelector, setShowDeleteGallerySelector] = useState(false);
  const [showDeleteImageSelector, setShowDeleteImageSelector] = useState(false);

  // 主题相关状态 - 从localStorage获取初始主题，避免默认主题闪烁
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('essayPagePositions');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentTheme || 'default';
      }
    } catch (error) {
      console.error('获取初始主题失败:', error);
    }
    return 'default';
  });

  // 添加屏幕尺寸和响应式缩放状态
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [responsiveScale, setResponsiveScale] = useState(1);

  // IndexedDB初始化
  const initDB = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EssayPageDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 创建布局存储
        if (!db.objectStoreNames.contains('layouts')) {
          db.createObjectStore('layouts', { keyPath: 'id' });
        }
        
        // 创建图片存储
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
      };
    });
  };

  // IndexedDB保存函数
  // 保存布局到 layouts
  const saveLayoutToIndexedDB = async (key, layoutData) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['layouts'], 'readwrite');
      const store = transaction.objectStore('layouts');
      const request = store.put({ id: key, data: layoutData, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  // 保存图片到 images
  const saveImageToIndexedDB = async (imgKey, imgData) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.put({ id: imgKey, data: imgData, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      console.log('保存图片', imgKey, typeof imgData, imgData && imgData.length);
    });
  };

  // IndexedDB读取函数
  // 读取布局
  const loadLayoutFromIndexedDB = async (key = 'essayPagePositions') => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['layouts'], 'readonly');
      const store = transaction.objectStore('layouts');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  };

  // 读取图片
  const loadImageFromIndexedDB = async (imgKey) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(imgKey);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  };

  const deleteImageFromIndexedDB = async (imgKey) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    const request = store.delete(imgKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    });
  };

  // 屏幕尺寸变化监听和响应式调整
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setScreenSize({ width: newWidth, height: newHeight });
      
      // 计算响应式缩放因子
      let scale = 1;
      if (newWidth <= 480) {
        scale = 0.6;
      } else if (newWidth <= 768) {
        scale = 0.75;
      } else if (newWidth <= 1024) {
        scale = 0.85;
      }
      
      setResponsiveScale(scale);
      
      // 重新计算note位置以避免重叠
      adjustNotesForScreenSize(scale, newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 避免重叠的位置调整函数
  const adjustNotesForScreenSize = (scale, screenWidth, screenHeight) => {
    setNotes(prevNotes => {
      const adjustedNotes = [...prevNotes];
      const noteSpacing = 120 * scale; // 根据缩放调整间距
      const margin = 20 * scale;
      
      // 定义安全区域
      const safeArea = {
        left: margin,
        right: screenWidth - margin,
        top: margin,
        bottom: screenHeight - margin
      };
      
      // 重新排列notes位置
      adjustedNotes.forEach((note, index) => {
        let newX = note.x * scale;
        let newY = note.y * scale;
        
        // 确保在安全区域内
        newX = Math.max(safeArea.left, Math.min(newX, safeArea.right - 200 * scale));
        newY = Math.max(safeArea.top, Math.min(newY, safeArea.bottom - 100 * scale));
        
        // 检查与其他notes的重叠
        let overlap = true;
        let attempts = 0;
        const maxAttempts = 50;
        
        while (overlap && attempts < maxAttempts) {
          overlap = false;
          
          for (let i = 0; i < index; i++) {
            const otherNote = adjustedNotes[i];
            const distance = Math.sqrt(
              Math.pow(newX - otherNote.x * scale, 2) + 
              Math.pow(newY - otherNote.y * scale, 2)
            );
            
            if (distance < noteSpacing) {
              overlap = true;
              
              // 尝试新的位置
              const angle = Math.random() * Math.PI * 2;
              const radius = noteSpacing + Math.random() * 50;
              newX += Math.cos(angle) * radius;
              newY += Math.sin(angle) * radius;
              
              // 再次检查边界
              newX = Math.max(safeArea.left, Math.min(newX, safeArea.right - 200 * scale));
              newY = Math.max(safeArea.top, Math.min(newY, safeArea.bottom - 100 * scale));
              
              break;
            }
          }
          
          attempts++;
        }
        
        adjustedNotes[index] = {
          ...note,
          x: Math.round(newX),
          y: Math.round(newY)
        };
      });
      
      return adjustedNotes;
    });
  };

  // 加载保存的位置 - 使用IndexedDB
  useEffect(() => {
  const loadPositions = async () => {
    try {
      // 优先从IndexedDB获取
      const saved = await loadLayoutFromIndexedDB('essayPagePositions');
      
      console.log('加载保存的布局数据:', saved);
      
      if (!saved) {
        console.log('没有找到保存的布局数据，使用默认布局');
        setHasUnsavedChanges(false);
        return;
      }

      // 恢复布局数据
      setNotes(saved.notes || getDefaultNotes());
      setRecordSection(saved.recordSection || { x: 0, y: 240 });
      setImageBoxes(saved.imageBoxes || []);
      setRollingGalleryImages(saved.rollingGalleryImages || []);
      setRollingGalleryTitle(saved.rollingGalleryTitle || '✨ 日常注脚 ✨');
      setCustomGalleries(saved.customGalleries || []);
      setSelectedGallery(saved.selectedGallery || 'main');
      // 确保 backgroundImage 是字符串类型
      const bgImage = saved.backgroundImage;
      if (typeof bgImage === 'object' && bgImage !== null) {
        // 如果是对象，使用默认背景
        setBackgroundImage('/assets/images/2.jpeg');
      } else {
        setBackgroundImage(bgImage || '/assets/images/2.jpeg');
      }
      setCurrentTheme(saved.currentTheme || 'default');
      
      // 加载背景图片（优先加载）
      try {
        const bgImageData = await loadImageFromIndexedDB('background_img');
        if (bgImageData) {
          console.log('背景图片加载成功');
          setBackgroundImage(bgImageData);
        } else {
          console.log('没有找到保存的背景图片');
        }
      } catch (error) {
        console.error('加载背景图片失败:', error);
      }
      
      // 加载图片框图片数据
      if (saved.imageBoxes && Array.isArray(saved.imageBoxes)) {
        for (let i = 0; i < saved.imageBoxes.length; i++) {
          try {
            const box = saved.imageBoxes[i];
            if (box && box.hasImage) {
              const imageData = await loadImageFromIndexedDB(`img_${box.id}`);
              if (imageData) {
                saved.imageBoxes[i].image = imageData;
              }
            }
          } catch (error) {
            console.error(`加载图片框 ${i} 的图片失败:`, error);
          }
        }
        // 更新图片框状态
        setImageBoxes([...saved.imageBoxes]);
      }
      
      // 加载滚动画廊图片数据
      if (saved.rollingGalleryImages && Array.isArray(saved.rollingGalleryImages)) {
        for (let i = 0; i < saved.rollingGalleryImages.length; i++) {
          try {
            const imgRef = saved.rollingGalleryImages[i];
            if (imgRef && imgRef.hasImage) {
              const imageData = await loadImageFromIndexedDB(`rolling_img_${i}`);
              if (imageData) {
                saved.rollingGalleryImages[i] = imageData;
              }
            }
          } catch (error) {
            console.error(`加载滚动图片 ${i} 失败:`, error);
          }
        }
        // 更新滚动画廊状态
        setRollingGalleryImages([...saved.rollingGalleryImages]);
      }
      
      // 加载自定义画册图片数据
      if (saved.customGalleries && Array.isArray(saved.customGalleries)) {
        for (const gallery of saved.customGalleries) {
          for (let index = 0; index < gallery.images.length; index++) {
            try {
              const imgRef = gallery.images[index];
              if (imgRef && imgRef.hasImage) {
                const imageData = await loadImageFromIndexedDB(`gallery_${gallery.id}_img_${index}`);
                if (imageData) {
                  gallery.images[index] = imageData;
                }
              }
            } catch (error) {
              console.error(`加载自定义画册 ${gallery.id} 图片 ${index} 失败:`, error);
            }
          }
        }
        // 更新自定义画册状态
        setCustomGalleries([...saved.customGalleries]);
      }
      
      // 确保所有状态都已正确设置后再标记为无未保存更改
      setHasUnsavedChanges(false);
      
    } catch (error) {
      console.error('IndexedDB加载失败:', error);
      // 降级到localStorage
      const localSaved = localStorage.getItem('essayPagePositions');
      if (localSaved) {
        try {
          const positions = JSON.parse(localSaved);
          setNotes(positions.notes || getDefaultNotes());
          setRecordSection(positions.recordSection || { x: 0, y: 240 });
          setImageBoxes(positions.imageBoxes || []);
          setRollingGalleryImages(positions.rollingGalleryImages || []);
          setRollingGalleryTitle(positions.rollingGalleryTitle || '✨ 日常注脚 ✨');
          setCustomGalleries(positions.customGalleries || []);
          setSelectedGallery(positions.selectedGallery || 'main');
          // 确保 backgroundImage 是字符串类型
          const bgImage = positions.backgroundImage;
          if (typeof bgImage === 'object' && bgImage !== null) {
            // 如果是对象，使用默认背景
            setBackgroundImage('/assets/images/2.jpeg');
          } else {
            setBackgroundImage(bgImage || '/assets/images/2.jpeg');
          }
          setCurrentTheme(positions.currentTheme || 'default');
          setHasUnsavedChanges(false);
        } catch (localError) {
          console.error('localStorage加载失败:', localError);
          setHasUnsavedChanges(false);
        }
      } else {
        setHasUnsavedChanges(false);
      }
    }
  };
  
  loadPositions();
}, []); // eslint-disable-line react-hooks/exhaustive-deps
  // 自动隐藏toast
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  // 保存位置到IndexedDB
  const savePositions = async () => {
    try {
      // 压缩数据：只保存图片引用，不保存完整图片数据
      const compressedData = {
        notes,
        recordSection,
        imageBoxes: imageBoxes.map(box => ({
          id: box.id,
          x: box.x,
          y: box.y,
          hasImage: !!box.image,
          imageSize: box.image ? box.image.length : 0
        })),
        rollingGalleryImages: rollingGalleryImages.map((img, index) => ({
          index,
          hasImage: !!img,
          imageSize: img ? img.length : 0
        })),
        rollingGalleryTitle,
        customGalleries: customGalleries.map(gallery => ({
          id: gallery.id,
          title: gallery.title,
          images: gallery.images.map((img, index) => ({
            index,
            hasImage: !!img,
            imageSize: img ? img.length : 0
          }))
        })),
        selectedGallery,
        backgroundImage: backgroundImage, // 直接保存字符串，不转换为对象
        currentTheme,
        timestamp: new Date().toISOString()
      };
      
      // 保存压缩数据到IndexedDB
      await saveLayoutToIndexedDB('essayPagePositions', compressedData);
      
      // 单独保存图片数据
      for (let i = 0; i < imageBoxes.length; i++) {
        const box = imageBoxes[i];
        if (box.image) {
          await saveImageToIndexedDB(`img_${box.id}`, box.image);
        }
      }
      
      for (let i = 0; i < rollingGalleryImages.length; i++) {
        const img = rollingGalleryImages[i];
        if (img) {
          await saveImageToIndexedDB(`rolling_img_${i}`, img);
        }
      }
      
      // 保存自定义画册图片
      for (const gallery of customGalleries) {
        for (let index = 0; index < gallery.images.length; index++) {
          const img = gallery.images[index];
          if (img) {
            await saveImageToIndexedDB(`gallery_${gallery.id}_img_${index}`, img);
          }
        }
      }
      
      if (backgroundImage && backgroundImage.startsWith('data:')) {
        await saveImageToIndexedDB('background_img', backgroundImage);
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('IndexedDB保存失败:', error);
      
      // 降级到localStorage，但只保存布局信息
      try {
        const layoutOnly = {
          notes,
          recordSection,
          rollingGalleryTitle,
          selectedGallery,
          currentTheme,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('essayPageLayout_backup', JSON.stringify(layoutOnly));
        setSubmitMessage('IndexedDB保存失败，已保存基础布局到本地存储～');
        setHasUnsavedChanges(false);
      } catch (localError) {
        setSubmitMessage('存储空间严重不足，请清理数据后重试～');
      }
    }
  };

  // 保存布局
  const handleSaveLayout = async () => {
    if (!hasUnsavedChanges) {
      setSubmitMessage(' 当前布局无改动噢～ ');
      return;
    }
    
    console.log('开始保存布局，当前状态:', {
      notes: notes.length,
      imageBoxes: imageBoxes.length,
      rollingGalleryImages: rollingGalleryImages.length,
      customGalleries: customGalleries.length,
      recordSection: recordSection
    });
    
    await savePositions();
    setSubmitMessage(' 自定义布局已保存！');
  };

  const handleSaveImages = async () => {
  try {
    // 保存所有图片框图片
    for (let i = 0; i < imageBoxes.length; i++) {
      const box = imageBoxes[i];
      if (box.image) {
        await saveImageToIndexedDB(`img_${box.id}`, box.image);
      }
    }
    // 保存滚动画廊图片
    for (let i = 0; i < rollingGalleryImages.length; i++) {
      const img = rollingGalleryImages[i];
      if (img) {
        await saveImageToIndexedDB(`rolling_img_${i}`, img);
      }
    }
    // 保存自定义画廊图片
    for (const gallery of customGalleries) {
      for (let index = 0; index < gallery.images.length; index++) {
        const img = gallery.images[index];
        if (img) {
          await saveImageToIndexedDB(`gallery_${gallery.id}_img_${index}`, img); // 修正
        }
      }
    }
    // 保存背景图片（如有）
    if (backgroundImage && backgroundImage.startsWith('data:')) {
      await saveImageToIndexedDB('background_img', backgroundImage);
    }
    setSubmitMessage('图片已保存！');
    } catch (error) {
      setSubmitMessage('保存图片失败，请重试～');
    }
  };

  // 重置到默认布局
  const handleResetLayout = () => {
    console.log('点击重置按钮，显示确认对话框');
    setShowConfirmDialog(true);
    setConfirmMessage(' 确定要重置到默认布局吗？');
    
    // 设置重置回调函数，使用函数形式避免闭包问题
    setConfirmCallback(() => () => {
      console.log('用户确认重置，执行重置操作');
      
      const defaultNotes = getDefaultNotes();
      
      setNotes(defaultNotes);
      setRecordSection({ x: 0, y: 240 }); // x会在RecordSection组件中重新计算为居中
      setImageBoxes([]);
      setRollingGalleryImages([]);
      setRollingGalleryTitle('✨ 日常注脚 ✨');
      setCustomGalleries([]);
      setSelectedGallery('main');
      setBackgroundImage('/assets/images/2.jpeg');
      setCurrentTheme('blue'); // 重置为奶蓝色主题
      localStorage.removeItem('essayPagePositions');
      
      // 重置后标记为有未保存的更改，这样用户可以保存重置后的布局
      setHasUnsavedChanges(true);
      setSubmitMessage(' 布局已重置！ ');
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
        setSubmitMessage(' 随记提交成功啦！去邮箱查看吧～ ');
      } else {
        setSubmitMessage(' 随记提交失败了，重试一下吧～ ');
      }
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitMessage(' 随记提交失败了，重试一下吧～ ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 更换背景图片
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
          setSubmitMessage(' 背景图片已更换～ ');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 统一的事件处理函数 - 支持鼠标和触摸
  const handlePointerDown = (e, elementType, elementId) => {
    // preventDefault已在组件级别处理，这里不再调用
    
    // 获取正确的坐标（兼容鼠标和触摸）
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedElement({ type: elementType, id: elementId });
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  const handlePointerMove = (e) => {
    if (!draggedElement) return;
    
    // 获取正确的坐标（兼容鼠标和触摸）
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    
    // 使用响应式边界
    const margin = 20 * responsiveScale;
    const noteWidth = 200 * responsiveScale;
    const noteHeight = 80 * responsiveScale;
    
    const maxX = screenSize.width - margin - noteWidth;
    const maxY = screenSize.height - margin - noteHeight;
    
    const clampedX = Math.max(margin, Math.min(newX, maxX));
    const clampedY = Math.max(margin, Math.min(newY, maxY));
    
    if (draggedElement.type === 'note') {
      setNotes(prev => prev.map(note => 
        note.id === draggedElement.id 
          ? { ...note, x: clampedX, y: clampedY }
          : note
      ));
    } else if (draggedElement.type === 'record') {
      setRecordSection({ x: clampedX, y: clampedY });
    } else if (draggedElement.type === 'imageBox') {
      setImageBoxes(prev => prev.map(box => 
        box.id === draggedElement.id 
          ? { ...box, x: clampedX, y: clampedY }
          : box
      ));
    }
  };

  const handlePointerUp = () => {
    if (draggedElement) {
      setDraggedElement(null);
      setDragOffset({ x: 0, y: 0 });
      setHasUnsavedChanges(true);
    }
  };

  // 确认对话框处理
  const handleConfirm = () => {
    console.log('用户点击确定按钮');
    if (confirmCallback) {
      console.log('执行确认回调函数');
      confirmCallback();
    } else {
      console.log('没有确认回调函数');
    }
    setShowConfirmDialog(false);
    setConfirmCallback(null);
  };

  const handleCancel = () => {
    console.log('用户点击取消按钮');
    setShowConfirmDialog(false);
    setConfirmCallback(null);
  };

  // 添加note-box的状态
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [addNoteDialogConfig, setAddNoteDialogConfig] = useState({});
  
  // 删除note-box选择器的状态
  const [showNoteDeleteSelector, setShowNoteDeleteSelector] = useState(false);

  // 添加note-box
  const handleAddNoteBox = () => {
    setAddNoteDialogConfig({
      title: '添加便签',
      placeholder: '请输入便签内容（最多20字）...',
      maxLength: 20,
      onConfirm: (content) => {
        if (content.trim()) {
          // 创建新的note-box
          const newNote = {
            id: Date.now(),
            content: content.trim(),
            x: Math.random() * (window.innerWidth - 300) + 50, // 随机位置
            y: Math.random() * (window.innerHeight - 200) + 50
          };
          
          setNotes(prev => [...prev, newNote]);
          setHasUnsavedChanges(true);
          setSubmitMessage(' 便签已添加～ ');
        }
        setShowAddNoteDialog(false);
      },
      onCancel: () => {
        setShowAddNoteDialog(false);
      }
    });
    setShowAddNoteDialog(true);
  };

  // 删除note-box - 打开选择器
  const handleDeleteNoteBox = () => {
    if (notes.length === 0) {
      setSubmitMessage(' 当前没有便签可删除～ ');
      return;
    }
    
    setShowNoteDeleteSelector(true);
  };
  
  // 批量删除选中的便签
  const handleDeleteSelectedNotes = (selectedNoteIds) => {
    if (selectedNoteIds.length === 0) {
      return;
    }
    
    setNotes(prev => prev.filter(note => !selectedNoteIds.includes(note.id)));
    setHasUnsavedChanges(true);
    setSubmitMessage(` 已删除 ${selectedNoteIds.length} 个便签～ `);
  };
  
  // 关闭便签删除选择器
  const handleCloseNoteDeleteSelector = () => {
    setShowNoteDeleteSelector(false);
  };

  return {
    notes, setNotes,
    recordText, setRecordText,
    isSubmitting, setIsSubmitting,
    submitMessage, setSubmitMessage,
    showConfirmDialog, setShowConfirmDialog,
    confirmMessage, setConfirmMessage,
    confirmCallback, setConfirmCallback,
    hasUnsavedChanges, setHasUnsavedChanges,
    backgroundImage, setBackgroundImage,
    recordSection, setRecordSection,
    draggedElement, setDraggedElement,
    dragOffset, setDragOffset,
    imageBoxes, setImageBoxes,
    rollingGalleryImages, setRollingGalleryImages,
    rollingGalleryTitle, setRollingGalleryTitle,
    customGalleries, setCustomGalleries,
    selectedGallery, setSelectedGallery,
    showGallerySelector, setShowGallerySelector,
    showDeleteGallerySelector, setShowDeleteGallerySelector,
    showDeleteImageSelector, setShowDeleteImageSelector,
    currentTheme, setCurrentTheme,
    saveLayoutToIndexedDB,
    saveImageToIndexedDB,
    deleteImageFromIndexedDB,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleResetLayout,
    handleSaveLayout,
    handleSaveImages,
    handleChangeBackground,
    handleSubmitRecord,
    handleConfirm,
    handleCancel,
    handleAddNoteBox,
    handleDeleteNoteBox,
    showAddNoteDialog,
    addNoteDialogConfig,
    showNoteDeleteSelector,
    handleDeleteSelectedNotes,
    handleCloseNoteDeleteSelector
  };
};