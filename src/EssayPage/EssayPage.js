import React, { useState, useEffect } from 'react';
import './EssayPage.css';
import { useEssayState } from './hooks/useEssayState.js';
import { useDragAndDrop } from './hooks/useDragAndDrop.js';
import { useGalleryManagement } from './hooks/useGalleryManagement.js';
import { useImageBoxManagement } from './hooks/useImageBoxManagement.js';

import { GalleryDisplaySection } from './components/Gallery/GalleryDisplaySection.js';
import { ImageBoxes } from './components/ImageBox/ImageBoxes.js';
import { NoteBoxes } from './components/Notes/NoteBoxes.js';
import { NoteDeleteSelector } from './components/Notes/NoteDeleteSelector.js';
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

function EssayPage() {
  // 状态管理
  const state = useEssayState();
  
  // 在useEssayState中添加状态
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputDialogConfig, setInputDialogConfig] = useState({});

  // 处理画册保存
  const handleSaveGallery = async (galleryId, images) => {
    try {
      // 添加参数验证，防止 images 为 undefined
      if (!images || !Array.isArray(images)) {
        console.error('handleSaveGallery: images 参数无效', images);
        state.setSubmitMessage('保存画册失败～');
        return { success: false };
      }
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img) {
          const key = galleryId === 'main'
            ? `rolling_img_${i}`
            : `gallery_${galleryId}_img_${i}`;
          await state.saveImageToIndexedDB(key, img);
        }
      }

      state.setSubmitMessage('画册图片已保存～');
      return { success: true };
    } catch (error) {
      state.setSubmitMessage('保存画册失败～');
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

  // 组件挂载时应用当前主题，避免主题切换时的过渡效果
  useEffect(() => {
    // 立即应用主题，避免默认主题的闪烁
    document.body.setAttribute('data-theme', state.currentTheme);
  }, [state.currentTheme]);

  // galleryManagement的调用
  const galleryManagement = useGalleryManagement(
    state.setCustomGalleries,
    state.setRollingGalleryImages,
    state.setHasUnsavedChanges,
    state.setSubmitMessage,
    setShowInputDialog,
    setInputDialogConfig,
    state.rollingGalleryImages,
    handleSaveGallery,              // 修正：这应该是第8个参数 onSaveGallery
    state.deleteImageFromIndexedDB  // 修正：这应该是第9个参数 deleteImageFromIndexedDB
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

  // 检查是否有用户自定义背景
  const hasCustomBackground = state.backgroundImage &&
    state.backgroundImage !== '/assets/images/2.jpeg' &&
    typeof state.backgroundImage === 'string' &&
    (state.backgroundImage.startsWith('data:') || state.backgroundImage.startsWith('blob:'));

  return (
    <div 
      className={`essay-page ${hasCustomBackground ? 'has-custom-background' : ''}`} 
      style={{ minHeight: '1500px' }}
    >
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
        onDeleteGallery={() => {
          // 检查是否有自定义画册，如果没有则直接显示提示
          if (state.customGalleries.length === 0) {
            state.setSubmitMessage(' 当前没有自定义画册～ ');
            return;
          }
          state.setShowDeleteGallerySelector(true);
        }}
        onDeleteGalleryImages={() => state.setShowDeleteImageSelector(true)}
        onAddNoteBox={state.handleAddNoteBox}
        onDeleteNoteBox={state.handleDeleteNoteBox}
        onThemeChange={handleThemeChange}
        currentTheme={state.currentTheme}
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
        handleImageUploadToGallery={galleryManagement.handleImageUploadToGallery}
        onSaveGallery={handleSaveGallery}
        setSubmitMessage={state.setSubmitMessage}
      />
      
      {/* 模态框 */}
      <GallerySelectorModal
        showGallerySelector={state.showGallerySelector}
        setShowGallerySelector={state.setShowGallerySelector}
        rollingGalleryTitle={state.rollingGalleryTitle}
        rollingGalleryImages={state.rollingGalleryImages}
        customGalleries={state.customGalleries}
        handleImageUploadToGallery={galleryManagement.handleImageUploadToGallery}
        onSaveGallery={handleSaveGallery}
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

      {/* 添加便签输入弹窗 */}
      <InputDialog
        show={state.showAddNoteDialog}
        title={state.addNoteDialogConfig.title}
        placeholder={state.addNoteDialogConfig.placeholder}
        maxLength={state.addNoteDialogConfig.maxLength}
        onConfirm={state.addNoteDialogConfig.onConfirm}
        onCancel={state.addNoteDialogConfig.onCancel}
      />

      {/* 便签删除选择器 */}
      <NoteDeleteSelector
        show={state.showNoteDeleteSelector}
        onClose={state.handleCloseNoteDeleteSelector}
        notes={state.notes}
        onDeleteNotes={state.handleDeleteSelectedNotes}
      />
    </div>
  );
}

export default EssayPage;