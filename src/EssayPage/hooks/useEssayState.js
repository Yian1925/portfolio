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

  const handleMouseUp = () => {
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
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResetLayout,
    handleSaveLayout,
    handleChangeBackground,
    handleSubmitRecord,
    handleConfirm,
    handleCancel
  };
};