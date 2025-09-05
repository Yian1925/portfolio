import React, { useState } from 'react'; 
import './EssayPage.css';
import { useEssayState } from './hooks/useEssayState.js';
import { useDragAndDrop } from './hooks/useDragAndDrop.js';
import { useGalleryManagement } from './hooks/useGalleryManagement.js';
import { useImageBoxManagement } from './hooks/useImageBoxManagement.js';

import { GalleryDisplaySection } from './components/Gallery/GalleryDisplaySection.js';
import { ImageBoxes } from './components/ImageBox/ImageBoxes.js';
// import { ModalComponents } from './components/Models/ModalComponents.js'
import { NoteBoxes } from './components/Notes/NoteBoxes.js';
import { RecordSection } from './components/Record/RecordSection.js';

import { BackgroundLayer } from './components/UI/BackgroundLayer/BackgroundLayer.js';
import { ToastMessage } from './components/UI/ToastMessage/ToastMessage.js';
import { ConfirmDialog } from './components/UI/ConfirmDialog/ConfirmDialog.js';
import { InputDialog } from './components/UI/InputDialog/InputDialog.js';
import { ButtonGroup } from './components/UI/ButtonGroup/ButtonGroup.js';

import GallerySelectorModal from './components/GallerySector/GallerySectorModal.js';
import DeleteGallerySelectorModal from './components/GallerySector/DeleteGallerySectorModal.js';
import DeleteImageSelectorModal from './components/ImageCardSector/DeleteImageSelectorModal.js';

function EssayPage() {
  // 状态管理
  const state = useEssayState();
  
  // 在useEssayState中添加状态
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputDialogConfig, setInputDialogConfig] = useState({});

  // 修改galleryManagement的调用
  const galleryManagement = useGalleryManagement(
    state.setCustomGalleries,
    state.setRollingGalleryImages,
    state.setHasUnsavedChanges,
    state.setSubmitMessage,
    setShowInputDialog,
    setInputDialogConfig
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
      handleMouseDown: state.handleMouseDown,
      handleMouseMove: state.handleMouseMove,
      handleMouseUp: state.handleMouseUp
    }
  );

  return (
    <div className="essay-page" style={{ minHeight: '1500px' }}>
      {/* 背景层 */}
      <BackgroundLayer backgroundImage={state.backgroundImage} />
      
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
      
      {/* 随笔文本框 */}
      <NoteBoxes
        notes={state.notes}
        onMouseDown={(e, type, id) => state.handleMouseDown(e, type, id)}
      />
      
      {/* 记录区域 */}
      <RecordSection
        recordSection={state.recordSection}
        recordText={state.recordText}
        isSubmitting={state.isSubmitting}
        onMouseDown={(e) => state.handleMouseDown(e, 'record', 'record')}
        onTextChange={state.setRecordText}
        onSubmit={state.handleSubmitRecord}
      />
      
      {/* 图片卡片 */}
      <ImageBoxes
        imageBoxes={state.imageBoxes}
        onMouseDown={(e, type, id) => state.handleMouseDown(e, type, id)}
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
      />
      
      <DeleteGallerySelectorModal
        showDeleteGallerySelector={state.showDeleteGallerySelector}
        setShowDeleteGallerySelector={state.setShowDeleteGallerySelector}
        customGalleries={state.customGalleries}
        deleteSelectedGalleries={galleryManagement.deleteSelectedGalleries}
        setSubmitMessage={state.setSubmitMessage}
      />
      
      <DeleteImageSelectorModal
        showDeleteImageSelector={state.showDeleteImageSelector}
        setShowDeleteImageSelector={state.setShowDeleteImageSelector}
        rollingGalleryTitle={state.rollingGalleryTitle}
        rollingGalleryImages={state.rollingGalleryImages}
        customGalleries={state.customGalleries}
        setSubmitMessage={state.setSubmitMessage}
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