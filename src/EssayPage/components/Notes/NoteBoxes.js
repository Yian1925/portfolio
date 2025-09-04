import React from 'react';

export const NoteBoxes = ({ notes, onMouseDown }) => {
  return (
    <>
      {notes.map(note => (
        <div
          key={note.id}
          className="note-box"
          style={{
            position: 'absolute',
            left: note.x,
            top: note.y,
            cursor: 'grab',
            userSelect: 'none',
            zIndex: 300
          }}
          onMouseDown={(e) => onMouseDown(e, 'note', note.id)}
        >
          <div className="note-content">
            {note.content}
          </div>
        </div>
      ))}
    </>
  );
};