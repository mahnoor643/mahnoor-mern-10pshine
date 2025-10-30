import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import UnlockModal from "./UnlockModal"; 

const SecretNoteCard = ({ 
  title = "Confidential note...", 
  created = "Oct 18, 2025, 07:30 AM", 
  updated = "Oct 19, 2025, 05:00 PM", 
  onEdit, 
  onDelete 
}) => {
  const [showUnlock, setShowUnlock] = useState(false);

  const handleUnlock = (password) => {
    if (password === "12345") { // demo password logic
      alert(`✅ Note "${title}" unlocked!`);
      setShowUnlock(false);
    } else {
      alert("❌ Incorrect password!");
    }
  };

  return (
    <>
      {/* 📝 Note Card */}
      <div className="card note-card p-3 h-100">
        {/* Header */}
        <div className="note-header mb-2 d-flex justify-content-between align-items-center">
          <span className="note-title text-truncate">{title}</span>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-lock"></i>
            <i
              className="bi bi-pencil text-warning cursor-pointer"
              onClick={onEdit}
              title="Edit Note"
              role="button"
            ></i>
            <i
              className="bi bi-trash text-danger cursor-pointer"
              onClick={onDelete}
              title="Delete Note"
              role="button"
            ></i>
          </div>
        </div>

        {/* Secret Box */}
        <div className="secret-box mb-3">
          Secret note - unlock to view
          <button
            className="unlock-btn float-end"
            onClick={() => setShowUnlock(true)}
          >
            Unlock
          </button>
        </div>

        {/* Footer */}
        <div className="note-footer small text-muted">
          Created: {created}
          <br />
          Updated: {updated}
        </div>
      </div>

      {/* 🔐 Unlock Modal */}
      <UnlockModal
        show={showUnlock}
        onClose={() => setShowUnlock(false)}
        onUnlock={handleUnlock}
      />
    </>
  );
};

export default SecretNoteCard;
