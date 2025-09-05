export const useGalleryManagement = (
  setCustomGalleries,
  setRollingGalleryImages,
  setHasUnsavedChanges,
  setSubmitMessage,
  setShowInputDialog,  
  setInputDialogConfig,
  rollingGalleryImages,
  onSaveGallery
) => {
  // 添加自定义图册
  const addCustomGallery = () => {
    // 显示自定义输入弹窗
    setInputDialogConfig({
      title: '创建新图册',
      placeholder: '请输入图册名称...',
      onConfirm: (galleryName) => {
        const newGallery = {
          id: Date.now(),
          title: galleryName,
          images: []
        };
        setCustomGalleries(prev => [...prev, newGallery]);
        setHasUnsavedChanges(true);
        setSubmitMessage(' 自定义图册已添加～ ');
        setShowInputDialog(false);
      },
      onCancel: () => {
        setShowInputDialog(false);
      }
    });
    setShowInputDialog(true);
  };

  // 处理图片上传到图册
  const handleImageUploadToGallery = (galleryId, customGalleries, currentRollingGalleryImages = []) => {
    // 检查当前画册的图片数量
    let currentImageCount = 0;
    if (galleryId === 'main') {
      currentImageCount = currentRollingGalleryImages.length;
    } else {
      const gallery = customGalleries.find(g => g.id === galleryId);
      currentImageCount = gallery ? gallery.images.length : 0;
    }

    // 如果已经达到10张，显示提示并返回
    if (currentImageCount >= 10) {
      setSubmitMessage(' 画册图片数量已达上限～ ');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const remainingSlots = 10 - currentImageCount;
      
      // 限制上传的图片数量
      const filesToUpload = files.slice(0, remainingSlots);
      
      if (files.length > remainingSlots) {
        setSubmitMessage(` 只能上传${remainingSlots}张图片哦～ `);
      }
      
      filesToUpload.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target.result;
          
          if (galleryId === 'main') {
            setRollingGalleryImages(prev => [...prev, imageData]);
          } else {
            setCustomGalleries(prev => prev.map(g => 
              g.id === galleryId 
                ? { ...g, images: [...g.images, imageData] }
                : g
            ));
          }
          setHasUnsavedChanges(true);
        };
        reader.readAsDataURL(file);
      });
    };
    
    input.click();
  };

  // 删除选中的图册
  const deleteSelectedGalleries = (selectedIds) => {
    setCustomGalleries(prev => prev.filter(gallery => !selectedIds.includes(gallery.id)));
    setHasUnsavedChanges(true);
    setSubmitMessage(' 选中的图册已删除～ ');
  };

  // 保存画册到后端
  const saveGalleryToBackend = async (galleryId, images) => {
    try {
      await onSaveGallery(galleryId, images);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('保存画册失败:', error);
      throw error;
    }
  };

  // 删除指定画册的图片
  const deleteGalleryImages = (galleryId, imageIndexes) => {
    if (galleryId === 'main') {
      setRollingGalleryImages(prev => 
        prev.filter((_, index) => !imageIndexes.includes(index))
      );
    } else {
      setCustomGalleries(prev => prev.map(gallery => 
        gallery.id === galleryId 
          ? { 
              ...gallery, 
              images: gallery.images.filter((_, index) => !imageIndexes.includes(index))
            }
          : gallery
      ));
    }
    setHasUnsavedChanges(true);
    setSubmitMessage(' 图片删除成功～ ');
  };

  return {
    addCustomGallery,
    handleImageUploadToGallery,
    deleteSelectedGalleries,
    saveGalleryToBackend,
    deleteGalleryImages
  };
};