import React, { useState, useEffect } from 'react';
import './EssayPage.css';
import { useEssayState } from './hooks/useEssayState.js';
import { useDragAndDrop } from './hooks/useDragAndDrop.js';
import { useGalleryManagement } from './hooks/useGalleryManagement.js';
import { useImageBoxManagement } from './hooks/useImageBoxManagement.js';

import { GalleryDisplaySection } from './components/Gallery/GalleryDisplaySection.js';
import { ImageBoxes } from './components/ImageBox/ImageBoxes.js';
import { NoteBoxes } from './components/Notes/NoteBoxes.js';
import { RecordSection } from './components/Record/RecordSection.js';

import { BackgroundLayer } from './components/UI/BackgroundLayer/BackgroundLayer.js';
import { ToastMessage } from './components/UI/ToastMessage/ToastMessage.js';
import { ConfirmDialog } from './components/UI/ConfirmDialog/ConfirmDialog.js';
import { InputDialog } from './components/UI/InputDialog/InputDialog.js';
import { ButtonGroup } from './components/UI/ButtonGroup/ButtonGroup.js';
import { ThemeSwitcher } from './components/UI/ThemeSwitcher/ThemeSwitcher.js';

import GallerySelectorModal from './components/GallerySector/GallerySectorModal.js';
import DeleteGallerySelectorModal from './components/GallerySector/DeleteGallerySectorModal.js';
import DeleteImageSelectorModal from './components/ImageCardSector/DeleteImageSelectorModal.js';
import ImageSelectionModal from './components/ImageCardSector/ImageSelectionModal.js';

