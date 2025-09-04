export const useImageBoxManagement = (
  setImageBoxes,
  setHasUnsavedChanges
) => {
  // 添加图片框
  const handleAddImageBox = () => {
    const newBox = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200),
      image: null
    };
    setImageBoxes(prev => [...prev, newBox]);
    setHasUnsavedChanges(true);
  };

  // 处理图片上传
  const handleImageUpload = (boxId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBoxes(prev => prev.map(box => 
        box.id === boxId 
          ? { ...box, image: e.target.result }
          : box
      ));
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  // 移除图片框
  const handleRemoveImageBox = (boxId) => {
    setImageBoxes(prev => prev.filter(box => box.id !== boxId));
    setHasUnsavedChanges(true);
  };

  // 移除图片
  const handleRemoveImage = (boxId) => {
    setImageBoxes(prev => prev.map(box => 
      box.id === boxId 
        ? { ...box, image: null }
        : box
    ));
    setHasUnsavedChanges(true);
  };

  return {
    handleAddImageBox,
    handleImageUpload,
    handleRemoveImageBox,
    handleRemoveImage
  };
};