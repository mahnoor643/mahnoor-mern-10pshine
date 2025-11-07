import React, { useState } from "react";
import parse from "html-react-parser"; // to render formatted note HTML
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NoteViewModal = ({
  show,
  onClose,
  note,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onPin,
}) => {
  if (!note) return null;

  // ✅ Local state for archive + pin toggle
  const [isArchived, setIsArchived] = useState(note.archived);
  const [isPinned, setIsPinned] = useState(note.pinned);

  const handleArchiveToggle = async () => {
    try {
      if (isArchived) {
        await onUnarchive(note.id);
      } else {
        await onArchive(note.id);
      }
      setIsArchived(!isArchived);
    } catch (err) {
      console.error("Archive toggle failed:", err);
    }
  };

  const handlePinToggle = async () => {
    try {
      await onPin(note.id, isPinned);
      setIsPinned(!isPinned);
    } catch (err) {
      console.error("Pin toggle failed:", err);
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.4)" : "transparent" }}
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="modal-title fw-bold text-dark">{note.title}</h5>
            <div className="d-flex gap-3 align-items-center">

              {/* 📌 Pin / Unpin */}
              <i
                className={`bi ${isPinned ? "bi-pin-angle-fill" : "bi-pin"
                  } text-secondary cursor-pointer`}
                title={isPinned ? "Unpin this note" : "Pin this note"}
                role="button"
                onClick={handlePinToggle}
              ></i>

              {/* ✏️ Edit */}
              <i
                className="bi bi-pencil text-warning cursor-pointer"
                onClick={() => {
                  onClose();
                  onEdit(note);
                }}
                title="Edit Note"
                role="button"
              ></i>

              {/* 🗃️ Archive / Unarchive */}
              <i
                className={`bi ${isArchived ? "bi-archive-fill" : "bi-archive"
                  } text-secondary cursor-pointer`}
                onClick={handleArchiveToggle}
                title={isArchived ? "Unarchive Note" : "Archive Note"}
                role="button"
              ></i>

              {/* 🗑️ Delete */}
              <i
                className="bi bi-trash text-danger cursor-pointer"
                onClick={() => {
                  onClose();
                  onDelete(note.id);
                }}
                title="Delete Note"
                role="button"
              ></i>

              {/* ❌ Close */}
              <button className="btn-close" onClick={onClose}></button>
            </div>
          </div>

          <div className="modal-body">
            <div className="note-content">{parse(note.content || "")}</div>
          </div>

          <div className="modal-footer small text-muted">
            Created: {note.created}
            <br />
            Updated: {note.updated}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
