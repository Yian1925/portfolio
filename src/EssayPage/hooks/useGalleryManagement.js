export const useGalleryManagement = (
  setCustomGalleries,
  setRollingGalleryImages,
  setHasUnsavedChanges,
  setSubmitMessage,
  setShowInputDialog,  
  setInputDialogConfig,
  rollingGalleryImages,
  onSaveGallery,
  deleteImageFromIndexedDB
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
  const deleteSelectedGalleries = async (selectedIds, customGalleries) => {
    // 找到要删除的图册
    const galleriesToDelete = customGalleries.filter(gallery => selectedIds.includes(gallery.id));
    // 删除数据库中的图片
    for (const gallery of galleriesToDelete) {
      if (gallery && Array.isArray(gallery.images)) {
        for (let i = 0; i < gallery.images.length; i++) {
          await deleteImageFromIndexedDB(`gallery_${gallery.id}_img_${i}`);
        }
      }
    }
    // 删除内存中的图册
    setCustomGalleries(prev => prev.filter(gallery => !selectedIds.includes(gallery.id)));
    setHasUnsavedChanges(true);
    setSubmitMessage(' 选中的图册已删除～ ');
  };

  // 保存画册到后端
  const saveGalleryToBackend = async (galleryId, images) => {
    try {
      // 添加参数验证
      if (!galleryId || !images || !Array.isArray(images)) {
        console.error('saveGalleryToBackend: 参数无效', { galleryId, images });
        return;
      }
      
      await onSaveGallery(galleryId, images);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('保存画册失败:', error);
      throw error;
    }
  };

  // 删除指定画册的图片
  const deleteGalleryImages = async (galleryId, imageIndexes) => {
    // 添加参数验证
    if (!galleryId || !imageIndexes || !Array.isArray(imageIndexes)) {
      console.error('deleteGalleryImages: 参数无效', { galleryId, imageIndexes });
      return;
    }

    console.log('deleteGalleryImages 调用参数:', { galleryId, imageIndexes });
    // 删除内存中的图片
    if (galleryId === 'main') {
      setRollingGalleryImages(prev => 
        prev.filter((_, index) => !imageIndexes.includes(index))
      );
      // 删除数据库中的图片
      for (const index of imageIndexes) {
        await deleteImageFromIndexedDB(`rolling_img_${index}`);
      }
    } else {
      setCustomGalleries(prev => prev.map(gallery => 
        gallery.id === galleryId 
          ? { 
              ...gallery, 
              images: gallery.images && Array.isArray(gallery.images)
                ? gallery.images.filter((_, index) => !imageIndexes.includes(index))
                : []
            }
          : gallery
      ));
      // 删除数据库中的图片
      for (const index of imageIndexes) {
        await deleteImageFromIndexedDB(`gallery_${galleryId}_img_${index}`);
      }
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