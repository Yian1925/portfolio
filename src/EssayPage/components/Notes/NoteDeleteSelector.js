import React, { useState, useEffect } from 'react';
import './NoteDeleteSelector.css';

export const NoteDeleteSelector = ({ 
  show, 
  onClose, 
  notes, 
  onDeleteNotes 
}) => {
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  
  const notesPerPage = 6; // 每页显示6个便签
  const totalPages = Math.ceil(notes.length / notesPerPage);
  
  // 计算当前页的便签
  const startIndex = (currentPage - 1) * notesPerPage;
  const currentNotes = notes.slice(startIndex, startIndex + notesPerPage);
  
  // 重置状态
  useEffect(() => {
    if (show) {
      setSelectedNotes(new Set());
      setCurrentPage(1);
      setSelectAll(false);
    }
  }, [show]);
  
  // 处理单个便签选择
  const handleNoteSelect = (noteId) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId);
    } else {
      newSelected.add(noteId);
    }
    setSelectedNotes(newSelected);
    
    // 更新全选状态
    setSelectAll(newSelected.size === currentNotes.length);
  };
  
  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      // 取消全选当前页
      const newSelected = new Set(selectedNotes);
      currentNotes.forEach(note => newSelected.delete(note.id));
      setSelectedNotes(newSelected);
      setSelectAll(false);
    } else {
      // 全选当前页
      const newSelected = new Set(selectedNotes);
      currentNotes.forEach(note => newSelected.add(note.id));
      setSelectedNotes(newSelected);
      setSelectAll(true);
    }
  };
  
  // 处理删除
  const handleDelete = () => {
    if (selectedNotes.size === 0) {
      return;
    }
    
    const selectedNotesArray = Array.from(selectedNotes);
    onDeleteNotes(selectedNotesArray);
    onClose();
  };
  
  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectAll(false); // 切换页面时重置全选状态
  };
  
  if (!show) return null;
  
  return (
    <div className="note-delete-overlay">
      <div className="note-delete-modal">
        <div className="note-delete-header">
          <h3 className="modal-title">选择要删除的便签</h3>
        </div>
        
        <div className="note-delete-content">
          {notes.length === 0 ? (
            <div className="no-notes">
              <p>当前没有便签可删除</p>
            </div>
          ) : (
            <>
              <div className="select-controls">
                <label className="select-all-checkbox">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span>全选</span>
                </label>
              </div>
              
              <div className="notes-grid">
                {currentNotes.map(note => (
                  <div
                    key={note.id}
                    className={`note-item ${selectedNotes.has(note.id) ? 'selected' : ''}`}
                    onClick={() => handleNoteSelect(note.id)}
                  >
                    <div className="note-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedNotes.has(note.id)}
                        onChange={() => handleNoteSelect(note.id)}
                      />
                    </div>
                    <div className="note-preview">
                      <span className="note-text">{note.content}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    上一页
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`page-number ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="note-delete-footer">
          <button
            className="modal-btn"
            disabled={selectedNotes.size === 0}
            onClick={handleDelete}
          >
            删除
          </button>
            <button className="modal-btn" onClick={onClose}>
              取消
            </button>
        </div>
      </div>
    </div>
  );
};
