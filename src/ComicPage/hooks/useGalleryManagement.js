export const useGalleryManagement = (
  setCustomGalleries,
  setRollingGalleryImages,
  setHasUnsavedChanges,
  setSubmitMessage,
  setShowInputDialog,  
  setInputDialogConfig 
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
  const handleImageUploadToGallery = (galleryId, customGalleries) => {
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
            setRollingGalleryImages(prev => [...prev, imageData]);
          } else {
            setCustomGalleries(prev => prev.map(g => 
              g.id === galleryId 
                ? { ...g, images: [...g.images, imageData] }
                : g
            ));
          }
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

  return {
    addCustomGallery,
    handleImageUploadToGallery,
    deleteSelectedGalleries
  };
};