import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnlockModal from "./UnlockModal";
import NoteViewModal from "./NoteViewModal";

const SecretNoteCard = ({
  id,
  title = "Confidential note...",
  content = "<p>Hidden content...</p>",
  tags = [],
  created,
  updated,
  passwordHash,
  archived,
  pinned,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onPin,
}) => {
  const [fullNote, setFullNote] = useState(null);

  const [showUnlock, setShowUnlock] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);

  // ✅ Local states to track icon state correctly
  const [isArchived, setIsArchived] = useState(archived);
  const [isPinned, setIsPinned] = useState(pinned);

  const handleUnlock = async (password) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/notes/unlock/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json(); // ✅ get unlocked note data
        console.log("🔍 Unlock API Response:", data);
        setFullNote({
          id: data.note.id,
          title: data.note.title || "Confidential note...",
          content: data.note.note || "<p>No content</p>",
          created: data.note.created_at ? new Date(data.note.created_at).toLocaleString() : "Unknown",
          updated: data.note.updated_at ? new Date(data.note.updated_at).toLocaleString() : "Unknown",
          archived: data.note.archived,
          pinned: data.note.pinned,
        });

        setShowUnlock(false);
        setShowNoteView(true);
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again.", toastStyle);
      } else {
        toast.error("Incorrect password!", toastStyle);
      }
    } catch (err) {
      console.error("Unlock error:", err);
    }
  };

  const toastStyle = {
    position: "top-center",
    autoClose: 2500,
    style: { background: "#09585f", color: "#fff", borderRadius: "10px" },
  };

  return (
    <>
      {/* 🔒 Locked Card */}
      <div className="card note-card p-3 h-100">
        <div className="note-header mb-2 d-flex justify-content-between align-items-center">
          <span className="note-title text-truncate fw-semibold">{title}</span>
        </div>


        <div className="d-flex flex-wrap gap-1 mb-2">
          {/* 🏷️ Tags */}
          {tags.map((tag, index) => (
            <span key={index} className="badge note-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="secret-box mb-3 text-muted">
          Secret note – unlock to view
          <button
            className="unlock-btn float-end"
            onClick={() => setShowUnlock(true)}
          >
            Unlock
          </button>
        </div>



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

      {/* 📝 Note View Modal */}
      {fullNote && (
        <NoteViewModal
          show={showNoteView}
          onClose={() => setShowNoteView(false)}
          note={fullNote}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={() => onArchive(id, fullNote.archived === 1)}
          onUnarchive={() => onUnarchive(id, fullNote.archived === 1)}
          onPin={() => onPin(id, fullNote.pinned === 1)}
        />
      )}


      <ToastContainer />
    </>
  );
};

export default SecretNoteCard;