function EssayPage() {
  // 状态管理
  const state = useEssayState();
  
  // 在useEssayState中添加状态
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputDialogConfig, setInputDialogConfig] = useState({});

  // 处理画册保存
  const handleSaveGallery = async (galleryId, images) => {
    try {
      // 这里可以调用后端API保存画册
      console.log('保存画册:', galleryId, images);
      // 暂时使用本地存储，后续可以改为调用API
      return { success: true };
    } catch (error) {
      console.error('保存画册失败:', error);
      throw error;
    }
  };

  // 处理主题切换
  const handleThemeChange = (newTheme) => {
    state.setCurrentTheme(newTheme);
    state.setHasUnsavedChanges(true);
    // 应用主题到document.body
    document.body.setAttribute('data-theme', newTheme);
  };

  // 组件挂载时应用当前主题
  useEffect(() => {
    document.body.setAttribute('data-theme', state.currentTheme);
  }, [state.currentTheme]);

  // 修改galleryManagement的调用
  const galleryManagement = useGalleryManagement(
    state.setCustomGalleries,
    state.setRollingGalleryImages,
    state.setHasUnsavedChanges,
    state.setSubmitMessage,
    setShowInputDialog,
    setInputDialogConfig,
    state.rollingGalleryImages,
    handleSaveGallery  // 假设你已经定义了这个函数
  );
  
  const imageBoxManagement = useImageBoxManagement(
    state.setImageBoxes,
    state.setHasUnsavedChanges
  );
  
  // 拖拽逻辑
  useDragAndDrop(
    state.draggedElement,
    state.dragOffset,
    state.setHasUnsavedChanges,
    {
      handlePointerMove: state.handlePointerMove,
      handlePointerUp: state.handlePointerUp
    }
  );

  return (
    <div className="essay-page" style={{ minHeight: '1500px' }}>
      {/* 背景层 */}
      <BackgroundLayer
        backgroundImage={state.backgroundImage}
        currentTheme={state.currentTheme}
      />

      {/* 主题切换器 */}
      <ThemeSwitcher
        currentTheme={state.currentTheme}
        onThemeChange={handleThemeChange}
      />

      {/* 按钮区域 */}
      <ButtonGroup
        onResetLayout={state.handleResetLayout}
        onSaveLayout={state.handleSaveLayout}
        onChangeBackground={state.handleChangeBackground}
        onAddImageBox={imageBoxManagement.handleAddImageBox}
        onGalleryImageUpload={() => state.setShowGallerySelector(true)}
        onAddCustomGallery={galleryManagement.addCustomGallery}
        onDeleteGallery={() => state.setShowDeleteGallerySelector(true)}
        onDeleteGalleryImages={() => state.setShowDeleteImageSelector(true)}
      />
      
      {/* 随笔文本框 - 使用统一的函数名 */}
      <NoteBoxes
        notes={state.notes}
        onPointerDown={(e, type, id) => state.handlePointerDown(e, type, id)}
      />
      
      {/* 记录区域 - 使用统一的函数名 */}
      <RecordSection
        recordSection={state.recordSection}
        recordText={state.recordText}
        isSubmitting={state.isSubmitting}
        onPointerDown={(e) => state.handlePointerDown(e, 'record', 'record')}
        onTextChange={state.setRecordText}
        onSubmit={state.handleSubmitRecord}
      />
      
      {/* 图片卡片 - 使用统一的函数名 */}
      <ImageBoxes
        imageBoxes={state.imageBoxes}
        onPointerDown={(e, type, id) => state.handlePointerDown(e, type, id)}
        onImageUpload={imageBoxManagement.handleImageUpload}
        onRemoveImageBox={imageBoxManagement.handleRemoveImageBox}
        onRemoveImage={imageBoxManagement.handleRemoveImage}
      />
      
      {/* 画册展示区域 */}
      <GalleryDisplaySection
        rollingGalleryTitle={state.rollingGalleryTitle}
        rollingGalleryImages={state.rollingGalleryImages}
        customGalleries={state.customGalleries}
      />
      
      {/* 模态框 */}
      <GallerySelectorModal
        showGallerySelector={state.showGallerySelector}
        setShowGallerySelector={state.setShowGallerySelector}
        rollingGalleryTitle={state.rollingGalleryTitle}
        rollingGalleryImages={state.rollingGalleryImages}
        customGalleries={state.customGalleries}
        handleImageUploadToGallery={galleryManagement.handleImageUploadToGallery}
        onSaveGallery={galleryManagement.saveGalleryToBackend}
        setSubmitMessage={state.setSubmitMessage}
      />
      
      <DeleteGallerySelectorModal
        showDeleteGallerySelector={state.showDeleteGallerySelector}
        setShowDeleteGallerySelector={state.setShowDeleteGallerySelector}
        customGalleries={state.customGalleries}
        deleteSelectedGalleries={galleryManagement.deleteSelectedGalleries}
        setSubmitMessage={state.setSubmitMessage}
        onDeleteImages={galleryManagement.deleteGalleryImages}
      />
      
      <DeleteImageSelectorModal
        showDeleteImageSelector={state.showDeleteImageSelector}
        setShowDeleteImageSelector={state.setShowDeleteImageSelector}
        rollingGalleryTitle={state.rollingGalleryTitle}
        rollingGalleryImages={state.rollingGalleryImages}
        customGalleries={state.customGalleries}
        setSubmitMessage={state.setSubmitMessage}
        onDeleteImages={galleryManagement.deleteGalleryImages}
      />
      
      {/* Toast 提示 */}
      {state.submitMessage && <ToastMessage message={state.submitMessage} />}
      
      {/* 确认对话框 */}
      <ConfirmDialog
        show={state.showConfirmDialog}
        message={state.confirmMessage}
        onConfirm={state.handleConfirm}
        onCancel={state.handleCancel}
      />

      {/* 添加输入弹窗 */}
      <InputDialog
        show={showInputDialog}
        title={inputDialogConfig.title}
        placeholder={inputDialogConfig.placeholder}
        onConfirm={inputDialogConfig.onConfirm}
        onCancel={inputDialogConfig.onCancel}
      />
    </div>
  );
}

export default EssayPage;