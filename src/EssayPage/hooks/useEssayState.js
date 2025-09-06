import { useState, useEffect } from 'react';

export const useEssayState = () => {
  const getDefaultNotes = () => {
    const screenWidth = window.innerWidth; 
    return [
      { id: 1, content: '请你永远永远，不要再光临我的夏季', x: screenWidth / 2 - 400, y: 60 },
      { id: 2, content: '截停一场未定的秋天', x: screenWidth / 2 + 240, y: 30 },
      { id: 3, content: '与我在世界的角落渺小又清晰地共振', x: screenWidth / 2 - 700, y: 160 },
      { id: 4, content: '无所事事的平静很珍贵', x: screenWidth / 2 - 640, y: 500 },
      { id: 5, content: '我特别特别喜欢散步', x: screenWidth / 2 - 560, y: 330 },
      { id: 6, content: '那些细小幽微的感受也同样值得被描摹', x: screenWidth / 2 - 100, y: 110 },
      { id: 7, content: '世界温和，大道光明', x: screenWidth / 2 - 650, y: 40 },
      { id: 8, content: '梧桐大道', x: screenWidth / 2 + 400, y: 120 }
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
  const [recordSection, setRecordSection] = useState({ x: window.innerWidth / 2 - 300, y: 240 });
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

  // 主题相关状态
  const [currentTheme, setCurrentTheme] = useState('default');

  // 添加屏幕尺寸和响应式缩放状态
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [responsiveScale, setResponsiveScale] = useState(1);

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

  // 加载保存的位置
  useEffect(() => {
    const loadPositions = () => {
      const saved = localStorage.getItem('essayPagePositions');
      if (saved) {
        try {
          const positions = JSON.parse(saved);
          setNotes(positions.notes || getDefaultNotes());
          setRecordSection(positions.recordSection || { x: window.innerWidth / 2 - 200, y: 200 });
          setImageBoxes(positions.imageBoxes || []);
          setRollingGalleryImages(positions.rollingGalleryImages || []);
          setRollingGalleryTitle(positions.rollingGalleryTitle || '✨ 日常注脚 ✨');
          setCustomGalleries(positions.customGalleries || []);
          setSelectedGallery(positions.selectedGallery || 'main');
          setBackgroundImage(positions.backgroundImage || '/assets/images/2.jpeg');
          setCurrentTheme(positions.currentTheme || 'default');
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
      }, 2000);
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
      selectedGallery,
      backgroundImage,
      currentTheme
    };
    localStorage.setItem('essayPagePositions', JSON.stringify(positions));
    setHasUnsavedChanges(false);
  };

  // 保存布局
  const handleSaveLayout = () => {
    if (!hasUnsavedChanges) {
      setSubmitMessage(' 当前布局无改动噢～ ');
      return;
    }
    savePositions();
    setSubmitMessage(' 自定义布局已保存！');
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
      setRecordSection({ x: window.innerWidth / 2 - 300, y: 240 });
      setImageBoxes([]);
      setRollingGalleryImages([]);
      setRollingGalleryTitle('✨ 日常注脚 ✨');
      setCustomGalleries([]);
      setSelectedGallery('main');
      setBackgroundImage('/assets/images/2.jpeg');
      setCurrentTheme('blue'); // 重置为奶蓝色主题
      localStorage.removeItem('essayPagePositions');
      setHasUnsavedChanges(false);
      setSubmitMessage(' 布局已重置！');
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
    e.preventDefault();
    
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
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleResetLayout,
    handleSaveLayout,
    handleChangeBackground,
    handleSubmitRecord,
    handleConfirm,
    handleCancel
  };
};